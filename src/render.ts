import { RING_LETTERS, letterAngle, pointFor } from "./geometry";

const SVG_NS = "http://www.w3.org/2000/svg";

// Layout in a 200×200 viewBox.
export const VIEW = 200;
const C = VIEW / 2;
const R_OUTER = 96;
const R_INNER = 80;
const R_LABEL = 88;
const R_ANCHOR = 72;
const MARKER = 3.5;

export interface RenderOptions {
	strokeWidth: number;
	doubleRing: boolean;
	rotateLetters: boolean;
}

function el<K extends keyof SVGElementTagNameMap>(
	tag: K,
	attrs: Record<string, string | number>,
): SVGElementTagNameMap[K] {
	return createSvg(tag, { attr: attrs });
}

/** Build the magic circle with the sigil inscribed. Strokes use currentColor. */
export function buildSvg(sigil: string, opts: RenderOptions): SVGSVGElement {
	const svg = el("svg", {
		xmlns: SVG_NS,
		viewBox: `0 0 ${VIEW} ${VIEW}`,
		fill: "none",
		stroke: "currentColor",
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
	});

	svg.appendChild(el("circle", { cx: C, cy: C, r: R_OUTER, "stroke-width": 1 }));
	if (opts.doubleRing) {
		svg.appendChild(el("circle", { cx: C, cy: C, r: R_INNER, "stroke-width": 1 }));
	}

	for (const letter of RING_LETTERS) {
		const p = pointFor(letter, R_LABEL, C);
		const text = el("text", {
			x: p.x,
			y: p.y,
			fill: "currentColor",
			stroke: "none",
			"font-family": "serif",
			"font-size": 10,
			"text-anchor": "middle",
			"dominant-baseline": "central",
		});
		if (opts.rotateLetters) {
			const deg = (letterAngle(letter) * 180) / Math.PI + 90;
			text.setAttribute("transform", `rotate(${deg} ${p.x} ${p.y})`);
		}
		text.textContent = letter.toUpperCase();
		svg.appendChild(text);
	}

	const anchors = [...sigil].map((l) => pointFor(l, R_ANCHOR, C));
	if (anchors.length === 0) return svg;

	if (anchors.length > 1) {
		svg.appendChild(el("polyline", {
			points: anchors.map((p) => `${p.x},${p.y}`).join(" "),
			"stroke-width": opts.strokeWidth,
		}));
	}

	const start = anchors[0];
	svg.appendChild(el("circle", {
		cx: start.x,
		cy: start.y,
		r: MARKER,
		"stroke-width": opts.strokeWidth,
	}));

	const end = anchors[anchors.length - 1];
	svg.appendChild(el("path", {
		d: `M ${end.x - MARKER} ${end.y - MARKER} L ${end.x + MARKER} ${end.y + MARKER} ` +
			`M ${end.x + MARKER} ${end.y - MARKER} L ${end.x - MARKER} ${end.y + MARKER}`,
		"stroke-width": opts.strokeWidth,
	}));

	return svg;
}
