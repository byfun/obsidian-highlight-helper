import { Plugin } from "obsidian";

import { copyMarks } from "./helpers";

import { HHSettingTab } from "./settings";

interface Listener {
	(this: Document, ev: Event): any;
}

export interface HighlightMenuSetting {
	patterns: string;
	header_text: string;
	as_list: boolean;
	keep_style: boolean;
}

const DEFAULT_SETTINGS: HighlightMenuSetting = {
	patterns: "<mark(.*?)>(.*?)</mark>\n==(.*?)==",
	header_text: "",
	as_list: false,
	keep_style: false,
};

export default class HighlightHelper extends Plugin {
	longTapTimeoutId: number | null = null;
	settings: HighlightMenuSetting;

	async onload() {
		await this.loadSettings();
		
		const ribbonIconEl = this.addRibbonIcon(
			"clipboard-list",
			"Copy Marks",
			(evt: MouseEvent) => {
				copyMarks(this.settings);
			}
		);
		ribbonIconEl.addClass("hh-btn-copy");

		this.addCommand({
			id: "hh-copy-command",
			name: "Copy Marks",
			callback: () => {
				copyMarks(this.settings);
			},
		});

		this.addSettingTab(new HHSettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	onElement(
		el: Document,
		event: keyof HTMLElementEventMap,
		selector: string,
		listener: Listener,
		options?: { capture?: boolean }
	) {
		el.on(event, selector, listener, options);
		return () => el.off(event, selector, listener, options);
	}
}
