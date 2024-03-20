import { Injectable } from '@angular/core';
import { Api } from 'src/app/Dto/DataTypes';
import { ApiService } from 'src/app/services/api-service.service';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  icon?: string;
  url?: string;
  classes?: string;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: Navigation[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}
const AdminNavigationItems = [
  {
    id: 'dashboard',
    title: 'Home',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'default',
        title: 'Home',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/dashboard',
        icon: 'ti ti-dashboard',
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'elements',
    title: 'Dashboard',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'Employees',
        title: 'Employees',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/employees',
        icon: 'ti ti-typography'
      },
      {
        id: 'Clients',
        title: 'Clients',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/clients',
        icon: 'ti ti-loader'
      },
      {
        id: 'Projects',
        title: 'Projects',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/projects',
        icon: 'ti ti-credit-card'
      },
      {
        id: 'Attendance',
        title: 'Attendance',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/attendancelist',
        icon: 'ti ti-hierarchy-2'
      },
      {
        id: 'Leave',
        title: 'Leave ',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/leave',
        icon: 'ti ti-brush'
      },
      {
        id: 'Holidays',
        title: 'Holidays',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/holidays',
        icon: 'ti ti-leaf'
      },
      {
        id: 'Job',
        title: 'Jobs',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/jobs',
        icon: 'ti ti-world'
      },
      {
        id: 'Interviews',
        title: 'Interviews',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/interviews',
        icon: 'ti ti-users'
      }
    ]
  },
  {
    id: 'Entertainments',
    title: 'Entertainments',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'Birthdays',
        title: 'Birthdays',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/birthday',
        icon: 'ti ti-gift',
        breadcrumbs: false
      },
      {
        id: 'Events',
        title: 'Events',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/event',
        icon: 'ti ti-speakerphone',
        breadcrumbs: false
      },
      {
        id: 'Office fest',
        title: 'Office Fest',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/fest',
        icon: 'ti ti-camera',
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'other',
    title: 'Other',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'Calendar',
        title: 'Calendar',
        type: 'item',
        url: '/admin/calendar',
        classes: 'nav-item',
        icon: 'ti ti-calendar',
        breadcrumbs: false
      }
    ]
  }
];

const GuestNavigationItems = [
  {
    id: 'dashboard',
    title: 'Home',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'default',
        title: 'Home',
        type: 'item',
        classes: 'nav-item',
        url: '/guest/dashboard',
        icon: 'ti ti-dashboard',
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'elements',
    title: 'Dashboard',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'Employees',
        title: 'Profiles',
        type: 'item',
        classes: 'nav-item',
        url: '/guest/employee/list',
        icon: 'ti ti-typography'
      },
      {
        id: 'Leave',
        title: 'Leave',
        type: 'item',
        classes: 'nav-item',
        url: '/guest/leave',
        icon: 'ti ti-brush'
      },
      {
        id: 'Attendance',
        title: 'Attendance',
        type: 'item',
        classes: 'nav-item',
        url: '/guest/attendancelist',
        icon: 'ti ti-hierarchy-2'
      },
      {
        id: 'Holidays',
        title: 'Holidays',
        type: 'item',
        classes: 'nav-item',
        url: '/guest/holidays',
        icon: 'ti ti-leaf'
      },
      {
        id: 'Job',
        title: 'Jobs',
        type: 'item',
        classes: 'nav-item',
        url: '/guest/jobs',
        icon: 'ti ti-world'
      },
      {
        id: 'Interviews',
        title: 'Interviews',
        type: 'item',
        classes: 'nav-item',
        url: '/guest/interviews',
        icon: 'ti ti-users'
      }
    ]
  },
  {
    id: 'Entertainments',
    title: 'Entertainments',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'Birthdays',
        title: 'Birthdays',
        type: 'item',
        classes: 'nav-item',
        url: '/guest/birthday',
        icon: 'ti ti-gift',
        breadcrumbs: false
      },
      {
        id: 'Events',
        title: 'Events',
        type: 'item',
        classes: 'nav-item',
        url: '/guest/event',
        icon: 'ti ti-speakerphone',
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'other',
    title: 'Other',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'Calendar',
        title: 'Calendar',
        type: 'item',
        url: '/guest/calendar',
        classes: 'nav-item',
        icon: 'ti ti-calendar',
        breadcrumbs: false
      }
    ]
  }
];

@Injectable()
export class NavigationItem {
  get(role) {
    if (role == 'Hr' || role == 'Admin') {
      return AdminNavigationItems;
    } else {
      return GuestNavigationItems;
    }
  }
}
