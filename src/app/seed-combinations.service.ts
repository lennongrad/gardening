import { Injectable } from '@angular/core';
import { seedData } from 'src/data/plants';
import { SeedData, Seed, SaveableSeed } from 'src/interfaces/seed';
import { SaveManagementService } from './save-management.service';

@Injectable({
  providedIn: 'root'
})
export class SeedCombinationsService {
  saveManagementService!: SaveManagementService;

  seeds: Array<Seed> = []

  constructor() {
    /*
    this.gainSeed(seedData[0], 3)
    this.gainSeed(seedData[1], 3)
    this.gainSeed(seedData[2], 3)
    this.gainSeed(seedData[3], 3)
    */
  }

  getSeedByID(id: string): SeedData | null {
    var matchingSeeds = seedData.filter(seed => seed.id == id)
    if(matchingSeeds.length == 1){
      return matchingSeeds[0]
    }
    return null;
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

  onNoSave(){
    this.seeds = []
    seedData.forEach(seed => {
      this.seeds.push({seed: seed, amount: 0, discovered: false})
    })
  }

  onLoadSave(savedSeeds: Array<SaveableSeed>): boolean{
    seedData.forEach(seed => {
      this.seeds.push({seed: seed, amount: 0, discovered: false})
    })

    var unknownSeed = false
    savedSeeds.forEach(seed => {
      var matchingSeeds = this.seeds.filter(x => x.seed.id == seed.seedID)
      if(matchingSeeds.length == 1){
        matchingSeeds[0].amount = seed.amount
        matchingSeeds[0].discovered = seed.discovered
      } else {
        unknownSeed = true
      }
    })

    if(unknownSeed){
      return false;
    }
    return true;
  }
}
