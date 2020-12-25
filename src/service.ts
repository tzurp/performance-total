import performanceTotal from "./performance-total";

export default class PerformanceTotalService {
    browser: WebdriverIO.BrowserObject;
    _serviceOptions: { disableAppendToExistingFile: boolean, performanceResultsFileName: string, dropResultsFromFailedTest: boolean };
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
    constructor(serviceOptions: { disableAppendToExistingFile: boolean, performanceResultsFileName: string, dropResultsFromFailedTest: boolean }, capabilities: any, config: any, browser: WebdriverIO.BrowserObject) {
        this.browser = browser
        this._serviceOptions = serviceOptions;
    }

    before(config: any, capabilities: any) {
        // before all tests run
    }

    async beforeTest(test: any, context: any) {
        await performanceTotal.initialize(this._serviceOptions.disableAppendToExistingFile);
    }

    afterTest(test: any, context: any, { error, result, duration, passed, retries }: any) {
        performanceTotal.finalize(passed);
    }

    after(exitCode: any, config: any, capabilities: any) {
        performanceTotal.analyzeResults(this._serviceOptions.performanceResultsFileName, this._serviceOptions.dropResultsFromFailedTest);
    }
}