import { Dropdown, IDropdownOption } from "@fluentui/react/lib/Dropdown";
import { PrimaryButton } from "@fluentui/react/lib/Button";
import { DetailsList, IColumn } from "@fluentui/react/lib/DetailsList";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IAdToSpGroupSyncProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  ctx:WebPartContext;
}


export interface IAdToSpGroupSyncState {
  adGroups: IDropdownOption[]; // Azure AD Groups
  spGroups: IDropdownOption[]; // SharePoint Groups
  selectedADGroup: string; // Selected AD Group
  selectedSPGroup: string; // Selected SP Group
  selectedSPGroupName: string; // Selected SP Group Name
  selectedADGroupName: string; // Selected AD Group Name
  adGroupUsers: any[]; // Users in the AD group
  status: string; // Status message
}