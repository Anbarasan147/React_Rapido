import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, MessageSquare, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { Button } from '../components/Button';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  q: string;
  a: string;
  category: string;
}

const FAQS: FAQItem[] = [
  { q: 'How can I report a lost item?', a: 'If you left an item in a ride, go to "My Rides" in the menu, select the corresponding ride, and click "Report Issue". Alternatively, you can use our 24/7 Support Chat below.', category: 'ride' },
  { q: 'What payment methods are supported?', a: 'We accept Cash, Rapido Wallet, UPI (Google Pay, PhonePe), and major Credit/Debit cards. You can configure your preferences under "Payments & Wallet".', category: 'payment' },
  { q: 'Why is my captain taking a different route?', a: 'Captains may sometimes select routes based on live traffic updates to ensure you reach faster. If you feel unsafe or have any issues, tap the red SOS button immediately.', category: 'safety' },
  { q: 'Can I schedule a ride in advance?', a: 'Currently, Rapido is an on-demand booking service. We find captains in real-time to pick you up as soon as possible.', category: 'booking' }
];

export const HelpPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null);
  const [showSupportChat, setShowSupportChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ id: string; text: string; sender: 'user' | 'bot' }[]>([
    { id: '1', text: 'Hello! I am your Rapido Assistant. How can I help you today?', sender: 'bot' }
  ]);
  const [inputText, setInputText] = useState('');

  const navigate = useNavigate();

  const toggleFAQ = (index: number) => {
    setOpenFAQIndex(prev => (prev === index ? null : index));
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMsg = { id: Date.now().toString(), text: inputText, sender: 'user' as const };
    setChatMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Simulate bot reply
    setTimeout(() => {
      let botReply = 'I have recorded your query. A support executive will connect with you shortly.';
      if (inputText.toLowerCase().includes('refund')) {
        botReply = 'For refund requests, please select the completed ride in "My Rides" and choose "Request Refund". Refunds are usually processed within 2-3 business days.';
      } else if (inputText.toLowerCase().includes('accident') || inputText.toLowerCase().includes('safety')) {
        botReply = 'Your safety is our priority. If you are in an emergency, please call the local police immediately or use our SOS button. We will contact you at your registered number.';
      }

      setChatMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: botReply,
        sender: 'bot' as const
      }]);
    }, 1200);
  };

  const filteredFAQs = FAQS.filter(faq =>
    faq.q.toLowerCase().includes(search.toLowerCase()) ||
    faq.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-[#0C0C0E] select-none h-full text-white relative">
      {/* Header */}
      <div className="bg-[#16161B] border-b border-[#24242B] px-5 pt-12 pb-5 flex items-center gap-3 flex-shrink-0">
        <button 
          onClick={() => navigate('/home')} 
          className="w-9 h-9 rounded-full bg-[#24242B] flex items-center justify-center text-[#8E8E93] hover:text-white cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>
        <span className="text-sm font-bold text-white">Help & Support</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 no-scrollbar">
        
        {/* Search FAQ */}
        <div className="flex items-center gap-2 bg-[#16161B] border border-[#24242B] rounded-2xl px-4 py-3">
          <Search size={16} className="text-[#8E8E93]" />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-xs text-white w-full focus:outline-none placeholder-[#545458]"
          />
        </div>

        {/* FAQs list accordion */}
        <div className="space-y-3">
          <span className="text-[10px] font-extrabold text-[#8E8E93] uppercase tracking-wider pl-1">Frequently Asked Questions</span>
          <div className="space-y-2">
            {filteredFAQs.map((faq, idx) => {
              const isOpen = openFAQIndex === idx;
              return (
                <div key={idx} className="bg-[#16161B] border border-[#24242B] rounded-2xl overflow-hidden">
                  <button
                    onClick={() => toggleFAQ(idx)}
                    className="w-full p-4 flex justify-between items-center text-left cursor-pointer transition-colors hover:bg-white/2"
                  >
                    <span className="text-xs font-bold text-white pr-2">{faq.q}</span>
                    {isOpen ? <ChevronUp size={14} className="text-[#8E8E93]" /> : <ChevronDown size={14} className="text-[#8E8E93]" />}
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 pt-0 text-[11px] text-[#8E8E93] leading-relaxed border-t border-[#24242B]/30 bg-[#0C0C0E]/20">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
            {filteredFAQs.length === 0 && (
              <p className="text-xs text-[#8E8E93] text-center py-4">No results found for "{search}"</p>
            )}
          </div>
        </div>

        {/* Support Card CTA */}
        <div className="bg-gradient-to-br from-[#FFE600]/10 to-transparent border border-[#FFE600]/20 rounded-3xl p-5 text-left space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">Still need assistance?</h3>
            <p className="text-[10px] text-[#8E8E93] leading-relaxed">
              Connect with our live support bot. Get automated assistance and raise queries instantly.
            </p>
          </div>
          <Button
            onClick={() => setShowSupportChat(true)}
            variant="primary"
            fullWidth
            icon={<MessageSquare size={16} />}
          >
            Chat with Support
          </Button>
        </div>

      </div>

      {/* Support Chat Modal Sheet */}
      <AnimatePresence>
        {showSupportChat && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="absolute inset-x-0 bottom-0 top-10 bg-[#16161B] border-t border-[#24242B] rounded-t-3xl shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-[#24242B] flex justify-between items-center flex-shrink-0">
              <div className="text-left">
                <h4 className="text-xs font-bold text-white">Rapido Care Bot</h4>
                <span className="text-[9px] text-emerald-500 block mt-0.5">Active Support Chat</span>
              </div>
              <button
                onClick={() => setShowSupportChat(false)}
                className="w-7 h-7 rounded-full bg-[#24242B] flex items-center justify-center text-[#8E8E93] hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Chat list */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar flex flex-col">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-[80%] rounded-2xl p-3.5 text-xs text-left
                    ${msg.sender === 'user'
                      ? 'bg-[#FFE600] text-black rounded-tr-none self-end'
                      : 'bg-[#24242B] text-white rounded-tl-none self-start'}
                  `}
                >
                  <p className="font-medium leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-[#24242B] flex gap-3 items-center flex-shrink-0 bg-[#16161B]">
              <input
                type="text"
                placeholder="Ask about refunds, safety, or ride rules..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                className="flex-1 bg-[#24242B] border border-[#3A3A42] rounded-2xl px-4 py-3 text-xs text-white placeholder-[#8E8E93] focus:outline-none focus:border-[#FFE600]"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
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

export default HelpPage;
