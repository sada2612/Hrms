import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Holiday, Api } from 'src/app/Dto/DataTypes';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api-service.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-create-holiday',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './create-holiday.component.html',
  styleUrls: ['./create-holiday.component.scss']
})
export default class CreateHolidayComponent {
  holidayDto: Holiday = new Holiday();
  status: boolean;
  today = new Date().toISOString().split('T')[0];
  imgchange: boolean;
  imageUrl: string;

  constructor(
    private ApiService: ApiService,
    private router: Router,
    private AlertService: AlertService
  ) {}

  async selectImage() {
    const { value: file } = await this.AlertService.SelectImgPopup();

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        (this.imageUrl = e.target.result.toString()),
          this.AlertService.SelectedImageConfirm(e).then((data) => {
            if (data.isConfirmed) {
              this.imgchange = true;
            }
          });
      };
      reader.readAsDataURL(file);
    }
  }
  addHoliday() {
    if (this.imgchange == true) {
      this.holidayDto.imgUrl = this.imageUrl;
    }
    this.ApiService.Add(this.holidayDto, Api.Holiday).subscribe((response) => {
      if (response == true) {
        this.AlertService.ToastAlert('Holiday Added Sucessfully').then(() => this.router.navigate([`admin/holidays`]));
      } else if (response == false) {
        this.AlertService.errorAlert();
      }
    });
  }

  onDateChange(selectedDate: string) {
    const date = new Date(selectedDate);
    if (new Date(date) >= new Date()) {
      if (!this.isWeekday(date)) {
        this.AlertService.Invalid('Oops...', 'You Selected Weekend !', 'error').then((data) => {
          if (data.isConfirmed) {
            this.holidayDto.startDate = '';
          }
        });
      }
    } else {
      this.AlertService.Invalid('Oops...', 'You Selected Date Not Valid !', 'error').then((data) => {
        if (data.isConfirmed) {
          this.holidayDto.startDate = '';
        }
      });
    }
  }

  toonDateChange(selectedDate: string) {
    const date = new Date(selectedDate);

    if (new Date(date) >= new Date(this.holidayDto.startDate)) {
      if (!this.isWeekday(date)) {
        this.AlertService.Invalid('Oops...', 'You Selected Weekend !', 'error').then((data) => {
          if (data.isConfirmed) {
            this.holidayDto.startDate = '';
          }
        });
      }
    }
  }

  private isWeekday(date: Date): boolean {
    const day = date.getDay();
    return day !== 6 && day !== 0;
  }
}
