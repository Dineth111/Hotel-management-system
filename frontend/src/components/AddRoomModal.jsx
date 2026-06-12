import React, { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AddRoomModal = ({ isOpen, onClose, onSuccess }) => {
  const [newRoom, setNewRoom] = useState({
    roomNumber: '', name: '', type: 'Standard', pricePerNight: '',
    capacity: '', bedType: '', size: '', description: '', status: 'Available',
    amenities: ['WiFi', 'TV', 'Hot Water']
  });
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    const previewUrls = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews(previewUrls);
  };

  const handleAmenityChange = (amenity) => {
    const active = newRoom.amenities.includes(amenity);
    const updated = active 
      ? newRoom.amenities.filter(a => a !== amenity)
      : [...newRoom.amenities, amenity];
    setNewRoom({ ...newRoom, amenities: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData();
    Object.keys(newRoom).forEach(key => {
      if (key === 'amenities') {
        formData.append(key, JSON.stringify(newRoom[key]));
      } else {
        formData.append(key, newRoom[key]);
      }
    });

    files.forEach(file => formData.append('images', file));

    try {
      await axios.post('/admin/rooms', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('New room created successfully!');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create room');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="bg-white max-w-2xl w-full p-8 rounded-3xl border border-slate-100 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto relative my-8">
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors">
          <X className="h-5 w-5" />
        </button>
        
        <div>
          <h2 className="text-2xl font-display font-extrabold text-slate-900 leading-tight">Add New Room</h2>
          <p className="text-slate-500 text-xs mt-1">Configure specification details and upload media files to host the room.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Room Number</label>
              <input type="text" required value={newRoom.roomNumber} onChange={e => setNewRoom({...newRoom, roomNumber: e.target.value})} className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-smooth" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Room Name</label>
              <input type="text" required value={newRoom.name} onChange={e => setNewRoom({...newRoom, name: e.target.value})} className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-smooth" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Room Type</label>
              <select value={newRoom.type} onChange={e => setNewRoom({...newRoom, type: e.target.value})} className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-smooth">
                <option value="Standard">Standard</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Suite">Suite</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Price/Night (LKR)</label>
              <input type="number" required value={newRoom.pricePerNight} onChange={e => setNewRoom({...newRoom, pricePerNight: e.target.value})} className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-smooth" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Capacity (Guests)</label>
              <input type="number" required value={newRoom.capacity} onChange={e => setNewRoom({...newRoom, capacity: e.target.value})} className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-smooth" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bed Type</label>
              <input type="text" required value={newRoom.bedType} placeholder="e.g. King, Twin" onChange={e => setNewRoom({...newRoom, bedType: e.target.value})} className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-smooth" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Size (sqft)</label>
              <input type="number" required value={newRoom.size} onChange={e => setNewRoom({...newRoom, size: e.target.value})} className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-smooth" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Room Description</label>
            <textarea required rows="3" value={newRoom.description} onChange={e => setNewRoom({...newRoom, description: e.target.value})} className="w-full bg-slate-50/50 border border-slate-200/80 rounded-2xl p-4 text-xs font-semibold focus:outline-none focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-smooth"></textarea>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Amenities</label>
            <div className="flex flex-wrap gap-5 text-xs font-semibold text-slate-600">
              {['AC', 'WiFi', 'TV', 'Hot Water'].map(amenity => (
                <label key={amenity} className="flex items-center space-x-2 cursor-pointer group">
                  <input type="checkbox" checked={newRoom.amenities.includes(amenity)} onChange={() => handleAmenityChange(amenity)} className="rounded text-primary-500 focus:ring-primary-100 transition-smooth" />
                  <span className="group-hover:text-slate-800">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Upload Images (Max 5)</label>
            <input type="file" multiple accept="image/*" onChange={handleFileChange} className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border file:border-slate-200 file:text-xs file:font-bold file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100 cursor-pointer" />
            
            {previews.length > 0 && (
              <div className="flex gap-2.5 mt-3 overflow-x-auto py-1">
                {previews.map((src, i) => (
                  <img key={i} src={src} alt="Preview" className="w-12 h-12 object-cover rounded-xl border border-slate-200/60 shadow-sm" />
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs transition-smooth border border-slate-150">Cancel</button>
            <button type="submit" disabled={submitting} className="bg-primary-500 hover:bg-primary-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-smooth shadow-sm shadow-primary-500/10">
              {submitting ? 'Saving...' : 'Save Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoomModal;
