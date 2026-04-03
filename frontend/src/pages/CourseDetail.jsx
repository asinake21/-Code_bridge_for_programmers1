import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { courseApi, downloadApi } from '../api'

const CourseDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [downloadMsg, setDownloadMsg] = useState(null)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoading(true)
        const data = await courseApi.getById(id)
        setCourse(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCourse()
  }, [id])

  const handleDownload = async () => {
    try {
      setDownloadMsg('Downloading...')
      await downloadApi.save(course._id, course.title)
      setDownloadMsg('Course download mapped successfully. View in Downloads.')
    } catch (err) {
      setDownloadMsg(err.message)
    }
  }

  if (isLoading) return <div className="text-center py-20 text-text">Loading course details...</div>
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>
  if (!course) return <div className="text-center py-20 text-text">Course not found.</div>

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate('/courses')} className="text-primary mb-4 hover:underline">
        &larr; Back to Courses
      </button>

      <div className="bg-surface rounded-lg shadow-sm border border-border p-8 mb-6">
        <h1 className="text-3xl font-bold text-text mb-4">{course.title}</h1>
        <p className="text-text-secondary text-lg mb-6">{course.description}</p>
        
        <button onClick={handleDownload} className="btn-primary w-full sm:w-auto">
          Download Course for Offline Study
        </button>
        {downloadMsg && <p className="mt-2 text-sm text-blue-600">{downloadMsg}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Modules</h2>
          {course.modules && course.modules.map((mod, i) => (
            <div key={i} className="mb-4 border-b border-gray-100 pb-2">
              <h3 className="font-semibold text-text">{mod.title}</h3>
              <p className="text-sm text-text-secondary">Duration: {mod.duration}</p>
              <ul className="list-disc pl-5 mt-2 text-sm text-text-secondary">
                {mod.topics && mod.topics.map((t, idx) => <li key={idx}>{t}</li>)}
              </ul>
            </div>
          ))}
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-4">Course Notes</h2>
          <div 
            className="prose prose-sm text-text-secondary"
            dangerouslySetInnerHTML={{ __html: course.notes.replace(/\n/g, '<br/>') }} 
          />
        </div>
      </div>
    </div>
  )
}

export default CourseDetail
