import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ApiService } from './api-service.service';
import { Api } from '../Dto/DataTypes';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuardService {
  role: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private ApiService: ApiService
  ) {
    this.jwtDecode()
  }
  async jwtDecode() {
   await this.ApiService.JwtDecode(localStorage.getItem('jwt'), Api.UserRole).subscribe((data) => {
      if (data['role'] == 'Hr' || data['role'] == 'Admin') {
        this.role = true;
      } else {
        this.role = false;
      }
    });
  }
  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree> {
    const isAuthenticated = !!localStorage.getItem('jwt');

    if (!isAuthenticated ) {
     return this.role?true:false
      
    } else {
      return true;
    }
  }
}
