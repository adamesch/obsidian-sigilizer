import { App, PluginSettingTab, SettingDefinitionItem } from "obsidian";
import type SigilizerPlugin from "./main";

export interface SigilizerSettings {
	outputFolder: string;
	pngSize: number;
	strokeWidth: number;
	/** Empty means "follow the theme" in notes and black in PNGs. */
	strokeColor: string;
	backgroundColor: string;
	transparentBackground: boolean;
	copyEmbedOnSave: boolean;
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
	copyEmbedOnSave: false,
	showSigilString: false,
	doubleRing: true,
	rotateLetters: false,
};

type Key = keyof SigilizerSettings;

export class SigilizerSettingTab extends PluginSettingTab {
	constructor(app: App, private plugin: SigilizerPlugin) {
		super(app, plugin);
	}

	getSettingDefinitions(): SettingDefinitionItem<Key>[] {
		const settings = this.plugin.settings;
		return [
			{
				type: "group",
				heading: "Drawing",
				items: [
					{
						name: "Line color",
						desc: "Color of the circle, letters and sigil, in notes and PNGs. Reset to follow the theme's text color (black in PNGs).",
						aliases: ["stroke color"],
						// A render item, since an empty value ("follow theme") isn't a valid color control value.
						render: (setting) => {
							setting
								.addColorPicker((c) =>
									c.setValue(settings.strokeColor || "#000000")
										.onChange(async (v) => { settings.strokeColor = v; await this.plugin.saveSettings(); }))
								.addExtraButton((b) =>
									b.setIcon("rotate-ccw").setTooltip("Follow theme")
										.onClick(async () => { settings.strokeColor = ""; await this.plugin.saveSettings(); this.update(); }));
						},
					},
					{
						name: "Stroke width",
						desc: "Thickness of the sigil line.",
						control: { type: "slider", key: "strokeWidth", min: 0.5, max: 6, step: 0.5 },
					},
					{
						name: "Double ring",
						desc: "Draw an inner ring so the letters sit between two circles.",
						control: { type: "toggle", key: "doubleRing" },
					},
					{
						name: "Rotate letters",
						desc: "Turn each letter to face the center instead of standing upright.",
						control: { type: "toggle", key: "rotateLetters" },
					},
					{
						name: "Show sigil string",
						desc: "Show the reduced string (e.g. mprdctv) under the circle in notes.",
						control: { type: "toggle", key: "showSigilString" },
					},
				],
			},
			{
				type: "group",
				heading: "PNG export",
				items: [
					{
						name: "Output folder",
						desc: "Vault folder where PNGs are saved.",
						control: {
							type: "folder",
							key: "outputFolder",
							placeholder: DEFAULT_SETTINGS.outputFolder,
							validate: (v) => (v.trim() ? undefined : "Choose a folder."),
						},
					},
					{
						name: "Size",
						desc: "Width and height of the PNG in pixels.",
						control: {
							type: "number",
							key: "pngSize",
							min: 64,
							max: 8192,
							step: 1,
							validate: (v) => (v >= 64 && v <= 8192 ? undefined : "Use a size from 64 to 8192."),
						},
					},
					{
						name: "Background color",
						control: { type: "color", key: "backgroundColor" },
					},
					{
						name: "Transparent background",
						control: { type: "toggle", key: "transparentBackground" },
					},
					{
						name: "Copy embed link",
						desc: "After saving, copy the image's embed link (e.g. ![[sigil-mprdctv.png]]) to the clipboard.",
						aliases: ["clipboard"],
						control: { type: "toggle", key: "copyEmbedOnSave" },
					},
				],
			},
		];
	}
}
