import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { User } from '@/pages/Index';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface ManagementViewProps {
  user: User;
}

interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  discount: number;
  bonusPoints: number;
  createdAt: string;
}

const ManagementView = ({ user }: ManagementViewProps) => {
  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      name: 'Иванов Иван Иванович',
      phone: '+7 (999) 123-45-67',
      email: 'ivanov@example.com',
      discount: 10,
      bonusPoints: 150,
      createdAt: '2025-12-01',
    },
  ]);

  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    phone: '',
    email: '',
    discount: '0',
    bonusPoints: '0',
  });

  const handleAddClient = () => {
    if (!newClient.name || !newClient.phone) {
      toast({
        title: 'Ошибка',
        description: 'Заполните обязательные поля',
        variant: 'destructive',
      });
      return;
    }

    const client: Client = {
      id: Date.now().toString(),
      name: newClient.name,
      phone: newClient.phone,
      email: newClient.email,
      discount: parseFloat(newClient.discount),
      bonusPoints: parseFloat(newClient.bonusPoints),
      createdAt: new Date().toISOString().split('T')[0],
    };

    setClients([...clients, client]);
    setIsAddClientOpen(false);
    setNewClient({ name: '', phone: '', email: '', discount: '0', bonusPoints: '0' });

    toast({
      title: 'Клиент создан',
      description: `${client.name} добавлен в систему`,
    });
  };

  const handleSendSMS = (clientName: string) => {
    toast({
      title: 'SMS отправлено',
      description: `Уведомление отправлено клиенту ${clientName}`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Панель управления</h2>
        <p className="text-gray-600">Управление клиентами, скидками и уведомлениями</p>
      </div>

      <Tabs defaultValue="clients" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="clients">Клиенты</TabsTrigger>
          <TabsTrigger value="discounts">Скидки</TabsTrigger>
          <TabsTrigger value="notifications">Уведомления</TabsTrigger>
        </TabsList>

        <TabsContent value="clients" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">База клиентов</h3>
              <p className="text-sm text-gray-600">Всего клиентов: {clients.length}</p>
            </div>

            <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Icon name="UserPlus" size={18} />
                  Добавить клиента
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Новый клиент</DialogTitle>
                  <DialogDescription>Создание учётной записи клиента</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="clientName">ФИО *</Label>
                    <Input
                      id="clientName"
                      value={newClient.name}
                      onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                      placeholder="Иванов Иван Иванович"
                    />
                  </div>

                  <div>
                    <Label htmlFor="clientPhone">Телефон *</Label>
                    <Input
                      id="clientPhone"
                      value={newClient.phone}
                      onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                      placeholder="+7 (999) 123-45-67"
                    />
                  </div>

                  <div>
                    <Label htmlFor="clientEmail">Email</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      value={newClient.email}
                      onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                      placeholder="client@example.com"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="discount">Скидка (%)</Label>
                      <Input
                        id="discount"
                        type="number"
                        value={newClient.discount}
                        onChange={(e) => setNewClient({ ...newClient, discount: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bonusPoints">Бонусы</Label>
                      <Input
                        id="bonusPoints"
                        type="number"
                        value={newClient.bonusPoints}
                        onChange={(e) => setNewClient({ ...newClient, bonusPoints: e.target.value })}
                      />
                    </div>
                  </div>

                  <Button onClick={handleAddClient} className="w-full">
                    Создать клиента
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {clients.map((client) => (
              <Card key={client.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{client.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {client.phone}
                        {client.email && ` • ${client.email}`}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {client.discount > 0 && (
                        <Badge variant="secondary">{client.discount}% скидка</Badge>
                      )}
                      {client.bonusPoints > 0 && (
                        <Badge variant="outline">{client.bonusPoints} бонусов</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendSMS(client.name)}
                      className="gap-2"
                    >
                      <Icon name="MessageSquare" size={16} />
                      Отправить SMS
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="discounts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Система скидок</CardTitle>
              <CardDescription>Управление скидочными картами и бонусными программами</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Базовая</CardTitle>
                    <CardDescription>Скидка 5%</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">При первом обращении</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Постоянная</CardTitle>
                    <CardDescription>Скидка 10%</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">После 5 обращений</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardHeader>
                    <CardTitle className="text-lg">VIP</CardTitle>
                    <CardDescription>Скидка 15%</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">После 20 обращений</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SMS-уведомления</CardTitle>
              <CardDescription>Автоматические уведомления для клиентов</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Icon name="Bell" size={24} className="text-primary" />
                  <div className="flex-1">
                    <p className="font-medium">Товар готов к получению</p>
                    <p className="text-sm text-gray-600">Отправляется автоматически при готовности</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Icon name="AlertTriangle" size={24} className="text-amber-500" />
                  <div className="flex-1">
                    <p className="font-medium">Напоминание о получении</p>
                    <p className="text-sm text-gray-600">За 1 день до истечения срока хранения</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Icon name="XCircle" size={24} className="text-red-500" />
                  <div className="flex-1">
                    <p className="font-medium">Товар утерян</p>
                    <p className="text-sm text-gray-600">Отправляется вручную администратором</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManagementView;
