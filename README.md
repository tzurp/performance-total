# performance-total
With this plugin for [webdriver.io](https://webdriver.io/) you can easily add performance analysis to any flow of your tests.

<h2>Installation</h2>
Install this module locally with the following command to be used as a (dev-)dependency:

```
npm install performancetotal --save
npm install performancetotal --save-dev
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
            dropResultsFromFailedTest: false
        }]
      ]
  // ...
};
```
<h2>Usage in test</h2>
```
it("should test github startup performance", () => {
            // ...
            performancetotal.sampleStart("Startup");
            
            browser.url("https://github.com/");
            
            performancetotal.sampleEnd("Startup");
            //...
        });
        
```
Of course you need to run the test several times to increase the samples population.

<h2>Getting the results</h2>
A new directory named `performance-results` is created in your project's root folder and when all the tests are completed two files are created inside it: `performance-results.json` and `performance-results.csv` with the analyzed data including: average time, standard error of mean,  (sem), number of samples, min value, max value, earliest time and latest time.

<h2>Typescript support</h2>
Typescript is supported for this plugin.