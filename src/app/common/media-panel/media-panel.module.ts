import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MissionListComponent } from './mission-list/mission-list.component';
import { MediaListComponent } from './media-list/media-list.component';
import { ShowMediaComponent } from './show-media/show-media.component';
import { DemoMaterialModule } from '../../demo-material-module';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LocalDatePipe } from '../date-pipe/local-date.pipe';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    MissionListComponent,
    MediaListComponent,
    ShowMediaComponent,
    LocalDatePipe,

  ],
  imports: [ 
    CommonModule,
    FormsModule,
    HttpClientModule,
    DemoMaterialModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports:[
    MissionListComponent,
    MediaListComponent,
    ShowMediaComponent
  ]
})
export class MediaPanelModule { }
