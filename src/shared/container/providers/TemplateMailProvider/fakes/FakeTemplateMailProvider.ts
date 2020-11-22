import ITemplateMailProvider from '../models/ITemplateMailProvider';

export default class FakeTemplateMailProvider implements ITemplateMailProvider {
  public async parse(): Promise<string> {
    return 'Mail content';
  }
}
