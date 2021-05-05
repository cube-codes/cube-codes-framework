import { MessageData } from "../message/MessageData";

export const CubeStateSyncType: 'CubeStateSync' = 'CubeStateSync'
export interface CubeStateSync extends MessageData<typeof CubeStateSyncType> {
	readonly state: string
	readonly move?: string
	readonly source: string
}