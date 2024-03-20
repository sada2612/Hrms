import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Holiday, Api } from 'src/app/Dto/DataTypes';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api-service.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-update-holiday',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './update-holiday.component.html',
  styleUrls: ['./update-holiday.component.scss']
})
export default class UpdateHolidayComponent {
  holidayDto: Holiday;
  status: boolean;
  today = new Date().toISOString().split('T')[0];
  imageUrl: string;
  imgchange: boolean;

  constructor(
    private ApiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private AlertService: AlertService
  ) {}

  ngOnInit(): void {
    this.getHoliday(this.route.snapshot.paramMap.get('id'));
  }

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
  updateHoliday() {
    if (this.imgchange == true) {
      this.holidayDto.imgUrl = this.imageUrl;
    }
    this.AlertService.updateAlert('Holiday').then((result) => {
      if (result.isConfirmed) {
        this.ApiService.Update(this.holidayDto, Api.Holiday).subscribe((response) => {
          if (response == true) {
            this.AlertService.UpdateSuccess().then((res) => {
              if (res) {
                this.router.navigate(['admin/holidays']);
              }
            });
          } else if (response == false) {
            this.AlertService.errorAlert();
          }
        });
      } else if (result.isDenied) {
        this.AlertService.UpdateErrorAlert();
      }
    });
  }

  getHoliday(id: any) {
    this.ApiService.Get(id, Api.Holiday).subscribe((data) => {
      this.holidayDto = data['result'];
    });
  }
}
