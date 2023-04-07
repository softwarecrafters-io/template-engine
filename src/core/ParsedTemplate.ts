import { TemplateWarning } from "./TemplateWarning";

export class ParsedTemplate {
  private constructor(readonly text: string, readonly warnings: ReadonlyArray<TemplateWarning>) {}

  static create(text: string, warnings: TemplateWarning[]) {
    return new ParsedTemplate(text, warnings);
  }

  containsWarnings() {
    return this.warnings.length > 0;
  }
}
