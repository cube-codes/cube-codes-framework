# If you change anything you need to run:
# node node_modules/nearley/bin/nearleyc.js 'src/cube-move/CubeMoveGrammar.ne' -o 'src/cube-move/CubeMoveGrammar.ts'

@preprocessor typescript

program -> repetition_sequence {% id %}

# Repetitions
repetition_sequence -> whitespace:? (repetition (whitespace repetition):* whitespace:?):? {% data => helper.repetition_sequence(data) %}
repetition          -> structure non_negative_integer:? "'":?                             {% data => helper.repetition(data) %}

# Structures
structure    -> group                                               {% id %}
			  | opconjugate                                         {% id %}
			  | opcommutator                                        {% id %}
			  | block                                               {% id %}
group        -> "(" repetition_sequence ")"                         {% data => helper.group(data) %}
opconjugate  -> "[" repetition_sequence ":" repetition_sequence "]" {% data => helper.opconjugate(data) %}
opcommutator -> "[" repetition_sequence "," repetition_sequence "]" {% data => helper.opcommutator(data) %}

# Blocks
block    -> range                                                      {% id %}
		  | slice                                                      {% id %}
		  | middle                                                     {% id %}
		  | inlay                                                      {% id %}
		  | rotation                                                   {% id %}
range    -> ((positive_integer "-"):? positive_integer):? [rufldb]     {% data => helper.range(data) %}
		  | ((positive_integer "-"):? positive_integer):? [RUFLDB] "w" {% data => helper.range(data) %}
slice    -> positive_integer:? [RUFLDB]                                {% data => helper.slice(data) %}
middle   -> [MES]                                                      {% data => helper.middle(data) %}
inlay    -> [mes]                                                      {% data => helper.inlay(data) %}
rotation -> [xyz]                                                      {% data => helper.rotation(data) %}

# Basics
positive_integer     -> [1-9] [0-9]:*    {% data => helper.positive_integer(data) %}
non_negative_integer -> positive_integer {% data => helper.non_negative_integer(data) %}
                      | "0"              {% data => helper.non_negative_integer(data) %}
whitespace           -> [ \t\n\r]:+      {% data => helper.whitespace(data) %}

@{%

import { CubeMoveGrammarHelper } from "./CubeMoveGrammarHelper";

const helper = new CubeMoveGrammarHelper();
	
%}