// src/leaderboard/share.ts
export function buildChallengeLink(score: number, origin = window.location.origin): string {
  return `${origin}/?mode=daily&score=${score}`
}
