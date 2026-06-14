import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wallet, ArrowUpRight, ArrowDownLeft, Plus, Copy, Check } from 'lucide-react';
import { MOCK_TRANSACTIONS, MOCK_OFFERS } from '../mock-data';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export const WalletPage: React.FC = () => {
  const [balance, setBalance] = useState(150);
  const [activeTab, setActiveTab] = useState<'tx' | 'offers'>('tx');
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);

  const navigate = useNavigate();

  const handleAddMoney = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(addAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    setBalance(prev => prev + amountNum);
    
    // Add transaction to the front of list
    const newTx = {
      id: `tx_${Date.now()}`,
      amount: amountNum,
      type: 'credit' as const,
      description: 'Added money to wallet',
      date: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    setTransactions(prev => [newTx, ...prev]);
    setAddAmount('');
    setShowAddMoney(false);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0C0C0E] select-none h-full text-white">
      {/* Header */}
      <div className="bg-[#16161B] border-b border-[#24242B] px-5 pt-12 pb-5 flex items-center gap-3 flex-shrink-0">
        <button 
          onClick={() => navigate('/home')} 
          className="w-9 h-9 rounded-full bg-[#24242B] flex items-center justify-center text-[#8E8E93] hover:text-white cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>
        <span className="text-sm font-bold text-white">Wallet & Payments</span>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 no-scrollbar">
        
        {/* Wallet Balance Card */}
        <div className="bg-gradient-to-br from-[#FFE600] to-amber-500 rounded-3xl p-5 text-black text-left shadow-lg shadow-yellow-500/10 flex flex-col justify-between h-40">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <Wallet size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">Rapido Wallet</span>
            </div>
            <span className="text-[9px] font-extrabold bg-black/10 px-2 py-0.5 rounded-full uppercase tracking-wider">Active</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-black/60 block leading-none mb-1">Available Balance</span>
            <h2 className="text-3xl font-black">₹{balance.toFixed(2)}</h2>
          </div>

          <button
            onClick={() => setShowAddMoney(true)}
            className="w-max bg-black text-white hover:bg-black/80 font-extrabold text-[10px] px-4 py-2.5 rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Plus size={12} strokeWidth={3} /> Add Money
          </button>
        </div>

        {/* Tab Selection */}
        <div className="bg-[#16161B] p-1 rounded-2xl flex border border-[#24242B]">
          <button
            onClick={() => setActiveTab('tx')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'tx' ? 'bg-[#FFE600] text-black shadow' : 'text-[#8E8E93] hover:text-white'}`}
          >
            Transactions
          </button>
          <button
            onClick={() => setActiveTab('offers')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'offers' ? 'bg-[#FFE600] text-black shadow' : 'text-[#8E8E93] hover:text-white'}`}
          >
            Promo Offers
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'tx' ? (
          /* Transactions List */
          <div className="space-y-2.5">
            {transactions.map((tx) => (
              <div key={tx.id} className="bg-[#16161B] border border-[#24242B] rounded-2xl p-4 flex justify-between items-center text-left">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${tx.type === 'credit' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                    {tx.type === 'credit' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{tx.description}</h4>
                    <p className="text-[8px] text-[#8E8E93] mt-0.5">{tx.date}</p>
                  </div>
                </div>
                <span className={`text-xs font-extrabold ${tx.type === 'credit' ? 'text-emerald-500' : 'text-white'}`}>
                  {tx.type === 'credit' ? '+' : '-'} ₹{tx.amount}
                </span>
              </div>
            ))}
          </div>
        ) : (
          /* Offers List */
          <div className="space-y-3">
            {MOCK_OFFERS.map((offer) => (
              <div key={offer.code} className="bg-[#16161B] border border-[#24242B] p-4 rounded-2xl flex items-center justify-between text-left">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#FFE600] text-black font-extrabold text-[9px] px-2 py-0.5 rounded-md uppercase">
                      {offer.code}
                    </span>
                    <span className="text-[9px] text-[#8E8E93] font-semibold">
                      Save {offer.type === 'flat' ? `₹${offer.discount}` : `${offer.discount}%`}
                    </span>
                  </div>
                  <p className="text-xs text-white font-bold leading-normal">{offer.description}</p>
                </div>
                <button
                  onClick={() => handleCopyCode(offer.code)}
                  className="w-9 h-9 rounded-xl bg-[#24242B] hover:bg-[#32323D] flex items-center justify-center text-[#FFE600] transition-colors cursor-pointer border border-[#3a3a42]/30 flex-shrink-0"
                >
                  {copiedCode === offer.code ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                </button>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Add Money Modal Sheet */}
      {showAddMoney && (
        <div className="absolute inset-0 bg-black/60 z-40 flex items-end">
          <form onSubmit={handleAddMoney} className="w-full bg-[#16161B] border-t border-[#24242B] rounded-t-3xl p-5 flex flex-col gap-4 z-50">
            <div className="flex justify-between items-center pb-2 border-b border-[#24242B]">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Add Wallet Money</h3>
              <button type="button" onClick={() => setShowAddMoney(false)} className="text-xs text-[#8E8E93]">✕</button>
            </div>

            <Input
              label="Amount (INR)"
              type="number"
              placeholder="Enter amount"
              value={addAmount}
              onChange={(e) => setAddAmount(e.target.value)}
              prefixText="₹"
              autoFocus
            />

            {/* Quick selectors */}
            <div className="flex gap-2">
              {['100', '200', '500'].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAddAmount(amt)}
                  className="flex-1 bg-[#24242B] border border-[#3A3A42] text-white py-2 rounded-xl text-xs font-bold hover:border-[#FFE600] cursor-pointer transition-colors"
                >
                  +₹{amt}
                </button>
              ))}
            </div>

            <Button
              type="submit"
              fullWidth
              disabled={!addAmount || parseFloat(addAmount) <= 0}
            >
              Add Money to Wallet
            </Button>
          </form>
        </div>
      )}

    </div>
  );
};

export default WalletPage;
