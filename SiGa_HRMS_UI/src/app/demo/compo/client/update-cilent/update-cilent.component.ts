import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api-service.service';
import { Client, Api } from 'src/app/Dto/DataTypes';

@Component({
  selector: 'app-update-cilent',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './update-cilent.component.html',
  styleUrls: ['./update-cilent.component.scss']
})
export default class UpdateCilentComponent {
  updateClientDto: Client;
  status: boolean;
  imageUrl: string;
  imgchange = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private AlertService: AlertService,
    private ApiService: ApiService
  ) {
    this.getClient(this.route.snapshot.paramMap.get('id'));
  }

  updateClient() {
    if (this.imgchange && this.imageUrl != null) {
      this.updateClientDto.imgUrl = this.imageUrl;
    }

    this.AlertService.updateAlert('Client').then((result) => {
      if (result.isConfirmed) {
        this.ApiService.Update(this.updateClientDto, Api.Client).subscribe((response) => {
          if (response == true) {
            this.AlertService.UpdateSuccess().then((res) => {
              if (res) {
                this.router.navigate(['admin/clients']);
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

  getClient(id: any) {
    this.ApiService.Get(id, Api.Client).subscribe((data) => {
      this.updateClientDto = data['result'];
    });
  }

  async selectImage() {
    this.imgchange = true;
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
