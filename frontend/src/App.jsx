import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'

import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import AIChat from './pages/AIChat'
import Courses from './pages/Courses'
import CoursePage from './pages/CoursePage'
import CourseDetail from './pages/CourseDetail'
import Notes from './pages/Notes'
import Downloads from './pages/Downloads'
import Profile from './pages/Profile'
import About from './pages/About'

import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'
import PrivateRoute from './components/PrivateRoute'
import { AuthProvider } from './context/AuthContext'

import { useLanguage } from './context/LanguageContext'
import Help from './pages/Help'
import LearningDashboard from './pages/LearningDashboard'
import { AIProvider } from './context/AIContext'
import AIFloatingButton from './components/AIFloatingButton'
import AIPanel from './components/AIPanel'
import React from 'react';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { language: lang } = useLanguage()

  return (
    <AuthProvider>
      <AIProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="pt-16">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About lang={lang} />} />
            <Route path="/help" element={<Help lang={lang} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/ai-assistant" element={<AIChat />} />
              <Route path="/learn" element={<LearningDashboard />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:id" element={<CoursePage />} />
              <Route path="/course/:id" element={<CourseDetail />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/downloads" element={<Downloads />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Admin Only Route */}
            <Route element={<PrivateRoute adminOnly={true} />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
          </Routes>
        </main>

        {/* Global UI Tools - AI Floating Overlay */}
        <AIFloatingButton />
        <AIPanel />
      </div>
      </AIProvider>
    </AuthProvider>
  )
}

export default App