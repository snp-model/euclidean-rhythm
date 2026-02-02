/**
 * Euclidean Rhythm Generator using Bjorklund's algorithm
 * Generates evenly distributed rhythmic patterns
 */

/**
 * Generates a Euclidean rhythm pattern
 * @param pulses - Number of active steps (onsets/hits)
 * @param steps - Total number of steps in the sequence
 * @param rotation - Optional rotation offset (default 0)
 * @returns Array of 1s (pulse) and 0s (silence)
 */
export function euclidean(pulses: number, steps: number, rotation: number = 0): number[] {
  if (steps <= 0) return [];
  if (pulses <= 0) return Array(steps).fill(0);
  if (pulses >= steps) return Array(steps).fill(1);

  // Initialize groups: pulses as [1], rests as [0]
  let head = new Array(pulses).fill(0).map(() => [1]);
  let tail = new Array(steps - pulses).fill(0).map(() => [0]);

  while (tail.length > 0 && head.length > 0) {
    // Distribute tail into head
    const count = Math.min(head.length, tail.length);
    
    // Create new merged heads
    const newHead = [];
    for (let i = 0; i < count; i++) {
        newHead.push(head[i].concat(tail.shift()!));
    }

    // Determine new head and tail for next iteration
    const remainingHead = head.slice(count); // Elements of head that weren't merged
    
    if (remainingHead.length > 0) {
        // Head was larger: remaining heads become the new tail
        head = newHead;
        tail = remainingHead;
    } else {
        // Tail was larger (or equal): remaining tail stays as tail
        head = newHead;
        // tail is already updated (shifted elements removed)
    }
    
    // Stop condition usually unnecessary if loop logic is correct,
    // but just to be safe / follow standard behavior:
    // If we only have 1 tail element left, we might distribute it, but usually the visual patterns look fine.
    // However, rigorous algorithm continues until tail is empty or logic dictates.
    // The explicit swap of remainingHead -> tail ensures we continue refining.
  }

  // Flatten final groups
  let pattern = head.concat(tail).flat();

  // Apply rotation
  if (rotation !== 0) {
    const normalizedRotation = ((rotation % steps) + steps) % steps;
    // Rotate right by normalizedRotation (move end to start)
    // Actually standard definition: rotation K means shift pattern right by K?
    // Let's assume standard right shift.
    const splitIdx = steps - normalizedRotation;
    pattern = [...pattern.slice(splitIdx), ...pattern.slice(0, splitIdx)];
  }

  return pattern;
}

/**
 * Converts a pattern array to a bitmask integer (for Cmajor)
 * @param pattern - Array of 0s and 1s
 * @returns Integer bitmask
 */
export function patternToBitmask(pattern: number[]): number {
  return pattern.reduce((mask, bit, index) => mask | (bit << index), 0);
}

/**
 * Converts a bitmask integer to a pattern array
 * @param bitmask - Integer bitmask
 * @param steps - Number of steps
 * @returns Array of 0s and 1s
 */
export function bitmaskToPattern(bitmask: number, steps: number): number[] {
  const pattern: number[] = [];
  for (let i = 0; i < steps; i++) {
    pattern.push((bitmask >> i) & 1);
  }
  return pattern;
}

export default euclidean;
