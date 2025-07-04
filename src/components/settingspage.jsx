// import React, { useState } from 'react';

// export default function SettingsPage({ onClose, theme, setTheme }) {
//   const [language, setLanguage] = useState('en');

//   const handleThemeChange = (e) => {
//     const newTheme = e.target.value;
//     setTheme(newTheme);
//     document.documentElement.classList.toggle('dark', newTheme === 'dark');
//     localStorage.setItem('theme', newTheme);
//   };

//   return (
//     <>
//       <div className="absolute inset-0 bg-white/30 dark:bg-black/30 backdrop-blur-sm z-40" />
//       <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
//         <div className="bg-white dark:bg-gray-900 shadow-xl border border-gray-300 dark:border-gray-700 rounded-2xl p-10 w-[600px] max-w-full relative text-black dark:text-white">
//           <button
//             onClick={onClose}
//             className="absolute top-4 right-4 border border-black dark:border-white px-3 py-1 text-sm font-bold hover:bg-fuchsia-600 hover:text-white rounded"
//           >
//             X
//           </button>
//           <h2 className="text-3xl font-bold text-center mb-8 text-fuchsia-700 dark:text-fuchsia-400 underline">
//             Settings
//           </h2>

//           <div className="space-y-6">
//             {/* Theme Selector */}
//             <div>
//               <label className="block text-lg font-semibold mb-2">Theme</label>
//               <select
//                 value={theme}
//                 onChange={handleThemeChange}
//                 className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
//               >
//                 <option value="light">Light</option>
//                 <option value="dark">Dark</option>
//               </select>
//             </div>

//             {/* Language Selector */}
//             <div>
//               <label className="block text-lg font-semibold mb-2">Language (for LLM)</label>
//               <select
//                 value={language}
//                 onChange={(e) => setLanguage(e.target.value)}
//                 className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
//               >
//                 <option value="en">English</option>
//                 <option value="es">Spanish</option>
//                 <option value="fr">French</option>
//                 <option value="de">German</option>
//                 <option value="hi">Hindi</option>
//                 <option value="zh">Chinese</option>
//               </select>
//             </div>

//             {/* Account Section */}
//             {/* <div>
//               <label className="block text-lg font-semibold mb-2">Account</label>
//               <button
//                 onClick={() => {
//                   onClose();
//                   document.dispatchEvent(new CustomEvent('go-to-profile'));
//                 }}
//                 className="px-4 py-2 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700"
//               >
//                 View Profile
//               </button>
//             </div> */}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

import React, { useState } from 'react';

export default function SettingsPage({ onClose, theme, setTheme }) {
  const [language, setLanguage] = useState('en');
  const isDark = theme === 'dark';

  const handleThemeChange = (e) => {
    const newTheme = e.target.value;
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark'); // Optional if you use Tailwind dark mode elsewhere
    localStorage.setItem('theme', newTheme);
  };

  return (
    <>
      {/* Overlay */}
      <div className={`absolute inset-0 z-40 backdrop-blur-sm ${isDark ? 'bg-black/10' : 'bg-white/30'}`} />

      {/* Modal */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        <div className={`shadow-xl border rounded-2xl p-10 w-[600px] max-w-full relative ${isDark ? 'bg-zinc-900 text-white border-gray-700' : 'bg-white text-black border-gray-300'}`}>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 px-3 py-1 text-sm font-bold rounded border transition ${
              isDark ? 'border-white hover:bg-fuchsia-600 hover:text-white' : 'border-black hover:bg-fuchsia-600 hover:text-white'
            }`}
          >
            X
          </button>

          {/* Title */}
          <h2 className={`text-3xl font-bold text-center mb-8 underline ${
            isDark ? 'text-fuchsia-400' : 'text-fuchsia-700'
          }`}>
            Settings
          </h2>

          <div className="space-y-6">
            {/* Theme Selector */}
            <div>
              <label className="block text-lg font-semibold mb-2">Theme</label>
              <select
                value={theme}
                onChange={handleThemeChange}
                className={`w-full p-2 border rounded-md ${isDark ? 'bg-zinc-800 text-white border-gray-600' : 'bg-white text-black border-gray-300'}`}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            {/* Language Selector */}
            <div>
              <label className="block text-lg font-semibold mb-2">Language (for LLM)</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={`w-full p-2 border rounded-md ${isDark ? 'bg-zinc-800 text-white border-gray-600' : 'bg-white text-black border-gray-300'}`}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="hi">Hindi</option>
                <option value="zh">Chinese</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
