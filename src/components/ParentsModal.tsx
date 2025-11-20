import { X } from "lucide-react";
import { Parent, ParentsAction } from "../types/parents";

type ParentsModalProps = {
  parent: Parent | null;
  onClose: () => void;
};


function getActionIcon(type: ParentsAction["type"]) {
  switch (type) {
    case "login":
      return "🔓";
    case "logout":
      return "🔒";
    case "password_change":
      return "🔑";
    case "profile_update":
      return "✏️";
    default:
      return "📝";
  }
}

export function ParentsModal({ parent, onClose }: ParentsModalProps) {
  if (!parent) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">
            Detalhes do Encarregado
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-slate-600" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <label className="text-sm font-medium text-slate-500">Nome</label>
              <p className="text-lg font-semibold text-slate-900">
                {parent.name}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500">Escola</label>
              <p className="text-lg text-slate-900">{parent.schoolName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500">Turma</label>
              <p className="text-lg text-slate-900">{parent.class}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500">Série</label>
              <p className="text-lg text-slate-900">{parent.grade}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500">
                Encarregado de Educação
              </label>
              <p className="text-lg text-slate-900">{parent.parentName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500">
                Data de Matrícula
              </label>
              <p className="text-lg text-slate-900">
                {parent.enrollmentDate.toLocaleDateString("pt-AO")}
              </p>
            </div>
            <div>
            <label className="text-sm font-medium text-slate-500">
                Último Login
              </label>
              <p className="text-lg text-slate-900">
                {parent.lastLogin
                  ? parent.lastLogin.toLocaleString("pt-AO")
                  : "Nunca"}
              </p>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6 mb-8">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              Professores
            </h3>
            <div className="space-y-2">
              {parent.teachers.map((parents, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 rounded-lg text-slate-900"
                >
                  {parents}
                </div>
              ))}
            </div>
          </div>
                    <div className="border-t border-slate-200 pt-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              Histórico de Ações
            </h3>
            <div className="space-y-3">
              {parent.actions
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                .map((action) => (
                  <div
                    key={action.id}
                    className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="text-2xl">{getActionIcon(action.type)}</div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">
                        {action.description}
                      </p>
                      <p className="text-sm text-slate-500">
                        {action.timestamp.toLocaleString("pt-AO", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
            {parent.actions.length === 0 && (
              <p className="text-center text-slate-500 py-8">
                Nenhuma ação registrada
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}