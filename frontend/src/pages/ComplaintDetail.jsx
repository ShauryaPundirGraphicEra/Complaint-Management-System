import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams,Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axiosInstance';
import SkeletonCard from '../components/SkeletonCard';

export default function ComplaintDetail() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  
  // Assuming you save the logged-in user's role in localStorage on signin
  const userRole = localStorage.getItem('role') || 'Citizen'; 

  const { data: complaint, isLoading } = useQuery({
    queryKey: ['complaint', id],
    queryFn: async () => {
      const res = await api.get(`/complaint/${id}`); // [cite: 106]
      return res.data.data;
    }
  });

  // Mutation for Officer Review [cite: 43]
  const reviewMutation = useMutation({
    mutationFn: async (reviewData) => {
      return await api.post(`/review/${id}`, reviewData); // [cite: 106]
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
  };

  if (isLoading) return <div className="p-6"><SkeletonCard /></div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{complaint.title}</h1>
          <span className="bg-slate-100 text-slate-800 px-4 py-2 rounded-lg font-medium">
            {complaint.status}
          </span>
        </div>
        
        <p className="text-slate-600 mb-6 leading-relaxed">{complaint.description}</p>

        {/* Image Gallery */}
        {complaint.images?.length > 0 && (
          <div className="flex gap-4 mb-6 overflow-x-auto">
            {complaint.images.map((img, idx) => (
               <img key={idx} src={img} alt="Complaint" className="h-32 w-32 object-cover rounded-xl border" />
            ))}
          </div>
        )}

        {/* Submitter Info Card */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 flex items-center justify-between">
        <div>
            <p className="text-sm text-slate-500">Filed by Citizen</p>
            <p className="font-bold text-slate-800">@{complaint.userId._id}</p>
        </div>
         { console.log(complaint)}
        <Link 
           
            to={`/profile/${complaint.userId?._id}`} 
            className="text-sm font-semibold text-blue-600 bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded-lg transition"
        >
            View Complainter
        </Link>
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