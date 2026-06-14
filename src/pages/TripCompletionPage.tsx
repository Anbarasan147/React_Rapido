import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { StarRating } from '../components/StarRating';
import { Button } from '../components/Button';
import { Check, MessageSquare } from 'lucide-react';

const REVIEW_TAGS = [
  'Polite Captain',
  'Safe Driving',
  'Clean Vehicle',
  'Helmets Provided',
  'Easy Communication',
  'On Time Pickup'
];

export const TripCompletionPage: React.FC = () => {
  const {
    assignedDriver,
    pickup,
    drop,
    fare,
    paymentMethod,
    completeTrip
  } = useBooking();

  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const navigate = useNavigate();

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    // Simulate database saving
    setTimeout(() => {
      completeTrip(); // Clear context booking
      navigate('/home');
    }, 1500);
  };

  const driverName = assignedDriver?.name || 'Your Captain';
  const driverAvatar = assignedDriver?.avatar || 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&q=80&w=200';

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-[#0C0C0E] select-none h-full text-white overflow-y-auto no-scrollbar">
      {isSubmitted ? (
        /* Thank you screen */
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FFE600] flex items-center justify-center text-black font-extrabold text-2xl shadow-xl shadow-yellow-500/10">
            <Check size={28} strokeWidth={3} />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold">Feedback Submitted!</h2>
            <p className="text-xs text-[#8E8E93]">Thank you for helping us improve our rides.</p>
          </div>
        </div>
      ) : (
        /* Feedback Form */
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between h-full gap-5">
          <div className="space-y-5">
            {/* Top Success Banner */}
            <div className="text-center py-4 bg-[#FFE600]/10 border border-[#FFE600]/20 rounded-3xl space-y-1 mt-4">
              <span className="text-xs font-bold text-[#FFE600] uppercase tracking-wider block">Trip Completed!</span>
              <h2 className="text-2xl font-black text-white">₹{fare} Charged</h2>
              <p className="text-[10px] text-[#8E8E93]">Paid via {paymentMethod.toUpperCase()}</p>
            </div>

            {/* Trip Details Card */}
            <div className="bg-[#16161B] border border-[#24242B] rounded-3xl p-4 space-y-3.5 text-left">
              <div className="flex items-center gap-3">
                <img
                  src={driverAvatar}
                  alt={driverName}
                  className="w-10 h-10 rounded-xl object-cover border border-[#24242B]"
                />
                <div>
                  <h4 className="text-xs font-bold text-white leading-none">{driverName}</h4>
                  <p className="text-[9px] text-[#8E8E93] mt-1">Captain ID: rap_cap_{assignedDriver?.id || '901'}</p>
                </div>
              </div>

              {/* Route Summary */}
              <div className="flex flex-col gap-1.5 border-t border-[#24242B]/60 pt-3 text-[10px] text-[#8E8E93]">
                <div className="truncate"><span className="w-1.5 h-1.5 bg-emerald-500 inline-block rounded-full mr-2" />Pickup: <strong className="text-white">{pickup?.name}</strong></div>
                <div className="truncate"><span className="w-1.5 h-1.5 bg-red-500 inline-block rounded-sm mr-2" />Drop: <strong className="text-white">{drop?.name}</strong></div>
              </div>
            </div>

            {/* Rating Section */}
            <div className="text-center space-y-3.5 border-t border-[#24242B]/60 pt-5">
              <div className="space-y-0.5">
                <h3 className="text-sm font-extrabold text-white">Rate your Captain</h3>
                <p className="text-[10px] text-[#8E8E93]">How was your ride experience?</p>
              </div>

              <StarRating rating={rating} interactive onRatingChange={setRating} size={28} />
            </div>

            {/* Review tags */}
            <div className="space-y-2 border-t border-[#24242B]/60 pt-5">
              <span className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wide block text-left">
                What went well?
              </span>
              <div className="flex flex-wrap gap-2">
                {REVIEW_TAGS.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagToggle(tag)}
                      className={`
                        py-2 px-3 border.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer select-none
                        ${isSelected 
                          ? 'bg-[#FFE600] text-black border-[#FFE600]' 
                          : 'bg-[#16161B] text-white border-[#24242B] hover:border-[#3A3A42]'}
                      `}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comments Text Area */}
            <div className="relative border-t border-[#24242B]/60 pt-5">
              <div className="flex items-center gap-2 bg-[#16161B] border border-[#24242B] rounded-2xl p-3">
                <MessageSquare size={16} className="text-[#8E8E93] flex-shrink-0" />
                <textarea
                  placeholder="Leave a comment (optional)..."
                  rows={2}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="bg-transparent text-xs text-white w-full focus:outline-none placeholder-[#545458] font-medium resize-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pb-4">
            <Button
              onClick={handleSubmit}
              fullWidth
            >
              Submit Rating
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TripCompletionPage;
