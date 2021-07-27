import performanceTotal from "./performance-total";

enum Status {
    UNKNOWN = 0,
    PASSED = 1,
    SKIPPED = 2,
    PENDING = 3,
    UNDEFINED = 4,
    AMBIGUOUS = 5,
    FAILED = 6
}

export default class PerformanceTotalService {
    _browser: WebdriverIO.Browser;
    _serviceOptions: { disableAppendToExistingFile: boolean, performanceResultsFileName: string, dropResultsFromFailedTest: boolean, analyzeByBrowser: boolean, performanceResultsDirectory: string };
    /**
     * `serviceOptions` contains all options specific to the service
     * e.g. if defined as follows:
     *
     * ```
     * services: [['custom', { foo: 'bar' }]]
     * ```
     *
     * the `serviceOptions` parameter will be: `{ foo: 'bar' }`
     */
    constructor(serviceOptions: { disableAppendToExistingFile: boolean, performanceResultsFileName: string, dropResultsFromFailedTest: boolean, analyzeByBrowser: boolean, performanceResultsDirectory: string }, capabilities: any, config: any, browser: WebdriverIO.Browser) {
        this._browser = browser
        this._serviceOptions = serviceOptions;
    }

    before(config: any, capabilities: any) {
        // before all tests run
    }

    async beforeTest(test: any, context: any) {
        await performanceTotal.initialize(this._serviceOptions.disableAppendToExistingFile, this._serviceOptions.performanceResultsDirectory);
    }

    async beforeScenario(test: any, context: any) {
        await performanceTotal.initialize(this._serviceOptions.disableAppendToExistingFile, this._serviceOptions.performanceResultsDirectory);
    }

    //@ts-ignore
    afterTest(test: any, context: any, { error, result, duration, passed, retries }) {
        performanceTotal.finalize(this._browser, passed);
    }

    afterScenario(test: any, context: any) {
        performanceTotal.finalize(this._browser, test.result.status == Status.PASSED);
    }

    async after(exitCode: any, config: any, capabilities: any) {
        await performanceTotal.analyzeResults({performanceResultsFileName: this._serviceOptions.performanceResultsFileName, dropResultsFromFailedTest: this._serviceOptions.dropResultsFromFailedTest, analyzeByBrowser: this._serviceOptions.analyzeByBrowser});
    }
}
