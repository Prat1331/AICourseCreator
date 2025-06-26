import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";

export default function CTASection() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary via-secondary to-primary relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse-slow"></div>
        <div className="absolute top-1/3 right-20 w-16 h-16 bg-white/5 rounded-full animate-pulse-slow" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-pulse-slow" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="mb-8">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of learners who are already creating amazing courses with AI. Start your journey today - it's completely free!
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">10K+</div>
            <div className="text-white/80 text-sm">Courses Generated</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">5K+</div>
            <div className="text-white/80 text-sm">Happy Learners</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">100+</div>
            <div className="text-white/80 text-sm">Topics Covered</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">24/7</div>
            <div className="text-white/80 text-sm">AI Available</div>
          </div>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={scrollToTop}
            size="lg"
            className="bg-white text-primary px-8 py-4 text-lg font-semibold hover:bg-gray-50 hover:scale-105 transition-all duration-300 shadow-2xl"
          >
            <Rocket className="mr-2 h-5 w-5" />
            Start Creating Courses Now
          </Button>
          <p className="text-white/80 text-sm">
            No credit card required • Free forever • AI-powered
          </p>
        </div>
      </div>
    </section>
  );
}
