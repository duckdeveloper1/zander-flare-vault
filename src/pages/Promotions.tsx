import { useState } from "react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Percent, Clock, TrendingDown } from "lucide-react";

import productTshirt from "@/assets/product-tshirt.jpg";
import productJeans from "@/assets/product-jeans.jpg";
import productSneakers from "@/assets/product-sneakers.jpg";

const promotionalProducts = [
  {
    id: "1",
    name: "Camiseta Premium Laranja",
    price: 79.90,
    originalPrice: 99.90,
    discount: 20,
    image: productTshirt,
    description: "Camiseta 100% algodão com design moderno",
    isPromotion: true,
    category: "camisetas"
  },
  {
    id: "3",
    name: "Tênis Casual Branco",
    price: 199.90,
    originalPrice: 249.90,
    discount: 25,
    image: productSneakers,
    description: "Tênis casual confortável para o dia a dia",
    isPromotion: true,
    category: "calcados"
  },
  {
    id: "4",
    name: "Calça Cargo Preta",
    price: 129.90,
    originalPrice: 179.90,
    discount: 28,
    image: productJeans,
    description: "Calça cargo resistente com múltiplos bolsos",
    isPromotion: true,
    category: "calcas"
  },
  {
    id: "5",
    name: "Jaqueta Bomber",
    price: 189.90,
    originalPrice: 259.90,
    discount: 35,
    image: productTshirt,
    description: "Jaqueta bomber moderna e confortável",
    isPromotion: true,
    category: "jaquetas"
  },
  {
    id: "6",
    name: "Tênis Esportivo",
    price: 159.90,
    originalPrice: 219.90,
    discount: 30,
    image: productSneakers,
    description: "Tênis para corrida e atividades físicas",
    isPromotion: true,
    category: "calcados"
  },
  {
    id: "7",
    name: "Camiseta Básica Kit",
    price: 99.90,
    originalPrice: 149.90,
    discount: 33,
    image: productTshirt,
    description: "Kit com 3 camisetas básicas essenciais",
    isPromotion: true,
    category: "camisetas"
  }
];

const Promotions = () => {
  const [filteredProducts, setFilteredProducts] = useState(promotionalProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterProducts(term, selectedCategory, sortBy);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    filterProducts(searchTerm, category, sortBy);
  };

  const handleSort = (sort: string) => {
    setSortBy(sort);
    filterProducts(searchTerm, selectedCategory, sort);
  };

  const filterProducts = (search: string, category: string, sort: string) => {
    let filtered = [...promotionalProducts];

    if (search) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "all") {
      filtered = filtered.filter(product => product.category === category);
    }

    switch (sort) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "discount":
        filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredProducts(filtered);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-r from-primary/20 to-primary-glow/20 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Percent className="h-8 w-8 text-primary" />
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
              Promoções
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Os melhores preços em roupas de qualidade
          </p>
        </div>
      </section>

      {/* Promoções Especiais */}
      <section className="py-12 bg-gradient-to-r from-primary to-primary-glow text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <Clock className="h-12 w-12 mx-auto mb-4 text-primary-glow" />
                <h3 className="text-xl font-bold mb-2">Flash Sale</h3>
                <p className="mb-4">Apenas 24 horas!</p>
                <Badge className="bg-white text-primary font-bold">
                  ATÉ 50% OFF
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <TrendingDown className="h-12 w-12 mx-auto mb-4 text-primary-glow" />
                <h3 className="text-xl font-bold mb-2">Liquidação</h3>
                <p className="mb-4">Últimas peças!</p>
                <Badge className="bg-white text-primary font-bold">
                  ATÉ 70% OFF
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <Percent className="h-12 w-12 mx-auto mb-4 text-primary-glow" />
                <h3 className="text-xl font-bold mb-2">Combo</h3>
                <p className="mb-4">Leve 3 pague 2!</p>
                <Badge className="bg-white text-primary font-bold">
                  33% OFF
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Filtros */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Buscar produtos em promoção..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCategory} onValueChange={handleCategoryFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Categorias</SelectItem>
                <SelectItem value="camisetas">Camisetas</SelectItem>
                <SelectItem value="calcas">Calças</SelectItem>
                <SelectItem value="calcados">Calçados</SelectItem>
                <SelectItem value="jaquetas">Jaquetas</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={handleSort}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nome</SelectItem>
                <SelectItem value="price-asc">Menor Preço</SelectItem>
                <SelectItem value="price-desc">Maior Preço</SelectItem>
                <SelectItem value="discount">Maior Desconto</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Produtos em Promoção */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Nenhum produto encontrado com os filtros selecionados.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setSortBy("name");
                  setFilteredProducts(promotionalProducts);
                }}
                className="mt-4 bg-primary hover:bg-primary-dark text-white"
              >
                Limpar Filtros
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Promotions;