import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { PAYMENT_METHODS } from '../mock-data';
import { ArrowLeft, Check, Plus } from 'lucide-react';

export const PaymentMethodPage: React.FC = () => {
  const { paymentMethod, setPaymentMethod } = useBooking();
  const navigate = useNavigate();

  const handleSelect = (id: string) => {
    setPaymentMethod(id);
    navigate('/ride-selector');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0C0C0E] select-none h-full text-white">
      {/* Header */}
      <div className="bg-[#16161B] border-b border-[#24242B] px-5 pt-12 pb-5 flex items-center gap-3">
        <button 
          onClick={() => navigate('/ride-selector')} 
          className="w-9 h-9 rounded-full bg-[#24242B] flex items-center justify-center text-[#8E8E93] hover:text-white cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>
        <span className="text-sm font-bold text-white">Payment Methods</span>
      </div>

      {/* Main List */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 no-scrollbar">
        {/* Recommended Payments */}
        <div className="space-y-3">
          <span className="text-[10px] font-extrabold text-[#8E8E93] uppercase tracking-wider pl-1">Choose Payment Mode</span>
          <div className="space-y-1.5">
            {PAYMENT_METHODS.map((method) => {
              const isSelected = paymentMethod === method.id;
              return (
                <button
                  key={method.id}
                  onClick={() => handleSelect(method.id)}
                  className={`
                    w-full flex items-center justify-between p-4 bg-[#16161B] border rounded-2xl transition-all cursor-pointer text-left
                    ${isSelected 
                      ? 'border-[#FFE600] ring-1 ring-amber-500/10' 
                      : 'border-[#24242B] hover:border-[#32323D]'}
                  `}
                >
                  <div className="flex items-center gap-3.5">
                    <span className="text-2xl w-8 h-8 rounded-lg bg-[#24242B] flex items-center justify-center">
                      {method.icon}
                    </span>
                    <span className="text-sm font-bold text-white">{method.name}</span>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#FFE600] flex items-center justify-center text-black">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Add New Payment Method */}
        <div className="space-y-3">
          <span className="text-[10px] font-extrabold text-[#8E8E93] uppercase tracking-wider pl-1">Add Payment Option</span>
          <div className="space-y-1.5">
            <button className="w-full flex items-center justify-between p-4 bg-[#16161B] border border-[#24242B] border-dashed rounded-2xl hover:border-[#FFE600] transition-colors cursor-pointer text-left">
              <div className="flex items-center gap-3.5">
                <span className="text-lg w-8 h-8 rounded-lg bg-[#24242B] flex items-center justify-center text-[#8E8E93]">
                  +
                </span>
                <div>
                  <h4 className="text-xs font-bold text-white">Add UPI ID</h4>
                  <p className="text-[9px] text-[#8E8E93] mt-0.5">Pay via Google Pay, PhonePe, Bhim, Paytm</p>
                </div>
              </div>
              <Plus size={14} className="text-[#8E8E93]" />
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-[#16161B] border border-[#24242B] border-dashed rounded-2xl hover:border-[#FFE600] transition-colors cursor-pointer text-left">
              <div className="flex items-center gap-3.5">
                <span className="text-lg w-8 h-8 rounded-lg bg-[#24242B] flex items-center justify-center text-[#8E8E93]">
                  💳
                </span>
                <div>
                  <h4 className="text-xs font-bold text-white">Add Credit or Debit Card</h4>
                  <p className="text-[9px] text-[#8E8E93] mt-0.5">Visa, Mastercard, RuPay, Diners Club</p>
                </div>
              </div>
              <Plus size={14} className="text-[#8E8E93]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodPage;
