import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Api, Event } from 'src/app/Dto/DataTypes';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api-service.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-eventslist',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './eventslist.component.html',
  styleUrls: ['./eventslist.component.scss']
})
export default class EventslistComponent {
  active: any;
  events: Event[];
  eventsByMonth: any[] = [];
  month: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  employees: any;
  Joinevent: Event;
  array: any[];
  role: any;
  constructor(
    private ApiService: ApiService,
    private AlertService: AlertService,
    private router: Router
  ) {
    this.getEvents();
    this.decodeJwt();
  }

  decodeJwt() {
    this.ApiService.JwtDecode(localStorage.getItem('jwt'), Api.UserRole).subscribe((data) => {
      this.role = data['role'];
    });
  }
  getMonthName(index: number): string {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];

    return monthNames[index];
  }
  getEmployees() {
    this.ApiService.GetAll(Api.Employee).subscribe((data) => {
      data['result'].forEach((emp) => {
        var Joinevent = new Event();
        Joinevent.name = `${emp.firstName}`;
        Joinevent.date = emp.joinDate;
        Joinevent.details = 'anniversary';
        Joinevent.imgUrl = emp.imgUrl
          ? `http://localhost:5102/Uploads/Employee/${emp.email}/${emp.imgUrl}`
          : 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/448976/berlin.jpg';
        Joinevent.eventID = 0;
        Joinevent.email = emp.email;

        this.eventsByMonth.push(Joinevent);
      });
      this.array = this.upcomingArray(this.eventsByMonth);
    });
  }

  upcomingArray(date) {
    var newarray = [];
    var newarray1 = [];
    date
      .sort((a, b) => {
        return (
          new Date(new Date().getFullYear(), new Date(a.date).getMonth(), new Date(a.date).getDate()).getTime() -
          new Date(new Date().getFullYear(), new Date(b.date).getMonth(), new Date(b.date).getDate()).getTime()
        );
      })
      .forEach((data) => {
        if (new Date(new Date().getFullYear(), new Date(data.date).getMonth(), new Date(data.date).getDate()) < new Date()) {
          newarray1.push(data);
        } else {
          newarray.push(data);
        }
      });

    return [...newarray, ...newarray1];
  }
  deleteEvent(Id: any) {
    this.AlertService.DeleteConfirm().then((result) => {
      if (result.isConfirmed) {
        this.ApiService.Delete(Id, Api.Event).subscribe((res) => {
          if (res == true) {
            this.AlertService.deleteSuccessAlert().then(() => {
              this.getEvents();
            });
          } else if (res == false) {
            this.AlertService.errorAlert();
          }
        });
      }
    });
  }
  addEvent() {
    this.router.navigate(['admin/event/add']);
  }
  getEvents() {
    this.ApiService.GetAll(Api.Event).subscribe((data) => {
      data['result'].forEach((event) => {
        event.imgUrl = `http://localhost:5102/Uploads/Event/${event.name}/${event.imgUrl}`;
        this.eventsByMonth.push(event);
      });

      this.getEmployees();
    });
  }
}
