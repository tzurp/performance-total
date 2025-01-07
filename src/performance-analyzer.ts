import { PerformanceLogEntry } from "./entities/performance-log-entry";
import { PerformanceResult } from "./entities/performance-result";
import calculator from "./helpers/calculator";
import { FileWriter } from "./helpers/file-writer";
import helperMethods from "./helpers/group";
import ObjectsToCsv from 'objects-to-csv';
import { Plogger } from "./helpers/logger";

export class PerformanceAnalyzer {
    _performanceResults: Array<PerformanceResult>;
    _logger: Plogger;

    constructor() {
        this._performanceResults = new Array<PerformanceResult>();
        this._logger = new Plogger();
    }

    async analyze(logFileName: string, saveDataFilePath: string, dropResultsFromFailedTest: boolean | undefined, analyzeByBrowser: boolean | undefined, recentDays: number | undefined): Promise<void> {
        let performanceLogEntries = await this.deserializeData(logFileName);
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

        this._logger.info(`\nPerformance-Total results saved to: ${saveDataFilePath}.csv/json\n`);
    }

    private async serializeData(saveDataFilePath: string) {
        const fileWriter = FileWriter.getInstance();

        await fileWriter.writeToFile(saveDataFilePath + ".json", JSON.stringify(this._performanceResults));

        const csv = new ObjectsToCsv(this._performanceResults);

        const csvString = await csv.toString(true);

        await fileWriter.writeToFile(saveDataFilePath + ".csv", csvString);
    }

    private async deserializeData(fileName: string): Promise<Array<PerformanceLogEntry>> {
        const resultsArray = new Array<PerformanceLogEntry>();

        const textResultsArray = await FileWriter.getInstance().readAllLines(fileName);

        textResultsArray.forEach(textResult => {
            if (textResult != "") {
                const performanceResult = JSON.parse(textResult) as PerformanceLogEntry;

                if (performanceResult.id !== undefined) {
                    resultsArray.push(performanceResult);
                }
            }
        });

        return resultsArray;
    }
}