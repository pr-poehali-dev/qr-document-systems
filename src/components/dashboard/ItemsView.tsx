import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { User } from '@/pages/Index';
import { toast } from '@/hooks/use-toast';

interface ItemsViewProps {
  user: User;
}

interface Item {
  id: string;
  qrCode: string;
  department: string;
  itemName: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  depositAmount: number;
  returnAmount: number;
  depositDate: string;
  expectedReturnDate: string;
  status: 'active' | 'returned';
}

const ItemsView = ({ user }: ItemsViewProps) => {
  const [items, setItems] = useState<Item[]>([
    {
      id: '1',
      qrCode: 'QR-0001',
      department: 'documents',
      itemName: 'Паспорт РФ',
      clientName: 'Иванов Иван Иванович',
      clientPhone: '+7 (999) 123-45-67',
      clientEmail: 'ivanov@example.com',
      depositAmount: 500,
      returnAmount: 500,
      depositDate: '2025-12-23',
      expectedReturnDate: '2025-12-30',
      status: 'active',
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    qrCode: '',
    department: 'documents',
    itemName: '',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    depositAmount: '0',
    returnAmount: '0',
    depositDate: new Date().toISOString().split('T')[0],
    expectedReturnDate: '',
  });

  const departmentNames = {
    documents: 'Документы',
    photos: 'Фото/Карты',
    other: 'Другое',
  };

  const handleAddItem = () => {
    if (!newItem.qrCode || !newItem.itemName || !newItem.clientName || !newItem.clientPhone) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все обязательные поля',
        variant: 'destructive',
      });
      return;
    }

    const item: Item = {
      id: Date.now().toString(),
      qrCode: newItem.qrCode,
      department: newItem.department,
      itemName: newItem.itemName,
      clientName: newItem.clientName,
      clientPhone: newItem.clientPhone,
      clientEmail: newItem.clientEmail,
      depositAmount: parseFloat(newItem.depositAmount),
      returnAmount: parseFloat(newItem.returnAmount),
      depositDate: newItem.depositDate,
      expectedReturnDate: newItem.expectedReturnDate,
      status: 'active',
    };

    setItems([...items, item]);
    setIsAddDialogOpen(false);
    setNewItem({
      qrCode: '',
      department: 'documents',
      itemName: '',
      clientName: '',
      clientPhone: '',
      clientEmail: '',
      depositAmount: '0',
      returnAmount: '0',
      depositDate: new Date().toISOString().split('T')[0],
      expectedReturnDate: '',
    });

    toast({
      title: 'Товар добавлен',
      description: `QR-код: ${item.qrCode}`,
    });
  };

  const handleReturnItem = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, status: 'returned' as const } : item));
    toast({
      title: 'Товар выдан',
      description: 'Товар успешно выдан клиенту и отправлен в архив',
    });
  };

  const generateQRCode = () => {
    const qrNumber = String(items.length + 1).padStart(4, '0');
    setNewItem({ ...newItem, qrCode: `QR-${qrNumber}` });
  };

  const canEdit = user.role === 'headCashier' || user.role === 'admin' || user.role === 'creator' || user.role === 'nikitovsky';
  const canReturn = user.role !== 'client';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Управление товарами</h2>
          <p className="text-gray-600">Приём, хранение и выдача товаров с QR-кодами</p>
        </div>

        {canEdit && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Icon name="Plus" size={18} />
                Добавить товар
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Добавление нового товара</DialogTitle>
                <DialogDescription>Заполните анкету для приёма товара</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor="qrCode">QR-код *</Label>
                    <Input
                      id="qrCode"
                      value={newItem.qrCode}
                      onChange={(e) => setNewItem({ ...newItem, qrCode: e.target.value })}
                      placeholder="QR-0001"
                    />
                  </div>
                  <Button onClick={generateQRCode} variant="outline" className="mt-8">
                    <Icon name="Sparkles" size={18} />
                  </Button>
                </div>

                <div>
                  <Label htmlFor="department">Отдел *</Label>
                  <Select value={newItem.department} onValueChange={(value) => setNewItem({ ...newItem, department: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="documents">Документы</SelectItem>
                      <SelectItem value="photos">Фото/Карты</SelectItem>
                      <SelectItem value="other">Другое</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="itemName">Название товара *</Label>
                  <Input
                    id="itemName"
                    value={newItem.itemName}
                    onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
                    placeholder="Паспорт РФ"
                  />
                </div>

                <div>
                  <Label htmlFor="clientName">ФИО клиента *</Label>
                  <Input
                    id="clientName"
                    value={newItem.clientName}
                    onChange={(e) => setNewItem({ ...newItem, clientName: e.target.value })}
                    placeholder="Иванов Иван Иванович"
                  />
                </div>

                <div>
                  <Label htmlFor="clientPhone">Телефон клиента *</Label>
                  <Input
                    id="clientPhone"
                    value={newItem.clientPhone}
                    onChange={(e) => setNewItem({ ...newItem, clientPhone: e.target.value })}
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>

                <div>
                  <Label htmlFor="clientEmail">Email клиента</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={newItem.clientEmail}
                    onChange={(e) => setNewItem({ ...newItem, clientEmail: e.target.value })}
                    placeholder="client@example.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="depositAmount">Оплата при приёме (₽)</Label>
                    <Input
                      id="depositAmount"
                      type="number"
                      value={newItem.depositAmount}
                      onChange={(e) => setNewItem({ ...newItem, depositAmount: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="returnAmount">Оплата при выдаче (₽)</Label>
                    <Input
                      id="returnAmount"
                      type="number"
                      value={newItem.returnAmount}
                      onChange={(e) => setNewItem({ ...newItem, returnAmount: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="depositDate">Дата приёма</Label>
                    <Input
                      id="depositDate"
                      type="date"
                      value={newItem.depositDate}
                      onChange={(e) => setNewItem({ ...newItem, depositDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="expectedReturnDate">Дата получения</Label>
                    <Input
                      id="expectedReturnDate"
                      type="date"
                      value={newItem.expectedReturnDate}
                      onChange={(e) => setNewItem({ ...newItem, expectedReturnDate: e.target.value })}
                    />
                  </div>
                </div>

                <Button onClick={handleAddItem} className="w-full">
                  <Icon name="Check" size={18} className="mr-2" />
                  Добавить товар
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-4">
        {items.filter(item => user.role === 'client' ? item.clientPhone === user.phone : true).map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="QrCode" size={32} className="text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{item.itemName}</CardTitle>
                    <CardDescription className="mt-1">{item.qrCode}</CardDescription>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">
                        {departmentNames[item.department as keyof typeof departmentNames]}
                      </Badge>
                      <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
                        {item.status === 'active' ? 'Активно' : 'Выдано'}
                      </Badge>
                    </div>
                  </div>
                </div>
                {canReturn && item.status === 'active' && (
                  <Button onClick={() => handleReturnItem(item.id)} variant="outline" size="sm" className="gap-2">
                    <Icon name="Check" size={16} />
                    Выдать
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Клиент</p>
                  <p className="font-medium">{item.clientName}</p>
                  <p className="text-gray-600">{item.clientPhone}</p>
                  {item.clientEmail && <p className="text-gray-600">{item.clientEmail}</p>}
                </div>
                <div>
                  <p className="text-gray-500">Оплата</p>
                  <p className="font-medium">При приёме: {item.depositAmount} ₽</p>
                  <p className="font-medium">При выдаче: {item.returnAmount} ₽</p>
                </div>
                <div>
                  <p className="text-gray-500">Дата приёма</p>
                  <p className="font-medium">{new Date(item.depositDate).toLocaleDateString('ru-RU')}</p>
                </div>
                {item.expectedReturnDate && (
                  <div>
                    <p className="text-gray-500">Дата получения</p>
                    <p className="font-medium">{new Date(item.expectedReturnDate).toLocaleDateString('ru-RU')}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {items.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Icon name="Package" size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Товары отсутствуют</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ItemsView;