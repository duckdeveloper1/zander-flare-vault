import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useReviews } from "@/hooks/useReviews";
import { toast } from "@/hooks/use-toast";

interface ReviewFormProps {
  productId: string;
  onReviewAdded?: () => void;
}

const ReviewForm = ({ productId, onReviewAdded }: ReviewFormProps) => {
  const { addReview } = useReviews(productId);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [userName, setUserName] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Avaliação obrigatória",
        description: "Por favor, selecione uma nota de 1 a 5 estrelas.",
        variant: "destructive",
      });
      return;
    }

    if (comment.trim().length < 10) {
      toast({
        title: "Comentário muito curto",
        description: "O comentário deve ter pelo menos 10 caracteres.",
        variant: "destructive",
      });
      return;
    }

    if (!isAnonymous && userName.trim().length < 2) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe seu nome ou marque como anônimo.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      addReview(rating, comment.trim(), isAnonymous ? undefined : userName.trim(), isAnonymous);
      
      toast({
        title: "Avaliação enviada!",
        description: "Obrigado por avaliar este produto.",
      });

      // Reset form
      setRating(0);
      setComment("");
      setUserName("");
      setIsAnonymous(false);
      
      onReviewAdded?.();
    } catch (error) {
      toast({
        title: "Erro ao enviar avaliação",
        description: "Tente novamente em alguns momentos.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Avalie este produto</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating Stars */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Sua nota *</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="text-2xl transition-colors hover:scale-110"
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                {rating === 1 && "Muito ruim"}
                {rating === 2 && "Ruim"}
                {rating === 3 && "Regular"}
                {rating === 4 && "Bom"}
                {rating === 5 && "Excelente"}
              </p>
            )}
          </div>

          {/* Comment */}
          <div>
            <Label htmlFor="comment" className="text-sm font-medium mb-2 block">
              Comentário *
            </Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Conte-nos sobre sua experiência com este produto..."
              className="min-h-[100px]"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {comment.length}/500 caracteres (mínimo 10)
            </p>
          </div>

          {/* Anonymous option */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
            />
            <Label htmlFor="anonymous" className="text-sm">
              Avaliar anonimamente
            </Label>
          </div>

          {/* Name field (only if not anonymous) */}
          {!isAnonymous && (
            <div>
              <Label htmlFor="userName" className="text-sm font-medium mb-2 block">
                Seu nome *
              </Label>
              <Input
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Digite seu nome"
                maxLength={50}
              />
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary-dark text-white"
          >
            {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;