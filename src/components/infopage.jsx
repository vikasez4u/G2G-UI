// import React from 'react';

// const topics = [
//   'Onboarding Resource',
//   'Offboarding Resource',
//   'GRM Tracker',
//   'Invoice Verification',
//   'Variance Analysis',
//   'Tech Infrastructure Process',
//   'Growth Catalyst',
//   'On call & Shift Hours allowance process',
//   'Leave Notification process',
// ];

// export default function InfoPage({ onClose, onSend }) {
//   const startChat = (topic) => {
//     onSend(topic);   // 🔄 Use same flow as InputBox
//     onClose();       // ✅ Close modal
//   };

//   return (
//     <div className="flex flex-col items-center justify-center text-black dark:text-white">
//       <h2 className="text-center font-semibold mb-2 text-xl">WELCOME!</h2>
//       <p className="text-sm text-center mb-6 font-medium mt-2">
//         I’m here to assist you with any professional queries or concerns you may have.
//         Please ask me info about the topics below.
//       </p>
//       <div className="flex flex-wrap justify-center gap-3 mt-4">
//         {topics.map((topic, idx) => (
//           <button
//             key={idx}
//             onClick={() => startChat(topic)}
//             className="text-sm font-medium border border-black dark:border-white px-4 py-2 rounded-full hover:bg-fuchsia-600 hover:text-white transition-all duration-200"
//           >
//             {topic}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }

import React, { useState } from 'react';

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
  // ...add more topics as needed
];

export default function InfoPage({ onClose, onSend }) {
  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState('');
  const visibleCount = 5;

  // Filter topics based on search
  const filteredTopics = topics.filter(topic =>
    topic.toLowerCase().includes(search.toLowerCase())
  );
  const visibleTopics = expanded ? filteredTopics : filteredTopics.slice(0, visibleCount);

  const startChat = (topic) => {
    onSend(topic);
    onClose();
  };

  return (
    <div className="flex flex-col items-center justify-center text-black dark:text-white">
      <h2 className="text-center font-semibold mb-2 text-xl">WELCOME!</h2>
      <p className="text-sm text-center mb-6 font-medium mt-2">
        I’m here to assist you with any professional queries or concerns you may have.
        Please ask me info about the topics below.
      </p>
      <div className="relative mb-3 w-full flex justify-center">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search processes..."
          className="pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded w-[28rem] bg-white dark:bg-zinc-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
        />
        <span className="absolute left-8 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
          {/* Heroicons solid magnifying glass */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none"/>
            <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </span>
      </div>
      <div
        className="flex flex-col gap-3 w-[32rem] max-h-72 overflow-y-auto border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-zinc-900"
        style={{ minHeight: '220px' }}
      >
        {visibleTopics.length === 0 ? (
          <div className="text-center text-gray-400">No topics found.</div>
        ) : (
          visibleTopics.map((topic, idx) => (
            <button
              key={idx}
              onClick={() => startChat(topic)}
              className="text-sm font-medium border border-black dark:border-white px-4 py-2 rounded hover:bg-fuchsia-600 hover:text-white transition-all duration-200 text-left"
            >
              {topic}
            </button>
          ))
        )}
        {filteredTopics.length > visibleCount && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center justify-center text-fuchsia-600 hover:underline mt-2"
          >
            {expanded ? (
              <>
                View Less <span className="ml-1">▲</span>
              </>
            ) : (
              <>
                View More <span className="ml-1">▼</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}