import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, Image, MapPin, Phone, Mail, Link, FileText, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getImageUrl } from '../../utils/image';

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    hotelName: '', address: '', phone: '', email: '', whatsapp: '',
    googleMapEmbedUrl: '', aboutText: ''
  });

  const [currentImages, setCurrentImages] = useState([]);
  const [imagesToKeep, setImagesToKeep] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const fetchSettings = async () => {
    try {
      const res = await axios.get('/admin/settings');
      const s = res.data;
      setForm({
        hotelName: s.hotelName, address: s.address, phone: s.phone,
        email: s.email, whatsapp: s.whatsapp, googleMapEmbedUrl: s.googleMapEmbedUrl,
        aboutText: s.aboutText
      });
      setCurrentImages(s.aboutImages || []);
      setImagesToKeep(s.aboutImages || []);
    } catch (err) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleRemoveCurrentImage = (imgUrl) => {
    const updated = imagesToKeep.filter(img => img !== imgUrl);
    setImagesToKeep(updated);
  };

  const handleRestoreCurrentImage = (imgUrl) => {
    setImagesToKeep([...imagesToKeep, imgUrl]);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setNewFiles(selectedFiles);

    const previewUrls = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews(previewUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData();
    Object.keys(form).forEach(key => formData.append(key, form[key]));
    formData.append('existingAboutImages', JSON.stringify(imagesToKeep));
    newFiles.forEach(file => formData.append('aboutImages', file));

    try {
      await axios.put('/admin/settings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Hotel settings updated successfully!');
      setNewFiles([]);
      setPreviews([]);
      fetchSettings();
    } catch (err) {
      toast.error('Failed to update settings');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-20 font-semibold">Loading settings...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12 font-sans">
      <div className="space-y-1">
        <h1 className="text-3xl font-display font-extrabold text-slate-900 leading-tight">Hotel Configurations</h1>
        <p className="text-slate-500 text-sm">Update hotel branding, contact numbers, map embeds, and about description.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center space-x-1.5 tracking-wider"><FileText className="h-3.5 w-3.5 shrink-0" /><span>Hotel Name</span></label>
            <input type="text" required value={form.hotelName} onChange={e => setForm({...form, hotelName: e.target.value})} className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-105 transition-smooth" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center space-x-1.5 tracking-wider"><MapPin className="h-3.5 w-3.5 shrink-0" /><span>Address</span></label>
            <input type="text" required value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-105 transition-smooth" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center space-x-1.5 tracking-wider"><Phone className="h-3.5 w-3.5 shrink-0" /><span>Contact Phone</span></label>
            <input type="text" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-105 transition-smooth" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center space-x-1.5 tracking-wider"><Mail className="h-3.5 w-3.5 shrink-0" /><span>Contact Email</span></label>
            <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-105 transition-smooth" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center space-x-1.5 tracking-wider"><Image className="h-3.5 w-3.5 shrink-0" /><span>WhatsApp Number</span></label>
            <input type="text" required value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-105 transition-smooth" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center space-x-1.5 tracking-wider"><Link className="h-3.5 w-3.5 shrink-0" /><span>Google Map Embed URL</span></label>
          <input type="text" required value={form.googleMapEmbedUrl} onChange={e => setForm({...form, googleMapEmbedUrl: e.target.value})} className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-105 transition-smooth" />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center space-x-1.5 tracking-wider"><span>About Hotel Text Description</span></label>
          <textarea required rows="4" value={form.aboutText} onChange={e => setForm({...form, aboutText: e.target.value})} className="w-full bg-slate-50/50 border border-slate-200/80 rounded-2xl p-4 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-105 transition-smooth"></textarea>
        </div>

        {/* Current about images deletion manager */}
        {currentImages.length > 0 && (
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Current About Images</label>
            <div className="flex flex-wrap gap-4">
              {currentImages.map((imgUrl, i) => {
                const isKept = imagesToKeep.includes(imgUrl);
                return (
                  <div key={i} className="relative w-20 h-20 rounded-2xl overflow-hidden border border-slate-200/60 shadow-sm shrink-0">
                    <img src={getImageUrl(imgUrl)} alt="About Thumbnail" className={`w-full h-full object-cover ${!isKept ? 'opacity-25 filter grayscale' : ''}`} />
                    {isKept ? (
                      <button type="button" onClick={() => handleRemoveCurrentImage(imgUrl)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600 transition-colors">
                        <X className="h-3 w-3" />
                      </button>
                    ) : (
                      <button type="button" onClick={() => handleRestoreCurrentImage(imgUrl)} className="absolute inset-0 bg-slate-900/85 text-white text-[10px] font-bold flex items-center justify-center transition-colors">
                        Restore
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Upload new photos */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Upload New About Images (Max 5)</label>
          <input type="file" multiple accept="image/*" onChange={handleFileChange} className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border file:border-slate-200 file:text-xs file:font-bold file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100 cursor-pointer" />
          {previews.length > 0 && (
            <div className="flex gap-2.5 mt-3 overflow-x-auto py-1">
              {previews.map((src, i) => (
                <img key={i} src={src} alt="Preview" className="w-12 h-12 object-cover rounded-xl border border-slate-200/60 shadow-sm" />
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button type="submit" disabled={submitting} className="bg-primary-500 hover:bg-primary-600 text-white font-bold px-6 py-3.5 rounded-xl text-xs shadow-sm shadow-primary-500/10 flex items-center space-x-1.5 transition-smooth">
            <Save className="h-3.5 w-3.5 shrink-0" />
            <span>{submitting ? 'Saving Configurations...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
