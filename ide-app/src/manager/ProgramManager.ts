import { ProgramManagerState } from "./ProgramManagerState";
import { ProgramWorkerContext } from "./ProgramWorkerContext";
import { ProgramManagerStateChanged } from "./ProgramManagerStateChanged";
import { Level, WorkerCallbackSyncType, WorkerStartSyncType, MessageIdGenerator } from "@cube-codes/cube-codes-ide-common";
import { Ui } from "../ui/Ui";
import { CubeMove, CubeState, Event } from "@cube-codes/cube-codes-model";

export class ProgramManager {

	readonly stateChanged = new Event<ProgramManagerStateChanged>()

	private state: ProgramManagerState

	private workerContext?: ProgramWorkerContext

	constructor(private readonly ui: Ui) {
		this.state = ProgramManagerState.IDLE;
		this.workerContext = undefined;
	}

	getState(): ProgramManagerState {
		return this.state;
	}

	private setState(newState: ProgramManagerState) {
		const oldState = this.state;
		this.state = newState;
		if (this.state === ProgramManagerState.IDLE) {
			this.workerContext = undefined;
		}
		this.stateChanged.trigger({
			oldState: oldState,
			newState: newState
		});
	}

	start(programCode: string, animation: boolean): void {

		if (this.state !== ProgramManagerState.IDLE) throw new Error(`Invalid state: ${this.state}`);

		this.setState(ProgramManagerState.STARTING);
		this.ui.editorWidget.log('Program starting ...', Level.INFO, true);
		this.ui.overlay('Program: Starting ...', '', Level.INFO, 5000);

		this.workerContext = new ProgramWorkerContext(this.ui);
		this.workerContext.messageBus.cubeStateSync.on(async m => {
			const source = JSON.parse(m.source);
			if(animation === false) {
				source.animation = false;
			}
			if (m.move) {
				await this.ui.cube.move(CubeMove.import(this.ui.cube.spec, JSON.parse(m.move)), source);
			} else {
				await this.ui.cube.setState(CubeState.import(this.ui.cube.spec, JSON.parse(m.state)), source);
			}
			this.workerContext?.messageBus.send({
				type: WorkerCallbackSyncType,
				id: MessageIdGenerator.generate(),
				originalId: m.id
			});
		});
		this.workerContext.messageBus.uiSync.on(m => {
			if(m.log) {
				this.ui.editorWidget.log(m.log.message, m.log.level, m.log.withDate);
			}
			if(m.overlay) {
				this.ui.overlay(`Program: ${m.overlay.title}`, m.overlay.message, m.overlay.level, m.overlay.duration);
			}
			if(m.prompt) {
				this.ui.editorWidget.prompt(`Program: ${m.prompt.title}`, m.prompt.message, m.prompt.prefilled, input => {
					this.workerContext?.messageBus.send({
						type: WorkerCallbackSyncType,
						id: MessageIdGenerator.generate(),
						originalId: m.id,
						data: input
					});
				}, m.prompt.level);
			} else {
				this.workerContext?.messageBus.send({
					type: WorkerCallbackSyncType,
					id: MessageIdGenerator.generate(),
					originalId: m.id
				});
			}
		});
		this.workerContext.messageBus.workerFinishedSync.on(m => {
			this.setState(ProgramManagerState.IDLE);
			if (m.crash) {
				console.debug('Unexpected error in program worker', m.crash);
			} else if (m.failure) {
				this.ui.editorWidget.log(`Program failed with an error: ${m.failure.message}\nStack: ${m.failure.stack}`, Level.ERROR, true);
				this.ui.editorWidget.logSeparator();
				this.ui.overlay('Program: Failed with an error', m.failure.message, Level.ERROR, 8000);
			} else {
				this.ui.editorWidget.log(`Program finished successfully`, Level.SUCCESS, true);
				this.ui.editorWidget.logSeparator();
				this.ui.overlay('Program: Finished successfully', '', Level.SUCCESS, 5000);
			}
		});

		this.workerContext?.messageBus.send({
			type: WorkerStartSyncType,
			id: MessageIdGenerator.generate(),
			programCode: programCode,
			cubeSpec: JSON.stringify(this.ui.cube.spec.export()),
			cubeSolutionCondition: JSON.stringify(this.ui.cube.solutionCondition.export()),
			cubeState: JSON.stringify(this.ui.cube.getState().export())
		});

		this.setState(ProgramManagerState.RUNNING);

	}

	abort(): void {

		if (this.state !== ProgramManagerState.RUNNING) throw new Error(`Invalid program manager state: ${this.state}`);

		this.workerContext?.terminate();

		this.setState(ProgramManagerState.IDLE);
		this.ui.editorWidget.log(`Program aborted`, Level.WARNING, true);
		this.ui.editorWidget.logSeparator();
		this.ui.overlay('Program: Aborted', '', Level.WARNING, 8000);

	}

}