export class PartialLogEntry {
    name: string;
    id: string;
    type: StepType;
    time: number;
    displayTime: string

    constructor() {
        this.name = "";
        this.id = "";
        this.type = StepType.Start;
        this.time = 0;
        this.displayTime = "";
    }
}

export enum StepType {
    Start,
    End
}