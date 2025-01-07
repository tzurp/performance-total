# performance-total
Note:<br/>
For WebdriverIO v8 use version 3.x.x.<br/>
For WebdriverIO v7 use version 2.x.x.<br/>
For WebdriverIO v6 use version 1.x.x.

---

![chart](resources/chart.png)

With this plugin for [webdriver.io](https://webdriver.io/) you can easily add performance analysis to any flow in your tests, whether it's a pure UI, API, or a combination of both. This plugin provides a simple and efficient way to measure the response times of various procedures and identify potential bottlenecks in your application. With this information, you can make informed decisions about optimizations and improvements to enhance the overall performance of your application.

<h2>Installation</h2>
The easiest way to install this module as a dev dependency is by using the following command:

```
npm install wdio-performancetotal-service --save-dev
```

<h2>Usage</h2>

Add wdio-performancetotal-service to your `wdio.conf.js`:

```
exports.config = {
  // ...
  services: ['performancetotal']
  // ...
};
```
...or with the service options:

```
exports.config = {
  // ...
  services: [
      ['performancetotal',
      // The options (with default values)
        {
            disableAppendToExistingFile: false,
            performanceResultsFileName: "performance-results",
            dropResultsFromFailedTest: false,
            performanceResultsDirectory: "performance-results",
            analyzeByBrowser: false,
            recentDays: 0
        }]
      ]
  // ...
};
```

<h2>Options</h2>

<h3>disableAppendToExistingFile</h3>

When set to `true`, new test runs will start fresh and overwrite any existing performance data.
When set to `false` (default), performance data will be added to the existing data.

<h3>performanceResultsFileName</h3>

You can set the default results file name (`performance-results`).
A newly created results file normally overwrites the old file. If you want to keep old files, it is recommended to add a timestamp to the file name. For example:

```
...
performanceResultsFileName: `performance-results_${new Date().getTime()}`
...
```

<h3>dropResultsFromFailedTest</h3>

Default is `false`. When the value is set to `true`, performance analysis from failed tests would be excluded.

<h3>recentDays</h3>
To set the number of days to consider for performance analysis set the number of days. Partial days are also supported (e.g. `recentDays: 0.5`)

<h3>performanceResultsDirectory</h3>
You can override the default path for the results directory in the project's root dir.
For example:

```
...
performanceResultsFileName: "results-dir/performance-total-results"
...
```

<h3>analyzeByBrowser</h3>
Default is `false`. If true, the performance data would be grouped also by the browser type.


<h2>Usage in test</h2>

Just import <b>performancetotal</b> where you need it, whether it be in your test file or any other class. This object provides methods for measuring performance data in your tests, including sampleStart and sampleEnd for starting and ending performance measurements.
Here's an example of how you might use the performancetotal object to measure the startup performance of two websites:

```
// This test case measures the startup performance of Github and SourceForge using the performancetotal object.

import { performancetotal } from "wdio-performancetotal-service";

it("should test github and sourceforge startup performance", () => {
    // Start a new performance measurement for Github
    performancetotal.sampleStart("GH-Startup");

    // Navigate to Github
    browser.url("https://github.com/");

    // End the Github measurement and save the results
    performancetotal.sampleEnd("GH-Startup");

    // ...

    // Start a new performance measurement for SourceForge
    performancetotal.sampleStart("SF-Startup");

    // Navigate to SourceForge
    await browser.url("https://sourceforge.net/");

    // End the SourceForge measurement and save the results
    performancetotal.sampleEnd("SF-Startup");
});

```

You can retrieve the time taken for a single performance sample by calling performancetotal.getSampleTime(sampleName) in your test. This allows you to check the performance of a specific section of code and ensure that it meets your expectations.

```
// Get the time taken for a single sample
const sampleTime = performancetotal.getSampleTime(sampleName);

```

<h2>Getting the results</h2>

When all the tests are completed, a new results directory is created in your project's root folder (the default directory name is performance-results). Inside this directory, two files are created: performance-results.json and performance-results.csv. These files contain analyzed data for each sample, including the average time, standard error of mean (SEM), number of samples, minimum value, maximum value, earliest time, and latest time. You can use this data to identify any performance regressions or improvements over time.

<h2>Typescript support</h2>

Typescript is supported for this plugin.