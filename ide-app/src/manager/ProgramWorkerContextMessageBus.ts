import { CubeStateSync, CubeStateSyncType, MessageIdGenerator, MessageInbox, UiSync, UiSyncType, WorkerCallbackSync, WorkerFinishedSync, WorkerFinishedSyncType, WorkerStartSync } from "@cube-codes/cube-codes-ide-common";

export class ProgramWorkerContextMessageBus {

	readonly workerFinishedSync: MessageInbox<WorkerFinishedSync>

	readonly cubeStateSync: MessageInbox<CubeStateSync>

	readonly uiSync: MessageInbox<UiSync>

	private readonly worker: Worker

	constructor(worker: Worker) {

		this.workerFinishedSync = new MessageInbox(WorkerFinishedSyncType);
		this.cubeStateSync = new MessageInbox(CubeStateSyncType);
		this.uiSync = new MessageInbox(UiSyncType);
		
		this.worker = worker;
		this.worker.onmessage = m => {
			for (const propertyName in this) {
				const inbox: any = this[propertyName];
				(inbox as MessageInbox<any>)?.tryRelay?.call(inbox, m.data);
			}
		};
		this.worker.onerror = crash => {
			this.workerFinishedSync.tryRelay({
				type: WorkerFinishedSyncType,
				id: MessageIdGenerator.generate(),
				crash: crash
			});
		};

	}

	send(messageData: WorkerStartSync | WorkerCallbackSync): void {
		this.worker.postMessage(messageData);
	}

}