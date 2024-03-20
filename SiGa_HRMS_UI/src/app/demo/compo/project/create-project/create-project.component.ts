import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Client, Project, Api } from 'src/app/Dto/DataTypes';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api-service.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export default class CreateProjectComponent {
  status: boolean;
  clients: Client[];
  projectDto: Project = new Project();
  imageUrl: string;
  imgchange: boolean = false;
  constructor(
    private ApiService: ApiService,
    private router: Router,
    private AlertService: AlertService
  ) {
    this.getClients();
  }

  getClients() {
    this.ApiService.GetAll(Api.Client).subscribe((data) => {
      this.clients = data['result'];
    });
  }

  addProject() {
    if (this.imgchange == true) {
      this.projectDto.logoUrl = this.imageUrl;
    }
    this.ApiService.Add(this.projectDto, Api.Project).subscribe((response) => {
      if (response == true) {
        this.AlertService.ToastAlert('Project Added Sucessfully').then(() => this.router.navigate([`admin/projects`]));
      } else if (response == false) {
        this.AlertService.errorAlert();
      }
    });
  }
  async EmailValidate() {
    this.ApiService.ValidateEmail(this.projectDto.email, Api.Project).subscribe((res) => {
      if (!res) {
        this.AlertService.Invalid('Warning', 'Your Email is Invalid :)', 'error').then((res) => {
          if (res.isConfirmed) {
            this.projectDto.email = '';
          }
        });
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
}
