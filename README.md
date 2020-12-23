# performance-total
With this plugin for [webdriver.io](https://webdriver.io/) you can easily add performance analysis to any flow of your tests.

<h2>Installation</h2>
Install this module locally with the following command to be used as a (dev-)dependency:

```
npm install performancetotal --save
npm install performancetotal --save-dev
```

<h2>Usage</h2>

It should be as easy as adding wdio-performancetotal-service to your `wdio.conf.js`:
```
exports.config = {
  // ...
  services: ['performancetotal']
  // ...
};
```
or with the service options:
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
