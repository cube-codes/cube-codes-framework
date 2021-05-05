import { Dimension } from "../../src";

test('Simple Calculations', () => {

	const d1 = Dimension.Y;
	const d2 = Dimension.Z;

	// Fields
	expect(d1.index).toEqual(1);
	expect(d1.name).toEqual('Y');

	// Finder
	expect(Dimension.getAll()).toEqual([Dimension.X,Dimension.Y,Dimension.Z]);
	expect(Dimension.getByIndex(d1.index)).toEqual(d1);

	// Import/Export/Equals/toString
	expect(Dimension.import(d1.export())).toEqual(d1);
	expect(d1.equals(Dimension.Y)).toEqual(true);
	expect(d1.toString()).toEqual('Y');

	// Calculation
	expect(d1.getOrthogonal(d2)).toEqual(Dimension.X);

});