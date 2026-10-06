// Realistic rational growth model for student/trainee counter.
// Base epoch set at Oct 1, 2026.
// Pattern adheres to the user request:
// - Increases 1 every hour (+1)
// - Sometimes +3 every 2 hours
// - Sometimes 1 every 2 hours (+0 in one hour, +1 in the next)
// - Rational cyclic schedule based on hour modulo

const EPOCH = Date.UTC(2026, 9, 1, 0, 0, 0); // 1 Oct 2026
const BASE_COUNT = 12480;

// Hourly increment pattern across a 12-hour repeating cycle:
// Hour 0: +1
// Hour 1: +0  --> (hours 0+1 = 1 every 2 hours)
// Hour 2: +1
// Hour 3: +3  --> (hours 2+3 = 4, burst of 3 every 2 hours)
// Hour 4: +1
// Hour 5: +1
// Hour 6: +0
// Hour 7: +1  --> (hours 6+7 = 1 every 2 hours)
// Hour 8: +3  --> (hours 7+8 = burst of 3 every 2 hours)
// Hour 9: +1
// Hour 10: +2
// Hour 11: +1
const HOURLY_PATTERN = [1, 0, 1, 3, 1, 1, 0, 1, 3, 1, 2, 1];

export function getHourIncrement(hourIndex: number): number {
  return HOURLY_PATTERN[hourIndex % HOURLY_PATTERN.length] ?? 1;
}

export function computeStudentCount(now: number = Date.now()): number {
  const elapsedMs = Math.max(0, now - EPOCH);
  const totalHours = Math.floor(elapsedMs / 3_600_000);
  
  // Sum cycle increments
  const cycleSum = HOURLY_PATTERN.reduce((a, b) => a + b, 0); // 15 students per 12 hours
  const fullCycles = Math.floor(totalHours / HOURLY_PATTERN.length);
  const remainderHours = totalHours % HOURLY_PATTERN.length;

  let total = BASE_COUNT + (fullCycles * cycleSum);
  for (let i = 0; i < remainderHours; i++) {
    total += HOURLY_PATTERN[i] ?? 1;
  }

  return total;
}

export function getSecondsUntilNextStudent(now: number = Date.now()): number {
  const elapsedMs = now - EPOCH;
  const currentHourMs = elapsedMs % 3_600_000;
  const remainingInHourMs = 3_600_000 - currentHourMs;
  return Math.max(1, Math.floor(remainingInHourMs / 1000));
}
