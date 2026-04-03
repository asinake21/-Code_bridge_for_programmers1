import { useState, useEffect } from 'react'
import { CheckCircle, BookOpen } from 'lucide-react'
import { downloadApi } from '../api'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { translations } from '../data/translations'

const Downloads = () => {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  
  const [downloadedCourses, setDownloadedCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        setIsLoading(true)
        const data = await downloadApi.getAll()
        setDownloadedCourses(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDownloads()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-300">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t.downloads}</h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
           {language === 'en' ? 'Access your learning materials offline. Connect with your downloaded curriculum.' : 'የመማሪያ ሰነዶችዎን ከመስመር ውጭ ያግኙ። ከወረደው ስርዓተ ትምህርት ጋር ይገናኙ።'}
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 border border-red-200 dark:border-red-900 p-4 rounded-md">
          {error}
        </div>
      ) : downloadedCourses.length === 0 ? (
        <div className="text-center text-gray-500 py-20 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <BookOpen className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{t.no_downloads}</h2>
          <p className="text-gray-500 dark:text-gray-400">
            {language === 'en' ? 'Browse the Courses page and download content for offline viewing.' : 'ኮርሶችን ያስሱ እና ከመስመር ውጭ ለማጥናት ያውርዱ።'}
          </p>
        </div>
      ) : (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t.downloaded_content}</h2>
          <div className="space-y-4">
            {downloadedCourses.map((download) => (
              <div key={download._id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-soft transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-sm">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{download.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {language === 'en' ? 'Downloaded' : 'የወረደው በ'}: {new Date(download.downloadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate(`/courses/${download.courseId._id}`)}
                    className="bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 shadow-sm border border-gray-200 dark:border-gray-600 flex items-center space-x-2"
                  >
                    <BookOpen className="w-4 h-4 text-gray-500 dark:text-gray-300" />
                    <span>{t.open_offline}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Downloads