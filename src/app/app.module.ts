
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
        redirectTo: '/media',
        pathMatch: 'full',
      },
      {
        path: '',
        loadChildren: () => import('./common/common-panel.module').then(m => m.CommonPanelModule),

        //** keycloak authGuard**
        canActivate:[AuthGuard]  

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
