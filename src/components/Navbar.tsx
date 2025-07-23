import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CartDrawer from "@/components/CartDrawer";

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Catálogo", path: "/catalog" },
    { name: "Promoções", path: "/promotions" },
    { name: "Conjuntos", path: "/sets" },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-primary/20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary">
            Zander Store
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-foreground hover:text-primary transition-colors ${
                  location.pathname === item.path ? "text-primary font-medium" : ""
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Cart Button */}
          <div className="hidden md:flex">
            <CartDrawer>
              <Button
                variant="outline"
                size="icon"
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </CartDrawer>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`py-2 text-foreground hover:text-primary transition-colors ${
                    location.pathname === item.path ? "text-primary font-medium" : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <CartDrawer>
                <Button
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-white mt-4"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Carrinho
                </Button>
              </CartDrawer>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;