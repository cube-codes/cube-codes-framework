import { html, escape } from "./Html";
import $ from "jquery";
import { Ui } from "./Ui";
import * as ACE from 'ace-builds';
import { Mode as JavascriptMode } from "ace-builds/src-noconflict/mode-javascript"
import { Search } from "ace-builds/src-noconflict/ext-searchbox"
import { BootstrapInfo } from "./BootstrapInfo";
import { ProgramManagerState } from "../manager/ProgramManagerState";
import { UiState } from "./UiState";
import { Level } from "@cube-codes/cube-codes-ide-common";

export class EditorWidget {

	private readonly ace: ACE.Ace.Editor

	private fontSize: number

	private promptCallback: (input: string | null) => void;

	constructor(private readonly ui: Ui) {
		
		this.markup();
		
		this.ace = ACE.edit('editor-ace');
		this.ace.setOptions({
			mode: new JavascriptMode(),
			newLineMode: 'unix',
			useSoftTabs: false,
			tabSize: 4,
			dragEnabled: false,
			showPrintMargin: false,
			theme: 'ace/theme/textmate',
			fixedWidthGutter: true
		});
		this.ace.getSession().setUseWorker(false);
		this.ace.setFontSize('12px');
		this.ace.renderer.setScrollMargin(6, 0, 0, 0);
		this.fontSize = 12;
		this.promptCallback = input => {};

		this.setupModelListeners();
		this.setupActions();
		this.setupBlocking();

	}

	private markup() {

		$(html`
<main id="editor" data-flex-splitter-vertical>
	<aside class="btn-toolbar">
		<div class="btn-group btn-group-sm">
			<button type="button" id="editor-abort" class="btn btn-danger" title="Abort program"
				disabled="true"><img src="${this.ui.settings.appDirectory}/images/bootstrap-icons/stop-fill.svg" /></button>
			<button type="button" id="editor-run" class="btn btn-primary" title="Run program"><img
					src="${this.ui.settings.appDirectory}/images/bootstrap-icons/play-fill.svg" /><span>Run</span></button>
			<button type="button" id="editor-run-fast" class="btn btn-primary"
				title="Run program fast (not animated)"><img
					src="${this.ui.settings.appDirectory}/images/own-icons/fast-forward.svg" /><span>Run fast</span></button>
		</div>
		<div class="btn-group btn-group-sm ml-2">
			<button type="button" id="editor-undo" class="btn btn-secondary"
				title="Undo last edit action" disabled="true"><img
					src="${this.ui.settings.appDirectory}/images/bootstrap-icons/reply-fill.svg" /></button>
			<button type="button" id="editor-redo" class="btn btn-secondary"
				title="Redo last undone edit action" disabled="true"><img class="flip"
					src="${this.ui.settings.appDirectory}/images/bootstrap-icons/reply-fill.svg" /></button>
		</div>
		<div class="btn-group btn-group-sm ml-2">
			<button type="button" id="editor-search" class="btn btn-secondary"
				title="Show search bar"><img src="${this.ui.settings.appDirectory}/images/bootstrap-icons/search.svg" /></button>
		</div>
		<div class="btn-group btn-group-sm ml-auto">
			<button type="button" id="editor-docs" class="btn btn-secondary" title="Editor Documentation"><img
					src="${this.ui.settings.appDirectory}/images/bootstrap-icons/question-circle.svg" /></button>
		</div>
		<div class="btn-group btn-group-sm ml-2">
			<button type="button" id="editor-show-invisibles" class="btn btn-secondary"
				data-toggle="button" title="Show/Hide invisible characters"><img
					src="${this.ui.settings.appDirectory}/images/bootstrap-icons/paragraph.svg" /></button>
			<button type="button" id="editor-font-increase" class="btn btn-secondary"
				title="Increase font size"><img src="${this.ui.settings.appDirectory}/images/bootstrap-icons/zoom-in.svg" /></button>
			<button type="button" id="editor-font-decrease" class="btn btn-secondary"
				title="Decrease font size"><img src="${this.ui.settings.appDirectory}/images/bootstrap-icons/zoom-out.svg" /></button>
		</div>
		<div class="btn-group btn-group-sm ml-2">
			<button type="button" id="editor-logs-clean" class="btn btn-secondary" title="Clean logs"><img
					src="${this.ui.settings.appDirectory}/images/bootstrap-icons/trash.svg" /></button>
			<button type="button" id="editor-log-lock-scroll" class="btn btn-secondary active"
				data-toggle="button" aria-pressed="true" title="Lock log scrolling"><img
					src="${this.ui.settings.appDirectory}/images/bootstrap-icons/chevron-bar-down.svg" /></button>
		</div>
	</aside>
	<main id="editor-ace"></main>
	<div role="separator"></div>
	<aside id="editor-log"></aside>
</main>`).appendTo('#section-11');

		$(html`
<div id="editor-prompt-modal" class="modal fade" tabindex="-1">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header"><img class="mr-3" src="${this.ui.settings.appDirectory}/images/bootstrap-icons/input-cursor-text.svg" />
				<h5 class="modal-title"></h5>
				<button type="button" class="close" data-dismiss="modal" title="Close window">&times;</button>
			</div>
			<div class="modal-body">
				<p></p>
				<div class="form-group mb-0">
					<input type="text" class="form-control" id="editor-prompt-modal-input" placeholder="Input" />
				</div>
			</div>
			<div class="modal-footer">
				<div class="form-inline">
					<button type="button" class="btn btn-primary" id="editor-prompt-modal-ok" title="OK">OK</button>
				</div>
			</div>
		</div>
	</div>
</div>`).appendTo('body');

	}

	private setupModelListeners() {
		
		this.ace.setValue(this.ui.initialAppState.editorCode);
		this.ace.clearSelection();
		this.ace.moveCursorTo(0, 0);

	}

	private setupActions() {
		
		const updateFontSize = (more: boolean) => {
			this.fontSize = Math.floor(this.fontSize * (more ? 1.2 : 1/1.2));
			this.ace.setFontSize(`${this.fontSize}px`);
			$('#editor-ace, #editor-log').attr('style', `font-size: ${this.fontSize}px !important`);
		};

		$('#editor-abort'          ).on('click', e => this.abort());
		$('#editor-run'            ).on('click', e => this.run());
		$('#editor-run-fast'       ).on('click', e => this.runFast());
		$('#editor-undo'           ).on('click', e => this.ace.undo());
		$('#editor-redo'           ).on('click', e => this.ace.redo());
		$('#editor-search'         ).on('click', e => new Search(this.ace, false));
		$('#editor-docs'           ).on('click', e => window.open(`${this.ui.settings.workerDirectory}/dist/editor-docs/`, '_BLANK'));
		$('#editor-show-invisibles').on('click', e => this.ace.setOption('showInvisibles', !this.ace.getOption('showInvisibles')));
		$('#editor-font-increase'  ).on('click', e => updateFontSize(true));
		$('#editor-font-decrease'  ).on('click', e => updateFontSize(false));
		$('#editor-logs-clean'     ).on('click', e => $('#editor-log').empty());

		$('#editor-prompt-modal').on('shown.bs.modal', e => {
			$('#editor-prompt-modal-input').trigger('focus');
			$('#editor-prompt-modal-input').trigger('select');
		});
		$('#editor-prompt-modal').on('hidden.bs.modal', e => {
			
			this.promptCallback(null);
			this.promptCallback = input => {};

		});
		$('#editor-prompt-modal-input').on('keypress', e => {

			if(e.which === 13) {
				$('#editor-prompt-modal-ok').trigger('click');
			}

		});
		$('#editor-prompt-modal-ok').on('click', e => {

			const input = $('#editor-prompt-modal-input').val() as string;

			this.promptCallback(input);
			this.promptCallback = input => {};

			$('#editor-prompt-modal .close').trigger('click');

		});

	}

	private setupBlocking() {

		this.ace.on('input', () => {
			$('#editor-undo').prop('disabled', !this.ace.session.getUndoManager().canUndo());
			$('#editor-redo').prop('disabled', !this.ace.session.getUndoManager().canRedo());
		});

		const updateButtons = () => {
			const programManagerActive = this.ui.programManager.getState() !== ProgramManagerState.IDLE;
			const uiActive = this.ui.getState() !== UiState.IDLE;
			$('#history-jump-start'  ).prop('disabled', uiActive || this.ui.cubeHistory.isAtStart());
			$('#editor-abort'   ).prop('disabled', !programManagerActive);
			$('#editor-run'     ).prop('disabled', uiActive);
			$('#editor-run-fast').prop('disabled', uiActive);
		};

		this.ui.stateChanged.on(updateButtons);
		
		updateButtons();

	}

	getCode(): string {
		return this.ace.getValue();
	}

	abort(): void {
		this.ui.programManager.abort();
	}

	run(): void {
		this.ui.programManager.start(this.ace.getValue(), true);
	}

	runFast(): void {
		this.ui.programManager.start(this.ace.getValue(), false);
	}
	
	log(message: string, level: Level = Level.INFO, withDate: boolean = false): void {
		
		const color = BootstrapInfo.COLOR_CLASSES_BY_LEVEL.get(level)!;
		const date = withDate ? `[${new Date().toLocaleTimeString('en-GB')}] ` : '';
		
		$(html`<div class="log text-${color}">${date}${escape(message)}</div>`).appendTo('#editor-log');
		
		if ($('#editor-log-lock-scroll').hasClass('active')) {
			$('#editor-log').scrollTop($('#editor-log').prop('scrollHeight'));
		}

	}

	logSeparator(level: Level = Level.INFO, withDate: boolean = false): void {
		this.log(`&nbsp;\n${'-'.repeat(80)}\n&nbsp;`, level, withDate);
	}

	prompt(title: string, message: string, prefilled: string, callback: (input: string | null) => void, level: Level = Level.INFO): void {
		this.promptCallback = callback;
		$('#editor-prompt-modal .modal-title').html(escape(title));
		$('#editor-prompt-modal .modal-body > p').html(escape(message));
		$('#editor-prompt-modal-input').val(prefilled);
		$('#editor-prompt-modal').modal();
	}

}