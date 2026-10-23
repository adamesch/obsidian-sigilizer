import { describe, expect, it } from "vitest";
import { reduce } from "../src/sigil";

describe("reduce", () => {
	it("removes vowels", () => {
		expect(reduce("i am productive")).toBe("mprdctv");
	});

	it("removes repeated letters, keeping the first", () => {
		expect(reduce("better health")).toBe("btrhl");
	});

	it("keeps y as a consonant", () => {
		expect(reduce("I fly")).toBe("fly");
	});

	it("ignores case, punctuation, digits and newlines", () => {
		expect(reduce("I AM\nproductive! 2026")).toBe("mprdctv");
	});

	it("returns an empty string when nothing is left", () => {
		expect(reduce("a e i")).toBe("");
		expect(reduce("")).toBe("");
	});
});
