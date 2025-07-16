import { Link } from "wouter";

export default function Footer() {
  const footerSections = [
    {
      title: "Company",
      links: [
        { name: "About us", href: "#" },
        { name: "Our offerings", href: "#" },
        { name: "Newsroom", href: "#" },
        { name: "Careers", href: "#" },
      ]
    },
    {
      title: "Products",
      links: [
        { name: "Ride", href: "/" },
        { name: "Drive", href: "/driver-signup" },
        { name: "Uber Eats", href: "#" },
        { name: "Uber for Business", href: "#business" },
      ]
    },
    {
      title: "Global citizenship",
      links: [
        { name: "Safety", href: "#" },
        { name: "Sustainability", href: "#" },
        { name: "Diversity", href: "#" },
      ]
    },
    {
      title: "Travel",
      links: [
        { name: "Cities", href: "#" },
        { name: "Airports", href: "#" },
      ]
    }
  ];

  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-6 mb-4 md:mb-0">
            <span className="text-xl font-bold">Uber</span>
            <span className="text-gray-300">© 2024 Uber Technologies Inc.</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
              Privacy
            </Link>
            <Link href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
              Terms
            </Link>
            <Link href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
              Help
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
