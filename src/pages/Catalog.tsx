import { useState } from "react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

import productTshirt from "@/assets/product-tshirt.jpg";
import productJeans from "@/assets/product-jeans.jpg";
import productSneakers from "@/assets/product-sneakers.jpg";

// Dados fictícios de produtos - facilmente substituíveis por API
const mockProducts = [
  {
    id: "1",
    name: "Camiseta Premium Laranja",
    price: 79.90,
    originalPrice: 99.90,
    discount: 20,
    image: productTshirt,
    description: "Camiseta 100% algodão com design moderno e confortável",
    isPromotion: true,
    category: "camisetas",
    sizes: ["P", "M", "G", "GG"],
    colors: ["Laranja", "Branco", "Preto"]
  },
  {
    id: "2",
    name: "Calça Jeans Premium",
    price: 149.90,
    image: productJeans,
    description: "Calça jeans de alta qualidade com corte moderno",
    isPromotion: false,
    category: "calcas",
    sizes: ["36", "38", "40", "42", "44"],
    colors: ["Azul Escuro", "Preto"]
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
    category: "calcados",
    sizes: ["37", "38", "39", "40", "41", "42"],
    colors: ["Branco", "Preto"]
  },
  // Duplicando alguns produtos para demonstrar o grid
  {
    id: "4",
    name: "Camiseta Basic Preta",
    price: 59.90,
    image: productTshirt,
    description: "Camiseta básica essencial para o guarda-roupa",
    isPromotion: false,
    category: "camisetas",
    sizes: ["P", "M", "G", "GG"],
    colors: ["Preto", "Branco"]
  },
  {
    id: "5",
    name: "Calça Cargo Premium",
    price: 169.90,
    originalPrice: 199.90,
    discount: 15,
    image: productJeans,
    description: "Calça cargo com múltiplos bolsos e design urbano",
    isPromotion: true,
    category: "calcas",
    sizes: ["36", "38", "40", "42"],
    colors: ["Verde", "Bege", "Preto"]
  },
  {
    id: "6",
    name: "Tênis Sport Orange",
    price: 249.90,
    image: productSneakers,
    description: "Tênis esportivo com tecnologia de amortecimento",
    isPromotion: false,
    category: "calcados",
    sizes: ["37", "38", "39", "40", "41", "42"],
    colors: ["Laranja", "Branco"]
  }
];

const Catalog = () => {
  const [products, setProducts] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const categories = [
    { value: "all", label: "Todas as categorias" },
    { value: "camisetas", label: "Camisetas" },
    { value: "calcas", label: "Calças" },
    { value: "calcados", label: "Calçados" }
  ];

  const sortOptions = [
    { value: "name", label: "Nome" },
    { value: "price-low", label: "Menor preço" },
    { value: "price-high", label: "Maior preço" },
    { value: "discount", label: "Maior desconto" }
  ];

  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "all" || product.category === selectedCategory)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "discount":
          return (b.discount || 0) - (a.discount || 0);
        default:
          return a.name.localeCompare(b.name);
      }
    });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center text-foreground mb-2">
            Catálogo Completo
          </h1>
          <p className="text-center text-muted-foreground">
            Descubra nossa coleção completa de roupas modernas
          </p>
        </div>

        {/* Filtros e Busca */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-border">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>

        {/* Grid de Produtos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">
              Nenhum produto encontrado com os filtros selecionados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;