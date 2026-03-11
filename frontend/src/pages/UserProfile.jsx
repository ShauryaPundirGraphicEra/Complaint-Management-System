import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axiosInstance';
import SkeletonCard from '../components/SkeletonCard';
import { User, MapPin, Phone, Mail, Shield, ExternalLink } from 'lucide-react';

export default function UserProfile() {
  const { id } = useParams();
  
  // If no ID is in the URL, we assume the user wants to see their own profile
  const targetId = id || localStorage.getItem('userId');
  const isMyProfile = targetId === localStorage.getItem('userId');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['userProfile', targetId],
    queryFn: async () => {
      const res = await api.get(`/users/profile/${targetId}`);
      return res.data.data;
    }
  });

  if (isLoading) return <div className="p-6"><SkeletonCard /></div>;
  if (isError) return <div className="p-6 text-center text-red-500 font-bold">Failed to load profile.</div>;

  const { user, complaints } = data;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      
      {/* Profile Header Card */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8 items-center md:items-start">
        <img 
          src={user.profilePhotoURL} 
          alt={user.fullName} 
          className="w-32 h-32 rounded-full object-cover border-4 border-blue-50 shadow-md"
        />
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <h1 className="text-3xl font-bold text-slate-800">{user.fullName}</h1>
            {user.role === 'Officer' && <Shield className="text-blue-600" size={24} />}
          </div>
          <p className="text-slate-500 font-medium mb-4">@{user.userName} • {user.role}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-600">
            <p className="flex items-center justify-center md:justify-start gap-2">
              <Mail size={16} className="text-slate-400" /> {user.email}
            </p>
            <p className="flex items-center justify-center md:justify-start gap-2">
              <Phone size={16} className="text-slate-400" /> {user.phoneNumber}
            </p>
            <p className="flex items-center justify-center md:justify-start gap-2 md:col-span-2">
              <MapPin size={16} className="text-slate-400" /> 
              {user.address.houseNo}, {user.address.laneNo}, {user.address.city}, {user.address.state} - {user.address.pin}
            </p>
          </div>
        </div>
      </div>

      {/* Complaint History Section */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          {isMyProfile ? 'My Complaint History' : `Complaints filed by ${user.fullName}`}
        </h2>
        
        {complaints.length === 0 ? (
          <div className="bg-white p-8 text-center rounded-xl border border-slate-200 text-slate-500">
            No complaints found for this user.
          </div>
        ) : (
          <div className="grid gap-4">
            {complaints.map(complaint => (
              <div key={complaint._id} className="bg-white p-5 rounded-xl shadow-sm border flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">{complaint.title}</h3>
                  <p className="text-sm text-slate-500">
                    Status: <span className="font-semibold">{complaint.status}</span> | Dept: {complaint.department}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Filed on: {new Date(complaint.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Link to={`/complaint/${complaint._id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                  <ExternalLink size={20} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}