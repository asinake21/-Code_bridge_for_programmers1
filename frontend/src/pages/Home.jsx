import { Link } from 'react-router-dom'
import { MessageSquare, BookOpen, FileText, Play, ChevronRight } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { translations } from '../data/translations'

const Home = () => {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  const quickActions = [
    {
      title: t.ai,
      description: language === 'en' ? 'Get instant help with coding questions' : 'ለኮዲንግ ጥያቄዎች ፈጣን እርዳታ ያግኙ',
      icon: MessageSquare,
      path: '/ai-assistant',
      color: 'bg-blue-600',
    },
    {
      title: t.courses,
      description: language === 'en' ? 'Pick up where you left off' : 'ካቆሙበት ይቀጥሉ',
      icon: BookOpen,
      path: '/courses',
      color: 'bg-green-600',
    },
    {
      title: language === 'en' ? 'Downloads' : 'የወረዱ',
      description: language === 'en' ? 'Review your offline materials' : 'የወረዱ ትምህርቶችን ይከልሱ',
      icon: FileText,
      path: '/downloads',
      color: 'bg-purple-600',
    },
  ]

  const languages = [
    { name: 'Python', icon: '🐍' },
    { name: 'JavaScript', icon: '🟨' },
    { name: 'Java', icon: '☕' },
    { name: 'SQL', icon: '🗄️' },
  ]

  const recentCourses = [
    { title: 'Python Basics', progress: 75, lastAccessed: language === 'en' ? '2 hours ago' : 'ከ 2 ሰዓት በፊት' },
    { title: 'JavaScript Fundamentals', progress: 45, lastAccessed: language === 'en' ? '1 day ago' : 'ከትላንትና ወዲያ' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-300">
      {/* Welcome Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {language === 'en' ? (
            <>Welcome to <span className="text-blue-600">Code Bridge</span></>
          ) : (
             <><span className="text-blue-600">Code Bridge</span> እንኳን በደህና መጡ</>
          )}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {t.hero_subtitle}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {quickActions.map((action) => {
          const Icon = action.icon
          return (
            <Link
              key={action.title}
              to={action.path}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-xl ${action.color} text-white group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{action.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{action.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 transition-colors" />
              </div>
            </Link>
          )
        })}
      </div>

      {/* Programming Languages */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {language === 'en' ? 'Explore Technologies' : 'ቴክኖሎጂዎችን ያስሱ'}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {languages.map((lang) => (
            <button
              key={lang.name}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="text-center">
                <div className="text-4xl mb-3">{lang.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{lang.name}</h3>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Courses */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {language === 'en' ? 'Continue Learning' : 'ትምህርትዎን ይቀጥሉ'}
        </h2>
        <div className="space-y-4">
          {recentCourses.map((course) => (
            <div key={course.title} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{course.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{language === 'en' ? 'Last accessed' : 'ለመጨረሻ ጊዜ የታየው'} {course.lastAccessed}</p>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${course.progress}%` }}
                     ></div>
                  </div>
                </div>
                <Play className="w-8 h-8 text-blue-600 ml-4 cursor-pointer hover:scale-110 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Home