/** The 21 consonants placed around the ring, clockwise from 12 o'clock. */
export const RING_LETTERS = "bcdfghjklmnpqrstvwxyz";

export interface Point {
	x: number;
	y: number;
}

/** Angle in radians of a ring letter, starting at the top and going clockwise. */
export function letterAngle(letter: string): number {
	const i = RING_LETTERS.indexOf(letter.toLowerCase());
	if (i < 0) throw new Error(`"${letter}" is not a ring letter`);
	return -Math.PI / 2 + (i * 2 * Math.PI) / RING_LETTERS.length;
}

/** Position of a ring letter at radius r around center (c, c). */
export function pointFor(letter: string, r: number, c: number): Point {
	const theta = letterAngle(letter);
	return { x: c + r * Math.cos(theta), y: c + r * Math.sin(theta) };
}
