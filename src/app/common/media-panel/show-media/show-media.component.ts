import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-show-media',
  templateUrl: './show-media.component.html',
  styleUrls: ['./show-media.component.css']
})
export class ShowMediaComponent implements OnInit {


  mediaName:string = 'Media Name'
  isVideo:boolean = false;
  mediaUrl = 'assets/images/background/ids_place_holder.jpg';

  constructor() { }

  ngOnInit(): void {
    
  }

  //父组件'Media-Panel'触发的方法,并传递相对应数据
  getMediaData (mediaData:any) {
    this.mediaName = mediaData.name
    this.isVideo = mediaData.isVideo;
    this.mediaUrl = mediaData.url 
  }

}
