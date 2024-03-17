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
    discovered: boolean,
    growthCycles: number
}

export interface Plant {
    plantName: string,
    dirt: Dirt,
    plantData: PlantData | null,
    plantedPattern: string,
    cycles: number,
    waterCycles: number
    maxCycles: number,
    isInviable: boolean
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