import React from 'react';
import { Lock, Eye, Database, Share2, Cookie, Phone } from 'lucide-react';

const Section = ({ icon: Icon, title, children }) => (
  <div className="mb-10">
    <div className="flex items-center gap-3 mb-3">
      <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{background: '#eff6ff'}}>
        <Icon className="h-5 w-5" style={{color: '#2563eb'}} />
      </div>
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
    </div>
    <div className="pl-12 text-slate-600 leading-relaxed space-y-2">{children}</div>
  </div>
);

const Privacy = () => {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 font-sans">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-white p-10 rounded-3xl mb-6 shadow-xl" style={{background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%)'}}>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{background: 'rgba(255,255,255,0.15)'}}>
              <Lock className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest" style={{color: '#bfdbfe'}}>Legal</span>
          </div>
          <h1 className="text-4xl font-display font-extrabold mb-3 text-white">Privacy Policy</h1>
          <p style={{color: '#dbeafe'}}>Effective Date: January 1, 2026 &nbsp;·&nbsp; Hotel Lanka Pro, Galle Road, Kalagedihena, Sri Lanka</p>
        </div>

        {/* Content Card */}
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
          <p className="text-slate-600 mb-8 leading-relaxed">
            At <strong>Hotel Lanka Pro</strong>, your privacy is important to us. This Privacy Policy explains how we collect, use, and protect the personal information you provide when using our website and booking services.
          </p>

          <Section icon={Database} title="1. Information We Collect">
            <p>We collect the following types of personal information when you register, make a booking, or contact us:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Identity Data:</strong> Full name, email address, phone number.</li>
              <li><strong>Booking Data:</strong> Check-in/out dates, room type, number of guests, booking status.</li>
              <li><strong>Communication Data:</strong> Messages submitted through our Contact form.</li>
              <li><strong>Technical Data:</strong> Session information used to keep you logged in securely.</li>
            </ul>
          </Section>

          <Section icon={Eye} title="2. How We Use Your Information">
            <ul className="list-disc list-inside space-y-1">
              <li>To process and manage your room bookings.</li>
              <li>To send booking confirmations and updates via <strong>email</strong> and <strong>WhatsApp</strong>.</li>
              <li>To respond to your inquiries and contact form messages.</li>
              <li>To improve our website and customer experience.</li>
              <li>To comply with legal and regulatory obligations.</li>
            </ul>
          </Section>

          <Section icon={Share2} title="3. Sharing of Information">
            <p>We do <strong>not</strong> sell, trade, or share your personal information with third parties for marketing purposes. Your data is only shared in the following circumstances:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>When required by law or government authorities.</li>
              <li>With trusted service providers who assist us in operating our website (e.g., cloud database, email delivery), under strict confidentiality agreements.</li>
            </ul>
          </Section>

          <Section icon={Lock} title="4. Data Security">
            <p>We implement industry-standard security measures to protect your personal data, including:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Encrypted password storage using <strong>bcrypt</strong>.</li>
              <li>Secure session management with <strong>HTTP-only cookies</strong>.</li>
              <li>MongoDB Atlas cloud database with access controls.</li>
            </ul>
            <p className="mt-1">However, no transmission of data over the internet is 100% secure, and we cannot guarantee absolute security.</p>
          </Section>

          <Section icon={Cookie} title="5. Cookies & Sessions">
            <p>Our website uses <strong>session cookies</strong> to keep you logged in during your visit. These cookies are temporary and expire after 24 hours or when you log out. We do not use advertising or tracking cookies.</p>
          </Section>

          <Section icon={Phone} title="6. Contact & Data Requests">
            <p>You have the right to access, correct, or request deletion of your personal data at any time. Please contact us:</p>
            <ul className="list-disc list-inside">
              <li>📍 No 123, Galle Road, Kalagedihena, Sri Lanka</li>
              <li>📞 +94 71 142 4377</li>
              <li>✉️ dinethsanjula647@gmail.com</li>
            </ul>
          </Section>
        </div>

        <p className="text-center text-slate-400 text-sm mt-6">© {new Date().getFullYear()} Hotel Lanka Pro. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Privacy;
