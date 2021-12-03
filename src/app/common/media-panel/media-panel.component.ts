import { Component, OnInit, ViewChild } from '@angular/core';
import { MediaListComponent } from './media-list/media-list.component';
import { ShowMediaComponent } from './show-media/show-media.component';


@Component({
  selector: 'app-media-panel',
  templateUrl: './media-panel.component.html',
  styleUrls: ['./media-panel.component.css']
})



export class MediaPanelComponent implements OnInit {

  mediaData:[]

  @ViewChild('mediaList',{static:false}) //通过"ViewChild",父组件与子组件"mediaList"相连,并直接使用子组件的引用
  private mediaList:MediaListComponent;
  
  @ViewChild('showMedia',{static:false})
  private showMedia:ShowMediaComponent  //通过"ViewChild",父组件与子组件"showMedia"相连,并直接使用子组件的引用

  constructor() { }

  ngOnInit(): void {
  }

  //MissionList组件通过发射器触发执行此方法
  onMissionSelected(mission) {
    this.mediaList.onMediaDataFilter(mission); //通过"ViewChild"触发子组件"mediaList"的方法,并传递数据给子组件
  }

  //MediaList组件通过发射器触发执行此方法
  onMediaSelected(media) {
    this.showMedia.getMediaData(media); //通过"ViewChild"触发子组件"showMedia"的方法,并传递数据给子组件
    
  }
}
