import {  useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axiosInstance';
import SkeletonCard from '../components/SkeletonCard';
import { MapPin, ThumbsUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const queryClient = useQueryClient();
  const userId = localStorage.getItem('userId');
  const role = localStorage.getItem('role');
  
  // Ref to track previous data for our notification logic
  const prevComplaintsRef = useRef();

  // 1. Fetching & Polling
  const { data: complaints, isLoading } = useQuery({
    queryKey: ['complaints'],
    queryFn: async () => {
      const res = await api.get('/complaints'); // Fetches the latest data 
      return res.data.data;
    },
    refetchInterval: 10000, // Background polling every 10 seconds for "notifications"
  });

  // 2. Notification Logic (Runs whenever complaints data updates)
  useEffect(() => {
    if (complaints && prevComplaintsRef.current) {
      const prev = prevComplaintsRef.current;
      
      complaints.forEach(currentComp => {
        const oldComp = prev.find(c => c._id === currentComp._id);
        
        // Notification for Citizen: Status Changed
        if (oldComp && oldComp.status !== currentComp.status && currentComp.userId?._id === userId) {
          toast.success(`Update! Your complaint "${currentComp.title}" is now ${currentComp.status}`);
        }
        
        // Notification for Officer: New Assignment
        if (!oldComp && currentComp.assignedOfficer === userId) {
          toast.success(`New Assignment! You have been assigned to: "${currentComp.title}"`);
        }
      });
    }
    prevComplaintsRef.current = complaints;
  }, [complaints, userId]);

  // 3. The Support / Like Mutation
  const supportMutation = useMutation({
    mutationFn: async (complaintId) => {
      return await api.post(`/support/${complaintId}`); // Hits your support backend route 
    },
    onSuccess: () => {
      // Instantly refresh the data so the like count updates
      queryClient.invalidateQueries(['complaints']);
    },
    onError: () => toast.error('Failed to register support vote')
  });

  const handleSupport = (e, complaintId) => {
    e.preventDefault(); // Prevents the card's <Link> from navigating to the detail page
    e.stopPropagation();
    supportMutation.mutate(complaintId);
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-6 bg-slate-50 min-h-screen">
        <SkeletonCard /><SkeletonCard /><SkeletonCard />
      </div>
    );
  }

  // 4. Officer Filtering Logic
  // If Officer, only show their assignments. If Citizen/Admin, show all.
  const displayedComplaints = role === 'Officer' 
    ? complaints?.filter(c => c.assignedOfficer === userId) 
    : complaints;

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-2xl mx-auto mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            {role === 'Officer' ? 'My Assigned Cases' : 'Community Complaints'}
          </h1>
          <p className="text-slate-500 mt-1">
            {role === 'Officer' ? 'Manage your assigned infrastructure issues.' : 'See what needs fixing in your area.'}
          </p>
        </div>
      </div>

      <div className="space-y-4 max-w-2xl mx-auto">
        {displayedComplaints?.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-xl border border-slate-200">
            <p className="text-slate-500">No complaints found.</p>
          </div>
        ) : (
          displayedComplaints?.map((complaint) => {
            // Check if the current user has already liked this complaint 
            const hasSupported = complaint.supportVotes.includes(userId);

            return (
              <Link to={`/complaint/${complaint._id}`} key={complaint._id} className="block">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all mb-4 cursor-pointer relative group">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {complaint.title}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                        <MapPin size={16} /> {complaint.location.area}, {complaint.location.city}
                      </p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                      complaint.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                      complaint.status === 'Resolved' ? 'bg-green-50 text-green-700 border-green-200' :
                      complaint.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                      'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {complaint.status}
                    </span>
                  </div>
                  
                  <div className="mt-5 flex items-center justify-between border-t pt-4">
                    <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                      {complaint.department}
                    </span>

                    {/* Support / Like Button */}
                    <button 
                      onClick={(e) => handleSupport(e, complaint._id)}
                      disabled={role === 'Officer'} // Officers probably shouldn't upvote their own cases
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors font-medium text-sm ${
                        hasSupported 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      } ${role === 'Officer' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <ThumbsUp size={18} className={hasSupported ? 'fill-blue-600' : ''} /> 
                      {complaint.supportVotes.length} {hasSupported ? 'Supported' : 'Support'}
                    </button>
                  </div>
                </div>
              </Link>
            )
          })
        )}
      </div>
    </div>
  );
}