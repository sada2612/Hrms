import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Api, Employee } from 'src/app/Dto/DataTypes';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api-service.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-emplist',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './emplist.component.html',
  styleUrls: ['./emplist.component.scss']
})
export default class EmplistComponent {
  active: any;
  employees: Employee[];
  status: boolean;

  constructor(private ApiService: ApiService) {
    this.getEmployees();
  }

  getEmployees() {
    this.ApiService.GetAll(Api.Employee).subscribe((data) => {
      this.employees = data['result'];
    });
  }
}
