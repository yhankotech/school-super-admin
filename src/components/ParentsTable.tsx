import { Eye } from "lucide-react";
import { Parent } from "../types/parents";
import { Badge } from "./Badge";

type ParentsTableProps = {
  parents: Parent[];
  onSelectParent: (parent: Parent) => void;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
  }).format(value);
}

function getPaymentStatus(student: Parent) {
  if (student.overduePayments > 0) {
    return <Badge variant="destructive">Em Atraso</Badge>;
  }
  if (student.paidPayments === student.totalPayments) {
    return <Badge variant="success">Em Dia</Badge>;
  }
  return <Badge variant="secondary">Parcial</Badge>;
}

export function ParentsTable({ parents, onSelectParent }: ParentsTableProps) {
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
                Filhos
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
            {parents.map((parent, index) => (
              <tr
                key={parent.id}
                className="border-b border-border hover:bg-muted/30 transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="py-4 px-6">
                  <div className="font-medium text-foreground">{parent.name}</div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-foreground">{parent.schoolName}</div>
                </td>
                <td className="py-4 px-6">
                  <div className="font-medium text-foreground">{parent.class}</div>
                  <div className="text-sm text-muted-foreground">
                    {parent.grade}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-foreground">{parent.parentName}</div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm text-foreground space-y-1">
                    {parent.teachers.map((teacher, idx) => (
                      <div key={idx}>{teacher}</div>
                    ))}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="font-medium text-green-600">
                    {formatCurrency(parent.paidPayments)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    de {formatCurrency(parent.totalPayments)}
                  </div>
                </td>
                <td className="py-4 px-6">{getPaymentStatus(parent)}</td>
                <td className="py-4 px-6 text-center">
                  <button
                    onClick={() => onSelectParent(parent)}
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
      {parents.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          Nenhum estudante encontrado
        </div>
      )}
    </div>
  );
}
