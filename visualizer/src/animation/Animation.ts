export interface Animation {

	isFinished(): boolean

	step(timePast: number): void

}