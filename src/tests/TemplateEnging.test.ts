import { parse } from "../core/TemplateEngine";

describe('The Template Engine', ()=>{
    it('parses template without variables', ()=>{
			const templateText = 'This is a template with zero variables';
			const variables = new Map();
			const parsedTemplate = parse(templateText, variables);

			expect(parsedTemplate.text).toBe('This is a template with zero variables');
    });

		it('parses template with one variable', ()=>{
			const templateText = 'This is a template with one ${variable}';
			const variables = new Map();
			variables.set('variable', 'foo');
			const parsedTemplate = parse(templateText, variables);

			expect(parsedTemplate.text).toBe('This is a template with one foo');
    });

		it('parses template with multiple variables', ()=>{
			const templateText = 'This is a template with multiple variables ${variable} ${other-variable} ${another-variable}';
			const variables = new Map();
			variables.set('variable', 'foo');
			variables.set('other-variable', 'bar');
			variables.set('another-variable', 'foobar');
			const parsedTemplate = parse(templateText, variables);

			expect(parsedTemplate.text).toBe('This is a template with multiple variables foo bar foobar');
    });

		it('parses template with multiple types', ()=>{
			const variables = new Map();
			variables.set('user', 'john');
			variables.set('age', 35);
			const aDate = new Date();
			variables.set('today', aDate);
			const parsedTemplate = parse('${user} ${age} ${today}', variables);

			expect(parsedTemplate.text).toBe('john 35 ' + aDate.toString());
    });

		it('warns about variables not being found', ()=>{
			const variables = new Map();
			variables.set('user', 'john');
			variables.set('age', 35);
			const aDate = new Date();
			variables.set('today', aDate);

			const parsedTemplate = parse('${user}', variables);

			expect(parsedTemplate.text).toBe('john');
			expect(parsedTemplate.containsWarnings()).toBe(true);
			expect(parsedTemplate.warnings[0].message).toBe('Variable age not found in template');
			expect(parsedTemplate.warnings[1].message).toBe('Variable today not found in template');
    });

		it('warns about non replaced variables', ()=>{
			const variables = new Map();
			const parsedTemplate = parse('${user} ${age}', variables);

			expect(parsedTemplate.text).toBe('${user} ${age}');
			expect(parsedTemplate.containsWarnings()).toBe(true);
			expect(parsedTemplate.warnings[0].message).toBe('Variable user could not be replaced');
			expect(parsedTemplate.warnings[1].message).toBe('Variable age could not be replaced');
		});

		it('warns about null or empty arguments', ()=>{
			const parsedTemplate = parse(null, null);

			expect(parsedTemplate.text).toBe('');
			expect(parsedTemplate.containsWarnings()).toBe(true);
			expect(parsedTemplate.warnings[0].message).toBe('Template text is null');
			expect(parsedTemplate.warnings[1].message).toBe('Variables map is null');
		});
});
