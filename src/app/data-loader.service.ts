import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GoogleSheetsDbService } from 'ng-google-sheets-db';
import { LoadedPlantData, PlantMapping, StaticPlantData } from 'src/interfaces/plant';
import { SaveManagementService } from './save-management.service';

@Injectable({
  providedIn: 'root'
})
export class DataLoaderService {
  spreadsheetURL = "1NgQfCXyet4QYJBSy3F6fFR8-tpqIMkYcieCrYh2asFI";

  public staticPlantData: Array<StaticPlantData> = []

  attemptLoadPlants(){
    this.googleSheetsDbService.get<LoadedPlantData>(this.spreadsheetURL, "Sheet1", PlantMapping).subscribe(data => {
      data.forEach((plantData: LoadedPlantData) => {
        var resultSeeds: Record<string, number> = {};

        Array.from(plantData.resultSeeds).forEach(seedID => {
          if(!(seedID in resultSeeds)){
            resultSeeds[seedID] = 0
          }
          resultSeeds[seedID] += 1
        })

        this.staticPlantData.push({
          id: plantData.id,
          name: plantData.name,
          spriteIndex: plantData.spriteIndex,
          family: plantData.family,
          patternSize: plantData.patternSize,
          patternSeeds: plantData.patternSeeds,
          resultSeeds: resultSeeds,
          growthCyclesAdjustment: plantData.growthCyclesAdjustment,
          experience: Number(plantData.experience)
        })
      })

      this.loadedPlantsSuccessfully()
    })
  }

  loadedPlantsSuccessfully(){
    if(this.saveManagementService != null){
      this.saveManagementService.attemptLoad(this.staticPlantData)
    }
  }

  constructor(private http:HttpClient, private googleSheetsDbService: GoogleSheetsDbService, private saveManagementService: SaveManagementService) { }
}
