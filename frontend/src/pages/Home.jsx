import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';

export default function Home() {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  // Home-specific text that doesn't exist in translations yet
  const homeText = {
    en: {
      welcome_banner: `👋 Welcome to Code_Bridge — Built for Ethiopian developers, by Ethiopian developers`,
      hero_title_line1: 'Learn to code.',
      hero_title_line2: 'Change your future.',
      hero_subtitle: 'Code Bridge gives you real programming skills — structured courses, an AI tutor that answers in both English and Amharic, and free resources you can download and keep.',
      try_ai: 'Try the AI Tutor',
      why_title: 'Why students love it',
      why_subtitle: "We built Code Bridge because learning to code in Ethiopia shouldn't be hard, expensive, or only in English.",
      w1_title: 'Actually job-ready', w1_desc: 'Every lesson maps to real skills employers hire for.',
      w2_title: 'AI that gets you', w2_desc: 'Ask questions in Amharic or English and get clear answers.',
      w3_title: 'No tutorial hell', w3_desc: 'Structured roadmaps so you always know what to learn next.',
      w4_title: 'Learn on your time', w4_desc: 'Fully self-paced. Pick up where you left off, any device.',
      features_subtitle: 'Three tools. One goal: get you writing real code, fast.',
      ai_meta1: 'Available 24/7', ai_meta2: 'Bilingual',
      courses_meta1: '6 courses', courses_meta2: 'Beginner friendly',
      dl_meta1: 'Instant access', dl_meta2: 'Keep forever',
      explore_subtitle: 'Choose your development specialization',
      cta_line1: 'Your next chapter starts here.',
      cta_line2: "It's free. It's in your language. And it's built to actually get you hired.",
      start_free: 'Start for free →',
      footer_brand: '<> Code Bridge',
      footer_sub: '© 2026 · Built in Ethiopia · Free forever',
      explore_arrow: 'Explore →',
    },
    am: {
      welcome_banner: `👋 ወደ Code_Bridge እንኳን ደህና መጡ — ለኢትዮጵያ ገንቢዎች፣ በኢትዮጵያ ገንቢዎች`,
      hero_title_line1: 'ኮድ ይማሩ።',
      hero_title_line2: 'ወደፊቱን ይቀይሩ።',
      hero_subtitle: 'ኮድ ብሪጅ እውነተኛ የፕሮግራሚንግ ክህሎቶችን ይሰጥዎታል — የተዋቀሩ ኮርሶች፣ በሁለቱም ቋንቋዎች (አማርኛ እና እንግሊዝኛ) የሚመልስ AI ቲዩተር፣ እና ነፃ ግብዓቶች።',
      try_ai: 'AI ቲዩተር ይሞክሩ',
      why_title: 'ተማሪዎች ለምን ይወዱታል',
      why_subtitle: 'ኮድ ብሪጅን ገነባነው ምክንያቱም ኢትዮጵያ ውስጥ ኮድ ማጥናት ከባድ፣ ዋጋ ውድ ወይም በእንግሊዝኛ ብቻ መሆን የለበትም።',
      w1_title: 'ለስራ ዝግጁ ያደርጋል', w1_desc: 'እያንዳንዱ ትምህርት ቀጣሪዎች ለሚፈልጓቸው ክህሎቶች ይዘጋጃል።',
      w2_title: 'የሚረዳዎ AI', w2_desc: 'ጥያቄዎቻቸውን በአማርኛ ወይም እንግሊዝኛ ይጠይቁ እና ግልጽ ምላሾችን ያግኙ።',
      w3_title: 'ምንም ግራ መጋባት የለም', w3_desc: 'የተዋቀሩ ካርታዎች ስለዚህ ሁልጊዜ ቀጥሎ ምን ማጥናት እንዳለቦት ያውቃሉ።',
      w4_title: 'በጊዜዎ ይማሩ', w4_desc: 'ሙሉ ራስ-ፍጥነት። ባቆሙበት ቦታ ይቀጥሉ፣ በማንኛውም መሳሪያ።',
      features_subtitle: 'ሶስት መሳሪያዎች። አንድ ግብ፡ ፈጥኖ እውነተኛ ኮድ ማዘጋጀት።',
      ai_meta1: 'ሁልጊዜ ይትገኛል', ai_meta2: 'ሁለቱም ቋንቋዎች',
      courses_meta1: '6 ኮርሶች', courses_meta2: 'ለጀማሪዎች ምቹ',
      dl_meta1: 'ፈጣን መዳረሻ', dl_meta2: 'ሁልጊዜ ጋር ይኑርዎ',
      explore_subtitle: 'የዕድገት ስፔሻሊዜሽን ይምረጡ',
      cta_line1: 'ቀጣዩ ምዕራፍዎ እዚህ ይጀምራል።',
      cta_line2: 'ነፃ ነው። በቋንቋዎ ነው። እና ስራ ለማግኘት እንዲረዳዎ ተሰርቷል።',
      start_free: 'በነፃ ይጀምሩ →',
      footer_brand: '<> Code Bridge',
      footer_sub: '© 2026 · በኢትዮጵያ ተሰርቷል · ሁልጊዜ ነፃ',
      explore_arrow: 'ይሂዱ →',
    },
  };

  const h = homeText[language] || homeText.en;

  const whyItems = [
    { emoji: '🎯', title: h.w1_title, desc: h.w1_desc, bg: 'dark:bg-blue-950/30 dark:border-blue-800/30' },
    { emoji: '🤖', title: h.w2_title, desc: h.w2_desc, bg: 'dark:bg-purple-950/30 dark:border-purple-800/30' },
    { emoji: '📚', title: h.w3_title, desc: h.w3_desc, bg: 'dark:bg-emerald-950/30 dark:border-emerald-800/30' },
    { emoji: '🌍', title: h.w4_title, desc: h.w4_desc, bg: 'dark:bg-orange-950/30 dark:border-orange-800/30' },
  ];

  const features = [
    {
      icon: '🤖', path: '/ai-assistant',
      title: t.feat_ai_title, badge: t.feat_ai_badge,
      badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
      desc: t.feat_ai_desc, grad: 'from-blue-500 to-indigo-600',
      meta: [h.ai_meta1, h.ai_meta2],
    },
    {
      icon: '📚', path: '/courses',
      title: t.feat_courses_title, badge: t.feat_courses_badge,
      badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
      desc: t.feat_courses_desc, grad: 'from-emerald-500 to-teal-600',
      meta: [h.courses_meta1, h.courses_meta2],
    },
    {
      icon: '⬇️', path: '/downloads',
      title: t.feat_dl_title, badge: null,
      badgeColor: '',
      desc: t.feat_dl_desc, grad: 'from-orange-500 to-amber-500',
      meta: [h.dl_meta1, h.dl_meta2],
    },
  ];

  const paths = [
    { icon: '💻', title: t.path_frontend, desc: t.path_frontend_desc, color: 'hover:border-blue-400 dark:hover:border-blue-500', iconBg: 'bg-blue-50 dark:bg-blue-950/50' },
    { icon: '⚙️', title: t.path_backend, desc: t.path_backend_desc, color: 'hover:border-emerald-400 dark:hover:border-emerald-500', iconBg: 'bg-emerald-50 dark:bg-emerald-950/50' },
    { icon: '🚀', title: t.path_fullstack, desc: t.path_fullstack_desc, color: 'hover:border-purple-400 dark:hover:border-purple-500', iconBg: 'bg-purple-50 dark:bg-purple-950/50' },
    { icon: '🧠', title: t.path_ai, desc: t.path_ai_desc, color: 'hover:border-orange-400 dark:hover:border-orange-500', iconBg: 'bg-orange-50 dark:bg-orange-950/50' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#080d1a] text-gray-900 dark:text-white transition-colors duration-300 font-sans">

      {/* ── WELCOME BANNER ── */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 text-center text-white text-xs font-semibold tracking-wide">
        {h.welcome_banner}
      </div>

      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-indigo-500/5 dark:bg-indigo-500/15 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 rounded-full px-4 py-1.5 text-xs font-semibold mb-8 shadow-sm">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            {language === 'am' ? 'ነፃ መድረክ · ምንም ክሬዲት ካርድ አያስፈልግም' : 'Free platform · No credit card needed'}
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[1.08] tracking-tight text-gray-900 dark:text-white">
            {h.hero_title_line1}<br />
            <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
              {h.hero_title_line2}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            {h.hero_subtitle}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/courses"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/25 hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-200"
            >
              {t.start_learning} →
            </Link>
            <Link
              to="/ai-assistant"
              className="px-8 py-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-200 backdrop-blur-sm"
            >
              {h.try_ai}
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY CODE BRIDGE ── */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4 text-gray-900 dark:text-white">{h.why_title}</h2>
          <p className="text-gray-500 dark:text-slate-400 max-w-lg mx-auto">{h.why_subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyItems.map(item => (
            <div
              key={item.title}
              className={`p-6 rounded-2xl border border-gray-100 bg-gray-50 ${item.bg} hover:-translate-y-1 hover:shadow-lg transition-all duration-300`}
            >
              <div className="text-3xl mb-4">{item.emoji}</div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PLATFORM FEATURES ── */}
      <section className="py-24 px-6 bg-gray-50 dark:bg-white/[0.02] border-y border-gray-100 dark:border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4 text-gray-900 dark:text-white">{t.platform_features}</h2>
            <p className="text-gray-500 dark:text-slate-400">{h.features_subtitle}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map(item => (
              <Link
                key={item.title}
                to={item.path}
                className="group bg-white dark:bg-white/5 dark:hover:bg-white/[0.08] border border-gray-200 dark:border-white/10 rounded-2xl p-8 flex flex-col hover:shadow-2xl dark:hover:shadow-black/40 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
              >
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.grad} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="flex justify-between items-start mb-6">
                  <div className="text-4xl">{item.icon}</div>
                  {item.badge && (
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${item.badgeColor}`}>{item.badge}</span>
                  )}
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed flex-grow mb-6">{item.desc}</p>
                <div className="flex gap-3 flex-wrap">
                  {item.meta.map(m => (
                    <span key={m} className="text-xs text-gray-400 dark:text-slate-500 bg-gray-100 dark:bg-white/5 rounded-full px-3 py-1 font-medium">{m}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── LEARNING PATHS ── */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4 text-gray-900 dark:text-white">{t.explore_paths}</h2>
          <p className="text-gray-500 dark:text-slate-400">{h.explore_subtitle}</p>
        </div>
        <div className="grid md:grid-cols-4 gap-5">
          {paths.map(path => (
            <Link
              key={path.title}
              to="/courses"
              className={`group p-6 rounded-2xl border border-gray-100 dark:border-white/10 bg-white dark:bg-white/[0.03] hover:shadow-lg dark:hover:shadow-black/30 hover:-translate-y-1 transition-all duration-300 text-center ${path.color}`}
            >
              <div className={`w-14 h-14 ${path.iconBg} rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4`}>{path.icon}</div>
              <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{path.title}</h3>
              <p className="text-xs text-gray-500 dark:text-slate-500">{path.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 px-6 text-center bg-white dark:bg-[#080d1a] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto">
          <h2 className="text-5xl font-black mb-5 text-gray-900 dark:text-white leading-tight">
            {h.cta_line1}
          </h2>
          <p className="text-lg text-gray-500 dark:text-slate-400 mb-12 leading-relaxed">
            {h.cta_line2}
          </p>
          <Link
            to="/courses"
            className="inline-block px-12 py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl shadow-2xl shadow-blue-600/25 hover:shadow-blue-500/30 hover:-translate-y-1 transition-all duration-200"
          >
            {h.start_free}
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-10 border-t border-gray-100 dark:border-white/5 text-center text-sm text-gray-400 dark:text-slate-500 bg-gray-50 dark:bg-[#060b17]">
        <p className="font-bold text-gray-700 dark:text-slate-300 mb-1">{h.footer_brand}</p>
        <p>{h.footer_sub}</p>
      </footer>

    </div>
  );
}