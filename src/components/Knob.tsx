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
      intervalRef.current = setInterval(update, 150); // Slower repeat for better control
    }, 500); // Longer delay to prevent accidental repeats
  };

  // Cleanup on unmount
  useEffect(() => stopChange, []);

  const handlePointerDown = (e: React.PointerEvent, diff: number) => {
    // Only handle primary button (left click) for mouse
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    
    // Prevent default to stop focus/scrolling issues
    // and stop potential ghost clicks
    if (e.cancelable) {
      // e.preventDefault(); // Note: preventDefault on pointerdown might stop focus, which is fine
    }
    
    startChange(diff);
  };

  return (
    <div className="stepper-container">
      <span className="stepper-label">{label}</span>
      <div className="stepper-control">
        <button 
          className="stepper-button minus" 
          onPointerDown={(e) => handlePointerDown(e, -1)}
          onPointerUp={stopChange}
          onPointerLeave={stopChange}
          onPointerCancel={stopChange}
          type="button"
          style={{ touchAction: 'none' }}
          disabled={value <= min}
        >
          −
        </button>
        <div className="stepper-display">
          <span className="stepper-number">{value}</span>
        </div>
        <button 
          className="stepper-button plus" 
          onPointerDown={(e) => handlePointerDown(e, 1)}
          onPointerUp={stopChange}
          onPointerLeave={stopChange}
          onPointerCancel={stopChange}
          type="button"
          style={{ touchAction: 'none' }}
          disabled={value >= max}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default Knob;
