import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  School,
  Plus,
  X,
} from 'lucide-react';
import { SchoolsList } from "./Shools"

interface School {
  id: string;
  name: string;
  code: string;
  status: 'active' | 'blocked' | 'inactive';
  email: string | null;
  phone: string | null;
  address: string | null;
  max_students: number;
  max_teachers: number;
  max_staff: number;
  subscription_plan: string;
  subscription_expires_at: string | null;
  created_at: string;
}

interface SchoolStats {
  students: number;
  teachers: number;
  staff: number;
  parents: number;
}

export function SchoolsManager() {
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    email: '',
    phone: '',
    address: '',
    max_students: 1000,
    max_teachers: 100,
    max_staff: 50,
    subscription_plan: 'basic'
  });

  useEffect(() => {
    loadSchools();
  }, []);

  const loadSchools = async () => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        console.log(data);
        await loadSchoolStats(data.map(s => s.id));
      }
    } catch (error) {
      console.error('Error loading schools:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSchoolStats = async (schoolIds: string[]) => {
    const stats: Record<string, SchoolStats> = {};

    for (const schoolId of schoolIds) {
      const [students, teachers, staff, parents] = await Promise.all([
        supabase.from('students').select('id', { count: 'exact' }).eq('school_id', schoolId),
        supabase.from('teachers').select('id', { count: 'exact' }).eq('school_id', schoolId),
        supabase.from('staff').select('id', { count: 'exact' }).eq('school_id', schoolId),
        supabase.from('parents').select('id', { count: 'exact' }).eq('school_id', schoolId)
      ]);

      stats[schoolId] = {
        students: students.count || 0,
        teachers: teachers.count || 0,
        staff: staff.count || 0,
        parents: parents.count || 0
      };
    }

    console.log(stats);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingSchool) {
        const { error } = await supabase
          .from('schools')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingSchool.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('schools')
          .insert([formData]);

        if (error) throw error;
      }

      resetForm();
      loadSchools();
    } catch (error) {
      console.error('Error saving school:', error);
      alert('Error saving school. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      email: '',
      phone: '',
      address: '',
      max_students: 1000,
      max_teachers: 100,
      max_staff: 50,
      subscription_plan: 'basic'
    });
    setEditingSchool(null);
    setShowModal(false);
  };

  if (loading) {
    return <div className="text-center py-8 text-slate-600">Loading schools...</div>;
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Gerenciamento de Escolas</h2>
          <p className="text-slate-600 mt-1">Cadastrar, gerenciar e monitorar escolas da rede</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800 transition flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add School
        </button>
      </div>
      <SchoolsList />

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-2xl font-bold text-slate-900">
                {editingSchool ? 'Edit School' : 'Add New School'}
              </h3>
              <button onClick={resetForm} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    School Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    School Code *
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                    required
                    disabled={!!editingSchool}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Max Students
                  </label>
                  <input
                    type="number"
                    value={formData.max_students}
                    onChange={(e) => setFormData({ ...formData, max_students: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Max Teachers
                  </label>
                  <input
                    type="number"
                    value={formData.max_teachers}
                    onChange={(e) => setFormData({ ...formData, max_teachers: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Max Staff
                  </label>
                  <input
                    type="number"
                    value={formData.max_staff}
                    onChange={(e) => setFormData({ ...formData, max_staff: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Subscription Plan
                </label>
                <select
                  value={formData.subscription_plan}
                  onChange={(e) => setFormData({ ...formData, subscription_plan: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                >
                  <option value="basic">Basic</option>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-slate-100 text-slate-900 py-3 rounded-lg font-medium hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition"
                >
                  {editingSchool ? 'Update School' : 'Create School'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
