import React from 'react';

const topics = [
  'Onboarding Resource',
  'Offboarding Resource',
  'GRM Tracker',
  'Invoice Verification',
  'Variance Analysis',
  'Tech Infrastructure Process',
  'Growth Catalyst',
  'On call & Shift Hours allowance process',
  'Leave Notification process',
];

export default function InfoPage({ onClose, onSend }) {
  const startChat = (topic) => {
    onSend(topic);   // 🔄 Use same flow as InputBox
    onClose();       // ✅ Close modal
  };

  return (
    <div className="flex flex-col items-center justify-center text-black dark:text-white">
      <h2 className="text-center font-semibold mb-2 text-xl">WELCOME!</h2>
      <p className="text-sm text-center mb-6 font-medium mt-2">
        I’m here to assist you with any professional queries or concerns you may have.
        Please ask me info about the topics below.
      </p>
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        {topics.map((topic, idx) => (
          <button
            key={idx}
            onClick={() => startChat(topic)}
            className="text-sm font-medium border border-black dark:border-white px-4 py-2 rounded-full hover:bg-fuchsia-600 hover:text-white transition-all duration-200"
          >
            {topic}
          </button>
        ))}
      </div>
    </div>
  );
}
