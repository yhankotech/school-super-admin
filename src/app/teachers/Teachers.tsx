import React, { useState } from "react";
import { Search, Eye } from "lucide-react";

type Teachers = {
  id: string;
  name: string;
  schoolId: string;
  schoolName: string;
  totalParents: number;
  totalStudents: number;
  enrollmentDate: Date;
};

const mockStudents: Teachers[] = [
  {
    id: "1",
    name: "João Silva",
    schoolId: "school-1",
    schoolName: "Escola Exemplo",
    totalParents: 20,
    totalStudents: 20,
    enrollmentDate: new Date("2022-03-15"),
  },
  {
    id: "2",
    name: "João Silva",
    schoolId: "school-1",
    schoolName: "Escola Exemplo",
    totalParents: 20,
       totalStudents: 20,
    enrollmentDate: new Date("2022-03-15"),
  },
];

export function Teachers() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = mockStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.totalParents.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pl-6 pr-6 animate-fade-in">
      <div className="max-w-[1600px] mx-auto">
        <header className="mb-8 animate-slide-down">
          <h1 className="text-4xl font-bold mb-2 text-black">
            Gestão de Professores
          </h1>
        </header>

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

        <div className="bg-card rounded-lg shadow-lg overflow-hidden animate-scale-in border border-border/50">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Nome</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Escola</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Nº Encarregado</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Nº alunos</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Status</th>
                  <th className="text-center py-4 px-6 font-semibold text-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => (
                  <tr
                    key={student.id}
                    className="border-b border-border hover:bg-muted/30 transition-colors animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="py-4 px-6">
                      <div className="font-medium text-foreground">{student.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Matrícula desde {student.enrollmentDate.toLocaleDateString("pt-AO")}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-foreground">{student.schoolName}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-foreground">{student.totalParents}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-foreground space-y-1">
                        {student.totalStudents}
                      </div>
                    </td>
                        <td className="py-4 px-6">
                      <div className="text-sm text-foreground space-y-1">
                        ativo
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        className="hover:bg-primary/10"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredStudents.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Nenhum estudante encontrado
            </div>
          )}
        </div>

        <div className="mt-6 text-sm text-muted-foreground animate-fade-in">
          Total de estudantes: {filteredStudents.length}
        </div>
      </div>
    </div>
  );
}