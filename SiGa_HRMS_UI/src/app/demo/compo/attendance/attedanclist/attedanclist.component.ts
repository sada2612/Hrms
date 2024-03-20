import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Attendance, Api } from 'src/app/Dto/DataTypes';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api-service.service';
import { CommonService } from 'src/app/services/common.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-attedanclist',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './attedanclist.component.html',
  styleUrls: ['./attedanclist.component.scss']
})
export default class AttedanclistComponent {
  today: any;
  leavesData: any;
  AllAttedanc: Attendance[];
  att: Attendance[];
  active: any;
  constructor(
    private ApiService: ApiService,
    private AlertService: AlertService,
    private datePipe: DatePipe,
    private CommonService: CommonService,
    private router: Router
  ) {
    this.today = this.datePipe.transform(new Date(), 'MMM d, y');
    this.GetAllAttedanc();
  }

  GetAllAttedanc() {
    this.ApiService.GetAll(Api.Attendance).subscribe((data) => {
      this.AllAttedanc = data['result'];
      this.todayAtt(this.today);
    });
  }

  nevigateProfile(Id) {
    this.router.navigate([`admin/attendanceprofile/`, Id]);
  }

  todayAtt(date) {
    const currentDate = formatDate(new Date(date), 'yyyy-MM-dd', 'en-US');
    this.today = this.datePipe.transform(date, 'MMM d, y');
    this.att = this.AllAttedanc.filter((date) => date.date === currentDate);
  }

  workinHours(time) {
    return this.CommonService.Total(time);
  }

  TimePipe(timeString) {
    return this.CommonService.TimePipe(timeString);
  }

  async selectDate() {
    const { value: date } = await this.AlertService.AttedanceDateAlert('Attedance Date');
    if (date) {
      this.AlertService.SimpleAlert(`Attedance date : ${date}`).then((data) => {
        if (data.isConfirmed) {
          this.todayAtt(date);
          if (this.att.length == 0) {
            this.AlertService.NotfoundAlert().then(() => {
              this.todayAtt(formatDate(new Date(), 'yyyy-MM-dd', 'en-US'));
            });
          }
        }
      });
    }
  }
}
