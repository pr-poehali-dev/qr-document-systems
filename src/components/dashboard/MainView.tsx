import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { User } from '@/pages/Index';

interface MainViewProps {
  user: User;
}

const MainView = ({ user }: MainViewProps) => {
  const stats = [
    { label: 'Документы', value: '24/100', icon: 'FileText', color: 'bg-blue-500' },
    { label: 'Фото/Карты', value: '18/100', icon: 'Image', color: 'bg-green-500' },
    { label: 'Другое', value: '7/∞', icon: 'Package', color: 'bg-purple-500' },
    { label: 'В архиве', value: '152', icon: 'Archive', color: 'bg-gray-500' },
  ];

  const recentActivity = [
    { id: 'QR-0001', item: 'Паспорт РФ', client: 'Иванов И.И.', date: '23.12.2025', status: 'active' },
    { id: 'QR-0002', item: 'Водительские права', client: 'Петров П.П.', date: '22.12.2025', status: 'active' },
    { id: 'QR-0003', item: 'Фото 10x15', client: 'Сидоров С.С.', date: '21.12.2025', status: 'returned' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Добро пожаловать!</h2>
        <p className="text-gray-600">
          Система управления документами и товарами с использованием QR-кодов
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <div className={`${stat.color} p-2 rounded-lg`}>
                <Icon name={stat.icon as any} size={20} className="text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {user.role !== 'client' && (
        <Card>
          <CardHeader>
            <CardTitle>Последняя активность</CardTitle>
            <CardDescription>Недавние операции с товарами</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name="QrCode" size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{activity.item}</p>
                      <p className="text-sm text-gray-500">
                        {activity.id} • {activity.client}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{activity.date}</p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        activity.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {activity.status === 'active' ? 'Активно' : 'Выдано'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Возможности системы</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex gap-3 items-start">
              <Icon name="QrCode" size={24} className="text-primary mt-1" />
              <div>
                <h4 className="font-medium mb-1">Генерация QR-кодов</h4>
                <p className="text-sm text-gray-600">
                  Автоматическое создание уникальных QR-кодов для каждого товара
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <Icon name="Archive" size={24} className="text-primary mt-1" />
              <div>
                <h4 className="font-medium mb-1">Постоянный архив</h4>
                <p className="text-sm text-gray-600">
                  Все данные сохраняются навсегда в защищённом архиве
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <Icon name="Users" size={24} className="text-primary mt-1" />
              <div>
                <h4 className="font-medium mb-1">Управление клиентами</h4>
                <p className="text-sm text-gray-600">
                  Полная анкета клиента с контактными данными
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <Icon name="Bell" size={24} className="text-primary mt-1" />
              <div>
                <h4 className="font-medium mb-1">SMS-уведомления</h4>
                <p className="text-sm text-gray-600">
                  Автоматические уведомления клиентам о статусе товаров
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MainView;
