/**
 * Deterministic PRNG (mulberry32) so seed data looks the same on every load
 * instead of regenerating random demo data per session.
 */
export function createSeededRng(seed: number) {
  let state = seed
  return function next() {
    state |= 0
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function rngInt(rng: () => number, min: number, max: number) {
  return Math.floor(rng() * (max - min + 1)) + min
}

export function rngPick<T>(rng: () => number, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length)]
}
