import { Grammar } from 'nearley';
import grammar from './CubeMoveGrammar';

export class CubeMoveGrammarBuilder {

	static build(): Grammar {
		return Grammar.fromCompiled(grammar);
	}

}