import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Api, CalendarDto } from 'src/app/Dto/DataTypes';
import { ApiService } from 'src/app/services/api-service.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export default class CalendarComponent {
  year: any = new Date().getFullYear();
  month: any = new Date().getMonth();
  date: any = new Date().getDate();
  calendar: CalendarDto[] = [];
  calendardata: any[];
  constructor(private ApiService: ApiService) {
    this.getEvents();
  }

  DatePipe(data) {
    return new Date(data).getDate();
  }

  DayPipe(data) {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return dayNames[new Date(data).getDay()];
  }
  MonthPipe(data) {
    const months = [
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
    return months[new Date(data).getMonth() + 1];
  }

  async generateCalendar(year, month) {
    const calendarData = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    let currentDate = new Date(firstDay);

    for (let i = firstDay.getDay() - 1; i >= 0; i--) {
      calendarData.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      calendarData.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return calendarData;
  }

  async getEmployees() {
    this.ApiService.GetAll(Api.Employee).subscribe((data) => {
      data['result'].forEach((emp) => {
        const eventDate = new Date(emp.joinDate);
        var event = new CalendarDto();
        event.date = eventDate;
        event.eventName = `${emp.firstName}'s Work Aniversary`;
        this.calendar.push(event);
      });
      data['result'].forEach((emp) => {
        const eventDate = new Date(emp.dateOfBirth);
        var event = new CalendarDto();
        event.date = eventDate;
        event.eventName = `${emp.firstName}'s Birthday`;
        this.calendar.push(event);
      });
    });

    this.ApiService.GetAll(Api.Holiday).subscribe((data) => {
      data['result'].forEach((emp) => {
        const eventDate = new Date(emp.startDate);
        var event = new CalendarDto();
        event.date = eventDate;
        event.eventName = `${emp.title}`;
        this.calendar.push(event);
      });
    });
    this.calendardata = await this.generateCalendar(this.year, this.month);
  }
  getEvents() {
    this.ApiService.GetAll(Api.Event).subscribe((data) => {
      data['result'].forEach((event) => {
        const eventDate = new Date(event.date);
        var eventdata = new CalendarDto();
        eventdata.date = eventDate;
        eventdata.eventName = event.name;
        this.calendar.push(eventdata);
      });

      this.getEmployees();
    });
  }
  async SelectMonth() {
    await Swal.fire({
      title: 'Select Month',
      input: 'select',
      inputOptions: {
        Month: {
          0: 'January',
          1: 'February',
          2: 'March',
          3: 'April',
          4: 'May',
          5: 'June',
          6: 'July',
          7: 'August',
          8: 'September',
          9: 'October',
          10: 'November',
          11: 'December'
        }
      },
      showCancelButton: true,
      inputValidator: async (value) => {
        this.month = value;
        this.calendardata = await this.generateCalendar(this.year, value);
      }
    });
  }
}
