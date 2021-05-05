//npm install mathjs
//npm install @types/mathjs
import { e, matrix , multiply } from 'mathjs'

import { Cube, CubeStateLanguage,CubeSpecification, CubeMove, ColoredCube, CubeFace, EdgeCubical,EdgeCubicalLocation, CubeCoordinates, CubeDimension, CubeAngle, CubeEdge, CubeState, Rotation } from "../src/Cube"
import { Permutation } from "../src/Permutation";
import { CubeMoveLanguage } from '../src/CubeMoveLanguage';

test('Basic Test', () => {


	////////////////////////////////
	// DEMO TOOLS, A LITTLE "API"
	type Text=string;
	type Würfeltyp=CubeSpecification;
	type Würfel=CubeState;
	let würfeltyp3=new CubeSpecification(3);
	let melde=function(meldung:Text ) { console.log(meldung);}
	let meldeÜberschrift=function(meldung:Text ) { console.log('\n---------------------------------------\n'+meldung);}
	let meldeWürfel=function(würfel:Würfel) { console.log(würfel.toString());}
	let baueWürfelGelöst=CubeState.fromSolved;
	let bewegeNachText=function(würfel:Würfel,bewegungsBeschreibung:Text):Würfel {return würfel.moveParse(bewegungsBeschreibung); } //SCHON mit .ml
	//let bewegeNachText=function(würfel:Würfel,bewegungsBeschreibung:Text):Würfel {return (new Cube(cubeState)).ml(bewegungsBeschreibung,?).getState();} 
	let verdrehe=function(würfel:Würfel):Würfel {return würfel.shuffleByMove()};
	let baueWürfelVerdreht=function(würfeltyp:Würfeltyp):Würfel {return CubeState.fromSolved(würfeltyp).shuffleByMove()};
	let lade=function(würfeltyp:Würfeltyp,würfelBeschreibung:Text):Würfel {return (new CubeStateLanguage(würfeltyp)).fromString(würfelBeschreibung).toCubeState()};


	//////////////////////////////
	// DEMO N=4

	// let Würfel:CubeState=CubeState.fromSolved(spec);
	// console.log(Würfel.toString());
	
	// Würfel=Würfel.moveSlice(CubeDimension.X,0);
	// console.log(Würfel.toString());
	
	// let move:CubeMove= new CubeMove(spec,CubeFace.DOWN.index,2,CubeAngle.CC90);
	// Würfel=Würfel.move(move)
	// console.log(Würfel.toString());

	// Würfel=Würfel.shuffleByMove();
	// console.log(Würfel.toString());
	
	
	//////////////////////////////
	// DEMO N=3
	//....verliert etwas das objektorientierte, kann man aber auch ???
	let würfel:Würfel;

	/*PAPA HERUMSPIELEN
	meldeÜberschrift('Lade PAPA Würfel');
	würfel=lade(würfeltyp3,'5 2 4 4 3 4 1 0 1 4 5 5 3 4 0 5 3 2 3 3 0 1 4 0 1 2 4 2 1 5 3 5 5 4 1 0 4 1 1 0 5 2 3 0 3 2 3 2 2 0 0 5 2 1');
	meldeWürfel(würfel);
	meldeÜberschrift('Lade PAPA Würfel');
	würfel=lade(würfeltyp3,'5 2 4 4 3 4 1 0 1 4 5 5 3 4 0 5 3 2 3 3 0 1 4 0 1 2 4 2 1 5 3 5 5 4 1 0 4 1 1 0 5 2 3 0 3 2 3 2 2 0 0 5 2 1');
	würfel=würfel.moveSlice(CubeDimension.X,0);
	meldeWürfel(würfel);	
	
	//Eine Ecke verdreht:
	würfel=lade(würfeltyp3,'5 2 4 4 3 4 5 0 1 4 5 3 1 4 0 5 3 2 3 3 0 1 4 0 1 2 4 2 1 5 3 5 5 4 1 0 4 1 1 0 5 2 3 0 3 2 3 2 2 0 0 5 2 1');
	meldeWürfel(würfel);	
	*/

	meldeÜberschrift('Erzeuge gelösten Würfel, Drehe R eine Scheibe im Uhrzeigersinn, Drehe 2Dw\' zwei Scheiben gegen Uhrzeigersinn')
	würfel=baueWürfelGelöst(würfeltyp3);
	meldeWürfel(würfel);	
	würfel=bewegeNachText(würfel,'R');
	meldeWürfel(würfel);	
	würfel=bewegeNachText(würfel,'2Dw\'');
	meldeWürfel(würfel);
	
	
	meldeÜberschrift('Erzeuge gelösten Würfel, führe die Zugfolge "R2 L2 U2 D2 B2 F2" aus')
	würfel=baueWürfelGelöst(würfeltyp3);
	würfel=bewegeNachText(würfel,'R2 L2 U2 D2 B2 F2');
	meldeWürfel(würfel);	

	meldeÜberschrift('Erzeuge verdrehten Würfel')
	würfel=baueWürfelVerdreht(würfeltyp3);
	meldeWürfel(würfel);
	
	meldeÜberschrift('Lade Würfel aus Beschreibung');
	würfel=lade(würfeltyp3,
'		2 2 2             '+
'		2 2 2             '+             
'		2 2 2             '+
' 4 4 4 0 0 0 1 1 1 3 3 3 '+
' 0 0 0 1 1 1 3 3 3 4 4 4 '+
' 0 0 0 1 1 1 3 3 3 4 4 4 '+
'		5 5 5             '+
'		5 5 5             '+
'		5 5 5             ');
	meldeWürfel(würfel);	

});
