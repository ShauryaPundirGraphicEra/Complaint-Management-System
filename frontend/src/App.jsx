import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// 🚨 CRITICAL: You must import every page you use in your Routes
import Dashboard from './pages/Dashboard';
import ComplaintDetail from './pages/ComplaintDetail';
import SignIn from './pages/SignIn';
import CreateComplaint from './pages/CreateComplaint';
import MyComplaints from './pages/MyComplaints';
// You will need a SignUp page since your backend has a /signup route
import SignUp from './pages/SignUp';
// A Navbar to navigate between these pages
import Navbar from './components/Navbar'; 
import UserProfile from './pages/UserProfile';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        {/* Global Toast Notification Container */}
        <Toaster position="top-right" /> 
        
        {/* The Navbar goes OUTSIDE the Routes so it persists on every page */}
        <Navbar />
        
        {/* Added a main wrapper to ensure background colors are consistent */}
        <main className="pb-12"> 
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/complaint/:id" element={<ComplaintDetail />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/create" element={<CreateComplaint />} />
            <Route path="/my-complaints" element={<MyComplaints />} />
            <Route path="/profile" element={<UserProfile />} /> {/* For "My Profile" */}
            <Route path="/profile/:id" element={<UserProfile />} /> {/* For viewing others */}
          </Routes>
        </main>

      </Router>
    </QueryClientProvider>
  );
}