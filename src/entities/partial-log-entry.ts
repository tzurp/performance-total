export class PartialLogEntry {
    name: string;
    id: string;
    type: StepType;
    time: number;
    displayTime: string;
    instanceId: string;

    constructor() {
        this.name = "";
        this.id = "";
        this.type = StepType.Start;
        this.time = 0;
        this.displayTime = "";
        this.instanceId = "";
    }
}

export enum StepType {
    Start,
    End
}