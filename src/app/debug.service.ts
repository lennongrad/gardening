import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DebugService {
  debugSettings: Record<string, boolean> = {
    "showAllPlants": false,
    "allowDegradeTool": true
  }
  
  getDebugSetting(name: string): boolean{
    if(this.debugSettings[name] == null){
      return false
    }
    return this.debugSettings[name]
  }

  constructor() { }
}
