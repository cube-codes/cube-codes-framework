import { Cube, CubeSolutionCondition, CubeSpecification, CubeState } from "@cube-codes/cube-codes-model";
import { UiApi } from "./UiApi";
import { EditorApiBuilder } from "./EditorApiBuilder";
import { EditorApi } from "./EditorApi";
import { SystemApi } from "./SystemApi";
import { ProgramWorkerMessageBus } from "../worker/ProgramWorkerMessageBus";
import { CubeApi, CubeStateSyncType, MessageIdGenerator, WorkerFinishedSyncType } from "@cube-codes/cube-codes-ide-common";

export interface ExecutionContextApi extends EditorApi {
	program(): Promise<void>
}

export class ExecutionContext {

	private readonly messageBus: ProgramWorkerMessageBus

	private readonly cube: Cube

	constructor(messageBus: ProgramWorkerMessageBus, cubeSpec: CubeSpecification, cubeSolutionCondition: CubeSolutionCondition, cubeState: CubeState) {
		this.messageBus = messageBus;
		this.cube = new Cube(cubeSpec, cubeSolutionCondition, cubeState);
		this.cube.stateChanged.on(async e => {
			await messageBus.sendMessage({
				type: CubeStateSyncType,
				id: MessageIdGenerator.generate(),
				state: JSON.stringify(e.newState.export()),
				move: e.move === undefined ? undefined : JSON.stringify(e.move.export()),
				source: JSON.stringify(e.source ?? {})
			});
		});
	}

	async run(programCode: string): Promise<void> {

		EditorApiBuilder.set({
			SYSTEM: new SystemApi(),
			UI: new UiApi(this.messageBus),
			CUBE: new CubeApi(this.cube),
			CUBELETS: new CubeApi(this.cube).cubelets
		});

		try {

			const global = self as unknown as (WorkerGlobalScope & ExecutionContextApi)
			
			new Function(`self.program = async () => {\n${programCode}\n}`)();

			await global.UI.logInfo('Program running ...', true);
			await global.UI.overlayInfo('Running ...', '', 5000);
			
			await global.program();
			
			this.messageBus.sendMessage({
				type: WorkerFinishedSyncType,
				id: MessageIdGenerator.generate()
			});

		} catch(failure) {
			this.messageBus.sendMessage({
				type: WorkerFinishedSyncType,
				id: MessageIdGenerator.generate(),
				failure: {
					message: failure.message,
					stack: failure.stack
				}
			});
		} finally {
			self.close();
		}

	}
	
}