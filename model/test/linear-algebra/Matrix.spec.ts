import { Matrix, Vector, Dimension } from "../../src";

test('Simple Calculations', () => {

	const m1 = new Matrix([[1, 4, 0], [2, 2, 2], [3, -3, 0]]);
	const m2 = new Matrix([[4, 4, 0], [1.5, -1, 0.5], [0, 0, 0]]);
	const v1 = new Vector([1, 4, 3]);

	//Fields
	expect(m1.components[0][1]).toEqual(4);

	// Constructors
	expect(() => new Matrix([[1, 2], [4, 5]])).toThrowError();
	expect(Matrix.fromSameComponents(1)).toEqual(new Matrix([[1, 1, 1], [1, 1, 1], [1, 1, 1]]));
	expect(Matrix.fromComponent(Dimension.Y, Dimension.Z, 2)).toEqual(new Matrix([[0, 0, 0], [0, 0, 2], [0, 0, 0]]));

	// Import/Export/Equals/toString
	expect(Matrix.import(m1.export())).toEqual(m1);
	expect(m1.equals(new Matrix([[1, 4, 0], [2, 2, 2], [3, -3, 0]]))).toEqual(true);
	expect(m1.toString()).toEqual('((1,4,0),(2,2,2),(3,-3,0))');

	// Read full
	expect(m1.ensureInteger());
	expect(() => m2.ensureInteger()).toThrowError();

	// Read component
	expect(m1.getComponent(Dimension.Z, Dimension.Y)).toEqual(-3);
	expect(m1.componentEquals(Dimension.Y, Dimension.X, 2)).toEqual(true);

	// Calculation
	expect(m1.withComponent(Dimension.Y, Dimension.Z, 7)).toEqual(new Matrix([[1, 4, 0], [2, 2, 7], [3, -3, 0]]));
	expect(m1.add(m2)).toEqual(new Matrix([[5, 8, 0], [3.5, 1, 2.5], [3, -3, 0]]));
	expect(m1.addAt(Dimension.X, Dimension.Z, 7)).toEqual(new Matrix([[1, 4, 7], [2, 2, 2], [3, -3, 0]]));
	expect(m1.subtract(m2)).toEqual(new Matrix([[-3, 0, 0], [0.5, 3, 1.5], [3, -3, 0]]));
	expect(m1.subtractAt(Dimension.Z, Dimension.Y, 7)).toEqual(new Matrix([[1, 4, 0], [2, 2, 2], [3, -10, 0]]));
	expect(m1.scalarMultiply(2)).toEqual(new Matrix([[2, 8, 0], [4, 4, 4], [6, -6, 0]]));
	expect(m1.scalarDivide(2)).toEqual(new Matrix([[0.5, 2, 0], [1, 1, 1], [1.5, -1.5, 0]]));
	expect(m1.multiply(m2)).toEqual(new Matrix([[10, 0, 2], [11, 6, 1], [7.5, 15, -1.5]]));
	expect(m1.vectorMultiply(v1)).toEqual(new Vector([17, 16, -9]));

});