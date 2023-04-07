import { ParsedTemplate } from "./ParsedTemplate";
import { TemplateWarning } from "./TemplateWarning";


export function parse(templateText: string, variables: Map<string, { toString: () => string }>): ParsedTemplate {
  if(!templateText || !variables){
    return emptyTemplateWithWarnings(templateText, variables);
  }
  const parsedTemplate = templateWithReplacedVariablesFromMap(variables, templateText);
  return addWarningAboutNonReplacedVariables(parsedTemplate);
}

function emptyTemplateWithWarnings(templateText: string, variables: Map<string, { toString: () => string }>) {
  const warnings: TemplateWarning[] = [];
  if (!templateText) {
    warnings.push(TemplateWarning.create("Template text is null"));
  }
  if (!variables) {
    warnings.push(TemplateWarning.create("Variables map is null"));
  }
  return ParsedTemplate.create("", warnings);
}

function templateWithReplacedVariablesFromMap(variables: Map<string, { toString: () => string }>, templateText: string) {
  const warnings: TemplateWarning[] = [];
  variables.forEach((value, key) => {
    const variableName = formTemplateVariableName(key);
    if (!templateText.includes(variableName)) {
      warnings.push(TemplateWarning.create(`Variable ${key} not found in template`));
    }
    templateText = templateText.replace(variableName, value.toString());
  });
  return ParsedTemplate.create(templateText, warnings);
}

function addWarningAboutNonReplacedVariables(parsedTemplate: ParsedTemplate,) {
  const regex = /\$\{[a-zA-Z0-9-]+\}/g;
  const matches = parsedTemplate.text.match(regex);
  if (!matches) {
    return parsedTemplate;
  }
  const warnings: TemplateWarning[] = [];
  matches.forEach(match => {
    const variableName = match.substring(2, match.length - 1);
    warnings.push(TemplateWarning.create(`Variable ${variableName} could not be replaced`));
  });
  return ParsedTemplate.create(parsedTemplate.text, warnings);
}

function formTemplateVariableName(name:string){
  return "${" + name + "}"
}
