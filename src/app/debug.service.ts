import { Injectable } from '@angular/core';
import { isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DebugService {
  debugSettings: Record<string, any> = {
    "showAllPlants": false,
    "allowDegradeTool": true,
    "printQuestSteps": true,
    "allowShortcuts": true,
    "printPlantList": true,
    "dontSave": false,
    "openWindow": 3,
    "startingTutorial": null
  }

  productionSettings: Record<string,any> = {
    "showAllPlants": false,
    "allowDegradeTool": false,
    "printQuestSteps": false,
    "allowShortcuts": false,
    "printPlantList": false,
    "dontSave": false,
    "openWindow": null,
    "startingTutorial": null
  }

  currentBuild: string = "0.0.5"
  
  getDebugSetting(name: string): any{
    if(this.debugSettings[name] == null){
      return null
    }
    return this.debugSettings[name]
  }

  constructor() {
    if(!isDevMode()){
      console.log("Production!")
      this.debugSettings = this.productionSettings
    }
   }
}
