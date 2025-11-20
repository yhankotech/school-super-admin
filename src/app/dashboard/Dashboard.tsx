import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { RecentSchools } from "./RecentSchools";
import {
  School,
  Users,
  GraduationCap,
  Briefcase,
  UserCircle,
  DollarSign,
  TrendingUp,
  Activity
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


  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
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
        <RecentSchools />
    </div>
  );
}
