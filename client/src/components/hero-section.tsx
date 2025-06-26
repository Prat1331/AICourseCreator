import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Wand2, Loader2 } from "lucide-react";
import type { CourseGeneration } from "@shared/schema";

interface HeroSectionProps {
  onCourseGenerated: (course: any) => void;
}

export default function HeroSection({ onCourseGenerated }: HeroSectionProps) {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const { toast } = useToast();

  const generateCourseMutation = useMutation({
    mutationFn: async (data: CourseGeneration) => {
      const response = await apiRequest("POST", "/api/courses/generate", data);
      return response.json();
    },
    onSuccess: (course) => {
      toast({
        title: "Course Generated Successfully!",
        description: `Your course "${course.title}" has been created.`,
      });
      onCourseGenerated(course);
    },
    onError: (error: Error) => {
      toast({
        title: "Course Generation Failed",
        description: error.message || "Please try again with a different topic.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic for your course.",
        variant: "destructive",
      });
      return;
    }

    generateCourseMutation.mutate({ topic: topic.trim(), difficulty });
  };

  const fillTopic = (suggestedTopic: string) => {
    setTopic(suggestedTopic);
  };

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,<svg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'><g fill='none' fill-rule='evenodd'><g fill='%233B82F6' fill-opacity='0.1'><circle cx='12' cy='12' r='2'/><circle cx='48' cy='12' r='2'/><circle cx='12' cy='48' r='2'/><circle cx='48' cy='48' r='2'/></g></svg>")`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full px-4 py-2 mb-6">
            <Wand2 className="text-primary mr-2 h-4 w-4" />
            <span className="text-sm font-medium text-gray-700">AI-Powered Course Generation</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Create Complete Courses
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent block">
              Instantly
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform any topic into a comprehensive educational course using advanced AI. Generate structured lessons, learning objectives, and engaging content in seconds.
          </p>
        </div>

        {/* Course Generation Form */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What would you like to learn?</h2>
              <p className="text-gray-600">Enter any topic and watch AI create a complete course for you</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                    Course Topic
                  </Label>
                  <Input
                    id="topic"
                    type="text"
                    placeholder="e.g., Web Development, Digital Marketing, Python Programming..."
                    className="text-lg h-12"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    disabled={generateCourseMutation.isPending}
                  />
                </div>
                <div>
                  <Label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level
                  </Label>
                  <Select value={difficulty} onValueChange={(value: "beginner" | "intermediate" | "advanced") => setDifficulty(value)}>
                    <SelectTrigger className="h-12 text-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Suggested Topics */}
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-500 mr-2">Popular topics:</span>
                {["Machine Learning", "Digital Photography", "Financial Planning", "UI/UX Design"].map((topic) => (
                  <Button
                    key={topic}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fillTopic(topic)}
                    className="text-sm hover:bg-primary hover:text-white transition-all duration-200"
                    disabled={generateCourseMutation.isPending}
                  >
                    {topic}
                  </Button>
                ))}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 h-auto"
                disabled={generateCourseMutation.isPending}
              >
                {generateCourseMutation.isPending ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    AI is creating your course...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2" />
                    Generate Course with AI
                  </>
                )}
              </Button>
            </form>

            {/* Loading State */}
            {generateCourseMutation.isPending && (
              <div className="mt-8 text-center">
                <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full px-6 py-3">
                  <Loader2 className="animate-spin w-5 h-5 text-primary" />
                  <span className="text-primary font-medium">AI is creating your course...</span>
                </div>
                <p className="text-gray-500 mt-2">This usually takes 10-30 seconds</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
