import { useState } from 'react'
import { Moon, Sun, Globe, User, Bell, Shield, Loader2, Save } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'
import { updateProfile, updatePassword, deleteAccount, exportUserData } from '../api/auth'
import { useNavigate } from 'react-router-dom'
import { translations } from '../data/translations'

const Profile = () => {
  const { user, token, updateUser, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { language, toggleLanguage } = useLanguage()
  const navigate = useNavigate()

  // Profile State
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [profileMessage, setProfileMessage] = useState('')

  // Settings State
  const [notifications, setNotifications] = useState(true)

  // Password State
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loadingPassword, setLoadingPassword] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' })

  const t = translations[language] || translations.en;

  const handleUpdateProfile = async () => {
    setLoadingProfile(true)
    setProfileMessage('')
    try {
      const data = await updateProfile({ name, email }, token)
      updateUser({ _id: data._id, name: data.name, email: data.email, role: data.role })
      setProfileMessage('Profile updated successfully!')
      setTimeout(() => setProfileMessage(''), 3000)
    } catch (err) {
      setProfileMessage(`Error: ${err.message}`)
    } finally {
      setLoadingProfile(false)
    }
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match' })
      return
    }
    
    setLoadingPassword(true)
    setPasswordMessage({ type: '', text: '' })
    try {
      await updatePassword({ currentPassword, newPassword }, token)
      setPasswordMessage({ type: 'success', text: 'Password updated successfully!' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setShowPasswordForm(false), 2000)
    } catch (err) {
      setPasswordMessage({ type: 'error', text: err.message })
    } finally {
      setLoadingPassword(false)
    }
  }

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action is irreversible."
    )
    if (confirmed) {
      try {
        await deleteAccount(token)
        logout()
        navigate('/login')
      } catch (err) {
        alert(err.message)
      }
    }
  }

  const handleDownloadData = async () => {
    try {
      const data = await exportUserData(token)
      // Create and download file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const timestamp = new Date().toISOString().slice(0, 10)
      a.download = `code_bridge_export_${user?.name?.replace(/\s+/g, '_') || 'data'}_${timestamp}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      alert(`Error exporting data: ${err.message}`)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-300">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t.settings}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          {t.customize_experience}
        </p>
      </div>

      <div className="space-y-8">
        {/* Profile Section */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
               <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-blue-800 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t.student_profile}</h2>
                <p className="text-gray-500 dark:text-gray-400">{t.manage_account}</p>
              </div>
            </div>
            {profileMessage && (
              <span className={`text-sm ${profileMessage.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
                {profileMessage}
              </span>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.full_name}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="off"
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.email_address}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
             <button 
              onClick={handleUpdateProfile}
              disabled={loadingProfile || (!name || !email)}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm disabled:opacity-50"
            >
              {loadingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {t.save_profile}
            </button>
          </div>
        </div>

        {/* Local override logic for Language/Theme inside Profile */}
        {/* We can re-use the global togglers to sync */}
        <div className="grid md:grid-cols-2 gap-8">
           {/* Language Settings */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-6 overflow-hidden">
            <div className="flex items-center space-x-3 mb-6">
              <Globe className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t.language}</h2>
            </div>
            <div className="flex flex-col gap-4">
              <button onClick={toggleLanguage} className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 w-full rounded-lg py-3 font-medium transition-colors hover:bg-gray-200 dark:hover:bg-gray-600">
                {language === "en" ? "Switch to አምሀርኛ (Amharic)" : "ወደ እንግሊዝኛ ይቀይሩ"}
              </button>
            </div>
          </div>

          {/* Theme Settings */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-6 overflow-hidden">
            <div className="flex items-center space-x-3 mb-6">
              {theme === 'dark' ? (
                <Moon className="w-6 h-6 text-blue-600" />
              ) : (
                <Sun className="w-6 h-6 text-blue-600" />
              )}
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t.theme}</h2>
            </div>
             <div className="flex flex-col gap-4">
               <button onClick={toggleTheme} className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 w-full rounded-lg py-3 font-medium transition-colors hover:bg-gray-200 dark:hover:bg-gray-600">
                {theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
              </button>
            </div>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-6 overflow-hidden">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t.privacy_security}</h2>
          </div>

          <div className="space-y-4">
            {!showPasswordForm ? (
               <button 
                onClick={() => setShowPasswordForm(true)}
                className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white hover:border-blue-500 transition-colors font-medium"
              >
                {t.change_password}
              </button>
            ) : (
              <form onSubmit={handleUpdatePassword} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">{t.change_password}</h3>
                {passwordMessage.text && (
                  <div className={`p-3 rounded-lg text-sm ${passwordMessage.type === 'error' ? 'bg-red-50 dark:bg-red-900/20 text-red-500 border border-red-200 dark:border-red-900' : 'bg-green-50 dark:bg-green-900/20 text-green-500 border border-green-200 dark:border-green-900'}`}>
                    {passwordMessage.text}
                  </div>
                )}
                <div>
                   <input
                    type="password"
                    placeholder={t.current_password}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                   <input
                    type="password"
                    placeholder={t.new_password}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                 <div>
                   <input
                    type="password"
                    placeholder={t.confirm_new_password}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={loadingPassword} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium transition-colors">
                    {loadingPassword ? t.updating : t.update_password}
                  </button>
                  <button type="button" onClick={() => setShowPasswordForm(false)} className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium transition-colors">
                    {t.cancel}
                  </button>
                </div>
              </form>
            )}

            <button 
              onClick={handleDownloadData}
              className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white hover:border-blue-500 transition-colors font-medium">
              {t.download_data}
            </button>
            <button 
              onClick={handleDeleteAccount}
              className="w-full text-left px-4 py-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-xl text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors font-medium"
            >
              {t.delete_account}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Profile