import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Zap, Star, TrendingUp, Package } from "lucide-react";
import { useStore } from "@/contexts/StoreContext";

import heroFashion from "@/assets/hero-fashion.jpg";
import productTshirt from "@/assets/product-tshirt.jpg";
import productJeans from "@/assets/product-jeans.jpg";
import productSneakers from "@/assets/product-sneakers.jpg";

// Dados fictícios - facilmente substituíveis por API
const heroSlides = [
  {
    id: 1,
    image: heroFashion,
    title: "Nova Coleção 2024",
    subtitle: "Descubra as últimas tendências da moda",
    cta: "Ver Coleção"
  },
  {
    id: 2,
    image: heroFashion,
    title: "Promoções Imperdíveis",
    subtitle: "Até 50% OFF em peças selecionadas",
    cta: "Comprar Agora"
  },
  {
    id: 3,
    image: heroFashion,
    title: "Estilo Urbano",
    subtitle: "Para quem não abre mão do conforto e estilo",
    cta: "Explorar"
  }
];

const featuredProducts = [
  {
    id: "1",
    name: "Camiseta Premium Laranja",
    price: 79.90,
    originalPrice: 99.90,
    discount: 20,
    image: productTshirt,
    description: "Camiseta 100% algodão com design moderno",
    isPromotion: true
  },
  {
    id: "2",
    name: "Calça Jeans Premium",
    price: 149.90,
    image: productJeans,
    description: "Calça jeans de alta qualidade com corte moderno",
    isPromotion: false
  },
  {
    id: "3",
    name: "Tênis Casual Branco",
    price: 199.90,
    originalPrice: 249.90,
    discount: 25,
    image: productSneakers,
    description: "Tênis casual confortável para o dia a dia",
    isPromotion: true
  }
];

const Index = () => {
  const { products, promotions, sets } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Produtos em destaque
  const featuredProducts = products.filter(product => product.featured);
  
  // Promoções ativas
  const activePromotions = promotions.filter(promotion => promotion.status === 'active');
  
  // Conjuntos ativos
  const activeSets = sets.filter(set => set.status === 'active');

  // Auto slide do hero
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Slider */}
      <section className="relative h-[60vh] lg:h-[70vh] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
              index === currentSlide ? "translate-x-0" : 
              index < currentSlide ? "-translate-x-full" : "translate-x-full"
            }`}
          >
            <div className="relative h-full">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white max-w-2xl px-4">
                  <h1 className="text-4xl lg:text-6xl font-bold mb-4">
                    {slide.title}
                  </h1>
                  <p className="text-xl lg:text-2xl mb-8 opacity-90">
                    {slide.subtitle}
                  </p>
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary-dark text-white px-8 py-4 text-lg"
                  >
                    {slide.cta}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Controles do Slider */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-all"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-all"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Indicadores */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? "bg-primary" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Seção de Promoções - só aparece se houver promoções ativas */}
      {activePromotions.length > 0 && (
        <section className="py-16 bg-gradient-to-r from-primary/10 to-primary-glow/10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Zap className="h-6 w-6 text-primary" />
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                  Promoções Relâmpago
                </h2>
              </div>
              <p className="text-muted-foreground text-lg">
                Ofertas por tempo limitado - não perca!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {activePromotions.slice(0, 3).map((promotion) => (
                <Card key={promotion.id} className="bg-primary text-white border-primary">
                  <CardContent className="p-6 text-center">
                    <Badge variant="secondary" className="mb-4 bg-white text-primary">
                      OFERTA ESPECIAL
                    </Badge>
                    <h3 className="text-2xl font-bold mb-2">
                      {promotion.type === 'percentage' ? `${promotion.discount}% OFF` : `R$ ${promotion.discount} OFF`}
                    </h3>
                    <p className="text-primary-foreground/80 mb-4">
                      {promotion.description}
                    </p>
                    <Link to="/promotions">
                      <Button variant="secondary" className="w-full">
                        Ver Ofertas
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
              
              {/* Cards de promoções fixas se houver espaço */}
              {activePromotions.length < 2 && (
                <Card className="border-primary/20">
                  <CardContent className="p-6 text-center">
                    <Badge variant="outline" className="mb-4 border-primary text-primary">
                      FRETE GRÁTIS
                    </Badge>
                    <h3 className="text-2xl font-bold mb-2 text-foreground">R$ 150+</h3>
                    <p className="text-muted-foreground mb-4">
                      Compras acima de R$ 150
                    </p>
                    <Link to="/catalog">
                      <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white">
                        Comprar Agora
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Recomendados para Você - só aparece se houver produtos */}
      {products.length > 0 && (
        <section className="py-16 bg-gradient-to-r from-muted/10 to-muted/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Star className="h-6 w-6 text-primary" />
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                  Recomendados para Você
                </h2>
              </div>
              <p className="text-muted-foreground text-lg">
                Baseado no seu histórico de navegação e preferências
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {products.slice(0, 3).map((product) => (
                <ProductCard key={product.id} product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  originalPrice: product.originalPrice,
                  discount: product.promotion?.active ? product.promotion.discount : undefined,
                  image: product.images[0] || productTshirt,
                  description: product.description,
                  isPromotion: product.promotion?.active || false
                }} />
              ))}
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                💡 Dica: Seus produtos recomendados são atualizados com base na sua navegação
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Produtos em Destaque */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                Produtos em Destaque
              </h2>
            </div>
            <p className="text-muted-foreground text-lg">
              Os mais vendidos e amados pelos nossos clientes
            </p>
          </div>

          {featuredProducts.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Em breve: Produtos em Destaque</h3>
              <p className="text-muted-foreground">
                Estamos preparando uma seleção especial de produtos para você. Volte em breve!
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    originalPrice: product.originalPrice,
                    discount: product.promotion?.active ? product.promotion.discount : undefined,
                    image: product.images[0] || productTshirt,
                    description: product.description,
                    isPromotion: product.promotion?.active || false
                  }} />
                ))}
              </div>

              <div className="text-center">
                <Link to="/catalog">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary-dark text-white px-8"
                  >
                    Ver Catálogo Completo
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Seção de Conjuntos - só aparece se houver conjuntos */}
      <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                Conjuntos Coordenados
              </h2>
            </div>
            <p className="text-muted-foreground text-lg">
              Looks completos pensados especialmente para você
            </p>
          </div>

          {activeSets.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Em breve: Conjuntos Especiais</h3>
              <p className="text-muted-foreground">
                Estamos criando looks incríveis e coordenados para você. Aguarde as novidades!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {activeSets.slice(0, 2).map((set) => (
                <Card key={set.id} className="group hover:shadow-lg transition-all duration-300">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={set.image}
                      alt={set.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 left-4 bg-primary text-white">
                      LOOK COMPLETO
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-foreground">
                      {set.name}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {set.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-primary">
                          R$ {set.price.toFixed(2)}
                        </span>
                        {set.discount > 0 && (
                          <p className="text-sm text-muted-foreground line-through">
                            R$ {set.originalPrice.toFixed(2)}
                          </p>
                        )}
                      </div>
                      <Button className="bg-primary hover:bg-primary-dark text-white">
                        Ver Conjunto
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-accent text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-primary mb-4">Zander Store</h3>
              <p className="text-accent-foreground/80">
                Sua loja de moda moderna com as melhores tendências e qualidade.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-accent-foreground">Navegação</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-accent-foreground/80 hover:text-primary transition-colors">Home</Link></li>
                <li><Link to="/catalog" className="text-accent-foreground/80 hover:text-primary transition-colors">Catálogo</Link></li>
                <li><Link to="/promotions" className="text-accent-foreground/80 hover:text-primary transition-colors">Promoções</Link></li>
                <li><Link to="/sets" className="text-accent-foreground/80 hover:text-primary transition-colors">Conjuntos</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-accent-foreground">Atendimento</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-accent-foreground/80 hover:text-primary transition-colors">Contato</a></li>
                <li><a href="#" className="text-accent-foreground/80 hover:text-primary transition-colors">Trocas e Devoluções</a></li>
                <li><a href="#" className="text-accent-foreground/80 hover:text-primary transition-colors">Guia de Tamanhos</a></li>
                <li><a href="#" className="text-accent-foreground/80 hover:text-primary transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-accent-foreground">Redes Sociais</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-accent-foreground/80 hover:text-primary transition-colors">Instagram</a></li>
                <li><a href="#" className="text-accent-foreground/80 hover:text-primary transition-colors">Facebook</a></li>
                <li><a href="#" className="text-accent-foreground/80 hover:text-primary transition-colors">TikTok</a></li>
                <li><a href="#" className="text-accent-foreground/80 hover:text-primary transition-colors">WhatsApp</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-accent-foreground/20 mt-8 pt-8 text-center">
            <p className="text-accent-foreground/60">
              © 2024 Zander Store. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;