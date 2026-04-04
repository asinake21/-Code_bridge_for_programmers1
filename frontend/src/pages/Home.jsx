import { Link } from 'react-router-dom';
import bg from "../assets/images/bg.avif";
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';

export default function Home() {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-white transition-colors duration-300">

      {/* HERO */}
      <section
        className="relative h-[60vh] flex items-center justify-center text-center overflow-hidden"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-white/70 dark:bg-black/60 backdrop-blur-sm"></div>

        <div className="relative z-10 max-w-3xl px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight leading-tight">
            {t.hero_title}
          </h1>
          <p className="text-lg md:text-xl mb-10 text-gray-700 dark:text-gray-300 font-medium">
            {t.hero_subtitle}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/courses" className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-0.5 transition-all">
              {t.start_learning}
            </Link>
            <Link to="/ai-assistant" className="px-8 py-3 bg-white/80 dark:bg-transparent border border-gray-300 dark:border-gray-600 font-semibold rounded-xl shadow-sm hover:bg-gray-100 dark:hover:bg-gray-800 hover:-translate-y-0.5 transition-all">
              {t.ai}
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-6 max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {[
          { title: t.ai_title || t.ai, icon: "🤖", path: "/ai-assistant", desc: t.ai_desc },
          { title: t.courses, icon: "📚", path: "/courses", desc: t.search_desc || "Follow structured, step-by-step learning paths." },
          { title: t.downloads, icon: "⬇️", path: "/downloads", desc: t.downloaded_content }
        ].map((item) => (
          <Link
            key={item.title}
            to={item.path}
            className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 hover:border-blue-500/50 hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col items-start"
          >
            <div className="text-4xl mb-4 bg-gray-50 dark:bg-slate-700 p-4 rounded-xl">{item.icon}</div>
            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
              {item.desc}
            </p>
          </Link>
        ))}
      </section>



      {/* FOOTER */}
      <footer className="py-8 border-t border-gray-200 dark:border-slate-800 text-center text-gray-500 dark:text-gray-500 font-medium text-sm">
         <p>© 2026 Code Bridge — Simple. Smart. Secure.</p>
      </footer>

    </div>
  );
}