import IStorageProvider from '../models/IStorageProvider';

export default class FakeDiskStorageProvider implements IStorageProvider {
  private storage: string[] = [];

  public async saveFile(file: string): Promise<string> {
    this.storage.push(file);

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const findIndex = this.storage.findIndex(s => s === file);

    this.storage.splice(findIndex, 1);
  }
}
