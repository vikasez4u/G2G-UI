// Merged App.jsx combining signed-in logic, dark theme, and session handling

import React, { useState, useRef, useEffect } from 'react';
import Navbar from './components/navbar';
import InfoPage from './components/infopage';
import InputBox from './components/inputbox';
import ChatWindow from './components/chatwindow';
import Sidebar from './components/sidebar';
import ProfilePage from './components/profilepage';
import SettingsPage from './components/settingspage';
import HelpSupport from './components/helpsupport';
import SignIn from './components/signin';
import { v4 as uuidv4 } from 'uuid';
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { InteractionStatus, InteractionRequiredAuthError } from '@azure/msal-browser';
//import { loginRequest } from "./authConfig";

const url = import.meta.env.VITE_BASE_URL


export default function App() {
  const [showInfo, setShowInfo] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showContact, setShowContact] = useState(false);
  const [signedInUser, setSignedInUser] = useState(() => {
    const stored = localStorage.getItem('g2g_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [historyItems, setHistoryItems] = useState([]);
  const [sessions, setSessions] = useState({});
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const abortControllerRef = useRef(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [suggestions, setSuggestions] = useState([]);

  const isFirstRender = useRef(true);

  const { instance, inProgress, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [data, setData] = useState(null);

  const req = { 
      scopes: ["api://18bea863-348d-41f2-b82b-6162e1822bbb/user_impersonation"], 
      account: accounts[0] 
    };

   useEffect(() => {
  const fetchData = async () => {
    
    try {
      const resp = await instance.acquireTokenSilent(req);
      const res = await fetch(url + "/api/login", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resp.accessToken}`,
          "Content-Type": "application/json"
        }
      });
      const result = await res.json();
      console.log(result);
    } catch (e) {
      if (e instanceof InteractionRequiredAuthError) {
        instance.acquireTokenPopup(req).then(fetchData);
      } else {
        console.error(e);
      }
    }
  };

  fetchData();
}, [isAuthenticated, instance, accounts, inProgress]);

 /*useEffect(() => {
  const request = {
      scopes: ["api://18bea863-348d-41f2-b82b-6162e1822bbb/user_impersonation"],
      account: accounts[0],
    };

  if (isAuthenticated && inProgress === InteractionStatus.None) {
     instance.acquireTokenSilent(request).then(response => {
      setData(response.accessToken);
      const token = response.accessToken;
          return fetch(url +"/api/login", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}`,
          "Content-Type": "application/json" }
          });
    }).catch(error => {
      if (error instanceof InteractionRequiredAuthError) {  
        instance.acquireTokenRedirect(request);
      }
    });
  } else {
    instance.loginRedirect(loginRequest);
  }
}, [isAuthenticated, instance, accounts, inProgress]);*/

useEffect(() => {
  if (isFirstRender.current) {
    isFirstRender.current = false;
    return;
  }
  // Initialize MSAL instance and check authentication status
  if (isAuthenticated) {
    const user = accounts[0];
    setSignedInUser(user);
    console.log('User authenticated:', user);
    localStorage.setItem('g2g_user', JSON.stringify(user));
  }
  if (!isAuthenticated && signedInUser) {
    setSignedInUser(null);
    localStorage.removeItem('g2g_user');
    setHistoryItems([]);
    setSessions({});
    setMessages([]);
    setCurrentSessionId(null);
  } 
  // Initialize MSAL instance
  if (inProgress === InteractionStatus.None && accounts.length > 0) {
    instance.setActiveAccount(accounts[0]);
  }
  // If no accounts are found, redirect to login
  if (inProgress === InteractionStatus.None && accounts.length === 0) {
    instance.loginRedirect(req);
  }

  initializeAndLogin();
  document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
}, [inProgress, accounts, instance, theme]);

  /*useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]); */

  useEffect(() => {
    if (signedInUser) {
      // fetch(`https://g2g-be-c4gybve0aubchahv.eastasia-01.azurewebsites.net/get_history?email=${signedInUser.email}`)
      fetch(url + `/get_history?email=${signedInUser.username}`)

        .then(res => res.json())
        .then(data => {
          if (data.history) {
            setHistoryItems(data.history);
          }
        })
        .catch(err => console.error('Error fetching history:', err));
    } else {
      const savedHistory = localStorage.getItem('chatHistory');
      const savedSessions = localStorage.getItem('chatSessions');
      if (savedHistory) setHistoryItems(JSON.parse(savedHistory));
      if (savedSessions) setSessions(JSON.parse(savedSessions));
    }
  }, [signedInUser]);

  useEffect(() => {
    if (!signedInUser) {
      localStorage.setItem('chatHistory', JSON.stringify(historyItems));
      localStorage.setItem('chatSessions', JSON.stringify(sessions));
    }
  }, [historyItems, sessions, signedInUser]);

  const startNewSession = (firstMessage) => {
    const id = uuidv4();
    setCurrentSessionId(id);
    setSessions(prev => ({ ...prev, [id]: [{ sender: 'user', text: firstMessage }] }));
    return id;
  };

  const handleSend = async (message) => {
    setChatStarted(true);
    let sessionId = currentSessionId;
    const isNewSession = !sessionId;

    if (isNewSession) {
      sessionId = startNewSession(message);
      setCurrentSessionId(sessionId);
      if (signedInUser) {
        setHistoryItems(prev => [
          { session_id: sessionId, first_message: message },
          ...prev.filter(item => item.first_message !== message)
        ]);
      } else {
        setHistoryItems(prev => [message, ...prev.filter(item => item !== message)].slice(0, 8));
      }
    } else {
      setSessions(prev => ({
        ...prev,
        [sessionId]: [...(prev[sessionId] || []), { sender: 'user', text: message }],
      }));
      const firstMessage = sessions[sessionId]?.[0]?.text;
      if (signedInUser && firstMessage) {
        setHistoryItems(prev => [
          { session_id: sessionId, first_message: firstMessage },
          ...prev.filter(item => item.session_id !== sessionId)
        ]);
      } else if (firstMessage) {
        setHistoryItems(prev => [firstMessage, ...prev.filter(item => item !== firstMessage)].slice(0, 8));
      }
    }

    setMessages(prev => [...prev, { sender: 'user', text: message }, { sender: 'bot', text: '', loading: true }]);

    setIsGenerating(true);
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      // const res = await fetch('https://g2g-be-c4gybve0aubchahv.eastasia-01.azurewebsites.net/chat', {
      console.log(url + '/chat')
      const res = await fetch(url + '/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: message }),
        signal: controller.signal,
      });
      const data = await res.json();
      const botText = data.answer || data.response || 'No answer.';
      const image_ids = data.image_ids || [];
      const related_links = data.related_links || [];

      let displayed = '';
      const words = botText.split(' ');
      for (let i = 0; i < words.length; i++) {
        if (abortControllerRef.current.signal.aborted) throw new Error('aborted');
        displayed += (i > 0 ? ' ' : '') + words[i];
        await new Promise(resolve => setTimeout(resolve, 30));
        setMessages(prev => [...prev.slice(0, -1), { sender: 'bot', text: displayed, image_ids, related_links, loading: true }]);
      }

      const botMsg = { sender: 'bot', text: displayed, image_ids, related_links, loading: false };
      setMessages(prev => [...prev.slice(0, -1), botMsg]);
      setSessions(prev => ({ ...prev, [sessionId]: [...(prev[sessionId] || []), botMsg] }));

      if (signedInUser) {
        for (const msg of [...(sessions[sessionId] || []), { sender: 'user', text: message }, botMsg]) {
          // await fetch('https://g2g-be-c4gybve0aubchahv.eastasia-01.azurewebsites.net/save_message', {
          await fetch(url + '/save_message', {

            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              session_id: sessionId,
              email: signedInUser.email,
              sender: msg.sender,
              text: msg.text,
              created_at: new Date().toISOString(),
              image_ids: msg.image_ids || [],
              related_links: msg.related_links || [],
            }),
          });
        }
      }
    } catch (err) {
      const errorText = err.name === 'AbortError' || err.message === 'aborted' ? 'Response stopped' : 'Sorry, there was an error connecting to the server.';
      const errorMsg = { sender: 'bot', text: errorText, loading: false };
      setMessages(prev => [...prev.slice(0, -1), errorMsg]);
      setSessions(prev => ({ ...prev, [sessionId]: [...(prev[sessionId] || []), errorMsg] }));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    setIsGenerating(false);
  };

  const handleHomeClick = () => {
    setShowInfo(false);
    setChatStarted(false);
    setMessages([]);
    setShowContact(false);
    setShowProfile(false);
    setShowHelp(false);
    setShowSettings(false);
    setCurrentSessionId(null);
  };

  const handleHistoryClick = async (item) => {
    if (signedInUser) {
      const sessionId = item.session_id;
      setCurrentSessionId(sessionId);
      setChatStarted(true);
      // const res = await fetch('https://g2g-be-c4gybve0aubchahv.eastasia-01.azurewebsites.net/get_session', {
      const res = await fetch(url + '/get_session', {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, email: signedInUser.email }),
      });
      const data = await res.json();
      setMessages(data.messages);
      setSessions(prev => ({ ...prev, [sessionId]: data.messages }));
    } else {
      const session = Object.entries(sessions).find(([, msgs]) => msgs[0]?.text === item);
      if (session) {
        setCurrentSessionId(session[0]);
        setMessages(session[1]);
        setChatStarted(true);
      }
    }
  };

  return (
    <div className={`h-screen w-screen overflow-x-hidden font-sans flex flex-col relative ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <Navbar
        signedInUser={signedInUser}
        theme={theme}
        onSignInClick={() => setShowSignIn(true)}
        onProfileClick={() => {
          if (!signedInUser) setShowSignIn(true);
          else {
            setShowProfile(true);
            setChatStarted(false);
            setShowContact(false);
            setShowInfo(false);
            setShowSettings(false);

          }
        }}
      />

      <div className="flex flex-1">
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          onHomeClick={handleHomeClick}
          theme={theme}
          onProfileClick={() => {
            if (!signedInUser) setShowSignIn(true);
            else {
              setShowProfile(true);
              setChatStarted(false);
              setShowContact(false);
              setShowInfo(false);
              setShowSettings(false);
            }
          }}
          onSettingsClick={() => {
            setShowSettings(true);
            setShowProfile(false);
            setShowContact(false);
            setShowInfo(false);
            setChatStarted(false);
          }}
          setShowHelp={setShowHelp}
          historyItems={historyItems}
          sessions={sessions}
          currentSessionId={currentSessionId}
          onHistoryClick={handleHistoryClick}
        />

        <div className={`transition-all duration-300 flex flex-col flex-1 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
          {showProfile && signedInUser && (
            <ProfilePage
              user={signedInUser}
              onClose={() => setShowProfile(false)}
              onSignOut={() => {
                setSignedInUser(null);
                localStorage.removeItem('g2g_user');
                setHistoryItems([]);
                setSessions({});
                setMessages([]);
                setCurrentSessionId(null);
                setShowProfile(false);
              }}
            />
          )}
          {showSettings && <SettingsPage onClose={() => setShowSettings(false)} theme={theme} setTheme={setTheme} />}

          {!chatStarted ? (
            <div className="flex flex-col flex-1 px-6 pt-12 relative justify-end">
              <div className="w-full max-w-2xl mx-auto mb-0">
                <h1 className="text-3xl font-bold text-center mb-0">Hello! How may I help you?</h1>
              </div>
              <div className="w-full max-w-2xl mx-auto pb-25">
                <InputBox onSend={handleSend} onStop={handleStop} isGenerating={isGenerating} isChatStarted={false} theme={theme} />
                <div className="flex gap-4 mt-2 justify-left">
                  <button onClick={() => setShowInfo(true)} className="border border-gray-300 px-2.5 py-2.5 text-md font-medium hover:text-white hover:bg-fuchsia-600 rounded-lg">Browse Topics</button>
                </div>
              </div>
              {/* {showInfo && (
                <>
                  <div className="absolute inset-0 bg-white/20 backdrop-blur-sm z-40" />
                  <div className="absolute left-6 top-10 z-50">
                    <div className="backdrop-blur-md bg-white/70 border border-gray-300 rounded-xl shadow-xl p-6 w-fit max-w-4xl relative">
                      <button onClick={() => setShowInfo(false)} className="absolute top-2 right-2 border border-black px-3 py-1 text-sm font-bold hover:bg-fuchsia-600 hover:text-white">X</button>
                      <InfoPage onClose={() => setShowInfo(false)} onSend={handleSend} />
                    </div>
                  </div>
                </>
              )} */}
            </div>
          ) : (
            <>
              <ChatWindow messages={messages} isSidebarOpen={isSidebarOpen} onSend={handleSend} setSuggestions={setSuggestions} theme={theme} />
              <div className={`p-4 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
                {/* <InputBox onSend={handleSend} onStop={handleStop} isGenerating={isGenerating} isChatStarted={true} theme={theme} /> */}
                <InputBox onSend={handleSend} onStop={handleStop} isGenerating={isGenerating} isChatStarted={true} theme={theme} />
                <div className="flex gap-4 mt-2 justify-left">
                  <button
                    onClick={() => setShowInfo(true)}
                    className="border border-gray-300 px-2.5 py-2.5 text-md font-medium hover:text-white hover:bg-fuchsia-600 rounded-lg"
                  >
                    Browse Topics
                  </button>
                </div>
              </div>
            </>
          )}

          {showHelp && (
            <>
              <div className="fixed inset-0 bg-white/20 dark:bg-black/40 backdrop-blur-sm z-40" />
              <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                <div className="backdrop-blur-md bg-white/70 dark:bg-zinc-900/80 border border-gray-300 dark:border-gray-600 rounded-xl shadow-xl p-6 w-fit max-w-4xl relative text-black dark:text-white">
                  <button onClick={() => setShowHelp(false)} className="absolute top-2 right-2 border border-black dark:border-white px-3 py-1 text-sm font-bold hover:bg-fuchsia-600 hover:text-white">X</button>
                  <HelpSupport onClose={() => setShowHelp(false)} />
                </div>
              </div>
            </>
          )}

          {showSignIn && (
            <SignIn
              onClose={() => setShowSignIn(false)}
              onSignedIn={(user) => {
                setSignedInUser(user);
                localStorage.setItem('g2g_user', JSON.stringify(user));
                localStorage.removeItem('chatHistory');
                localStorage.removeItem('chatSessions');
                setShowSignIn(false);
              }}
            />
          )}
        </div>
      </div>
      {showInfo && (
        <>
          <div className="fixed inset-0 bg-white/20 dark:bg-black/40 backdrop-blur-sm z-40" />
          <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="backdrop-blur-md bg-white/70 dark:bg-zinc-900/80 border border-gray-300 dark:border-gray-600 rounded-xl shadow-xl p-6 w-fit max-w-4xl relative text-black dark:text-white">
              <button
                onClick={() => setShowInfo(false)}
                className="absolute top-2 right-2 border border-black dark:border-white px-3 py-1 text-sm font-bold hover:bg-fuchsia-600 hover:text-white"
              >
                X
              </button>
              <InfoPage onClose={() => setShowInfo(false)} onSend={handleSend} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}