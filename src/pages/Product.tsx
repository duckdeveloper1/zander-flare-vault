import { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Heart, Truck, Shield, RotateCcw, Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useFavorites } from "@/hooks/useFavorites";
import { useCart } from "@/hooks/useCart";
import { useReviews } from "@/hooks/useReviews";
import ShareButton from "@/components/ShareButton";
import ReviewForm from "@/components/ReviewForm";
import { generateWhatsAppMessage } from "@/utils/whatsapp";

import productTshirt from "@/assets/product-tshirt.jpg";
import productJeans from "@/assets/product-jeans.jpg";
import productSneakers from "@/assets/product-sneakers.jpg";

// Dados fictícios do produto - facilmente substituíveis por API
const mockProductData = {
  "1": {
    id: "1",
    name: "Camiseta Premium Laranja",
    price: 79.90,
    originalPrice: 99.90,
    discount: 20,
    image: productTshirt,
    images: [productTshirt, productTshirt, productTshirt],
    colorImages: {
      "Laranja": [productTshirt, productTshirt, productTshirt],
      "Branco": [productTshirt],
      "Preto": [productTshirt]
    },
    description: "Camiseta 100% algodão com design moderno e confortável. Perfeita para o dia a dia, oferecendo estilo e conforto em todas as ocasiões.",
    fullDescription: "Esta camiseta premium é confeccionada com algodão 100% de alta qualidade, garantindo maciez e durabilidade. O design moderno e as cores vibrantes fazem dela uma peça essencial para compor looks casuais e despojados. O tecido respirável proporciona conforto durante todo o dia.",
    sizes: ["P", "M", "G", "GG"],
    colors: ["Laranja", "Branco", "Preto"],
    sizeStock: { "P": 5, "M": 10, "G": 15, "GG": 8 },
    colorStock: { "Laranja": 20, "Branco": 5, "Preto": 12 },
    isPromotion: true,
    category: "Camisetas",
    material: "100% Algodão",
    care: "Lavar em água fria, não usar alvejante",
    stock: 15
  }
};

const Product = () => {
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();
  const { reviews, addReview, getAverageRating } = useReviews(id);
  
  // Buscar produto pelos dados fictícios (futuramente será uma chamada API)
  const product = mockProductData[id as keyof typeof mockProductData];

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">Produto não encontrado</h1>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast({
        title: "Selecione as opções",
        description: "Por favor, selecione o tamanho e a cor do produto.",
        variant: "destructive",
      });
      return;
    }

    addToCart(product, quantity, selectedSize, selectedColor);
    toast({
      title: "Produto adicionado!",
      description: `${product.name} foi adicionado ao carrinho.`,
    });
  };

  const handleBuyNow = () => {
    if (!selectedSize || !selectedColor) {
      toast({
        title: "Selecione as opções",
        description: "Por favor, selecione o tamanho e a cor do produto.",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      items: [{
        name: `${product.name} - ${selectedSize} - ${selectedColor}`,
        price: product.price,
        quantity: quantity
      }],
      total: product.price * quantity,
      type: 'direct'
    };

    const whatsappUrl = generateWhatsAppMessage(orderData);
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Redirecionado para WhatsApp!",
      description: "Complete seu pedido via WhatsApp.",
    });
  };

  const handleToggleFavorite = () => {
    toggleFavorite(product);
    toast({
      title: isFavorite(product.id) ? "Removido dos favoritos" : "Adicionado aos favoritos",
      description: isFavorite(product.id) 
        ? `${product.name} foi removido dos favoritos.`
        : `${product.name} foi adicionado aos favoritos.`,
    });
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setSelectedImageIndex(0);
  };

  const getCurrentImages = () => {
    if (selectedColor && product.colorImages && product.colorImages[selectedColor]) {
      return product.colorImages[selectedColor];
    }
    return product.images;
  };

  const isOutOfStock = (size?: string, color?: string) => {
    if (size && product.sizeStock && product.sizeStock[size] <= 0) return true;
    if (color && product.colorStock && product.colorStock[color] <= 0) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Imagens do Produto */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={getCurrentImages()[selectedImageIndex]}
                alt={product.name}
                className="w-full h-96 lg:h-[500px] object-cover rounded-lg"
              />
              {product.isPromotion && product.discount && (
                <Badge className="absolute top-4 left-4 bg-primary text-white text-lg px-3 py-1">
                  -{product.discount}%
                </Badge>
              )}
            </div>
            
            <div className="flex gap-2 overflow-x-auto">
              {getCurrentImages().map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                    selectedImageIndex === index ? "border-primary" : "border-border"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Informações do Produto */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {product.name}
              </h1>
              <p className="text-muted-foreground">
                Categoria: {product.category}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              <span className="text-3xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              
              {/* Avaliações */}
              {reviews.length > 0 && (
                <div className="flex items-center gap-1 ml-4">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{getAverageRating()}</span>
                  <span className="text-sm text-muted-foreground">({reviews.length})</span>
                </div>
              )}
            </div>

            <p className="text-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Seleção de Tamanho */}
            <div>
              <h3 className="font-semibold mb-3">Tamanho</h3>
              <div className="flex gap-2">
                {product.sizes.map((size) => {
                  const isUnavailable = isOutOfStock(size);
                  return (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      onClick={() => !isUnavailable && setSelectedSize(size)}
                      disabled={isUnavailable}
                      className={
                        isUnavailable
                          ? "opacity-50 cursor-not-allowed"
                          : selectedSize === size
                          ? "bg-primary text-white"
                          : "border-primary text-primary hover:bg-primary hover:text-white"
                      }
                    >
                      {size}
                      {isUnavailable && " (Esgotado)"}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Seleção de Cor */}
            <div>
              <h3 className="font-semibold mb-3">Cor</h3>
              <div className="flex gap-2">
                {product.colors.map((color) => {
                  const isUnavailable = isOutOfStock(undefined, color);
                  return (
                    <Button
                      key={color}
                      variant={selectedColor === color ? "default" : "outline"}
                      onClick={() => !isUnavailable && handleColorChange(color)}
                      disabled={isUnavailable}
                      className={
                        isUnavailable
                          ? "opacity-50 cursor-not-allowed"
                          : selectedColor === color
                          ? "bg-primary text-white"
                          : "border-primary text-primary hover:bg-primary hover:text-white"
                      }
                    >
                      {color}
                      {isUnavailable && " (Indisponível)"}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Quantidade */}
            <div>
              <h3 className="font-semibold mb-3">Quantidade</h3>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="space-y-3">
              <Button
                onClick={handleBuyNow}
                className="w-full bg-primary hover:bg-primary-dark text-white text-lg py-6"
                size="lg"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Comprar Agora
              </Button>
              
              <Button
                onClick={handleAddToCart}
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary hover:text-white text-lg py-6"
                size="lg"
              >
                Adicionar ao Carrinho
              </Button>
              
              <div className="flex gap-3">
                <Button 
                  onClick={handleToggleFavorite}
                  variant="outline" 
                  size="lg" 
                  className={`flex-1 ${
                    isFavorite(product.id) 
                      ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' 
                      : 'border-primary text-primary hover:bg-primary hover:text-white'
                  }`}
                >
                  <Heart className={`h-4 w-4 mr-2 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
                  {isFavorite(product.id) ? 'Favoritado' : 'Favoritar'}
                </Button>
                <ShareButton 
                  productId={product.id}
                  productName={product.name}
                  productPrice={product.price}
                  className="flex-1"
                  variant="outline"
                  size="lg"
                />
              </div>
            </div>

            {/* Informações de Entrega */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-primary" />
                    <span className="text-sm">Frete grátis para compras acima de R$ 150</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-primary" />
                    <span className="text-sm">Compra 100% segura</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <RotateCcw className="h-5 w-5 text-primary" />
                    <span className="text-sm">Troca grátis em até 30 dias</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Abas de Informação Adicional */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Descrição</TabsTrigger>
              <TabsTrigger value="specifications">Especificações</TabsTrigger>
              <TabsTrigger value="reviews">Avaliações</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <p className="text-foreground leading-relaxed">
                    {product.fullDescription}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Material</h4>
                      <p className="text-muted-foreground">{product.material}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Cuidados</h4>
                      <p className="text-muted-foreground">{product.care}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Disponibilidade</h4>
                      <p className="text-muted-foreground">{product.stock} unidades em estoque</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                {/* Estatísticas das avaliações */}
                {reviews.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary">{getAverageRating()}</div>
                          <div className="flex items-center justify-center gap-1 mb-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= Math.round(getAverageRating())
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {reviews.length} {reviews.length === 1 ? 'avaliação' : 'avaliações'}
                          </div>
                        </div>
                      </div>
                      
                      {/* Lista de avaliações */}
                      <div className="space-y-4 border-t pt-4">
                        {reviews.slice(0, 5).map((review) => (
                          <div key={review.id} className="border-b pb-4 last:border-b-0">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-3 w-3 ${
                                      star <= review.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="font-medium text-sm">
                                {review.isAnonymous ? 'Anônimo' : review.userName}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(review.date).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                            <p className="text-sm text-foreground">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {/* Formulário de avaliação */}
                <ReviewForm productId={product.id} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Product;