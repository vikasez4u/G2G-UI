import React, { useEffect } from "react";
import {
  MessageCircle,
  Settings,
  User,
  Clock,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Sidebar = ({
  isOpen,
  setIsOpen,
  onProfileClick,
  setShowHelp,
  onSettingsClick,
  onHomeClick,
  historyItems = [],
  sessions = {},
  currentSessionId,
  onHistoryClick,
  isGenerating,
  onStop,
  theme,
}) => {
  const isDark = theme === 'dark';

  const menuItems = [
    { icon: <MessageCircle size={20} />, label: "New Chat", action: onHomeClick },
    // { icon: <User size={20} />, label: "Profile", action: onProfileClick },
    { icon: <Settings size={20} />, label: "Settings", action: onSettingsClick },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsOpen]);

  const handleHistoryClick = async (item) => {
    if (isGenerating && typeof onStop === "function") {
      onStop();
      await new Promise((res) => setTimeout(res, 100));
    }
    onHistoryClick?.(item);
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed top-[55px] left-2 z-50 p-2 rounded shadow transition ${
            isDark ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-white text-black hover:bg-fuchsia-100'
          }`}
          aria-label="Open sidebar"
          title="Open menu"
        >
          <ChevronRight size={20} />
        </button>
      )}

      {isOpen && (
        <div className={`fixed top-0 left-0 pt-14 h-screen w-64 z-10 flex flex-col transition-all duration-300 shadow-md ${
          isDark ? 'bg-zinc-800 text-zinc-100' : 'bg-gray-100 text-black'
        }`}>
          <div className="px-6 py-4 overflow-y-auto flex-1">
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setIsOpen(false)}
                className={`transition ${
                  isDark ? 'text-white hover:text-fuchsia-400' : 'text-black hover:text-fuchsia-600'
                }`}
                aria-label="Close sidebar"
              >
                <ChevronLeft
                  className={`fixed top mr-0 mt-1 mb-1 rounded shadow ${
                    isDark ? 'bg-zinc-800' : 'bg-white'
                  } hover:bg-fuchsia-100 transition`}
                  size={25}
                />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-4 mt-10" aria-label="Main navigation">
              {menuItems.map((item, idx) => (
                <div
                  key={idx}
                  onClick={item.action}
                  className={`flex items-center gap-3 cursor-pointer transition-all duration-200 ${
                    isDark ? 'hover:text-fuchsia-400' : 'hover:text-fuchsia-600'
                  }`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && item.action?.()}
                  title={item.label}
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              ))}

              {/* History */}
              <div className="mt-6">
                <div className="flex items-center gap-3 text-sm font-semibold mb-2">
                  <Clock size={20} />
                  <span>History</span>
                </div>
                <ul className="pl-8 text-sm space-y-1 max-h-70 overflow-y-auto">
                  {historyItems.length > 0 ? (
                    historyItems.map((item, index) => {
                      let label, sessionId;
                      if (typeof item === "string") {
                        label = item;
                        sessionId = Object.entries(sessions).find(
                          ([, messages]) =>
                            Array.isArray(messages) &&
                            messages[0] &&
                            messages[0].text === item
                        )?.[0];
                      } else if (item && typeof item === "object") {
                        label = item.first_message;
                        sessionId = item.session_id;
                      }
                      const isActive = sessionId && sessionId === currentSessionId;

                      return (
                        <li
                          key={sessionId || label || index}
                          onClick={() => handleHistoryClick(item)}
                          className={`cursor-pointer truncate px-2 py-1 rounded transition ${
                            isDark
                              ? isActive
                                ? 'bg-zinc-700 text-white'
                                : 'hover:text-fuchsia-400'
                              : isActive
                              ? 'bg-gray-300 text-black'
                              : 'hover:text-fuchsia-600'
                          }`}
                          title={label}
                        >
                          {label}
                        </li>
                      );
                    })
                  ) : (
                    <li className={`italic ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      No recent chats
                    </li>
                  )}
                </ul>
              </div>
            </nav>
          </div>

          {/* Footer */}
          <div className={`px-6 py-4 ${isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-gray-200 text-black'}`}>
            <div
              className={`flex items-center gap-3 text-sm font-semibold cursor-pointer transition ${
                isDark ? 'hover:text-fuchsia-400' : 'hover:text-fuchsia-600'
              }`}
              onClick={() => setShowHelp(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setShowHelp(true)}
              title="Open Help & Support"
            >
              <HelpCircle size={20} />
              <span>Help & Support</span>
            </div>
            <div className="text-xs ml-7 mt-1">
              <p>&copy; 2025 G2G Inc.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
