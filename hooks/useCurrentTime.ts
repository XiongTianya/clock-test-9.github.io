import { useState, useEffect } from 'react';

export const useCurrentTime = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = requestAnimationFrame(updateTime);
    let animationFrameId: number;

    function updateTime() {
      setTime(new Date());
      animationFrameId = requestAnimationFrame(updateTime);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return time;
};