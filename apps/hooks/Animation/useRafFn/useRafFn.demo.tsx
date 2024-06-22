'use client';

import { useState } from 'react';
import useRafFn from './useRafFn';
import { Button } from '@/components/ui/button';

const RafDemo = () => {
  const [count, setCount] = useState(0);
  const [delta, setDelta] = useState(0);

  const { pause, resume, isActive } = useRafFn(
    ({ delta: frameDelta }) => {
      setCount((prevCount) => prevCount + 1);
      setDelta(frameDelta);
    },
    { fpsLimit: 60 },
  );

  return (
    <div className="border rounded-lg p-[2em] relative mb-[10px] transition-colors">
      <p>
        <strong>Frames: </strong>
        {count}
      </p>
      <p>
        <strong>Delta:</strong> {Math.round(delta)}ms
      </p>
      <p>
        <strong>FPS Limit:</strong> {60}
      </p>
      <div className="flex gap-3">
        <Button onClick={pause}>Pause</Button>
        <Button onClick={resume}>Resume</Button>
      </div>
    </div>
  );
};

export default RafDemo;
