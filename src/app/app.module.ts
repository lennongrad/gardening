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

@NgModule({
  declarations: [
    AppComponent,
    SeedPickerComponent,
    FieldComponent,
    PlantComponent,
    ToolbarComponent,
    AlmanacComponent,
    InformationComponent,
    WindowSelectorComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
