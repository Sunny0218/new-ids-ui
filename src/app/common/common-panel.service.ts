import { Injectable } from '@angular/core';
import { MediaElement } from './media-panel/media-list/media-element.implements';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';


//定义MediaElement接口类
export class MediaElementImpl implements MediaElement {
  public name: string;
  public createAt: string;
  public url: string;
  public isVideo: boolean;

  constructor(name: string, createAt: string, missionId: string,) {
    this.name = name;
    this.createAt = createAt;
    this.url =environment.mediaHost + "/" + missionId + "/" + name;

    if (name.indexOf(".") < 0) {
      this.url += ".jpg";
      this.isVideo = false;
    } else {
      this.isVideo = true;
    }
  }
}

//异步获得Media数据服务
@Injectable()
export class CommonPanelService {

  MEDIA_DATA:MediaElement[] = []; //定义媒体数据,为MediaElement接口
  filterMissionId: string;
  
  constructor( private http:HttpClient ) {

  }

  //返回错误信息方法
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };
  
  //封装异步get请求方法
  getRequest(url: string) {
    return this.http.get<any>(url, { responseType: 'json' }).
      pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  //封装异步post请求方法
  postRequest(url: string, data: JSON) {
    return this.http.post<any>(url, data, { responseType: 'json' }).
    pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  //异步请求,获得Media数据
  async filterMedia(missionId) {
  this.MEDIA_DATA.splice(0)
  this.filterMissionId = missionId
  var url = environment.apiHost + "/media/media_meta_data";
  var body = null;
  if (this.filterMissionId) {
    body = {
      "filter": {
        "mission_id": this.filterMissionId
      }
    };
  };
  const resp = await this.postRequest(url,body).toPromise();
  resp.data.map( (row:any) => {
        return new MediaElementImpl(row.filename,row.create_at,row.mission_id)
      }).forEach( (m: MediaElement) => this.MEDIA_DATA.push(m))
  return this.MEDIA_DATA;
}

  //异步请求，获得所有任务路径数据
  async loadPaths() {

    var missionPaths=[]
    const resp = await this.getRequest(`${environment.apiHost}/missions/paths`).toPromise();
    if (resp["code"] != 100) {
      return
    }
    const data = resp["data"];
    data.filter( f => f["actions"] != "null" ).forEach( p => {

      p["actions"] = JSON.parse( p["actions"] ).map( s => { return s["type"] } );
      missionPaths.push(p);

    });

    return missionPaths;
  }

}
