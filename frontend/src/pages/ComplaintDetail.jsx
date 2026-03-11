import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axiosInstance';
import SkeletonCard from '../components/SkeletonCard';
import { ShieldCheck, User, MapPin } from 'lucide-react';

export default function ComplaintDetail() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  
  // Assuming you save the logged-in user's role in localStorage on signin
  const userRole = localStorage.getItem('role') || 'Citizen'; 

  const { data: complaint, isLoading } = useQuery({
    queryKey: ['complaint', id],
    queryFn: async () => {
      const res = await api.get(`/complaint/${id}`);
      return res.data.data;
    }
  });

  // Mutation for Officer Review
  const reviewMutation = useMutation({
    mutationFn: async (reviewData) => {
      return await api.post(`/review/${id}`, reviewData);
    },
    onSuccess: () => {
      toast.success('Review submitted successfully!');
      // This tells React Query to refetch the data so the UI updates instantly
      queryClient.invalidateQueries(['complaint', id]); 
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  });

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    reviewMutation.mutate({
      status: formData.get('status'),
      comment: formData.get('comment')
    });
    e.target.reset(); // Clear the form after submission
  };

  if (isLoading) return <div className="max-w-3xl mx-auto p-6"><SkeletonCard /></div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      
      {/* Main White Panel */}
      <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-lg">
        
        <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">{complaint.title}</h1>
            <p className="text-slate-500 flex items-center gap-1 font-medium">
              <MapPin size={16} className="text-blue-500"/> {complaint.location?.area}, {complaint.location?.city}
            </p>
          </div>
          <span className={`px-4 py-2 text-sm font-bold rounded-full border ${
            complaint.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
            complaint.status === 'Resolved' ? 'bg-green-50 text-green-700 border-green-200' :
            complaint.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
            'bg-blue-50 text-blue-700 border-blue-200'
          }`}>
            {complaint.status}
          </span>
        </div>
        
        <p className="text-slate-600 mb-8 leading-relaxed text-lg">{complaint.description}</p>

        {/* Image Gallery */}
        {complaint.images?.length > 0 && (
          <div className="flex gap-4 mb-8 overflow-x-auto pb-4 custom-scrollbar">
            {complaint.images.map((img, idx) => (
               <img key={idx} src={img} alt="Complaint" className="h-40 w-40 object-cover rounded-2xl border border-slate-200 shadow-sm hover:scale-105 transition-transform" />
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* Submitter Info Card (Restored the explicit "View Complainter" text) */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex items-center gap-4 hover:bg-slate-100 transition justify-between">
                <div className="flex items-center gap-4">
                  <img src={complaint.userId?.profilePhotoURL || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} alt="Citizen" className="w-12 h-12 rounded-full object-cover border border-slate-300" />
                  <div>
                      {console.log(complaint)}
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Filed By</p>
                      <p className="font-bold text-slate-800">@{complaint.userId?.fullName || complaint.userId?._id}</p>
                  </div>
                </div>
                
                <Link 
                  to={`/profile/${complaint.userId?._id}`} 
                  className="text-sm font-semibold text-blue-600 bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded-lg transition flex items-center gap-2"
                >
                    <User size={16} /> View Complainter
                </Link>
            </div>

            {/* Assigned Officer Card (New Feature) */}
            {complaint.assignedOfficer ? (
                <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 flex items-center gap-4">
                    <img src={complaint.assignedOfficer.profilePhotoURL || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} alt="Officer" className="w-12 h-12 rounded-full object-cover border-2 border-blue-300" />
                    <div className="flex-1">
                        <p className="text-xs text-blue-600 font-bold uppercase tracking-wider flex items-center gap-1">
                            <ShieldCheck size={14} /> Official Assignee
                        </p>
                        <p className="font-bold text-slate-800">{complaint.assignedOfficer.fullName}</p>
                        <p className="text-xs text-slate-500 truncate">{complaint.assignedOfficer.designation} • {complaint.assignedOfficer.departMent}</p>
                    </div>
                </div>
            ) : (
                <div className="bg-yellow-50 p-5 rounded-2xl border border-yellow-200 flex flex-col justify-center items-center text-center">
                   <p className="text-yellow-700 font-bold text-sm mb-1">Pending AI Assignment</p>
                   <p className="text-xs text-yellow-600/80">System is locating the best officer.</p>
                </div>
            )}
        </div>

        {/* Official Review History Timeline */}
        {complaint.reviews?.length > 0 && (
          <div className="mt-8 border-t border-slate-200 pt-8">
            <h3 className="text-xl font-bold mb-6 text-slate-800">Official Review History</h3>
            <div className="space-y-4 border-l-2 border-blue-100 ml-3 pl-6 relative">
              {complaint.reviews.map((review, idx) => (
                <div key={idx} className="relative">
                  {/* Timeline dot */}
                  <span className="absolute -left-[33px] top-2 h-4 w-4 rounded-full bg-blue-500 border-4 border-white"></span>
                  
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                        review.status === 'Resolved' ? 'bg-green-100 text-green-700 border-green-200' :
                        review.status === 'Rejected' ? 'bg-red-100 text-red-700 border-red-200' :
                        'bg-blue-100 text-blue-700 border-blue-200'
                      }`}>
                        Marked as: {review.status}
                      </span>
                      <span className="text-sm font-medium text-slate-500">
                        {new Date(review.createdAt).toLocaleDateString()} at {new Date(review.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      <span className="font-semibold text-slate-900">Officer Remarks: </span> 
                      {review.comment}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Officer Review Form (Only visible to Officers) */}
        {userRole === 'Officer' && complaint.status !== 'Resolved' && (
          <form onSubmit={handleReviewSubmit} className="mt-8 bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h3 className="text-lg font-bold mb-4">Officer Action Panel</h3>
            <select name="status" className="w-full p-3 rounded-lg border mb-4 focus:ring-2 focus:ring-blue-500">
              <option value="In-Progress">Mark as In-Progress</option>
              <option value="Resolved">Mark as Resolved</option>
              <option value="Rejected">Reject</option>
            </select>
            <textarea 
              name="comment" 
              required
              placeholder="Add official remarks..." 
              className="w-full p-3 rounded-lg border mb-4 h-24 focus:ring-2 focus:ring-blue-500"
            />
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition"
              disabled={reviewMutation.isPending}
            >
              {reviewMutation.isPending ? 'Submitting...' : 'Update Status'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}