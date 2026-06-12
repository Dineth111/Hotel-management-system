import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Phone, Mail, MessageCircle, Send, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatWhatsAppUrl } from '../utils/whatsapp';

const Contact = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [form, setForm] = useState({
    name: '', email: '', phone: '', subject: '', message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get('/settings');
        setSettings(res.data);
      } catch (err) {
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await axios.post('/contact', form);
      toast.success(res.data.message || 'Message dispatched successfully!');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      toast.error('Submission failed, please check fields.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 font-sans">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase font-bold tracking-widest text-primary-500">Get in touch</span>
        <h1 className="text-4xl font-display font-extrabold tracking-tight text-slate-900 leading-tight">Contact Our Resort</h1>
        <p className="text-slate-500 text-sm">Have an inquiry about events, custom packages, or bookings? Message us directly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-slate-800">Send Inquiry Message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Your Name</label>
                <input type="text" required placeholder="Enter name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Your Email</label>
                <input type="email" required placeholder="name@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Your Phone</label>
                <input type="text" required placeholder="e.g. +94 71 142 4377" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Subject</label>
                <input type="text" required placeholder="Message subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Message Body</label>
              <textarea required rows="5" placeholder="Write message here..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:outline-none"></textarea>
            </div>

            <button type="submit" disabled={submitting} className="bg-primary-500 hover:bg-primary-600 text-white font-bold px-8 py-3.5 rounded-xl shadow transition-smooth flex items-center justify-center space-x-2 text-sm">
              <Send className="h-4 w-4" />
              <span>{submitting ? 'Sending...' : 'Send Message'}</span>
            </button>
          </form>
        </div>

        {/* Contact info sidebar card */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-md space-y-6 border border-slate-800">
            <h2 className="text-lg font-bold">Contact Details</h2>

            <ul className="space-y-4 text-xs font-semibold">
              <li className="flex items-start space-x-3.5">
                <MapPin className="h-5 w-5 text-luxury-400 shrink-0 mt-0.5" />
                <span className="text-slate-300 leading-relaxed">{settings?.address || 'No 123, Galle Road, Kalagedihena, LK'}</span>
              </li>

              <li className="flex items-center space-x-3.5 border-t border-slate-800 pt-4">
                <Phone className="h-4.5 w-4.5 text-luxury-400 shrink-0" />
                <span className="text-slate-300">{settings?.phone || '+94 71 142 4377'}</span>
              </li>

              <li className="flex items-center space-x-3.5 border-t border-slate-800 pt-4">
                <Mail className="h-4.5 w-4.5 text-luxury-400 shrink-0" />
                <span className="text-slate-300">{settings?.email || 'dinethsanjula647@gmail.com'}</span>
              </li>
            </ul>

            {settings && settings.whatsapp && (
              <div className="border-t border-slate-800 pt-6">
                <a
                  href={formatWhatsAppUrl(settings.whatsapp, 'Hello, I have an inquiry regarding reservations.')}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 px-4 rounded-xl transition-smooth text-xs shadow-md shadow-emerald-500/10"
                >
                  <MessageCircle className="h-4.5 w-4.5 shrink-0" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            )}
          </div>

          <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-3 text-xs font-semibold text-slate-600">
            <ShieldCheck className="h-5 w-5 text-primary-500 shrink-0" />
            <span>Resort staff operates 24/7 for booking inquiries.</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
