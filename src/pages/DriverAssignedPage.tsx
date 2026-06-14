import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { MapContainer } from '../components/MapContainer';
import { Phone, MessageSquare, ShieldAlert, X, Send, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  sender: 'rider' | 'driver';
  time: string;
}

const PRESET_MESSAGES = [
  'I am at the pickup location.',
  'Please bring a helmet.',
  'Coming in 2 minutes.',
  'Are you nearby?'
];

const DRIVER_REPLIES = [
  'Okay, I am coming.',
  'Yes, reaching in a minute.',
  'Please wait near the main gate.',
  'Got it. I am on the way.'
];

export const DriverAssignedPage: React.FC = () => {
  const {
    bookingStatus,
    assignedDriver,
    otp,
    progress,
    cancelBooking,
    startRideSimulation
  } = useBooking();

  const [showChat, setShowChat] = useState(false);
  const [showCall, setShowCall] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([
    { id: '1', text: 'Hi, I am on the way to pick you up.', sender: 'driver', time: 'Just now' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  
  const navigate = useNavigate();

  // Redirect if ride cancelled or completed
  useEffect(() => {
    if (bookingStatus === 'idle') {
      navigate('/home');
    } else if (bookingStatus === 'started') {
      navigate('/ride-tracking');
    }
  }, [bookingStatus, navigate]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    
    const newMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: 'rider',
      time: 'Just now'
    };

    setChatMessages(prev => [...prev, newMsg]);
    setInputMessage('');

    // Simulate driver reply after 1.5s
    setTimeout(() => {
      const replyText = DRIVER_REPLIES[Math.floor(Math.random() * DRIVER_REPLIES.length)];
      const driverReply: Message = {
        id: (Date.now() + 1).toString(),
        text: replyText,
        sender: 'driver',
        time: 'Just now'
      };
      setChatMessages(prev => [...prev, driverReply]);
    }, 1500);
  };

  const handleCancel = () => {
    cancelBooking();
    navigate('/home');
  };

  const forceStartRide = () => {
    startRideSimulation();
    navigate('/ride-tracking');
  };

  if (!assignedDriver) return null;

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden select-none">
      
      {/* Dev Tools Overlay on Map (Top Right) */}
      <div className="absolute top-14 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
        <div className="bg-black/90 border border-amber-500/30 rounded-2xl p-2.5 flex flex-col gap-1.5 shadow-2xl max-w-[150px]">
          <span className="text-[8px] font-black text-amber-400 uppercase tracking-widest text-center">Dev Controls</span>
          <button
            onClick={forceStartRide}
            className="flex items-center justify-center gap-1 bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-[9px] py-1 px-2 rounded-lg cursor-pointer transition-all"
          >
            <Play size={10} /> Start Ride
          </button>
        </div>
      </div>

      {/* Map Background */}
      <div className="flex-1 z-10 w-full h-full">
        <MapContainer />
      </div>

      {/* Bottom Driver Details Sheet */}
      <div className="z-20 bg-[#0C0C0E]/95 backdrop-blur-lg border-t border-[#24242B] p-5 rounded-t-3xl flex flex-col gap-4 shadow-2xl relative">
        
        {/* Status Header */}
        <div className="flex justify-between items-center pb-3 border-b border-[#24242B]/60">
          <div>
            <h3 className="text-sm font-extrabold text-white">
              {bookingStatus === 'arriving' ? 'Captain is arriving' : 'Captain Assigned'}
            </h3>
            <p className="text-[10px] text-emerald-500 font-bold mt-0.5">
              {bookingStatus === 'arriving' ? `Pickup in ${Math.max(1, Math.round((40 - progress) / 10))} mins` : 'Preparing for arrival...'}
            </p>
          </div>
          {/* PIN OTP badge */}
          <div className="bg-[#FFE600]/10 border border-[#FFE600]/30 rounded-2xl px-3 py-1.5 text-center">
            <span className="text-[8px] font-extrabold text-[#8E8E93] uppercase block leading-none mb-0.5">PIN OTP</span>
            <span className="text-sm font-black text-[#FFE600] tracking-widest leading-none">{otp}</span>
          </div>
        </div>

        {/* Captain Details Card */}
        <div className="flex items-center gap-3.5 bg-[#16161B] border border-[#24242B] rounded-2xl p-3 text-left">
          <img
            src={assignedDriver.avatar}
            alt={assignedDriver.name}
            className="w-12 h-12 rounded-2xl object-cover border border-[#24242B]"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-bold text-white truncate">{assignedDriver.name}</h4>
              <span className="text-[9px] font-bold text-[#FFE600] bg-[#24242B] px-1.5 py-0.5 rounded-md">
                ★ {assignedDriver.rating}
              </span>
            </div>
            <p className="text-[10px] text-[#8E8E93] truncate mt-0.5">{assignedDriver.vehicleName}</p>
            <span className="inline-block bg-[#24242B] border border-[#3A3A42] text-white text-[9px] font-bold px-2 py-0.5 rounded-md mt-1">
              {assignedDriver.vehicleNumber}
            </span>
          </div>
        </div>

        {/* Action Panel: Call, Message, SOS, Cancel */}
        <div className="grid grid-cols-4 gap-2.5">
          <button
            onClick={() => setShowCall(true)}
            className="flex flex-col items-center justify-center bg-[#16161B] border border-[#24242B] hover:border-[#FFE600]/40 rounded-2xl py-3 cursor-pointer transition-all active:scale-95"
          >
            <Phone size={18} className="text-emerald-500 mb-1" />
            <span className="text-[9px] font-bold text-white">Call Captain</span>
          </button>

          <button
            onClick={() => setShowChat(true)}
            className="flex flex-col items-center justify-center bg-[#16161B] border border-[#24242B] hover:border-[#FFE600]/40 rounded-2xl py-3 cursor-pointer transition-all active:scale-95 relative"
          >
            <MessageSquare size={18} className="text-[#FFE600] mb-1" />
            <span className="text-[9px] font-bold text-white">Message</span>
            <span className="absolute top-1.5 right-4 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </button>

          <button
            onClick={() => alert('SOS Alert Sent to Emergency Contacts & Rapido Team')}
            className="flex flex-col items-center justify-center bg-[#16161B] border border-[#24242B] hover:border-red-500/40 rounded-2xl py-3 cursor-pointer transition-all active:scale-95"
          >
            <ShieldAlert size={18} className="text-red-500 mb-1" />
            <span className="text-[9px] font-bold text-white">SOS Safety</span>
          </button>

          <button
            onClick={handleCancel}
            className="flex flex-col items-center justify-center bg-[#16161B] border border-[#24242B] hover:bg-red-500/5 rounded-2xl py-3 cursor-pointer transition-all active:scale-95"
          >
            <X size={18} className="text-[#8E8E93] mb-1" />
            <span className="text-[9px] font-bold text-white">Cancel Ride</span>
          </button>
        </div>
      </div>

      {/* Simulated Call Modal overlay */}
      <AnimatePresence>
        {showCall && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 z-50 flex flex-col justify-between py-16 px-8 items-center text-center text-white"
          >
            <div className="space-y-1">
              <span className="text-xs text-[#8E8E93] uppercase tracking-wider block">Calling via Rapido Care</span>
              <h2 className="text-2xl font-black">{assignedDriver.name}</h2>
              <span className="text-sm text-emerald-500 font-semibold">{assignedDriver.phone}</span>
            </div>

            <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative">
              <img
                src={assignedDriver.avatar}
                alt={assignedDriver.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-emerald-500"
              />
              <div className="absolute inset-0 border border-emerald-500 rounded-full animate-ping opacity-30" />
            </div>

            <button
              onClick={() => setShowCall(false)}
              className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <Phone size={24} className="rotate-135" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simulated Chat Overlay Panel */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="absolute inset-x-0 bottom-0 top-10 bg-[#16161B] border-t border-[#24242B] rounded-t-3xl shadow-2xl z-50 flex flex-col"
          >
            {/* Chat Header */}
            <div className="px-5 py-4 border-b border-[#24242B] flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-3">
                <img
                  src={assignedDriver.avatar}
                  alt={assignedDriver.name}
                  className="w-8 h-8 rounded-xl object-cover"
                />
                <div className="text-left">
                  <h4 className="text-xs font-bold text-white leading-none">{assignedDriver.name}</h4>
                  <span className="text-[9px] text-[#8E8E93] block mt-1">Online • Ride OTP: {otp}</span>
                </div>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="w-7 h-7 rounded-full bg-[#24242B] flex items-center justify-center text-[#8E8E93] hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar flex flex-col">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-[75%] rounded-2xl p-3.5 text-xs text-left
                    ${msg.sender === 'rider'
                      ? 'bg-[#FFE600] text-black rounded-tr-none self-end'
                      : 'bg-[#24242B] text-white rounded-tl-none self-start'}
                  `}
                >
                  <p className="font-medium leading-relaxed">{msg.text}</p>
                  <span className={`text-[8px] block mt-1 text-right ${msg.sender === 'rider' ? 'text-black/50' : 'text-[#8E8E93]'}`}>
                    {msg.time}
                  </span>
                </div>
              ))}
            </div>

            {/* Quick pre-set chip messages */}
            <div className="px-5 py-2 flex gap-2 overflow-x-auto no-scrollbar border-t border-[#24242B]/30 flex-shrink-0 bg-[#0c0c0e]/40">
              {PRESET_MESSAGES.map((msg, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(msg)}
                  className="flex-shrink-0 bg-[#24242B] hover:bg-[#32323D] border border-[#3A3A42] text-[10px] font-bold text-white px-3 py-2 rounded-full cursor-pointer transition-colors"
                >
                  {msg}
                </button>
              ))}
            </div>

            {/* Input keyboard bar */}
            <div className="p-4 border-t border-[#24242B] flex gap-3 items-center flex-shrink-0">
              <input
                type="text"
                placeholder="Type a message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage(inputMessage);
                }}
                className="flex-1 bg-[#24242B] border border-[#3A3A42] rounded-2xl px-4 py-3 text-xs text-white placeholder-[#8E8E93] focus:outline-none focus:border-[#FFE600]"
              />
              <button
                onClick={() => handleSendMessage(inputMessage)}
                disabled={!inputMessage.trim()}
                className="w-10 h-10 rounded-2xl bg-[#FFE600] disabled:bg-[#FFE600]/20 disabled:text-[#FFE600]/30 text-black flex items-center justify-center cursor-pointer active:scale-95 transition-all flex-shrink-0"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DriverAssignedPage;
