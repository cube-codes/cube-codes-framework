import { Equalizable } from "../interface/Equalizable";

/**
 * Provides utility functions for arrays
 */
export abstract class Arrays {

	/**
	 * Generates an ordered array containing all integers (each once) in the range of [from, toExclusivly)
	 * @param from - Left boundary
	 * @param toExclusivly - Right boundary
	 * @returns Generated array
	 */
	static integerRangeFromToExclusivly(from: number, toExclusivly: number) {
		if(!Number.isInteger(from)) throw new Error(`Left boundary is no integer: ${from}`);
		if(!Number.isInteger(toExclusivly)) throw new Error(`Right boundary is no integer: ${toExclusivly}`);
		const length = toExclusivly - from;
		return [... new Array(length).keys()].map((v, i) => from + i);
	}

	/**
	 * Generates an ordered array containing all integers (each once) in the range of [0, toExclusivly)
	 * @param toExclusivly - Right boundary
	 * @returns Generated array
	 */
	static integerRangeToExclusivly(toExclusivly: number) {
		return Arrays.integerRangeFromToExclusivly(0, toExclusivly);
	}

	/**
	 * Generates an ordered array containing all integers (each once) in the range of [from, toInclusivly]
	 * @param from - Left boundary
	 * @param toInclusivly - Right boundary
	 * @returns Generated array
	 */
	static integerRangeFromToInclusivly(from: number, toInclusivly: number) {
		return Arrays.integerRangeFromToExclusivly(from, toInclusivly + 1);
	}

	/**
	 * Generates an ordered array containing all integers (each once) in the range of [0, toInclusivly]
	 * @param toInclusivly - Right boundary
	 * @returns Generated array
	 */
	static integerRangeToInclusivly(toInclusivly: number) {
		return Arrays.integerRangeFromToExclusivly(0, toInclusivly + 1);
	}

	static repeat(length: number, value: number) {
		return new Array(length).fill(value);
	}

	static equals<T extends Equalizable<any>>(value1: ReadonlyArray<T>, value2: ReadonlyArray<T>): boolean {
		if(value1.length !== value2.length) {
			return false;
		}
		return value1.every((v, i) => v.equals(value2[i]));
	}

	static identifies<T extends any>(value1: ReadonlyArray<T>, value2: ReadonlyArray<T>): boolean {
		if(value1.length !== value2.length) {
			return false;
		}
		return value1.every((v, i) => v === value2[i]);
	}
	
}