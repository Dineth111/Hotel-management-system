import React, { useState } from 'react';
import { ChevronDown, HelpCircle, PhoneCall, Mail, MapPin } from 'lucide-react';

const FAQ_DATA = [
  {
    question: "What are the standard Check-In and Check-Out times?",
    answer: "Our standard check-in time is from 2:00 PM onwards, and check-out is before 12:00 PM. Early check-in or late check-out can be requested, subject to room availability, and may incur additional charges."
  },
  {
    question: "Is airport transportation available?",
    answer: "Yes, we provide premium airport transfers. You can easily add this service to your reservation during the booking checkout process on our website or by contacting our front desk."
  },
  {
    question: "What is your cancellation policy?",
    answer: "Cancellations made up to 48 hours prior to check-in are fully refundable. Cancellations made within 48 hours of arrival will be charged the first night's room rate plus tax."
  },
  {
    question: "Are meals included in the room price?",
    answer: "We offer room-only rates as well as rates with pre-purchased meal plans (e.g. Half-Board, Full-Board). You can select your preferred dining add-on on the booking checkout panel."
  },
  {
    question: "Do you offer promo codes or loyalty discounts?",
    answer: "Yes, we periodically run special promotions. If you have an active promo code, enter it in the checkout sidebar when booking your room to receive an instant discount on your total stay."
  },
  {
    question: "Is high-speed Wi-Fi available at the resort?",
    answer: "Complimentary ultra-high-speed fiber Wi-Fi is available in all guest rooms, suites, and public areas of the resort, ensuring you stay seamlessly connected throughout your visit."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 font-sans">
      <div className="text-center space-y-3">
        <span className="text-xs uppercase font-bold tracking-widest text-primary-500">Concierge Desk</span>
        <h1 className="text-4xl font-display font-extrabold text-slate-900 tracking-tight leading-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-slate-500 text-sm max-w-lg mx-auto">
          Find answers to common inquiries about booking, services, dining options, and guest policies at Hotel Lanka.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
        {/* Accordions */}
        <div className="md:col-span-2 space-y-4">
          {FAQ_DATA.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex justify-between items-center p-5 text-left font-bold text-slate-800 hover:text-slate-950 transition-colors cursor-pointer"
                >
                  <span className="text-sm">{faq.question}</span>
                  <ChevronDown 
                    className={`h-4.5 w-4.5 text-slate-400 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-luxury-500' : ''
                    }`} 
                  />
                </button>
                <div 
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-40 border-t border-slate-50 opacity-100 p-5' : 'max-h-0 opacity-0 pointer-events-none'
                  }`}
                >
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar support card */}
        <div className="bg-gradient-to-br from-primary-950 to-primary-900 text-white p-6 rounded-3xl shadow-lg h-fit space-y-6 relative overflow-hidden">
          <div className="absolute -bottom-8 -right-8 h-24 w-24 bg-primary-800/30 rounded-full blur-xl pointer-events-none" />
          
          <div className="space-y-2">
            <h3 className="text-lg font-display font-bold">Still have questions?</h3>
            <p className="text-primary-200/80 text-[11px] leading-relaxed">
              Our professional hospitality desk is available 24/7 to assist you with customized requests.
            </p>
          </div>

          <div className="space-y-4 pt-2 text-xs font-semibold">
            <a href="tel:0711424377" className="flex items-center gap-3 hover:text-luxury-200 transition-colors">
              <PhoneCall className="h-4 w-4 text-luxury-400 shrink-0" />
              <span>0711424377</span>
            </a>
            <a href="mailto:dinethsanjula647@gmail.com" className="flex items-center gap-3 hover:text-luxury-200 transition-colors">
              <Mail className="h-4 w-4 text-luxury-400 shrink-0" />
              <span className="break-all">dinethsanjula647@gmail.com</span>
            </a>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-luxury-400 shrink-0" />
              <span>Sri Lanka</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
