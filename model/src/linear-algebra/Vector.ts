import { add, multiply, deepEqual, subtract, divide, dot, cross, clone } from "mathjs";
import { Dimension } from "./Dimension";
import { Equalizable } from "../interface/Equalizable";
import { Exportable } from "../interface/Exportable";
import { Printable } from "../interface/Printable";
import { Identifiable } from "../interface/Identifiable";

export class Vector implements Exportable<ReadonlyArray<number>>, Identifiable, Equalizable<Vector>, Printable {

	static readonly ZERO = Vector.fromComponents(0, 0, 0)

	readonly components: ReadonlyArray<number>

	constructor(components: ReadonlyArray<number>) {
		if (components.length !== 3) throw new Error(`Invalid components length: ${components.length}`);
		this.components = clone(components);
	}

	static fromComponents(x: number, y: number, z: number): Vector {
		return new Vector([x, y, z]);
	}

	static fromSameComponents(allComponents: number): Vector {
		return new Vector([allComponents, allComponents, allComponents]);
	}

	static fromComponent(dimension: Dimension, component: number): Vector {
		return this.ZERO.withComponent(dimension, component);
	}

	static import(value: ReadonlyArray<number>): Vector {
		return new Vector(value);
	}

	export(): ReadonlyArray<number> {
		return this.components;
	}

	id(): string {
		return JSON.stringify(this.export());
	}

	equals(other: Vector): boolean {
		return deepEqual(this.copyComponents(), other.copyComponents()) as unknown as boolean;
	}

	toString(): string {
		return `(${this.components.toString()})`;
	}

	ensureInteger(): void {
		this.components.forEach((component, index) => { if (!Number.isInteger(component)) throw new Error(`Invalid component ${Dimension.getByIndex(index)}: ${component}`); });
	}

	copyComponents(): Array<number> {
		return clone(this.components);
	}

	getComponent(dimension: Dimension): number {
		return this.components[dimension.index];
	}

	getX(): number {
		return this.getComponent(Dimension.X);
	}

	getY(): number {
		return this.getComponent(Dimension.Y);
	}

	getZ(): number {
		return this.getComponent(Dimension.Z);
	}

	componentEquals(dimension: Dimension, otherComponent: number): boolean {
		return this.getComponent(dimension) === otherComponent;
	}

	withComponent(dimension: Dimension, newComponent: number): Vector {
		const newComponents = clone(this.components);
		newComponents[dimension.index] = newComponent;
		return new Vector(newComponents);
	}

	add(summand2: Vector): Vector {
		return new Vector(add(this.copyComponents(), summand2.copyComponents()) as number[]);
	}

	addAt(dimension: Dimension, summand2: number): Vector {
		return this.add(Vector.fromComponent(dimension, summand2));
	}

	subtract(subtrahend: Vector): Vector {
		return new Vector(subtract(this.copyComponents(), subtrahend.copyComponents()) as number[]);
	}

	subtractAt(dimension: Dimension, subtrahend: number): Vector {
		return this.subtract(Vector.fromComponent(dimension, subtrahend));
	}

	scalarMultiply(factor2: number): Vector {
		return new Vector(multiply(this.copyComponents(), factor2));
	}

	scalarDivide(divisor: number): Vector {
		return new Vector(divide(this.copyComponents(), divisor) as number[]);
	}

	dotProduct(factor2: Vector): number {
		return dot(this.copyComponents(), factor2.copyComponents());
	}

	crossProduct(factor2: Vector): Vector {
		return new Vector(cross(this.copyComponents(), factor2.copyComponents()) as number[]);
	}

}