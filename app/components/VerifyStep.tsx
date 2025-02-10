
'use client'

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useOnOffRampContext } from '../context/OnOffRampContext';

const VerifyStep = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  const { formData, setFormData} = useOnOffRampContext();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(60);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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

  useEffect(() => {
    // Simulate sending OTP code
    const generateOtp = () => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setFormData((prev) => ({ ...prev, otpCode: code }));
      console.log(`OTP sent: ${code}`);
    };

    generateOtp();
  }, []);

  

  return (
    <div className="verify-step p-6 rounded-lg shadow-md bg-gray-100">
      <h2 className="text-xl font-bold mb-4">Step 3: Verify</h2>
      <p>Code sent</p>
      <p>We sent you an OTP code to your email address {formData.email}</p>
      <p>Time remaining: {timeRemaining}s</p>
      <label htmlFor="otp" className="block mb-2 text-sm font-medium text-gray-900">
        Enter OTP code
      </label>
      <Input
        type="text"
        id="otp"
        value={otp}
        onChange={handleOtpChange}
        className="mb-4"
      />
      <div className="flex justify-between mt-4">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <Button onClick={handleSubmit}>
          Next: Verify OTP
        </Button>
      </div>
    </div>
  );
};

export default VerifyStep;