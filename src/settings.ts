import { App, PluginSettingTab, Setting } from "obsidian";

import HighlightHelper from "./main";

export class HHSettingTab extends PluginSettingTab {
	plugin: HighlightHelper;

	constructor(app: App, plugin: HighlightHelper) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Regex patterns")
			.setDesc(
				`regular expressions to extract marks (one expressen per line).`
			)
			.addTextArea((text) => {
				text.setValue(this.plugin.settings.patterns)
					.onChange(async (value) => {
						this.plugin.settings.patterns = value;
						await this.plugin.saveSettings();
					})
					.then((text) => {
						text.inputEl.className = "regex-patterns";
					});
			});

		new Setting(containerEl)
			.setName("Header text")
			.setDesc(
				"If set header text, it will be attached on the top of the copied highlights"
			)
			.addText((text) =>
				text
					.setValue(this.plugin.settings.header_text)
					.onChange(async (value) => {
						this.plugin.settings.header_text = value;
						await this.plugin.saveSettings();
					})
					.then((text) => {
						text.inputEl.className = "header-text";
					})
			);

		new Setting(containerEl)
			.setName("Copy as list")
			.setDesc("If enabled, highlights will be copied as a list")
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.as_list)
					.onChange((value) => {
						this.plugin.settings.as_list = value;
						this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName("Copy with highlight style")
			.setDesc(
				"If enabled, highlights will be copied with highlight code. (e.g. == HIGHLIGHT TEXT ==) If disabled, only highlighted texts will be copied (e.g. HIGHLIGHT TEXT)"
			)
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.keep_style)
					.onChange((value) => {
						this.plugin.settings.keep_style = value;
						this.plugin.saveSettings();
					});
			});
	}
}
