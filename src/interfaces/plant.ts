export const PlantMapping = {
  id: "ID",
  name: "Name",
  spriteIndex: "SI",
  family: "Family",
  patternSize: "PS",
  patternSeeds: "Seeds",
  resultSeeds: "Result",
  growthCyclesAdjustment: "GCA",
  experience: "XP",
  price: "Price"
}

export interface LoadedPlantData {
    id: string,
    name: string,
    patternSize: number,
    growthCyclesAdjustment: number,
    patternSeeds: string,
    resultSeeds: string,
    spriteIndex: number,
    family: string,
    experience: number,
    price: number
}

export interface StaticPlantData {
    id: string,
    name: string,
    patternSize: number,
    growthCyclesAdjustment: number,
    patternSeeds: string,
    resultSeeds: Record<string, number>,
    spriteIndex: number,
    family: string,
    experience: number,
    price: number
}

export interface PlantData {
    staticInfo: StaticPlantData,
    pattern: string,
    discovered: boolean,
    attemptedPatterns: Array<string>
}

export interface SaveablePlantData{
    plantDataID: string,
    pattern: string,
    discovered: boolean,
    attemptedPatterns: Array<string>
}

export interface Plant {
    dirt: Dirt,
    plantData: PlantData | null,
    plantedPattern: string,
    cycles: number,
    waterCycles: number,
    animationTimer: number
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
    y: number,
    xpValue?: number,
    xpAnimation?: number,
    moneyValue?: number,
    moneyAnimation?: number
}

export interface SaveableDirt{
    id: number,
    x: number,
    y: number
}