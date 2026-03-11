import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../api/axiosInstance';
import SkeletonCard from '../components/SkeletonCard';
import { Trash2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MyComplaints() {
  const queryClient = useQueryClient();

  // Fetch logged-in user's complaints [cite: 42, 106]
  const { data: complaints, isLoading } = useQuery({
    queryKey: ['mycomplaints'],
    queryFn: async () => {
      const res = await api.get('/mycomplaints');
      return res.data.data;
    }
  });

  // Handle Deletion [cite: 42, 106]
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/delete/${id}`); 
    },
    onSuccess: () => {
      toast.success('Complaint deleted');
      queryClient.invalidateQueries(['mycomplaints']);
    },
    onError: () => toast.error('Failed to delete')
  });

  if (isLoading) return <div className="p-6 space-y-4"><SkeletonCard /><SkeletonCard /></div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-slate-800">My Filed Complaints</h1>
      
      {complaints?.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-xl border">
          <p className="text-slate-500">You haven't filed any complaints yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {complaints?.map(complaint => (
            <div key={complaint._id} className="bg-white p-5 rounded-xl shadow-sm border flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">{complaint.title}</h3>
                <p className="text-sm text-slate-500">Status: {complaint.status} | Dept: {complaint.department}</p>
              </div>
              <div className="flex gap-3">
                <Link to={`/complaint/${complaint._id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                  <ExternalLink size={20} />
                </Link>
                <button 
                  onClick={() => deleteMutation.mutate(complaint._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Delete Complaint"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}