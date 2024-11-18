//import styles from './AdToSpGroupSync.module.scss';
import type { IAdToSpGroupSyncProps, IAdToSpGroupSyncState } from './IAdToSpGroupSyncProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as React from "react";
import { SPFI, spfi ,SPFx as spSPFx } from "@pnp/sp";
import { GraphFI, graphfi,SPFx as graphSPFx } from "@pnp/graph";
import * as grpahpnp from "@pnp/graph";
import "@pnp/graph/groups";
import "@pnp/graph/members";
import "@pnp/sp/webs";
import "@pnp/sp/site-groups/web";
import { GroupType } from '@pnp/graph/groups';
import { Dropdown, IDropdownOption } from "@fluentui/react/lib/Dropdown";
import { PrimaryButton } from "@fluentui/react/lib/Button";
import { DetailsList, IColumn } from "@fluentui/react/lib/DetailsList";

export default class AdToSpGroupSync extends React.Component<IAdToSpGroupSyncProps,IAdToSpGroupSyncState> {
  _graph:GraphFI;
  _sp:SPFI;
  constructor(props: IAdToSpGroupSyncProps) {
    super(props);
    
    this._graph = graphfi().using(graphSPFx(this.props.ctx));
    this._sp = spfi().using(spSPFx(this.props.ctx));
    this.state = {
      adGroups: [],
      spGroups: [],
      selectedADGroup: "",
      selectedSPGroup: "",
      adGroupUsers: [],
      status: "",
    };
  }

  // Fetch Azure AD Groups and SharePoint Groups on Mount
  async componentDidMount() {
    try {      
      
      const adGroups = await this._graph.groups.filter("securityEnabled eq true")();      
      const spGroups = await this._sp.web.siteGroups();

      this.setState({
        adGroups: adGroups.map(group => ({ key: group.id, text: group.displayName })),
        spGroups: spGroups.map(group => ({ key: group.Id, text: group.Title })),
      });
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  }

  // Fetch users in the selected Azure AD group
  private fetchADGroupUsers = async () => {
    try {
      const { selectedADGroup } = this.state;

      if (!selectedADGroup) {
        this.setState({ status: "Please select an Azure AD group." });
        return;
      }

      const members = await this._graph.groups.getById(selectedADGroup).members();
      const users = members
        //.filter(member => member.userType === "#microsoft.graph.user")
        .map(member => ({
          displayName: member.displayName,
          email: member.mail || member.userPrincipalName,
        }));

      this.setState({ adGroupUsers: users, status: "" });
    } catch (error) {
      console.error("Error fetching AD group users:", error);
      //alert("Error fetching AD group users:", error);
    }
  };

  // Sync Azure AD group with SharePoint group
  private syncGroups = async () => {
    try {
      const { selectedSPGroup, adGroupUsers } = this.state;

      if (!selectedSPGroup) {
        this.setState({ status: "Please select a SharePoint group." });
        return;
      }

      const spGroup = await this._sp.web.siteGroups.getById(Number(selectedSPGroup))();
      const spGroupUsers = await this._sp.web.siteGroups.getById(spGroup.Id).users();
      const spUserEmails = spGroupUsers.map(user => user.Email);
      const adUserEmails = adGroupUsers.map(user => user.email);

      // Calculate users to add and remove
      const usersToAdd = adUserEmails.filter(email => !spUserEmails.includes(email));
      const usersToRemove = spUserEmails.filter(email => !adUserEmails.includes(email));

      // Add users to SharePoint group
      for (const email of usersToAdd) {
        //const ensureresult= await this._sp.web.ensureUser("i:0#.f|membership|"+email);
        //if(ensureresult.data)
        await this._sp.web.siteGroups.getById(spGroup.Id).users.add("i:0#.f|membership|"+email);
      }

      // Remove users from SharePoint group
      for (const email of usersToRemove) {
        const user = spGroupUsers.find(u => u.Email === email);
        if (user) {
          await this._sp.web.siteGroups.getById(spGroup.Id).users.removeById(user.Id);
        }
      }

      this.setState({ status: "Sync completed successfully!" });
    } catch (error) {
      console.error("Error syncing groups:", error);
      this.setState({ status: "Error during sync." });
    }
  };

  // Render Method
  public render(): React.ReactElement<IAdToSpGroupSyncProps> {
    const { adGroups, spGroups, adGroupUsers, status } = this.state;

    return (
      <div>
        <Dropdown
          placeholder="Select Azure AD Group"
          options={adGroups}
          onChange={(e, option) => this.setState({ selectedADGroup: option?.key as string })}
        />
        <Dropdown
          placeholder="Select SharePoint Group"
          options={spGroups}
          onChange={(e, option) => this.setState({ selectedSPGroup: option?.key as string })}
        />
        <PrimaryButton
          text="Load AD Group Users"
          onClick={this.fetchADGroupUsers}
          style={{ marginTop: "10px" }}
        />
        <DetailsList
          items={adGroupUsers}
          columns={[
            { key: "displayName", name: "Name", fieldName: "displayName", minWidth: 100 },
            { key: "email", name: "Email", fieldName: "email", minWidth: 150 },
          ]}
          // style={{ marginTop: "20px" }}
        />
        <PrimaryButton
          text="Sync"
          onClick={this.syncGroups}
          style={{ marginTop: "20px" }}
        />
        {status && <p style={{ color: "blue", marginTop: "20px" }}>{status}</p>}
      </div>
    );
  }
}
