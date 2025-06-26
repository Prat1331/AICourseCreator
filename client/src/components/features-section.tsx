import { Bot, Clock, Puzzle, Smartphone, Download, Infinity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Bot,
    title: "AI-Powered Generation",
    description: "Advanced AI analyzes your topic and creates comprehensive courses with structured modules, engaging content, and clear learning paths.",
    gradient: "from-primary/10 to-primary/20",
    iconColor: "text-primary"
  },
  {
    icon: Clock,
    title: "Instant Creation",
    description: "Generate complete courses in seconds, not weeks. Save hundreds of hours of content creation and focus on learning instead.",
    gradient: "from-secondary/10 to-secondary/20",
    iconColor: "text-secondary"
  },
  {
    icon: Puzzle,
    title: "Customizable Structure",
    description: "Tailor courses to your specific needs with adjustable difficulty levels, learning objectives, and content formats.",
    gradient: "from-accent/10 to-accent/20",
    iconColor: "text-accent"
  },
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    description: "Learn anywhere, anytime with fully responsive courses that work perfectly on all devices and screen sizes.",
    gradient: "from-success/10 to-success/20",
    iconColor: "text-success"
  },
  {
    icon: Download,
    title: "Export & Share",
    description: "Download your courses in multiple formats or share them directly with students, colleagues, or teams.",
    gradient: "from-pink-500/10 to-pink-500/20",
    iconColor: "text-pink-500"
  },
  {
    icon: Infinity,
    title: "Unlimited Courses",
    description: "Create as many courses as you need on any topic. From technical skills to creative arts, the possibilities are endless.",
    gradient: "from-indigo-500/10 to-indigo-500/20",
    iconColor: "text-indigo-500"
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose AI Course Builder?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of education with AI-powered course creation that adapts to your learning needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
              <CardContent className="p-8">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`h-8 w-8 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
