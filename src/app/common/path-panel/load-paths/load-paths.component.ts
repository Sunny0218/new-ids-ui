import { Component, OnInit } from '@angular/core';
import { CommonPanelService } from '../../common-panel.service';
import { environment } from 'src/environments/environment'; 
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReconfirmDialogComponent } from '../reconfirm-dialog/reconfirm-dialog.component';

@Component({
  selector: 'app-load-paths',
  templateUrl: './load-paths.component.html',
  styleUrls: ['./load-paths.component.css'],
  providers:[CommonPanelService]
})
export class LoadPathsComponent implements OnInit {

  missionPaths= [];
  constructor(
    private commonSvc:CommonPanelService,
    public reconfirmDialog:MatDialog
  ) { }

  async ngOnInit() {
    await this.commonSvc.loadPaths().then( data => { this.missionPaths = data} );
    
  }

  //重新加载所有任务路径
  async reloadPaths() {
    await this.commonSvc.loadPaths().then( data => { this.missionPaths = data} );
    
  }

  //删除任务路径
  removeMissionPath(path:any,$event) {
    $event.stopPropagation()

    const dialogRef = this.reconfirmDialog.open(ReconfirmDialogComponent,{
      width:'500px',
      data:{
        pathName: path["name"],
        type:"delete"
      }
    })
    
    dialogRef.afterClosed().subscribe( result => {

      if(result) {
        var postData:any = {};
        postData["path_id"] = path.id;
    
        var pathId = path.id.replace(/-/g,"");
    
        this.commonSvc.postRequest(`${environment.apiHost}/missions/paths/${pathId}/cancel`, postData).subscribe((resp) => {
          if (resp["code"] != 100) {
            console.error(`unable to remove mission path ${path["name"]}, cause: ` + resp["message"]);
          }
    
          this.commonSvc.loadPaths().then( data => { this.missionPaths = data} );
        });
      }
    })
  }

  //执行任务路径
  doPlanningMissions(path,$event) {
    $event.stopPropagation()

    const dialogRef = this.reconfirmDialog.open(ReconfirmDialogComponent,{
      width:'500px',
      data:{
        pathName: path["name"],
        type:"execute"
      }
    })

    dialogRef.afterClosed().subscribe( result => {

      if (result) {
        var postData:any = {};
        postData["path_id"] = path.id;
        this.commonSvc.postRequest(`${environment.apiHost}/missions`, postData).subscribe( (resp) => {
          if (resp["code"] != 101) {
            console.error(`unable to execute mission ${path["name"]}, cause: ` + resp["message"])
          }
          //To Do:成功執行后提示；
          console.log('success');
          
        });
      }
    })
  }

}
