import { useState, useEffect } from 'react';
import { CheckCircle, BookOpen, Trash2, Download, ExternalLink, Play } from 'lucide-react';
import { downloadApi } from '../api';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { translations } from '../data/translations';
import axios from 'axios';

const Downloads = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const t = translations[language] || translations.en;
  
  const [downloadedCourses, setDownloadedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchDownloads = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const data = await downloadApi.getAll(user._id);
      setDownloadedCourses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDownloads();
  }, [user]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm(language === 'en' ? 'Remove from downloads?' : 'ከማውረጃዎች ይወገድ?')) return;
    try {
       await downloadApi.remove(id);
       setDownloadedCourses(prev => prev.filter(d => d._id !== id));
    } catch (err) {
       console.error("Delete failed:", err.message);
       alert(language === 'en' ? "Failed to delete: " + err.message : "መሰረዝ አልተቻለም: " + err.message);
    }
  };

  return (
    <div className="bg-background min-h-[calc(100vh-4rem)] pb-12 transition-colors">
      {/* Header Section */}
      <div className="bg-surface border-b border-border py-12 mb-8 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <h1 className="text-4xl font-black text-text mb-4 tracking-tight flex items-center gap-3">
              <Download className="w-10 h-10 text-primary" /> {t.downloads}
           </h1>
           <p className="text-text-secondary text-lg font-medium max-w-2xl">
              {language === 'en' ? 'Access your learning materials offline. Connect with your downloaded curriculum.' : 'የመማሪያ ሰነዶችዎን ከመስመር ውጭ ያግኙ። ከወረደው ስርዓተ ትምህርት ጋር ይገናኙ።'}
           </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <p className="text-text-secondary font-bold uppercase tracking-widest text-xs">{t.loading_curriculum}</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 text-red-500 border border-red-500/20 p-6 rounded-2xl flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">!</div>
             <p className="font-bold">{error}</p>
          </div>
        ) : downloadedCourses.length === 0 ? (
          <div className="text-center py-24 bg-surface rounded-3xl border border-border shadow-soft">
            <div className="w-20 h-20 bg-background rounded-2xl border border-border flex items-center justify-center mx-auto mb-6 shadow-sm">
               <Download className="w-10 h-10 text-text-secondary opacity-20" />
            </div>
            <h2 className="text-2xl font-black text-text mb-2 tracking-tight">{t.no_downloads}</h2>
            <p className="text-text-secondary font-medium mb-8 max-w-md mx-auto">
              {language === 'en' ? 'Browse the Courses page and download content for offline viewing.' : 'ኮርሶችን ያስሱ እና ከመስመር ውጭ ለማጥናት ያውርዱ።'}
            </p>
            <button 
              onClick={() => navigate('/courses')}
              className="bg-primary text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 active:scale-95"
            >
               {language === 'en' ? 'Explore Courses' : 'ኮርሶችን ያስሱ'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {downloadedCourses.map((download) => (
              <div 
                key={download._id} 
                onClick={() => navigate(`/course/${download.courseId?._id || download.courseId}`)}
                className="group bg-surface border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all cursor-pointer shadow-soft hover:shadow-xl"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 bg-background border border-border rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-primary/5 transition-colors">
                      <Play className="w-6 h-6 text-primary" fill="currentColor" />
                    </div>
                    <button 
                      onClick={(e) => handleDelete(download._id, e)}
                      className="p-2 text-text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <h3 className="text-xl font-black text-text mb-2 tracking-tight line-clamp-2 leading-tight">
                    {download.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-6">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">
                       {language === 'en' ? 'Available Offline' : 'ከመስመር ውጭ ይገኛል'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-border">
                    <div className="flex items-center gap-2">
                       <CheckCircle className="w-4 h-4 text-green-500" />
                       <span className="text-xs font-bold text-text-secondary">
                          {new Date(download.downloadedAt).toLocaleDateString()}
                       </span>
                    </div>
                    <div className="flex items-center gap-1 text-primary group-hover:translate-x-1 transition-transform">
                       <span className="text-xs font-black uppercase tracking-widest">{t.open_offline}</span>
                       <ExternalLink className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Downloads;