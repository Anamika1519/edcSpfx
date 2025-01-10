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


export interface IWorkflowAuditHistoryProps {

  ContentItemId: any;

  ContentType: string;

  ctx: WebPartContext;


}


export const WorkflowAuditHistory = (props: IWorkflowAuditHistoryProps) => {


  const [AuditHistoryRows, setAuditHistoryRows] = React.useState([]);

  const [Loading, setLoading] = React.useState(false);

  const [IsHistoryData, setIsHistoryData] = React.useState(false);

  const siteUrl = props.ctx.pageContext.site.absoluteUrl;


  const sp = getSP(props.ctx);


  React.useEffect(() => {


    if (props.ContentItemId && AuditHistoryRows.length == 0 && !IsHistoryData) {

      getAllAPI()

    }

  })

  const getAllAPI = async () => {
    let listname = "";
    if (props.ContentItemId) {
      switch (props.ContentType) {
        case "Capex Requisition":
          listname = "announcementId";
          break;
        case "NON-ITProjectCharterRequestList":
          listname = "announcementId";
          break;
        case "InterOfficeCommunicationRequestList":
          listname = "EventId";
          break;
        case "ITProjectCharterRequestList":
          listname = "mediaId";
          break;
        case "IT Demand Request":
          listname = "blogId";
          break;
        default:
      }
      setLoading(true);

      sp.web.lists.getByTitle("ARGMyRequest").items
        .select("*,Requester/Id,Requester/Title,Approver/Id,Approver/Title")
        .expand("Approver,Requester")
        .filter('ContentId eq ' + props.ContentItemId + "and ProcessName eq '" + props.ContentType + "'")
        .orderBy('Created')().then(datarows => {

          if (datarows.length == 0) {

            setIsHistoryData(true);

            setLoading(false);

          }

          if (datarows.length > 0) {

            setLoading(false);

            setIsHistoryData(true);

          }

          setAuditHistoryRows(datarows);


        })

    }

  }


  return (


    <div className="card cardCss mb-0 mt-3">


      <div className="card-body">


        <div id="cardCollpase4" className="collapse show">

          <h3 className="font-16 mb-1 fw-bold text-dark">Audit History</h3>
          <p className="font-14 mb-3 text-muted">Below table describes the status of approval at various level </p>

          {console.log("AuditHistoryRows", AuditHistoryRows)}

          <div className="table-responsive pt-0">


            <table


              className="mtbalenew  table-centered  thead-light mb-0"


              style={{ position: "relative" }}


            >

              <thead>

                <tr>

                  <th style={{ minWidth: '60px', maxWidth: '60px' }}>

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

              {Loading && AuditHistoryRows.length == 0 ? (//chhaya

                // Show loader when loading is true

                (!IsHistoryData ?

                  <div className="spinner-border text-primary" role="status">

                    <span className="sr-only">Loading...</span>

                  </div> :

                  <div >

                    <span className="sr-only">No Record has been found</span>

                  </div>)

              ) : (

                <tbody>


                  {


                    AuditHistoryRows.map((row: any, index: number) =>

                      <tr>

                        <td style={{ minWidth: '60px', maxWidth: '60px' }}> {index + 1}</td>

                        <td> {(row.LevelId == 0) ? "Initiator" : `Level ${row.LevelId}`}</td>

                        <td> {row.Approver.Title}</td>

                        <td> {row.Requester.Title}</td>

                        <td> {(new Date(row.Created)).toLocaleString()}</td>

                        <td> {(row.Status != 'Pending') ? (row.Approver.Title) : ""}</td>

                        <td>{(row.Status != 'Pending') ? ((new Date(row.Modified)).toLocaleString()) : ""}</td>

                        <td> {row.Remark}</td>

                        <td> <div className="btn  btn-status">{row.Status}</div> </td>


                      </tr>


                    )


                  }

                </tbody>

              )

              }

            </table>

          </div>

        </div>

      </div>

    </div>


  )


}
