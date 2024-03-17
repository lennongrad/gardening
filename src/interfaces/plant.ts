export interface StaticPlantData {
    id: string,
    name: string,
    patternSize: number,
    growthCyclesAdjustment?: number,
    patternSeeds: string,
    resultSeeds: Record<string, number>
}

export interface PlantData {
    staticInfo: StaticPlantData,
    pattern: string,
    discovered: boolean
}

export interface SaveablePlantData{
    plantDataID: string,
    pattern: string,
    discovered: boolean
}

export interface Plant {
    dirt: Dirt,
    plantData: PlantData | null,
    plantedPattern: string,
    cycles: number,
    waterCycles: number
}

export interface SaveablePlant{
    dirtID: number,
    plantedPattern: string,
    cycles: number,
    waterCycles: number
}

export interface ProspectiveDirt{
    x: number,
    y: number
}

export interface Dirt{
    id: number,
    x: number,
    y: number
}

export interface SaveableDirt{
    id: number,
    x: number,
    y: number
}