
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

import { SharedModule } from './shared/shared.module';
import { SpinnerComponent } from './shared/spinner.component';
import { LoginPageComponent } from './login-page/login-page.component';

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
    component:LoginPageComponent
  },
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/media',
        pathMatch: 'full'
      },
      {
        path: '',
        loadChildren:
          () => import('./common/common-panel.module').then(m => m.CommonPanelModule)
      },
      { 
        path: '**', 
        redirectTo: '/media'
      },
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
    RouterModule.forRoot(AppRoutes),
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS),
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
