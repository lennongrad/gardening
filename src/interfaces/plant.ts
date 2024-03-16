export interface StaticPlantData {
    id: string,
    name: string,
    patternSize: number,
    growthCyclesAdjustment?: number,
    overwritePattern?: string,
    patternSeeds: string,
    resultSeeds: Record<string, number>
}

export interface PlantData {
    id: string,
    name: string,
    pattern: string,
    growthCycles: number,
    discovered: boolean
}

export interface Plant {
    plantName: string,
    plantData: PlantData | null,
    plantedPattern: string,
    cycles: number,
    waterCycles: number
    maxCycles: number,
    isInviable: boolean
}