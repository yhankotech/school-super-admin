import { Eye } from "lucide-react";
import { Teacher } from "../types/teacher";

type TeacherTableProps = {
  teachers: Teacher[];
  onSelectTeacher: (teacher: Teacher) => void;
};

export function TeacherTable({ teachers, onSelectTeacher }: TeacherTableProps) {
  return (
    <div className="bg-card rounded-lg shadow-lg overflow-hidden animate-scale-in border border-border/50">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left py-4 px-6 font-semibold text-foreground">
                Nome
              </th>
              <th className="text-left py-4 px-6 font-semibold text-foreground">
                Escola
              </th>
              <th className="text-left py-4 px-6 font-semibold text-foreground">
                Nº Encarregado
              </th>
              <th className="text-left py-4 px-6 font-semibold text-foreground">
                Nº alunos
              </th>
              <th className="text-left py-4 px-6 font-semibold text-foreground">
                Status
              </th>
              <th className="text-center py-4 px-6 font-semibold text-foreground">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher, index) => (
              <tr
                key={teacher.id}
                className="border-b border-border hover:bg-muted/30 transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="py-4 px-6">
                  <div className="font-medium text-foreground">{teacher.name}</div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-foreground">{teacher.schoolName}</div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-foreground">{teacher.totalParents}</div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm text-foreground space-y-1">
                    {teacher.totalStudents}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      teacher.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {teacher.isActive ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="py-4 px-6 text-center">
                  <button
                    onClick={() => onSelectTeacher(teacher)}
                    className="inline-flex items-center justify-center p-2 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <Eye className="h-4 w-4 text-slate-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {teachers.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          Nenhum professor encontrado
        </div>
      )}
    </div>
  );
}
