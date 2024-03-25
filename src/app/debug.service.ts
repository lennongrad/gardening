import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DebugService {
  debugSettings: Record<string, boolean> = {
    "showAllPlants": false
  }
  
  getDebugSetting(name: string): boolean{
    if(this.debugSettings[name] == null){
      return false
    }
    return this.debugSettings[name]
  }

  constructor() { }
}
