import { Component, HostListener, OnInit } from '@angular/core';
import { SeedCombinationsService } from '../seed-combinations.service';
import { Tool } from 'src/interfaces/seed';
import { GrowingPlantsService } from '../growing-plants.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.less']
})
export class ToolbarComponent implements OnInit {

  mousePositionX: number = 0
  mousePositionY: number = 0;

  constructor(
    private seedCombinationService: SeedCombinationsService,
    private growingPlantsService: GrowingPlantsService) { }

  ngOnInit(): void {
  }

  getSelectedTool(): Tool | null{
    return this.seedCombinationService.selectedTool
  }

  isCooldown(tool: Tool): boolean{
    return tool.timer > 0
  }

  getCooldownRemaining(tool: Tool): string{
    var seconds = Math.ceil(tool.timer / 1000)

    var minutes = 0
    while(seconds >= 60){
      seconds -= 60
      minutes += 1
    }

    var secondsString = seconds.toString()
    var minutesString = minutes.toString()
    return (minutesString != "0" ? (minutesString + ":") : "") + (secondsString.length == 2 ? secondsString : ("0" + secondsString))
  }

  clickTool(tool: Tool){
    this.selectTool(tool)
  }

  getMaskImageStyle(tool: Tool): Record<string,any>{
    if(tool.timer <= 0){
      return {}
    }
    
    var percentage = (tool.timer / this.seedCombinationService.getMaxTimerTool(tool))
    percentage = (percentage * 60) + 20

    return {
      "mask-image": "url('assets/items/tools/f" + tool.tool.iconIndex + ".png')",
      "background":  "linear-gradient(to left, black "  + percentage + "%, transparent "  + percentage + "%, transparent)"
    }
  }

  selectTool(tool: Tool){
    this.seedCombinationService.selectTool(tool)
    this.growingPlantsService.selectedDirt = null;
  }

  getTools(): Array<Tool>{
    return this.seedCombinationService.tools
  }

  getToolStyle(tool: Tool): Record<string, any>{
    if(this.getSelectedTool() != tool){
      return {}
    }

    if(tool.tool.id == 1 && this.growingPlantsService.selectedDirt != null){
      return {
        "left": (this.growingPlantsService.getDirtPosition(this.growingPlantsService.selectedDirt)[0] - 20) + "px",
        "top": (this.growingPlantsService.getDirtPosition(this.growingPlantsService.selectedDirt)[1] + 20) + "px",
      }
    }

    return {
      "top": this.mousePositionY + "px",
      "left": this.mousePositionX + "px",
    }
  }

  
  @HostListener("window:mousemove", ["$event"])
  onMouseMove(event: MouseEvent){
    this.mousePositionX = event.clientX
    this.mousePositionY = event.clientY
  }

  @HostListener("window:keydown", ["$event"])
  onAnyKeyDown(event: KeyboardEvent){
    if(event.code.slice(0,5) == "Digit"){
      var pressedKey = Number(event.code.slice(5)) - 1
      var matchingTool = this.seedCombinationService.tools.filter(x => x.tool.id == pressedKey)
      if(matchingTool.length == 1){
        this.selectTool(matchingTool[0])
      }
    }
  }

  @HostListener("window:keydown.m")
  onMKeyDown(){
    this.seedCombinationService.cheatToolTimes()
  }

  @HostListener("window:keydown.control")
  onControlKeyDown(){
    this.seedCombinationService.holdingControl = true
  }

  @HostListener("window:keyup.control")
  onControlKeyUp(){
    this.seedCombinationService.holdingControl = false
  }

}
