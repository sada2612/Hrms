import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Client, Api } from 'src/app/Dto/DataTypes';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api-service.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-clientlist',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './clientlist.component.html'
})
export default class ClientlistComponent {
  active: any;
  clients: Client[];
  clientDto: Client = new Client();
  status: boolean;

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
  addClient() {
    this.router.navigate(['admin/client/create']);
  }

  deleteClient(Id: any) {
    this.AlertService.DeleteConfirm().then((result) => {
      if (result.isConfirmed) {
        this.ApiService.Delete(Id, Api.Client).subscribe((res) => {
          if (res == true) {
            this.AlertService.deleteSuccessAlert();
            this.getClients();
          } else if (res == false) {
            this.AlertService.errorAlert();
          }
        });
      }
    });
  }

  updateClient(Id: any) {
    this.router.navigate([`admin/client/${Id}`]);
  }
}
