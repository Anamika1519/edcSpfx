import { escape } from "@microsoft/sp-lodash-subset";

import React, { useState } from "react";
import { updateItemApproval } from "../../APISearvice/ApprovalService";
import { getSP } from "../../webparts/addDynamicBanner/loc/pnpjsConfig";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import "bootstrap/dist/css/bootstrap.min.css";

// import "../../../CustomCss/mainCustom.scss";

// // import "../components/MyApproval.scss";

// import "bootstrap/dist/js/bootstrap.bundle.min.js";

// import "../../../CustomJSComponents/CustomTable/CustomTable.scss";

// import "../../verticalSideBar/components/VerticalSidebar.scss";

// import "./WorkflowAuditHistory.scss"


export interface IWorkflowAuditHistoryProps
{
    ContentItemId:any;
    ContentType:string;
    ctx:WebPartContext;

}

export const WorkflowAuditHistory=(props: IWorkflowAuditHistoryProps) => {

   
    const [AuditHistoryRows, setAuditHistoryRows] = React.useState([]); 
    
    const siteUrl = props.ctx.pageContext.site.absoluteUrl;

    const sp=getSP(props.ctx);

    React.useEffect(() => {
 
      if(props.ContentItemId)
      {
       sp.web.lists.getByTitle("ARGMyRequest").items.select("*,Requester/Id,Requester/Title,Approver/Id,Approver/Title").expand("Approver,Requester").filter('ContentId eq '+props.ContentItemId+"and ProcessName eq '"+props.ContentType+"'").orderBy('Created')().then(datarows=>{
          setAuditHistoryRows(datarows);
       })
      }      


    })

    

    return(
         
      <div className="card cardCss mt-4">

      <div className="card-body">

        <div id="cardCollpase8" className="collapse show">

          <div className="table-responsive pt-0">

            <table

              className="mtable table-centered table-bordered thead-light mb-0"

              style={{ position: "relative" }}

            >
              <thead>
              <tr>
                <th>
                  Requester
                </th>
                <th>
                  Created
                </th>
                <th>
                  Level
                </th>
                <th>
                  Approver
                </th>                
                <th>
                  Status
                </th>
                <th>
                  Modified
                </th>
                <th>
                  Remarks
                </th>
                
              </tr>
              </thead>
              <tbody>
               {
              AuditHistoryRows.map(row=>
                 <tr>
                  <td> {row.Requester.Title}</td>
                  <td> {(new Date(row.Created)).toLocaleString()}</td>
                  <td> Level{row.LevelId}</td>
                  <td> {row.Approver.Title}</td>
                  <td>{row.Status}</td>
                  <td>{(new Date(row.Modified)).toLocaleString()}</td>
                  <td> {row.Remark}</td>
                 </tr>

              )

               }
              </tbody>

            </table>
          </div>
        </div>
      </div>
      </div>  

    )

}