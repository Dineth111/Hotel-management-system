import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Save, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getImageUrl } from '../../utils/image';

const AdminRoomsEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    roomNumber: '', name: '', type: 'Standard', pricePerNight: '',
    capacity: '', bedType: '', size: '', description: '', status: 'Available',
    amenities: []
  });

  const [currentImages, setCurrentImages] = useState([]);
  const [imagesToKeep, setImagesToKeep] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await axios.get(`/rooms/${id}`);
        const r = res.data;
        setForm({
          roomNumber: r.roomNumber, name: r.name, type: r.type, pricePerNight: r.pricePerNight,
          capacity: r.capacity, bedType: r.bedType, size: r.size, description: r.description,
          status: r.status, amenities: r.amenities
        });
        setCurrentImages(r.images);
        setImagesToKeep(r.images);
      } catch (err) {
        toast.error('Failed to load room details');
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  const handleAmenityChange = (amenity) => {
    const updated = form.amenities.includes(amenity)
      ? form.amenities.filter(a => a !== amenity)
      : [...form.amenities, amenity];
    setForm({ ...form, amenities: updated });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setNewFiles(selectedFiles);
    setPreviews(selectedFiles.map(file => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach(k => formData.append(k, k === 'amenities' ? JSON.stringify(form[k]) : form[k]));
    formData.append('existingImages', JSON.stringify(imagesToKeep));
    newFiles.forEach(file => formData.append('images', file));

    try {
      await axios.put(`/admin/rooms/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Room listing updated successfully!');
      navigate('/admin/rooms');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-[400px]"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 font-sans">
      <Link to="/admin/rooms" className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-wider">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Rooms</span>
      </Link>

      <div className="space-y-1">
        <h1 className="text-3xl font-display font-extrabold text-slate-900 leading-tight">Edit Room Listing</h1>
        <p className="text-slate-500 text-sm">Update structural room amenities, nightly pricing, and configure room status.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Room Number</label>
            <input type="text" required value={form.roomNumber} onChange={e => setForm({...form, roomNumber: e.target.value})} className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-105 transition-smooth" /></div>
          <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Room Name</label>
            <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-105 transition-smooth" /></div>
          <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Room Type</label>
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-105 transition-smooth">
              <option value="Standard">Standard</option><option value="Deluxe">Deluxe</option><option value="Suite">Suite</option>
            </select></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Price/Night (LKR)</label>
            <input type="number" required value={form.pricePerNight} onChange={e => setForm({...form, pricePerNight: e.target.value})} className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-105 transition-smooth" /></div>
          <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Guest Capacity</label>
            <input type="number" required value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value})} className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-105 transition-smooth" /></div>
          <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bed Type</label>
            <input type="text" required value={form.bedType} onChange={e => setForm({...form, bedType: e.target.value})} className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-105 transition-smooth" /></div>
          <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Size (sqft)</label>
            <input type="number" required value={form.size} onChange={e => setForm({...form, size: e.target.value})} className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-105 transition-smooth" /></div>
        </div>

        <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Room Description</label>
          <textarea required rows="3" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full bg-slate-50/50 border border-slate-200/80 rounded-2xl p-4 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-105 transition-smooth"></textarea></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Amenities</label>
            <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-600">
              {['AC', 'WiFi', 'TV', 'Hot Water'].map(amenity => (
                <label key={amenity} className="flex items-center space-x-1.5 cursor-pointer">
                  <input type="checkbox" checked={form.amenities.includes(amenity)} onChange={() => handleAmenityChange(amenity)} className="rounded text-primary-500 focus:ring-primary-100 transition-smooth" />
                  <span>{amenity}</span>
                </label>
              ))}
            </div></div>
          <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Room Status</label>
            <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-105 transition-smooth">
              <option value="Available">Available</option><option value="Maintenance">Maintenance</option>
            </select></div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Manage Existing Images</label>
          <div className="flex flex-wrap gap-4">
            {currentImages.map((imgUrl, i) => {
              const isKept = imagesToKeep.includes(imgUrl);
              return (
                <div key={i} className="relative w-20 h-20 rounded-2xl overflow-hidden border border-slate-200/60 shadow-sm shrink-0">
                  <img src={getImageUrl(imgUrl)} alt="Room Thumbnail" className={`w-full h-full object-cover ${!isKept ? 'opacity-25 filter grayscale' : ''}`} />
                  {isKept ? (
                    <button type="button" onClick={() => setImagesToKeep(imagesToKeep.filter(img => img !== imgUrl))} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600 transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  ) : (
                    <button type="button" onClick={() => setImagesToKeep([...imagesToKeep, imgUrl])} className="absolute inset-0 bg-slate-900/85 text-white text-[10px] font-bold flex items-center justify-center transition-colors">Restore</button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Add New Images</label>
          <input type="file" multiple accept="image/*" onChange={handleFileChange} className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border file:border-slate-200 file:text-xs file:font-bold file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100 cursor-pointer" />
          {previews.length > 0 && (
            <div className="flex gap-2.5 mt-3 overflow-x-auto py-1">
              {previews.map((src, i) => <img key={i} src={src} alt="Preview" className="w-12 h-12 object-cover rounded-xl border border-slate-200/60 shadow-sm" />)}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
          <Link to="/admin/rooms" className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs border border-slate-150 transition-smooth">Cancel</Link>
          <button type="submit" className="bg-primary-500 hover:bg-primary-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-sm shadow-primary-500/10 flex items-center space-x-1 transition-smooth">
            <Save className="h-3.5 w-3.5 shrink-0" />
            <span>Update Details</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminRoomsEdit;
