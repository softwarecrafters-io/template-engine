class TemplateWarning {
	private constructor(readonly message: string) {}

	static create(message: string) {
		return new TemplateWarning(message);
	}
}

class ParsedTemplate {
	private constructor(readonly text:string, readonly warnings: ReadonlyArray<TemplateWarning>) {}

	static create(text:string, warnings:TemplateWarning[]) {
		return new ParsedTemplate(text, warnings);
	}
}

function parse(templateText: string, variables: Map<string, { toString:()=> string }>) : ParsedTemplate {
	return ParsedTemplate.create(templateText, []);
}

describe('The Template Engine', ()=>{
    it('parses template without variables', ()=>{
			const templateText = 'This is a template with zero variables';
			const variables = new Map<string, { toString:()=> string }>;
			const parsedTemplate = parse(templateText, variables);

			expect(parsedTemplate.text).toBe('This is a template with zero variables');
    });

		it('parses template with one variable', ()=>{
			const templateText = 'This is a template with one ${variable}';
			const variables = new Map<string, { toString:()=> string }>;
			variables.set('variable', 'foo');
			const parsedTemplate = parse(templateText, variables);

			expect(parsedTemplate.text).toBe('This is a template with one foo');
    });
});
