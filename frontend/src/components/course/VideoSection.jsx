import React from 'react';
import { MonitorPlay } from 'lucide-react';

const VideoSection = ({ videoUrl, title }) => {
  if (!videoUrl) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-gray-100/50 dark:bg-slate-800/50 rounded-2xl border border-gray-200 dark:border-slate-700 h-[400px] transition-colors duration-300">
        <MonitorPlay className="w-16 h-16 text-gray-400 dark:text-slate-600 mb-4" />
        <h3 className="text-xl font-bold text-gray-400 dark:text-slate-400">No video available for this week</h3>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden shadow-xl bg-black border border-gray-200 dark:border-slate-700 relative group max-w-[420px] max-h-[180px] hero-video-small transition-all hover:scale-[1.02]">
      <div className="aspect-video relative w-full h-[180px] bg-black">
        <iframe
          src={videoUrl}
          className="absolute inset-0 w-full h-full"
          allowFullScreen
          title={`Lesson Video: ${title}`}
        />
      </div>
    </div>
  );
};

export default VideoSection;
