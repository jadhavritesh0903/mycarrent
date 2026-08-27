import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      toast.success('Logged in successfully');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="mx-auto flex max-w-5xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid w-full overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-soft lg:grid-cols-2">
        <div className="hidden bg-slate-900 p-10 text-white lg:block">
          <p className="text-sm uppercase tracking-[0.2em] text-brand-300">Welcome back</p>
          <h1 className="mt-6 text-4xl font-black">Drive smarter.</h1>
          <p className="mt-4 text-slate-300">Rent premium cars for work, weddings, road trips, and city moments.</p>
        </div>
        <form onSubmit={handleSubmit} className="p-8 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Login</p>
          <h2 className="mt-3 text-3xl font-black text-slate-900">Access your account</h2>

          <div className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-brand-400" required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
              <input name="password" type="password" value={formData.password} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-brand-400" required />
            </div>
          </div>

          <button type="submit" className="mt-8 w-full rounded-full bg-brand-600 px-4 py-3 font-semibold text-white hover:bg-brand-700">
            Log In
          </button>
          <p className="mt-5 text-sm text-slate-600">
            New here? <Link to="/register" className="font-semibold text-brand-600">Create account</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
