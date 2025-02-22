
'use client'

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useOnOffRampContext } from '../context/OnOffRampContext';
// import { sendOTP } from '../utils/sendMail';

const VerifyStep = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  const { formData, setFormData} = useOnOffRampContext();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [isOtpGenerated, setIsOtpGenerated] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timeRemaining > 0 && isOtpGenerated) {
        setTimeRemaining((prevTime) => prevTime - 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining, isOtpGenerated]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setFormData((prev) => ({ ...prev, email: e.target.value }));
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async () => {
    // Simulate OTP verification
    if (otp === formData.otpCode) {
      onNext();
    } else {
      alert('Invalid OTP');
    }
  };

  
  const generateOtp = () => {
    if (!email) {
      alert('Please enter your email address');
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setFormData((prev) => ({ ...prev, otpCode: code }));
    console.log(`OTP sent: ${code}`);
    // sendOTP(email, code);
    setIsOtpGenerated(true);
  };


  

  return (
    <div className="md:p-6 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Step 3: Verify</h2>
      {!isOtpGenerated ? (
        <>
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
            Enter Email Address
          </label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            className="mb-4 bg-white"
          />
          <div className='flex justify-between mt-4'>
          <Button onClick={onBack} variant="outline">
              Back
          </Button>
          <Button onClick={generateOtp}>
            Generate OTP
          </Button>
          
          </div>
        </>
      ) : (
        <>
          <p>Code sent</p>
          <p>We sent you an OTP code to your email address {email}</p>
          <p>Time remaining: {timeRemaining}s</p>
          <label htmlFor="otp" className="block mb-2 text-sm font-medium text-gray-900">
            Enter OTP code
          </label>
          <Input
            type="text"
            id="otp"
            value={otp}
            onChange={handleOtpChange}
            className="mb-4 bg-white"
          />
          <div className="flex justify-between mt-4">
            <Button onClick={onBack} variant="outline">
              Back
            </Button>
            <Button onClick={handleSubmit}>
              Next: Verify OTP
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default VerifyStep;