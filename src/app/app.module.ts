
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FullComponent } from './layouts/full/full.component';
import { AppHeaderComponent } from './layouts/full/header/header.component';
import { AppSidebarComponent } from './layouts/full/sidebar/sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemoMaterialModule } from './demo-material-module';
import { NgEventBus } from 'ng-event-bus';
import { MqttModule, IMqttServiceOptions, MqttService } from "ngx-mqtt";
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import { SharedModule } from './shared/shared.module';
import { SpinnerComponent } from './shared/spinner.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth.guard';
import { AMapComponent } from './common/a-map/a-map.component';
import { MediaPanelModule } from './common/media-panel/media-panel.module';
import { MediaPanelComponent } from './common/media-panel/media-panel.component';
import { TeamPanelComponent } from './components/team-panel/team-panel.component';
import { MissionPanelComponent } from './components/mission-panel/mission-panel.component';
import { WaylinePanelComponent } from './components/wayline-panel/wayline-panel.component';
import { WaylineSettingsComponent } from './components/wayline-settings/wayline-settings.component';
import { DeviceStatusComponent } from './components/device-status/device-status.component';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}

export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: 'ids.hdcircles.tech',
  port: 443,
  path: '/mqtt',
  protocol: 'wss',
  username:'ids',
  password:'ids6688'
}

const AppRoutes: Routes = [
  {
    path:'login',
    component:LoginPageComponent,
    canActivate:[AuthGuard]
  },
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/team',
        pathMatch: 'full',
      },
      {
        path:'team',
        component:TeamPanelComponent,
        canActivate:[AuthGuard]
      },
      {
        path:'mission',
        component:MissionPanelComponent,
        canActivate:[AuthGuard]
      },
      {
        path:'wayline',
        component:WaylinePanelComponent,
        canActivate:[AuthGuard]
      },
      { 
        path: '**', 
        redirectTo: '/team'
      },
      // {
      //   path: '',
      //   loadChildren: () => import('./common/common-panel.module').then(m => m.CommonPanelModule),
      //   //** keycloak authGuard**
      //   canActivate:[AuthGuard]  
      // },
      // {
      //   path: '',
      //   loadChildren:
      //     () => import('./material-component/material.module').then(m => m.MaterialComponentsModule)
      // },
      // {
      //   path: 'dashboard',
      //   loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      // }
    ]
  }

];

@NgModule({
  declarations: [
    AppComponent,
    FullComponent,
    AppHeaderComponent,
    SpinnerComponent,
    AppSidebarComponent,
    LoginPageComponent,
    AMapComponent,
    MediaPanelComponent,
    TeamPanelComponent,
    MissionPanelComponent,
    WaylinePanelComponent,
    WaylineSettingsComponent,
    DeviceStatusComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    HttpClientModule,
    SharedModule,
    MediaPanelModule,
    RouterModule.forRoot(AppRoutes),
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    AuthModule,
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy
    },
    NgEventBus,
    MqttService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
