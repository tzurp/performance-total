import { promises as fs } from 'fs';
import path from "path";
import appRoot from "app-root-path";
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

  public async createResultsDirIfNotExist(resultsPath?: string): Promise<string> {
    let npath = "";
    const root = appRoot.path;
    let isNotLegal = true;

    if (resultsPath) {
      isNotLegal = /[*"\[\]:;|,]/g.test(resultsPath);

      npath = path.normalize(resultsPath);
    };

    const resultsDir = npath == undefined || npath == "" || isNotLegal ? "performance-results" : npath;

    if (!root) {
      this._logger.error("Can't get root folder");

      return "";
    };

    const dirPath = path.join(root, resultsDir);

    const isFileExists = await this.isFileExist(dirPath);

    if (!isFileExists) {
      await this.makeDir(dirPath);
    };

    return dirPath;
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
}
