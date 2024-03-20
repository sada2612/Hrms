import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Api, Event } from 'src/app/Dto/DataTypes';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api-service.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss']
})
export default class CreateEventComponent {
  eventDto: Event = new Event();
  status: boolean;
  imageUrl: any;

  constructor(
    private ApiService: ApiService,
    private router: Router,
    private AlertService: AlertService
  ) {}
  addEvent() {
    this.eventDto.imgUrl = this.imageUrl;
    this.ApiService.Add(this.eventDto, Api.Event).subscribe((response) => {
      if (response == true) {
        this.router.navigate([`admin/event`]);
      } else if (response == false) {
        this.AlertService.errorAlert();
      }
    });
  }

  async selectImage() {
    const { value: file } = await this.AlertService.SelectImgPopup();

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        (this.imageUrl = e.target.result.toString()), this.AlertService.SelectedImageConfirm(e);
      };
      reader.readAsDataURL(file);
    }
  }
}
