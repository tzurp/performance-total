import {performancetotal} from "../../app";

before(async()=> {
    await performancetotal.initialize(false);
});

afterEach(async () => {
    console.log("Test finished");
    await performancetotal.finalizeTest(browser, true);
    await browser.reloadSession();
});

after(async () => {
    await performancetotal.analyzeResults({analyzeByBrowser: false});
});