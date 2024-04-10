import { Injectable } from '@angular/core';
import { Dirt, Plant, PlantData, ProspectiveDirt, SaveableDirt, SaveablePlant } from 'src/interfaces/plant';
import { AlmanacTrackerService } from './almanac-tracker.service';
import { SeedCombinationsService } from './seed-combinations.service';
import { SaveManagementService } from './save-management.service';
import { SeedData, Tool } from 'src/interfaces/seed';
import { QuestService } from './quest.service';
import { DebugService } from './debug.service';

@Injectable({
  providedIn: 'root'
})
export class GrowingPlantsService {
  saveManagementService!: SaveManagementService;

  dirtSpots: Array<Dirt> = []
  prospectiveDirtSpots: Array<ProspectiveDirt> = [];
  plants: Array<Plant> = []

  hoveredDirt: Dirt | null = null;
  selectedDirt: Dirt | null = null;

  xOffset: number = 0
  yOffset: number = 0

  dirtWidth: number = 100
  dirtHeight: number = 100
  blocksAwayAllowed: number = 10

  timerMax: number = 6;

  constructor(
    private alamancTrackerService: AlmanacTrackerService, 
    private seedCombinationService: SeedCombinationsService,
    private debugService: DebugService,
    private questService: QuestService) { 
      seedCombinationService.growingPlantsService = this;
  }

  startRunning(){
    setInterval(() => {this.growthTick()}, 250)
    setInterval(() => {this.animationTick()}, 10)
  }

  onLoadSave(loadedDirt: Array<SaveableDirt>, loadedPlants: Array<SaveablePlant>): boolean{
    if(loadedDirt.length == 0){
      return false;
    }

    loadedDirt.forEach(dirt => {
      this.dirtSpots.push({id: dirt.id, x: dirt.x, y: dirt.y})
    })
    this.redefineProspective()

    loadedPlants.forEach(plant => {
      this.plants.push({
        dirt: this.dirtSpots.filter(x => x.id == plant.dirtID)[0],
        plantData: this.alamancTrackerService.checkSeedPattern(plant.plantedPattern),
        plantedPattern: plant.plantedPattern,
        cycles: plant.cycles,
        waterCycles: plant.waterCycles,
        animationTimer: Math.random() * this.timerMax
      })
    })
    return true;
  }

  onNoSave(){
    for(var x = -this.blocksAwayAllowed; x <= this.blocksAwayAllowed; x++){
      for(var y = -this.blocksAwayAllowed; y <= this.blocksAwayAllowed; y++){
        this.prospectiveDirtSpots.push({x: x, y:y})
      }
    }
    //this.addDirt(0,0)

    /*
    this.addDirt(1,0)
    this.addDirt(0,1)
    this.addDirt(-1,0)
    this.addDirt(0,-1)
    */

    /*
    for(var x = -10; x < 11; x++){
      for(var y = -10; y < 11; y++){
        this.addDirt(x,y)
      }
    }
    */
  }

  addDirt(x: number, y: number){
    if(this.dirtSpots.some(dirt => dirt.x == x && dirt.y == y)){
      return;
    }

    this.dirtSpots.push({id: this.dirtSpots.length, x: x, y: y})
    this.redefineProspective()
  }

  clickDirt(dirt: Dirt){
    this.questService.registerTrigger("clickDirt")
  }

  getPlantName(plant: Plant): string{
    if(plant.cycles < this.getMaxCycles(plant) / 2 && (plant.plantData == null || !plant.plantData.discovered)){
      return "Sprout"
    }
    if(plant.plantData == null){
      return "Inviable"
    }
    return plant.plantData.staticInfo.name
  }

  isInviable(plant: Plant): boolean{
    return (plant.cycles >= this.getMaxCycles(plant) / 2) && plant.plantData == null
  }

  redefineProspective(){
    this.prospectiveDirtSpots = []
    var relativePositions = [[1,0], [0,1], [-1,0], [0,-1]]
    this.dirtSpots.forEach(dirt => {
      relativePositions.forEach(displacement => {
        if(!this.prospectiveDirtSpots.concat(this.dirtSpots).some(otherSpot => otherSpot.x == dirt.x + displacement[0] && otherSpot.y == dirt.y + displacement[1])){
          this.prospectiveDirtSpots.push({x: dirt.x + displacement[0], y: dirt.y + displacement[1]})
        }
      })
    })
  }

  getPlantFromDirt(dirt: Dirt): Plant | null{
    var matchingPlants = this.plants.filter(plant => plant.dirt == dirt)

    if(matchingPlants.length != 1){
      return null;
    }
    return matchingPlants[0]
  }

  makePlant(pattern: string, dirt: Dirt){
    var plantData = this.alamancTrackerService.checkSeedPattern(pattern)
    var newPlant: Plant = {
      dirt: dirt,
      plantData: plantData, 
      plantedPattern: pattern, 
      cycles: 0, 
      waterCycles: 0,
      animationTimer: this.timerMax * Math.random()
    };

    this.plants.push(newPlant);

    this.questService.registerTrigger("plant")
    this.questService.registerTrigger("plantPattern" + pattern.length)
    if(plantData == null){
      this.questService.registerTrigger("plantInviable")
    }else{
      this.questService.registerTrigger("plantName" + plantData.staticInfo.name)

      if(plantData.discovered){
        this.questService.registerTrigger("plantDiscovered")
      }
    }
  }

  clickPlant(plant: Plant){
    if(this.seedCombinationService.selectedTool == null){
      return
    }

    if(this.seedCombinationService.selectedTool.tool.id == 2){
      plant.waterCycles += this.seedCombinationService.getToolStrength(this.seedCombinationService.selectedTool)
      this.seedCombinationService.useTool(this.seedCombinationService.selectedTool)
    } else if (this.seedCombinationService.selectedTool.tool.id == 3){
      var gainedExperience = this.harvestPlant(plant, this.seedCombinationService.selectedTool)
      this.seedCombinationService.useTool(this.seedCombinationService.selectedTool)

      if(gainedExperience != null){
        plant.dirt.xpValue = gainedExperience
        plant.dirt.xpAnimation = 100
      }
    } else if (this.seedCombinationService.selectedTool.tool.id == 4){
      var gainedMoney = this.sellPlant(plant, this.seedCombinationService.selectedTool)
      this.seedCombinationService.useTool(this.seedCombinationService.selectedTool)

      if(gainedMoney != null){
        plant.dirt.moneyValue = gainedMoney
        plant.dirt.moneyAnimation = 100
      }
    }
  }

  getYieldedSeeds(plant: PlantData): Array<[SeedData, number]>{
    var results: Array<[SeedData, number]> = [];

    Object.keys(plant.staticInfo.resultSeeds).forEach(seed => {
      var matchingSeed = this.seedCombinationService.getSeedByID(seed)
      if(matchingSeed != null){
        results.push([matchingSeed, plant.staticInfo.resultSeeds[seed]])
      }
    })

    return results
  }

  sellPlant(plant: Plant, tool: Tool): number | null{
    var dirtPosition = [plant.dirt.x * this.dirtWidth, plant.dirt.y * this.dirtHeight]

    if(plant.plantData == null){
      if(this.isInviable(plant)){
        this.plants = this.plants.filter(x => x != plant)
      }
      this.questService.registerTrigger("sellInviable")
      return null
    }

    if(plant.cycles < this.getMaxCycles(plant)){
      return null
    }

    this.plants = this.plants.filter(x => x != plant)
    var shearAccuracy = 1 + this.seedCombinationService.getToolStrength(tool)

    var gainedMoney: number = this.seedCombinationService.gainMoney(plant.plantData.staticInfo.price * shearAccuracy)

    this.questService.registerTrigger("sellPlant")
    this.questService.registerTrigger("sellPlantPattern" + plant.plantData.pattern.length.toString())
    this.questService.registerTrigger("sellPlant" + plant.plantData.staticInfo.id)

    return gainedMoney
  }

  harvestPlant(plant: Plant, tool: Tool): number | null{
    var dirtPosition = [plant.dirt.x * this.dirtWidth, plant.dirt.y * this.dirtHeight]

    if(plant.plantData == null){
      if(this.isInviable(plant)){
        this.alamancTrackerService.submitSeedPattern(plant.plantedPattern);
        this.plants = this.plants.filter(x => x != plant)
      }
      this.questService.registerTrigger("harvestInviable")
      return null
    }

    if(plant.cycles < this.getMaxCycles(plant)){
      return null
    }

    this.plants = this.plants.filter(x => x != plant)
    var scytheAccuracy = this.seedCombinationService.getToolStrength(tool)

    this.getYieldedSeeds(plant.plantData).forEach(pair => {
      var matchingSeed = pair[0]
      var seedAmount = pair[1]

      while(Math.random() < scytheAccuracy){
        seedAmount *= 2
      }

      this.seedCombinationService.gainSeed(matchingSeed, seedAmount)
      for(var i = 0; i < seedAmount; i++){
        this.seedCombinationService.animateItemCollect(
          matchingSeed, 
          Math.random() * this.dirtWidth + dirtPosition[0],  
          Math.random() * this.dirtHeight + dirtPosition[1],
          (1 - Math.random() * 2) * 6,
          (Math.random() + 1) * -4,
        )
      }
    })

    plant.plantData.discovered = true
    this.alamancTrackerService.submitSeedPattern(plant.plantedPattern);
    var gainedExperience: number = this.seedCombinationService.gainExperience(plant.plantData.staticInfo.experience)

    this.questService.registerTrigger("harvestPlant")
    this.questService.registerTrigger("harvestPlantPattern" + plant.plantData.pattern.length.toString())
    this.questService.registerTrigger("harvestPlant" + plant.plantData.staticInfo.id)

    return gainedExperience
  }

  getMaxCycles(plant: Plant): number{
    if(plant.plantData != null){
      return plant.plantData.staticInfo.patternSize * 10 + (plant.plantData.staticInfo.growthCyclesAdjustment ? Number(plant.plantData.staticInfo.growthCyclesAdjustment) : 0)
    }
    return plant.plantedPattern.length * 10
  }

  getRelativePosition(position: [number, number]): [number,number]{
    return [
      position[0] + this.xOffset + (window.innerWidth / 2 - this.dirtWidth / 2),
      position[1] + this.yOffset + (window.innerHeight / 2 - this.dirtHeight / 2)
    ]
  }

  getDirtPosition(dirt: Dirt | ProspectiveDirt): [number, number]{
    return this.getRelativePosition([dirt.x * this.dirtWidth, dirt.y * this.dirtHeight])
  }

  getPlants(): Array<Plant>{
    return this.plants;
  }

  animationTick(){
    this.dirtSpots.forEach(dirt => {
      if(dirt.xpValue != undefined && dirt.xpAnimation != undefined){
        dirt.xpAnimation -= 1
        if(dirt.xpAnimation <= 0){
          dirt.xpValue = undefined
          dirt.xpAnimation = undefined
        }
      }
      if(dirt.moneyValue != undefined && dirt.moneyAnimation != undefined){
        dirt.moneyAnimation -= 1
        if(dirt.moneyAnimation <= 0){
          dirt.moneyValue = undefined
          dirt.moneyAnimation = undefined
        }
      }
    })
  }

  growthTick(){
    if(this.seedCombinationService.seeds[0].amount == 0 && this.plants.length == 0){
      this.seedCombinationService.gainSeed(this.seedCombinationService.seeds[0].seed, 1)
    }

    this.plants.forEach(plant => {
      if(Math.random() > .5){
        plant.animationTimer = (plant.animationTimer + 1) % this.timerMax
      }

      if(plant.cycles < this.getMaxCycles(plant) && !this.isInviable(plant) && plant.waterCycles > 0){
        plant.waterCycles -= 1
        plant.cycles += 1

        if(plant.cycles == Math.floor(this.getMaxCycles(plant) / 2)){
          if(plant.plantData == null){
            this.questService.registerTrigger("showInviable")
          } else {
            this.questService.registerTrigger("show" + plant.plantData.staticInfo.name)
            this.questService.registerTrigger("showPattern" + plant.plantData.pattern.length.toString())
          }
        }

        if(plant.cycles == this.getMaxCycles(plant)){
          this.questService.registerTrigger("plantMaxxed")
        }
      }
    })

    if(!this.debugService.getDebugSetting("dontSave")){
      this.saveManagementService.saveGame()
    }
  }
}
