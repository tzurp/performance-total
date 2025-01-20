# performancetotal-cli

![chart](resources/chart.png)

Unlock the full potential of your performance data with the `performancetotal-cli` app! Seamlessly analyze and visualize performance results generated by the `performance-total` plugin. Whether you're dealing with individual files or entire directories, this powerful CLI tool provides comprehensive insights to help you optimize and enhance your application's performance.

## Installation

Install the app globally using the following command:

```
npm install -g performancetotal-cli
```

## Usage

There are two mandatory parameters for `performancetotal-cli`:

1. **Source Path**: The absolute path to the source file or directory. If a directory path is provided, all files within that directory will be used as data sources.
2. **Destination Path**: The absolute path to the destination directory where the results will be saved.

```
performancetotal-cli path/to/performance-log.txt path/to/result/directory
```

or

```
performancetotal-cli path/to/source/directory path/to/result/directory
```

## Options


### drop-failed-results

Default is `false`. When the option is used, performance analysis from failed tests would be excluded.

```
performancetotal-cli path/to/performance-log.txt path/to/result/directory/ drop-failed-results
```

### recent-days

Default is `0` (no limit). To set the number of days to consider for performance analysis, set the number of days.

```
performancetotal-cli path/to/performance-log.txt path/to/result/directory/ recent-days=3
```

Please note that partial days are also supported (e.g. `recent-days=0.5`)

### analyze-by-browser

Default is `false`. If used, the performance data would be analyzed also by the browser type.

```
performancetotal-cli path/to/performance-log.txt path/to/result/directory/ analyze-by-browser
```

## Getting the results

The results would be saved to the destination directory with 2 files: performance-results.csv and performance-results.json.

## Support

For support and suggestions, feel free to contact me at [tzur.paldi@outlook.com](mailto:tzur.paldi@outlook.com).