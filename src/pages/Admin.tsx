import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Package, 
  AlertTriangle,
  Eye,
  Calendar,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Settings
} from "lucide-react";

// Dados simulados do dashboard
const dashboardData = {
  revenue: {
    daily: 1250.50,
    weekly: 8750.25,
    monthly: 35420.80
  },
  orders: {
    daily: 15,
    weekly: 98,
    monthly: 421
  },
  visits: {
    daily: 342,
    weekly: 2186,
    monthly: 9247
  },
  lowStock: [
    { id: "1", name: "Camiseta Premium Laranja", stock: 3, minStock: 10 },
    { id: "2", name: "Tênis Casual Branco", stock: 1, minStock: 5 },
    { id: "3", name: "Calça Jeans Premium", stock: 5, minStock: 15 }
  ]
};

const products = [
  {
    id: "ZS-001-TSH",
    name: "Camiseta Premium Laranja",
    category: "Camisetas",
    price: 79.90,
    stock: 25,
    status: "active",
    featured: true,
    promotion: { active: true, discount: 20 }
  },
  {
    id: "ZS-002-JEA",
    name: "Calça Jeans Premium",
    category: "Calças",
    price: 149.90,
    stock: 15,
    status: "active",
    featured: false,
    promotion: { active: false, discount: 0 }
  },
  {
    id: "ZS-003-SNK",
    name: "Tênis Casual Branco",
    category: "Calçados",
    price: 199.90,
    stock: 8,
    status: "active",
    featured: true,
    promotion: { active: true, discount: 25 }
  }
];

const Admin = () => {
  const [selectedTab, setSelectedTab] = useState("dashboard");

  const StatCard = ({ icon: Icon, title, value, description, color = "primary" }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 text-${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Painel Administrativo</h1>
              <p className="text-muted-foreground">Zander Store</p>
            </div>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="promotions">Promoções</TabsTrigger>
            <TabsTrigger value="sets">Conjuntos</TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={DollarSign}
                title="Faturamento Diário"
                value={`R$ ${dashboardData.revenue.daily.toFixed(2)}`}
                description="Vendas de hoje"
              />
              <StatCard
                icon={BarChart3}
                title="Faturamento Semanal"
                value={`R$ ${dashboardData.revenue.weekly.toFixed(2)}`}
                description="Últimos 7 dias"
              />
              <StatCard
                icon={TrendingUp}
                title="Faturamento Mensal"
                value={`R$ ${dashboardData.revenue.monthly.toFixed(2)}`}
                description="Últimos 30 dias"
              />
              <StatCard
                icon={ShoppingBag}
                title="Pedidos"
                value={dashboardData.orders.monthly}
                description="Este mês"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Visitas ao Site
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Hoje:</span>
                      <span className="font-semibold">{dashboardData.visits.daily} visitas</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Esta semana:</span>
                      <span className="font-semibold">{dashboardData.visits.weekly} visitas</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Este mês:</span>
                      <span className="font-semibold">{dashboardData.visits.monthly} visitas</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Produtos com Estoque Baixo
                  </CardTitle>
                  <CardDescription>
                    Produtos que precisam de reposição
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardData.lowStock.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-3 bg-destructive/5 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Estoque: {product.stock} (Mín: {product.minStock})
                          </p>
                        </div>
                        <Badge variant="destructive">Baixo</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Produtos */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gerenciar Produtos</h2>
              <Button className="bg-primary hover:bg-primary-dark text-white">
                <Plus className="h-4 w-4 mr-2" />
                Novo Produto
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{product.name}</h3>
                          <Badge variant="outline">{product.id}</Badge>
                          {product.featured && (
                            <Badge className="bg-primary text-white">Destaque</Badge>
                          )}
                          {product.promotion.active && (
                            <Badge variant="secondary">
                              {product.promotion.discount}% OFF
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Categoria: {product.category}</span>
                          <span>Preço: R$ {product.price.toFixed(2)}</span>
                          <span>Estoque: {product.stock}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Promoções */}
          <TabsContent value="promotions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gerenciar Promoções</h2>
              <Button className="bg-primary hover:bg-primary-dark text-white">
                <Plus className="h-4 w-4 mr-2" />
                Nova Promoção
              </Button>
            </div>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Promoções Ativas</CardTitle>
                  <CardDescription>
                    Gerencie as promoções ativas na loja
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                      <div>
                        <p className="font-medium">Flash Sale - 50% OFF</p>
                        <p className="text-sm text-muted-foreground">Válida até 31/07/2024</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className="bg-primary text-white">Ativa</Badge>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Liquidação de Inverno</p>
                        <p className="text-sm text-muted-foreground">Válida até 15/08/2024</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="secondary">Programada</Badge>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Conjuntos */}
          <TabsContent value="sets" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gerenciar Conjuntos</h2>
              <Button className="bg-primary hover:bg-primary-dark text-white">
                <Plus className="h-4 w-4 mr-2" />
                Novo Conjunto
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Conjuntos Criados</CardTitle>
                <CardDescription>
                  Gerencie os conjuntos de produtos da loja
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">Conjunto Urban Casual</h3>
                      <p className="text-sm text-muted-foreground">
                        3 itens • R$ 359,90 • 16% desconto
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className="bg-primary text-white">Ativo</Badge>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">Conjunto Street Style</h3>
                      <p className="text-sm text-muted-foreground">
                        3 itens • R$ 399,90 • 17% desconto
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className="bg-primary text-white">Ativo</Badge>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;