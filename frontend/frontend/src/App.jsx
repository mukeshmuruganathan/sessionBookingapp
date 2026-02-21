import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Calendar, LayoutDashboard, Home } from 'lucide-react';
import BookingForm from './pages/BookingForm';
import AdminDashboard from './pages/AdminDashboard';

const Nav = () => {
  const { pathname } = useLocation();
  const isAdmin = pathname === '/admin';

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-2 rounded-lg text-white group-hover:rotate-6 transition-transform">
            <Calendar size={20} />
          </div>
          <span className="text-xl font-black text-slate-800 tracking-tighter uppercase italic">
            Book<span className="text-primary italic">It</span>
          </span>
        </Link>

        <Link
          to={isAdmin ? "/" : "/admin"}
          className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-700 font-bold transition-all text-sm border border-slate-200"
        >
          {isAdmin ? <><Home size={16} /> Client Hub</> : <><LayoutDashboard size={16} /> Admin Panel</>}
        </Link>
      </div>
    </nav>
  );
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50/50">
        <Toaster position="bottom-right" />
        <Nav />
        <main className="pb-20">
          <Routes>
            <Route path="/" element={<BookingForm />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
