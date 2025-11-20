import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  School,
  Users,
  GraduationCap,
  Briefcase,
  UserCircle,
  DollarSign,
  TrendingUp,
  Activity, 
  Building2
} from 'lucide-react';

interface DashboardStats {
  totalSchools: number;
  activeSchools: number;
  blockedSchools: number;
  totalStudents: number;
  totalTeachers: number;
  totalStaff: number;
  totalParents: number;
  activeParents: number;
  totalPayments: number;
  completedPayments: number;
  totalRevenue: number;
  pendingRevenue: number;
  activePlatforms: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSchools: 0,
    activeSchools: 0,
    blockedSchools: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalStaff: 0,
    totalParents: 0,
    activeParents: 0,
    totalPayments: 0,
    completedPayments: 0,
    totalRevenue: 0,
    pendingRevenue: 0,
    activePlatforms: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [
        schoolsData,
        studentsData,
        teachersData,
        staffData,
        parentsData,
        paymentsData,
        platformsData
      ] = await Promise.all([
        supabase.from('schools').select('status', { count: 'exact' }),
        supabase.from('students').select('id', { count: 'exact' }),
        supabase.from('teachers').select('id', { count: 'exact' }),
        supabase.from('staff').select('id', { count: 'exact' }),
        supabase.from('parents').select('platform_active', { count: 'exact' }),
        supabase.from('payments').select('status, amount'),
        supabase.from('platform_integrations').select('status', { count: 'exact' })
      ]);

      const activeSchools = schoolsData.data?.filter(s => s.status === 'active').length || 0;
      const blockedSchools = schoolsData.data?.filter(s => s.status === 'blocked').length || 0;
      const activeParents = parentsData.data?.filter(p => p.platform_active).length || 0;

      const completedPayments = paymentsData.data?.filter(p => p.status === 'completed') || [];
      const pendingPayments = paymentsData.data?.filter(p => p.status === 'pending') || [];

      const totalRevenue = completedPayments.reduce((sum, p) => sum + Number(p.amount), 0);
      const pendingRevenue = pendingPayments.reduce((sum, p) => sum + Number(p.amount), 0);

      const activePlatforms = platformsData.data?.filter(p => p.status === 'active').length || 0;

      setStats({
        totalSchools: schoolsData.count || 0,
        activeSchools,
        blockedSchools,
        totalStudents: studentsData.count || 0,
        totalTeachers: teachersData.count || 0,
        totalStaff: staffData.count || 0,
        totalParents: parentsData.count || 0,
        activeParents,
        totalPayments: paymentsData.data?.length || 0,
        completedPayments: completedPayments.length,
        totalRevenue,
        pendingRevenue,
        activePlatforms
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600">Loading statistics...</div>
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Schools',
      value: stats.totalSchools,
      subtitle: `${stats.activeSchools} active, ${stats.blockedSchools} blocked`,
      icon: School,
      color: 'bg-blue-500'
    },
    {
      title: 'Students',
      value: stats.totalStudents.toLocaleString(),
      subtitle: 'Across all schools',
      icon: GraduationCap,
      color: 'bg-green-500'
    },
    {
      title: 'Teachers',
      value: stats.totalTeachers.toLocaleString(),
      subtitle: 'Active educators',
      icon: Users,
      color: 'bg-orange-500'
    },
    {
      title: 'Staff Members',
      value: stats.totalStaff.toLocaleString(),
      subtitle: 'Administrative staff',
      icon: Briefcase,
      color: 'bg-slate-500'
    },
    {
      title: 'Parents',
      value: stats.totalParents.toLocaleString(),
      subtitle: `${stats.activeParents} using platform`,
      icon: UserCircle,
      color: 'bg-cyan-500'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      subtitle: `${stats.completedPayments} completed payments`,
      icon: DollarSign,
      color: 'bg-emerald-500'
    },
    {
      title: 'Pending Revenue',
      value: `$${stats.pendingRevenue.toLocaleString()}`,
      subtitle: `${stats.totalPayments - stats.completedPayments} pending payments`,
      icon: TrendingUp,
      color: 'bg-amber-500'
    },
    {
      title: 'Active Platforms',
      value: stats.activePlatforms,
      subtitle: 'Platform integrations',
      icon: Activity,
      color: 'bg-violet-500'
    }
  ];

  const recentSchools = [
    { id: 1, name: "Escola Primária ABC", studentsCount: 350, teachersCount: 25, status: "active" },
    { id: 2, name: "Colégio XYZ", studentsCount: 500, teachersCount: 40, status: "blocked" },
    { id: 3, name: "Instituto Educacional LMN", studentsCount: 200, teachersCount: 15, status: "inactive" },
    { id: 4, name: "Escola Secundária QRS", studentsCount: 450, teachersCount: 30, status: "active" },
    { id: 5, name: "Centro de Ensino TUV", studentsCount: 300, teachersCount: 20, status: "active" }
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Dashboard Overview</h2>
        <p className="text-slate-600 mt-1">Real-time statistics across all schools</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-slate-600 text-sm font-medium mb-1">{card.title}</h3>
                <p className="text-3xl font-bold text-slate-900 mb-1">{card.value}</p>
                <p className="text-slate-500 text-xs">{card.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="animate-fade-in" style={{ animationDelay: "0.8s" }}>
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
                  Escolas Recentes
              </div>
              <div>Últimas escolas cadastradas no sistema</div>
            </div>
            <div>
              <div className="space-y-4">
                {recentSchools.map((school, index) => (
                  <div key={school.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors animate-fade-in" style={{ animationDelay: `${0.9 + index * 0.1}s` }}>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{school.name}</p>
                      <p className="text-sm text-muted-foreground">{school.studentsCount} alunos • {school.teachersCount} professores</p>
                    </div>
                    <div
                      className={
                        school.status === "active"
                          ? "px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"
                          : school.status === "blocked"
                          ? "px-2 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-800"
                          : "px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800"
                      }
                    >
                      {school.status === "active" ? "Ativa" : school.status === "blocked" ? "Bloqueada" : "Inativa"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}
