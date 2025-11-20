export type TeacherAction = {
  id: string;
  type: "login" | "logout" | "password_change" | "profile_update";
  timestamp: Date;
  description: string;
};

export type Teacher = {
  id: string;
  name: string;
  email: string;
  schoolId: string;
  schoolName: string;
  totalParents: number;
  totalStudents: number;
  enrollmentDate: Date;
  isActive: boolean;
  lastLogin?: Date;
  actions: TeacherAction[];
};
