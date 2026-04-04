import { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';
import { downloadApi } from '../api';

const API_URL = 'http://localhost:5001/api';

const NotesSystem = ({ courseId }) => {
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [downloadMsg, setDownloadMsg] = useState('');

  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  useEffect(() => {
    axios.get(`${API_URL}/lessons/${courseId}`).then(res => {
      setLessons(res.data);
    });
  }, [courseId]);

  const handleNext = () => {
    if (currentLesson < lessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
    }
  };

  const handlePrev = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1);
    }
  };

  if (!lessons.length) return <div className="p-10 text-center text-gray-500">{t.no_notes}</div>;

  const lesson = lessons[currentLesson];

  const handleDownload = async () => {
    try {
      setDownloadMsg('Downloading...');
      await downloadApi.save(courseId, lesson.title);
      setDownloadMsg('Saved to Downloads!');
      setTimeout(() => setDownloadMsg(''), 3000);
    } catch (err) {
      setDownloadMsg(err.message || 'Error occurred');
      setTimeout(() => setDownloadMsg(''), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-8 p-8 bg-blue-50 rounded-2xl border border-blue-100 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-blue-900 mb-2">{lesson.title}</h2>
          <div className="flex items-center text-blue-700 font-medium">
            {t.lesson} {currentLesson + 1} {t.of} {lessons.length}
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col items-end">
          <button onClick={handleDownload} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-sm">
            {language === 'am' ? 'ማስታወሻዎችን ለቆይታ ያውርዱ' : 'Download Course Notes'}
          </button>
          {downloadMsg && <span className="text-sm text-green-700 mt-2 font-semibold">{downloadMsg}</span>}
        </div>
      </div>
      
      <div className="prose prose-lg prose-blue max-w-none text-gray-800 leading-relaxed font-serif">
         {/* Simple rendering for dummy markdown content avoiding massive markdown library imports, to stick to clean React state. */}
         {(language === 'am' ? lesson.content_am : lesson.content_en)?.split('\n').map((line, i) => {
           if (line.startsWith('# ')) return <h1 key={i} className="text-4xl font-extrabold mt-8 mb-4">{line.replace('# ', '')}</h1>;
           if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold mt-6 mb-3">{line.replace('## ', '')}</h2>;
           if (line.startsWith('- ')) return <li key={i} className="ml-6 mb-2">{line.replace('- ', '')}</li>;
           return <p key={i} className="mb-4 text-gray-700">{line}</p>;
         })}
      </div>

      <div className="mt-12 pt-8 border-t border-gray-200 flex items-center justify-between">
         <button onClick={handlePrev} disabled={currentLesson === 0} className="flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed border hover:bg-gray-50 text-gray-700">
           <ChevronLeft className="w-5 h-5" />
           <span>{t.previous_lesson}</span>
         </button>
         
         <button onClick={handleNext} disabled={currentLesson === lessons.length - 1} className="flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700 text-white shadow-md">
           <span>{t.next_lesson}</span>
           <ChevronRight className="w-5 h-5" />
         </button>
      </div>
    </div>
  );
};

export default NotesSystem;
