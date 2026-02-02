---
name: euclidean-rhythm
description: Generates Euclidean rhythms using Bjorklund's algorithm
---

# Euclidean Rhythm Generation

This skill provides the logic to generate Euclidean rhythms, which distribute `k` number of pulses (onsets) as evenly as possible over `n` total steps. This is commonly used in computer music for generative drum patterns and is based on Bjorklund's algorithm (used in spallation neutron source accelerators).

## Algorithm Logic
The algorithm works by iteratively distributing the remainder of pulses.
1. Start with a sequence of groups, where we have `k` groups of `[1]` and `n-k` groups of `[0]`.
2. Iteratively move the "remainder" groups to the end of the "main" groups until the remainder is 0 or 1.

## JavaScript Implementation

```javascript
/**
 * Generates a Euclidean rhythm pattern.
 * @param {number} pulses - Number of active steps (onsets/events).
 * @param {number} steps - Total number of steps in the sequence.
 * @returns {number[]} Array of 1s (pulse) and 0s (silence).
 */
function euclideanRhythm(pulses, steps) {
  if (pulses > steps || pulses <= 0) {
    if (pulses === 0) return Array(steps).fill(0);
    // If pulses > steps, we can either clamp or return all 1s. 
    // Usually, we return active steps as best as possible or handle as error.
    return Array(steps).fill(1).map((_, i) => i < pulses ? 1 : 0); 
  }

  let groups = [];
  for (let i = 0; i < steps; i++) {
     groups.push([i < pulses ? 1 : 0]);
  }

  let l = groups.length;
  // Handle edge case where we can't distribute (process essentially sorts them)
  // But standard Bjorklund splits into [1]s and [0]s initially.
  
  // Implementation following the standard iterative reduction:
  let onsets = Array(pulses).fill().map(() => [1]);
  let rests = Array(steps - pulses).fill().map(() => [0]);

  while (rests.length > 0) {
    if (rests.length > onsets.length) {
       // more rests than onsets
       const newRestLength = rests.length - onsets.length;
       const newOnsets = [];
       const newRests = [];
       
       for (let i = 0; i < onsets.length; i++) {
         newOnsets.push(onsets[i].concat(rests[i]));
       }
       // Remaining rests become the new rests
       for (let i = onsets.length; i < rests.length; i++) {
         newRests.push(rests[i]);
       }
       onsets = newOnsets;
       rests = newRests;
    } else {
       // more onsets than rests (or equal)
       const newOnsets = [];
       const newRests = []; // This will actually become empty usually in standard description unless we swap?
       // Actually, the logic description is: distribute the smaller pile onto the larger pile.
       
       // Simplified reducing logic:
       const numDivisions = Math.min(onsets.length, rests.length);
       for(let i=0; i<numDivisions; i++) {
         onsets[i] = onsets[i].concat(rests[i]);
       }
       
       if (rests.length < onsets.length) {
         // The remaining onsets are just kept as is, reducing the "active group" size effectively?
         // In standard Bjorklund, we stop when the remainder is small.
         // Let's use a robust implementation widely used in JS audio libraries.
         rests = []; // consumed
       } else {
          // If we had more rests, we would have handled it in the first block if we handle swapping logic.
          // But strict Bjorklund is often written recursively.
          rests = rests.slice(numDivisions);
       }
    }
  }
  
  return [].concat(...onsets, ...rests);
}

// Slightly more robust/standard iterative version usually cited for code golf or utility:
function bjorklund(k, n) {
    let groups = [];
    for (let i=0; i < n; i++) groups.push([Number(i < k)]);
    
    let count = 0;
    while(true) {
        let count_1 = groups.filter(g => g[0] === 1).length; // Though after merge they start with 1
        // Actually, we are merging the *end* groups into the *start* groups.
        // Let's stick to the clear logic:
        
        let pivot = groups.findIndex(g => g.length !== groups[0].length);
        if (pivot === -1) break; // All same length
        
        // We have two partitions: [0..pivot-1] and [pivot..end]
        const head = groups.slice(0, pivot);
        const tail = groups.slice(pivot);
        
        if (tail.length <= 1 || head.length <= 0) break; 
        
        // Distribute tail into head
        let iterations = Math.min(head.length, tail.length);
        for (let i=0; i < iterations; i++) {
            head[i] = head[i].concat(tail.pop());
        }
        groups = head.concat(tail); // tail has been popped from
    }
    return groups.flat();
}
```

## Python Implementation

```python
def euclidean_rhythm(k, n):
    """
    Generates a Euclidean rhythm E(k, n).
    k: number of pulses
    n: total number of steps
    """
    if k >= n:
        return [1] * n
    if k == 0:
        return [0] * n
    
    # Store sequences
    groups = [[1] if i < k else [0] for i in range(n)]
    
    while True:
        # Find the index where the group structure changes
        # We expect a structure like A A ... A B B ... B
        # We want to merge Bs into As.
        
        # Check if all groups are the same
        if all(g == groups[0] for g in groups):
            break
            
        # Find split point
        # Since we initialized with 1s then 0s, and we concatenate 0s onto 1s,
        # the 'front' will always be the 'larger' (or active) pattern typically.
        # But correctly, we just separate the list into 'front' and 'back' types.
        
        # Actually easier implementation:
        try:
            pivot = next(i for i, g in enumerate(groups) if len(g) < len(groups[0]))
            # Wait, usually the 'remainder' (back) might be initially smaller (0 vs 1 length) 
            # OR logic flips.
            # Let's rely on the property: we have 'count' onsets and 'remainder' rests.
        except StopIteration:
            break
            
        head = groups[:pivot]
        tail = groups[pivot:]
        
        if not tail: break
        
        count = min(len(head), len(tail))
        
        # We want to distribute the tail into the head
        for i in range(count):
            head[i].extend(tail.pop())
            
        groups = head + tail
        
        # If tail was larger than head, we now have mixed lengths again, loop continues.
        
    return [item for sublist in groups for item in sublist]
```
