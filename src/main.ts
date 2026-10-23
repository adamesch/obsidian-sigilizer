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
			button.addEventListener("click", async (evt) => {
				evt.stopPropagation();
				button.disabled = true;
				try {
					const data = await svgToPng(svg, this.settings);
					const file = await savePng(this.app, sigil, data, this.settings.outputFolder);
					const embed = `![[${file.name}]]`;
					await navigator.clipboard.writeText(embed).catch(() => {});
					new Notice(`Saved ${file.path}\nCopied ${embed} to clipboard`);
				} catch (e) {
					console.error("Sigilizer:", e);
					new Notice(`Sigilizer: could not save PNG (${(e as Error).message})`);
				} finally {
					button.disabled = false;
				}
			});
		});
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
