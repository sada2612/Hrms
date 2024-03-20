import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project, Api } from 'src/app/Dto/DataTypes';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api-service.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-update-project',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './update-project.component.html',
  styleUrls: ['./update-project.component.scss']
})
export default class UpdateProjectComponent {
  projectDto: Project;
  status: boolean;
  clients: any;
  imageUrl: string;
  imgchange: boolean;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private AlertService: AlertService,
    private ApiService: ApiService
  ) {}
  ngOnInit(): void {
    this.getClients();
    this.getProject(this.route.snapshot.paramMap.get('id'));
  }

  getClients() {
    this.ApiService.GetAll(Api.Client).subscribe((data) => {
      this.clients = data['result'];
    });
  }

  updateProject() {
    if (this.projectDto.clientId === 'null') {
      this.projectDto.clientId = null;
    }

    if (this.imgchange && this.imageUrl != null) {
      this.projectDto.logoUrl = this.imageUrl;
    }

    this.AlertService.updateAlert('Employee').then((result) => {
      if (result.isConfirmed) {
        this.ApiService.Update(this.projectDto, Api.Project).subscribe((response) => {
          if (response == true) {
            this.AlertService.UpdateSuccess().then((res) => {
              if (res) {
                this.router.navigate(['admin/projects']);
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

  getProject(id: any) {
    this.ApiService.Get(id, Api.Project).subscribe((data) => {
      this.projectDto = data['result'];
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
