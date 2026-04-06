import { Link, useLocation } from 'react-router-dom';
import { X, Info, Settings, HelpCircle, Home, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();
  const { language } = useLanguage();
  const t = translations[language] || translations["en"];

  const sidebarItems = [
    { path: '/', label: t.home, icon: Home },
    { path: '/about', label: t.about, icon: Info },
    { path: '/profile', label: t.student_profile, icon: Settings },
    { path: '/help', label: t.help, icon: HelpCircle },
  ];

  // Dynamically add Admin Panel if user is admin
  if (user?.role === 'admin') {
    sidebarItems.push({ path: '/admin', label: t.admin_panel, icon: LayoutDashboard });
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-slate-900 text-white shadow-2xl transform transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-black tracking-tight uppercase">{t.navigation}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-slate-300 hover:text-white" />
          </button>
        </div>

        <nav className="p-4 space-y-1 mt-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center space-x-3 px-4 py-3 rounded-md font-medium transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-primary text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-5 h-5 ${location.pathname === item.path ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;