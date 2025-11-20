import { Student } from "../types/student";

export const mockStudents: Student[] = [
  {
    id: "1",
    name: "João Silva",
    schoolId: "school-1",
    schoolName: "Escola Exemplo",
    class: "A",
    grade: "10º Ano",
    parentName: "Maria Silva",
    teachers: ["Prof. António", "Prof.ª Ana"],
    paidPayments: 50000,
    totalPayments: 60000,
    overduePayments: 10000,
    enrollmentDate: new Date("2022-03-15"),
    lastLogin: new Date("2025-11-20T08:30:00"),
    actions: [
      {
        id: "a1",
        type: "login",
        timestamp: new Date("2025-11-20T08:30:00"),
        description: "Login realizado com sucesso",
      },
      {
        id: "a2",
        type: "password_change",
        timestamp: new Date("2025-11-15T14:20:00"),
        description: "Senha alterada",
      },
      {
        id: "a3",
        type: "logout",
        timestamp: new Date("2025-11-19T17:45:00"),
        description: "Logout realizado",
      },
      {
        id: "a4",
        type: "profile_update",
        timestamp: new Date("2025-11-10T10:15:00"),
        description: "Perfil atualizado",
      },
    ],
  },
];
