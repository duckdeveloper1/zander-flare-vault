import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Share2, Copy, MessageCircle, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ShareButtonProps {
  productId: string;
  productName: string;
  productPrice: number;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

const ShareButton = ({ productId, productName, productPrice, className, variant = "outline", size = "lg" }: ShareButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const productUrl = `${window.location.origin}/product/${productId}`;
  const shareText = `Confira este produto incrível: ${productName} por apenas R$ ${productPrice.toFixed(2).replace('.', ',')}`;
  
  const formatPrice = (price: number) => {
    return price.toFixed(2).replace('.', ',');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      toast({
        title: "Link copiado!",
        description: "O link do produto foi copiado para a área de transferência.",
      });
      setIsOpen(false);
    } catch (err) {
      console.error('Erro ao copiar link:', err);
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o link. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const shareToWhatsApp = () => {
    const message = encodeURIComponent(`${shareText}\n\n${productUrl}`);
    const whatsappUrl = `https://wa.me/?text=${message}`;
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
  };

  const shareToTelegram = () => {
    const message = encodeURIComponent(`${shareText}\n\n${productUrl}`);
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(telegramUrl, '_blank');
    setIsOpen(false);
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: productName,
          text: shareText,
          url: productUrl,
        });
        setIsOpen(false);
      } catch (err) {
        console.error('Erro ao compartilhar:', err);
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Share2 className="h-4 w-4 mr-2" />
          Compartilhar
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="center">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Compartilhar produto</h4>
            <p className="text-sm text-muted-foreground">
              {productName} - R$ {formatPrice(productPrice)}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Link do produto:</label>
            <div className="flex gap-2">
              <Input
                value={productUrl}
                readOnly
                className="flex-1 text-xs"
              />
              <Button size="sm" onClick={copyToClipboard} variant="outline">
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button onClick={shareToWhatsApp} variant="outline" size="sm" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-green-600" />
              WhatsApp
            </Button>
            
            <Button onClick={shareToTelegram} variant="outline" size="sm" className="flex items-center gap-2">
              <Send className="h-4 w-4 text-blue-500" />
              Telegram
            </Button>
          </div>

          {navigator.share && (
            <Button onClick={shareNative} className="w-full" variant="default">
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ShareButton;