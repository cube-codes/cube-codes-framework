import { html } from "./Html";
import $ from "jquery";
import { AppState, AutomaticActionType } from "../app-state/AppState";
import { Ui } from "./Ui";
import { UiState } from "./UiState";

export class HeaderWidget {

	private static readonly MODES: ReadonlyMap<string, string> = new Map([
		['2-1', 'Colored 2x2x2 (Pocket / Mini Cube)'],
		['3-1', 'Colored 3x3x3 (Rubik\'s / Magic Cube)'],
		['4-1', 'Colored 4x4x4 (Rubik\'s Revenge / Master Cube)'],
		['5-1', 'Colored 5x5x5 (Professor\'s Cube)'],
		['2-0', 'Numbered 2x2x2 (Super Cube 2)'],
		['3-0', 'Numbered 3x3x3 (Super Cube 3)'],
		['4-0', 'Numbered 4x4x4 (Super Cube 4)'],
		['5-0', 'Numbered 5x5x5 (Super Cube 5)']
	]);

	constructor(private readonly ui: Ui) {

		this.markup();
		this.setupModelListeners();
		this.setupActions();
		this.setupBlocking();

	}

	private markup() {

		$(html`
<header id="header" class="navbar navbar-dark bg-dark">
	<span class="navbar-brand"><img src="${this.ui.settings.appDirectory}/images/own-icons/cube.svg" title="Cube-Codes IDE\nVersion: ${this.ui.settings.version}" />Cube-Codes IDE</span>
	<div class="btn-group btn-group-sm">
		<button type="button" id="header-mode" class="btn btn-dark dropdown-toggle" data-toggle="dropdown" title="Choose the cube mode you want to use"></button>
		<div class="dropdown-menu"></div>
	</div>
	<div class="btn-group btn-group-sm ml-auto">
		<input type="file" id="header-load-file" style="display: none;" />
		<button type="button" id="header-load" class="btn btn-secondary" title="Load a scenario from file"><img src="${this.ui.settings.appDirectory}/images/bootstrap-icons/upload.svg" /><span>Load</span></button>
		<button type="button" id="header-save" class="btn btn-secondary" data-toggle="modal"
			data-target="#header-save-modal" title="Save a scenario to file"><img src="${this.ui.settings.appDirectory}/images/bootstrap-icons/download.svg" /><span>Save</span></button>
	</div>
	<div class="btn-group btn-group-sm ml-2">
		<button type="button" id="header-share" class="btn btn-secondary" data-toggle="modal"
			data-target="#header-share-modal" title="Share a scenario by generating a link"><img
				src="${this.ui.settings.appDirectory}/images/bootstrap-icons/share-fill.svg" /><span>Share</span></button>
	</div>
</header>`).appendTo('#section-0');

		[...HeaderWidget.MODES.entries()].forEach(e => $(html`<span id="header-mode-${e[0]}" class="dropdown-item header-mode-item" data="${e[0]}" title="${e[1]}">${e[1]}</span>`).appendTo('#header-mode + .dropdown-menu'));

		$(html`
<div id="header-save-modal" class="modal fade" tabindex="-1">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header"><img class="mr-3" src="${this.ui.settings.appDirectory}/images/bootstrap-icons/download.svg" />
				<h5 class="modal-title">Save scenario</h5>
				<button type="button" class="close" data-dismiss="modal" title="Close window">&times;</button>
			</div>
			<div class="modal-body">
				<p>Download a sharable file describing your current scenario.</p>
				<div class="form-group">
					<input type="text" class="form-control" id="header-save-modal-file-name" placeholder="File Name" />
				</div>
				<div class="form-group">
					<input type="text" class="form-control" id="header-save-modal-title" placeholder="Title" />
				</div>
				<div class="form-group">
					<textarea type="text" class="form-control" id="header-save-modal-description" placeholder="Description" style="height: 100px; "></textarea>
				</div>
				<div class="form-group">
					<h6>History</h6>
					<div class="form-check">
						<input class="form-check-input" type="checkbox" id="header-save-modal-reduce-history" />
						<label class="form-check-label" for="header-save-modal-reduce-history">Reduce to current cube
							state only</label>
					</div>
				</div>
				<div class="form-group">
					<h6>Editor</h6>
					<div class="form-check">
						<input class="form-check-input" type="checkbox" id="header-save-modal-omit-code" />
						<label class="form-check-label" for="header-save-modal-omit-code">Omit code</label>
					</div>
				</div>
				<div class="form-group mb-0">
					<h6>Automatic Action</h6>
					<select class="form-control w-50" id="header-save-modal-automatic-action">
						<option value="none">None</option>
						<option value="editorRun">Editor: Run</option>
						<option value="editorRunFast">Editor: Run fast</option>
						<option value="historyStepAhead">History: Step ahead</option>
						<option value="historyStepBack">History: Step back</option>
						<option value="historyPlayAhead">History: Play ahead</option>
						<option value="historyPlayBack">History: Play back</option>
					</select>
				</div>
			</div>
			<div class="modal-footer">
				<div class="form-inline">
					<button type="button" class="btn btn-primary" id="header-save-modal-save" title="Save the current scenario to file">Save</button>
				</div>
			</div>
		</div>
	</div>
</div>`).appendTo('body');

		$(html`
<div id="header-share-modal" class="modal fade" tabindex="-1">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header"><img class="mr-3" src="${this.ui.settings.appDirectory}/images/bootstrap-icons/share-fill.svg" />
				<h5 class="modal-title">Share scenario</h5>
				<button type="button" class="close" data-dismiss="modal" title="Close window">&times;</button>
			</div>
			<div class="modal-body">
				<p>Generate a sharable link describing your current scenario.</p>
				<div class="form-group">
					<input type="text" class="form-control" id="header-share-modal-title" placeholder="Title" />
				</div>
				<div class="form-group">
					<textarea type="text" class="form-control" id="header-share-modal-description" placeholder="Description" style="height: 100px; "></textarea>
				</div>
				<div class="form-group">
					<h6>History</h6>
					<div class="form-check">
						<input class="form-check-input" type="checkbox" id="header-share-modal-reduce-history" />
						<label class="form-check-label" for="header-share-modal-reduce-history">Reduce to current cube
							state only</label>
					</div>
				</div>
				<div class="form-group">
					<h6>Editor</h6>
					<div class="form-check">
						<input class="form-check-input" type="checkbox" id="header-share-modal-omit-code" />
						<label class="form-check-label" for="header-share-modal-omit-code">Omit code</label>
					</div>
				</div>
				<div class="form-group mb-0">
					<h6>Automatic Action</h6>
					<select class="form-control w-50" id="header-share-modal-automatic-action">
						<option value="none">None</option>
						<option value="editorRun">Editor: Run</option>
						<option value="editorRunFast">Editor: Run fast</option>
						<option value="historyStepAhead">History: Step ahead</option>
						<option value="historyStepBack">History: Step back</option>
						<option value="historyPlayAhead">History: Play ahead</option>
						<option value="historyPlayBack">History: Play back</option>
					</select>
				</div>
			</div>
			<div class="modal-footer">
				<div class="alert alert-danger" style="flex: 1; ">This app link expires after 30 days!</div>
				<div class="form-inline link-generator">
					<button type="button" class="btn btn-primary" id="header-share-modal-app-link-generate" title="Generate App Link">Generate</button>
					<input type="text" class="form-control" id="header-share-modal-app-link" readonly="readonly" placeholder="Generate App Link ..." />
					<button type="button" class="btn btn-primary" id="header-share-modal-app-link-copy" title="Copy generated app link">Copy</button>
				</div>
			</div>
		</div>
	</div>
</div>`).appendTo('body');

	}

	private setupModelListeners() {

		const modeId = `${this.ui.initialAppState.cubeSpec.edgeLength}-${this.ui.initialAppState.cubeSolutionCondition.type}`;
		const mode = HeaderWidget.MODES.get(modeId);
		if(!mode)  throw `Invalid cube mode id: ${modeId}`;
		
		$('#header-mode').html(mode);
		$(`#header-mode-${modeId}`).addClass('checked');

	}

	private setupActions() {

		$('.header-mode-item').on('click', e => {
			location.search = `init=new&cubeSpec=${e.target.getAttribute('data')?.replace(/-\d*/, '')}&cubeSolutionCondition=${e.target.getAttribute('data')?.replace(/\d*-/, '')}`;
		});
		$('#header-load').on('click', e => {
			$("#header-load-file").trigger('click');
		});
		$("#header-load-file").on('change', e => {
			const file = $("#header-load-file").prop('files').item(0);
			const reader = new FileReader();
			reader.readAsText(file, 'UTF-8');
			reader.onload = () => {
				localStorage.setItem('header-load-file', reader.result as string);
				location.search = 'init=loadFromStorage';
			};
		})

		$('#header-save-modal-save').on('click', e => {

			const fileName = $('#header-save-modal-file-name').val() as string;
			const title = $('#header-save-modal-title').val() as string;
			const description = $('#header-save-modal-description').val() as string;
			const historyReduce = $('#header-save-modal-reduce-history').is(':checked');
			const omitCode = $('#header-save-modal-omit-code').is(':checked');
			const automaticAction = $('#header-save-modal-automatic-action').val() as AutomaticActionType;
			
			const appState = new AppState(
				title,
				description,
				this.ui.cube.spec,
				this.ui.cube.solutionCondition,
				historyReduce ? this.ui.cube.getState() : this.ui.cubeHistory.initialCubeState,
				historyReduce ? [] : this.ui.cubeHistory.changes.map(c => c.move ? c.move : c.newState),
				historyReduce ? -1 : this.ui.cubeHistory.getCurrentPosition(),
				omitCode ? '' : this.ui.editorWidget.getCode(),
				automaticAction
			);

			const fileContent = new Blob([JSON.stringify(appState.export())], { type: 'application/json' });
			const fileUrl = URL.createObjectURL(fileContent);
			const fileLink = document.createElement('a');
			fileLink.href = fileUrl;
			fileLink.download = fileName;
			fileLink.click();

			$('#header-save-modal .close').trigger('click');

		});

		const emptyAppLink = () => {
			$('#header-share-modal-app-link').val('');
		};
		$('#header-share').on('click', emptyAppLink);
		$('#header-share-modal-title').on('change', emptyAppLink);
		$('#header-share-modal-description').on('change', emptyAppLink);
		$('#header-share-modal-reduce-history').on('click', emptyAppLink);
		$('#header-share-modal-omit-code').on('click', emptyAppLink);
		$('#header-share-modal-automatic-action').on('change', emptyAppLink);
		$('#header-share-modal-app-link-generate').on('click', async e => {

			const title = $('#header-share-modal-title').val() as string;
			const description = $('#header-share-modal-description').val() as string;
			const historyReduce = $('#header-share-modal-reduce-history').is(':checked');
			const omitCode = $('#header-share-modal-omit-code').is(':checked');
			const automaticAction = $('#header-share-modal-automatic-action').val() as AutomaticActionType;
			
			const appState = new AppState(
				title,
				description,
				this.ui.cube.spec,
				this.ui.cube.solutionCondition,
				historyReduce ? this.ui.cube.getState() : this.ui.cubeHistory.initialCubeState,
				historyReduce ? [] : this.ui.cubeHistory.changes.map(c => c.move ? c.move : c.newState),
				historyReduce ? -1 : this.ui.cubeHistory.getCurrentPosition(),
				omitCode ? '' : this.ui.editorWidget.getCode(),
				automaticAction
			);

			const response = await $.ajax({
				url: 'https://share-repository.cube.codes/v1/appStates',
				contentType: 'application/json',
				data: JSON.stringify(appState.export()),
				dataType: 'json',
				method: 'POST'
			});

			$('#header-share-modal-app-link').val(`${location.protocol}//${location.hostname}${location.pathname}?init=loadFromUrl&url=${response.url}`);

		});
		$('#header-share-modal-app-link-copy').on('click', e => {
			$('#header-share-modal-app-link').trigger('select');
			document.execCommand('copy');
		});

	}

	private setupBlocking() {

		const updateButtons = () => {
			const uiActive = this.ui.getState() !== UiState.IDLE;
			$('#header-mode' ).prop('disabled', uiActive);
			$('#header-load' ).prop('disabled', uiActive);
			$('#header-save' ).prop('disabled', uiActive);
			$('#header-share').prop('disabled', uiActive);
		};

		this.ui.stateChanged.on(updateButtons);
		
		updateButtons();

	}

}
