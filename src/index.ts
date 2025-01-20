#!/usr/bin/env node

import { PerformanceAnalyzer } from "./performance-analyzer";

async function main() {
    console.log("\x1b[34m%s\x1b[0m",`Welcome to Performancetotal-cli By Tzur Paldi @2024-${new Date().getFullYear()}`);
    const argv = process.argv.slice(2);
    const [logFileName, destinationDir, ...restArgs] = argv;

    if (!logFileName || !destinationDir) {
        console.error("Error: Two mandatory arguments are required (e.g. performancetotal-cli path/to/source/directory path/to/result/directory");
        process.exit(1);
    }
    const dropFailedResults = restArgs.includes('drop-failed-results')? true:false;
    const analyzeByBrowser = restArgs.includes('analyze-by-browser')? true:false;
    let recentDays = 0;
    
    const isRecentDays = restArgs.find((arg)=> arg.includes('recent-days'));
    
    if(isRecentDays){
        recentDays = parseFloat(isRecentDays.split('=')[1].trim());
    }

    await new PerformanceAnalyzer().analyze({logFileName:logFileName, saveDataFilePath:destinationDir, dropResultsFromFailedTest:dropFailedResults, analyzeByBrowser:analyzeByBrowser, recentDays:recentDays}, );
}
main();
