import { Vector, Dimension } from "../../src";

test('Simple Calculations', () => {

	const v1 = new Vector([1, 2, 3]);
	const v2 = new Vector([4, 1.5, 0]);

	//Fields
	expect(v1.components[1]).toEqual(2);

	// Constructors
	expect(() => new Vector([1, 2])).toThrowError();
	expect(v1).toEqual(Vector.fromComponents(1, 2, 3));
	expect(Vector.fromSameComponents(1)).toEqual(new Vector([1, 1, 1]));
	expect(Vector.fromComponent(Dimension.Y, 2)).toEqual(new Vector([0, 2, 0]));

	// Import/Export/Equals/toString
	expect(Vector.import(v1.export())).toEqual(v1);
	expect(v1.equals(new Vector([1, 2, 3]))).toEqual(true);
	expect(v1.toString()).toEqual('(1,2,3)');

	// Read full
	expect(() => v1.ensureInteger());
	expect(() => v2.ensureInteger()).toThrowError();

	// Read component
	expect(v1.getComponent(Dimension.Z)).toEqual(3);
	expect(v1.getX()).toEqual(1);
	expect(v1.getY()).toEqual(2);
	expect(v1.getZ()).toEqual(3);
	expect(v1.componentEquals(Dimension.Y, 2)).toEqual(true);

	// Calculation
	expect(v1.withComponent(Dimension.Y, 7)).toEqual(new Vector([1, 7, 3]));
	expect(v1.add(v2)).toEqual(new Vector([5, 3.5, 3]));
	expect(v1.addAt(Dimension.Z, 7)).toEqual(new Vector([1, 2, 10]));
	expect(v1.subtract(v2)).toEqual(new Vector([-3, 0.5, 3]));
	expect(v1.subtractAt(Dimension.Z, 7)).toEqual(new Vector([1, 2, -4]));
	expect(v1.scalarMultiply(2)).toEqual(new Vector([2, 4, 6]));
	expect(v1.scalarDivide(2)).toEqual(new Vector([0.5, 1, 1.5]));
	expect(v1.dotProduct(v2)).toEqual(7);
	expect(v1.crossProduct(v2)).toEqual(new Vector([-4.5, 12, -6.5]));

});