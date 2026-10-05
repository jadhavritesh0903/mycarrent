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
      const message = error.response?.data?.message
        || (error.code === 'ERR_NETWORK' ? 'Cannot reach the login server. Please make sure the backend is running and try again.' : 'Login failed');
      toast.error(message);
    }
  };

  return (
    <div className="mx-auto flex max-w-5xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid w-full overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-soft lg:grid-cols-2">
        <div className="relative min-h-[210px] overflow-hidden bg-slate-900 p-7 pb-20 text-white sm:p-10 sm:pb-20 lg:min-h-[460px] lg:pb-10">
          <p className="text-sm uppercase tracking-[0.2em] text-brand-300">Welcome back</p>
          <h1 className="mt-4 text-3xl font-black sm:text-4xl">Drive smarter.</h1>
          <p className="mt-3 max-w-sm text-sm text-slate-300 sm:text-base">Rent premium cars for work, weddings, road trips, and city moments.</p>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 overflow-hidden" aria-hidden="true">
            <div className="relative h-full w-full">
              <div className="absolute inset-x-0 bottom-5 h-px bg-slate-600/80" />
              <div className="absolute inset-x-0 bottom-5 h-1 bg-[repeating-linear-gradient(90deg,transparent,transparent_18px,#64748b_18px,#64748b_34px)] opacity-70" />
              <div className="login-car-track absolute bottom-3 left-0 w-[132px] text-brand-300">
                <svg viewBox="0 0 132 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 34.5 18 23c1.1-2.6 3.6-4.2 6.5-4.2h13.2l12-12.3A8.5 8.5 0 0 1 55.8 4h28.4c4.2 0 8.1 2.1 10.4 5.5L105 23.5l12.3 3.1a10 10 0 0 1 7.6 9.7v6H9v-2.6a7 7 0 0 1 4-6.3Z" fill="currentColor" />
                  <path d="m42 18.8 10.6-10.9A4.5 4.5 0 0 1 55.8 6h10.7v12.8H42ZM70.5 6h13.7c2.9 0 5.6 1.5 7.2 3.9l6 8.9H70.5V6Z" fill="#0f172a" fillOpacity=".9" />
                  <path d="M16 29h7m97 5h4" stroke="#f8fafc" strokeWidth="2" strokeLinecap="round" />
                  <circle className="login-car-wheel" cx="35" cy="42" r="8" fill="#0f172a" stroke="#cbd5e1" strokeWidth="3" />
                  <circle className="login-car-wheel" cx="105" cy="42" r="8" fill="#0f172a" stroke="#cbd5e1" strokeWidth="3" />
                  <circle cx="35" cy="42" r="2" fill="#94a3b8" />
                  <circle cx="105" cy="42" r="2" fill="#94a3b8" />
                </svg>
              </div>
            </div>
          </div>
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
