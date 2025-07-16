import { Link } from "wouter";
import { Zap, MapPin, Building2, Users, Mail, Phone, Twitter, Instagram, Linkedin, Github } from "lucide-react";

export default function Footer() {
  const footerSections = [
    {
      title: "Company",
      links: [
        { name: "About us", href: "#", icon: Users },
        { name: "Our offerings", href: "#", icon: MapPin },
        { name: "Newsroom", href: "#", icon: Mail },
        { name: "Careers", href: "#", icon: Users },
      ]
    },
    {
      title: "Products",
      links: [
        { name: "Ride", href: "/", icon: Zap },
        { name: "Drive", href: "/driver-signup", icon: Users },
        { name: "RideFlow Eats", href: "#", icon: MapPin },
        { name: "RideFlow Business", href: "#business", icon: Building2 },
      ]
    },
    {
      title: "Global citizenship",
      links: [
        { name: "Safety", href: "#", icon: Users },
        { name: "Sustainability", href: "#", icon: MapPin },
        { name: "Diversity", href: "#", icon: Users },
      ]
    },
    {
      title: "Travel",
      links: [
        { name: "Cities", href: "#", icon: MapPin },
        { name: "Airports", href: "#", icon: MapPin },
      ]
    }
  ];

  const socialLinks = [
    { name: "Twitter", href: "#", icon: Twitter },
    { name: "Instagram", href: "#", icon: Instagram },
    { name: "LinkedIn", href: "#", icon: Linkedin },
    { name: "GitHub", href: "#", icon: Github },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 gradient-primary rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 gradient-secondary rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Top Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between flex-wrap gap-8">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center animate-pulse-slow">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 gradient-accent rounded-full animate-bounce-subtle"></div>
              </div>
              <div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  RideFlow
                </h3>
                <p className="text-gray-400 text-sm">Premium Transportation Experience</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {socialLinks.map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  className="w-10 h-10 glass-morphism hover:bg-white/20 rounded-xl flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
                >
                  <social.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Main Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {footerSections.map((section, index) => (
            <div key={index} className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-6">{section.title}</h3>
              <ul className="space-y-4">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors duration-300 group"
                    >
                      <link.icon className="w-4 h-4 group-hover:text-purple-400 transition-colors" />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <span className="text-sm text-gray-400">© 2024 RideFlow Technologies Inc.</span>
            </div>
            <div className="flex flex-wrap gap-6">
              {[
                { name: "Privacy Policy", href: "#" },
                { name: "Terms of Service", href: "#" },
                { name: "Cookie Policy", href: "#" },
                { name: "Help Center", href: "#" },
              ].map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-300"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
