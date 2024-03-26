import { Injectable } from '@angular/core';
import { seedData, toolData, toolLevels } from 'src/data/plants';
import { SeedData, Seed, SaveableSeed, Tool, CollectedItemAnimation, SaveableTool, SaveableInventory } from 'src/interfaces/seed';
import { SaveManagementService } from './save-management.service';
import { GrowingPlantsService } from './growing-plants.service';
import { Plant, PlantData } from 'src/interfaces/plant';
import { QuestService } from './quest.service';

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

  experience: number = 0

  constructor(private questSevice: QuestService) {
    /*
    this.gainSeed(seedData[0], 3)
    this.gainSeed(seedData[1], 3)
    this.gainSeed(seedData[2], 3)
    this.gainSeed(seedData[3], 3)
    */
  }

  gainExperience(increase: number){
    this.experience += increase
    return increase
  }

  startRunning(){
    setInterval(() => {this.animationTick()}, 25)
    this.toolTimerTick(1)
  }

  selectTool(tool: Tool){
    if(this.selectedTool != tool){
      if(tool.timer <= 0){
        this.selectedTool = tool 
      }
    } else {
      this.selectedTool = null 
    }

    this.questSevice.registerTrigger("click" + tool.tool.name)
  }

  useTool(tool: Tool){
    tool.timer = this.getMaxTimerTool(tool)

    if(tool == this.selectedTool && (tool.timer > 0 || !this.holdingControl)){
      this.selectedTool = null
    }

    this.questSevice.registerTrigger("use" + tool.tool.name)
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

  getToolMaxed(tool: Tool): boolean{
    return tool.level == 8
  }

  getPrettyNumber(number: number): string{
    var total = ""
    var remaining = number.toString()

    while(remaining.length > 3){
      total = remaining.slice(-3) + "," + total
      remaining = remaining.slice(0,-3)
    }

    return (remaining + "," + total).slice(0,-1)
  }

  getToolEXPCost(tool: Tool): number{
    return Math.pow(4, tool.level + 2) + 4
  }

  getToolStrength(tool: Tool): number{
    switch(tool.tool.id){
      case 1: return tool.level + 1;
      case 2: return (tool.level + 1) * 5;
      case 3: return (tool.level) * .05;
    }
    return 0;
  }

  getToolName(tool: Tool): string{
    return toolLevels[tool.level].name + " " + tool.tool.name
  }

  getToolIcon(tool: Tool): string{
    return (toolLevels[tool.level].iconIndex * 16 + tool.tool.iconIndex).toString()
  }

  getToolGradient(tool: Tool): string{
    return "linear-gradient(#" + toolLevels[tool.level].color1 +  ", #" + toolLevels[tool.level].color2 + ")"
  }

  getMaxSeedAmount(): number{
    if(this.tools.length < 2){
      return 0;
    }
    return this.getToolStrength(this.tools[1])
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
      return Math.floor(Math.pow(this.growingPlantsService!.dirtSpots.length / (tool.level+1), 2)) * 15000 + 15000
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
        timer: 0,
        level: 0
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
      tool.timer = Math.min(this.getMaxTimerTool(tool), tool.timer - (timeStamp - this.lastTimestamp))
    })
    
    this.lastTimestamp = timeStamp
    window.requestAnimationFrame(this.toolTimerTick.bind(this))
  }

  onLoadSave(savedSeeds: Array<SaveableSeed>, savedTools: Array<SaveableTool>, savedInventory: SaveableInventory): boolean{
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
        timer: 0,
        level: 0
      })
    })

    var unknownTool = false
    savedTools.forEach(tool => {
      var matchingTools = this.tools.filter(x => x.tool.id == tool.toolID)
      if(matchingTools.length == 1){
        matchingTools[0].timer = tool.timer
        matchingTools[0].level = Math.min(8, Math.max(0, tool.level))
      } else {
        unknownTool = true
      }
    })

    if(unknownTool){
      return false;2
    }

    this.experience = Number(savedInventory.experience)

    return true;
  }
}
