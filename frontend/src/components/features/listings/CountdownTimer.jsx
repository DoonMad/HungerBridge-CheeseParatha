import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const CountdownTimer = ({ expiresAt }) => {
  const calculateTimeLeft = () => {
    const difference = new Date(expiresAt) - new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  const isExpiringSoon = timeLeft.hours === 0 && timeLeft.minutes < 30;
  const hasExpired = Object.keys(timeLeft).length === 0;

  if (hasExpired) {
    return (
      <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
        <Clock size={16} />
        <span>Expired</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-lg transition-colors duration-300 ${
        isExpiringSoon
          ? 'text-rose-600 bg-rose-50 border border-rose-200 animate-pulse'
          : 'text-amber-600 bg-amber-50 border border-amber-200'
      }`}
    >
      <Clock size={16} className={isExpiringSoon ? 'animate-bounce' : ''} />
      <span className="tabular-nums">
        {String(timeLeft.hours).padStart(2, '0')}:
        {String(timeLeft.minutes).padStart(2, '0')}:
        {String(timeLeft.seconds).padStart(2, '0')}
      </span>
    </div>
  );
};

export default CountdownTimer;
