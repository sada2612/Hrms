import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LeaveBalance, Api } from 'src/app/Dto/DataTypes';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api-service.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-update-leavebalance',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './update-leavebalance.component.html',
  styleUrls: ['./update-leavebalance.component.scss']
})
export default class UpdateLeavebalanceComponent {
  employees: any;
  leaveBalanceDto: LeaveBalance;
  constructor(
    private ApiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private AlertService: AlertService
  ) {}

  ngOnInit() {
    this.getLeavebalance(this.route.snapshot.paramMap.get('id'));
  }

  getLeavebalance(Id: any) {
    this.ApiService.Get(Id, Api.LeaveBalance).subscribe((data) => {
      this.leaveBalanceDto = data['result'];
    });
  }
  updateLeaveBalance() {
    this.AlertService.updateAlert('leaveBalance').then((result) => {
      if (result.isConfirmed) {
        this.ApiService.Update(this.leaveBalanceDto, Api.LeaveBalance).subscribe((response) => {
          if (response == true) {
            this.AlertService.UpdateSuccess().then((res) => {
              if (res) {
                this.router.navigate(['admin/leave']);
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
}
