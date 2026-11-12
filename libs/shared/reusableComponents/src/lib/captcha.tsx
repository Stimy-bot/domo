// client/src/components/Captcha.tsx
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { IoReloadOutline } from 'react-icons/io5';

interface CaptchaProps {
  onVerify: (isVerified: boolean) => void;
}

const generateCaptchaText = (length = 6) => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const getRandomColor = (min: number, max: number) => {
  const r = Math.floor(Math.random() * (max - min) + min);
  const g = Math.floor(Math.random() * (max - min) + min);
  const b = Math.floor(Math.random() * (max - min) + min);
  return `rgb(${r},${g},${b})`;
};

const Captcha: React.FC<CaptchaProps> = ({ onVerify }) => {
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Drawing logic separated from state updates to prevent loops
  const draw = useCallback((text: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and set background
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add random noise lines to confuse bots
    for (let i = 0; i < 6; i++) {
      ctx.strokeStyle = getRandomColor(150, 220);
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // Draw each character with random rotation and color
    const charArray = text.split('');
    const space = canvas.width / (charArray.length + 1);

    ctx.font = '60px arial';
    ctx.textBaseline = 'middle';

    charArray.forEach((char, i) => {
      const x = space * (i + 1);
      const y = canvas.height / 2 + (Math.random() * 10 - 5);
      const angle = (Math.random() * 40 - 20) * (Math.PI / 180); // -20 to 20 degrees

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = getRandomColor(0, 100); // Darker colors for the actual text
      ctx.fillText(char, -10, 0);
      ctx.restore();
    });

    // Add dot noise
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = getRandomColor(100, 200);
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  // Initialize text once
  useEffect(() => {
    const initialText = generateCaptchaText();
    setCaptchaText(initialText);
    draw(initialText);
  }, [draw]);

  const reloadCaptcha = () => {
    const newText = generateCaptchaText();
    setCaptchaText(newText);
    setUserInput('');
    setError('');
    draw(newText); // Redraw immediately with new text
  };

  const handleVerify = () => {
    if (userInput.toLowerCase() === captchaText.toLowerCase()) {
      setIsVerified(true);
      setError('');
      onVerify(true);
    } else {
      setError('Incorrect CAPTCHA. Please try again.');
      onVerify(false);
      reloadCaptcha();
    }
  };

  if (isVerified) {
    return (
      <div className='flex items-center justify-center p-4 bg-green-100 text-green-700 rounded-lg border border-green-200'>
        <span className='font-bold'>✓ Verified</span>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center dark:bg-dark-hard p-6 rounded-lg shadow-md border border-dark-soft text-dark-light mx-auto w-full max-w-87.5'>
      {/* Canvas and Reload Button Row */}
      <div className='flex flex-row items-center justify-between w-full mb-4'>
        <canvas
          ref={canvasRef}
          style={{ width: '400px', height: '50px' }} // Maintain CSS size
          className='rounded-lg border border-dark-soft bg-gray-100'
        />
        <button
          type='button'
          onClick={reloadCaptcha}
          className='flex flex-col items-center ml-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none text-sm transition-colors'
        >
          <IoReloadOutline />
        </button>
      </div>

      {/* Input Field */}
      <input
        type='text'
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder='Enter CAPTCHA'
        className='w-full p-3 border border-dark-soft rounded mb-3 focus:ring-2 focus:ring-blue-500 outline-none dark:bg-dark-hard dark:text-white'
      />

      {/* Verify Button */}
      <button
        type='button'
        onClick={handleVerify}
        className='w-full p-3 bg-green-500 text-white font-bold rounded hover:bg-green-600 transition-transform active:scale-95'
      >
        Verify
      </button>

      {error && <p className='text-red-500 mt-2 text-sm font-medium'>{error}</p>}
    </div>
  );
};

export { Captcha };
