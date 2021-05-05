import { Animation } from "./animation/Animation";

export class AnimationQueue {

	private readonly innerQueue: Array<Animation>
	
	constructor() {
		this.innerQueue = new Array<Animation>();
	}

	getCurrent(): Animation | undefined {
		return this.innerQueue[0];
	}

	add(animation: Animation): void {
		this.innerQueue.push(animation);
	}

	removeCurrent(): void {
		this.innerQueue.shift();
	}

}