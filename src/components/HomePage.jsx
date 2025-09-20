import React from "react";
import Footer from "./Footer";
import { Link } from "react-router";
import { useSelector } from "react-redux";

const HomePage = () => {
  const user = useSelector((store) => store.user);

  const features = [
    {
      icon: "🚀",
      title: "Fast Execution",
      description: "Run your code instantly with our optimized execution environment"
    },
    {
      icon: "💻",
      title: "Multi-Language Support",
      description: "Support for 50+ programming languages including Python, JavaScript, Java, and more"
    },
    {
      icon: "☁️",
      title: "Cloud Storage",
      description: "Save and sync your code across devices with secure cloud storage"
    },
    {
      icon: "🎨",
      title: "Modern Interface",
      description: "Beautiful, intuitive interface designed for productivity and ease of use"
    },
    {
      icon: "📱",
      title: "Responsive Design",
      description: "Works seamlessly on desktop, tablet, and mobile devices"
    },
    {
      icon: "🔒",
      title: "Secure & Private",
      description: "Your code is secure with enterprise-grade encryption and privacy protection"
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
        {/* Hero Section */}
        <div className="container mx-auto px-6 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="animate-fade-in">
              <h1 className="text-5xl md:text-6xl font-bold text-secondary-900 mb-6">
                Code, Run, 
                <span className="text-primary-600"> Execute</span>
              </h1>
              <p className="text-xl text-secondary-600 mb-8 leading-relaxed">
                The ultimate online code editor and execution platform. Write, test, and run code in 50+ programming languages with zero setup required.
              </p>
              
              {user ? (
                <div className="space-y-4">
                  <p className="text-lg text-accent-600 font-medium">
                    Welcome back, {user.displayName}! 🎉
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="ide" className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center">
                      <span className="mr-2">🚀</span>
                      Continue Coding
                    </Link>
                    <Link to="ide" className="btn-secondary text-lg px-8 py-4 inline-flex items-center justify-center">
                      <span className="mr-2">📁</span>
                      View Projects
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="ide" className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center">
                    <span className="mr-2">⚡</span>
                    Start Coding Now
                  </Link>
                  <Link to="signup" className="btn-secondary text-lg px-8 py-4 inline-flex items-center justify-center">
                    <span className="mr-2">👤</span>
                    Sign Up Free
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Built for developers, by developers. Experience the future of online coding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="card-hover p-8 text-center animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-secondary-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="container mx-auto px-6 py-16">
          <div className="card p-12 text-center max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Ready to Start Coding?
            </h2>
            <p className="text-lg text-secondary-600 mb-8">
              Join thousands of developers who trust our platform for their coding needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!user ? (
                <>
                  <Link to="ide" className="btn-primary text-lg px-8 py-4">
                    Try as Guest
                  </Link>
                  <Link to="signup" className="btn-success text-lg px-8 py-4">
                    Create Account
                  </Link>
                </>
              ) : (
                <Link to="ide" className="btn-primary text-lg px-8 py-4">
                  Open IDE
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HomePage;
