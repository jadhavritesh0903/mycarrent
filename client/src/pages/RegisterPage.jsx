import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      toast.success('Account created successfully');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="mx-auto flex max-w-5xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid w-full overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-soft lg:grid-cols-2">
        <div className="hidden bg-brand-600 p-10 text-white lg:block">
          <p className="text-sm uppercase tracking-[0.2em] text-brand-100">Start renting</p>
          <h1 className="mt-6 text-4xl font-black">Create your rental account</h1>
          <p className="mt-4 text-brand-50">Book faster, save favorites, and manage your trip from one place.</p>
        </div>
        <form onSubmit={handleSubmit} className="p-8 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Register</p>
          <h2 className="mt-3 text-3xl font-black text-slate-900">Join Car Rental</h2>

          <div className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Full Name</label>
              <input name="name" value={formData.name} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-brand-400" required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-brand-400" required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Phone Number</label>
              <input name="phone" type="tel" value={formData.phone} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-brand-400" placeholder="+91 98765 43210" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
              <input name="password" type="password" value={formData.password} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-brand-400" required />
            </div>
          </div>

          <button type="submit" className="mt-8 w-full rounded-full bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-700">
            Create Account
          </button>
          <p className="mt-5 text-sm text-slate-600">
            Already a member? <Link to="/login" className="font-semibold text-brand-600">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
