import { Heart, Users, BookOpen, Code, Target, Award } from 'lucide-react'
import { translations } from '../data/translations'
import { useLanguage } from '../context/LanguageContext'

const About = () => {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  const features = [
    {
      icon: Code,
      title: t.about_feature1_title,
      description: t.about_feature1_desc,
    },
    {
      icon: BookOpen,
      title: t.about_feature2_title,
      description: t.about_feature2_desc,
    },
    {
      icon: Users,
      title: t.about_feature3_title,
      description: t.about_feature3_desc,
    },
    {
      icon: Target,
      title: t.about_feature4_title,
      description: t.about_feature4_desc,
    },
    {
      icon: Award,
      title: t.about_feature5_title,
      description: t.about_feature5_desc,
    },
    {
      icon: Heart,
      title: t.about_feature6_title,
      description: t.about_feature6_desc,
    },
  ]

  const stats = [
    { number: '10,000+', label: t.about_stat1 },
    { number: '50+', label: t.about_stat2 },
    { number: '2', label: t.about_stat3 },
    { number: '24/7', label: t.about_stat4 },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          {t.about} <span className="text-blue-600">{t.about_code_bridge}</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
          {t.about_hero_desc}
        </p>
      </div>

      {/* Mission */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 mb-16">
        <div className="text-center">
          <Target className="w-16 h-16 text-blue-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{t.about_mission_title}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed">
            {t.about_mission_desc}
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">{t.about_features_title}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-blue-50 dark:bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
              <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">{t.about_how_title}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
              1
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{t.about_how1_title}</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t.about_how1_desc}
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
              2
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{t.about_how2_title}</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t.about_how2_desc}
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
              3
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{t.about_how3_title}</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t.about_how3_desc}
            </p>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{t.about_contact_title}</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          {t.about_contact_desc}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-xl transition-colors">
            {t.about_btn_start}
          </button>
          <button className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium px-8 py-3 rounded-xl transition-colors">
            {t.about_btn_support}
          </button>
        </div>
      </div>
    </div>
  )
}

export default About