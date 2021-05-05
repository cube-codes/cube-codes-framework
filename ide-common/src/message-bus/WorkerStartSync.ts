import { MessageData } from "../message/MessageData";

export const WorkerStartSyncType: 'WorkerStartSync' = 'WorkerStartSync'
export interface WorkerStartSync extends MessageData<typeof WorkerStartSyncType> {
	readonly programCode: string
	readonly cubeSpec: string
	readonly cubeSolutionCondition: string
	readonly cubeState: string
}