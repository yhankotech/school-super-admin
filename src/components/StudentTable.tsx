import { Eye } from "lucide-react";
import { Student } from "../types/student";
import { Badge } from "./Badge";

type StudentTableProps = {
  students: Student[];
  onSelectStudent: (student: Student) => void;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
  }).format(value);
}

function getPaymentStatus(student: Student) {
  if (student.overduePayments > 0) {
    return <Badge variant="destructive">Em Atraso</Badge>;
  }
  if (student.paidPayments === student.totalPayments) {
    return <Badge variant="success">Em Dia</Badge>;
  }
  return <Badge variant="secondary">Parcial</Badge>;
}

export function StudentTable({ students, onSelectStudent }: StudentTableProps) {
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
                Turma/Classe
              </th>
              <th className="text-left py-4 px-6 font-semibold text-foreground">
                Encarregado
              </th>
              <th className="text-left py-4 px-6 font-semibold text-foreground">
                Professores
              </th>
              <th className="text-left py-4 px-6 font-semibold text-foreground">
                Pagamentos Feitos
              </th>
              <th className="text-left py-4 px-6 font-semibold text-foreground">
                Em Atraso
              </th>
              <th className="text-center py-4 px-6 font-semibold text-foreground">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr
                key={student.id}
                className="border-b border-border hover:bg-muted/30 transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="py-4 px-6">
                  <div className="font-medium text-foreground">{student.name}</div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-foreground">{student.schoolName}</div>
                </td>
                <td className="py-4 px-6">
                  <div className="font-medium text-foreground">{student.class}</div>
                  <div className="text-sm text-muted-foreground">
                    {student.grade}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-foreground">{student.parentName}</div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm text-foreground space-y-1">
                    {student.teachers.map((teacher, idx) => (
                      <div key={idx}>{teacher}</div>
                    ))}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="font-medium text-green-600">
                    {formatCurrency(student.paidPayments)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    de {formatCurrency(student.totalPayments)}
                  </div>
                </td>
                <td className="py-4 px-6">{getPaymentStatus(student)}</td>
                <td className="py-4 px-6 text-center">
                  <button
                    onClick={() => onSelectStudent(student)}
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
      {students.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          Nenhum estudante encontrado
        </div>
      )}
    </div>
  );
}
