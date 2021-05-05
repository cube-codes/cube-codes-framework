import { Matrix, Vector } from "@cube-codes/cube-codes-model";
import { Matrix4, Vector3 } from "three";

export class Utils {

	static matrix4FromMatrix(matrix: Matrix): Matrix4 {
		return new Matrix4().set(matrix.components[0][0], matrix.components[0][1], matrix.components[0][2], 0, matrix.components[1][0], matrix.components[1][1], matrix.components[1][2], 0, matrix.components[2][0], matrix.components[2][1], matrix.components[2][2], 0, 0, 0, 0, 0);
	}

	static vectorId(vector: Vector) {
		return `${vector.getX()},${vector.getY()},${vector.getZ()}`;
	}

	static vector3Id(vector: Vector3) {
		return `${vector.x},${vector.y},${vector.z}`;
	}

}