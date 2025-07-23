import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ProductForm from "@/components/ProductForm";
import PromotionForm from "@/components/PromotionForm";
import SetForm from "@/components/SetForm";
import { useStore } from "@/contexts/StoreContext";
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
  }
};

const Admin = () => {
  const { products, promotions, sets } = useStore();
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [isPromotionFormOpen, setIsPromotionFormOpen] = useState(false);
  const [isSetFormOpen, setIsSetFormOpen] = useState(false);

  // Produtos com estoque baixo (menos de 10 unidades)
  const lowStockProducts = products.filter(product => product.stock < 10);

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
                  {lowStockProducts.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      {products.length === 0 
                        ? "Nenhum produto cadastrado ainda." 
                        : "Todos os produtos estão com estoque adequado."
                      }
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {lowStockProducts.map((product) => (
                        <div key={product.id} className="flex items-center justify-between p-3 bg-destructive/5 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{product.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Estoque: {product.stock} unidades
                            </p>
                          </div>
                          <Badge variant="destructive">Baixo</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Produtos */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gerenciar Produtos</h2>
              <Button 
                className="bg-primary hover:bg-primary-dark text-white"
                onClick={() => setIsProductFormOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Produto
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                {products.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Nenhum produto cadastrado</h3>
                    <p className="text-muted-foreground mb-4">
                      Comece criando seu primeiro produto para aparecer na loja.
                    </p>
                    <Button onClick={() => setIsProductFormOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Primeiro Produto
                    </Button>
                  </div>
                ) : (
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
                            {product.promotion?.active && (
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
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Promoções */}
          <TabsContent value="promotions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gerenciar Promoções</h2>
              <Button 
                className="bg-primary hover:bg-primary-dark text-white"
                onClick={() => setIsPromotionFormOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Promoção
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Promoções</CardTitle>
                <CardDescription>
                  Gerencie as promoções da loja
                </CardDescription>
              </CardHeader>
              <CardContent>
                {promotions.length === 0 ? (
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Nenhuma promoção criada</h3>
                    <p className="text-muted-foreground mb-4">
                      Crie promoções para atrair mais clientes e aumentar as vendas.
                    </p>
                    <Button onClick={() => setIsPromotionFormOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Primeira Promoção
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {promotions.map((promotion) => (
                      <div key={promotion.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{promotion.title}</p>
                          <p className="text-sm text-muted-foreground">Válida até {new Date(promotion.validUntil).toLocaleDateString()}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge 
                            className={
                              promotion.status === 'active' ? 'bg-primary text-white' :
                              promotion.status === 'scheduled' ? 'bg-secondary' : 'bg-muted'
                            }
                          >
                            {promotion.status === 'active' ? 'Ativa' :
                             promotion.status === 'scheduled' ? 'Programada' : 'Inativa'}
                          </Badge>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Conjuntos */}
          <TabsContent value="sets" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gerenciar Conjuntos</h2>
              <Button 
                className="bg-primary hover:bg-primary-dark text-white"
                onClick={() => setIsSetFormOpen(true)}
              >
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
                {sets.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Nenhum conjunto criado</h3>
                    <p className="text-muted-foreground mb-4">
                      {products.length === 0 
                        ? "Crie produtos primeiro para poder formar conjuntos."
                        : "Crie conjuntos combinando produtos para oferecer descontos especiais."
                      }
                    </p>
                    <Button 
                      onClick={() => setIsSetFormOpen(true)}
                      disabled={products.length === 0}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Primeiro Conjunto
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sets.map((set) => (
                      <div key={set.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold">{set.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {set.products.length} itens • R$ {set.price.toFixed(2)} • {set.discount.toFixed(0)}% desconto
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
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs dos Formulários */}
      <Dialog open={isProductFormOpen} onOpenChange={setIsProductFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          <ProductForm onClose={() => setIsProductFormOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isPromotionFormOpen} onOpenChange={setIsPromotionFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
          <PromotionForm onClose={() => setIsPromotionFormOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isSetFormOpen} onOpenChange={setIsSetFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
          <SetForm onClose={() => setIsSetFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;