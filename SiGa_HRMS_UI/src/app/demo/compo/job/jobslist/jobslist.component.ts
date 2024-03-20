import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Job, Api } from 'src/app/Dto/DataTypes';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api-service.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-jobslist',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './jobslist.component.html',
  styleUrls: ['./jobslist.component.scss']
})
export default class JobslistComponent {
  jobDto: Job = new Job();
  jobs: Job[];
  active: any;

  constructor(
    private ApiService: ApiService,
    private router: Router,
    private AlertService: AlertService
  ) {
    this.getJobs();
  }

  getJobs() {
    this.ApiService.GetAll(Api.Job).subscribe((data) => {
      this.jobs = data['result'];
    });
  }

  addJob() {
    this.router.navigate(['admin/job/add']);
  }

  updateJob(Id: any) {
    this.router.navigate(['admin/job/', Id]);
  }

  ApplyJob(Id: any) {
    this.router.navigate(['admin/interview/add/']);
  }

  deleteJob(Id: any) {
    this.AlertService.DeleteConfirm().then((result) => {
      if (result.isConfirmed) {
        this.ApiService.Delete(Id, Api.Job).subscribe((res) => {
          if (res == true) {
            this.AlertService.deleteSuccessAlert();
            this.getJobs();
          } else if (res == false) {
            this.AlertService.errorAlert();
          }
        });
      }
    });
  }
}
