import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CardDiscrepancyNotificationProps {
  cardName: string;
}

export default function CardDiscrepancyNotification({ cardName }: CardDiscrepancyNotificationProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState('');

  const handleReportDiscrepancy = () => {
    setShowPopup(true);
  };

  const handleSubmit = () => {
    const whatsappMessage = `Card: ${cardName}\nDiscrepancy: ${message}`;
    const whatsappUrl = `https://wa.me/919321314553?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');
    setShowPopup(false);
    setMessage('');
  };

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed right-4 top-20 z-50 flex flex-col items-end"
          style={{ minWidth: isExpanded ? '220px' : '48px', maxWidth: '260px' }}
        >
          {isExpanded ? (
            <div className="bg-white/60 rounded-lg shadow-lg border border-gray-200 transition-all duration-200 p-2 max-w-xs w-full">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900 mb-0 truncate">Report Discrepancy</h3>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="ml-2 text-green-500 hover:text-green-600 font-medium text-xs focus:outline-none flex items-center justify-center"
                  aria-label="Collapse notification"
                >
                  {/* Chevron right */}
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7 6L12 10L7 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              <div className="mt-2">
                <div className="text-xs text-gray-600 mb-3">
                  If you notice any differences please report.
                </div>
                <button
                  onClick={handleReportDiscrepancy}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs font-medium"
                >
                  Report Discrepancy
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsExpanded(true)}
              className="w-12 h-12 flex items-center justify-center bg-white/80 rounded-2xl shadow-lg border border-gray-100 hover:bg-green-50/80 transition-all duration-200 focus:outline-none"
              aria-label="Expand notification"
            >
              {/* Chevron left, green */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 6L10 12L15 18" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </motion.div>
      </AnimatePresence>

      {/* WhatsApp-like Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPopup(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#111b21] rounded-lg shadow-xl w-full max-w-md overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-[#202c33] px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#00a884] flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-medium">WhatsApp Support</h3>
                  <p className="text-[#8696a0] text-sm">+91 9321314553</p>
                </div>
              </div>

              {/* Chat Area */}
              <div className="bg-[#0b141a] p-4 min-h-[200px] max-h-[400px] overflow-y-auto">
                <div className="bg-[#005c4b] text-white p-3 rounded-lg max-w-[85%] mb-4">
                  <p className="text-sm">Card: {cardName}</p>
                  <p className="text-sm mt-1">Please describe the discrepancy you noticed.</p>
                </div>
              </div>

              {/* Input Area */}
              <div className="bg-[#202c33] p-3 flex items-center gap-2">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message"
                  className="flex-1 bg-[#2a3942] text-white rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-[#00a884] min-h-[40px] max-h-[100px]"
                  rows={1}
                />
                <button
                  onClick={handleSubmit}
                  className="bg-[#00a884] text-white p-2 rounded-full hover:bg-[#008f6f] transition-colors"
                  disabled={!message.trim()}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 