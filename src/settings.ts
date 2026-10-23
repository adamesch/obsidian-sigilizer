import { App, PluginSettingTab, Setting } from "obsidian";
import type SigilizerPlugin from "./main";

export interface SigilizerSettings {
	outputFolder: string;
	pngSize: number;
	strokeWidth: number;
	/** Empty means "follow the theme" in notes and black in PNGs. */
	strokeColor: string;
	backgroundColor: string;
	transparentBackground: boolean;
	showSigilString: boolean;
	doubleRing: boolean;
	rotateLetters: boolean;
}

export const DEFAULT_SETTINGS: SigilizerSettings = {
	outputFolder: "Sigils",
	pngSize: 1024,
	strokeWidth: 2,
	strokeColor: "",
	backgroundColor: "#ffffff",
	transparentBackground: false,
	showSigilString: false,
	doubleRing: true,
	rotateLetters: false,
};

export class SigilizerSettingTab extends PluginSettingTab {
	constructor(app: App, private plugin: SigilizerPlugin) {
		super(app, plugin);
	}

	display(): void {
		const { containerEl } = this;
		const settings = this.plugin.settings;
		const save = () => this.plugin.saveSettings();
		containerEl.empty();

		containerEl.createEl("p", {
			text: "Changes apply to sigils the next time a note is rendered.",
			cls: "setting-item-description",
		});

		new Setting(containerEl).setHeading().setName("Drawing");

		new Setting(containerEl)
			.setName("Stroke width")
			.setDesc("Thickness of the sigil line.")
			.addSlider((s) =>
				s.setLimits(0.5, 6, 0.5).setValue(settings.strokeWidth).setDynamicTooltip()
					.onChange(async (v) => { settings.strokeWidth = v; await save(); }));

		new Setting(containerEl)
			.setName("Double ring")
			.setDesc("Draw an inner ring so the letters sit between two circles.")
			.addToggle((t) =>
				t.setValue(settings.doubleRing)
					.onChange(async (v) => { settings.doubleRing = v; await save(); }));

		new Setting(containerEl)
			.setName("Line color")
			.setDesc("Color of the circle, letters and sigil, in notes and PNGs. Reset to follow the theme's text color (black in PNGs).")
			.addColorPicker((c) =>
				c.setValue(settings.strokeColor || "#000000")
					.onChange(async (v) => { settings.strokeColor = v; await save(); }))
			.addExtraButton((b) =>
				b.setIcon("rotate-ccw").setTooltip("Follow theme")
					.onClick(async () => { settings.strokeColor = ""; await save(); this.display(); }));

		new Setting(containerEl)
			.setName("Rotate letters")
			.setDesc("Turn each letter to face the center instead of standing upright.")
			.addToggle((t) =>
				t.setValue(settings.rotateLetters)
					.onChange(async (v) => { settings.rotateLetters = v; await save(); }));

		new Setting(containerEl)
			.setName("Show sigil string")
			.setDesc("Show the reduced string (e.g. mprdctv) under the circle in notes.")
			.addToggle((t) =>
				t.setValue(settings.showSigilString)
					.onChange(async (v) => { settings.showSigilString = v; await save(); }));

		new Setting(containerEl).setHeading().setName("PNG export");

		new Setting(containerEl)
			.setName("Output folder")
			.setDesc("Vault folder where PNGs are saved.")
			.addText((t) =>
				t.setPlaceholder("Sigils").setValue(settings.outputFolder)
					.onChange(async (v) => { settings.outputFolder = v.trim() || DEFAULT_SETTINGS.outputFolder; await save(); }));

		new Setting(containerEl)
			.setName("Size")
			.setDesc("Width and height of the PNG in pixels.")
			.addText((t) =>
				t.setValue(String(settings.pngSize))
					.onChange(async (v) => {
						const n = parseInt(v, 10);
						if (n >= 64 && n <= 8192) { settings.pngSize = n; await save(); }
					}));

		new Setting(containerEl)
			.setName("Background color")
			.addColorPicker((c) =>
				c.setValue(settings.backgroundColor)
					.onChange(async (v) => { settings.backgroundColor = v; await save(); }));

		new Setting(containerEl)
			.setName("Transparent background")
			.addToggle((t) =>
				t.setValue(settings.transparentBackground)
					.onChange(async (v) => { settings.transparentBackground = v; await save(); }));
	}
}
