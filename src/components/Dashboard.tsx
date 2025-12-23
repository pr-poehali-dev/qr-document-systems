import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { User } from '@/pages/Index';
import MainView from './dashboard/MainView';
import ManagementView from './dashboard/ManagementView';
import ArchiveView from './dashboard/ArchiveView';
import ItemsView from './dashboard/ItemsView';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

type View = 'main' | 'management' | 'archive' | 'items';

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [currentView, setCurrentView] = useState<View>('main');

  const getRoleName = (role: string) => {
    const names = {
      client: 'Клиент',
      cashier: 'Кассир',
      headCashier: 'Главный кассир',
      admin: 'Администратор',
      creator: 'Создатель',
      nikitovsky: 'Никитовский',
    };
    return names[role as keyof typeof names] || role;
  };

  const canAccess = (feature: string) => {
    const permissions: Record<string, string[]> = {
      management: ['headCashier', 'admin', 'creator', 'nikitovsky'],
      archive: ['creator', 'nikitovsky'],
      fullAccess: ['creator', 'nikitovsky'],
    };

    return permissions[feature]?.includes(user.role) || false;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="QrCode" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">QR Управление</h1>
              <p className="text-sm text-gray-500">
                {getRoleName(user.role)} • {user.name}
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout} className="gap-2">
            <Icon name="LogOut" size={18} />
            Выход
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <nav className="mb-6 flex gap-2 flex-wrap">
          <Button
            variant={currentView === 'main' ? 'default' : 'outline'}
            onClick={() => setCurrentView('main')}
            className="gap-2"
          >
            <Icon name="Home" size={18} />
            Главная
          </Button>

          {user.role !== 'client' && (
            <Button
              variant={currentView === 'items' ? 'default' : 'outline'}
              onClick={() => setCurrentView('items')}
              className="gap-2"
            >
              <Icon name="Package" size={18} />
              Товары
            </Button>
          )}

          {canAccess('management') && (
            <Button
              variant={currentView === 'management' ? 'default' : 'outline'}
              onClick={() => setCurrentView('management')}
              className="gap-2"
            >
              <Icon name="Settings" size={18} />
              Управление
            </Button>
          )}

          {canAccess('archive') && (
            <Button
              variant={currentView === 'archive' ? 'default' : 'outline'}
              onClick={() => setCurrentView('archive')}
              className="gap-2"
            >
              <Icon name="Archive" size={18} />
              Архив
            </Button>
          )}
        </nav>

        <div className="animate-fade-in">
          {currentView === 'main' && <MainView user={user} />}
          {currentView === 'management' && canAccess('management') && <ManagementView user={user} />}
          {currentView === 'archive' && canAccess('archive') && <ArchiveView user={user} />}
          {currentView === 'items' && <ItemsView user={user} />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;