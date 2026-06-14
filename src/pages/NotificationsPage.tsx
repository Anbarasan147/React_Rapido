import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Gift, ShieldAlert, Trash2, CheckCheck } from 'lucide-react';
import { MOCK_NOTIFICATIONS } from '../mock-data';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const navigate = useNavigate();

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'promo':
        return <Gift size={16} className="text-pink-500" />;
      case 'system':
        return <ShieldAlert size={16} className="text-red-500" />;
      case 'ride':
      default:
        return <Bell size={16} className="text-[#FFE600]" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0C0C0E] select-none h-full text-white">
      {/* Header */}
      <div className="bg-[#16161B] border-b border-[#24242B] px-5 pt-12 pb-5 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/home')} 
            className="w-9 h-9 rounded-full bg-[#24242B] flex items-center justify-center text-[#8E8E93] hover:text-white cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          <span className="text-sm font-bold text-white">Notifications</span>
        </div>

        {notifications.length > 0 && (
          <div className="flex gap-2">
            <button 
              onClick={handleMarkAllRead} 
              className="text-[#8E8E93] hover:text-[#FFE600] p-1.5 transition-colors cursor-pointer"
              title="Mark all as read"
            >
              <CheckCheck size={16} />
            </button>
            <button 
              onClick={handleClearAll} 
              className="text-[#8E8E93] hover:text-red-500 p-1.5 transition-colors cursor-pointer"
              title="Clear all"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 no-scrollbar">
        {notifications.length === 0 ? (
          /* Empty State */
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 px-6">
            <div className="w-16 h-16 rounded-full bg-[#16161B] border border-[#24242B] flex items-center justify-center text-xl text-[#8E8E93]">
              📭
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">All Caught Up</h3>
              <p className="text-xs text-[#8E8E93] leading-relaxed max-w-[200px]">
                You have no new notifications. We'll alert you when something pops up!
              </p>
            </div>
          </div>
        ) : (
          /* Notifications List */
          <div className="space-y-2.5">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`
                  border rounded-2xl p-4 flex gap-3.5 text-left transition-all duration-200
                  ${notif.read ? 'bg-[#16161B]/60 border-[#24242B]' : 'bg-[#16161B] border-[#ffe600]/20'}
                `}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#24242B]`}>
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-white leading-normal truncate pr-2">{notif.title}</h4>
                    {!notif.read && (
                      <span className="w-1.5 h-1.5 bg-[#FFE600] rounded-full flex-shrink-0 mt-1" />
                    )}
                  </div>
                  <p className="text-[10px] text-[#8E8E93] leading-relaxed mt-1">{notif.body}</p>
                  <span className="text-[8px] text-[#545458] block mt-1.5">{notif.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
