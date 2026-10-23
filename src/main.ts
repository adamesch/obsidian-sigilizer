import { Notice, Plugin } from "obsidian";
import { savePng, svgToPng } from "./export";
import { buildSvg } from "./render";
import { DEFAULT_SETTINGS, SigilizerSettingTab, SigilizerSettings } from "./settings";
import { reduce } from "./sigil";

export default class SigilizerPlugin extends Plugin {
	settings: SigilizerSettings;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new SigilizerSettingTab(this.app, this));

		this.registerMarkdownCodeBlockProcessor("sigil", (source, el) => {
			const block = el.createDiv({ cls: "sigilizer-block" });
			const sigil = reduce(source);
			if (!sigil) {
				block.createDiv({
					cls: "sigilizer-error",
					text: "Sigilizer: this intention has no consonants to inscribe.",
				});
				return;
			}

			const svg = buildSvg(sigil, this.settings);
			svg.addClass("sigilizer-svg");
			if (this.settings.strokeColor) svg.style.color = this.settings.strokeColor;
			block.appendChild(svg);

			if (this.settings.showSigilString) {
				block.createDiv({ cls: "sigilizer-string", text: sigil });
			}

			const button = block.createEl("button", { cls: "sigilizer-save", text: "Save PNG" });
			button.addEventListener("click", (evt) => {
				evt.stopPropagation();
				void this.exportSigil(svg, sigil, button);
			});
		});
	}

	private async exportSigil(svg: SVGSVGElement, sigil: string, button: HTMLButtonElement) {
		button.disabled = true;
		try {
			const data = await svgToPng(svg, this.settings);
			const file = await savePng(this.app, sigil, data, this.settings.outputFolder);
			if (this.settings.copyEmbedOnSave) {
				const embed = `![[${file.name}]]`;
				await navigator.clipboard.writeText(embed).catch(() => {});
				new Notice(`Saved ${file.path}\nCopied ${embed} to clipboard`);
			} else {
				new Notice(`Saved ${file.path}`);
			}
		} catch (e) {
			console.error("Sigilizer:", e);
			new Notice(`Sigilizer: could not save PNG (${e instanceof Error ? e.message : String(e)})`);
		} finally {
			button.disabled = false;
		}
	}

	async loadSettings() {
		const saved = (await this.loadData()) as Partial<SigilizerSettings> | null;
		this.settings = Object.assign({}, DEFAULT_SETTINGS, saved);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
