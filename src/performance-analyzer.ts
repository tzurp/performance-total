import { PerformanceLogEntry } from "./entities/performance-log-entry";
import { PerformanceResult } from "./entities/performance-result";
import calculator from "./helpers/calculator";
import fileWriter from "./helpers/file-writer";
import helperMethods from "./helpers/group";
import ObjectsToCsv from 'objects-to-csv';

export class PerformanceAnalyzer {
    _performanceResults: Array<PerformanceResult>;

    constructor() {
        this._performanceResults = new Array<PerformanceResult>();
    }

    async analyze(logFileName: string, saveDataFilePath: string, dropResultsFromFailedTest: boolean | undefined, analyzeByBrowser: boolean | undefined): Promise<void> {
        let performanceLogEntries = await this.deserializeData(logFileName);
        let groupedResults: PerformanceLogEntry[][];

        if (dropResultsFromFailedTest) {
            const entriesWithTestPass = performanceLogEntries.filter((e) => e.isTestPassed == true);

            performanceLogEntries = entriesWithTestPass;
        }

        groupedResults = !analyzeByBrowser ? helperMethods.groupBy(performanceLogEntries, p => [p.name]) : helperMethods.groupBy(performanceLogEntries, p => [p.name, p.browserName]);
        
        groupedResults.forEach(group => {
            const durationList = group.map(t => t.duration);
            const performanceResult = new PerformanceResult();

            const avgAndSte = calculator.getAverageAndStandardDeviation(durationList);

            performanceResult.name = group[0].name;
            performanceResult.browserName = analyzeByBrowser ? group[0].browserName : "general";
            performanceResult.earliestTime = group[0].startDisplayTime;
            performanceResult.latestTime = group[group.length - 1].startDisplayTime;
            performanceResult.averageTime = avgAndSte[0];
            performanceResult.sem = avgAndSte[1];
            performanceResult.repeats = durationList.length;
            performanceResult.minValue = Math.min(...durationList);
            performanceResult.maxValue = Math.max(...durationList);

            this._performanceResults.push(performanceResult);
        });

        const picked = this._performanceResults.map(({ name, browserName, averageTime, sem, repeats, minValue, maxValue }) => ({ name, browserName, averageTime, sem, repeats, minValue, maxValue }))

        console.log("\nPerformance-Total results:\n")

        console.table(picked);

        await this.serializeData(saveDataFilePath);
    }

    private async serializeData(saveDataFilePath: string) {
        const jsonDataFilePath = saveDataFilePath + ".json";

        await fileWriter.appendLineToFile(jsonDataFilePath, JSON.stringify(this._performanceResults));

        // write to csv
        const csv = new ObjectsToCsv(this._performanceResults);

        const csvString = await csv.toString(true);

        await fileWriter.writeToFile(saveDataFilePath + ".csv", csvString);
    }

    private async deserializeData(fileName: string): Promise<Array<PerformanceLogEntry>> {
        const resultsArray = new Array<PerformanceLogEntry>();

        const textResultsArray = await fileWriter.readAllLines(fileName);

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