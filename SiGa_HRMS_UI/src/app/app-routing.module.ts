import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './theme/layouts/admin/admin.component';
import { GuestComponent } from './theme/layouts/guest/guest.component';
import LoginComponent from './demo/authentication/login/login.component';
import { GuestAuthGuardService } from './services/guest-auth-guard.service';
import { AdminAuthGuardService } from './services/admin-auth-guard.service';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminAuthGuardService],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./demo/default/dashboard/dashboard.component')
      },

      // ----------------employees route---------------------------------------
      {
        path: 'employees',
        loadComponent: () => import('./demo/compo/employees/emplist/emplist.component')
      },
      {
        path: 'employee/create',
        loadComponent: () => import('./demo/compo/employees/create-employee/create-employee.component')
      },
      {
        path: 'employee/:id',
        loadComponent: () => import('./demo/compo/employees/update-employee/update-employee.component')
      },
      {
        path: 'employee/profile/:id',
        loadComponent: () => import('./demo/compo/employees/profile/profile.component')
      },

      // ----------------projects route---------------------------------------
      {
        path: 'projects',
        loadComponent: () => import('./demo/compo/project/projectlist/projectlist.component')
      },
      {
        path: 'project/create',
        loadComponent: () => import('./demo/compo/project/create-project/create-project.component')
      },
      {
        path: 'project/:id',
        loadComponent: () => import('./demo/compo/project/update-project/update-project.component')
      },

      // ----------------attendancelist route---------------------------------------
      {
        path: 'attendancelist',
        loadComponent: () => import('./demo/compo/attendance/attedanclist/attedanclist.component')
      },
      {
        path: 'attendanceprofile/:id',
        loadComponent: () => import('./demo/compo/attendance/attedance-profile/attedance-profile.component')
      },

      // ----------------Client route---------------------------------------
      {
        path: 'clients',
        loadComponent: () => import('./demo/compo/client/clientlist/clientlist.component')
      },
      {
        path: 'client/create',
        loadComponent: () => import('./demo/compo/client/create-cilent/create-cilent.component')
      },
      {
        path: 'client/:id',
        loadComponent: () => import('./demo/compo/client/update-cilent/update-cilent.component')
      },

      // ----------------leave route---------------------------------------
      {
        path: 'leave',
        loadComponent: () => import('./demo/compo/leave/leavelist/leavelist.component')
      },
      {
        path: 'leave/leaveadd/:id',
        loadComponent: () => import('./demo/guest/add-leave/add-leave.component')
      },
      {
        path: 'leave/update/:id',
        loadComponent: () => import('./demo/guest/update-leave/update-leave.component')
      },
      {
        path: 'leavebalance/add',
        loadComponent: () => import('./demo/compo/leave/add-leavebalance/add-leavebalance.component')
      },
      {
        path: 'leavebalance/:id',
        loadComponent: () => import('./demo/compo/leave/update-leavebalance/update-leavebalance.component')
      },

      // ----------------leave route---------------------------------------
      {
        path: 'holidays',
        loadComponent: () => import('./demo/compo/holiday/holidayslist/holidayslist.component')
      },
      {
        path: 'holiday/add',
        loadComponent: () => import('./demo/compo/holiday/create-holiday/create-holiday.component')
      },
      {
        path: 'holiday/:id',
        loadComponent: () => import('./demo/compo/holiday/update-holiday/update-holiday.component')
      },

      // ----------------leave route---------------------------------------
      {
        path: 'jobs',
        loadComponent: () => import('./demo/compo/job/jobslist/jobslist.component')
      },
      {
        path: 'job/add',
        loadComponent: () => import('./demo/compo/job/create-job/create-job.component')
      },
      {
        path: 'job/:id',
        loadComponent: () => import('./demo/compo/job/update-job/update-job.component')
      },

      // ----------------leave route---------------------------------------
      {
        path: 'interviews',
        loadComponent: () => import('./demo/compo/interview/interviewlist/interviewlist.component')
      },
      {
        path: 'interview/add',

        loadComponent: () => import('./demo/compo/interview/create-interview/create-interview.component')
      },
      {
        path: 'interview/:id',
        loadComponent: () => import('./demo/compo/interview/update-interview/update-interview.component')
      },

      //  ----------------birthday route---------------------------------------
      {
        path: 'birthday',
        loadComponent: () => import('./demo/compo/birthday/birthday-list/birthday-list.component')
      },

      // ----------------leave route---------------------------------------
      {
        path: 'event',
        loadComponent: () => import('./demo/compo/event/eventslist/eventslist.component')
      },
      {
        path: 'event/add',
        loadComponent: () => import('./demo/compo/event/create-event/create-event.component')
      },
      // ----------------------------Office fest-----------------------
      {
        path: 'fest',
        loadComponent: () => import('./demo/compo/office-fest/office-fest.component')
      },
      // ----------------calendar  route---------------------------------------
      {
        path: 'calendar',
        loadComponent: () => import('./demo/compo/calendar/calendar.component')
      }
    ]
  },
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'guest',
    component: GuestComponent,
    canActivate: [GuestAuthGuardService],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./demo/default/dashboard/dashboard.component')
      },
      // ----------------employees route---------------------------------------

      {
        path: 'employee/list',
        loadComponent: () => import('./demo/guest/employee/emplist/emplist.component')
      },
      {
        path: 'employee/profile',
        loadComponent: () => import('./demo/guest/employee/profile/profile.component')
      },

      {
        path: 'attendancelist',
        loadComponent: () => import('./demo/guest/create-attendance/create-attendance.component')
      },

      // ----------------interviews route---------------------------------------
      {
        path: 'interviews',
        loadComponent: () => import('./demo/guest/interview/interview.component')
      },

      // ----------------leave route---------------------------------------
      {
        path: 'leave',
        loadComponent: () => import('./demo/guest/leavelist/leavelist.component')
      },
      {
        path: 'leave/leaveadd/:id',
        loadComponent: () => import('./demo/guest/add-leave/add-leave.component')
      },
      {
        path: 'leave/update/:id',
        loadComponent: () => import('./demo/guest/update-leave/update-leave.component')
      },

      // ----------------leave route---------------------------------------
      {
        path: 'holidays',
        loadComponent: () => import('./demo/guest/holidayslist/holidayslist.component')
      },

      // ----------------leave route---------------------------------------
      {
        path: 'jobs',
        loadComponent: () => import('./demo/guest/jobslist/jobslist.component')
      },

      //  ----------------leave route---------------------------------------
      {
        path: 'birthday',
        loadComponent: () => import('./demo/compo/birthday/birthday-list/birthday-list.component')
      },

      // ----------------leave route---------------------------------------
      {
        path: 'event',
        loadComponent: () => import('./demo/compo/event/eventslist/eventslist.component')
      },
      // ----------------calendar  route---------------------------------------
      {
        path: 'calendar',
        loadComponent: () => import('./demo/compo/calendar/calendar.component')
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
