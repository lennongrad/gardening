import { ThisReceiver } from '@angular/compiler';
import { Component, HostListener, OnInit } from '@angular/core';
import { SeedData, Seed } from 'src/interfaces/seed';
import { SeedCombinationsService } from '../seed-combinations.service';
import { GrowingPlantsService } from '../growing-plants.service';
import { AlmanacTrackerService } from '../almanac-tracker.service';
import { PlantData } from 'src/interfaces/plant';

interface SubmissionText {top: string, bottom: string, tooltip: string, color: string}

@Component({
  selector: 'app-seed-picker',
  templateUrl: './seed-picker.component.html',
  styleUrls: ['./seed-picker.component.less']
})
export class SeedPickerComponent implements OnInit {
  selectedSeeds: Array<null | SeedData> = [];
  seedAmount = 1;

  constructor(
    private seedCommbinationService: SeedCombinationsService, 
    private growingPlantsService: GrowingPlantsService,
    private almanacTrackerService: AlmanacTrackerService) { }

  ngOnInit(): void {
    this.updateSeedAmount();
  }

  getMainStyle(): Record<string,any>{
    if(this.growingPlantsService.selectedDirt == null){
      return {
        "opacity": 0,
        "width": 0,
        "left": "-100000px",
        "top": "-1000px"
      }
    }

    return {
      "opacity": 1,
      "left": this.growingPlantsService.getDirtPosition(this.growingPlantsService.selectedDirt)[0] + 30 + "px",
      "top": this.growingPlantsService.getDirtPosition(this.growingPlantsService.selectedDirt)[1] - 30  + "px",
      "width": (Math.max(this.selectedSeeds.length, this.getSeedOptions().length, 4) * 50 + 60) + "px"
    }
  }
  
  getAmount(seedInfo: Seed): number{
    return seedInfo.amount - this.selectedSeeds.filter(seed => seed == seedInfo.seed).length;
  }

  getSubmissionText(): SubmissionText{
    if(this.selectedSeeds.filter(seed => seed != null).length < this.seedAmount){
      return {
        top: "Invalid",
        bottom: "Too short",
        tooltip: "You haven't put enough seeds in your combination. Please fill it all the way first.",
        color: "#E99"
      }
    }

    var combinationResult = this.almanacTrackerService.checkSeedCombination(this.selectedSeeds);
  
    if(combinationResult == "Tried"){
      return {
        top: "Invalid",
        bottom: "Inviable",
        tooltip: "You have already tried that combination of seeds, and it resulted in a inviable plant. To reduce plant suffering, we won't let you try again.",
        color: "#F77"
      }
    }

    if(combinationResult == "Untried"){
      return {
        top: "Plant",
        bottom: "Unknown",
        tooltip: "You haven't tried this combination of seeds before, so you're not sure what will happen.",
        color: "white"
      }
    }
    
    var resultPlant = combinationResult as PlantData;
    return {
      top: "Plant",
      bottom: resultPlant.staticInfo.name, 
      tooltip: "You have tried this combination of seeds before, and it resulted in a viable plant.",
      color: "#8F8"
    }
  }

  getMaxSeedAmount(): number{
    return 6
  }

  changeSeedAmount(increaseSeeds: boolean){
    if(increaseSeeds && this.seedAmount < this.getMaxSeedAmount()){
      this.seedAmount += 1
    } else if(!increaseSeeds && this.seedAmount > 1){
      this.seedAmount -= 1
    }
    this.updateSeedAmount()
  }

  updateSeedAmount(){
    while(this.selectedSeeds.length < this.seedAmount){
      this.selectedSeeds.push(null);
    }
    while(this.selectedSeeds.length > this.seedAmount){
      this.selectedSeeds.pop();
    }
  }

  selectSeed(selectedSeedInfo: Seed){
    if(this.getAmount(selectedSeedInfo) <= 0){
      return;
    }

    var firstUnoccupied = -1;
    for(var i = 0; i < this.selectedSeeds.length; i++){
      if(this.selectedSeeds[i] == null){
        firstUnoccupied = i;
        break;
      }
    }
    if(firstUnoccupied != -1){
      this.selectedSeeds[i] = selectedSeedInfo.seed;
    }
  }

  removeSeed(index: number){
    this.selectedSeeds.splice(index, 1);
    this.updateSeedAmount();
  }

  clearSeeds(){
    this.selectedSeeds = [];
    this.updateSeedAmount();
  }

  submitSeedCombination(){
    if(this.selectedSeeds.filter(seed => seed != null).length < this.seedAmount){
      return;
    }

    var combinationResult = this.almanacTrackerService.checkSeedCombination(this.selectedSeeds);
    if(combinationResult == "Tried"){
      return;
    }

    if(this.growingPlantsService.selectedDirt == null || this.growingPlantsService.getPlantFromDirt(this.growingPlantsService.selectedDirt) != null){
      return;
    }

    var flushedSeedCombination = this.selectedSeeds.filter(seed => seed != null) as Array<SeedData>;
    this.growingPlantsService.makePlant(
      combinationResult != "Untried" ? combinationResult : null, 
      this.almanacTrackerService.combinationToPattern(flushedSeedCombination),
      this.growingPlantsService.selectedDirt
    )
    
    this.seedCommbinationService.consumeSeeds(this.selectedSeeds);
    this.clearSeeds();

    this.growingPlantsService.selectedDirt = null;
  }

  getSeedOptionStyle(seedInfo: Seed): Record<string, any>{
    return {
      "background-color": seedInfo.seed.color 
    }
  }
  
  getSeedOptions(): Array<Seed> {
    return this.seedCommbinationService.getSeedData().filter(data => data.discovered);
  }

  getSelectedSeeds(): Array<null | SeedData>{
    return this.selectedSeeds;
  }
  
  @HostListener("wheel", ["$event"])
  public onScroll(event: WheelEvent) {
    this.changeSeedAmount(event.deltaY < 0)
  }

}
