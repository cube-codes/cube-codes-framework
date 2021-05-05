import { add, multiply, deepEqual, subtract, divide, clone, transpose, inv } from "mathjs";
import { Dimension } from "./Dimension";
import { Equalizable } from "../interface/Equalizable";
import { Exportable } from "../interface/Exportable";
import { Printable } from "../interface/Printable";
import { Vector } from "./Vector";
import { Identifiable } from "../interface/Identifiable";

export class Matrix implements Exportable<ReadonlyArray<ReadonlyArray<number>>>, Identifiable, Equalizable<Matrix>, Printable {

	static readonly ZERO = new Matrix([[0, 0, 0], [0, 0, 0], [0, 0, 0]])
	static readonly IDENTITY = new Matrix([[1, 0, 0], [0, 1, 0], [0, 0, 1]])

	/**
	 * Outer array is a list of rows, inner arrays are the columns/entries of each row
	 */
	readonly components: ReadonlyArray<ReadonlyArray<number>>

	constructor(components: ReadonlyArray<ReadonlyArray<number>>) {
		if (components.length !== 3) throw new Error(`Invalid row length: ${components.length}`);
		components.forEach((componentRow, rowIndex) => { if (componentRow.length !== 3) throw new Error(`Invalid column length at row ${Dimension.getByIndex(rowIndex)}: ${componentRow.length}`); });
		this.components = clone(components);
	}

	static forBaseChange(from: Array<Vector>, to: Array<Vector>): Matrix {
		if (from.length !== 3 && to.length !== 3) throw new Error(`Invalid number of base vectors length: ${from.length}, ${to.length}`);
		const fromMatrix = transpose([from[0].copyComponents(), from[1].copyComponents(), from[2].copyComponents()]); // Matrix that sends the unit vectors to fromX, fromY, fromZ
		const toMatrix = transpose([to[0].copyComponents(), to[1].copyComponents(), to[2].copyComponents()]); // Matrix that sends the unit vectors to toX, toY, toZ
		return new Matrix(multiply(toMatrix, inv(fromMatrix)));
	}

	static fromRotation(axis: Dimension): Matrix {
		switch (axis) {
			case Dimension.X: return new Matrix([[1, 0, 0], [0, 0, -1], [0, 1, 0]]);
			case Dimension.Y: return new Matrix([[0, 0, 1], [0, 1, 0], [-1, 0, 0]]);
			case Dimension.Z: return new Matrix([[0, -1, 0], [1, 0, 0], [0, 0, 1]]);
			default: throw new Error(`Invalid axis: ${axis}`);
		}
	}

	static fromSameComponents(allComponents: number): Matrix {
		return new Matrix([[allComponents, allComponents, allComponents], [allComponents, allComponents, allComponents], [allComponents, allComponents, allComponents]]);
	}

	static fromComponent(rowDimension: Dimension, columnDimension: Dimension, component: number): Matrix {
		return this.ZERO.withComponent(rowDimension, columnDimension, component);
	}

	static import(value: ReadonlyArray<ReadonlyArray<number>>): Matrix {
		return new Matrix(value);
	}

	export(): ReadonlyArray<ReadonlyArray<number>> {
		return this.components;
	}

	id(): string {
		return JSON.stringify(this.export());
	}

	equals(other: Matrix): boolean {
		return deepEqual(this.copyComponents(), other.copyComponents()) as unknown as boolean;
	}

	toString(): string {
		return `((${this.components[0].toString()}),(${this.components[1].toString()}),(${this.components[2].toString()}))`;
	}

	ensureInteger(): void {
		this.components.forEach((componentRow, rowIndex) => { this.components[rowIndex].forEach((component, columnIndex) => { if (!Number.isInteger(component)) throw new Error(`Invalid component at row ${Dimension.getByIndex(rowIndex)} at column ${Dimension.getByIndex(columnIndex)}: ${component}`); }); });
	}

	copyComponents(): Array<Array<number>> {
		return clone(this.components);
	}

	getFlatComponents(): ReadonlyArray<number> {
		return this.components[0].concat(this.components[1]).concat(this.components[2]);
	}

	getComponent(rowDimension: Dimension, columnDimension: Dimension): number {
		return this.components[rowDimension.index][columnDimension.index];
	}

	componentEquals(rowDimension: Dimension, columnDimension: Dimension, otherComponent: number): boolean {
		return this.getComponent(rowDimension, columnDimension) === otherComponent;
	}

	withComponent(rowDimension: Dimension, columnDimension: Dimension, newComponent: number): Matrix {
		const newComponents = clone(this.components);
		newComponents[rowDimension.index][columnDimension.index] = newComponent;
		return new Matrix(newComponents);
	}

	transpose(): Matrix {
		return new Matrix(transpose(this.copyComponents()));
	}

	inverse(): Matrix {
		return new Matrix(inv(this.copyComponents()));
	}

	add(summand2: Matrix): Matrix {
		return new Matrix(add(this.copyComponents(), summand2.copyComponents()) as number[][]);
	}

	addAt(rowDimension: Dimension, columnDimension: Dimension, summand2: number): Matrix {
		return this.add(Matrix.fromComponent(rowDimension, columnDimension, summand2));
	}

	subtract(subtrahend: Matrix): Matrix {
		return new Matrix(subtract(this.copyComponents(), subtrahend.copyComponents()) as number[][]);
	}

	subtractAt(rowDimension: Dimension, columnDimension: Dimension, subtrahend: number): Matrix {
		return this.subtract(Matrix.fromComponent(rowDimension, columnDimension, subtrahend));
	}

	scalarMultiply(factor2: number): Matrix {
		return new Matrix(multiply(this.copyComponents(), factor2));
	}

	scalarDivide(divisor: number): Matrix {
		return new Matrix(divide(this.copyComponents(), divisor) as number[][]);
	}

	multiply(factor2: Matrix): Matrix {
		return new Matrix(multiply(this.copyComponents(), factor2.copyComponents()));
	}

	vectorMultiply(factor2: Vector): Vector {
		return new Vector(multiply(this.copyComponents(), transpose(factor2.copyComponents())) as unknown as number[]);
	}

	rotate(axis: Dimension): Matrix {
		return Matrix.fromRotation(axis).multiply(this);
	}

}