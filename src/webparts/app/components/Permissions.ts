import { sp } from '@pnp/sp/presets/all'
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web"
import { IUserGroups } from '../Models/IUserGroup';

// interface ISPListUserItem {
//   LoginName: string;
// }
// export class ClassUser {
//   public LoginName: string;
//   constructor(item: ISPListUserItem) {
//     this.LoginName = item.LoginName;
//   }
// }
export class User {
  public name: string;
  public group: string;
  constructor(name: string, group: string) {
    this.name = name;
    this.group = group;
  }
}
export enum Roles {
  User = "TBSK esg-int – návštevníci",
  Creator = "TBSK esg-int – členovia",
  Admin = "TBSK esg-int – vlastníci",
}
export enum Views {
  New = "new",
  Edit = "edit",
  Display = "display",
  Admin = "admin"
}

export default async function CheckPermissions(view: string) {

  // let isInGroup = false;
  const groups: IUserGroups[] = await sp.web.currentUser.groups();
  console.log("groups", groups);

  for (let index = 0; index < groups.length; index++) {
    const element = groups[index];
    if (view === Views.New && element.Title === Roles.User) {
      return true
    }
    if ((view === Views.Edit || Views.Display || Views.New) && element.Title === Roles.Creator) {
      return true
    }
    if ((view === Views.Edit || Views.Display || Views.New || Views.Admin) && element.Title === Roles.Admin) {
      return true
    }
    
  }
  return false;

}
