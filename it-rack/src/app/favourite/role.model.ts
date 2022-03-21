import { UserRole } from '@shared/constants';

export class RoleModel {
  public model: RoleConfigItem[];

  private allRoles = [UserRole.user, UserRole.keyUser, UserRole.countryAdmin, UserRole.regionalAdmin, UserRole.globalAdmin];

  constructor() {
    this.model = [
      {
        id: 'statusConfig',
        title: 'Status configurator',
        url: '/admin/status-config',
        role: [UserRole.regionalAdmin, UserRole.globalAdmin],
      },
      {
        id: 'userMgmt',
        title: 'User Management',
        url: '/admin/user-mgmt',
        role: [UserRole.countryAdmin, UserRole.regionalAdmin, UserRole.globalAdmin],
      },
      {
        id: 'routeMgmt',
        title: 'Route Management',
        url: '/admin/route-mgmt',
        role: [UserRole.countryAdmin, UserRole.regionalAdmin, UserRole.globalAdmin],
      },
      {
        id: 'apiErrors',
        title: 'API Errors',
        url: '/admin/api-errors',
        role: [UserRole.countryAdmin, UserRole.regionalAdmin, UserRole.globalAdmin],
      },
      {
        id: 'data-export',
        title: 'Data Export',
        url: '/data-export',
        role: [UserRole.keyUser, UserRole.countryAdmin, UserRole.regionalAdmin, UserRole.globalAdmin],
      },
    ];
  }
}

export interface RoleConfigItem {
  id: string;
  title: string;
  url: string;
  role: UserRole[];
}
