
import React from 'react';

export default function ProfilePage({ user = {}, onClose, onSignOut, theme }) {
  const name = user.username || "Jane Doe";
  const email = user.email || "jane.doe@example.com";
  const isDark = theme === 'dark';

  return (
    <>
      {/* Overlay */}
      <div className={`fixed inset-0 z-40 backdrop-blur-sm ${
        isDark ? 'bg-black/40' : 'bg-white/30'
      }`} />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className={`border rounded-xl shadow-xl p-6 w-fit max-w-4xl relative backdrop-blur-md transition ${
          isDark ? 'bg-zinc-900 text-white border-gray-700' : 'bg-white/70 text-black border-gray-300'
        }`}>
          {/* Close Button */}
          <button
            onClick={onClose}
            className={`fixed top-2 right-2 px-3 py-1 text-sm font-bold rounded border transition ${
              isDark
                ? 'border-white text-white hover:bg-fuchsia-600 hover:text-white'
                : 'border-black text-black hover:bg-fuchsia-600 hover:text-white'
            }`}
          >
            X
          </button>

          {/* Profile Content */}
          <div className="flex flex-col items-center">
            <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-fuchsia-400' : 'text-fuchsia-700'}`}>
              👤 User Profile
            </h2>
            <div className={`shadow-lg p-6 rounded-lg w-full max-w-md border ${
              isDark ? 'bg-zinc-800 border-gray-600 text-white' : 'bg-white border-gray-200 text-black'
            }`}>
              <p><strong>Name:</strong> {name}</p>
              <p><strong>Email:</strong> {email}</p>
              <p><strong>Role:</strong> Analyst</p>
              <p><strong>Joined:</strong> Jan 1, 2023</p>
              <p><strong>Preferences:</strong> Notifications Enabled</p>

              {onSignOut && (
                <button
                  onClick={onSignOut}
                  className="mt-4 w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
