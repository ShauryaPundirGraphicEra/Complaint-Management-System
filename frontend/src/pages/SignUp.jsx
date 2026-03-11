import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../api/axiosInstance';
import { UserPlus, UploadCloud } from 'lucide-react';

export default function SignUp() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    username: '', fullName: '', email: '', password: '', 
    gender: 'PreferNotToSay', phoneNumber: '', role: 'Citizen',
    houseNo: '', laneNo: '', city: '', state: '', pin: '', country: '',
    designation: '', departMent: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const signupMutation = useMutation({
    mutationFn: async (submitData) => {
      // We must set Content-Type to multipart/form-data for multer to intercept the file 
      return await api.post('/users/signup', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    onSuccess: () => {
      toast.success('Account created successfully! Please sign in.');
      navigate('/signin');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Registration failed. Check your inputs.');
      console.error(err.response?.data?.errors);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    
    // Core user fields
    data.append('username', formData.username);
    data.append('fullName', formData.fullName);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('gender', formData.gender);
    data.append('phoneNumber', formData.phoneNumber);
    data.append('role', formData.role);

    // Nested address fields mapped for Express/Multer parsing 
    data.append('address[houseNo]', formData.houseNo);
    data.append('address[laneNo]', formData.laneNo);
    data.append('address[city]', formData.city);
    data.append('address[state]', formData.state);
    data.append('address[pin]', formData.pin);
    data.append('address[country]', formData.country);

    // Conditional fields for Officers 
    if (formData.role === 'Officer') {
      data.append('designation', formData.designation);
      data.append('departMent', formData.departMent); // Using capital M as per your backend schema
    }

    // Profile photo (Your backend route explicitly expects "image" as the field name) 
    if (image) {
      data.append('image', image);
    }

    signupMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
        
        <div className="text-center mb-8">
          <div className="inline-flex bg-blue-100 p-3 rounded-full text-blue-600 mb-4">
            <UserPlus size={32} />
          </div>
          <h2 className="text-3xl font-bold text-slate-800">Create an Account</h2>
          <p className="text-slate-500 mt-2">Join GovResolve to report and track issues in your community.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Personal Info Section */}
          <section>
            <h3 className="text-lg font-semibold border-b pb-2 mb-4 text-slate-700">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="fullName" placeholder="Full Name" required onChange={handleChange} className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-500" />
              <input name="username" placeholder="Username" required onChange={handleChange} className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-500" />
              <input name="email" type="email" placeholder="Email Address" required onChange={handleChange} className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-500" />
              <input name="phoneNumber" placeholder="Phone Number (10 digits)" maxLength="10" required onChange={handleChange} className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-500" />
              <input name="password" type="password" placeholder="Password (Min 6 chars)" minLength="6" required onChange={handleChange} className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-500" />
              <select name="gender" onChange={handleChange} className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-500">
                <option value="PreferNotToSay">Prefer Not to Say</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </section>

          {/* Address Section */}
          <section>
            <h3 className="text-lg font-semibold border-b pb-2 mb-4 text-slate-700">Address Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input name="houseNo" placeholder="House No." required onChange={handleChange} className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-500" />
              <input name="laneNo" placeholder="Lane No." required onChange={handleChange} className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-500" />
              <input name="city" placeholder="City" required onChange={handleChange} className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-500" />
              <input name="state" placeholder="State" required onChange={handleChange} className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-500" />
              <input name="pin" placeholder="Pincode (6 digits)" maxLength="6" required onChange={handleChange} className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-500" />
              <input name="country" placeholder="Country" required onChange={handleChange} className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-500" />
            </div>
          </section>

          {/* Role Section */}
          <section>
            <h3 className="text-lg font-semibold border-b pb-2 mb-4 text-slate-700">Account Type</h3>
            <select name="role" onChange={handleChange} value={formData.role} className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 mb-4">
              <option value="Citizen">Citizen</option>
              <option value="Officer">Government Officer</option>
            </select>

            {/* Conditionally render Officer fields */}
            {formData.role === 'Officer' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4">
                <input name="designation" placeholder="Designation (e.g. Inspector)" required onChange={handleChange} className="p-3 rounded-lg border bg-blue-50 focus:ring-2 focus:ring-blue-500" />
                <input name="departMent" placeholder="Department (e.g. PWD)" required onChange={handleChange} className="p-3 rounded-lg border bg-blue-50 focus:ring-2 focus:ring-blue-500" />
              </div>
            )}
          </section>

          {/* Profile Photo Upload */}
          <section>
            <h3 className="text-lg font-semibold border-b pb-2 mb-4 text-slate-700">Profile Photo</h3>
            <div className="border-2 border-dashed border-slate-300 p-6 rounded-xl text-center hover:bg-slate-50 transition cursor-pointer relative">
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <UploadCloud className="mx-auto text-slate-400 mb-2" size={32} />
              <p className="text-sm font-medium text-slate-700">
                {image ? image.name : "Click or drag to upload a profile picture"}
              </p>
              <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB</p>
            </div>
          </section>

          <button 
            type="submit" 
            disabled={signupMutation.isPending}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition shadow-md"
          >
            {signupMutation.isPending ? 'Creating Account & Uploading...' : 'Complete Registration'}
          </button>
          
        </form>

        <p className="mt-6 text-center text-slate-600 font-medium">
          Already have an account? <Link to="/signin" className="text-blue-600 hover:underline">Sign In here</Link>
        </p>

      </div>
    </div>
  );
}