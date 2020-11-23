import handlebars from 'handlebars';
import fs from 'fs';

import IParseTemplateMailDTO from '../dtos/IParseTemplateMailDTO';
import ITemplateMailProvider from '../models/ITemplateMailProvider';

class HandlebarsMailTemplateProvider implements ITemplateMailProvider {
  public async parse({
    file,
    variables,
  }: IParseTemplateMailDTO): Promise<string> {
    const templateFileContent = await fs.promises.readFile(file, {
      encoding: 'utf-8',
    });

    const parseTemplate = handlebars.compile(templateFileContent);

    return parseTemplate(variables);
  }
}

export default HandlebarsMailTemplateProvider;
