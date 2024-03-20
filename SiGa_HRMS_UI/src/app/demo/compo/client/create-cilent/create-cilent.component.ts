import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Client, Api } from 'src/app/Dto/DataTypes';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api-service.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-create-cilent',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './create-cilent.component.html',
  styleUrls: ['./create-cilent.component.scss']
})
export default class CreateCilentComponent {
  clientDto: Client = new Client();
  status: boolean;
  imageUrl: string;
  imgchange: boolean = false;

  constructor(
    private router: Router,
    private AlertService: AlertService,
    private ApiService: ApiService
  ) {}

  addClient() {
    if (this.imgchange == true) {
      this.clientDto.imgUrl = this.imageUrl;
    }
    this.ApiService.Add(this.clientDto, Api.Client).subscribe((response) => {
      if (response == true) {
        this.AlertService.ToastAlert('Client Added Sucessfully').then(() => this.router.navigate([`admin/clients`]));
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

  async EmailValidate() {
    this.ApiService.ValidateEmail(this.clientDto.email, Api.Client).subscribe((res) => {
      if (!res) {
        this.AlertService.Invalid('Warning', 'Your Email is Invalid :)', 'error').then((res) => {
          if (res.isConfirmed) {
            this.clientDto.email = '';
          }
        });
      }
    });
  }
}
