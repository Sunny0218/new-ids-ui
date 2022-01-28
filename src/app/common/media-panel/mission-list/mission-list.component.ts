import { Component, OnInit,ViewChild,AfterViewInit,Output,EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-mission-list',
  templateUrl: './mission-list.component.html',
  styleUrls: ['./mission-list.component.css']
})
export class MissionListComponent implements OnInit {

  //定义MatTable表头
  displayedColumns: string[] = ['path_name',
  'create_at',
  'complete_at',
  'state',
  'getdetails',
];

  isChecked:boolean=false;
  isCompleted:boolean=false;
  fromDate: FormControl = new FormControl(null);
  toDate: FormControl = new FormControl(null);
  dataSource = new MatTableDataSource<any>(); //创建空的MatTable数据资源

  @ViewChild (MatPaginator,{static: false}) 
  paginator: MatPaginator; //获得MatPaginator,页码器
  
  @ViewChild (MatSort,{static: false}) 
  sort: MatSort; //获得MatSort,表格排序器

  @Output() 
  private onMissionSelectedEmitter = new EventEmitter<any>(); //构造"选择任务按钮发射器",传递数据给父组件

  constructor( private httpClient:HttpClient ) { }
  ngOnInit(): void {
    this.initTableDate();
    this.filterMission();
  }

  //初始并获得当前日期值给表格日期过滤器
  initTableDate() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth();
    var date = now.getDate();

    var fromDate = new Date(year, month, date-1);
    var toDate = new Date(year, month, date+1);
    this.fromDate.setValue(fromDate);
    this.toDate.setValue(toDate);
  }

  //选择日期过滤数据
  filterMission() {
    var fromDate: Date = this.fromDate.value;
    var toDate: Date = this.toDate.value;
    var fromDateString = "" + fromDate.getFullYear() + this.paddingNumber((fromDate.getMonth() + 1), 2, '0') + this.paddingNumber(fromDate.getDate(), 2, '0');
    var toDateString = "" + toDate.getFullYear() + this.paddingNumber((toDate.getMonth() + 1), 2, '0') + this.paddingNumber(toDate.getDate(), 2, '0');
    
    var body = {
      "from": fromDateString,
      "to": toDateString,
    };

    if(this.isChecked){
      body["media-only"] = true
    }
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    //异步获得MissionList数据
    this.httpClient.post<any>(`${environment.apiHost}/missions/history`, body, httpOptions).subscribe((resp) => {
      let respData: any[] = resp["data"];
      this.dataSource.data = respData.slice();
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  //执行当前函数后,触发"选择任务发射器",并传递数据给父组件
  missionSelected(mission) {
    this.onMissionSelectedEmitter.emit(mission);
  }

  //绑定"isChecked",过滤是否有媒体的数据
  sliderChanged(){
    this.filterMission()
  }

  //简单string过滤表格数据
  doFilter(filterValue: string) {  
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  private paddingNumber(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }
  

}
