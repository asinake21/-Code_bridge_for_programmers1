import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Settings, LayoutDashboard, PlusCircle, Trash2, X, Play, Loader2 } from 'lucide-react';
import { getUsers, deleteAdminUser } from '../api/auth';
import { getCourses, deleteCourse, createCourse } from '../api/courses';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [usersList, setUsersList] = useState([]);
  const [coursesList, setCoursesList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [showAddCourseForm, setShowAddCourseForm] = useState(false);
  const { token, user } = useAuth();

  // New Course State
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    category: 'Full Stack Development',
    level: 'Beginner',
    duration: '4 weeks',
    icon: 'Code'
  });

  useEffect(() => {
    if (activeTab === 'users' || activeTab === 'dashboard') {
      fetchUsers();
    }
    if (activeTab === 'courses' || activeTab === 'dashboard') {
      fetchCourses();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await getUsers(token);
      setUsersList(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchCourses = async () => {
    setLoadingCourses(true);
    try {
      const data = await getCourses();
      setCoursesList(data);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    } finally {
      setLoadingCourses(false);
    }
  };

  const handleDeleteUser = async (id, role) => {
    if (role === 'admin') {
      alert("Cannot delete another admin.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteAdminUser(id, token);
        fetchUsers();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await deleteCourse(id, token);
        fetchCourses();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      await createCourse(courseForm, token);
      setShowAddCourseForm(false);
      setCourseForm({
        title: '',
        description: '',
        category: 'Full Stack Development',
        level: 'Beginner',
        duration: '4 weeks',
        icon: 'Code'
      });
      fetchCourses();
    } catch (err) {
      alert(err.message);
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'courses', label: 'Manage Courses', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'users', label: 'View Users', icon: <Users className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> }
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-surface border-r border-border p-6 flex flex-col gap-2">
        <h2 className="text-xl font-bold text-text mb-6 tracking-wide">Admin Panel</h2>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === tab.id 
                ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                : 'text-text-secondary hover:text-text hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            {tab.icon}
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto border border-border bg-surface rounded-2xl p-8 shadow-soft">
          
          {activeTab === 'dashboard' && (
            <div>
              <h3 className="text-2xl font-bold text-text mb-6">Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "Total Users", value: loadingUsers ? "..." : usersList.length, icon: <Users className="w-6 h-6 text-blue-400" /> },
                  { label: "Active Courses", value: loadingCourses ? "..." : coursesList.length, icon: <BookOpen className="w-6 h-6 text-green-400" /> },
                  { label: "Total Admins", value: loadingUsers ? "..." : usersList.filter(u => u.role === 'admin').length, icon: <LayoutDashboard className="w-6 h-6 text-purple-400" /> },
                ].map((stat, i) => (
                  <div key={i} className="bg-background border border-border rounded-xl p-6 flex items-center justify-between">
                    <div>
                      <p className="text-text-secondary text-sm font-medium mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-text">{stat.value}</p>
                    </div>
                    <div className="w-12 h-12 bg-surface border border-border shadow-sm rounded-full flex items-center justify-center">
                      {stat.icon}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-text">Manage Courses</h3>
                <button 
                  onClick={() => setShowAddCourseForm(!showAddCourseForm)}
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
                >
                  {showAddCourseForm ? <X className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
                  {showAddCourseForm ? 'Cancel' : 'Add Course'}
                </button>
              </div>

              {showAddCourseForm && (
                <div className="bg-background border border-border rounded-xl p-6 mb-8 shadow-sm">
                  <h4 className="text-lg font-bold text-text mb-4">Create New Course</h4>
                  <form onSubmit={handleAddCourse} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm text-text-secondary mb-1">Title</label>
                      <input required type="text" value={courseForm.title} onChange={e => setCourseForm({...courseForm, title: e.target.value})} className="w-full px-4 py-2 border border-border bg-surface text-text rounded-lg" placeholder="e.g. Next.js Architecture" />
                    </div>
                    <div className="md:col-span-2">
                       <label className="block text-sm text-text-secondary mb-1">Description</label>
                       <textarea required value={courseForm.description} onChange={e => setCourseForm({...courseForm, description: e.target.value})} className="w-full px-4 py-2 border border-border bg-surface text-text rounded-lg" placeholder="Detailed course description..."></textarea>
                    </div>
                    <div>
                      <label className="block text-sm text-text-secondary mb-1">Category</label>
                      <input required type="text" value={courseForm.category} onChange={e => setCourseForm({...courseForm, category: e.target.value})} className="w-full px-4 py-2 border border-border bg-surface text-text rounded-lg" placeholder="Frontend, Backend, etc." />
                    </div>
                    <div>
                      <label className="block text-sm text-text-secondary mb-1">Level</label>
                      <select value={courseForm.level} onChange={e => setCourseForm({...courseForm, level: e.target.value})} className="w-full px-4 py-2 border border-border bg-surface text-text rounded-lg">
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                     <div>
                      <label className="block text-sm text-text-secondary mb-1">Duration</label>
                      <input required type="text" value={courseForm.duration} onChange={e => setCourseForm({...courseForm, duration: e.target.value})} className="w-full px-4 py-2 border border-border bg-surface text-text rounded-lg" placeholder="e.g. 4 weeks" />
                    </div>
                    <div>
                      <label className="block text-sm text-text-secondary mb-1">Icon Name (Lucide)</label>
                      <input required type="text" value={courseForm.icon} onChange={e => setCourseForm({...courseForm, icon: e.target.value})} className="w-full px-4 py-2 border border-border bg-surface text-text rounded-lg" placeholder="e.g. Code, Server, Database" />
                    </div>
                    <div className="md:col-span-2 flex justify-end mt-2">
                      <button type="submit" className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors">Submit Course</button>
                    </div>
                  </form>
                </div>
              )}

              <div className="bg-background border border-border rounded-xl overflow-hidden text-sm shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-surface/50 text-text-secondary border-b border-border">
                    <tr>
                      <th className="px-6 py-4 font-medium">Course Title</th>
                      <th className="px-6 py-4 font-medium">Category</th>
                      <th className="px-6 py-4 font-medium">Level</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingCourses ? (
                       <tr>
                        <td colSpan="4" className="text-center py-8 text-text-secondary">Loading courses...</td>
                      </tr>
                    ) : coursesList.length > 0 ? (
                      coursesList.map((course) => (
                         <tr key={course._id} className="border-b border-border hover:bg-surface/50 transition-colors">
                            <td className="px-6 py-4 text-text font-medium">{course.title}</td>
                            <td className="px-6 py-4 text-text-secondary">{course.category}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                course.level === 'Beginner' ? 'bg-green-500/20 text-green-500 border border-green-500/20' : 
                                course.level === 'Intermediate' ? 'bg-orange-500/20 text-orange-500 border border-orange-500/20' :
                                'bg-red-500/20 text-red-500 border border-red-500/20'
                              }`}>
                                {course.level}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button onClick={() => handleDeleteCourse(course._id)} className="text-red-400 hover:text-red-500 p-2 hover:bg-red-500/10 rounded-lg transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                         </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-8 text-text-secondary">No courses found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h3 className="text-2xl font-bold text-text mb-6">Registered Users</h3>
              <div className="bg-background border border-border rounded-xl overflow-hidden text-sm shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-surface/50 text-text-secondary border-b border-border">
                    <tr>
                      <th className="px-6 py-4 font-medium">Name</th>
                      <th className="px-6 py-4 font-medium">Email</th>
                      <th className="px-6 py-4 font-medium">Role</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingUsers ? (
                      <tr>
                        <td colSpan="4" className="text-center py-8 text-text-secondary">Loading users...</td>
                      </tr>
                    ) : usersList.length > 0 ? (
                      usersList.map((usr) => (
                        <tr key={usr._id} className="border-b border-border hover:bg-surface/50 transition-colors">
                          <td className="px-6 py-4 text-text font-medium flex items-center gap-3">
                            {usr.name} {usr._id === user._id && <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full">You</span>}
                          </td>
                          <td className="px-6 py-4 text-text-secondary">{usr.email}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              usr.role === 'admin' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                            }`}>
                              {usr.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => handleDeleteUser(usr._id, usr.role)}
                              disabled={usr.role === 'admin'}
                              className={`p-2 rounded-lg transition-colors ${
                                usr.role === 'admin' 
                                  ? 'text-gray-400 cursor-not-allowed opacity-50' 
                                  : 'text-red-400 hover:text-red-500 hover:bg-red-500/10'
                              }`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-8 text-text-secondary">No users found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h3 className="text-2xl font-bold text-text mb-6">Platform Settings</h3>
               <div className="bg-background border border-border rounded-xl p-8 text-center text-text-secondary shadow-sm">
                <p>Global platform configurations will be wired up here in a future update!</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
