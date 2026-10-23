const VOWELS = new Set(["a", "e", "i", "o", "u"]);

/**
 * Reduce an intention to its sigil string: keep only letters, drop vowels
 * (y counts as a consonant), then drop repeats, keeping first occurrences.
 * Returns "" when nothing is left.
 */
export function reduce(intention: string): string {
	const seen = new Set<string>();
	let out = "";
	for (const ch of intention.toLowerCase()) {
		if (ch < "a" || ch > "z" || VOWELS.has(ch) || seen.has(ch)) continue;
		seen.add(ch);
		out += ch;
	}
	return out;
}
