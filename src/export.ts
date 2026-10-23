import { App, TFile, normalizePath } from "obsidian";
import { VIEW } from "./render";
import type { SigilizerSettings } from "./settings";

/** Rasterize a rendered sigil SVG to PNG bytes using the export colors. */
export async function svgToPng(svg: SVGSVGElement, settings: SigilizerSettings): Promise<ArrayBuffer> {
	const size = settings.pngSize;
	const clone = svg.cloneNode(true) as SVGSVGElement;
	clone.setAttribute("width", String(size));
	clone.setAttribute("height", String(size));
	const color = settings.strokeColor || "#000000";
	if (!settings.transparentBackground) {
		const bg = createSvg("rect", {
			attr: { width: VIEW, height: VIEW, fill: settings.backgroundColor, stroke: "none" },
		});
		clone.insertBefore(bg, clone.firstChild);
	}

	// Bake the color in rather than relying on currentColor inheritance in a standalone image.
	const markup = new XMLSerializer().serializeToString(clone).replace(/currentColor/g, color);
	const url = URL.createObjectURL(new Blob([markup], { type: "image/svg+xml" }));
	try {
		const img = new Image();
		await new Promise<void>((resolve, reject) => {
			img.onload = () => resolve();
			img.onerror = () => reject(new Error("Could not load sigil SVG"));
			img.src = url;
		});
		const canvas = createEl("canvas", { attr: { width: size, height: size } });
		const ctx = canvas.getContext("2d");
		if (!ctx) throw new Error("Canvas is not available");
		ctx.drawImage(img, 0, 0, size, size);
		const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
		if (!blob) throw new Error("Could not encode PNG");
		return await blob.arrayBuffer();
	} finally {
		URL.revokeObjectURL(url);
	}
}

/** Write PNG bytes to <outputFolder>/sigil-<sigil>.png, overwriting if present. Returns the file. */
export async function savePng(app: App, sigil: string, data: ArrayBuffer, folder: string): Promise<TFile> {
	const dir = normalizePath(folder);
	if (!app.vault.getAbstractFileByPath(dir)) await app.vault.createFolder(dir);

	const path = normalizePath(`${dir}/sigil-${sigil}.png`);
	const existing = app.vault.getAbstractFileByPath(path);
	if (existing instanceof TFile) {
		await app.vault.modifyBinary(existing, data);
		return existing;
	}
	return app.vault.createBinary(path, data);
}
