import { Injectable } from '@angular/core';
import { seedData } from 'src/data/plants';
import { PlantData, SaveablePlantData, StaticPlantData } from 'src/interfaces/plant';
import { PatternAttempt, Seed, SeedData } from 'src/interfaces/seed';
import { SaveManagementService } from './save-management.service';
import { SeedCombinationsService } from './seed-combinations.service';

@Injectable({
  providedIn: 'root'
})
export class AlmanacTrackerService {
  saveManagementService!: SaveManagementService;

  plantList: Array<PlantData> = []
  failedCombinations: Set<string> = new Set<string>()

  selectedPlant: PlantData | null = null;

  constructor(private seedCombinationService: SeedCombinationsService) {  }

  initializePlantData(staticPlantData: Array<StaticPlantData>){
    staticPlantData.forEach(data => {
      var pattern = ""
      
      var isRepeat = true
      var availableSeeds = Array.from(data.patternSeeds)
      var t = 0

      while(isRepeat && t < 1000){
        pattern = ""
        for(var i = 0; i < data.patternSize; i++){
          pattern += availableSeeds[Math.floor(Math.random() * availableSeeds.length)]
        }
        isRepeat = this.plantList.filter(plant => plant.pattern == pattern).length >= 1
        t += 1
      }
      if(t > 100){
        console.log("Too hard to generate pattern for " + data.name)
      }

      this.plantList.push({
        staticInfo: data,
        pattern: pattern,
        discovered: false,
        attemptedPatterns: []
      })
    })

    console.log(this.plantList);
  }

  combinationToPattern(seedCombination: Array<SeedData>): string{
    var finalString = ""
    seedCombination.forEach(seed => {
      finalString += seed.id
    })
    return finalString
  }

  checkSeedPattern(pattern: string): PlantData | null{
    for(var i = 0; i < this.plantList.length; i++){
      if(this.plantList[i].pattern == pattern){
        return this.plantList[i]
      }
    }
    return null;
  }
  

  getAttemptedSeeds(plant: PlantData): Array<Array<PatternAttempt>>{
    var patterns: Array<Array<PatternAttempt>> = []
    
    plant.attemptedPatterns.forEach(pattern => {
      var seeds = this.seedCombinationService.getSeedsByPattern(pattern)
      var wordle = this.wordleSeedPattern(pattern, plant.pattern)
      var patternList: Array<PatternAttempt> = []

      seeds.forEach((seed, index) => {
        patternList.push({seed: seed, validity: wordle[index]})
      })

      patterns.push(patternList)
    })

    patterns.forEach(pattern => {
      while(pattern.length < plant.pattern.length){
        pattern.push({seed: null, validity: 0})
      }
    })
    return patterns
  }

  wordleSeedPattern(pattern: string, targetPattern: string): Array<0|1|2>{
    var results: Array<0|1|2> = []

    Array.from(pattern).forEach((character, index) => {
      if(targetPattern.charAt(index) == character){
        results.push(2)
      } else if(targetPattern.includes(character)){
        results.push(1)
      } else{
        results.push(0)
      }
    })

    return results
  }

  checkSeedCombination(seedCombination: Array<SeedData | null>): "Untried" | "Tried" | PlantData {
    var flushedSeedCombination = seedCombination.filter(seed => seed != null) as Array<SeedData>;
    var pattern = this.combinationToPattern(flushedSeedCombination)

    if(this.failedCombinations.has(pattern)){
      return "Tried"
    }
    
    var associatedPlant = this.checkSeedPattern(pattern);
    if(associatedPlant != null && associatedPlant.discovered){
      return associatedPlant;
    }

    return "Untried"
  }

  submitSeedPattern(seedCombination: string){
    var seedResult = this.checkSeedPattern(seedCombination)

    if(seedResult == null){
      this.failedCombinations.add(seedCombination);
    } else if(this.selectedPlant != null) {
      if(!this.selectedPlant.attemptedPatterns.includes(seedCombination)){
        this.selectedPlant.attemptedPatterns.push(seedCombination)
      }
    }
  }

  submitSeedCombination(seedCombination: Array<SeedData | null>){322
    var flushedSeedCombination = seedCombination.filter(seed => seed != null) as Array<SeedData>;
    this.submitSeedPattern(this.combinationToPattern(flushedSeedCombination));    
  }

  onNoSave(staticPlantData: Array<StaticPlantData>){
    this.initializePlantData(staticPlantData);
  }

  onLoadSave(staticPlantData: Array<StaticPlantData>, savedPlantData: Array<SaveablePlantData>, savedFailedPatterns: Array<string>): boolean{
    this.initializePlantData(staticPlantData)

    var missingPlantData = false
    savedPlantData.forEach(plantData => {
      var matchingPlantData = this.plantList.filter(x => x.staticInfo.id == plantData.plantDataID)
      if(matchingPlantData.length == 1){
        matchingPlantData[0].discovered = plantData.discovered
        matchingPlantData[0].pattern = plantData.pattern
        matchingPlantData[0].attemptedPatterns = plantData.attemptedPatterns ? plantData.attemptedPatterns : []
      } else {
        missingPlantData = true
      }
    })

    savedFailedPatterns.forEach(pattern => {
      if(!this.plantList.some(x => x.pattern == pattern)){
        this.failedCombinations.add(pattern)
      }
    })

    if(missingPlantData){
      return false;
    }
    return true;
  }
}
