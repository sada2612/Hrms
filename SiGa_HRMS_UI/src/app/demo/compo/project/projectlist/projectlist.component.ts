import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Project, Api } from 'src/app/Dto/DataTypes';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api-service.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
@Component({
  selector: 'app-projectlist',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './projectlist.component.html',
  styleUrls: ['./projectlist.component.scss']
})
export default class ProjectlistComponent {
  status: boolean;
  constructor(
    private ApiService: ApiService,
    private router: Router,
    private AlertService: AlertService
  ) {
    this.getProjects();
  }
  projects: Project[];
  active: any;

  getProjects() {
    this.ApiService.GetAll(Api.Project).subscribe((data) => {
      this.projects = data['result'];
    });
  }

  addProject() {
    this.router.navigate(['admin/project/create']);
  }

  updateProject(Id: any) {
    this.router.navigate(['admin/project/' + Id]);
  }

  deleteProject(Id: any) {
    this.AlertService.DeleteConfirm().then((result) => {
      if (result.isConfirmed) {
        this.ApiService.Delete(Id, Api.Project).subscribe((res) => {
          if (res == true) {
            this.AlertService.deleteSuccessAlert();
            this.getProjects();
          } else if (res == false) {
            this.AlertService.errorAlert();
          }
        });
      }
    });
  }
}
