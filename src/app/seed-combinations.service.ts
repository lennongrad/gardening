import { Injectable } from '@angular/core';
import { seedData, toolData } from 'src/data/plants';
import { SeedData, Seed, SaveableSeed, Tool, CollectedItemAnimation, SaveableTool } from 'src/interfaces/seed';
import { SaveManagementService } from './save-management.service';
import { GrowingPlantsService } from './growing-plants.service';

@Injectable({
  providedIn: 'root'
})
export class SeedCombinationsService {
  saveManagementService!: SaveManagementService;
  growingPlantsService!: GrowingPlantsService;

  seeds: Array<Seed> = []
  tools: Array<Tool> = [];

  selectedTool: Tool | null = null;

  holdingControl: boolean = false;

  collectedItemAnimations: Array<CollectedItemAnimation> = [];

  collectedItemMaxTime: number = 30;

  lastTimestamp = 0

  constructor() {
    setInterval(() => {this.animationTick()}, 25)
    this.toolTimerTick(1)
    /*
    this.gainSeed(seedData[0], 3)
    this.gainSeed(seedData[1], 3)
    this.gainSeed(seedData[2], 3)
    this.gainSeed(seedData[3], 3)
    */
  }

  selectTool(tool: Tool){
    if(this.selectedTool != tool){
      if(tool.timer <= 0){
        this.selectedTool = tool 
      }
    } else {
      this.selectedTool = null 
    }
  }

  useTool(tool: Tool){
    tool.timer = this.getMaxTimerTool(tool)

    if(tool == this.selectedTool && (tool.timer > 0 || !this.holdingControl)){
      this.selectedTool = null
    }
  }

  getSeedsByPattern(pattern: string): Array<Seed>{
    var acc: Array<Seed> = []

    for(var i = 0; i < pattern.length; i++){
      var seedData = this.getSeedByID(pattern.charAt(i))
      var matchingSeeds = this.seeds.filter(seed => seed.seed == seedData)
      
      if(matchingSeeds.length == 1){
        acc.push(matchingSeeds[0])
      }
    }

    return acc
  }

  getMaxSeedAmount(): number{
    return 6
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

  animateItemCollect(seedType: SeedData, positionX: number, positionY: number, velocityX: number, velocityY: number){
    this.collectedItemAnimations.push({
      item: seedType,
      velocityX: velocityX,
      velocityY: velocityY,
      x: positionX,
      y: positionY,
      time: 0
    })
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

  cheatToolTimes(){
    this.tools.forEach(tool => {
      tool.timer = 0
    })
  }

  getMaxTimerTool(tool: Tool): number{
    if(tool.tool.id == 0){
      return Math.pow(this.growingPlantsService!.dirtSpots.length, 2) * 15000 + 15000
    }
    return 0
  }

  onNoSave(){
    this.seeds = []
    seedData.forEach(seed => {
      this.seeds.push({seed: seed, amount: 0, discovered: false})
    })

    this.tools = []
    toolData.forEach(tool => {
      this.tools.push({
        tool: tool,
        timer: 0
      })
    })
  }

  animationTick(){
    this.collectedItemAnimations.forEach(item => {
      item.velocityY += 1
      item.x += item.velocityX
      item.y += item.velocityY
      item.time += 1
    })

    this.collectedItemAnimations = this.collectedItemAnimations.filter(item => item.time < this.collectedItemMaxTime)
  }

  toolTimerTick(timeStamp: number){
    this.tools.forEach(tool => {
      tool.timer -= (timeStamp - this.lastTimestamp)
    })
    
    this.lastTimestamp = timeStamp
    window.requestAnimationFrame(this.toolTimerTick.bind(this))
  }

  onLoadSave(savedSeeds: Array<SaveableSeed>, savedTools: Array<SaveableTool>): boolean{
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

    toolData.forEach(tool => {
      this.tools.push({
        tool: tool,
        timer: 0
      })
    })

    var unknownTool = false
    savedTools.forEach(tool => {
      var matchingTools = this.tools.filter(x => x.tool.id == tool.toolID)
      if(matchingTools.length == 1){
        matchingTools[0].timer = tool.timer
      } else {
        unknownTool = true
      }
    })

    if(unknownTool){
      return false;
    }

    return true;
  }
}
