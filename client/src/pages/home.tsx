import { useState } from "react";
import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import CourseDisplay from "@/components/course-display";
import FeaturesSection from "@/components/features-section";
import HowItWorksSection from "@/components/how-it-works-section";
import CourseGallery from "@/components/course-gallery";
import CTASection from "@/components/cta-section";
import Footer from "@/components/footer";
import type { Course } from "@shared/schema";

export default function Home() {
  const [generatedCourse, setGeneratedCourse] = useState<Course | null>(null);

  const handleCourseGenerated = (course: Course) => {
    setGeneratedCourse(course);
    // Scroll to course display
    setTimeout(() => {
      const element = document.getElementById('course-display');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroSection onCourseGenerated={handleCourseGenerated} />
      {generatedCourse && <CourseDisplay course={generatedCourse} />}
      <FeaturesSection />
      <HowItWorksSection />
      <CourseGallery />
      <CTASection />
      <Footer />
    </div>
  );
}
