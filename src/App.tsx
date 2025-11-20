import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './app/auth/Login';
import { Layout } from './app/Layout';
import { Dashboard } from './app/dashboard/Dashboard';
import { SchoolsManager } from './app/schools/SchoolsManager';
import { PaymentsManager } from './app/payment/PaymentsManager';
import { PlatformsManager } from './app/manage/PlatformsManager';
import { Students } from "./app/students/Strudents";
import { Parents } from "./app/parents/Parents";
import { Teachers } from "./app/teachers/Teachers";

function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'schools':
        return <SchoolsManager />;
      case 'students':
        return <Students />;
      case 'parents':
        return <Parents/>;
      case 'teachers':
        return <Teachers/>;
      case 'payments':
        return <PaymentsManager />;
      case 'platforms':
        return <PlatformsManager />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {renderView()}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
