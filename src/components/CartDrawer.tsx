import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCart, CartItem } from "@/hooks/useCart";
import { generateWhatsAppMessage } from "@/utils/whatsapp";
import { toast } from "@/hooks/use-toast";

interface CartDrawerProps {
  children: React.ReactNode;
}

const CartDrawer = ({ children }: CartDrawerProps) => {
  const { cartItems, updateQuantity, removeFromCart, getTotalItems, getTotalPrice, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const handleQuantityChange = (item: CartItem, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(item.id, item.selectedSize, item.selectedColor);
    } else {
      updateQuantity(item.id, newQuantity, item.selectedSize, item.selectedColor);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos ao carrinho antes de finalizar a compra.",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      items: cartItems.map(item => ({
        name: `${item.name} - ${item.selectedSize || 'N/A'} - ${item.selectedColor || 'N/A'}`,
        price: item.price,
        quantity: item.quantity
      })),
      total: getTotalPrice(),
      type: 'cart'
    };

    const whatsappUrl = generateWhatsAppMessage(orderData);
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Pedido enviado!",
      description: "Você será redirecionado para o WhatsApp para finalizar o pedido.",
    });

    clearCart();
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div className="relative">
          {children}
          {getTotalItems() > 0 && (
            <Badge 
              className="absolute -top-2 -right-2 bg-primary text-white min-w-[20px] h-5 flex items-center justify-center text-xs"
            >
              {getTotalItems()}
            </Badge>
          )}
        </div>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Carrinho ({getTotalItems()} {getTotalItems() === 1 ? 'item' : 'itens'})
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Carrinho vazio</h3>
              <p className="text-muted-foreground mb-4">
                Adicione produtos ao carrinho para continuar
              </p>
              <Button onClick={() => setIsOpen(false)} variant="outline">
                Continuar Comprando
              </Button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {cartItems.map((item, index) => (
                  <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}-${index}`} className="flex gap-3 p-3 border rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                      <div className="text-xs text-muted-foreground space-y-1">
                        {item.selectedSize && <p>Tamanho: {item.selectedSize}</p>}
                        {item.selectedColor && <p>Cor: {item.selectedColor}</p>}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-semibold text-primary">
                          {formatPrice(item.price)}
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleQuantityChange(item, item.quantity - 1)}
                            className="h-7 w-7 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleQuantityChange(item, item.quantity + 1)}
                            className="h-7 w-7 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-xl font-bold text-primary">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-primary hover:bg-primary-dark text-white"
                    size="lg"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Finalizar Pedido
                  </Button>
                  
                  <Button
                    onClick={() => setIsOpen(false)}
                    variant="outline"
                    className="w-full"
                  >
                    Continuar Comprando
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;