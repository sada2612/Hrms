import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ApiService } from 'src/app/services/api-service.service';
import { Holiday, Api } from 'src/app/Dto/DataTypes';

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

  constructor(private ApiService: ApiService) {
    this.getHolidays();
  }

  getHolidays() {
    this.ApiService.GetAll(Api.Holiday).subscribe((data) => {
      this.holidays = data['result'];
    });
  }
}
