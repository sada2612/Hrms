import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from 'src/app/services/api-service.service';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';
import { Api } from 'src/app/Dto/DataTypes';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export default class LoginComponent {
  constructor(
    private Auth: AuthService,
    private ApiService: ApiService,
    private CommonService: CommonService,
    private router: Router,
    private AlertService: AlertService
  ) {
    this.Auth.logout();
  }

  User: any = {
    Email: '',
    Password: ''
  };

  generateOTP() {
    let digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  }
  async forgetPassword(email) {
    if (email != '') {
      this.AlertService.SendOtp(email).then((data) => {
        if (data.isConfirmed) {
          var otp = this.generateOTP();
          this.CommonService.forgetPassword(email, otp);
          this.ApiService.sendemail(this.CommonService.forgetPassword(email, otp)).subscribe();
          this.AlertService.ToastAlert('OTP Sent successfully').then(async (data) => {
            if (data.dismiss) {
              this.ValidateOtp(email, otp);
            }
          });
        }
      });
    } else {
      const { value: newemail } = await this.AlertService.InputAlert(
        'Input email address',
        'email',
        'Your email address',
        'Enter your email address'
      );
      if (newemail) {
        (await this.AlertService.SimpleAlert(`Entered email: ${newemail}`)).isConfirmed
          ? this.forgetPassword(newemail)
          : this.router.navigate(['/']);
      }
    }
  }

  async ValidateOtp(email, otp) {
    const { value: OTP } = await this.AlertService.InputAlert('Enter your OTP', 'text', `${email}`, 'Enter your OTP');
    if (OTP) {
      if ((await this.AlertService.SimpleAlert(`Entered OTP: ${OTP}`)).isConfirmed) {
        if (otp == OTP) {
          const { value: password } = await this.AlertService.InputAlert(
            'Enter your new password',
            'password',
            `Password`,
            'Enter your password'
          );
          if (password) {
            this.AlertService.LeaveApprove("You won't be able to revert this!", 'Yes').then((result) => {
              if (result.isConfirmed) {
                this.ApiService.GetAll(Api.UserRole).subscribe((data) => {
                  var res = data['result'].find((k) => {
                    return k.email == email;
                  });
                  res.password = password;
                  this.ApiService.Update(res, Api.UserRole).subscribe((data) => {
                    if (data) {
                      let timerInterval;
                      this.AlertService.ToastAlert('Password Updated SucessFully');
                    }
                  });
                });
              }
            });
          }
        } else {
          this.AlertService.Invalid('Oops...', 'OTP Not Matched!', 'error').then(() => {
            this.ValidateOtp(email, otp);
            // data.isConfirmed ? this.ValidateOtp(email, otp) : this.router.navigate['/'];
          });
        }
      }
    }
  }
  async login() {
    await this.Auth.login(this.User.Email, this.User.Password);
  }
}
