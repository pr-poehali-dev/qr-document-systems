import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { User, UserRole } from '@/pages/Index';
import { toast } from '@/hooks/use-toast';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

type Step = 'selectRole' | 'enterPassword';

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [step, setStep] = useState<Step>('selectRole');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeLeft, setBlockTimeLeft] = useState(90);

  useEffect(() => {
    if (isBlocked) {
      const timer = setInterval(() => {
        setBlockTimeLeft((prev) => {
          if (prev <= 1) {
            setIsBlocked(false);
            setFailedAttempts(0);
            setBlockTimeLeft(90);
            return 90;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isBlocked]);

  const rolePasswords: Record<Exclude<UserRole, 'client'>, string> = {
    cashier: '25',
    admin: '2025',
    creator: '202505',
    nikitovsky: '20252025',
  };

  const roleNames = {
    client: 'Покупатель',
    cashier: 'Кассир',
    admin: 'Администратор',
    creator: 'Создатель',
    nikitovsky: 'Никитовский',
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    
    if (role === 'client') {
      setStep('enterPassword');
    } else {
      setStep('enterPassword');
    }
  };

  const handleBack = () => {
    setStep('selectRole');
    setSelectedRole(null);
    setName('');
    setPhone('');
    setPassword('');
  };

  const handleLogin = () => {
    if (isBlocked) {
      toast({
        title: 'Доступ заблокирован',
        description: `Попробуйте через ${blockTimeLeft} секунд`,
        variant: 'destructive',
      });
      return;
    }

    if (selectedRole === 'client') {
      if (!name || !phone) {
        toast({
          title: 'Ошибка',
          description: 'Заполните все поля',
          variant: 'destructive',
        });
        return;
      }

      onLogin({ role: 'client', name, phone });
      toast({
        title: 'Добро пожаловать!',
        description: 'Вы вошли как покупатель',
      });
      return;
    }

    if (!name || !password) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive',
      });
      return;
    }

    const correctPassword = rolePasswords[selectedRole as Exclude<UserRole, 'client'>];

    if (password === correctPassword) {
      setFailedAttempts(0);
      onLogin({ role: selectedRole!, name });
      toast({
        title: 'Добро пожаловать!',
        description: `Вы вошли как ${roleNames[selectedRole!]}`,
      });
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      if (newAttempts >= 3) {
        setIsBlocked(true);
        setBlockTimeLeft(90);
        toast({
          title: 'Доступ заблокирован',
          description: 'Слишком много неверных попыток. Блокировка на 90 секунд',
          variant: 'destructive',
        });
        handleBack();
      } else {
        toast({
          title: 'Неверный пароль',
          description: `Осталось попыток: ${3 - newAttempts}`,
          variant: 'destructive',
        });
        handleBack();
      }
    }
  };

  if (step === 'selectRole') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <Card className="w-full max-w-lg animate-scale-in shadow-xl">
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <Icon name="QrCode" size={32} className="text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">Система управления QR</CardTitle>
            <CardDescription className="text-base">
              Выберите вашу роль для входа в систему
            </CardDescription>
            {isBlocked && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 font-medium flex items-center justify-center gap-2">
                  <Icon name="ShieldAlert" size={20} />
                  Блокировка: {blockTimeLeft} секунд
                </p>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <Button
                variant="outline"
                size="lg"
                className="h-auto py-4 justify-start hover:bg-primary hover:text-white transition-all"
                onClick={() => handleRoleSelect('client')}
                disabled={isBlocked}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="User" size={24} className="text-blue-600" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-base">Покупатель</p>
                    <p className="text-xs text-gray-500">Просмотр своих товаров</p>
                  </div>
                  <Icon name="ChevronRight" size={20} />
                </div>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="h-auto py-4 justify-start hover:bg-primary hover:text-white transition-all"
                onClick={() => handleRoleSelect('cashier')}
                disabled={isBlocked}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="ShoppingCart" size={24} className="text-green-600" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-base">Кассир</p>
                    <p className="text-xs text-gray-500">Выдача и приём товаров</p>
                  </div>
                  <Icon name="ChevronRight" size={20} />
                </div>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="h-auto py-4 justify-start hover:bg-primary hover:text-white transition-all"
                onClick={() => handleRoleSelect('admin')}
                disabled={isBlocked}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="Shield" size={24} className="text-purple-600" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-base">Администратор</p>
                    <p className="text-xs text-gray-500">Управление и настройки</p>
                  </div>
                  <Icon name="ChevronRight" size={20} />
                </div>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="h-auto py-4 justify-start hover:bg-primary hover:text-white transition-all"
                onClick={() => handleRoleSelect('creator')}
                disabled={isBlocked}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="Crown" size={24} className="text-amber-600" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-base">Создатель</p>
                    <p className="text-xs text-gray-500">Полный доступ и архив</p>
                  </div>
                  <Icon name="ChevronRight" size={20} />
                </div>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="h-auto py-4 justify-start hover:bg-primary hover:text-white transition-all border-2 border-primary"
                onClick={() => handleRoleSelect('nikitovsky')}
                disabled={isBlocked}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="Sparkles" size={24} className="text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-base">Никитовский</p>
                    <p className="text-xs text-gray-500">Максимальные привилегии</p>
                  </div>
                  <Icon name="ChevronRight" size={20} />
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md animate-scale-in shadow-xl">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <Icon 
                name={
                  selectedRole === 'client' ? 'User' :
                  selectedRole === 'cashier' ? 'ShoppingCart' :
                  selectedRole === 'admin' ? 'Shield' :
                  selectedRole === 'creator' ? 'Crown' :
                  'Sparkles'
                } 
                size={32} 
                className="text-white" 
              />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">{roleNames[selectedRole!]}</CardTitle>
          <CardDescription className="text-base">
            Введите данные для входа
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{selectedRole === 'client' ? 'Имя' : 'Имя сотрудника'}</Label>
            <Input
              id="name"
              type="text"
              placeholder="Введите имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isBlocked}
            />
          </div>

          {selectedRole === 'client' ? (
            <div className="space-y-2">
              <Label htmlFor="phone">Номер телефона</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+7 (999) 123-45-67"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isBlocked}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                disabled={isBlocked}
              />
              {failedAttempts > 0 && failedAttempts < 3 && (
                <p className="text-sm text-red-500">
                  Осталось попыток: {3 - failedAttempts}
                </p>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleBack} 
              className="flex-1"
              disabled={isBlocked}
            >
              <Icon name="ArrowLeft" size={18} className="mr-2" />
              Назад
            </Button>
            <Button 
              onClick={handleLogin} 
              className="flex-1"
              disabled={isBlocked}
            >
              <Icon name="LogIn" size={18} className="mr-2" />
              Войти
            </Button>
          </div>

          {isBlocked && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center">
              <p className="text-red-700 font-medium">
                Блокировка: {blockTimeLeft} сек
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
