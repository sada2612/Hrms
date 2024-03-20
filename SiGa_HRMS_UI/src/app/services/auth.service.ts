import { Injectable } from '@angular/core';
import { ApiService } from './api-service.service';
import { Router } from '@angular/router';
import { Api } from '../Dto/DataTypes';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private Apiservice: ApiService,
    private router: Router,
    private AlertService: AlertService
  ) {}
  login(email: string, password: string) {
    this.Apiservice.login(email, password, Api.UserRole).subscribe((data) => {
      if (data != '') {
        this.Apiservice.JwtDecode(data, Api.UserRole).subscribe((n) => {
          localStorage.setItem('jwt', data);
          if (n.role == 'Admin' || n.role == 'Hr') {
            this.router.navigate(['admin/dashboard']);
          } else if (n.role == 'Employee') {
            this.router.navigate(['guest/dashboard']);
          }
        });
      } else {
        this.AlertService.Invalid('error', 'Oops...', 'Something went wrong!');
      }
    });
  }

  logout(): boolean {
    localStorage.clear();
    return true;
  }
}
