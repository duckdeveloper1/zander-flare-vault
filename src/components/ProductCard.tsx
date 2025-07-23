import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Eye, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useFavorites } from "@/hooks/useFavorites";
import { useCart } from "@/hooks/useCart";
import { toast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  description: string;
  isPromotion?: boolean;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const handleAddToCart = () => {
    addToCart(product, 1);
    toast({
      title: "Produto adicionado!",
      description: `${product.name} foi adicionado ao carrinho.`,
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

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden border-2 hover:border-primary/30">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.isPromotion && product.discount && (
          <Badge className="absolute top-2 left-2 bg-primary text-white">
            -{product.discount}%
          </Badge>
        )}
        <Button
          size="sm"
          variant="ghost"
          onClick={handleToggleFavorite}
          className={`absolute top-2 right-2 h-8 w-8 p-0 hover:bg-white/90 ${
            isFavorite(product.id) ? 'text-red-500' : 'text-gray-400'
          }`}
        >
          <Heart className={`h-4 w-4 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
        </Button>
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center gap-2 mb-4">
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
          <span className="text-xl font-bold text-primary">
            {formatPrice(product.price)}
          </span>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={handleAddToCart}
            size="sm"
            className="flex-1 bg-primary hover:bg-primary-dark text-white"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Carrinho
          </Button>
          
          <Link to={`/product/${product.id}`}>
            <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-white">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;