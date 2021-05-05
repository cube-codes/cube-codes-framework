import { ReadonlyCubelet, CubePartType, CubePart, Vector, Dimension } from "../src";

export class CubeletInspector {

	readonly #cubelets: ReadonlyArray<ReadonlyCubelet>

	readonly #predicates: ReadonlyArray<(cubelet: ReadonlyCubelet) => boolean>

	readonly #negateNext: boolean

	constructor(cubelets: ReadonlyArray<ReadonlyCubelet>,
		predicates: Array<(cubelet: ReadonlyCubelet) => boolean> = [],
		negateNext: boolean = false) {
		this.#cubelets = cubelets;
		this.#predicates = predicates;
		this.#negateNext = negateNext;
	}

	withPredicate(predicate: (cubelet: ReadonlyCubelet) => boolean) {
		if (this.#negateNext) {
			predicate = cubelet => !predicate.call(undefined, cubelet);
		}
		return new CubeletInspector(this.#cubelets, [...this.#predicates, predicate], false);
	}

	not(): CubeletInspector {
		return new CubeletInspector(this.#cubelets, [...this.#predicates], true);
	}

	withType(type: CubePartType): CubeletInspector {
		return this.withPredicate(cubelet => cubelet.type.equals(type));
	}

	corners(): CubeletInspector {
		return this.withType(CubePartType.CORNER);
	}

	edges(): CubeletInspector {
		return this.withType(CubePartType.EDGE);
	}

	faces(): CubeletInspector {
		return this.withType(CubePartType.FACE);
	}

	currentlyInPart(part: CubePart): CubeletInspector {
		return this.withPredicate(cubelet => cubelet.currentLocation.part.equals(part));
	}

	currentlyAtOrigin(origin: Vector): CubeletInspector {
		return this.withPredicate(cubelet => cubelet.currentLocation.origin.equals(origin));
	}

	currentlyAtOriginComponent(dimension: Dimension, component: number): CubeletInspector {
		return this.withPredicate(cubelet => cubelet.currentLocation.origin.componentEquals(dimension, component));
	}

	currentlyAtX(x: number): CubeletInspector {
		return this.currentlyAtOriginComponent(Dimension.X, x);
	}

	currentlyAtY(y: number): CubeletInspector {
		return this.currentlyAtOriginComponent(Dimension.Y, y);
	}

	currentlyAtZ(z: number): CubeletInspector {
		return this.currentlyAtOriginComponent(Dimension.Z, z);
	}

	currentlyAlong(dimension: Dimension): CubeletInspector {
		return this.withPredicate(cubelet => cubelet.currentLocation.isAlong(dimension));
	}

	currentlyAlongX(): CubeletInspector {
		return this.currentlyAlong(Dimension.X);
	}

	currentlyAlongY(): CubeletInspector {
		return this.currentlyAlong(Dimension.Y);
	}

	currentlyAlongZ(): CubeletInspector {
		return this.currentlyAlong(Dimension.Z);
	}

	initiallyInPart(part: CubePart): CubeletInspector {
		return this.withPredicate(cubelet => cubelet.initialLocation.part.equals(part));
	}

	initiallyAtOrigin(origin: Vector): CubeletInspector {
		return this.withPredicate(cubelet => cubelet.initialLocation.origin.equals(origin));
	}

	initiallyAtOriginComponent(dimension: Dimension, component: number): CubeletInspector {
		return this.withPredicate(cubelet => cubelet.initialLocation.origin.componentEquals(dimension, component));
	}

	initiallyAtX(x: number): CubeletInspector {
		return this.initiallyAtOriginComponent(Dimension.X, x);
	}

	initiallyAtY(y: number): CubeletInspector {
		return this.initiallyAtOriginComponent(Dimension.Y, y);
	}

	initiallyAtZ(z: number): CubeletInspector {
		return this.initiallyAtOriginComponent(Dimension.Z, z);
	}

	initiallyAlong(dimension: Dimension): CubeletInspector {
		return this.withPredicate(cubelet => cubelet.initialLocation.isAlong(dimension));
	}

	initiallyAlongX(): CubeletInspector {
		return this.initiallyAlong(Dimension.X);
	}

	initiallyAlongY(): CubeletInspector {
		return this.initiallyAlong(Dimension.Y);
	}

	initiallyAlongZ(): CubeletInspector {
		return this.initiallyAlong(Dimension.Z);
	}

	solvedInPart(part: CubePart): CubeletInspector {
		return this.withPredicate(cubelet => cubelet.solvedPart.equals(part));
	}

	solvedAtOrigin(origin: Vector): CubeletInspector {
		return this.withPredicate(cubelet => cubelet.solvedLocation.origin.equals(origin));
	}

	solvedAtOriginComponent(dimension: Dimension, component: number): CubeletInspector {
		return this.withPredicate(cubelet => cubelet.solvedLocation.origin.componentEquals(dimension, component));
	}

	solvedAtX(x: number): CubeletInspector {
		return this.solvedAtOriginComponent(Dimension.X, x);
	}

	solvedAtY(y: number): CubeletInspector {
		return this.solvedAtOriginComponent(Dimension.Y, y);
	}

	solvedAtZ(z: number): CubeletInspector {
		return this.solvedAtOriginComponent(Dimension.Z, z);
	}

	solvedAlong(dimension: Dimension): CubeletInspector {
		return this.withPredicate(cubelet => cubelet.solvedLocation.isAlong(dimension));
	}

	solvedAlongX(): CubeletInspector {
		return this.solvedAlong(Dimension.X);
	}

	solvedAlongY(): CubeletInspector {
		return this.solvedAlong(Dimension.Y);
	}

	solvedAlongZ(): CubeletInspector {
		return this.solvedAlong(Dimension.Z);
	}

	solved(): CubeletInspector {
		return this.withPredicate(cubelet => cubelet.isSolved());
	}

	//TODO: Something with orientation

	private checkTermination() {
		if (this.#negateNext) throw new Error('Cannot use not() before a terminator');
	}

	findAll(): ReadonlyArray<ReadonlyCubelet> {
		this.checkTermination();
		return this.#cubelets.filter((cubelet) => {
			for (let filter of this.#predicates) {
				if (!filter.call(undefined, cubelet)) return false;
			}
			return true;
		});
	}

	findFirst(): ReadonlyCubelet | undefined {
		this.checkTermination();
		const result = this.#cubelets.find((cubelet) => {
			for (let filter of this.#predicates) {
				if (!filter.call(undefined, cubelet)) return false;
			}
			return true;
		});
		if (result === undefined) return undefined;
		return result;
	}

	findOne(): ReadonlyCubelet {
		this.checkTermination();
		const result = this.findAll();
		if (result.length !== 1) throw new Error(`Invalid result length: ${result.length}`);
		return result[0];
	}

	count(): number {
		this.checkTermination();
		return this.findAll().length;
	}

	exist(): boolean {
		this.checkTermination();
		return this.findFirst() !== undefined;
	}

	dontExist(): boolean {
		this.checkTermination();
		return this.count() === 0;
	}

	areSolved(): boolean {
		this.checkTermination();
		return this.findAll().every(cubelet => cubelet.isSolved());
	}

	areUnsolved(): boolean {
		this.checkTermination();
		return this.findAll().every(cubelet => !cubelet.isSolved());
	}

	findCurrentlyInPart(cubePart: CubePart): ReadonlyCubelet {
		return this.currentlyInPart(cubePart).findOne();
	}

	findInitiallyInPart(cubePart: CubePart): ReadonlyCubelet {
		return this.initiallyInPart(cubePart).findOne();
	}

	findSolvedInPart(cubePart: CubePart): ReadonlyCubelet {
		return this.solvedInPart(cubePart).findOne();
	}

}