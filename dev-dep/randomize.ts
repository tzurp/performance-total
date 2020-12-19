class Randomize {
    RandomPlusMinus(value: number): number {

        let result: number;

        result = Math.floor(Math.random() * (value * 2)) - value;

        return result;
    }
}
export default new Randomize();