export type StudentAction = {
  id: string;
  type: "login" | "logout" | "password_change" | "profile_update";
  timestamp: Date;
  description: string;
};

export type Student = {
  id: string;
  name: string;
  schoolId: string;
  schoolName: string;
  class: string;
  grade: string;
  parentName: string;
  teachers: string[];
  paidPayments: number;
  totalPayments: number;
  overduePayments: number;
  enrollmentDate: Date;
  lastLogin?: Date;
  actions: StudentAction[];
};