import Link from "next/link"
import { Brain, CheckCircle, FileText, Upload, Wand2, ListTodo, Zap, Clock, Shield } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background-dark text-text-primary font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-background-dark/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-bold text-primary">
                TaskFlow AI
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a
                  href="#features"
                  className="text-text-secondary hover:text-text-primary transition-colors duration-200"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="text-text-secondary hover:text-text-primary transition-colors duration-200"
                >
                  How It Works
                </a>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <Link
                href="/auth"
                className="text-text-primary border border-border px-4 py-2 rounded-lg hover:bg-background-hover transition-colors duration-200"
              >
                Log In
              </Link>
              <Link
                href="/auth"
                className="bg-primary text-background-dark px-4 py-2 rounded-lg hover:bg-primary-hover focus:bg-primary-focus transition-colors duration-200 font-medium"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 bg-background-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary mb-6 leading-tight">
                Transform Your Meeting Notes into <span className="text-primary">Actionable Insights</span> Instantly
              </h1>
              <p className="text-xl lg:text-2xl text-text-secondary mb-8 max-w-4xl mx-auto leading-relaxed">
                TaskFlow AI uses cutting-edge artificial intelligence to summarize discussions, extract key tasks, and
                streamline your workflow. Never miss an important action item again.
              </p>
              <Link
                href="/auth"
                className="inline-flex items-center bg-primary text-background-dark px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-hover focus:bg-primary-focus transition-colors duration-200 shadow-lg"
              >
                <Zap className="w-5 h-5 mr-2" />
                Get Started for Free
              </Link>
            </div>
          </div>

          {/* Abstract Background Pattern */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-background-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">
                Unlock Peak Productivity with TaskFlow AI
              </h2>
              <p className="text-xl text-text-secondary max-w-3xl mx-auto">
                Discover the powerful features that make TaskFlow AI the ultimate solution for meeting management
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-background-card border border-border rounded-xl p-8 hover:bg-background-hover transition-colors duration-200">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-4">AI-Powered Summaries</h3>
                <p className="text-text-secondary leading-relaxed">
                  Automatically generate concise, intelligent summaries of your meetings that capture all the essential
                  points and decisions.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-background-card border border-border rounded-xl p-8 hover:bg-background-hover transition-colors duration-200">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-4">Automated Task Extraction</h3>
                <p className="text-text-secondary leading-relaxed">
                  Smart AI identifies and extracts actionable tasks from your notes, ensuring nothing falls through the
                  cracks.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-background-card border border-border rounded-xl p-8 hover:bg-background-hover transition-colors duration-200">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <ListTodo className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-4">Efficient Task Management</h3>
                <p className="text-text-secondary leading-relaxed">
                  Organize, prioritize, and track your tasks with an intuitive interface designed for maximum
                  productivity.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-background-card border border-border rounded-xl p-8 hover:bg-background-hover transition-colors duration-200">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-4">Real-time Processing</h3>
                <p className="text-text-secondary leading-relaxed">
                  Get instant results as our AI processes your meeting notes in real-time, saving you hours of manual
                  work.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-background-card border border-border rounded-xl p-8 hover:bg-background-hover transition-colors duration-200">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-4">Secure & Private</h3>
                <p className="text-text-secondary leading-relaxed">
                  Your meeting data is encrypted and secure. We prioritize your privacy with enterprise-grade security
                  measures.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-background-card border border-border rounded-xl p-8 hover:bg-background-hover transition-colors duration-200">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-4">Dark Mode UI</h3>
                <p className="text-text-secondary leading-relaxed">
                  Enjoy a sleek, modern interface designed for extended use with a beautiful dark theme that's easy on
                  the eyes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 bg-background-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">Get Started in 3 Simple Steps</h2>
              <p className="text-xl text-text-secondary max-w-3xl mx-auto">
                Transform your meeting workflow in minutes with our intuitive process
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <div className="bg-primary/20 text-primary text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-4">Input Notes</h3>
                <p className="text-text-secondary leading-relaxed">
                  Easily upload or paste your meeting minutes, voice recordings, or handwritten notes into TaskFlow AI.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Wand2 className="w-8 h-8 text-primary" />
                </div>
                <div className="bg-primary/20 text-primary text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-4">AI Analysis</h3>
                <p className="text-text-secondary leading-relaxed">
                  Our advanced AI intelligently generates concise summaries and identifies actionable tasks from your
                  content.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ListTodo className="w-8 h-8 text-primary" />
                </div>
                <div className="bg-primary/20 text-primary text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-4">Manage & Conquer</h3>
                <p className="text-text-secondary leading-relaxed">
                  View, edit, and track your tasks to completion directly within the app's intuitive dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Visual Showcase Section */}
        <section className="py-20 bg-background-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">
                Experience the Future of Meeting Management
              </h2>
              <p className="text-xl text-text-secondary max-w-3xl mx-auto">
                A clean, intuitive interface designed for productivity
              </p>
            </div>

            {/* Mock Dashboard Preview */}
            <div className="bg-background-card border border-border rounded-2xl p-8 max-w-4xl mx-auto">
              <div className="bg-background-dark rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-text-primary">Meeting Summary</h3>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-error rounded-full"></div>
                    <div className="w-3 h-3 bg-warning rounded-full"></div>
                    <div className="w-3 h-3 bg-success rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-background-card rounded-lg p-4">
                    <div className="h-4 bg-text-secondary/20 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-text-secondary/10 rounded w-1/2"></div>
                  </div>
                  <div className="bg-background-card rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <div className="h-3 bg-primary/20 rounded w-1/3"></div>
                    </div>
                    <div className="h-3 bg-text-secondary/10 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-background-card">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-6">
              Ready to Supercharge Your Meetings?
            </h2>
            <p className="text-xl text-text-secondary mb-8 leading-relaxed">
              Join thousands of professionals who have transformed their workflow with TaskFlow AI. Start your free
              trial today and experience the future of meeting management.
            </p>
            <Link
              href="/auth"
              className="inline-flex items-center bg-primary text-background-dark px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-hover focus:bg-primary-focus transition-colors duration-200 shadow-lg"
            >
              <Zap className="w-5 h-5 mr-2" />
              Sign Up and Transform Your Workflow Today
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background-dark border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8">
              <Link href="/" className="text-2xl font-bold text-primary">
                TaskFlow AI
              </Link>
            </div>
            <div className="flex justify-center space-x-8 mb-8">
              <a href="#" className="text-text-muted hover:text-text-secondary transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="text-text-muted hover:text-text-secondary transition-colors duration-200">
                Terms of Service
              </a>
            </div>
            <p className="text-text-muted">© {new Date().getFullYear()} TaskFlow AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
