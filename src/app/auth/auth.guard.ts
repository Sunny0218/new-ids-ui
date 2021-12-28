import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';

@Injectable()
export class AuthGuard extends KeycloakAuthGuard{

  constructor(
    protected router: Router, 
    protected keycloakAngular: KeycloakService
    ) {
    super(router, keycloakAngular);
  }

  public async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ): Promise<boolean | UrlTree> {

    // Force the user to log in if currently unauthenticated.
    // 如果当前未通过身份验证，则强制用户登录。
    if (!this.authenticated) {
      await this.keycloakAngular.login({
        redirectUri: window.location.origin + state.url,
      });
    }

    // // Get the roles required from the route.
    // // 从路由中获取所需的角色
    // const requiredRoles = route.data.roles;

    // // Allow the user to to proceed if no additional roles are required to access the route.
    // // 如果不需要其他角色来访问路由，则允许用户继续。
    // if (!(requiredRoles instanceof Array) || requiredRoles.length === 0) {
    //   return true;
    // }

    // // Allow the user to proceed if all the required roles are present.
    // // 如果出现了所有必需的角色，允许用户继续。
    // return requiredRoles.every((role) => this.roles.includes(role));

    return this.authenticated;
  }

  
}
