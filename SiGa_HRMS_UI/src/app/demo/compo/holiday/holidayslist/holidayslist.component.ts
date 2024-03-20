import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Holiday, Api } from 'src/app/Dto/DataTypes';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api-service.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-holidayslist',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './holidayslist.component.html',
  styleUrls: ['./holidayslist.component.scss']
})
export default class HolidayslistComponent {
  holidays: any;
  holidayDto: Holiday = new Holiday();
  active: any;

  constructor(
    private AlertService: AlertService,
    private router: Router,
    private ApiService: ApiService
  ) {
    this.getHolidays();
  }

  getHolidays() {
    this.ApiService.GetAll(Api.Holiday).subscribe((data) => {
      this.holidays = data['result'];
    });
  }

  addHoliday() {
    this.router.navigate([`admin/holiday/add`]);
  }

  updateHoliday(Id: number) {
    this.router.navigate([`admin/holiday/${Id}`]);
  }

  deleteHoliday(Id: any) {
    this.AlertService.DeleteConfirm().then((result) => {
      if (result.isConfirmed) {
        this.ApiService.Delete(Id, Api.Holiday).subscribe((res) => {
          if (res == true) {
            this.AlertService.deleteSuccessAlert();
            this.getHolidays();
          } else if (res == false) {
            this.AlertService.errorAlert();
          }
        });
      }
    });
  }
}
