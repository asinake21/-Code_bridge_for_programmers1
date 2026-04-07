import { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, Play } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const VideoSystem = ({ courseId }) => {
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(0);

  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  useEffect(() => {
    axios.get(`${API_URL}/lessons/${courseId}`).then(res => {
      setLessons(res.data);
    });
  }, [courseId]);

  const markCompleted = async () => {
    if (!lessons.length) return;
    try {
      await axios.post(`${API_URL}/progress`, { 
         // Assuming userId would come from AuthContext if we built a fully user-tied one, but per requirement using localStorage for some state. 
         // Sending dummy user ID to the post just to satisfy DB Schema ref or omit.
         // Progress route handles omission properly.
         courseId, 
         updateType: 'video', 
         itemId: lessons[currentLesson]._id
      });
      // Bumping local storage progress for this course manually just to update dash
      const stored = JSON.parse(localStorage.getItem('progress')) || {};
      stored[courseId] = Math.min(100, (stored[courseId] || 0) + 15);
      localStorage.setItem('progress', JSON.stringify(stored));
      window.dispatchEvent(new Event('storage')); // manually sync
      alert("Video marked as completed!");
    } catch(e) {
      console.error(e);
    }
  };

  if (!lessons.length) return <div className="p-10 text-center">{t.loading_videos}</div>;

  const lesson = lessons[currentLesson];

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1 space-y-4">
        {lesson.videoUrl ? (
          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-lg">
             <iframe 
               src={lesson.videoUrl.replace("watch?v=", "embed/")} 
               title={lesson.title}
               className="w-full h-full"
               allowFullScreen
             />
          </div>
        ) : (
          <div className="aspect-video w-full rounded-2xl flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300">
             <span className="text-gray-500 font-bold">{t.no_video}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{lesson.title}</h2>
          <button onClick={markCompleted} className="flex items-center space-x-2 bg-green-100 text-green-700 hover:bg-green-200 px-4 py-2 rounded-lg font-bold transition-all">
            <CheckCircle className="w-5 h-5" />
            <span>{t.mark_completed}</span>
          </button>
        </div>
      </div>
      
      <div className="lg:w-1/3 bg-gray-50 p-4 rounded-xl border h-min">
        <h3 className="font-bold text-gray-900 mb-4 whitespace-nowrap">{t.course_playlist}</h3>
        <div className="space-y-2">
          {lessons.map((l, idx) => (
             <button
               key={l._id}
               onClick={() => setCurrentLesson(idx)}
               className={`w-full text-left p-3 rounded-lg flex items-center space-x-3 transition-colors ${currentLesson === idx ? 'bg-white shadow text-blue-600 font-bold border border-blue-100' : 'hover:bg-gray-200 text-gray-700 border border-transparent'}`}
             >
               <Play className={`w-4 h-4 ${currentLesson === idx ? 'text-blue-500' : 'text-gray-400'}`} />
               <span className="truncate">{l.title}</span>
             </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoSystem;
