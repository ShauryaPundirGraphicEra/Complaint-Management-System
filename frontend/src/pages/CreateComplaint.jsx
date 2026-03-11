import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../api/axiosInstance';
import { UploadCloud } from 'lucide-react';

export default function CreateComplaint() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);

  const createMutation = useMutation({
    mutationFn: async (formData) => {
      return await api.post('/complaint', formData, { // 
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    onSuccess: () => {
      toast.success('Complaint submitted successfully! AI is assigning an officer.'); // [cite: 34]
      navigate('/');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to submit complaint');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData();
    
    // Core fields 
    data.append('title', form.title.value);
    data.append('description', form.description.value);
    data.append('category', form.category.value);
    data.append('department', form.department.value);
    
    // Backend expects a nested location object [cite: 29, 30]
    // Note: Depending on exactly how your backend parses Multer body fields before Zod, 
    // you might need to structure these as location[area] or stringify them.
    data.append('location[area]', form.area.value);
    data.append('location[city]', form.city.value);
    data.append('location[state]', form.state.value);
    data.append('location[pincode]', form.pincode.value);

    // Append up to 5 images 
    files.forEach(file => data.append('images', file));

    createMutation.mutate(data);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-slate-800">Lodge a Complaint</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input name="title" required placeholder="Complaint Title (min 5 chars)" className="p-3 rounded-lg border w-full" />
          <select name="category" required className="p-3 rounded-lg border w-full">
            <option value="">Select Category</option>
            {/*  */}
            {['Road', 'Water', 'Electricity', 'Garbage', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <textarea name="description" required placeholder="Detailed description..." className="p-3 rounded-lg border w-full h-32" />
        <input name="department" required placeholder="Relevant Department (e.g., PWD)" className="p-3 rounded-lg border w-full" />

        <h3 className="font-semibold border-b pb-2">Location Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <input name="area" required placeholder="Area / Locality" className="p-3 rounded-lg border w-full" />
          <input name="city" required placeholder="City" className="p-3 rounded-lg border w-full" />
          <input name="state" required placeholder="State" className="p-3 rounded-lg border w-full" />
          <input name="pincode" required placeholder="Pincode (6 digits)" maxLength={6} className="p-3 rounded-lg border w-full" />
        </div>

        <div className="border-2 border-dashed border-slate-300 p-6 rounded-xl text-center">
          <UploadCloud className="mx-auto text-slate-400 mb-2" size={32} />
          <p className="text-sm text-slate-500 mb-2">Upload supporting images (Max 5)</p>
          <input 
            type="file" 
            multiple 
            accept="image/*"
            onChange={(e) => setFiles(Array.from(e.target.files).slice(0, 5))}
            className="text-sm"
          />
        </div>

        <button 
          type="submit" 
          disabled={createMutation.isPending}
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition"
        >
          {createMutation.isPending ? 'Submitting & Routing...' : 'Submit Complaint'}
        </button>
      </form>
    </div>
  );
}