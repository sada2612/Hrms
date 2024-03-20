import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Employee, NotificationDto, Api, Leave } from 'src/app/Dto/DataTypes';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api-service.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent {
  employee: Employee;
  Role: any;
  email: any;
  notification: NotificationDto[] = [];
  time: string;
  NotifictionBar = true;
  constructor(
    private AlertService: AlertService,
    private AuthService: AuthService,
    private ApiService: ApiService,
    private router: Router,
    private datePipe: DatePipe,
    private CommonService: CommonService
  ) {}
  ngOnInit() {
    this.decodeJwt();
  }
  decodeJwt() {
    this.ApiService.JwtDecode(localStorage.getItem('jwt'), Api.UserRole).subscribe((data) => {
      if (data['role'] == 'Admin' || data['role'] == 'Hr') {
        this.Role = true;
      } else {
        this.Role = false;
      }
      this.email = data['email'];
      this.getEmpData(this.email);
    });
  }
  getEmpData(email: any) {
    this.ApiService.getbyemail(email, Api.Employee).subscribe((data) => {
      if (data['result'] != null) {
        this.employee = data['result'];
        this.GetAllEmp();
      }
    });
  }

  notificationRead() {
    this.NotifictionBar = false;
  }

  NevigateToNotification(Link) {
    this.notificationRead();
    this.router.navigate([`${Link}`]);
  }

  notificationshow() {
    this.NotifictionBar = true;
  }
  async GetAllEmp() {
    this.ApiService.GetAll(Api.Employee).subscribe((data) => {
      data['result'].forEach((element) => {
        if (element.joinDate == this.datePipe.transform(new Date(), 'yyyy-MM-dd')) {
          var NewNotification = new NotificationDto();
          NewNotification.Name = `It's ${element.firstName}'s 1 Anniversary with siga family `;
          NewNotification.Link = this.Role == true ? 'admin/event' : 'guest/event';
          NewNotification.Icon = 'ti ti-certificate';
          NewNotification.Time = '12:00';
          NewNotification.color = 'primary';
          this.notification.push(NewNotification);
        } else if (element.dateOfBirth == this.datePipe.transform(new Date(), 'yyyy-MM-dd')) {
          var NewNotification = new NotificationDto();
          NewNotification.Name = `It's ${element.firstName}'s birthday today. `;
          NewNotification.Link = this.Role == true ? 'admin/birthday' : 'guest/birthday';
          NewNotification.Icon = 'ti ti-gift';
          NewNotification.Time = '12:00';
          NewNotification.color = 'success';
          this.notification.push(NewNotification);
        }
      });
      this.GetLeave();
      this.GetInterview();
    });
  }

  async GetInterview() {
    this.ApiService.GetAll(Api.Applicant).subscribe((data) => {
      data['result'].forEach((element) => {
        if (
          element.interviewDate == this.datePipe.transform(new Date(), 'yyyy-MM-dd') &&
          element.status == 'Scheduled' &&
          this.Role &&
          element.jobId != null
        ) {
          var NewNotification = new NotificationDto();
          NewNotification.Name = `Reminder ${element.firstName} ${element.lastName}'s Interview today. `;
          NewNotification.Link = this.Role == true ? 'admin/interviews' : 'guest/interviews';
          NewNotification.Icon = 'ti ti-calendar-event';
          NewNotification.Time = `${this.TimePipe(element.interviewTime)}`;
          NewNotification.color = 'warning';
          this.notification.push(NewNotification);
        } else if (
          element.interviewDate == this.datePipe.transform(new Date(), 'yyyy-MM-dd') &&
          element.status == 'Scheduled' &&
          !this.Role &&
          element.employee.email == this.email &&
          element.jobId != null
        ) {
          var NewNotification = new NotificationDto();
          NewNotification.Name = `Reminder ${element.firstName} ${element.lastName}'s Interview today. `;
          NewNotification.Link = this.Role == true ? 'admin/interviews' : 'guest/interviews';
          NewNotification.Icon = 'ti ti-calendar-event';
          NewNotification.Time = `${this.TimePipe(element.interviewTime)}`;
          NewNotification.color = 'warning';
          this.notification.push(NewNotification);
        }
      });
    });
  }

  TimePipe(timeString) {
    return this.CommonService.TimePipe(timeString);
  }
  GetLeave() {
    this.ApiService.GetAll(Api.Leave).subscribe((data) => {
      if (this.Role == true) {
        data['result'].forEach((element: Leave) => {
          if (
            (element.formDate == this.datePipe.transform(new Date(), 'yyyy-MM-dd') && element.status == 'Approved') ||
            element.status == 'Initiated'
          ) {
            var NewNotification = new NotificationDto();
            element.status == 'Approved'
              ? (NewNotification.Name = `${element.employee.firstName} on  ${element.leaveType}. `)
              : (NewNotification.Name = `${element.employee.firstName} Requested for  ${element.leaveType}. `);
            NewNotification.Link = 'admin/leave';
            element.status == 'Approved' ? (NewNotification.Icon = 'ti ti-calendar-minus') : (NewNotification.Icon = 'ti ti-bell-ringing');
            element.status == 'Approved'
              ? (NewNotification.Time = `${element.leaveLength}`)
              : (NewNotification.Time = this.datePipe.transform(element.applyDate, 'dd-MMM h:mm a '));
            element.status == 'Approved' ? (NewNotification.color = 'danger') : (NewNotification.color = 'warning');
            this.notification.push(NewNotification);
          }
        });
      } else if (!this.Role) {
        data['result'].forEach((element) => {
          if (element.formDate == this.datePipe.transform(new Date(), 'yyyy-MM-dd') && element.status == 'Approved') {
            var NewNotification = new NotificationDto();
            NewNotification.Name = `${element.employee.firstName} on  ${element.leaveType}. `;
            NewNotification.Link = 'guest/leave';
            NewNotification.Icon = 'ti ti-calendar-minus';
            NewNotification.Time = `${element.leaveLength}`;
            NewNotification.color = 'danger';
            this.notification.push(NewNotification);
          }
        });
      }
    });
  }

  birthdayimg(data: Employee) {
    var res =
      'https://images.unsplash.com/photo-1604135307399-86c6ce0aba8e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1374&q=80';
    var res1 = `http://localhost:5102/Uploads/Employee/${data?.email}/${data?.imgUrl}`;
    return data?.imgUrl != '' ? res1 : res;
  }

  ViewProfile() {
    if (this.Role) {
      this.router.navigate(['admin/employee/profile/', this.employee.employeeId]);
    } else {
      this.router.navigate(['guest/employee/profile']);
    }
  }

  Calendar() {
    if (this.Role) {
      this.router.navigate(['admin/calendar']);
    } else {
      this.router.navigate(['guest/calendar']);
    }
  }

  EditProfile() {
    if (this.Role) {
      this.router.navigate(['admin/employee/', this.employee.employeeId]);
    } else {
      this.router.navigate(['guest/employee/profile']);
    }
  }
  profile = [
    {
      icon: 'ti ti-user',
      title: 'View Profile'
    },
    {
      icon: 'ti ti-edit-circle',
      title: 'Edit Profile'
    },

    {
      icon: 'ti ti-power',
      title: 'Logout'
    }
  ];

  setting = [
    {
      icon: 'ti ti-help',
      title: 'Support'
    },
    {
      icon: 'ti ti-user',
      title: 'Account Settings'
    },
    {
      icon: 'ti ti-lock',
      title: 'Privacy Center'
    },
    {
      icon: 'ti ti-messages',
      title: 'Feedback'
    },
    {
      icon: 'ti ti-list',
      title: 'Contect Us'
    }
  ];

  LogOut() {
    var res = this.AuthService.logout();
    if (res) {
      this.AlertService.ToastAlert('Sign out successfully').then((data) => {
        if (data.dismiss) {
          this.router.navigate(['/']);
        }
      });
    }
  }
}
