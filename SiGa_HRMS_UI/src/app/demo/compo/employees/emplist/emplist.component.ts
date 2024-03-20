import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Employee, Api } from 'src/app/Dto/DataTypes';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api-service.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-emplist',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './emplist.component.html',
  styleUrls: ['./emplist.component.scss']
})
export default class EmplistComponent {
  active: any;
  employees: Employee[];
  status: boolean;

  constructor(
    private router: Router,
    private AlertService: AlertService,
    private ApiService: ApiService
  ) {
    this.getEmployees();
  }

  updateForm(Id: number) {
    this.router.navigate([`admin/employee/${Id}`]);
  }
  getEmployees() {
    this.ApiService.GetAll(Api.Employee).subscribe((data) => {
      this.employees = data['result'];
    });
  }
  addEmployee() {
    this.router.navigate(['admin/employee/create']);
  }

  deleteEmployee(Id: number) {
    this.AlertService.DeleteConfirm().then((result) => {
      if (result.isConfirmed) {
        this.ApiService.Delete(Id, Api.Employee).subscribe((res) => {
          if (res == true) {
            this.AlertService.deleteSuccessAlert();
            this.getEmployees();
          } else if (res == false) {
            this.AlertService.errorAlert();
          }
        });
      }
    });
  }

  DetailsEmployee(Id: number) {
    this.router.navigate([`admin/employee/profile/${Id}`]);
  }
}
