import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SeedPickerComponent } from './seed-picker/seed-picker.component';
import { FieldComponent } from './field/field.component';
import { PlantComponent } from './plant/plant.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { AlmanacComponent } from './almanac/almanac.component';
import { InformationComponent } from './information/information.component';
import { WindowSelectorComponent } from './window-selector/window-selector.component';
import { HttpClientModule } from '@angular/common/http';
import { API_KEY, GoogleSheetsDbService } from 'ng-google-sheets-db';
import { StoreComponent } from './store/store.component';
import { TutorialManagerComponent } from './tutorial-manager/tutorial-manager.component';
import { ShopComponent } from './shop/shop.component';

@NgModule({
  declarations: [
    AppComponent,
    SeedPickerComponent,
    FieldComponent,
    PlantComponent,
    ToolbarComponent,
    AlmanacComponent,
    InformationComponent,
    WindowSelectorComponent,
    StoreComponent,
    TutorialManagerComponent,
    ShopComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [{
    provide: API_KEY,
    useValue: "AIzaSyByA4ztVKLlcRdVgtoroqy1ltLoX8uGNxU"
  }, GoogleSheetsDbService],
  bootstrap: [AppComponent]
})
export class AppModule { }
