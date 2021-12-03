export function html(literals: TemplateStringsArray, ...expressions: string[]): string {
	let result = '';
	literals.forEach((literal, index) => {
		result += literal + (expressions[index] || '');
	});
	return result;
}

export function escape(value: string): string {
	return value.replace(/</g, '&lt;').replace(/(\n\r)|\n|\r/g, '<br />');
}