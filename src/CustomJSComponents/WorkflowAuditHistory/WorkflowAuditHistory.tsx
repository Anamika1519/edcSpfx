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

        <div id="cardCollpase4" className="collapse show">
          <h3 className="font-16 fw-bold text-dark">Audit History</h3>

          <div className="table-responsive pt-0">

            <table

              className="mtable table-centered table-bordered thead-light mb-0"

              style={{ position: "relative" }}

            >
              <thead>
              <tr>
                 <th style={{minWidth:'60px', maxWidth:'60px'}}>
                  S.No.
                </th>
                <th>
                  Level
                </th>
                <th>
                  Assigned To
                </th>  
                <th>
                  Requester Name
                </th>
                <th>
                  Requested Date
                </th>               
                <th>
                  Action Taken By
                </th>            
                <th>
                  Action Taken On
                </th>   
                             
                <th>
                  Remarks
                </th>
                <th>
                  Status
                </th> 
                
              </tr>
              </thead>
              <tbody>
               {
              AuditHistoryRows.map((row:any,index:number)=>
                 <tr>
                  <td style={{minWidth:'60px', maxWidth:'60px'}}> {index+1}</td>
                  <td> {(row.LevelId=0)?"Initiator":`Level ${row.LevelId}`}</td>
                  <td> {row.Approver.Title}</td>
                  <td> {row.Requester.Title}</td>
                  <td> {(new Date(row.Created)).toLocaleString()}</td>                 
                  <td> {(row.Status!='Pending')?(row.Approver.Title):""}</td>
                  <td>{(row.Status!='Pending')?((new Date(row.Modified)).toLocaleString()):""}</td>
                  <td> {row.Remark}</td>
                  <td>{row.Status}</td>                  

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