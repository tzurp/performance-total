#!/usr/bin/env node

import { PerformanceAnalyzer } from "./performance-analyzer";
import { FileWriter } from "./helpers/file-writer";
import { printHelp } from "./helpers/help";

async function main() {
    const ver = await FileWriter.getInstance().getPackageVersion();

    console.log("\x1b[34m%s\x1b[0m", `Performancetotal-cli (v${ver}) By Tzur Paldi © 2024-${new Date().getFullYear()}`);

    const argv = process.argv.slice(2);
    const [logFileName, destinationDir, ...restArgs] = argv;

    if (logFileName == '--help') {
        printHelp();
        process.exit(0);
    }

    if (!logFileName || !destinationDir || destinationDir.includes('--')) {
        console.error("Error: Two mandatory arguments are required");

        printHelp();

        process.exit(1);
    }

    const dropFailedResults = restArgs.includes('--drop-failed-results');
    const analyzeByBrowser = restArgs.includes('--analyze-by-browser');

    let recentDays = 0;

    const isRecentDays = restArgs.find((arg) => arg.includes('--recent-days'));

    if (isRecentDays) {
        recentDays = parseFloat(isRecentDays.split('=')[1].trim());
    }

    await new PerformanceAnalyzer().analyze({ logFileName: logFileName, saveDataFilePath: destinationDir, dropResultsFromFailedTest: dropFailedResults, analyzeByBrowser: analyzeByBrowser, recentDays: recentDays },);
}
main();
