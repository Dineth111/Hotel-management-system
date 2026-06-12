import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, MailOpen, Trash2, Eye, X, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active message modal viewer state
  const [activeMsg, setActiveMsg] = useState(null);

  const fetchMessages = async () => {
    try {
      const res = await axios.get('/admin/contact-messages');
      setMessages(res.data);
    } catch (err) {
      toast.error('Failed to load contact messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleOpenMessage = async (msg) => {
    setActiveMsg(msg);

    // If message is unread, mark it as read on the backend
    if (!msg.isRead) {
      try {
        await axios.put(`/admin/contact-messages/${msg._id}/read`);
        // Refresh local list
        fetchMessages();
      } catch (err) {
        console.error('Failed to mark message as read', err);
      }
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // prevent opening details modal
    if (!window.confirm('Delete this message permanently?')) return;

    try {
      await axios.delete(`/admin/contact-messages/${id}`);
      toast.success('Message deleted successfully');
      if (activeMsg && activeMsg._id === id) {
        setActiveMsg(null);
      }
      fetchMessages();
    } catch (err) {
      toast.error('Delete message failed');
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
    <div className="space-y-8 font-sans">
      <div>
        <h1 className="text-3xl font-display font-extrabold text-slate-900 leading-tight">Inbox Inquiries</h1>
        <p className="text-slate-500 text-sm">Read and manage contact requests submitted by guests and event planners.</p>
      </div>

      {messages.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-100 shadow-sm space-y-4 max-w-md mx-auto">
          <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
            <Info className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <p className="text-slate-700 font-bold text-sm">Your inbox is empty</p>
            <p className="text-slate-400 text-xs">Customer messages and booking queries will appear here.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  <th className="px-6 py-4.5 w-12 text-center">Status</th>
                  <th className="px-6 py-4.5">Sender</th>
                  <th className="px-6 py-4.5">Subject / Preview</th>
                  <th className="px-6 py-4.5">Date Received</th>
                  <th className="px-6 py-4.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
                {messages.map((msg) => (
                  <tr
                    key={msg._id}
                    onClick={() => handleOpenMessage(msg)}
                    className="hover:bg-slate-50/30 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-5 text-center">
                      {!msg.isRead ? (
                        <span className="inline-block h-2.5 w-2.5 rounded-full bg-primary-500 shadow-sm shadow-primary-500/40 animate-pulse" title="Unread" />
                      ) : (
                        <span className="inline-block h-2 w-2 rounded-full bg-slate-350" title="Read" />
                      )}
                    </td>
                    <td className="px-6 py-5 space-y-0.5">
                      <p className={`text-sm ${!msg.isRead ? 'text-slate-900 font-extrabold' : 'text-slate-700 font-bold'}`}>{msg.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{msg.email}</p>
                    </td>
                    <td className="px-6 py-5 space-y-0.5 max-w-xs">
                      <p className={`text-sm line-clamp-1 ${!msg.isRead ? 'text-slate-900 font-extrabold' : 'text-slate-700 font-bold'}`}>{msg.subject}</p>
                      <p className="text-[11px] text-slate-400 font-medium line-clamp-1">{msg.message}</p>
                    </td>
                    <td className="px-6 py-5 text-[10px] text-slate-400 font-bold tracking-wider">
                      {new Date(msg.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center space-x-2.5">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleOpenMessage(msg); }}
                          className="bg-slate-50 hover:bg-slate-100 text-slate-700 p-2.5 rounded-xl border border-slate-200 transition-smooth"
                          title="Read Message"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(msg._id, e)}
                          className="bg-red-50 hover:bg-red-100 text-red-500 p-2.5 rounded-xl border border-red-100 transition-smooth"
                          title="Delete Message"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Message View Modal Overlay */}
      {activeMsg && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full p-8 rounded-3xl border border-slate-100 shadow-2xl border-l-4 border-l-primary-500 space-y-5 relative">
            <button onClick={() => setActiveMsg(null)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors">
              <X className="h-5 w-5" />
            </button>
            
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-primary-500 uppercase tracking-widest">Inquiry Message</span>
              <h2 className="text-xl font-display font-extrabold text-slate-900 leading-tight">{activeMsg.subject}</h2>
            </div>

            <div className="bg-slate-50 p-4.5 rounded-2xl space-y-2 text-xs font-semibold text-slate-500 border border-slate-200/40">
              <p>Name: <span className="text-slate-800 font-extrabold">{activeMsg.name}</span></p>
              <p>Email: <span className="text-slate-800">{activeMsg.email}</span></p>
              <p>Phone: <span className="text-slate-800">{activeMsg.phone}</span></p>
              <p>Sent: <span className="text-slate-800 font-normal">{new Date(activeMsg.createdAt).toLocaleString()}</span></p>
            </div>

            <div className="space-y-2">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Message Body</span>
              <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap bg-slate-50/50 p-5 rounded-2xl border border-slate-200/50 max-h-[200px] overflow-y-auto">
                {activeMsg.message}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveMsg(null)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition-smooth"
              >
                Close Inquiry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContactMessages;
