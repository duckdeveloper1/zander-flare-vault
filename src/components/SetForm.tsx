import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Upload } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import { toast } from 'sonner';

interface SetFormProps {
  onClose: () => void;
}

const SetForm = ({ onClose }: SetFormProps) => {
  const { addSet, products } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    discount: '',
  });
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [setImage, setSetImage] = useState<string>('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSetImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductToggle = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const calculatePrices = () => {
    const selectedProductData = products.filter(p => selectedProducts.includes(p.id));
    const totalOriginalPrice = selectedProductData.reduce((sum, product) => sum + product.price, 0);
    const discount = parseFloat(formData.discount) || 0;
    const finalPrice = totalOriginalPrice * (1 - discount / 100);
    
    return {
      originalPrice: totalOriginalPrice,
      finalPrice,
      discount
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (selectedProducts.length < 2) {
      toast.error('Selecione pelo menos 2 produtos para criar um conjunto');
      return;
    }

    if (!setImage) {
      toast.error('Adicione uma imagem para o conjunto');
      return;
    }

    const { originalPrice, finalPrice, discount } = calculatePrices();

    const set = {
      name: formData.name,
      description: formData.description,
      products: selectedProducts,
      price: finalPrice,
      originalPrice,
      discount,
      image: setImage,
      status: 'active' as const,
    };

    addSet(set);
    toast.success('Conjunto criado com sucesso!');
    onClose();
  };

  const { originalPrice, finalPrice, discount } = calculatePrices();

  if (products.length === 0) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Criar Novo Conjunto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Para criar conjuntos, você precisa ter produtos cadastrados primeiro.
            </p>
            <Button onClick={onClose} variant="outline">
              Entendi
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <CardHeader>
        <CardTitle>Criar Novo Conjunto</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Nome do Conjunto *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Conjunto Urban Casual"
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descrição do conjunto"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="discount">Desconto do Conjunto (%)</Label>
            <Input
              id="discount"
              type="number"
              min="0"
              max="50"
              value={formData.discount}
              onChange={(e) => setFormData(prev => ({ ...prev, discount: e.target.value }))}
              placeholder="Ex: 15"
            />
          </div>

          {/* Upload de Imagem */}
          <div>
            <Label>Imagem do Conjunto *</Label>
            <div className="mt-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="set-image"
              />
              <label
                htmlFor="set-image"
                className="flex items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
              >
                {setImage ? (
                  <img src={setImage} alt="Conjunto" className="h-full w-full object-cover rounded-lg" />
                ) : (
                  <div className="text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Clique para adicionar imagem</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Seleção de Produtos */}
          <div>
            <Label>Selecionar Produtos *</Label>
            <p className="text-sm text-muted-foreground mb-4">
              Selecione pelo menos 2 produtos para formar o conjunto
            </p>
            <div className="space-y-2 max-h-40 overflow-y-auto border rounded p-4">
              {products.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={product.id}
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={() => handleProductToggle(product.id)}
                    />
                    <div>
                      <Label htmlFor={product.id} className="text-sm cursor-pointer font-medium">
                        {product.name}
                      </Label>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                    </div>
                  </div>
                  <Badge variant="outline">R$ {product.price.toFixed(2)}</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Resumo do Conjunto */}
          {selectedProducts.length > 0 && (
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">Resumo do Conjunto</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Produtos selecionados:</span>
                    <span>{selectedProducts.length} itens</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Preço original:</span>
                    <span>R$ {originalPrice.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-primary">
                      <span>Desconto ({discount}%):</span>
                      <span>- R$ {(originalPrice - finalPrice).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                    <span>Preço final:</span>
                    <span>R$ {finalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary-dark text-white"
              disabled={selectedProducts.length < 2}
            >
              Criar Conjunto
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SetForm;