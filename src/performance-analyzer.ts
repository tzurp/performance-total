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

    analyze(logFileName: string, saveDataFilePath: string, dropResultsFromFailedTest: boolean | undefined): void {
        const performanceLogEntries = this.deserializeData(logFileName);
        let groupedResults: PerformanceLogEntry[][];

        if(!dropResultsFromFailedTest) {
            groupedResults = helperMethods.groupBy(performanceLogEntries, p => p.name);
        }
        else {
            const entriesWithTestPass = performanceLogEntries.filter((e) => e.isTestPassed === true);
            groupedResults = helperMethods.groupBy(entriesWithTestPass, p => p.name);
        }

        groupedResults.forEach(group => {
            const durationList = group.map(t => t.duration);
            const performanceResult = new PerformanceResult();

            const avgAndSte = calculator.getAverageAndStandardDeviation(durationList);

            performanceResult.name = group[0].name;
            performanceResult.earliestDateTime = group[0].startDisplayTime;
            performanceResult.latestDateTime = group[group.length -1].startDisplayTime;
            performanceResult.averageTime = avgAndSte[0];
            performanceResult.standardError = avgAndSte[1];
            performanceResult.repeats = durationList.length;
            performanceResult.minValue = Math.min(...durationList);
            performanceResult.maxValue = Math.max(...durationList);
            
            this._performanceResults.push(performanceResult);
        });

        this.serializeData(saveDataFilePath);
    }

    private async serializeData(saveDataFilePath: string) {
        const jsonDataFilePath = saveDataFilePath + ".txt";
        
        fileWriter.appendLineToFile(jsonDataFilePath, JSON.stringify(this._performanceResults));

        // write to csv
        const csv = new ObjectsToCsv( this._performanceResults);

        const csvString = await csv.toString(true);

        fileWriter.writeToFile(saveDataFilePath + ".csv", csvString);
    }

    private deserializeData(fileName: string): Array<PerformanceLogEntry> {
        const resultsArray = new Array<PerformanceLogEntry>();

        const textResultsArray = fileWriter.readAllLines(fileName);

        textResultsArray.forEach(textResult => {
            if (textResult != "" ) {
                const performanceResult = JSON.parse(textResult) as PerformanceLogEntry;

                if (performanceResult.id !== undefined) {
                    resultsArray.push(performanceResult);
                }
            }
        });

        return resultsArray;
    }
}