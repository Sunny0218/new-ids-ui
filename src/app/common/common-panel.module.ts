import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AirportPanelComponent } from './airport-panel/airport-panel.component';
import { FpvPanelComponent } from './fpv-panel/fpv-panel.component';
import { MediaPanelComponent } from './media-panel/media-panel.component';
import { PathPanelComponent } from './path-panel/path-panel.component';
import { RouterModule, Routes } from '@angular/router';
import { DemoMaterialModule } from '../demo-material-module';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MediaPanelModule } from './media-panel/media-panel.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LoadPathsComponent } from './path-panel/load-paths/load-paths.component';

const CommonPanelroutes:Routes = [
  {
    path:'media',
    component:MediaPanelComponent
  },
  {
    path:'path',
    component:PathPanelComponent
  },
  {
    path:'fpv',
    component:FpvPanelComponent
  },
  {
    path:'airport',
    component:AirportPanelComponent
  },
] 

@NgModule({
  declarations: [
    MediaPanelComponent,
    AirportPanelComponent,
    FpvPanelComponent,
    PathPanelComponent,
    LoadPathsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(CommonPanelroutes),
    DemoMaterialModule,
    FormsModule,
    HttpClientModule,
    MediaPanelModule,
    FlexLayoutModule,
    ReactiveFormsModule
  ]
})
export class CommonPanelModule { }
