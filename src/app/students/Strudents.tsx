import React, { useState } from "react";
import { Search } from "lucide-react";
import { Student } from "../../types/student";
import { mockStudents } from "../../data/studentData";
import { StudentTable } from "../../components/StudentTable";
import { StudentModal } from "../../components/StudentModal";

export function Students() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const filteredStudents = mockStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.parentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pl-6 pr-6 animate-fade-in">
      <div className="max-w-[1600px] mx-auto">
        <header className="mb-8 animate-slide-down">
          <h1 className="text-4xl font-bold mb-2 text-black">
            Gestão de Estudantes
          </h1>
        </header>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar estudantes por nome, escola ou turma..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
            />
          </div>
        </div>

        <StudentTable
          students={filteredStudents}
          onSelectStudent={setSelectedStudent}
        />

        <div className="mt-6 text-sm text-muted-foreground animate-fade-in">
          Total de estudantes: {filteredStudents.length}
        </div>
      </div>

      <StudentModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
    </div>
  );
}
