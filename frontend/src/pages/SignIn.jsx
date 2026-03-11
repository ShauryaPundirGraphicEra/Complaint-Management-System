import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../api/axiosInstance';
import { LogIn } from 'lucide-react';

export default function SignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ userName: '', password: '' });

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const res = await api.post('/users/signin', credentials); // 
      return res.data;
    },
    onSuccess: (data) => {
      // Store token and user details for the interceptor and UI logic [cite: 68, 69]
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('role', data.data.user.role); 
      localStorage.setItem('userId', data.data.user._id);
      toast.success('Welcome back!');
      navigate('/');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 p-3 rounded-full text-blue-600"><LogIn size={32} /></div>
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            required
            className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setFormData({...formData, userName: e.target.value})}
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="mt-4 text-center text-slate-500">
          Don't have an account? <Link to="/signup" className="text-blue-600 font-semibold">Sign up</Link>
        </p>
      </div>
    </div>
  );
}