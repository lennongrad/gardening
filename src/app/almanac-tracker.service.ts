import { Injectable } from '@angular/core';
import { flush } from '@angular/core/testing';
import { seedData, staticPlantData } from 'src/data/plants';
import { PlantData, SaveablePlantData } from 'src/interfaces/plant';
import { Seed, SeedData } from 'src/interfaces/seed';
import { SaveManagementService } from './save-management.service';

@Injectable({
  providedIn: 'root'
})
export class AlmanacTrackerService {
  saveManagementService!: SaveManagementService;

  plantList: Array<PlantData> = []
  failedCombinations: Set<string> = new Set<string>()

  constructor() {  }

  initializePlantData(){
    staticPlantData.forEach(data => {
      var pattern = ""
      
      var isRepeat = true
      while(isRepeat){
        var availableSeeds = []
        for(var i = 0; i < data.patternSeeds.length; i++){
          var matchingSeeds = seedData.filter(x => x.id == data.patternSeeds.charAt(i))
          if(matchingSeeds.length == 1){
            availableSeeds.push(matchingSeeds[0])
          }
        }

        for(var i = 0; i < data.patternSize; i++){
          pattern += availableSeeds[Math.floor(Math.random() * availableSeeds.length)].id
        }

        isRepeat = this.plantList.filter(plant => plant.pattern == pattern).length >= 1
      }

      this.plantList.push({
        staticInfo: data,
        pattern: pattern,
        discovered: false
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

  submitFailedSeedPattern(seedCombination: string){
    this.failedCombinations.add(seedCombination);
  }

  submitFailedSeedCombination(seedCombination: Array<SeedData | null>){
    var flushedSeedCombination = seedCombination.filter(seed => seed != null) as Array<SeedData>;
    this.submitFailedSeedPattern(this.combinationToPattern(flushedSeedCombination));    
  }

  onNoSave(){
    this.initializePlantData();
  }

  onLoadSave(savedPlantData: Array<SaveablePlantData>, savedFailedPatterns: Array<string>): boolean{
    this.initializePlantData()

    var missingPlantData = false
    savedPlantData.forEach(plantData => {
      var matchingPlantData = this.plantList.filter(x => x.staticInfo.id == plantData.plantDataID)
      if(matchingPlantData.length == 1){
        matchingPlantData[0].discovered = plantData.discovered
        matchingPlantData[0].pattern = plantData.pattern
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
