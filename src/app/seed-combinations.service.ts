import { Injectable } from '@angular/core';
import { seedData } from 'src/data/plants';
import { SeedData, Seed } from 'src/interfaces/seed';

@Injectable({
  providedIn: 'root'
})
export class SeedCombinationsService {
  seeds: Array<Seed> = []

  constructor() {
    seedData.forEach(seed => {
      this.seeds.push({seed: seed, amount: 0, discovered: false})
    })
    this.gainSeed(seedData[0], 3)
    this.gainSeed(seedData[1], 3)
    this.gainSeed(seedData[2], 3)
    this.gainSeed(seedData[3], 3)
  }

  gainSeed(seedType: SeedData, amount: number){
    var data = this.seeds.find(data => data.seed == seedType)
    if(data != null){
      data.amount += amount
      data.discovered = true
    }
  }

  consumeSeeds(seedCombination: Array<null | SeedData>){
    seedCombination.forEach(seed => {
      var data = this.seeds.find(data => data.seed == seed)
      if(data != null){
        data.amount -= 1
      }
    })
  }

  getSeedTypes(): Array<SeedData>{
    return seedData;
  }

  getSeedData(): Array<Seed>{
    return this.seeds;
  }
}
