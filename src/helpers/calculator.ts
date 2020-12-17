class Calculator {
    getAverageAndStandardDeviation(durationList: Array<number>): [number, number]
    {
        const mean = this.getAverageTimeSpan(durationList);
        let sos = 0;

        durationList.forEach(d => sos += Math.pow(d - mean, 2));

        var std = Math.sqrt(sos / (durationList.length - 1));

        var ste = std / Math.sqrt(durationList.length);

        return [mean, ste];
    }

    private getAverageTimeSpan(durationList: Array<number>): number
    {
        return durationList.reduce((a, b) => a + b, 0) / durationList.length;
    }
}
export default new Calculator();