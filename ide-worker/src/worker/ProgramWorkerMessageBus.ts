import { CubeStateSync, MessageInbox, UiSync, WorkerCallbackSync, WorkerCallbackSyncType, WorkerFinishedSync, WorkerStartSync, WorkerStartSyncType } from "@cube-codes/cube-codes-ide-common";

export type ProgramWorkerOutboundMessage = CubeStateSync | UiSync | WorkerFinishedSync
export class ProgramWorkerMessageBus {

	readonly workerStartSync: MessageInbox<WorkerStartSync>

	private readonly workerCallbackSync: MessageInbox<WorkerCallbackSync>

	private readonly promiseResolvesByMessageId: Map<string, (value: any | PromiseLike<any>) => void>

	constructor() {

		this.workerStartSync = new MessageInbox(WorkerStartSyncType);
		this.workerCallbackSync = new MessageInbox(WorkerCallbackSyncType);
		this.promiseResolvesByMessageId = new Map();

		self.onmessage = m => {
			for (const propertyName in this) {
				const inbox: any = this[propertyName];
				(inbox as MessageInbox<any>)?.tryRelay?.call(inbox, m.data);
			}
		};

		this.workerCallbackSync.on(m => {
			if(this.promiseResolvesByMessageId.has(m.originalId)) {
				this.promiseResolvesByMessageId.get(m.originalId)!.call(this, m.data);
				this.promiseResolvesByMessageId.delete(m.originalId);
			}
		});

	}

	async sendMessage(messageData: ProgramWorkerOutboundMessage): Promise<any> {
		const promise = new Promise<any>(r => this.promiseResolvesByMessageId.set(messageData.id, r));
		self.postMessage(messageData);
		return promise;
	}

}