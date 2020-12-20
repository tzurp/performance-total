import performanceTotal from "./performance-total";

export default class PerformanceTotalService {
    browser: WebdriverIO.BrowserObject;
    _serviceOptions: { appendToExistingFile: boolean };
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
    constructor(serviceOptions: { appendToExistingFile: boolean } = { appendToExistingFile: true }, capabilities: any, config: any, browser: WebdriverIO.BrowserObject) {
        this.browser = browser
        this._serviceOptions = serviceOptions;
    }

    before(config: any, capabilities: any) {
        // TODO: something before all tests are run, e.g.:
        console.log("Hook BEFORE ALL TESTS");
    }

    beforeTest(test: any, context: any) {
        console.log("Hook BEFORE test");

        performanceTotal.initialize(this._serviceOptions.appendToExistingFile);
    }

    afterTest(test: any, context: any, { error, result, duration, passed, retries }: any) {
        console.log("Hook AFTER test");
        performanceTotal.finalize();
    }

    after(exitCode: any, config: any, capabilities: any) {
        // TODO: something after all tests are run
        console.log("Hook AFTER ALL tests are run");
        performanceTotal.analyzeResults();
    }

    // other hooks or custom service methods ...
}