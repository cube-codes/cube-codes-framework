import { MessageData } from "../message/MessageData";

export const WorkerFinishedSyncType: 'WorkerFinishedSync' = 'WorkerFinishedSync'
export interface WorkerFinishedSync extends MessageData<typeof WorkerFinishedSyncType> {
	readonly failure?: WorkerFinishedSyncFailure
	readonly crash?: WorkerFinishedSyncCrash
}

export interface WorkerFinishedSyncFailure {
	readonly message: string
	readonly stack?: string
}

export interface WorkerFinishedSyncCrash {
}