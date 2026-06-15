import React from 'react';

const Terms = () => {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
        <h1 className="text-4xl font-display font-extrabold text-slate-900 mb-8">Terms of Service</h1>
        <div className="prose prose-slate max-w-none">
          <p className="text-slate-600 mb-4">Welcome to Hotel Lanka Pro. These terms of service outline the rules and regulations for the use of our website and services.</p>
          <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="text-slate-600 mb-4">By accessing this website we assume you accept these terms and conditions. Do not continue to use Hotel Lanka Pro if you do not agree to take all of the terms and conditions stated on this page.</p>
          <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">2. Booking Policies</h2>
          <p className="text-slate-600 mb-4">All bookings are subject to availability and confirmation. We reserve the right to refuse or cancel any booking for any reason.</p>
          <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">3. Cancellation and Refunds</h2>
          <p className="text-slate-600 mb-4">Please refer to our specific room cancellation policies at the time of booking. General refunds are processed within 7-14 business days.</p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
