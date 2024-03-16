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