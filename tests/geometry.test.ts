import { describe, expect, it } from "vitest";
import { RING_LETTERS, letterAngle, pointFor } from "../src/geometry";

describe("geometry", () => {
	it("has the 21 consonants", () => {
		expect(RING_LETTERS).toHaveLength(21);
		expect(RING_LETTERS).not.toMatch(/[aeiou]/);
	});

	it("places b at 12 o'clock", () => {
		const p = pointFor("b", 10, 100);
		expect(p.x).toBeCloseTo(100);
		expect(p.y).toBeCloseTo(90);
	});

	it("spaces letters evenly, clockwise", () => {
		const step = (2 * Math.PI) / 21;
		for (let i = 1; i < RING_LETTERS.length; i++) {
			expect(letterAngle(RING_LETTERS[i]) - letterAngle(RING_LETTERS[i - 1])).toBeCloseTo(step);
		}
		// clockwise in screen coordinates: c (next after b) is to the right of center
		expect(pointFor("c", 10, 100).x).toBeGreaterThan(100);
	});

	it("rejects vowels", () => {
		expect(() => letterAngle("a")).toThrow();
	});
});
