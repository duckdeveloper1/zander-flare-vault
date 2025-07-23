import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useStore } from '@/contexts/StoreContext';
import { toast } from 'sonner';

interface PromotionFormProps {
  onClose: () => void;
}

const PromotionForm = ({ onClose }: PromotionFormProps) => {
  const { addPromotion, products } = useStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount: '',
    validUntil: '',
    type: 'percentage' as 'percentage' | 'fixed',
    status: 'active' as 'active' | 'inactive' | 'scheduled',
  });
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.discount || !formData.validUntil) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const promotion = {
      title: formData.title,
      description: formData.description,
      discount: parseFloat(formData.discount),
      validUntil: formData.validUntil,
      type: formData.type,
      status: formData.status,
      applicableProducts: selectedProducts.length > 0 ? selectedProducts : undefined,
    };

    addPromotion(promotion);
    toast.success('Promoção criada com sucesso!');
    onClose();
  };

  const handleProductToggle = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <CardHeader>
        <CardTitle>Criar Nova Promoção</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Título da Promoção *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ex: Flash Sale - 50% OFF"
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descrição detalhada da promoção"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Tipo de Desconto *</Label>
              <Select onValueChange={(value: 'percentage' | 'fixed') => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Porcentagem (%)</SelectItem>
                  <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="discount">
                Desconto * {formData.type === 'percentage' ? '(%)' : '(R$)'}
              </Label>
              <Input
                id="discount"
                type="number"
                step={formData.type === 'percentage' ? '1' : '0.01'}
                min="0"
                max={formData.type === 'percentage' ? '100' : undefined}
                value={formData.discount}
                onChange={(e) => setFormData(prev => ({ ...prev, discount: e.target.value }))}
                placeholder={formData.type === 'percentage' ? '20' : '50.00'}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="validUntil">Válida Até *</Label>
              <Input
                id="validUntil"
                type="date"
                value={formData.validUntil}
                onChange={(e) => setFormData(prev => ({ ...prev, validUntil: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="status">Status *</Label>
              <Select onValueChange={(value: 'active' | 'inactive' | 'scheduled') => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativa</SelectItem>
                  <SelectItem value="scheduled">Programada</SelectItem>
                  <SelectItem value="inactive">Inativa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Produtos Aplicáveis */}
          <div>
            <Label>Produtos Aplicáveis</Label>
            <p className="text-sm text-muted-foreground mb-4">
              Deixe em branco para aplicar a todos os produtos
            </p>
            {products.length === 0 ? (
              <p className="text-sm text-muted-foreground p-4 border rounded bg-muted/50">
                Nenhum produto cadastrado ainda. Crie produtos primeiro para aplicar promoções específicas.
              </p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto border rounded p-4">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={product.id}
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={() => handleProductToggle(product.id)}
                    />
                    <Label htmlFor={product.id} className="text-sm cursor-pointer">
                      {product.name} - R$ {product.price.toFixed(2)}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary-dark text-white">
              Criar Promoção
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PromotionForm;