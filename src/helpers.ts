import { App, Notice } from "obsidian";
import { HighlightMenuSetting } from "./main";

const DEBUG_MODE = false;
const NOTICE_TIMEOUT = 2400;

export function dbg(...args: any[]) {
	if (DEBUG_MODE) {
		console.log.apply(console, ["[HH]", ...args]);
	}
}

export async function copyMarks(app: App, setting: HighlightMenuSetting) {
	
	const mdFile = app.workspace.getActiveFile();
	if (!mdFile) {
		new Notice("Active note not found", NOTICE_TIMEOUT);
		return;
	}
	let content: string = await app.vault.read(mdFile);
	if (content === null) {
		new Notice("Cannot read the note content", NOTICE_TIMEOUT);
		return;
	}

	try {
		let marks: string[] = [];
		let patterns: string[] = setting.patterns.split("\n");
		if (!patterns) {
			new Notice("Use after setting regular expressions", NOTICE_TIMEOUT);
			return;
		}

		let regex = patterns
			.map((v) => {
				return "(" + v + ")";
			})
			.join("|");

		let regExp = new RegExp(regex, "g");

		// copy without markdown or html tag
		if (!setting.keep_style) {
			let match = null;
			while ((match = regExp.exec(content))) {
				let full = match[0];
				match.reverse().map((v) => {
					if (v && v !== full) {
						marks.push(v);
						return false;
					}
				});
			}
		} else {
			// copy with markdown or html tag
			content.match(new RegExp(regex, "g"))?.map(function (marked) {
				marks.push(marked);
				return marked;
			});
		}

		if (marks.length == 0) {
			new Notice("Highlight not found!!", NOTICE_TIMEOUT);
			return;
		}

		// as list
		if (setting.as_list) {
			marks = marks.map(function (marked) {
				return "- " + marked;
			});
		}

		let copy = marks.join("\n");

		// prepend header
		if (setting.header_text) {
			copy = setting.header_text + "\n" + copy;
		}
		navigator.clipboard.writeText(copy);

		new Notice("All highlights are copied!!", NOTICE_TIMEOUT);
	} catch (e) {
		console.error(e);
	}
}
