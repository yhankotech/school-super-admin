import { useState } from "react";
import { Search } from "lucide-react";
import { Teacher } from "../../types/teacher";
import { mockTeachers } from "../../data/data";
import { TeacherTable } from "../../components/TeacherTable";
import { TeacherModal } from "../../components/TeacherModal";


export function Teachers() {
 const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const filteredTeachers = mockTeachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.totalParents.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pl-6 pr-6 animate-fade-in">
      <div className="max-w-[1600px] mx-auto">
        <header className="mb-8 animate-slide-down">
          <h1 className="text-4xl font-bold mb-2 text-black">
            Gestão de Professores
          </h1>
        </header>

       <div className="mb-6">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Buscar escolas por nome ou código..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                />
            </div>
        </div>

        <TeacherTable
          teachers={filteredTeachers}
          onSelectTeacher={setSelectedTeacher}
        />

        <div className="mt-6 text-sm text-muted-foreground animate-fade-in">
          Total de professores: {filteredTeachers.length}
        </div>
        <TeacherModal
        teacher={selectedTeacher}
        onClose={() => setSelectedTeacher(null)}
      />
      </div>
    </div>
  );
}