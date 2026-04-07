import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useAI } from '../context/AIContext';
import { translations } from '../data/translations';
import { ArrowLeft, Loader2, Award, MessageSquare } from 'lucide-react';

import SidebarWeeks from '../components/course/SidebarWeeks';
import VideoSection from '../components/course/VideoSection';
import NotesSection from '../components/course/NotesSection';
import CodeEditor from '../components/CodeEditor';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const CourseLearningInterface = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user } = useAuth();
  const { openAIPanel } = useAI();
  const t = translations[language] || translations.en;

  const [course, setCourse] = useState(null);
  const [weeks, setWeeks] = useState([]);
  const [activeWeekIndex, setActiveWeekIndex] = useState(0);
  const [completedWeeks, setCompletedWeeks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch course and extract its nested weeks
  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseRes = await axios.get(`${API_URL}/courses/${id}`);
        setCourse(courseRes.data);
        setWeeks(courseRes.data.weeks || []);
      } catch (err) {
        console.error("Error fetching course data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Fetch user progress
  useEffect(() => {
    const fetchProgress = async () => {
      if (course && user) {
        try {
          const { data } = await axios.get(`${API_URL}/progress/${user._id}/${course._id}`);
          setCompletedWeeks(data.completedLessons || []);
        } catch (err) {
          console.error("Failed to sync progress:", err);
        }
      } else if (course && !user) {
        // Fallback for guests
        const progressKey = `progress_weeks_${course._id}`;
        setCompletedWeeks(JSON.parse(localStorage.getItem(progressKey)) || []);
      }
    };
    fetchProgress();
  }, [course, user]);

  const progressPercent = weeks.length > 0 
    ? Math.round((completedWeeks.length / weeks.length) * 100) 
    : 0;

  const markCurrentLessonComplete = async () => {
    const currentWeek = weeks[activeWeekIndex];
    if (!currentWeek || completedWeeks.includes(currentWeek._id)) return;

    const newCompleted = [...completedWeeks, currentWeek._id];
    setCompletedWeeks(newCompleted);

    if (user) {
        try {
          await axios.post(`${API_URL}/progress`, {
            userId: user._id,
            courseId: course._id,
            updateType: 'lesson',
            itemId: currentWeek._id
          });
        } catch (err) {
          console.error("Failed to update progress on server:", err);
        }
    } else {
        localStorage.setItem(`progress_weeks_${course._id}`, JSON.stringify(newCompleted));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0f172a] flex items-center justify-center transition-colors duration-300">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600 dark:text-slate-300 font-medium text-lg tracking-wide">Loading learning environment...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0f172a] flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Course not found</h2>
          <button onClick={() => navigate('/courses')} className="text-blue-600 dark:text-blue-400 hover:underline">
            &larr; Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentWeek = weeks[activeWeekIndex];
  const currentLesson = currentWeek?.lessons && currentWeek.lessons.length > 0 ? currentWeek.lessons[0] : null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white dark:bg-[#0f172a] flex flex-col md:flex-row overflow-hidden font-sans transition-colors duration-300">
      
      {/* LEFT SIDEBAR (Hidden on super small screens, visible md and up) */}
      <div className="w-full md:w-80 lg:w-96 flex-shrink-0 border-r border-gray-200 dark:border-[#1e293b] md:h-[calc(100vh-4rem)] overflow-hidden">
        <SidebarWeeks 
          weeks={weeks}
          activeWeekIndex={activeWeekIndex}
          setActiveWeekIndex={setActiveWeekIndex}
          completedWeeks={completedWeeks}
          progressPercent={progressPercent}
        />
      </div>

      {/* RIGHT MAIN CONTENT AREA */}
      <div className="flex-1 right-content overflow-y-auto min-h-screen md:min-h-0 md:h-[calc(100vh-4rem)] bg-white dark:bg-[#0f172a] relative scroll-smooth transition-colors duration-300">
        
        {/* Top Header Navigation */}
        <div className="bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur-md sticky top-0 z-20 border-b border-gray-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between transition-colors duration-300">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/courses')}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700/50 text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight truncate max-w-sm sm:max-w-md">
              {course.title}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            {currentWeek && (
              <button
                onClick={() => openAIPanel({ course: course.title, module: currentWeek.title })}
                className="bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-600/50 px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center shadow-lg"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Explore with AI
              </button>
            )}

            {currentWeek && !completedWeeks.includes(currentWeek._id) && (
              <button
                onClick={markCurrentLessonComplete}
                className="bg-green-600/20 text-green-400 hover:bg-green-600 hover:text-white border border-green-600/50 px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center shadow-lg"
              >
                <Award className="w-4 h-4 mr-2" />
                Complete Week
              </button>
            )}
            {currentWeek && completedWeeks.includes(currentWeek._id) && (
              <span className="px-4 py-2 rounded-lg font-bold text-sm bg-green-500/10 text-green-400 border border-green-500/20 flex items-center">
                <Award className="w-4 h-4 mr-2" />
                Completed
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        {currentLesson ? (
          <div className="p-4 sm:p-8 lg:p-12 space-y-12 max-w-6xl mx-auto pb-32">
            
            {/* 1. Video Player */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">{currentWeek.title}</h2>
              <VideoSection videoUrl={currentLesson.videoUrl} title={currentLesson.title} />
            </div>

            {/* 2. Text / Notes */}
            <NotesSection lesson={currentLesson} courseId={course._id} weekTitle={currentWeek.title} />

            {/* 3. Interactive Code Sandbox */}
            {currentWeek.codeChallenge && (
              <div id="code-sandbox" className="mt-16">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center border-b border-gray-200 dark:border-slate-800 pb-4">
                  Weekly Code Challenge
                </h3>
                <CodeEditor 
                  challenge={currentWeek.codeChallenge} 
                  courseId={course._id} 
                />
              </div>
            )}
            
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-20 text-center">
            <p className="text-gray-500 dark:text-slate-400 text-xl font-medium">This course doesn't have any lessons configured yet.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default CourseLearningInterface;
