import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { User, UserRole } from '@/pages/Index';
import { toast } from '@/hooks/use-toast';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [staffName, setStaffName] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientName, setClientName] = useState('');

  const handleStaffLogin = () => {
    if (!staffName || !staffPassword) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive',
      });
      return;
    }

    let role: UserRole | null = null;

    if (staffPassword === '20252025') {
      role = 'nikitovsky';
    } else if (staffPassword === '2025') {
      role = 'admin';
    } else if (staffPassword === '25') {
      role = 'cashier';
    } else if (staffPassword === '202505') {
      role = 'creator';
    }

    if (role) {
      onLogin({ role, name: staffName });
      toast({
        title: 'Добро пожаловать!',
        description: `Вы вошли как ${getRoleName(role)}`,
      });
    } else {
      toast({
        title: 'Ошибка',
        description: 'Неверный пароль',
        variant: 'destructive',
      });
    }
  };

  const handleClientLogin = () => {
    if (!clientPhone || !clientName) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive',
      });
      return;
    }

    onLogin({ role: 'client', name: clientName, phone: clientPhone });
    toast({
      title: 'Добро пожаловать!',
      description: 'Вы вошли как клиент',
    });
  };

  const getRoleName = (role: UserRole) => {
    const names = {
      client: 'Клиент',
      cashier: 'Кассир',
      admin: 'Администратор',
      creator: 'Создатель',
      nikitovsky: 'Никитовский',
    };
    return names[role];
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md animate-scale-in shadow-xl">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <Icon name="QrCode" size={32} className="text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Система управления QR</CardTitle>
          <CardDescription className="text-base">
            Управление документами и товарами с помощью QR-кодов
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="client" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="client" className="flex items-center gap-2">
                <Icon name="User" size={16} />
                Клиент
              </TabsTrigger>
              <TabsTrigger value="staff" className="flex items-center gap-2">
                <Icon name="Shield" size={16} />
                Сотрудник
              </TabsTrigger>
            </TabsList>

            <TabsContent value="client" className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="clientPhone">Номер телефона</Label>
                <Input
                  id="clientPhone"
                  type="tel"
                  placeholder="+7 (999) 123-45-67"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientName">Имя</Label>
                <Input
                  id="clientName"
                  type="text"
                  placeholder="Введите ваше имя"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>
              <Button onClick={handleClientLogin} className="w-full" size="lg">
                <Icon name="LogIn" size={18} className="mr-2" />
                Войти как клиент
              </Button>
            </TabsContent>

            <TabsContent value="staff" className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="staffName">Имя</Label>
                <Input
                  id="staffName"
                  type="text"
                  placeholder="Введите имя"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="staffPassword">Пароль</Label>
                <Input
                  id="staffPassword"
                  type="password"
                  placeholder="Введите пароль"
                  value={staffPassword}
                  onChange={(e) => setStaffPassword(e.target.value)}
                />
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Кассир: 25</p>
                <p>• Администратор: 2025</p>
                <p>• Создатель: 202505</p>
                <p>• Никитовский: 20252025</p>
              </div>
              <Button onClick={handleStaffLogin} className="w-full" size="lg">
                <Icon name="ShieldCheck" size={18} className="mr-2" />
                Войти как сотрудник
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
