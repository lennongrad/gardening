import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SeedPickerComponent } from './seed-picker/seed-picker.component';
import { FieldComponent } from './field/field.component';
import { PlantComponent } from './plant/plant.component';

@NgModule({
  declarations: [
    AppComponent,
    SeedPickerComponent,
    FieldComponent,
    PlantComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
