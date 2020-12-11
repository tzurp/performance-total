export class LogEntry {
    name: string;
    id: string;
    type: StepType;
    time: number;

    constructor() {
        this.name = "";
        this.id = "";
        this.type = StepType.Start;
        this.time = 0;
    }
}

export enum StepType {
    Start,
    End
}