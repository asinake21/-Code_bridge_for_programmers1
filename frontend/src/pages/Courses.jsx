import { useState, useEffect } from 'react'
import { Search, BookOpen, Loader2 } from 'lucide-react'
import CourseCard from '../components/CourseCard'
import { getCourses } from '../api/courses'
import { useLanguage } from '../context/LanguageContext'
import { translations } from '../data/translations'

const Courses = () => {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  
  const [searchQuery, setSearchQuery] = useState('')
  const [coursesData, setCoursesData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses()
        setCoursesData(data)
      } catch (err) {
        console.error("Failed to load courses:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  const categories = [...new Set(coursesData.map(c => c.category || 'Uncategorized'))]

  // Filter courses based on search text globally
  const filteredCourses = coursesData.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-[calc(100vh-4rem)] pb-16 transition-all duration-300">
      {/* Search Header Banner */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-12 mb-10 shadow-sm relative overflow-hidden transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-blue-800/5 dark:from-blue-600/20 dark:to-blue-800/20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
              {t.search_prompt}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              {t.search_desc}
            </p>
            
            <div className="relative max-w-2xl mx-auto group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              </div>
              <input
                type="text"
                placeholder={t.search_placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 md:py-5 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-600/10 dark:focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all shadow-sm text-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">Loading courses...</p>
          </div>
        ) : searchQuery ? (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-md text-base mr-3 shadow-md">{filteredCourses.length}</span> 
              {t.search_results}
            </h2>
            {filteredCourses.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <BookOpen className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t.no_courses}</h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.map((course) => (
                  <CourseCard key={course._id || course.id} course={course} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-16">
            {categories.map(category => {
              const categoryCourses = coursesData.filter(c => (c.category || 'Uncategorized') === category);
              if (categoryCourses.length === 0) return null;

              return (
                <section key={category}>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight relative pb-2">
                       {/* Extremely basic localized translation on Category titles for robustness */}
                      {language === 'am' && category === 'Frontend Development' ? 'የፊት-መጨረሻ ስራ (Frontend)' : category}
                      <span className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full shadow-sm"></span>
                    </h2>
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 px-3 py-1 rounded-full shadow-sm">
                      {categoryCourses.length} {t.courses}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categoryCourses.map((course) => (
                      <CourseCard key={course._id || course.id} course={course} />
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Courses