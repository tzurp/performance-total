export function printHelp() {
    console.log(`
        \x1b[32mUsage:\x1b[0m
          performancetotal-cli <logFileName> <destinationDir> [options]
        
        \x1b[32mOptions:\x1b[0m
          --drop-failed-results    Drop results from failed tests
          --analyze-by-browser     Analyze results by browser
          --recent-days=<number>   Analyze results from the recent number of days
        
        \x1b[32mExample:\x1b[0m
          performancetotal-cli performance-log.json ./results --drop-failed-results --analyze-by-browser --recent-days=7
          performancetotal-cli path/to/source/directory ./results --drop-failed-results --analyze-by-browser --recent-days=7
                `);
}
