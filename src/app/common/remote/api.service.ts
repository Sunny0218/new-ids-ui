import { HttpClient,HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private _host: string = environment.apiHost;

  constructor( private http:HttpClient) { }

  /** Missions */
  loadMissionsFromTime(from: Date): Observable<any> {
    return this.loadMissionsInDateRange(from, new Date());
  }

  loadMissionsInDateRange(from: Date, to: Date): Observable<any> {
    const fromTxt = from.toISOString();
    const toTxt = to.toISOString();

    return this.post<any>('/missions/history', {
      from: fromTxt,
      to: toTxt
    });
  }

  readMissionStatus(missionIdOrRef: string): Observable<any> {
    return this.get<any>(`/missions/${missionIdOrRef}/status`);
  }

  readMissionStepStatusByRobot(robotRef: string): Observable<any> {
    return this.get<any>(`/missions/${robotRef}/steps`);
  }

  readMissionPaths(): Observable<any> {
    return this.get<any>('/missions/paths');
  }

  createNewMissionByPath(pathId: string): Observable<any> {
    return this.post<any>('/missions', {
      path_id: pathId
    });
  }

  createNewMissionByPos(pos: number[]): Observable<any> {
    return this.post<any>('/missions/path-planning', {
      start_path: environment.pathPlanningStartPathId,
      home_path: environment.pathPlanningHomePathId,
      points: pos
    });
  }

  /** Robot */
  loadRobots(): Observable<any> {
    return this.get<any>('/robots');
  }

  readRobotStatus(robotRef: string): Observable<any> {
    return this.get<any>(`/robots/${robotRef}/status`);
  }

  readAirportStatus(airportRef: string): Observable<any> {
    return this.get<any>(`/airport/${airportRef}/status`);
  }

  emergencyHovering(robotId: string = 'all'): Observable<any> {
    return this.post<any>(`/robots/${robotId}/commands/emergency-hovering`, {});
  }

  emergencyLanding(robotId: string = 'all'): Observable<any> {
    return this.post<any>(`/robots/${robotId}/commands/emergency_landing`, {});
  }

  /** Stock */
  loadStockFloorPlan(rackId: number, sceneId: number): Observable<any> {
    return this.post<any>('/stock/rack-cells', {
      scenes_id: sceneId,
      rack_id: rackId
    })
  }

  loadStockTakingResult(missionRef: string): Observable<any> {
    return this.post<any>('/stock/mission-result', {
      mission_ref_num: missionRef
    });
  }

  loadProducts(): Observable<any> {
    return this.get<any>('assets/product-list.json');
  }

  /** Media */
  loadMediumByMission(missionRef: string): Observable<any> {
    return this.post<any>('/media/media_meta_data', {
      filter: {
        mission_ref_num: missionRef
      }
    });
  }

  private getUrl(uri: string): string {
    return this._host + uri;
  }

  private get<T>(uri: string, params: any = {}): Observable<T> {

    // TODO: append the query part to url
    let options = {};

    options['responseType'] = 'application/json';

    return this.http.get<T>(this.getUrl(uri), options);
  }

  private post<T>(uri: string, body: any): Observable<T> {
    let options = { 
      
    };

    options['responseType'] = 'application/json';

    return this.http.post<T>(this.getUrl(uri), body, options);
  }





}
