import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Applicant, Job, Api } from 'src/app/Dto/DataTypes';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api-service.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-update-interview',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './update-interview.component.html',
  styleUrls: ['./update-interview.component.scss']
})
export default class UpdateInterviewComponent {
  updateApplicatentDto: Applicant;
  status: boolean;
  jobs: Job[];
  imgchange: boolean;
  imageUrl: string;
  resumechange: boolean;
  resumeUrl: string;
  today: any = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  emps: any;
  constructor(
    private ApiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private AlertService: AlertService,
    private datePipe: DatePipe
  ) {
    this.getJobs();
    this.getApplicant(this.route.snapshot.paramMap.get('id'));
    this.empList();
  }

  empList() {
    this.ApiService.GetAll(Api.Employee).subscribe((data) => {
      this.emps = data['result'];
    });
  }
  async addCustom() {
    if (this.updateApplicatentDto.qualification == 'Custom') {
      const { value: Qualification } = await this.AlertService.CustomAlert('Enter Qualification');
      if (Qualification) {
        this.updateApplicatentDto.qualification = Qualification;
      } else {
        this.updateApplicatentDto.qualification = null;
      }
    }
  }
  updateApplicant() {
    if (this.imgchange && this.imageUrl != null) {
      this.updateApplicatentDto.imgUrl = this.imageUrl;
    }

    if (this.resumechange && this.resumeUrl != null) {
      this.updateApplicatentDto.resumeUrl = this.resumeUrl;
    }

    this.updateApplicatentDto.job = null;

    this.AlertService.updateAlert('Interview').then((result) => {
      if (result.isConfirmed) {
        this.ApiService.Update(this.updateApplicatentDto, Api.Applicant).subscribe((response) => {
          if (response == true) {
            this.AlertService.UpdateSuccess().then((res) => {
              if (res) {
                this.router.navigate(['admin/interviews']);
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
  getJobs() {
    this.ApiService.GetAll(Api.Job).subscribe((data) => {
      this.jobs = data['result'];
    });
  }

  async selectImage() {
    this.imgchange = true;
    const { value: file } = await this.AlertService.SelectImgPopup();

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        (this.imageUrl = e.target.result.toString()), this.AlertService.SelectedResumeConfirm(this.imageUrl);
      };

      reader.readAsDataURL(file);
    }
  }

  async selectResume() {
    this.resumechange = true;
    const { value: file } = await this.AlertService.SelectResumePopup();

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        (this.resumeUrl = e.target.result.toString()), this.AlertService.SelectedImageConfirm(e);
      };

      reader.readAsDataURL(file);
    }
  }
  getApplicant(id: any) {
    this.ApiService.Get(id, Api.Applicant).subscribe((data) => {
      this.updateApplicatentDto = data['result'];
    });
  }
}
