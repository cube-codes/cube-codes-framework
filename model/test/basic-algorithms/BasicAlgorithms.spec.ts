import { CubeSpecification, CubeSolutionCondition, CubeSolutionConditionType, Cube, CubeFace, CubeMoveAngle, CubePart } from '../../src';
import { CubeApi } from '../CubeApi';

test('Simple Move', () => {

	const spec = new CubeSpecification(3);
	const solv = new CubeSolutionCondition(CubeSolutionConditionType.COLOR);
	const cube = new Cube(spec, solv);
	const CUBE = new CubeApi(cube);
	const CUBELETS = CUBE.cubelets;
	const API = console;

	// Verdrehen
	// Den ganzen Würfel front clockwise (damit er anders daliegt), dann 
	CUBE.frontRange(1, 3, CubeMoveAngle.C90);
	CUBE.move(" U' ");

	//[Farben gehören noch eingeführt für faces]

	// Variablen definieren
	const HANS = CUBELETS.findSolvedInPart(CubePart.UF);
	API.log("Liegt ursprünglich dh. hat Farben: " + HANS.initialPart.toString() + "\n"
		+ "Liegt aktuell an der Stelle: " + HANS.initialPart.toString() + "\n"
		+ "Gehört nach Mittenfarben nach: " + HANS.initialPart.toString());
	const Obenfarbe: CubeFace = CUBELETS.findCurrentlyInPart(CubePart.U).getColorAt(CubeFace.UP);
	API.log("Die Obenfarbe (der Mitte) ist: " + Obenfarbe + "\n"
		+ "und von oben ist seine Farbe: " + HANS.getColorAt(CubeFace.UP));
	// getColor=getColorAt(cubelet.getNormalVector[0]) if type=Face, error else

	//HANS liegt in der 1. Ebene (obersten Ebene)
	if (HANS.currentPart === CubePart.UF && HANS.getColorAt(CubeFace.FRONT) === Obenfarbe) CUBE.move(" F E F E' ");
	else if (HANS.currentPart === CubePart.UF && HANS.getColorAt(CubeFace.UP) === Obenfarbe) CUBE.move(" ");
	else if (HANS.currentPart === CubePart.UR && HANS.getColorAt(CubeFace.RIGHT) === Obenfarbe) CUBE.move(" R' F' ");
	else if (HANS.currentPart === CubePart.UR && HANS.getColorAt(CubeFace.UP) === Obenfarbe) {
		// !! BUG: The composite move does not wirk here, not even "R R"
		//CUBE.move(" R R D' F F "); 
		CUBE.move(" R ");
		API.log(HANS.currentPart.toString());
		CUBE.move(" R ");
		API.log(HANS.currentPart.toString());
		CUBE.move(" D' ");
		API.log(HANS.currentPart.toString());
		CUBE.move(" F ");
		API.log(HANS.currentPart.toString());
		CUBE.move(" F ");
		API.log(HANS.currentPart.toString());
	}
	/*
	if(HANS h & HANS1 außen) move(BE'F);
	if(HANS h & HANS1 oben) move(BBDDFF);
	if(HANS l & HANS1 außen) move(LF);
	if(HANS l & HANS1 oben) move(LE'F');
	//HANS liegt in der 2. Ebene (mittlere Ebene)
	if(HANS vr & HANS1 rechts) move(F');
	if(HANS vr & HANS1 vorne) move(EFE');
	if(HANS hr & HANS1 rechts) move(EEFEE);
	if(HANS hr & HANS1 hinten) move(EF'E');
	if(HANS hl & HANS1 links) move(EEF'EE);
	if(HANS hl & HANS1 hinten) move(E'FE);
	if(HANS vl & HANS1 links) move(F);
	if(HANS vl & HANS1 vorne) move(E'F'E);
	//HANS liegt in der 3. Ebene (unterste Ebene)
	if(HANS v & HANS1 außen) move(F'EF);
	if(HANS v & HANS1 unten) move(FF);
	if(HANS r & HANS1 außen) {move(D'); move(F'EF);}
	if(HANS r & HANS1 unten) move(D'FF);
	if(HANS h & HANS1 außen) {move(DD); move(F'EF);}
	if(HANS h & HANS1 unten) move(DDFF);
	if(HANS l & HANS1 außen) {move(D); move(F'EF);}
	if(HANS l & HANS1 unten) move(DFF);
	*/

	//Jetzt sollte der Stein an der richtigen Stelle mit den richtigen Farben stehen
	/*API.log("Liegt ursprünglich dh. hat Farben: "+HANS.getInitialPart().toString()+"\n"
			+"Liegt aktuell an der Stelle: "+ HANS.currentPart.toString() +"\n"
			+"Gehört nach Mittenfarben nach: "+ HANS.getSolvedPart().toString());*/
	expect(HANS.currentPart === CubePart.UF && HANS.getColorAt(CubeFace.UP) === Obenfarbe).toEqual(true);
});
