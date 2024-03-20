import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ApiService } from './api-service.service';
import { Api } from '../Dto/DataTypes';

@Injectable({
  providedIn: 'root'
})
export class GuestAuthGuardService {
  role: any;
  constructor(
    private router: Router,
    private authService: AuthService,
    private Apiservice: ApiService
  ) {
    this.jwtDecode()
  }
  async jwtDecode() {
   await this.Apiservice.JwtDecode(localStorage.getItem('jwt'), Api.UserRole).subscribe((data) => {
      data['role'] == 'Employee' ? (this.role = true) : (this.role = false);
    });
  }
  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree> {
    
    const isAuthenticated = !!localStorage.getItem('jwt');
    if (!isAuthenticated ) {
      return this.role?true:false
    }else{
      return true;
    }
  }
}
