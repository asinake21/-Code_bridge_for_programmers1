import { Heart, Users, BookOpen, Code, Target, Award } from 'lucide-react'

const About = () => {
  const features = [
    {
      icon: Code,
      title: 'AI-Powered Learning',
      description: 'Get instant help with coding questions and personalized explanations in your preferred language.',
    },
    {
      icon: BookOpen,
      title: 'Comprehensive Courses',
      description: 'Structured learning paths from basics to advanced topics in multiple programming languages.',
    },
    {
      icon: Users,
      title: 'Community Support',
      description: 'Connect with fellow learners and get help from experienced developers in our community.',
    },
    {
      icon: Target,
      title: 'Language Bridge',
      description: 'Overcome language barriers with AI explanations that understand both Amharic and English contexts.',
    },
    {
      icon: Award,
      title: 'Progress Tracking',
      description: 'Monitor your learning journey with detailed progress reports and achievement badges.',
    },
    {
      icon: Heart,
      title: 'Offline Access',
      description: 'Download courses and materials for uninterrupted learning, even without internet connection.',
    },
  ]

  const stats = [
    { number: '10,000+', label: 'Students Helped' },
    { number: '50+', label: 'Courses Available' },
    { number: '2', label: 'Languages Supported' },
    { number: '24/7', label: 'AI Support' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-text mb-6">
          About <span className="text-primary">Code Bridge</span>
        </h1>
        <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
          Code Bridge is an AI-powered learning platform designed specifically for Ethiopian students
          who struggle with programming due to language barriers. We bridge the gap between logic
          and code by providing personalized, human-like explanations in both Amharic and English.
        </p>
      </div>

      {/* Mission */}
      <div className="card mb-16">
        <div className="text-center">
          <Target className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-text mb-6">Our Mission</h2>
          <p className="text-lg text-text-secondary max-w-4xl mx-auto leading-relaxed">
            Many Ethiopian students understand programming logic but get stuck on English syntax,
            error messages, and technical documentation. Code Bridge acts as your personal tutor,
            explaining complex concepts in simple, relatable terms. Whether you're learning Python,
            JavaScript, Java, or SQL, our AI assistant adapts to your learning style and language preferences.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-text text-center mb-12">What Makes Us Different</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="card text-center hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-text mb-3">{feature.title}</h3>
                <p className="text-text-secondary">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="card mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
              <div className="text-text-secondary">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-text text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
              1
            </div>
            <h3 className="text-lg font-semibold text-text mb-3">Choose Your Path</h3>
            <p className="text-text-secondary">
              Select from our curated courses in Python, JavaScript, Java, and SQL. Each course is designed
              for Ethiopian students with cultural context and language support.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
              2
            </div>
            <h3 className="text-lg font-semibold text-text mb-3">Learn Interactively</h3>
            <p className="text-text-secondary">
              Study with our AI assistant that explains concepts in simple terms. Ask questions in Amharic
              or English and get personalized responses that match your learning style.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
              3
            </div>
            <h3 className="text-lg font-semibold text-text mb-3">Practice & Grow</h3>
            <p className="text-text-secondary">
              Apply what you learn with hands-on exercises. Download materials for offline study and track
              your progress as you build real programming skills.
            </p>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="card text-center">
        <h2 className="text-3xl font-bold text-text mb-6">Get Started Today</h2>
        <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
          Join thousands of Ethiopian students who are learning to code with confidence.
          Code Bridge is here to support your journey from beginner to professional developer.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="btn-primary px-8 py-3">
            Start Learning
          </button>
          <button className="btn-secondary px-8 py-3">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  )
}

export default About