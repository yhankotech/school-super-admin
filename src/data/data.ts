import { Teacher } from "../types/teacher";

export const mockTeachers: Teacher[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao.silva@escola.ao",
    schoolId: "school-1",
    schoolName: "Escola Exemplo",
    totalParents: 20,
    totalStudents: 20,
    enrollmentDate: new Date("2022-03-15"),
    isActive: true,
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
  {
    id: "2",
    name: "Maria Santos",
    email: "maria.santos@escola.ao",
    schoolId: "school-1",
    schoolName: "Escola Exemplo",
    totalParents: 15,
    totalStudents: 18,
    enrollmentDate: new Date("2023-01-10"),
    isActive: false,
    lastLogin: new Date("2025-10-05T16:20:00"),
    actions: [
      {
        id: "a5",
        type: "logout",
        timestamp: new Date("2025-10-05T16:20:00"),
        description: "Logout realizado",
      },
      {
        id: "a6",
        type: "login",
        timestamp: new Date("2025-10-05T09:00:00"),
        description: "Login realizado com sucesso",
      },
    ],
  },
];
