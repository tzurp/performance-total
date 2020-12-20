class Calculator {
    getAverageAndStandardDeviation(durationList: Array<number>): [number, number]
    {
        const mean = this.getAverageTimeSpan(durationList);
        let sos = 0;
        let sem = 0;

        // calculate sem
        if(durationList.length > 1) {
        durationList.forEach(d => sos += Math.pow(d - mean, 2));

        const std = Math.sqrt(sos / (durationList.length - 1));

        sem = std / Math.sqrt(durationList.length);
        }

        return [mean, sem];
    }

    private getAverageTimeSpan(durationList: Array<number>): number
    {
        return durationList.reduce((a, b) => a + b, 0) / durationList.length;
    }
}
export default new Calculator();