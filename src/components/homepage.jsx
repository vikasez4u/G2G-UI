// import React from 'react';
// import InputBox from './inputbox';
// import { useState } from 'react';
// import ContactUs from './contactus';

// export default function HomePage({ onMoreInfo, setChatStarted, setMessages }) {
//   const [contactUs, showContactUs] = useState(false);

// const handleSend = (message) => {
//     setChatStarted(true);
//     setMessages((prev) => [
//       ...prev,
//       { sender: 'user', text: message },
//       { sender: 'bot', text: 'Waiting for reply...' },
//     ]);
//   };


// const handleContactButton = (value) => {
//   showContactUs(value);
// }


//   return (
//     <div>
//       {contactUs ? (
//         // console.log("Contact Us Page") 
//         // // Placeholder for contact us page
//         <ContactUs  />

//       ): (
//         <div className="flex flex-col justify-between h-full bg-gray-100">
//         <div className="flex flex-col items-center justify-center flex-1 px-6">
//           <h1 className="text-2xl font-bold  mt-40 mb-20">Hello! How May I help you?</h1>
//           <InputBox onSend={handleSend} isChatStarted={false} />
          
//           <div className="flex gap-4 mt-1 mb-6 ml-0 px-2 self-start">

//             <button
//               onClick={onMoreInfo}
//               className="border border-black px-6 py-3  text-lg font-medium hover:text-white hover:bg-fuchsia-600 "
//             >
//               More Info
//             </button>
//             <button onClick={() => handleContactButton(true)} className="border border-black px-6 py-3  text-lg font-medium  hover:text-white hover:bg-fuchsia-600">
//               Contact us
//             </button>
//           </div>
//         </div>
        
//       </div>
//       )}
//     </div>
    
//   );
// }

