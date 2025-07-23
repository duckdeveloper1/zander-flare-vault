import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { X, Plus, Upload } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import { toast } from 'sonner';

interface ProductFormProps {
  onClose: () => void;
}

const ProductForm = ({ onClose }: ProductFormProps) => {
  const { addProduct } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    originalPrice: '',
    stock: '',
    description: '',
    featured: false,
    promotionActive: false,
    promotionDiscount: '',
  });
  const [images, setImages] = useState<string[]>([]);
  const [colors, setColors] = useState<{ name: string; image?: string }[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [newColor, setNewColor] = useState('');
  const [newSize, setNewSize] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setImages(prev => [...prev, event.target.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleColorImageUpload = (colorIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setColors(prev => prev.map((color, index) => 
            index === colorIndex ? { ...color, image: event.target.result as string } : color
          ));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addColor = () => {
    if (newColor.trim()) {
      setColors(prev => [...prev, { name: newColor.trim() }]);
      setNewColor('');
    }
  };

  const removeColor = (index: number) => {
    setColors(prev => prev.filter((_, i) => i !== index));
  };

  const addSize = () => {
    if (newSize.trim() && !sizes.includes(newSize.trim())) {
      setSizes(prev => [...prev, newSize.trim()]);
      setNewSize('');
    }
  };

  const removeSize = (size: string) => {
    setSizes(prev => prev.filter(s => s !== size));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.price || !formData.stock) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (images.length === 0) {
      toast.error('Adicione pelo menos uma imagem do produto');
      return;
    }

    const product = {
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      stock: parseInt(formData.stock),
      status: 'active' as const,
      featured: formData.featured,
      images,
      description: formData.description,
      colors: colors.length > 0 ? colors : undefined,
      sizes,
      promotion: formData.promotionActive ? {
        active: true,
        discount: parseInt(formData.promotionDiscount)
      } : { active: false, discount: 0 }
    };

    addProduct(product);
    toast.success('Produto criado com sucesso!');
    onClose();
  };

  return (
    <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <CardHeader>
        <CardTitle>Criar Novo Produto</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome do Produto *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Camiseta Premium"
              />
            </div>
            <div>
              <Label htmlFor="category">Categoria *</Label>
              <Select onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="camisetas">Camisetas</SelectItem>
                  <SelectItem value="calcas">Calças</SelectItem>
                  <SelectItem value="calcados">Calçados</SelectItem>
                  <SelectItem value="acessorios">Acessórios</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="price">Preço *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="originalPrice">Preço Original</Label>
              <Input
                id="originalPrice"
                type="number"
                step="0.01"
                value={formData.originalPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="stock">Estoque *</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descrição detalhada do produto"
              rows={3}
            />
          </div>

          {/* Upload de Imagens */}
          <div>
            <Label>Imagens do Produto *</Label>
            <div className="mt-2">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="product-images"
              />
              <label
                htmlFor="product-images"
                className="flex items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
              >
                <div className="text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Clique para adicionar imagens</p>
                </div>
              </label>
            </div>
            {images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img src={image} alt={`Produto ${index + 1}`} className="w-20 h-20 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => setImages(prev => prev.filter((_, i) => i !== index))}
                      className="absolute -top-2 -right-2 bg-destructive text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cores */}
          <div>
            <Label>Cores Disponíveis</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                placeholder="Nome da cor"
                className="flex-1"
              />
              <Button type="button" onClick={addColor} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {colors.length > 0 && (
              <div className="space-y-2 mt-4">
                {colors.map((color, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 border rounded">
                    <Badge variant="outline">{color.name}</Badge>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleColorImageUpload(index, e)}
                      className="hidden"
                      id={`color-${index}`}
                    />
                    <label
                      htmlFor={`color-${index}`}
                      className="text-xs bg-muted px-2 py-1 rounded cursor-pointer hover:bg-muted/80"
                    >
                      {color.image ? 'Trocar Foto' : 'Adicionar Foto'}
                    </label>
                    {color.image && (
                      <img src={color.image} alt={color.name} className="w-8 h-8 object-cover rounded" />
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeColor(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tamanhos */}
          <div>
            <Label>Tamanhos Disponíveis</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                placeholder="Ex: P, M, G, 38, 40"
                className="flex-1"
              />
              <Button type="button" onClick={addSize} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {sizes.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {sizes.map((size) => (
                  <Badge key={size} variant="outline" className="cursor-pointer" onClick={() => removeSize(size)}>
                    {size} <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Configurações */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="featured">Produto em Destaque</Label>
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="promotion">Produto em Promoção</Label>
              <Switch
                id="promotion"
                checked={formData.promotionActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, promotionActive: checked }))}
              />
            </div>

            {formData.promotionActive && (
              <div>
                <Label htmlFor="discount">Desconto (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.promotionDiscount}
                  onChange={(e) => setFormData(prev => ({ ...prev, promotionDiscount: e.target.value }))}
                  placeholder="Ex: 20"
                />
              </div>
            )}
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary-dark text-white">
              Criar Produto
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductForm;