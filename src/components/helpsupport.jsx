import React, { useState } from 'react';
// import InputBox from './inputbox';
// import ChatWindow from './chatwindow';

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

export default function ContactUs() {



    return (
      <>
        <div className="flex flex-col justify-center h-full bg-gray-50 px-4">
          <h1 className="flex flex-col text-center text-3xl  font-bold mt-10  underline text-fuchsia-700 mb-5">Contact Us</h1>
        </div>
        <div className="flex flex-col justify-between h-full bg-gray-50 px-4">
          <h1 className="font-bold mb-5"> Please Contact following email for any queries or concerns you may have.</h1>
          <ul className="list-disc pl-5 mb-5">
                <li>abc@accenture.com</li>
                <li>def@accenture.com</li>
            </ul>
        </div>
      </>
    );
  }
