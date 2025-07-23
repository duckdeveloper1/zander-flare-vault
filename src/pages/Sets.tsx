import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Palette, Heart, ShoppingCart } from "lucide-react";

import productTshirt from "@/assets/product-tshirt.jpg";
import productJeans from "@/assets/product-jeans.jpg";
import productSneakers from "@/assets/product-sneakers.jpg";
import heroFashion from "@/assets/hero-fashion.jpg";

interface SetItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface ProductSet {
  id: string;
  name: string;
  description: string;
  items: SetItem[];
  totalPrice: number;
  discountedPrice: number;
  discount: number;
  category: string;
  image: string;
  tags: string[];
}

const productSets: ProductSet[] = [
  {
    id: "set-1",
    name: "Conjunto Urban Casual",
    description: "Look completo para o dia a dia urbano com conforto e estilo",
    items: [
      { id: "1", name: "Camiseta Premium Laranja", price: 79.90, image: productTshirt },
      { id: "2", name: "Calça Jeans Premium", price: 149.90, image: productJeans },
      { id: "3", name: "Tênis Casual Branco", price: 199.90, image: productSneakers }
    ],
    totalPrice: 429.70,
    discountedPrice: 359.90,
    discount: 16,
    category: "casual",
    image: heroFashion,
    tags: ["bestseller", "comfort"]
  },
  {
    id: "set-2",
    name: "Conjunto Street Style",
    description: "Para quem gosta de se destacar nas ruas com muito estilo",
    items: [
      { id: "4", name: "Camiseta Oversized", price: 89.90, image: productTshirt },
      { id: "5", name: "Calça Cargo", price: 159.90, image: productJeans },
      { id: "6", name: "Tênis Chunky", price: 229.90, image: productSneakers }
    ],
    totalPrice: 479.70,
    discountedPrice: 399.90,
    discount: 17,
    category: "street",
    image: heroFashion,
    tags: ["trending", "urban"]
  },
  {
    id: "set-3",
    name: "Conjunto Smart Casual",
    description: "Elegância e sofisticação para ocasiões especiais",
    items: [
      { id: "7", name: "Camisa Social", price: 119.90, image: productTshirt },
      { id: "8", name: "Calça Social", price: 189.90, image: productJeans },
      { id: "9", name: "Sapato Social", price: 249.90, image: productSneakers }
    ],
    totalPrice: 559.70,
    discountedPrice: 469.90,
    discount: 16,
    category: "formal",
    image: heroFashion,
    tags: ["elegant", "professional"]
  },
  {
    id: "set-4",
    name: "Conjunto Esportivo",
    description: "Perfeito para academia e atividades físicas",
    items: [
      { id: "10", name: "Camiseta Dri-Fit", price: 69.90, image: productTshirt },
      { id: "11", name: "Bermuda Esportiva", price: 79.90, image: productJeans },
      { id: "12", name: "Tênis Running", price: 189.90, image: productSneakers }
    ],
    totalPrice: 339.70,
    discountedPrice: 289.90,
    discount: 15,
    category: "sport",
    image: heroFashion,
    tags: ["fitness", "performance"]
  },
  {
    id: "set-5",
    name: "Conjunto Summer Vibes",
    description: "Para os dias quentes com muito estilo e frescor",
    items: [
      { id: "13", name: "Regata Premium", price: 59.90, image: productTshirt },
      { id: "14", name: "Bermuda Jeans", price: 99.90, image: productJeans },
      { id: "15", name: "Chinelo Slide", price: 79.90, image: productSneakers }
    ],
    totalPrice: 239.70,
    discountedPrice: 199.90,
    discount: 17,
    category: "summer",
    image: heroFashion,
    tags: ["fresh", "beach"]
  },
  {
    id: "set-6",
    name: "Conjunto Winter Style",
    description: "Looks quentes e estilosos para o inverno",
    items: [
      { id: "16", name: "Moletom Premium", price: 139.90, image: productTshirt },
      { id: "17", name: "Calça Moletom", price: 109.90, image: productJeans },
      { id: "18", name: "Tênis Cano Alto", price: 219.90, image: productSneakers }
    ],
    totalPrice: 469.70,
    discountedPrice: 389.90,
    discount: 17,
    category: "winter",
    image: heroFashion,
    tags: ["warm", "cozy"]
  }
];

const Sets = () => {
  const [filteredSets, setFilteredSets] = useState(productSets);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterSets(term, selectedCategory, sortBy);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    filterSets(searchTerm, category, sortBy);
  };

  const handleSort = (sort: string) => {
    setSortBy(sort);
    filterSets(searchTerm, selectedCategory, sort);
  };

  const filterSets = (search: string, category: string, sort: string) => {
    let filtered = [...productSets];

    if (search) {
      filtered = filtered.filter(set =>
        set.name.toLowerCase().includes(search.toLowerCase()) ||
        set.description.toLowerCase().includes(search.toLowerCase()) ||
        set.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (category !== "all") {
      filtered = filtered.filter(set => set.category === category);
    }

    switch (sort) {
      case "price-asc":
        filtered.sort((a, b) => a.discountedPrice - b.discountedPrice);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.discountedPrice - a.discountedPrice);
        break;
      case "discount":
        filtered.sort((a, b) => b.discount - a.discount);
        break;
      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredSets(filtered);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-r from-primary/20 to-primary-glow/20 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Palette className="h-8 w-8 text-primary" />
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
              Conjuntos
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Looks completos pensados especialmente para você
          </p>
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
                placeholder="Buscar conjuntos..."
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
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="street">Street Style</SelectItem>
                <SelectItem value="formal">Social</SelectItem>
                <SelectItem value="sport">Esportivo</SelectItem>
                <SelectItem value="summer">Verão</SelectItem>
                <SelectItem value="winter">Inverno</SelectItem>
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

      {/* Conjuntos */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredSets.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Nenhum conjunto encontrado com os filtros selecionados.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setSortBy("name");
                  setFilteredSets(productSets);
                }}
                className="mt-4 bg-primary hover:bg-primary-dark text-white"
              >
                Limpar Filtros
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredSets.map((set) => (
                <Card key={set.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="relative">
                    <img
                      src={set.image}
                      alt={set.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 left-4 bg-primary text-white font-semibold">
                      {set.discount}% OFF
                    </Badge>
                    <div className="absolute top-4 right-4 flex gap-2">
                      {set.tags.includes('bestseller') && (
                        <Badge variant="secondary" className="bg-accent text-white text-xs">
                          MAIS VENDIDO
                        </Badge>
                      )}
                      {set.tags.includes('trending') && (
                        <Badge variant="secondary" className="bg-primary-glow text-white text-xs">
                          TENDÊNCIA
                        </Badge>
                      )}
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold mb-2 text-foreground">{set.name}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{set.description}</p>
                    </div>

                    {/* Itens do Conjunto */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-sm mb-2 text-foreground">Itens inclusos:</h4>
                      <div className="space-y-1">
                        {set.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{item.name}</span>
                            <span className="font-medium text-foreground">R$ {item.price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Preços */}
                    <div className="mb-4 p-3 bg-primary/5 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-muted-foreground">Preço individual:</span>
                        <span className="text-sm text-muted-foreground line-through">
                          R$ {set.totalPrice.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-foreground">Preço do conjunto:</span>
                        <span className="text-2xl font-bold text-primary">
                          R$ {set.discountedPrice.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-center mt-2">
                        <Badge variant="outline" className="border-primary text-primary">
                          Economia: R$ {(set.totalPrice - set.discountedPrice).toFixed(2)}
                        </Badge>
                      </div>
                    </div>

                    {/* Botões */}
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 border-primary text-primary hover:bg-primary hover:text-white"
                      >
                        <Heart className="h-4 w-4 mr-2" />
                        Favoritar
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1 bg-primary hover:bg-primary-dark text-white"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Comprar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Sets;