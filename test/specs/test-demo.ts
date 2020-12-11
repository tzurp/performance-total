import PerformanceLog from "../../performance-project/main";

describe('suite-1', () => {
   
    it('test_demo', () => {
        //Main.performanceLogger.sampleStart("login");
        const s = '{"name":"yoss", "id":171}';
        const parsed =  JSON.parse(s);
        console.log("The name is:" + parsed.name + "ID is: " +parsed.id);
    });
});