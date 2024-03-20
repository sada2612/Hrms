import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Job, Api } from 'src/app/Dto/DataTypes';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api-service.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-update-job',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './update-job.component.html',
  styleUrls: ['./update-job.component.scss']
})
export default class UpdateJobComponent {
  updateJobDto: Job;
  status: boolean;
  constructor(
    private ApiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private AlertService: AlertService
  ) {
    this.getJob(this.route.snapshot.paramMap.get('id'));
  }

  async addCustom() {
    if (this.updateJobDto.postionType == 'Custom') {
      const { value: Designation } = await this.AlertService.CustomAlert('Enter Designation');
      if (Designation) {
        this.updateJobDto.postionType = Designation;
      } else {
        this.updateJobDto.postionType = null;
      }
    } else if (this.updateJobDto.qualification == 'Custom') {
      const { value: qualification } = await this.AlertService.CustomAlert('Enter Qualification');
      if (qualification) {
        this.updateJobDto.qualification = qualification;
      } else {
        this.updateJobDto.qualification = null;
      }
    }
  }
  updateJob() {
    this.AlertService.updateAlert('Job').then((result) => {
      if (result.isConfirmed) {
        this.ApiService.Update(this.updateJobDto, Api.Job).subscribe((response) => {
          if (response == true) {
            this.AlertService.UpdateSuccess().then((res) => {
              if (res) {
                this.router.navigate(['admin/jobs']);
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

  async getJob(id: any) {
    this.ApiService.Get(id, Api.Job).subscribe((data) => {
      this.updateJobDto = data['result'];
    });
  }
}
