import {performancetotal} from "../../app";
import "./test-base";


describe('suite-1', () => {
    for (let i = 0; i < 3; i++) {
        it(`Test GH vs. SF: Run ${i + 1}`, async () => {
            console.log("Test started");

            await browser.url("https://web.telegram.org/");
            
            performancetotal.sampleStart("GH-Startup");
            
            await browser.url("https://github.com/");
            
            performancetotal.sampleEnd("GH-Startup");

            performancetotal.sampleStart("SF-Startup");
            
            await browser.url("https://sourceforge.net/");
            
            performancetotal.sampleEnd("SF-Startup");
            
            console.log("GH-Startup sample timespan: " + performancetotal.getSampleTime("GH-Startup"));

            console.log("SF-Startup sample timespan: " + performancetotal.getSampleTime("SF-Startup"));
        });
    }
});
