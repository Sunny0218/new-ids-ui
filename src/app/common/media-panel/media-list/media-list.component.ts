import { Component, OnInit,ViewChild, AfterViewInit, Output, EventEmitter} from '@angular/core';
import { MediaElement } from './media-element.implements';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CommonPanelService } from '../../common-panel.service';

@Component({
  selector: 'app-media-list',
  templateUrl: './media-list.component.html',
  styleUrls: ['./media-list.component.css'],
  providers:[CommonPanelService]
})


export class MediaListComponent implements OnInit,AfterViewInit {
  
  displayedColumns: string[] = ['name', 'createAt', 'url']; //定义媒体数据表格表头
  dataSource = new MatTableDataSource<MediaElement>(); //声明MatTble媒体表数据,并将媒体数据赋值其本身
  pathName:string = 'IDS'; //表格副标题

  @ViewChild(MatPaginator,{static: false}) //获得MatPaginator,页码器
  private paginator: MatPaginator; 
  
  @ViewChild(MatSort,{static: false}) //获得MatSort,表格排序器
  private sort: MatSort; 
  
  @Output()
  private onMediaSelectedEmitter = new EventEmitter<any>() //构造"选择媒体按钮发射器",传递数据给父组件


  constructor( 
    private commonSvc:CommonPanelService //依赖注入'异步获得Media数据'服务
    ) { }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;  
  }

  //执行当前函数后,触发"选择媒体发射器",并传递数据给父组件
  mediaSelected(media){
    this.onMediaSelectedEmitter.emit(media);
  }

  //输入MissionID过滤媒体数据方法
  onFilterClick(filter:any) {
    if(filter.value === ''){
      alert('Please enter the correct Mission ID');
      return
    } 
  //引用MediaData服务的方法,通过Promise获得数据
    this.commonSvc.filterMedia(filter.value).then( data => this.dataSource.data = data );
  }


  //父组件'Media-Panel'触发的方法,并传递相对应数据
  onMediaDataFilter(mission: any) {
    this.pathName = mission.path_name
    const el = document.getElementById("mediaFilter");
    el.setAttribute("value", mission.id);
    //引用MediaData服务的方法,通过Promise获得数据
    this.commonSvc.filterMedia(mission.id).then( data => this.dataSource.data = data ); 
  }

}
