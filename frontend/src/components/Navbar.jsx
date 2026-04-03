import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Code, LogOut, User as UserIcon, LayoutDashboard, Moon, Sun, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';

const Navbar = ({ onMenuClick }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language] || translations.en;
  
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { path: '/', label: t.home },
    { path: '/ai-assistant', label: t.ai, private: true },
    { path: '/courses', label: t.courses, private: true },
    { path: '/downloads', label: t.downloads, private: true },
  ];

  const visibleNavItems = navItems.filter(item => !item.private || user);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-50 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-6">
             <button
                onClick={onMenuClick}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <Menu className="w-5 h-5" />
              </button>
            <Link to="/" className="flex items-center space-x-2 mr-4">
              <Code className="w-7 h-7 text-blue-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Code Bridge</span>
            </Link>

            <div className="hidden md:flex space-x-2">
              {visibleNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 border-b-2 ${
                    location.pathname === item.path
                      ? 'border-blue-600 text-blue-600 bg-blue-50 dark:bg-gray-800 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4 ml-auto relative" ref={dropdownRef}>
            
            {/* Global Toggles */}
            <div className="flex items-center gap-2 mr-2 border-r border-gray-200 dark:border-gray-700 pr-4">
               <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 text-sm font-medium transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  {language === "en" ? "AM" : "EN"}
                </button>

                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
                >
                  {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  {theme === "light" ? "Dark" : "Light"}
                </button>
            </div>

            {!user ? (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t.signin}
                </Link>
                <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  {t.register}
                </Link>
              </div>
            ) : (
              <div className="relative">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:ring-2 focus:ring-blue-600 focus:outline-none"
                >
                   <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-blue-800 text-white flex items-center justify-center font-bold text-sm shadow-md">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 mb-2">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                    </div>

                    {user.role === 'admin' && (
                      <Link 
                        to="/admin" 
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 mr-3" />
                         {t.admin_panel}
                      </Link>
                    )}

                    {!user.role || user.role === 'user' ? (
                      <Link 
                        to="/profile" 
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <UserIcon className="w-4 h-4 mr-3" />
                        {t.student_profile}
                      </Link>
                    ) : null}
                    
                    <button 
                      onClick={() => {
                        logout();
                        setShowDropdown(false);
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      {t.logout}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;