import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  Book, 
  Clock, 
  User, 
  List, 
  ChevronLeft, 
  ChevronRight, 
  Target, 
  CheckCircle, 
  Download, 
  Share 
} from "lucide-react";
import type { Course } from "@shared/schema";

interface CourseDisplayProps {
  course: Course;
}

export default function CourseDisplay({ course }: CourseDisplayProps) {
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  
  const courseData = typeof course.modules === 'string' 
    ? JSON.parse(course.modules) 
    : course.modules;
  
  const modules = Array.isArray(courseData) ? courseData : [];
  const currentModule = modules[currentModuleIndex];
  const currentLesson = currentModule?.lessons?.[currentLessonIndex];

  const nextLesson = () => {
    if (currentModule && currentLessonIndex < currentModule.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    } else if (currentModuleIndex < modules.length - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1);
      setCurrentLessonIndex(0);
    }
  };

  const previousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    } else if (currentModuleIndex > 0) {
      setCurrentModuleIndex(currentModuleIndex - 1);
      const prevModule = modules[currentModuleIndex - 1];
      setCurrentLessonIndex(prevModule.lessons.length - 1);
    }
  };

  const selectModule = (moduleIndex: number) => {
    setCurrentModuleIndex(moduleIndex);
    setCurrentLessonIndex(0);
  };

  const downloadCourse = () => {
    const courseContent = {
      title: course.title,
      topic: course.topic,
      difficulty: course.difficulty,
      duration: course.duration,
      modules: modules
    };
    
    const dataStr = JSON.stringify(courseContent, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${course.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_course.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const shareCourse = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: course.title,
          text: `Check out this AI-generated course: ${course.title}`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Course URL copied to clipboard!');
    }
  };

  if (!currentModule || !currentLesson) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">No course content available</p>
      </div>
    );
  }

  return (
    <section className="py-20 bg-white" id="course-display">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Course Overview Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader className="bg-gradient-to-br from-primary/5 to-secondary/5">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                    <Book className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{course.title}</h3>
                    <Badge variant="secondary">{course.difficulty} Level</Badge>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Duration</span>
                    <span className="font-medium">{course.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Modules</span>
                    <span className="font-medium">{course.moduleCount} modules</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Lessons</span>
                    <span className="font-medium">{course.lessonCount} lessons</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                {/* Course Navigation */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 mb-3">Course Modules</h4>
                  {modules.map((module: any, moduleIndex: number) => (
                    <div
                      key={module.id}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        moduleIndex === currentModuleIndex
                          ? 'bg-primary/10 border border-primary/20'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => selectModule(moduleIndex)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          moduleIndex === currentModuleIndex
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          <span className="text-sm font-medium">{moduleIndex + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">{module.title}</p>
                          <p className="text-xs text-gray-500">{module.lessons?.length || 0} lessons</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  <Button 
                    onClick={downloadCourse}
                    className="w-full bg-gradient-to-r from-success to-success/80 hover:shadow-lg transition-all duration-300"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Course
                  </Button>
                  <Button 
                    onClick={shareCourse}
                    variant="outline" 
                    className="w-full hover:bg-gray-50 transition-all duration-300"
                  >
                    <Share className="mr-2 h-4 w-4" />
                    Share Course
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Course Content Area */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm border border-gray-100 overflow-hidden">
              {/* Lesson Header */}
              <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {currentLesson.title}
                    </h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span><Clock className="inline mr-1 h-4 w-4" /> {currentLesson.duration}</span>
                      <span><User className="inline mr-1 h-4 w-4" /> {course.difficulty}</span>
                      <span><List className="inline mr-1 h-4 w-4" /> Lesson {currentLessonIndex + 1} of {currentModule.lessons.length}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={previousLesson}
                      disabled={currentModuleIndex === 0 && currentLessonIndex === 0}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={nextLesson}
                      disabled={currentModuleIndex === modules.length - 1 && currentLessonIndex === currentModule.lessons.length - 1}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Lesson Content */}
              <CardContent className="p-6 space-y-6">
                {/* Learning Objectives */}
                {currentLesson.objectives && currentLesson.objectives.length > 0 && (
                  <Card className="bg-accent/5 border-accent/20">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Target className="text-accent mr-2 h-5 w-5" />
                        Learning Objectives
                      </h3>
                      <ul className="space-y-2">
                        {currentLesson.objectives.map((objective: string, index: number) => (
                          <li key={index} className="flex items-start space-x-2">
                            <CheckCircle className="text-success mt-1 h-4 w-4 flex-shrink-0" />
                            <span className="text-gray-700">{objective}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Lesson Content */}
                <div className="prose prose-lg max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {currentLesson.content}
                  </div>
                </div>

                {/* Interactive Exercises */}
                {currentLesson.exercises && currentLesson.exercises.length > 0 && (
                  <Card className="bg-secondary/5 border-secondary/20">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <CheckCircle className="text-secondary mr-2 h-5 w-5" />
                        Practice Exercises
                      </h3>
                      <div className="space-y-4">
                        {currentLesson.exercises.map((exercise: any, index: number) => (
                          <div key={index} className="p-4 bg-white rounded-lg border">
                            <p className="font-medium text-gray-900 mb-2">
                              Exercise {index + 1}: {exercise.question}
                            </p>
                            <details className="text-sm text-gray-600">
                              <summary className="cursor-pointer hover:text-gray-800">
                                Show Answer
                              </summary>
                              <p className="mt-2 p-3 bg-gray-50 rounded">{exercise.answer}</p>
                            </details>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Navigation */}
                <Separator />
                <div className="flex items-center justify-between pt-6">
                  <Button 
                    variant="outline"
                    onClick={previousLesson}
                    disabled={currentModuleIndex === 0 && currentLessonIndex === 0}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous Lesson
                  </Button>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline"
                      onClick={() => {/* Mark as complete logic */}}
                    >
                      Mark as Complete
                    </Button>
                    <Button 
                      onClick={nextLesson}
                      disabled={currentModuleIndex === modules.length - 1 && currentLessonIndex === currentModule.lessons.length - 1}
                      className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all duration-300"
                    >
                      Next Lesson
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
