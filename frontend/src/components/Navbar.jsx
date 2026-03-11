import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../api/axiosInstance';
import { 
  ShieldAlert, 
  Home, 
  PlusCircle, 
  List, 
  LogOut, 
  LogIn, 
  UserPlus, 
  User, 
  Bell 
} from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Reading from localStorage to determine UI state
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    toast.success('Logged out successfully');
    navigate('/signin');
  };

  // Helper to highlight the active tab
  const isActive = (path) => location.pathname === path ? "text-blue-600 font-bold" : "text-slate-600 hover:text-blue-600";

  // Fetch Citizen's complaints in the background to derive notifications
  const { data: myComplaints } = useQuery({
    queryKey: ['mycomplaints', 'notifications'],
    queryFn: async () => {
      const res = await api.get('/mycomplaints'); // Fetches all user complaints
      return res.data.data;
    },
    enabled: role === 'Citizen' && !!token, // Only run this if they are a logged-in citizen
    refetchInterval: 10000 // Poll every 10 seconds for updates
  });

  // Extract all reviews from all complaints, flatten the array, and sort by newest first
  const notifications = myComplaints?.flatMap(c => 
    c.reviews.map(r => ({ ...r, complaintId: c._id, complaintTitle: c.title }))
  ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5) || []; // Get top 5 newest

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Brand / Logo */}
          <Link to="/" className="flex items-center gap-2">
            <ShieldAlert className="text-blue-600" size={28} />
            <span className="text-xl font-extrabold text-slate-800 tracking-tight">
              Gov<span className="text-blue-600">Resolve</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6 text-sm font-medium">
            
            {/* Logged Out View */}
            {!token ? (
              <>
                <Link to="/signin" className={`flex items-center gap-1 ${isActive('/signin')}`}>
                  <LogIn size={18} /> Sign In
                </Link>
                <Link to="/signup" className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  <UserPlus size={18} /> Sign Up
                </Link>
              </>
            ) : (
              
              /* Logged In View */
              <>
                <Link to="/" className={`flex items-center gap-1 ${isActive('/')}`}>
                  <Home size={18} /> Dashboard
                </Link>
                
                <Link to="/profile" className={`flex items-center gap-1 ${isActive('/profile')}`}>
                     <User size={18} /> Profile
                </Link>

                {/* Citizen-Only Links */}
                {role === 'Citizen' && (
                  <>
                    <Link to="/create" className={`flex items-center gap-1 ${isActive('/create')}`}>
                      <PlusCircle size={18} /> Lodge Complaint
                    </Link>
                    <Link to="/my-complaints" className={`flex items-center gap-1 ${isActive('/my-complaints')}`}>
                      <List size={18} /> My Complaints
                    </Link>
                    
                    {/* Notification Bell Dropdown */}
                    <div className="relative">
                      <button 
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2 text-slate-600 hover:text-blue-600 transition hover:bg-slate-100 rounded-full"
                      >
                        <Bell size={20} />
                        {notifications.length > 0 && (
                          <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                        )}
                      </button>

                      {/* Dropdown Menu */}
                      {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">
                          <h4 className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider border-b">Recent Activity</h4>
                          {notifications.length === 0 ? (
                            <div className="px-4 py-6 text-center text-slate-500 text-sm">No new notifications</div>
                          ) : (
                            <div className="max-h-80 overflow-y-auto">
                              {notifications.map((notif, idx) => (
                                <Link 
                                  key={idx} 
                                  to={`/complaint/${notif.complaintId}`}
                                  onClick={() => setShowNotifications(false)}
                                  className="block px-4 py-3 hover:bg-blue-50 border-b border-slate-50 last:border-0 transition"
                                >
                                  <p className="text-xs text-blue-600 font-bold mb-1">Status Update: {notif.status}</p>
                                  <p className="text-sm font-semibold text-slate-800 truncate">{notif.complaintTitle}</p>
                                  <p className="text-xs text-slate-500 mt-1 truncate">"{notif.comment}"</p>
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Officer-Only Indicator */}
                {role === 'Officer' && (
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold uppercase tracking-wider border border-slate-200">
                    Officer Portal
                  </span>
                )}

                {/* Logout Button */}
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition ml-2"
                >
                  <LogOut size={18} /> Logout
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}