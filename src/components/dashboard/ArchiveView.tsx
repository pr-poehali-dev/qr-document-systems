import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { User } from '@/pages/Index';
import { toast } from '@/hooks/use-toast';

interface ArchiveViewProps {
  user: User;
}

interface ArchivedItem {
  id: string;
  qrCode: string;
  department: string;
  itemName: string;
  clientName: string;
  clientPhone: string;
  depositDate: string;
  returnDate: string;
  totalAmount: number;
}

const ArchiveView = ({ user }: ArchiveViewProps) => {
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const archivedItems: ArchivedItem[] = [
    {
      id: '1',
      qrCode: 'QR-0003',
      department: 'photos',
      itemName: 'Фото 10x15',
      clientName: 'Сидоров Сергей Сергеевич',
      clientPhone: '+7 (999) 777-88-99',
      depositDate: '2025-12-20',
      returnDate: '2025-12-21',
      totalAmount: 1000,
    },
    {
      id: '2',
      qrCode: 'QR-0002',
      department: 'documents',
      itemName: 'Загранпаспорт',
      clientName: 'Петрова Анна Петровна',
      clientPhone: '+7 (999) 555-66-77',
      depositDate: '2025-12-15',
      returnDate: '2025-12-18',
      totalAmount: 2500,
    },
  ];

  const handleUnlock = () => {
    if (password === '202505') {
      setIsUnlocked(true);
      toast({
        title: 'Доступ получен',
        description: 'Архив разблокирован',
      });
    } else {
      toast({
        title: 'Ошибка',
        description: 'Неверный пароль',
        variant: 'destructive',
      });
    }
  };

  const departmentNames = {
    documents: 'Документы',
    photos: 'Фото/Карты',
    other: 'Другое',
  };

  const filteredItems = archivedItems.filter(item => 
    item.qrCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePrintForm = (item: ArchivedItem, filled: boolean) => {
    toast({
      title: filled ? 'Печать заполненной анкеты' : 'Печать пустой анкеты',
      description: `Анкета для ${filled ? item.clientName : 'нового клиента'} отправлена на печать`,
    });
  };

  if (!isUnlocked) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md animate-scale-in">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name="Lock" size={32} className="text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">Архив документов</CardTitle>
            <CardDescription>Введите пароль для доступа к архиву</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="archivePassword">Пароль</Label>
              <Input
                id="archivePassword"
                type="password"
                placeholder="202505"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleUnlock()}
              />
            </div>
            <Button onClick={handleUnlock} className="w-full" size="lg">
              <Icon name="Unlock" size={18} className="mr-2" />
              Разблокировать архив
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Архив документов</h2>
          <p className="text-gray-600">Постоянное хранение всех операций</p>
        </div>
        <Button variant="outline" onClick={() => setIsUnlocked(false)} className="gap-2">
          <Icon name="Lock" size={18} />
          Заблокировать
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Статистика архива</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">{archivedItems.length}</p>
              <p className="text-sm text-gray-600 mt-1">Всего записей</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">
                {archivedItems.filter(i => i.department === 'documents').length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Документы</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-3xl font-bold text-purple-600">
                {archivedItems.filter(i => i.department === 'photos').length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Фото/Карты</p>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <p className="text-3xl font-bold text-amber-600">
                {archivedItems.reduce((sum, item) => sum + item.totalAmount, 0)} ₽
              </p>
              <p className="text-sm text-gray-600 mt-1">Общая сумма</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Поиск в архиве</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Icon name="Printer" size={18} />
                  Печать анкет
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Печать анкет</DialogTitle>
                  <DialogDescription>Выберите тип анкеты для печати</DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2"
                    onClick={() => handlePrintForm(archivedItems[0], false)}
                  >
                    <Icon name="FileText" size={18} />
                    Пустая анкета
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2"
                    onClick={() => handlePrintForm(archivedItems[0], true)}
                  >
                    <Icon name="FileCheck" size={18} />
                    Заполненная анкета
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="mt-4">
            <Input
              placeholder="Поиск по QR-коду, имени или товару..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-3 flex-1">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="Archive" size={24} className="text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{item.itemName}</p>
                        <Badge variant="outline" className="text-xs">
                          {item.qrCode}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {departmentNames[item.department as keyof typeof departmentNames]}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{item.clientName}</p>
                      <p className="text-sm text-gray-500">{item.clientPhone}</p>
                      <div className="flex gap-4 mt-2 text-xs text-gray-500">
                        <span>Приём: {new Date(item.depositDate).toLocaleDateString('ru-RU')}</span>
                        <span>Выдача: {new Date(item.returnDate).toLocaleDateString('ru-RU')}</span>
                        <span className="font-medium text-gray-700">{item.totalAmount} ₽</span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handlePrintForm(item, true)}
                    className="gap-2"
                  >
                    <Icon name="Printer" size={16} />
                  </Button>
                </div>
              </div>
            ))}

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <Icon name="Search" size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Ничего не найдено</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArchiveView;
