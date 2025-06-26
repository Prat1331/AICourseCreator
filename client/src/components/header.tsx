import { GraduationCap, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Header() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <GraduationCap className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI Course Builder</h1>
              <p className="text-xs text-gray-500">Powered by AI</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => scrollToSection('features')}
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="text-gray-600 hover:text-primary transition-colors"
            >
              How it Works
            </button>
            <button 
              onClick={() => scrollToSection('courses')}
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Courses
            </button>
            <Button className="bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg transition-all duration-300">
              Get Started Free
            </Button>
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="text-gray-600" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-4 mt-8">
                <button 
                  onClick={() => scrollToSection('features')}
                  className="text-gray-600 hover:text-primary transition-colors text-left"
                >
                  Features
                </button>
                <button 
                  onClick={() => scrollToSection('how-it-works')}
                  className="text-gray-600 hover:text-primary transition-colors text-left"
                >
                  How it Works
                </button>
                <button 
                  onClick={() => scrollToSection('courses')}
                  className="text-gray-600 hover:text-primary transition-colors text-left"
                >
                  Courses
                </button>
                <Button className="bg-gradient-to-r from-primary to-secondary text-white">
                  Get Started Free
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
