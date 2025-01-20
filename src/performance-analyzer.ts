import { PerformanceLogEntry } from "./entities/performance-log-entry";
import { PerformanceResult } from "./entities/performance-result";
import calculator from "./helpers/calculator";
import { FileWriter } from "./helpers/file-writer";
import helperMethods from "./helpers/group";
import ObjectsToCsv from 'objects-to-csv';
import { Plogger } from "./helpers/logger";
import path from "path";

export class PerformanceAnalyzer {
    _performanceResults: Array<PerformanceResult>;
    _logger: Plogger;
    _resultsFIleName = "performance-results";

    constructor() {
        this._performanceResults = new Array<PerformanceResult>();
        this._logger = new Plogger();
    }

    async getRawData(sourcePath: string): Promise<PerformanceLogEntry[]> {
        const fileWriter = FileWriter.getInstance();
        const isFile = await fileWriter.isFile(sourcePath);

        if(isFile){
            let performanceLogEntries = await this.deserializeData(sourcePath);

            return performanceLogEntries;
        }
        else {
            const files = await fileWriter.getFiles(sourcePath);
            let performanceLogEntries: PerformanceLogEntry[] = [];

            for (const file of files) {
                let entries: PerformanceLogEntry[] = [];
                try {
                    entries = await this.deserializeData(file);
                } catch (error) {
                    this._logger.error(`Failed to deserialize data from file: ${file}: ${error}`);
                    continue;
                }

                performanceLogEntries = performanceLogEntries.concat(entries);
            }

            return performanceLogEntries;
        }
    }

    async analyze({logFileName, saveDataFilePath, dropResultsFromFailedTest=false, analyzeByBrowser=false, recentDays=0}:{
        logFileName: string, 
        saveDataFilePath: string, 
        dropResultsFromFailedTest: boolean, 
        analyzeByBrowser: boolean, 
        recentDays: number
    }): Promise<void> {
        const source = path.resolve(saveDataFilePath);
        saveDataFilePath = source; // path.join(source, "performance-results");
        // let performanceLogEntries = await this.deserializeData(logFileName);
        let performanceLogEntries = await this.getRawData(logFileName);
        let groupedResults: PerformanceLogEntry[][];

        if (dropResultsFromFailedTest || recentDays) {
            const cutoffDate = Date.now() - ((recentDays || 0) * 24 * 60 * 60 * 1000);
            const filteredEntries = performanceLogEntries.filter((e) => {
                if (recentDays && e.startTime < cutoffDate) {
                    return false;
                }
                if (dropResultsFromFailedTest) {
                    return e.isTestPassed;
                }
                
                return true;
            });
            performanceLogEntries = filteredEntries;
        }

        if (!performanceLogEntries || performanceLogEntries.length == 0) {
            this._logger.error(`No performance log entries found [recent-days=${recentDays}]`);

            return;
        }

        groupedResults = !analyzeByBrowser ? helperMethods.groupBy(performanceLogEntries, p => [p.name]) : helperMethods.groupBy(performanceLogEntries, p => [p.name, p.brName]);

        groupedResults.forEach(group => {
            const durationList = group.map(t => t.duration);
            const performanceResult = new PerformanceResult();

            const avgAndSte = calculator.getAverageAndStandardDeviation(durationList);

            performanceResult.name = group[0].name;
            performanceResult.brName = analyzeByBrowser ? group[0].brName : "general";
            performanceResult.earliestTime = group[0].startDisplayTime;
            performanceResult.latestTime = group[group.length - 1].startDisplayTime;
            performanceResult.avgTime = avgAndSte[0];
            performanceResult.sem = avgAndSte[1];
            performanceResult.repeats = durationList.length;
            performanceResult.minValue = Math.min(...durationList);
            performanceResult.maxValue = Math.max(...durationList);

            this._performanceResults.push(performanceResult);
        });

        const picked = this._performanceResults.map(({ name, brName, avgTime, sem, repeats, minValue, maxValue }) => ({ name, brName, avgTime, sem, repeats, minValue, maxValue }));

        this._logger.info("Performance-Total results:");

        console.table(picked);

        await this.serializeData(saveDataFilePath);

        this._logger.info(`\nPerformance-Total results [recent-days=${recentDays}] saved to: ${saveDataFilePath}.csv/json\n`);
    }

    private async serializeData(saveDataFilePath: string) {
        const fileWriter = FileWriter.getInstance();

        await fileWriter.writeToFile(path.join(saveDataFilePath, `${this._resultsFIleName}.json`), JSON.stringify(this._performanceResults));

        const csv = new ObjectsToCsv(this._performanceResults);

        const csvString = await csv.toString(true);

        await fileWriter.writeToFile(path.join(saveDataFilePath, `${this._resultsFIleName}.csv`), csvString);
    }

    private async deserializeData(fileName: string): Promise<Array<PerformanceLogEntry>> {
        const resultsArray = new Array<PerformanceLogEntry>();
        let textResultsArray = await FileWriter.getInstance().readAllLines(fileName);

        const convertedTextResultsArray = textResultsArray.map(textResult => 
            textResult
              .replace("start_time", "startTime")
              .replace("is_test_passed", "isTestPassed")
              .replace("instance_id", "instanceId")
              .replace("start_display_time", "startDisplayTime")
              .replace("br_name", "brName")
          );
          
        textResultsArray = convertedTextResultsArray;

        textResultsArray.forEach(textResult => {
            if (textResult.trim() != "") {
                const performanceResult = JSON.parse(textResult) as PerformanceLogEntry;

                if (performanceResult.id !== undefined) {
                    resultsArray.push(performanceResult);
                }
            }
        });

        return resultsArray;
    }
}