import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BedDouble, Plus, Trash2, Edit, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AddRoomModal from '../../components/AddRoomModal';
import { getImageUrl } from '../../utils/image';

const AdminRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchRooms = async () => {
    try {
      const res = await axios.get('/rooms');
      setRooms(res.data);
    } catch (err) {
      toast.error('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room? This will also purge all uploaded images from disk.')) return;
    try {
      await axios.delete(`/admin/rooms/${id}`);
      toast.success('Room listing deleted successfully');
      fetchRooms();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-extrabold text-slate-900 leading-tight">Room Listings</h1>
          <p className="text-slate-500 text-sm">Create, update, and manage available suites and resort layouts.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-slate-900 hover:bg-primary-600 text-white font-bold px-4 py-3 rounded-2xl shadow-lg shadow-slate-900/10 hover:shadow-primary-600/20 flex items-center space-x-2 text-xs transition-smooth"
        >
          <Plus className="h-4 w-4 shrink-0" />
          <span>Add New Room</span>
        </button>
      </div>

      {rooms.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-100 shadow-sm space-y-4 max-w-md mx-auto">
          <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
            <Info className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <p className="text-slate-700 font-bold text-sm">No rooms catalogued</p>
            <p className="text-slate-400 text-xs">Create your first room listing to show in the guest portal.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  <th className="px-6 py-4.5">Preview</th>
                  <th className="px-6 py-4.5">Room No</th>
                  <th className="px-6 py-4.5">Room details</th>
                  <th className="px-6 py-4.5">Class Type</th>
                  <th className="px-6 py-4.5">Capacity</th>
                  <th className="px-6 py-4.5">Fare / Night</th>
                  <th className="px-6 py-4.5">Status</th>
                  <th className="px-6 py-4.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
                {rooms.map((room) => (
                  <tr key={room._id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4 shrink-0">
                      <img
                        src={getImageUrl(room.images[0])}
                        alt={room.name}
                        className="w-11 h-11 rounded-xl object-cover border border-slate-200/50 shadow-sm"
                      />
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800 text-sm">{room.roomNumber}</td>
                    <td className="px-6 py-4 font-bold text-slate-800 text-sm">{room.name}</td>
                    <td className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wide">{room.type}</td>
                    <td className="px-6 py-4">{room.capacity} Guests</td>
                    <td className="px-6 py-4 font-bold text-slate-800">LKR {room.pricePerNight.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                        room.status === 'Available' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
                      }`}>{room.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <Link
                          to={`/admin/rooms/edit/${room._id}`}
                          className="bg-slate-50 hover:bg-slate-100 text-slate-700 p-2.5 rounded-xl border border-slate-250 transition-smooth"
                          title="Edit Room"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(room._id)}
                          className="bg-red-50 hover:bg-red-100/80 text-red-500 p-2.5 rounded-xl border border-red-100 transition-smooth"
                          title="Delete Room"
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

      {/* Add Room Modal Component */}
      <AddRoomModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={fetchRooms}
      />
    </div>
  );
};

export default AdminRooms;
