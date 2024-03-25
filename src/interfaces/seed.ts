export interface SeedData {
    id: string,
    icon: string,
    color: string
}

export interface Seed {
    seed: SeedData,
    amount: number,
    discovered: boolean
}

export interface SaveableSeed{
    seedID: string,
    amount: number,
    discovered: boolean
}

export interface PatternAttempt{
    seed: Seed | null,
    validity: 0|1|2
}

export interface ToolData {
    id: number,
    name: string,
    iconIndex: number
}

export interface Tool {
    tool: ToolData,
    timer: number
}

export interface SaveableTool { 
    toolID: number,
    timer: number
}

export interface CollectedItemAnimation {
    item: SeedData,
    velocityX: number,
    velocityY: number,
    x: number,
    y: number,
    time: number
}