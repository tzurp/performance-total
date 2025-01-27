import { promises as fs } from 'fs';
import path from "path";
import { Plogger } from './logger';

export class FileWriter {
  private static instance: FileWriter;
  private lock: Promise<void> = Promise.resolve();
  _logger: Plogger;

  private constructor() {
    this._logger = new Plogger();
  }

  public static getInstance(): FileWriter {
    if (!FileWriter.instance) {
      FileWriter.instance = new FileWriter();
    }

    return FileWriter.instance;
  }

  public async readAllLines(path: string): Promise<Array<string>> {
    let data = "";

    await this.lock;

    try {
      this.lock = this.lockFile();

      data = await fs.readFile(path, "utf-8");
    }
    catch (err) {
      this._logger.error(`An error occurred while reading file ${path}: ${err}`);
    }
    finally {
      await this.unlockFile();
    }

    const stringArray = data.split("\n");

    return stringArray;
  }

  public async writeToFile(path: string, data: string): Promise<void> {
    await this.lock;

    try {
      this.lock = this.lockFile();

      await fs.writeFile(path, data);
    }
    catch (err) {
      this._logger.error(`An error occurred while writing file ${path}: ${err}`);
    }
    finally {
      await this.unlockFile();
    }
  }

  public async appendLineToFile(path: string, data: string): Promise<void> {
    await this.lock;

    try {
      this.lock = this.lockFile();

      await fs.appendFile(path, data);
    }
    catch (err) {
      this._logger.error(`An error occurred while appending file ${path}: ${err}`);
    }
    finally {
      await this.unlockFile();
    }
  }

  public getFilePath(resultsDir: string, fileName: string): string {
    return path.join(resultsDir, fileName)
  }

  public async createResultsDirIfNotExist(resultsPath: string): Promise<string> {

    const dirPath = path.dirname(resultsPath);

    const isFileExists = await this.isFileExist(dirPath);

    if (!isFileExists) {
      await this.makeDir(dirPath);
    };

    return dirPath;
  }

  public async getFiles(dirPath: string): Promise<string[]> {
    try {
      const files = await fs.readdir(dirPath);

      return files.map((file) => path.join(dirPath, file));
    }
    catch (err) {
      this._logger.error(`An error occurred while reading files from directory ${dirPath}: ${err}`);

      return [];
    }
  }

  async isFile(path: string): Promise<boolean> {
    try {
      const stat = await fs.stat(path);
      if (stat.isFile()) {
        return true;
      }
      else if (stat.isDirectory()) {
        return false;
      }
      else {
        throw new Error(`The path ${path} is not a file or directory`);
      }
    }
    catch (error) {
      throw new Error(`Error accessing path: ${path}: ${error}`);
    }
  }

  private async makeDir(dirPath: string): Promise<void> {
    try {
      await fs.mkdir(dirPath, { recursive: true });
    }
    catch (err: any) {
      this._logger.error(`can't create directory ${dirPath}: ${err}`);
    }
  }

  private async isFileExist(dirPath: string): Promise<boolean> {
    let isExists = false;

    try {
      await fs.access(dirPath);
      isExists = true;
    }
    finally {
      return isExists;
    }
  }

  private async lockFile(): Promise<void> {
    await this.lock;

    this.lock = new Promise<void>((resolve: () => void) => {
      setImmediate(resolve);
    });
  }

  private async unlockFile(): Promise<void> {
    await this.lock;
    this.lock = Promise.resolve();
  }

  async getPackageVersion(): Promise<string> {
    try {
      const data = await fs.readFile('package.json', 'utf-8');
      const packageJson = JSON.parse(data);
      return packageJson.version;
    } catch (error) {
      console.error('Error reading package.json:', error);
      throw error;
    }
  }

}
