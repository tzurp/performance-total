import randomize from "../../dev-dep/randomize";
import {performancetotal} from "../../app";

beforeEach(() => {
    console.log("Before hook");
    performancetotal.initialize(true);
});

afterEach(() => {
    console.log("Test finished");
    performancetotal.finalize(true);
    browser.reloadSession();
});

after(() => {
    performancetotal.analyzeResults();
});

describe('suite-1', () => {
    for (let i = 0; i < 3; i++) {

        it(`Test demo. Run ${i + 1}`, () => {
            console.log("Test Started");

            // Test Earnix website startup
            performancetotal.sampleStart("Startup");
            browser.url("https://earnix.com/");
            performancetotal.sampleEnd("Startup");

            // Test nested process
            performancetotal.sampleStart("Wrap");

            // Test weather API performance
            performancetotal.sampleStart("WeatherAPI");
            browser.url("http://www.7timer.info/bin/api.pl?lon=113.17&lat=23.09&product=astro&output=xml");
            performancetotal.sampleEnd("WeatherAPI");

            // Simulate additional task inside 'Wrap'
            browser.pause(1000 + randomize.RandomPlusMinus(200));

            performancetotal.sampleEnd("Wrap");
        });
    }
});