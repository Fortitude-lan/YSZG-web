import Core from ".";
import { ON_ENTER_APP } from "../Constants";

export default class UI {
	private core: Core;
	private doms: {
		loading: HTMLElement;
		loading_complete: HTMLElement;
		preview_tooltip: HTMLElement;
		preview_tips: HTMLElement;
		boards_dialog: HTMLElement;
		boards_container: HTMLElement;
		boards_content: HTMLElement;
		boards_title: HTMLElement;
		boards_author: HTMLElement;
		boards_describe: HTMLElement;
		boards_img: HTMLImageElement;
		help_btn: HTMLElement;
		music_btn: HTMLElement;
		operating_intro: HTMLElement;
	};

	constructor(core: Core) { // 接收 Core 实例
		this.core = core;
		setTimeout(() => {
			this.doms = {
				loading: document.querySelector("#three .loading")!,
				loading_complete: document.querySelector("#three .loading-complete")!,
				preview_tooltip: document.querySelector("#three .preview-tooltip")!,
				preview_tips: document.querySelector("#three .preview-tips")!,
				boards_dialog: document.querySelector("#three .boards-info")!,
				boards_container: document.querySelector("#three .boards-info .boards-container")!,
				boards_content: document.querySelector("#three .boards-info .boards-container .content")!,
				boards_title: document.querySelector("#three .boards-container .info .title")!,
				boards_author: document.querySelector("#three .boards-container .info .author")!,
				boards_describe: document.querySelector("#three .boards-container .info .describe")!,
				boards_img: document.querySelector("#three .boards-container .img img")!,
				help_btn: document.querySelector("#three .help")!,
				music_btn: document.querySelector("#three .music")!,
				operating_intro: document.querySelector("#three .operating-intro")!,
			};
		}, 0); // 0 毫秒延迟，实际会在下一个事件循环中执行

		document.body.addEventListener("click", this.handleClick.bind(this));
	}

	init() {
		// 这里可以添加初始化逻辑，比如监听加载进度等
		console.log('UIUIUIUIUIUUI')
		console.log(document.querySelector("#app1") ? '1' : '0')
	}

	handleClick(e: MouseEvent) {
		if (e.target instanceof HTMLElement) {
			const MAP_EVENT = [
				{
					verify: () => (e.target as HTMLElement).classList.contains("start"),
					handler: this.onClickEnterApp.bind(this)
				},
				{
					verify: () => this._isBInA(["boards-info-close", "boards-info"], (e.target as HTMLElement).classList.value.split(" ")),
					handler: this.hideBoardsBox.bind(this)
				},
				{
					verify: () => (e.target as HTMLElement).classList.contains("help"),
					handler: this.showHelp.bind(this)
				},
				{
					verify: () => this._isBInA(["operating-intro-close", "operating-intro", "operating-intro-img"], (e.target as HTMLElement).classList.value.split(" ")),
					handler: this.hideHelp.bind(this)
				},
				{
					verify: () => (e.target as HTMLElement).classList.contains("music"),
					handler: () => this.core.world.getAudio().stopAudio()
				},
			];

			const event = MAP_EVENT.find(item => item.verify());
			if (event) {
				event.handler();
			}
		}
	}

	onClickEnterApp() {
		this.doms.loading_complete.classList.remove("display-none");
		this.doms.loading_complete.remove();
		this.core.$emit(ON_ENTER_APP);
	}

	showHelp() {
		this.doms.operating_intro.classList.remove("display-none");
	}

	hideHelp() {
		this.doms.operating_intro.classList.add("display-none");
	}

	showBoardsBox(title: string, author: string, describe: string, img_src: string) {
		if (this.doms.boards_dialog.style.visibility === "visible") return;
		this.doms.boards_dialog.style.visibility = "visible";
		this.doms.boards_container.classList.remove("hide");
		this.doms.boards_title.innerText = title;
		this.doms.boards_author.innerText = author;
		this.doms.boards_describe.innerHTML = describe;
		this.doms.boards_img.src = img_src;
		this.doms.boards_content.scrollTo({ top: 0, left: 0, behavior: "smooth" });
	}

	hideBoardsBox() {
		this.doms.boards_dialog.style.visibility = "hidden";
		this.doms.boards_container.classList.add("hien");
		this.doms.boards_title.textContent = "";
		this.doms.boards_author.textContent = "";
		this.doms.boards_describe.textContent = "";
		this.doms.boards_img.src = "";
	}

	showPreviewTooltip(msg: string, show_preview_tips = true) {
		this.doms.preview_tooltip.classList.remove("hide");
		if (show_preview_tips) {
			this.doms.preview_tips.classList.remove("hide");
		}
		if (this.doms.preview_tooltip.innerText === msg) return;
		this.doms.preview_tooltip.innerText = msg;
	}

	hidePreviewTooltip() {
		this.doms.preview_tooltip.classList.add("hide");
		this.doms.preview_tips.classList.add("hide");
	}

	updateLoadingProgress(loading_text: string) {
		const progress = this.doms.loading.querySelector("#three .progress");
		progress && (progress.textContent = loading_text);
	}

	removeLoading() {
		this.doms.loading.remove();
	}

	showLoadingConfirm() {
		this.doms.loading_complete.classList.remove("display-none");
	}

	private _isBInA(A: string[], B: string[]) {
		return B.some(name => A.includes(name));
	}
}
