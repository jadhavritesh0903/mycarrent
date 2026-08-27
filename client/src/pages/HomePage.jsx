import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const HomePage = () => {
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const { data } = await api.get('/cars');
        setCars(data.slice(0, 6));
      } catch (error) {
        toast.error('Failed to load featured cars');
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleContactSubmit = (event) => {
    event.preventDefault();

    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error('Please fill in all contact fields');
      return;
    }

    toast.success('Your message has been sent. We will contact you soon.');
    setContactForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="bg-slate-50">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-brand-800 text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center">
            <span className="mb-4 inline-flex w-fit rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-100">
              Premium rental experience
            </span>
            <h1 className="max-w-xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Drive your next adventure with comfort.
            </h1>
            <p className="mt-6 max-w-lg text-base text-slate-200 sm:text-lg">
              Discover premium cars for every trip—city drives, weekend escapes, and family journeys with transparent pricing.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link to="/cars" className="rounded-full bg-brand-500 px-6 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-400">
                Explore Cars
              </Link>
              <Link to="/register" className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10">
                Become a Member
              </Link>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-3xl font-black">350+</p>
                <p className="text-sm text-slate-300">Trips booked</p>
              </div>
              <div>
                <p className="text-3xl font-black">4.8/5</p>
                <p className="text-sm text-slate-300">Customer ratings</p>
              </div>
              <div>
                <p className="text-3xl font-black">24/7</p>
                <p className="text-sm text-slate-300">Support</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-8 top-10 h-32 w-32 rounded-full bg-brand-500/30 blur-3xl" />
            <div className="absolute right-8 bottom-10 h-40 w-40 rounded-full bg-sky-400/25 blur-3xl" />
            <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-sm">
              <img
                src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=900&q=80"
                alt="Luxury car"
                className="h-[480px] w-full rounded-[24px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-soft sm:p-6">
          <div className="grid gap-4 md:grid-cols-[1.3fr_1fr_1fr_auto]">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by brand, model, or location"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none ring-0 transition focus:border-brand-400"
            />
            <select className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-400">
              <option>All Fuel Types</option>
              <option>Petrol</option>
              <option>Diesel</option>
              <option>Electric</option>
            </select>
            <select className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-400">
              <option>Any Transmission</option>
              <option>Automatic</option>
              <option>Manual</option>
            </select>
            <Link to={`/cars?search=${encodeURIComponent(search)}`} className="rounded-2xl bg-slate-900 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-700">
              Search
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Featured vehicles</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Popular cars this week</h2>
          </div>
          <Link to="/cars" className="text-sm font-semibold text-brand-600 hover:text-brand-700">View all →</Link>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-80 animate-pulse rounded-3xl bg-slate-200" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {cars.map((car) => (
              <div key={car._id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-xl">
                <img
                  src={car.image || 'https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=1200&q=80'}
                  alt={`${car.brand} ${car.model}`}
                  className="h-56 w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.src = 'https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=1200&q=80';
                  }}
                />
                <div className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">{car.brand}</p>
                      <h3 className="text-xl font-bold text-slate-900">{car.model}</h3>
                    </div>
                    <span className="rounded-full bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-700">{car.available ? 'Available' : 'Booked'}</span>
                  </div>
                  <div className="mb-4 grid grid-cols-2 gap-2 text-sm text-slate-600">
                    <span>⚙ {car.transmission}</span>
                    <span>⛽ {car.fuelType}</span>
                    <span>👥 {(car.seats || car.seating || 5)} Seats</span>
                    <span>📍 {car.location}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                    <p className="text-2xl font-bold text-slate-900">₹{car.pricePerDay ?? 0}<span className="text-sm font-medium text-slate-500">/day</span></p>
                    <Link to={`/cars/${car._id}`} className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: 'Easy booking', text: 'Quick and transparent reservations in a few clicks.' },
            { title: 'Flexible pricing', text: 'Daily booking rates with no hidden charges.' },
            { title: 'Trusted support', text: 'Friendly team to help at every step of your trip.' },
          ].map((item) => (
            <div key={item.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-xl text-brand-700">✓</div>
              <h3 className="mb-2 text-xl font-bold text-slate-900">{item.title}</h3>
              <p className="text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft md:p-8">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Contact us</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Let’s plan your next ride</h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="space-y-5 rounded-3xl bg-slate-900 p-6 text-white">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-brand-200">Reach us</p>
                <h3 className="mt-2 text-2xl font-bold">Customer support</h3>
              </div>

              <div className="space-y-4 text-sm text-slate-200">
                <div>
                  <p className="font-semibold text-white">Call</p>
                  <p>+91 98765 43210</p>
                </div>
                <div>
                  <p className="font-semibold text-white">Email</p>
                  <p>support@carrental.com</p>
                </div>
                <div>
                  <p className="font-semibold text-white">Office</p>
                  <p>12 Market Road, Mumbai, India</p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                Open daily: 9:00 AM – 9:00 PM
              </div>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Your name</label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(event) => setContactForm((prev) => ({ ...prev, name: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-400"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Email address</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(event) => setContactForm((prev) => ({ ...prev, email: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-400"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Message</label>
                <textarea
                  rows="5"
                  value={contactForm.message}
                  onChange={(event) => setContactForm((prev) => ({ ...prev, message: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-400"
                  placeholder="Tell us about your rental requirement..."
                />
              </div>

              <button
                type="submit"
                className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Testimonials</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">What our customers say</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { name: 'Sarah M.', text: 'Amazing service and the car was spotless. Booking was super simple.' },
            { name: 'David R.', text: 'Perfect for our trip. The pricing was fair and customer care was excellent.' },
            { name: 'Emma K.', text: 'I booked online in minutes and the pickup process was smooth and fast.' },
          ].map((review) => (
            <div key={review.name} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
              <div className="mb-3 text-brand-500">★★★★★</div>
              <p className="mb-5 text-slate-600">“{review.text}”</p>
              <p className="font-bold text-slate-900">{review.name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
