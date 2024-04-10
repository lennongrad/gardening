import { Component, Input, OnInit } from '@angular/core';
import { SeedCombinationsService } from '../seed-combinations.service';
import { Tool } from 'src/interfaces/seed';
import { DebugService } from '../debug.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.less']
})
export class StoreComponent implements OnInit {
  @Input() activeWindow: boolean = false;

  constructor(private seedCombinationService: SeedCombinationsService,
    private debugService: DebugService) { }

  ngOnInit(): void {
  }

  getTools(): Array<Tool>{
    return this.seedCombinationService.tools
  }

  getToolIcon(tool: Tool): string{
    return this.seedCombinationService.getToolIcon(tool)
  }

  getToolGradient(tool: Tool): string{
    return this.seedCombinationService.getToolGradient(tool)
  }

  getToolLevel(tool: Tool): string{
    return (1 + tool.level).toString()
  }

  getToolXPCost(tool: Tool): string{
    return this.seedCombinationService.getPrettyNumber(this.seedCombinationService.getToolEXPCost(tool)) + " EXP."
  }

  getToolBonus(tool: Tool): string{
    switch(tool.tool.id){
      case 0: return "fewer"
      case 1: return "+1";
      case 2: return "+1.25";
      case 3: return "+5%";
      case 4: return "+5%";
    }
    return "???"  
  }

  getToolUsage(tool: Tool): string{
    switch(tool.tool.id){
      case 0: return "seconds between uses"
      case 1: return "maximum seed per planted pattern";
      case 2: return "seconds of water per use";
      case 3: return "chance of harvesting extra seeds";
      case 4: return "increase in plant sell rate"
    }
    return "???"  
  }

  getToolCurrentValue(tool: Tool): string{
    switch(tool.tool.id){
      case 0: return "time: " + (this.seedCombinationService.getMaxTimerTool(tool)/1000).toString() + " seconds";
      case 1: return "pattern length: " + (this.seedCombinationService.getToolStrength(tool)).toString() + (this.seedCombinationService.getToolStrength(tool) == 1 ? " seed" : " seeds");
      case 2: return "time: " + (this.seedCombinationService.getToolStrength(tool)/4).toString() + " seconds";
      case 3: return "chance: " + (Math.floor(this.seedCombinationService.getToolStrength(tool)*100)).toString() + "%";
      case 4: return "rate: +" + (Math.floor(this.seedCombinationService.getToolStrength(tool)*100)).toString() + "%";
    }
    return "value: ???"  
  }

  getToolMaxed(tool: Tool): boolean{
    return this.seedCombinationService.getToolMaxed(tool)
  }

  getVerb(tool: Tool): string{
    if(this.canAfford(tool)){
      return "Spend"
    }
    return "You need"
  }


  upgradeTool(tool: Tool){
    if(this.seedCombinationService.getToolEXPCost(tool) <= this.seedCombinationService.experience && !this.getToolMaxed(tool)){
      this.seedCombinationService.experience -= this.seedCombinationService.getToolEXPCost(tool)
      tool.level += 1
    }
  }

  downgradeTool(tool: Tool){
    if(this.debugService.getDebugSetting("allowDegradeTool") && tool.level > 0){
      tool.level -= 1
    }
    return false
  }

  canAfford(tool: Tool){
    return this.seedCombinationService.experience >= this.seedCombinationService.getToolEXPCost(tool) && !this.getToolMaxed(tool)
  }

  getToolName(tool: Tool){
    return this.seedCombinationService.getToolName(tool)
  }

}
