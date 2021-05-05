export class Permutations {

	/** 
	 * Computes the signum of a permutation, used in getOrbit
	 */
	static getSignum(permutation: ReadonlyArray<number>): number {
		let signumCount = 0;
		for (let i = 0; i < permutation.length; i++) {
			for (let j = i + 1; j < permutation.length; j++) {
				if (permutation[i] > permutation[j]) signumCount++;
			}
		}
		//console.log(permutation);
		//console.log("SignumCount:"+signumCount);
		return Math.pow(-1, signumCount);
	}

}