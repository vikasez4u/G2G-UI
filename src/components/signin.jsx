// // import React, { useState } from 'react';

// // export default function SignInModal({ onClose,onSignedIn }) {
// //   const [username, setUsername] = useState('');
// //   const [email, setEmail] = useState('');
// //   const [error, setError] = useState('');

// //  const handleSignIn = async () => {
// //   if (!username || !email) {
// //     setError('Both fields are required.');
// //     return;
// //   }

// //   try {
// //     const res = await fetch('http://127.0.0.1:8000/signin', {
// //       method: 'POST',
// //       headers: { 'Content-Type': 'application/json' },
// //       body: JSON.stringify({ username, email }),
// //     });

// //     const data = await res.json();
// //     if (!res.ok) {
// //       throw new Error(data.detail || 'Sign-in failed.');
// //     }

// //     // ✅ Save to localStorage for tracking login
// //     const user = { username, email };
// //     localStorage.setItem('g2g_user', JSON.stringify(user));
// //     onSignedIn(user);
// //   } catch (err) {
// //     setError(err.message);
// //   }
// // };


// //   return (
// //     <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
// //       <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-200">
// //         <h2 className="text-xl font-semibold text-center mb-4">Sign In</h2>
// //         <div className="space-y-4">
// //           <input
// //             className="w-full border p-2 rounded"
// //             placeholder="Username"
// //             value={username}
// //             onChange={(e) => setUsername(e.target.value)}
// //           />
// //           <input
// //             className="w-full border p-2 rounded"
// //             placeholder="Email"
// //             type="email"
// //             value={email}
// //             onChange={(e) => setEmail(e.target.value)}
// //           />
// //           {error && <p className="text-red-500 text-sm">{error}</p>}
// //           <div className="flex justify-between mt-4">
// //             <button
// //               onClick={onClose}
// //               className="px-4 py-2 border rounded hover:bg-gray-100"
// //             >
// //               Cancel
// //             </button>
// //             <button
// //               onClick={handleSignIn}
// //               className="px-4 py-2 bg-fuchsia-600 text-white rounded hover:bg-fuchsia-700"
// //             >
// //               Sign In
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }


// import React, { useState } from 'react';

// const url=import.meta.env.VITE_BASE_URL

// export default function SignInModal({ onClose, onSignedIn, theme }) {
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [error, setError] = useState('');

//   const isDark = theme === 'dark';

//   const handleSignIn = async () => {
//     if (!username || !email) {
//       setError('Both fields are required.');
//       return;
//     }

//     try {
//       const res = await fetch(url+'/signin', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username, email }),
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         throw new Error(data.detail || 'Sign-in failed.');
//       }

//       const user = { username, email };
//       localStorage.setItem('g2g_user', JSON.stringify(user));
//       onSignedIn(user);
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/30">
//       <div className={`rounded-2xl p-6 w-full max-w-md shadow-xl border transition ${
//         isDark
//           ? 'bg-zinc-900 text-white border-gray-700'
//           : 'bg-white text-black border-gray-200'
//       }`}>
//         <h2 className={`text-xl font-semibold text-center mb-4 ${
//           isDark ? 'text-fuchsia-400' : 'text-fuchsia-700'
//         }`}>
//           Sign In
//         </h2>
//         <div className="space-y-4">
//           <input
//             className={`w-full p-2 rounded border transition ${
//               isDark
//                 ? 'bg-zinc-800 text-white border-gray-600 placeholder-gray-400'
//                 : 'bg-white text-black border-gray-300 placeholder-gray-500'
//             }`}
//             placeholder="Username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//           />
//           <input
//             className={`w-full p-2 rounded border transition ${
//               isDark
//                 ? 'bg-zinc-800 text-white border-gray-600 placeholder-gray-400'
//                 : 'bg-white text-black border-gray-300 placeholder-gray-500'
//             }`}
//             placeholder="Email"
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           {error && <p className="text-red-500 text-sm">{error}</p>}
//           <div className="flex justify-between mt-4">
//             <button
//               onClick={onClose}
//               className={`px-4 py-2 border rounded transition ${
//                 isDark
//                   ? 'border-white text-white hover:bg-zinc-700'
//                   : 'border-black text-black hover:bg-gray-100'
//               }`}
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleSignIn}
//               className="px-4 py-2 bg-fuchsia-600 text-white rounded hover:bg-fuchsia-700 transition"
//             >
//               Sign In
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
