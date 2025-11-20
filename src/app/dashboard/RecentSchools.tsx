
import { 
  Building2
} from 'lucide-react';
const recentSchools = [
    { id: 1, name: "Escola Primária ABC", studentsCount: 350, teachersCount: 25, status: "active" },
    { id: 2, name: "Colégio XYZ", studentsCount: 500, teachersCount: 40, status: "blocked" },
    { id: 3, name: "Instituto Educacional LMN", studentsCount: 200, teachersCount: 15, status: "inactive" },
    { id: 4, name: "Escola Secundária QRS", studentsCount: 450, teachersCount: 30, status: "active" },
    { id: 5, name: "Centro de Ensino TUV", studentsCount: 300, teachersCount: 20, status: "active" }
  ];
export function RecentSchools() {
    return (
    <div className="grid gap-6 lg:grid-cols-2 mt-10">
        <div className="animate-fade-in" style={{ animationDelay: "0.8s" }}>
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
                  Escolas Recentes
              </div>
              <div>Últimas escolas cadastradas no sistema</div>
            </div>
            <div>
              <div className="space-y-4">
                {recentSchools.map((school, index) => (
                  <div key={school.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors animate-fade-in" style={{ animationDelay: `${0.9 + index * 0.1}s` }}>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{school.name}</p>
                      <p className="text-sm text-muted-foreground">{school.studentsCount} alunos • {school.teachersCount} professores</p>
                    </div>
                    <div
                      className={
                        school.status === "active"
                          ? "px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"
                          : school.status === "blocked"
                          ? "px-2 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-800"
                          : "px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800"
                      }
                    >
                      {school.status === "active" ? "Ativa" : school.status === "blocked" ? "Bloqueada" : "Inativa"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
      </div>
    )
}