import { promises as fs } from 'fs';
import path from "path";
import appRoot from "app-root-path";

export class FileWriter {
  private static instance: FileWriter;
  private lock: Promise<void> = Promise.resolve();

  private constructor() {
  }

  public static getInstance(): FileWriter {
    if (!FileWriter.instance) {
      FileWriter.instance = new FileWriter();
    }

    return FileWriter.instance;
  }

  public async readAllLines(path: string): Promise<Array<string>> {
    await this.lock;
    let data = "";
    try {
      this.lock = this.lockFile();
      data = await fs.readFile(path, "utf-8");
    } catch (error) {
      console.error(`An error occurred while reading file ${path}:`, error);
    } finally {
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
    } catch (error) {
      console.error(`An error occurred while writing file ${path}:`, error);
    } finally {
      await this.unlockFile();
    }
  }

  public async appendLineToFile(path: string, data: string): Promise<void> {
    await this.lock;
    try {
      this.lock = this.lockFile();
      await fs.appendFile(path, data);
    } catch (error) {
      console.error(`An error occurred while appending file ${path}:`, error);
    } finally {
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
    }

    const resultsDir = npath == undefined || npath == "" || isNotLegal ? "performance-results" : npath;

    if (!root) { console.log("Performance-Total error: Can't get root folder"); return "" }

    const dirPath = path.join(root, resultsDir);

    const isFileExists = await this.isFileExist(dirPath);

    if (!isFileExists) {
      await this.makeDir(dirPath);
    }

    return dirPath;
  }

  private async makeDir(dirPath: string): Promise<void> {
    try {
      await fs.mkdir(dirPath, { recursive: true });
    }
    catch (err: any) {
      console.log(`Performance-Total error: can't create dir: ${dirPath}: ${err}, ${err.stack}`);
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
