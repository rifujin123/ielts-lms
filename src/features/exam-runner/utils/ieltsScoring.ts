/**
 * Official IELTS Band Score Rounding Algorithm
 *
 * Rule per Cambridge / IDP IELTS Handbook:
 * - Average ends in .125 -> rounds DOWN to .0 (e.g., 6.125 -> 6.0)
 * - Average ends in .25 -> rounds UP to .5 (e.g., 6.25 -> 6.5)
 * - Average ends in .375 -> rounds to .5 (e.g., 6.375 -> 6.5)
 * - Average ends in .625 -> rounds DOWN to .5 (e.g., 6.625 -> 6.5)
 * - Average ends in .75 -> rounds UP to next whole number (e.g., 6.75 -> 7.0)
 * - Average ends in .875 -> rounds UP to next whole number (e.g., 6.875 -> 7.0)
 */
export function roundToIeltsBand(rawAverage: number): number {
  const base = Math.floor(rawAverage)
  const fraction = rawAverage - base

  if (fraction < 0.25) {
    return base
  } else if (fraction < 0.75) {
    return base + 0.5
  } else {
    return base + 1.0
  }
}

/**
 * Calculates the overall band score from the 4 skills
 */
export function calculateIeltsOverall(
  listening: number,
  reading: number,
  writing: number,
  speaking: number,
): number {
  const average = (listening + reading + writing + speaking) / 4
  return roundToIeltsBand(average)
}

/**
 * Maps Listening Raw Score (0 - 40) to IELTS Band (1.0 - 9.0)
 */
export function getListeningBandFromRaw(raw: number): number {
  if (raw >= 39) return 9.0
  if (raw >= 37) return 8.5
  if (raw >= 35) return 8.0
  if (raw >= 32) return 7.5
  if (raw >= 30) return 7.0
  if (raw >= 26) return 6.5
  if (raw >= 23) return 6.0
  if (raw >= 18) return 5.5
  if (raw >= 16) return 5.0
  if (raw >= 13) return 4.5
  if (raw >= 10) return 4.0
  if (raw >= 8) return 3.5
  if (raw >= 6) return 3.0
  if (raw >= 4) return 2.5
  return 2.0
}

/**
 * Maps Reading Academic Raw Score (0 - 40) to IELTS Band (1.0 - 9.0)
 */
export function getAcademicReadingBandFromRaw(raw: number): number {
  if (raw >= 39) return 9.0
  if (raw >= 37) return 8.5
  if (raw >= 35) return 8.0
  if (raw >= 33) return 7.5
  if (raw >= 30) return 7.0
  if (raw >= 27) return 6.5
  if (raw >= 23) return 6.0
  if (raw >= 19) return 5.5
  if (raw >= 15) return 5.0
  if (raw >= 13) return 4.5
  if (raw >= 10) return 4.0
  if (raw >= 8) return 3.5
  if (raw >= 6) return 3.0
  if (raw >= 4) return 2.5
  return 2.0
}

// Re-export mock teacher data from isolated data module for backward compatibility
export { mockTeacherAssessment } from '../data/mockTeacherRubric'
