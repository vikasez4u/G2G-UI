// import React from 'react';
// import { User } from 'lucide-react';

// export default function Navbar({ signedInUser, onSignInClick, onProfileClick }) {
//   return (
//     <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-white shadow-sm">
//       <h1 className="text-xl font-bold text-fuchsia-700">Guide2Govern</h1>

//       <div className="flex items-center gap-4">
//         {!signedInUser ? (
//           <button
//             onClick={onSignInClick}
//             className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition"
//           >
//             Sign In
//           </button>
//         ) : (
//           <button
//             onClick={onProfileClick}
//             className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:ring-2 hover:ring-fuchsia-500 transition"
//             title="Profile"
//           >
//             <User className="w-5 h-5 text-fuchsia-700" />
//           </button>
//         )}
//       </div>
//     </nav>
//   );
// }


import React from 'react';
import { User } from 'lucide-react';

export default function Navbar({ signedInUser, onSignInClick, onProfileClick, theme }) {
  const isDark = theme === 'dark';

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-4 border-b shadow-sm ${
        isDark
          ? 'bg-black border-gray-700 text-white'
          : 'bg-white border-gray-200 text-black'
      }`}
    >
      <h1 className={`text-xl font-bold ${isDark ? 'text-fuchsia-400' : 'text-fuchsia-700'}`}>
        Guide2Govern
      </h1>

      <div className="flex items-center gap-4">
        {!signedInUser ? (
          <button
            onClick={onSignInClick}
            className={`px-4 py-2 rounded-lg transition ${
              isDark
                ? 'bg-fuchsia-600 text-white hover:bg-fuchsia-500'
                : 'bg-fuchsia-600 text-white hover:bg-fuchsia-700'
            }`}
          >
            Sign In
          </button>
        ) : (
          <button
            onClick={onProfileClick}
            className={`w-10 h-10 flex items-center justify-center rounded-full border transition ${
              isDark
                ? 'border-gray-600 hover:ring-2 hover:ring-fuchsia-400'
                : 'border-gray-300 hover:ring-2 hover:ring-fuchsia-500'
            }`}
            title="Profile"
          >
            <User className={`w-5 h-5 ${isDark ? 'text-fuchsia-400' : 'text-fuchsia-700'}`} />
          </button>
        )}
      </div>
    </nav>
  );
}
