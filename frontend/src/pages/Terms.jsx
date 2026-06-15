import React from 'react';
import { FileText, ShieldCheck, CreditCard, XCircle, UserCheck, AlertTriangle, Phone } from 'lucide-react';

const Section = ({ icon: Icon, title, children }) => (
  <div className="mb-10">
    <div className="flex items-center gap-3 mb-3">
      <div className="h-9 w-9 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5 text-primary-500" />
      </div>
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
    </div>
    <div className="pl-12 text-slate-600 leading-relaxed space-y-2">{children}</div>
  </div>
);

const Terms = () => {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 font-sans">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white p-10 rounded-3xl mb-6 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-8 w-8 text-primary-400" />
            <span className="text-sm font-bold uppercase tracking-widest text-primary-400">Legal</span>
          </div>
          <h1 className="text-4xl font-display font-extrabold mb-3">Terms of Service</h1>
          <p className="text-slate-300">Effective Date: January 1, 2026 &nbsp;·&nbsp; Hotel Lanka Pro, Galle Road, Kalagedihena, Sri Lanka</p>
        </div>

        {/* Content Card */}
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
          <p className="text-slate-600 mb-8 leading-relaxed">
            Welcome to <strong>Hotel Lanka Pro</strong>. By accessing or using our website and services, you agree to be bound by the following terms and conditions. Please read them carefully before making a reservation.
          </p>

          <Section icon={UserCheck} title="1. Acceptance of Terms">
            <p>By using our website or making a booking, you confirm that you are at least 18 years of age and legally capable of entering into a binding agreement. If you do not agree with any part of these terms, please do not use our services.</p>
          </Section>

          <Section icon={CreditCard} title="2. Reservations & Payments">
            <p>All bookings are subject to room availability and confirmation by Hotel Lanka Pro. A booking is only confirmed once you receive an official confirmation notification via email or WhatsApp.</p>
            <p>The hotel reserves the right to refuse or cancel any booking at its discretion, in which case a full refund will be issued if payment was made.</p>
          </Section>

          <Section icon={XCircle} title="3. Cancellation & Refund Policy">
            <ul className="list-disc list-inside space-y-1">
              <li>Cancellations made <strong>more than 7 days</strong> before check-in: Full refund.</li>
              <li>Cancellations made <strong>3–7 days</strong> before check-in: 50% refund.</li>
              <li>Cancellations made <strong>less than 3 days</strong> before check-in: No refund.</li>
              <li>No-shows are treated as same-day cancellations and are non-refundable.</li>
            </ul>
            <p className="mt-2">Refunds are processed within <strong>7–14 business days</strong> to the original payment method.</p>
          </Section>

          <Section icon={ShieldCheck} title="4. Guest Responsibilities">
            <p>Guests are responsible for any damage caused to hotel property during their stay. Hotel Lanka Pro reserves the right to charge the guest for any such damage. Guests must comply with all hotel rules and regulations, including quiet hours and no-smoking policies.</p>
          </Section>

          <Section icon={AlertTriangle} title="5. Limitation of Liability">
            <p>Hotel Lanka Pro shall not be liable for any loss, theft, or damage of personal belongings during your stay. We are not responsible for any indirect or consequential loss arising from the use of our services or facilities.</p>
          </Section>

          <Section icon={Phone} title="6. Contact Us">
            <p>For any questions regarding these Terms of Service, please contact us:</p>
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

export default Terms;
