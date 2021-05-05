import { Equalizable } from "../interface/Equalizable";
import { Printable } from "../interface/Printable";
import { Dimension } from "../linear-algebra/Dimension";
import { Matrix } from "../linear-algebra/Matrix";

/**
 * Wraps an orthogonal matrix that describes how the cubical is currently rotated around its center, in comparison to its standard location and orientation.
 */
export class CubeletOrientation implements Equalizable<CubeletOrientation>, Printable {

	/** 
	 * The standard orientation
	 */
	static readonly IDENTITY: CubeletOrientation = new CubeletOrientation(Matrix.IDENTITY);

	//TODO: provide some access via systematic names
	static getAll(): ReadonlyArray<CubeletOrientation> {
		const matrices = new Array<Matrix>();
		//Identity
		matrices.push(new Matrix([[1, 0, 0], [0, 1, 0], [0, 0, 1]]));
		//3 nontrivial Rotations around X, Y, Z axis (resp: permutation matrices 2-cycle, fixpioint +1 and permutation matrices identity)
		matrices.push(new Matrix([[+1, 0, 0], [0, 0, -1], [0, +1, 0]])); //=Matrix.fromRotation(X)
		matrices.push(new Matrix([[+1, 0, 0], [0, -1, 0], [0, 0, -1]]));
		matrices.push(new Matrix([[+1, 0, 0], [0, 0, 1], [0, -1, 0]]));
		matrices.push(new Matrix([[0, 0, +1], [0, +1, 0], [-1, 0, 0]])); //=Matrix.fromRotation(Y)
		matrices.push(new Matrix([[-1, 0, 0], [0, +1, 0], [0, 0, -1]]));
		matrices.push(new Matrix([[0, 0, -1], [0, +1, 0], [+1, 0, 0]]));
		matrices.push(new Matrix([[0, -1, 0], [+1, 0, 0], [0, 0, +1]])); //=Matrix.fromRotation(Z)
		matrices.push(new Matrix([[-1, 0, 0], [0, -1, 0], [0, 0, +1]]));
		matrices.push(new Matrix([[0, +1, 0], [-1, 0, 0], [0, 0, +1]]));
		//2 nontrivial rotations around each diagonal (resp: permutation matrices 3-cycle )
		matrices.push(new Matrix([[0, 0, +1], [+1, 0, 0], [0, +1, 0]])); //X->Y->Z, fixes(1,1,1)
		matrices.push(new Matrix([[0, +1, 0], [0, 0, +1], [+1, 0, 0]])); //X<-Y<-Z, fixes(1,1,1)
		matrices.push(new Matrix([[0, 0, -1], [-1, 0, 0], [0, 1, 0]])); //fixes (-1,1,1)
		matrices.push(new Matrix([[0, -1, 0], [0, 0, +1], [-1, 0, 0]])); //fixes(-1,1,1)
		matrices.push(new Matrix([[0, 0, +1], [-1, 0, 0], [0, -1, 0]])); //fixes (1,-1,1)
		matrices.push(new Matrix([[0, -1, 0], [0, 0, -1], [+1, 0, 0]])); //fixes(1,-1,1)
		matrices.push(new Matrix([[0, 0, -1], [+1, 0, 0], [0, -1, 0]])); //fixes (1,1,-1)
		matrices.push(new Matrix([[0, +1, 0], [0, 0, -1], [-1, 0, 0]])); //fixes(1,1,-1)
		//6 point symmetries on axis between antipodal pairs of edges 
		matrices.push(new Matrix([[-1, 0, 0], [0, 0, +1], [0, +1, 0]]));
		matrices.push(new Matrix([[-1, 0, 0], [0, 0, -1], [0, -1, 0]]));
		matrices.push(new Matrix([[0, 0, +1], [0, -1, 0], [+1, 0, 0]]));
		matrices.push(new Matrix([[0, 0, -1], [0, -1, 0], [-1, 0, 0]]));
		matrices.push(new Matrix([[0, +1, 0], [+1, 0, 0], [0, 0, +1]]));
		matrices.push(new Matrix([[0, -1, 0], [-1, 0, 0], [0, 0, +1]]));
		return matrices.map(m => new CubeletOrientation(m));
	}

	constructor(readonly matrix: Matrix) {

		//TODO: Test matrix on being valid
	
	}

	equals(other: CubeletOrientation): boolean {
		return this.matrix.equals(other.matrix);
	}

	toString() {
		return this.matrix.toString();
	}

	/**
	 * Multiplies the current orientation this.matrix with a 90° rotation around the axis "dimension".
	 * @param dimension 
	 */
	rotate(axis: Dimension): CubeletOrientation {
		return new CubeletOrientation(this.matrix.rotate(axis));
	}

}