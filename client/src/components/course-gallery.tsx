import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Clock, Book, Bot } from "lucide-react";
import { Link } from "wouter";
import type { Course } from "@shared/schema";

export default function CourseGallery() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  const categories = [
    { value: "all", label: "All Courses" },
    { value: "technology", label: "Technology" },
    { value: "business", label: "Business" },
    { value: "creative", label: "Creative" },
    { value: "health", label: "Health & Fitness" },
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.topic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getCourseGradient = (index: number) => {
    const gradients = [
      "from-primary to-secondary",
      "from-accent to-pink-500",
      "from-success to-emerald-600",
      "from-purple-600 to-indigo-600",
      "from-teal-500 to-cyan-600",
      "from-red-500 to-orange-600"
    ];
    return gradients[index % gradients.length];
  };

  const getCourseIcon = (index: number) => {
    const icons = ["🤖", "🎨", "💰", "📸", "🧘", "🍳"];
    return icons[index % icons.length];
  };

  if (isLoading) {
    return (
      <section id="courses" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading courses...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="courses" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Recently Generated Courses
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore courses created by our community and get inspired for your next learning adventure
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-12">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search courses..."
                className="pl-12 h-12 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>
          
          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
                className={selectedCategory === category.value 
                  ? "bg-primary text-white" 
                  : "hover:bg-primary hover:text-white"
                }
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No courses found. Try generating your first course!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course, index) => (
              <Card key={course.id} className="group bg-white shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                <div className={`h-48 bg-gradient-to-br ${getCourseGradient(index)} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm text-white">
                      {course.difficulty}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center space-x-4 text-sm">
                      <span><Clock className="inline mr-1 h-4 w-4" /> {course.duration}</span>
                      <span><Book className="inline mr-1 h-4 w-4" /> {course.lessonCount} lessons</span>
                    </div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl opacity-20">
                    {getCourseIcon(index)}
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    Learn {course.topic} with this comprehensive {course.difficulty}-level course featuring {course.moduleCount} modules and {course.lessonCount} lessons.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-8 h-8 bg-gradient-to-br ${getCourseGradient(index)} rounded-full flex items-center justify-center`}>
                        <Bot className="text-white h-4 w-4" />
                      </div>
                      <span className="text-sm text-gray-600">AI Generated</span>
                    </div>
                    <Link href={`/course/${course.id}`}>
                      <Button variant="ghost" size="sm" className="text-primary hover:text-secondary font-medium">
                        View Course →
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
