export default function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: "Enter Your Topic",
      description: "Simply type in any subject you want to learn about. Our AI understands context and creates relevant content.",
      gradient: "from-primary to-primary/80"
    },
    {
      number: 2,
      title: "AI Generates Course",
      description: "Our advanced AI analyzes your topic and creates a structured course with modules, lessons, and assessments.",
      gradient: "from-secondary to-secondary/80"
    },
    {
      number: 3,
      title: "Review & Customize",
      description: "Browse through your generated course, make adjustments, and customize content to match your learning style.",
      gradient: "from-accent to-accent/80"
    },
    {
      number: 4,
      title: "Start Learning",
      description: "Begin your learning journey with interactive lessons, practical exercises, and progress tracking.",
      gradient: "from-success to-success/80"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Creating comprehensive courses has never been easier. Follow these simple steps to get started.
          </p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent transform -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className={`w-20 h-20 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-2xl font-bold text-white">{step.number}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
