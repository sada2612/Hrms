import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Applicant, Api } from 'src/app/Dto/DataTypes';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api-service.service';
import { CommonService } from 'src/app/services/common.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-interviewlist',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './interviewlist.component.html',
  styleUrls: ['./interviewlist.component.scss']
})
export default class InterviewlistComponent {
  active: any;
  applicantDto: Applicant;
  interviews: Applicant[];
  todayInterviews: Applicant[];
  today: any;

  constructor(
    private ApiService: ApiService,
    private router: Router,
    private AlertService: AlertService,
    private datePipe: DatePipe,
    private CommonService: CommonService
  ) {
    this.today = this.datePipe.transform(new Date(), 'MMM d, y');
    this.getInterviews();
  }

  interviewDone(Id: any) {
    this.ApiService.Get(Id, Api.Applicant).subscribe((data) => {
      this.applicantDto = data['result'];
      if (data['result'].status == 'Scheduled') {
        data['result'].status = 'Completed';
      }
      this.ApiService.Update(data['result'], Api.Applicant).subscribe((res) => {
        if (res) {
          this.AlertService.ToastAlert('Interview Done successfully').then(() => {
            this.getInterviews();
          });
        }
      });
    });
  }

  getInterviews() {
    this.ApiService.GetAll(Api.Applicant).subscribe((data) => {
      this.todayInterviews = data['result'].filter((data) => {
        return data.jobId != null;
      });
    });
  }

  todayInterview(date) {
    const currentDate = formatDate(new Date(date), 'yyyy-MM-dd', 'en-US');
    this.todayInterviews = this.interviews.filter((date) => date.interviewDate === currentDate);
  }
  addApplicant() {
    this.router.navigate(['admin/interview/add']);
  }

  getApplicant(Id: any) {
    this.ApiService.Get(Id, Api.Applicant).subscribe((data) => {
      this.applicantDto = data['result'];
    });
    return this.applicantDto;
  }

  ViewFeedBack(text: string) {
    this.AlertService.ViewFeedBack(text);
  }

  sendMail(email) {
    return 'mailto:' + email + '?subject=hii';
  }
  async FeedBackDone(id) {
    var user = this.todayInterviews.find((data) => {
      return data.applicantId == id;
    });
    const { value: text } = await this.AlertService.FeedBack(user.firstName);
    if (text) {
      this.AlertService.FeedBackResult(text).then((data) => {
        if (data.isConfirmed) {
          this.ApiService.JwtDecode(localStorage.getItem('jwt'), Api.UserRole).subscribe((data) => {
            this.ApiService.getbyemail(data['email'], Api.Employee).subscribe((data) => {
              user.feedBack = `${user.feedBack == null ? ' ' : user.feedBack} , <b>${data['result']['firstName']}</b> : ${text}`;
              user.status = 'Selected';
              this.ApiService.Update(user, Api.Applicant).subscribe(async (res) => {
                if (res) {
                  this.AlertService.ToastAlert('Candidate Selected').then(() => {
                    this.getInterviews();
                  });
                }
              });
            });
          });
        } else if (data.isDismissed) {
          user.feedBack = text;
          user.status = 'Rejected';
          this.ApiService.Update(user, Api.Applicant).subscribe((res) => {
            if (res) {
              this.AlertService.ToastAlert('Candidate Rejected').then(async () => {
                await this.ApiService.sendemail(this.CommonService.InterviewRejectedEmailTemplate(user)).subscribe(() => {
                  this.ApiService.Delete(id, Api.Applicant).subscribe(() => {
                    this.getInterviews();
                  });
                });
              });
            }
          });
        }
      });
    }
  }

  async OnboardMail(email) {
    var user = this.todayInterviews.find((data) => {
      return data.email == email;
    });
    const { value: date } = await this.AlertService.Onboard();
    if (date) {
      user.onBoardDate = date;
      this.ApiService.Update(user, Api.Applicant).subscribe((data) => {
        if (data) {
          this.ApiService.sendemail(this.CommonService.InterviewSelecetdEmailTemplate(user, date)).subscribe(() => {
            this.AlertService.ToastAlert('OnBord Mail Successfully Sent').then(() => {
              this.getInterviews();
            });
          });
        }
      });
    }
  }
  updateApplicant(Id: any) {
    this.router.navigate([`admin/interview/` + Id]);
  }

  TimePipe(timeString) {
    return this.CommonService.TimePipe(timeString);
  }

  deleteApplicant(Id: any) {
    this.AlertService.DeleteConfirm().then((result) => {
      if (result.isConfirmed) {
        this.ApiService.Delete(Id, Api.Applicant).subscribe((res) => {
          if (res == true) {
            this.AlertService.deleteSuccessAlert();
            this.getInterviews();
          } else if (res == false) {
            this.AlertService.errorAlert();
          }
        });
      }
    });
  }

  async UploadResume(id) {
    this.getApplicant(id);
    const { value: file } = await this.AlertService.SelectResumePopup();

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        (this.applicantDto.resumeUrl = e.target.result.toString()),
          this.AlertService.SelectedResumeConfirm(this.applicantDto.resumeUrl).then((data) => {
            if (data.isConfirmed) {
              this.ApiService.Update(this.applicantDto, Api.Applicant).subscribe((response) => {
                if (response == true) {
                  this.AlertService.UpdateSuccess().then((res) => {
                    if (res) {
                      this.getInterviews();
                    } else {
                      this.AlertService.errorAlert();
                    }
                  });
                } else if (response == false) {
                  this.AlertService.errorAlert();
                }
              });
            }
          });
      };
      reader.readAsDataURL(file);
    }
  }
  async selectDate() {
    const { value: date } = await this.AlertService.date();

    if (date) {
      this.AlertService.SimpleAlert(`Interview Date : ${date}`).then((data) => {
        if (data.isConfirmed) {
          this.todayInterview(date);
          if (this.todayInterviews.length == 0) {
            this.AlertService.Invalid('Not Found?', 'That thing is still around?', 'question');
          }
        }
      });
    }
  }
}
