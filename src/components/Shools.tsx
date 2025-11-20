import { ReactNode, useState } from "react";
import { Building2, Search, Eye, Ban, Trash2, GraduationCap } from "lucide-react";

type School = {
  staffCount: ReactNode;
  id: string;
  name: string;
  code: string;
  director?: string;
  address?: string;
  phone?: string;
  email?: string;
  status: "active" | "blocked" | "inactive";
  studentsCount: number;
  teachersCount: number;
  monthlyRevenue: number;
};

const mockSchools: School[] = [
  {
      id: "s1",
      name: "Dom Bosco",
      code: "001",
      director: "Padre",
      address: "Rua A",
      phone: "99999-0000",
      email: "contato@escolacentral.edu",
      status: "active",
      studentsCount: 850,
      teachersCount: 45,
      monthlyRevenue: 1250,
      staffCount: 50
  },
  {
      id: "s2",
      name: "Escola Norte",
      code: "002",
      director: "João Silva",
      address: "Av.456",
      phone: "98888-1111",
      email: "contato@escolanorte.edu",
      status: "blocked",
      studentsCount: 600,
      teachersCount: 30,
      monthlyRevenue: 90000,
      staffCount: 90
  }
];

export function SchoolsList() {
  const [schools, setSchools] = useState<School[]>(mockSchools);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [actionType, setActionType] = useState<"block" | "delete" | null>(null);

  const filteredSchools = schools.filter(school =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (school.director || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBlockSchool = (school: School) => {
    setSelectedSchool(school);
    setActionType("block");
  };

  const handleDeleteSchool = (school: School) => {
    setSelectedSchool(school);
    setActionType("delete");
  };

  const confirmAction = () => {
    if (!selectedSchool) return;

    if (actionType === "block") {
      setSchools(schools.map(s =>
        s.id === selectedSchool.id
          ? { ...s, status: s.status === "blocked" ? "active" : "blocked" }
          : s
      ));
      alert(
        selectedSchool.status === "blocked"
          ? `Escola ${selectedSchool.name} desbloqueada com sucesso!`
          : `Escola ${selectedSchool.name} bloqueada com sucesso!`
      );
    } else if (actionType === "delete") {
      setSchools(schools.filter(s => s.id !== selectedSchool.id));
      alert(`Escola ${selectedSchool.name} removida com sucesso!`);
    }

    setSelectedSchool(null);
    setActionType(null);
  };

  const getStatusBadge = (status: School["status"]) => {
    const variants = {
      active: { variant: "default" as const, label: "Ativa" },
      blocked: { variant: "destructive" as const, label: "Bloqueada" },
      inactive: { variant: "secondary" as const, label: "Inativa" }
    };
    return variants[status];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto p-6 space-y-6 animate-fade-in">
        {/* Stats Summary */}
        <div className="grid gap-4 md:grid-cols-3 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div>
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="text-sm font-medium">Escolas Ativas</div>
              <Building2 className="h-4 w-4 text-green-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">{schools.filter(s => s.status === "active").length}</div>
            </div>
          </div>
          <div>
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="text-sm font-medium">Escolas Bloqueadas</div>
              <Ban className="h-4 w-4 text-destructive" />
            </div>
            <div>
              <div className="text-2xl font-bold">{schools.filter(s => s.status === "blocked").length}</div>
            </div>
          </div>
          <div>
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="text-sm font-medium">Total de Alunos</div>
              <GraduationCap className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{schools.reduce((sum, s) => sum + s.studentsCount, 0)}</div>
            </div>
          </div>
        </div>
        <div className="mb-6">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Buscar escolas por nome ou código..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                />
            </div>
        </div>

        {/* Schools List */}
       {/* Schools Table */}
        <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full border-[1px] border-gray-200 rounded-lg">
                <thead>
                  <tr className="border-b border-border border-[1px] border-gray-200 rounded-lg bg-muted/50">
                    <th className="text-left p-4 font-semibold text-foreground">Escola</th>
                    <th className="text-left p-4 font-semibold text-foreground">Local</th>
                    <th className="text-left p-4 font-semibold text-foreground">Código</th>
                    <th className="text-left p-4 font-semibold text-foreground">Status</th>
                    <th className="text-left p-4 font-semibold text-foreground">Diretor</th>
                    <th className="text-left p-4 font-semibold text-foreground">Contato</th>
                    <th className="text-left p-4 font-semibold text-foreground">E-mail</th>
                    <th className="text-center p-4 font-semibold text-foreground">Alunos</th>
                    <th className="text-center p-4 font-semibold text-foreground">Professores</th>
                    <th className="text-center p-4 font-semibold text-foreground">Funcionários</th>
                    <th className="text-center p-4 font-semibold text-foreground">Receita Mensal</th>
                    <th className="text-center p-4 font-semibold text-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody className="border-[1px] border-gray-200">
                  {filteredSchools.map((school, index) => {
                    const statusInfo = getStatusBadge(school.status);
                    return (
                      <tr 
                        key={school.id} 
                        className="border-b border-border hover:bg-muted/50 transition-colors animate-fade-in"
                        style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                      >
                        <td className="p-4">
                          <div>
                            <p className="font-semibold text-foreground">{school.name}</p>
                          </div>
                        </td>

                        <td className="p-4">
                          <div>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                              {school.address}
                            </p>
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="font-mono text-sm text-foreground">{school.code}</span>
                        </td>
                        <td className="p-4">
                          <span className={statusInfo.variant}>{statusInfo.label}</span>
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-foreground">{school.director}</p>
                        </td>
                        <td className="p-4">
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              {school.phone}
                            </p>
                        </td>
                        <td className="p-4">
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              {school.email}
                            </p>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-semibold text-foreground">{school.studentsCount}</span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-semibold text-foreground">{school.teachersCount}</span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-semibold text-foreground">{school.staffCount}</span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-semibold text-foreground">
                              {(school.monthlyRevenue / 1000).toFixed(0)}k
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2 justify-center">
                              <button title="Ver detalhes">
                                <Eye className="h-4 w-4" />
                              </button>
                            <button
                              onClick={() => handleBlockSchool(school)}
                              className={school.status === "blocked" ? "text-green-600" : "text-orange-600"}
                              title={school.status === "blocked" ? "Desbloquear" : "Bloquear"}
                            >
                              <Ban className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteSchool(school)}
                              className="text-destructive"
                              title="Remover escola"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {filteredSchools.length === 0 && (
          <div className="animate-fade-in">
            <div className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-foreground">Nenhuma escola encontrada</p>
              <p className="text-sm text-muted-foreground">Tente ajustar os filtros de busca</p>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      {selectedSchool && actionType && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="text-lg font-semibold mb-2">
              {actionType === "block"
                ? selectedSchool.status === "blocked"
                  ? "Desbloquear Escola"
                  : "Bloquear Escola"
                : "Remover Escola"}
            </div>
            <div className="text-sm text-muted-foreground mb-4">
              {actionType === "block"
                ? selectedSchool.status === "blocked"
                  ? `Tem certeza que deseja desbloquear a escola "${selectedSchool.name}"? A escola voltará a ter acesso total à plataforma.`
                  : `Tem certeza que deseja bloquear a escola "${selectedSchool.name}"? Isso impedirá o acesso de todos os usuários vinculados a esta escola.`
                : `Tem certeza que deseja remover a escola "${selectedSchool.name}"? Esta ação não pode ser desfeita.`}
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => { setSelectedSchool(null); setActionType(null); }}>Cancelar</button>
              <button onClick={confirmAction} className={actionType === "delete" ? "bg-destructive hover:bg-destructive/90" : ""}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
