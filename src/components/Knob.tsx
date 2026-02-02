import { useRef, useEffect } from 'react';
import './Knob.css';

interface KnobProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

export function Knob({ label, value, min, max, onChange }: KnobProps) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const propsRef = useRef({ value, min, max, onChange });

  // Keep ref synchronized with props
  useEffect(() => {
    propsRef.current = { value, min, max, onChange };
  }, [value, min, max, onChange]);

  const stopChange = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    intervalRef.current = null;
    timeoutRef.current = null;
  };

  const startChange = (diff: number) => {
    stopChange();

    const update = () => {
      const { value, min, max, onChange } = propsRef.current;
      const newValue = value + diff;
      if (newValue >= min && newValue <= max) {
        onChange(newValue);
      }
    };

    update(); // Immediate update
    
    // Start repeating after delay
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(update, 80);
    }, 400);
  };

  // Cleanup on unmount
  useEffect(() => stopChange, []);

  return (
    <div className="stepper-container">
      <span className="stepper-label">{label}</span>
      <div className="stepper-control">
        <button 
          className="stepper-button minus" 
          onMouseDown={() => startChange(-1)}
          onMouseUp={stopChange}
          onMouseLeave={stopChange}
          onTouchStart={(e) => { e.preventDefault(); startChange(-1); }}
          onTouchEnd={stopChange}
          disabled={value <= min}
        >
          −
        </button>
        <div className="stepper-display">
          <span className="stepper-number">{value}</span>
        </div>
        <button 
          className="stepper-button plus" 
          onMouseDown={() => startChange(1)}
          onMouseUp={stopChange}
          onMouseLeave={stopChange}
          onTouchStart={(e) => { e.preventDefault(); startChange(1); }}
          onTouchEnd={stopChange}
          disabled={value >= max}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default Knob;
