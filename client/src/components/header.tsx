import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, ChevronDown, Zap, Globe, User, Settings } from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: "Ride", href: "/", icon: Zap },
    { name: "Drive", href: "/driver-signup", icon: User },
    { name: "Business", href: "#business", icon: Settings },
    { name: "About", href: "#about", icon: Globe },
    { name: "Help", href: "#help", icon: Settings },
  ];

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
    { code: "bn", name: "বাংলা", flag: "🇧🇩" },
  ];

  return (
    <header className="sticky top-0 z-50 glass-morphism backdrop-blur-xl border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 group">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center animate-pulse-slow">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 gradient-accent rounded-full animate-bounce-subtle"></div>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  RideFlow
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group relative px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    location === item.href
                      ? "text-white"
                      : "text-gray-600 hover:text-purple-600"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {location === item.href && (
                    <div className="absolute inset-0 gradient-primary rounded-xl opacity-90 -z-10 animate-pulse-slow"></div>
                  )}
                  <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </Link>
              );
            })}
          </nav>

          {/* Auth & Language */}
          <div className="hidden md:flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 hover:bg-white/10 rounded-xl">
                  <Globe className="w-4 h-4" />
                  <span>EN</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glass-morphism border-white/20">
                {languages.map((lang) => (
                  <DropdownMenuItem key={lang.code} className="hover:bg-white/10">
                    <span className="mr-2">{lang.flag}</span>
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link href="/login">
              <Button variant="ghost" className="hover:bg-white/10 rounded-xl">
                Log in
              </Button>
            </Link>
            
            <Link href="/signup">
              <Button className="gradient-primary hover:opacity-90 transition-opacity duration-300 rounded-xl px-6 py-2 text-white font-medium shadow-lg hover:shadow-xl">
                Sign up
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-white/10 rounded-xl">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="glass-morphism border-white/20">
                <div className="flex flex-col space-y-4 mt-6">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center space-x-3 px-4 py-3 text-foreground hover:bg-white/10 rounded-xl transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                  <div className="border-t border-white/20 pt-4">
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start hover:bg-white/10 rounded-xl">
                        Log in
                      </Button>
                    </Link>
                    <Link href="/signup" onClick={() => setIsOpen(false)}>
                      <Button className="w-full justify-start mt-2 gradient-primary text-white rounded-xl">
                        Sign up
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
