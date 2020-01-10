import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HeroesComponent } from "./heroes/heroes.component";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HeroDetailComponent } from "./hero-detail/hero-detail.component";
import { MessagesComponent } from "./messages/messages.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { HttpClientModule } from "@angular/common/http";
import { HttpClientInMemoryWebApiModule } from "angular-in-memory-web-api";
import { InMemoryDataService } from "./in-memory-data.service";
import { HeroSearchComponent } from "./hero-search/hero-search.component";
import { HeroService } from "./hero.service";
import { PanelComponent } from "./image/panel/panel.component";
import { NgxDropzoneModule } from "ngx-dropzone";
import { ImageCropperModule } from "ngx-image-cropper";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { LeafletDrawModule } from "@asymmetrik/ngx-leaflet-draw";
import { CanvasComponent } from "./image/canvas/canvas.component";
import { PreviewComponent } from "./image/preview/preview.component";
import { ColorPickerModule } from "ngx-color-picker";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ImageDashboardComponent } from "./image/dashboard/dashboard.component";
import { MatListModule } from "@angular/material/list";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
declare var $: any;
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { TooltipComponent } from "./image/tooltip/tooltip.component";
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material/dialog";
import { MatSelectModule } from "@angular/material/select";
import { TooltipAddComponent } from "./image/tooltip/add/add.component";
import { MatRadioModule } from "@angular/material/radio";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { DisplayDirective } from './directive/display.directive';
import {MatSliderModule} from '@angular/material/slider';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { MyLibModule } from "ngx-my-lib";
@NgModule({
  providers: [
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] }
  ],
  declarations: [
    AppComponent,
    HeroesComponent,
    HeroDetailComponent,
    MessagesComponent,
    DashboardComponent,
    HeroSearchComponent,
    PanelComponent,
    CanvasComponent,
    PreviewComponent,
    ImageDashboardComponent,
    TooltipComponent,
    TooltipAddComponent,
    DisplayDirective
  ],
  exports: [TooltipAddComponent],
  entryComponents: [TooltipAddComponent],
  imports: [
    MyLibModule,
    NgbModule,
    MatSliderModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatSelectModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatButtonModule,
    MatListModule,
    ColorPickerModule,
    ReactiveFormsModule,
    ImageCropperModule,
    NgxDropzoneModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    LeafletModule.forRoot(),
    LeafletDrawModule.forRoot(),
    BrowserAnimationsModule,
    TooltipComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
