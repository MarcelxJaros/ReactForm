export interface IUserGroups {
  "odata.type": string;
  "odata.id": string;
  "odata.editLink": string;
  Id: number;
  IsHiddenInUI: boolean;
  LoginName: string;
  Title: string;
  PrincipalType: number;
  AllowMembersEditMembership: boolean;
  AllowRequestToJoinLeave: boolean;
  AutoAcceptRequestToJoinLeave: boolean;
  Description?: any;
  OnlyAllowMembersViewMembership: boolean;
  OwnerTitle: string;
  RequestToJoinLeaveEmailSetting: string;
}