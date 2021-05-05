export function html(literals: TemplateStringsArray, ...expressions: string[]): string {
	let result = '';
	literals.forEach((literal, index) => {
		result += literal + (expressions[index] || '');
	});
	return result;
}