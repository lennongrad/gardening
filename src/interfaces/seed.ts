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
    timer: number,
    level: number
}

export interface SaveableTool { 
    toolID: number,
    timer: number,
    level: number
}

export interface ToolLevel{
    name: string,
    iconIndex: number,
    color1: string,
    color2: string
}

export interface CollectedItemAnimation {
    item: SeedData,
    velocityX: number,
    velocityY: number,
    x: number,
    y: number,
    time: number
}

export interface SaveableInventory{
    experience: number, 
    money: number
}

export interface QuestData{
    id: number,
    requiredAchievements: Array<string>,
    requiredTrigger?: string,
    transform: Record<string, any>,
    text: string,
    completionAchievements: Array<string>,
    completionTriggers: Array<string>,
    rewardAchievement: string,
    isTutorial: boolean
}

export interface Quest{
    questData: QuestData,
    seenTriggers: Array<string>,
    completed: boolean,
    active: boolean
}

export interface SaveableQuest{
    questDataID: number,
    seenTriggers: Array<string>,
    completed: boolean,
    active: boolean
}