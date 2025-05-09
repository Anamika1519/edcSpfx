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
        case "Document Cancellation":
          listname = "DocumentCancelId";
          break;
        case "Change Request":
          listname = "ChangeRequestId";
          break;
        default:
      }
      setLoading(true);
      if (props.ContentType != "Document Cancellation" && props.ContentType != "Change Request") {
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


          });


      }
      else {
        // "ID eq " + props.ContentItemId.Id +

        sp.web.lists.getByTitle("ProcessApprovalList").items
          .select("*,RequesterName/Id,RequesterName/Title,AssignedTo/Id,AssignedTo/Title,ActionTakenBy/Id,ActionTakenBy/Title")
          .expand("AssignedTo,RequesterName,ActionTakenBy")
          .filter(

            "ListItemId eq " + props.ContentItemId.ListItemId +
            " and ProcessName eq '" + props.ContentType + "'"
          )
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
            // setAuditHistoryRows((prevRows) => [...prevRows, ...datarows]);



          })


      }




    }

  }


  return (


    <div className="card cardCss mb-0 mt-3">


      <div className="card-body">


        <div id="cardCollpase4" className="collapse show">

          <h3 className="font-16 mb-1 fw-bold text-dark">Audit History</h3>
          <p className="font-14 mb-3 text-muted">Below table describes the status of approval at various level </p>

          {console.log("AuditHistoryRows", AuditHistoryRows)}

          <div style={{display:'grid'}} className="table-responsive pt-0">


            <table


              className="mtbalenew  table-centered  thead-light mb-0"


              style={{ position: "relative" }}


            >

              <thead>

                <tr>

                  <th style={{ minWidth: '40px', maxWidth: '40px' }}>

                    S.No.

                  </th>

                  <th style={{ minWidth: '65px', maxWidth: '65px' }}>

                    Level

                  </th>

                  <th style={{ minWidth: '65px', maxWidth: '65px' }}>

                    Assigned To

                  </th>

                  <th style={{ minWidth: '65px', maxWidth: '65px' }}>

                    Requester Name

                  </th>

                  <th style={{ minWidth: '65px', maxWidth: '65px' }}>

                    Requested Date

                  </th>

                  <th style={{ minWidth: '65px', maxWidth: '65px' }}>

                    Action Taken By

                  </th>

                  <th style={{ minWidth: '65px', maxWidth: '65px' }}>

                    Action Taken On

                  </th>


                  <th style={{ minWidth: '70px', maxWidth: '70px' }}>

                    Remarks

                  </th>

                  <th style={{ minWidth: '65px', maxWidth: '65px' }}>
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

                        <td style={{ minWidth: '40px', maxWidth: '40px' }}> {index + 1}</td>

                      
                          <td style={{ minWidth: '65px', maxWidth: '65px' }}>
                            {
                              row.LevelId !== undefined && row.LevelId !== null
                                ? row.LevelId === 0
                                  ? "Initiator"
                                  : `Level ${row.LevelId}`
                                : row.Level !== undefined && row.Level !== null
                                  ? row.Level === 0
                                    ? row.CurrentUserRole === "OES"
                                      ? "OES"
                                      : row.CurrentUserRole == null || row.CurrentUserRole == "Initiator"
                                        ? "Initiator"
                                        : `Level ${row.Level}`
                                    : `Level ${row.Level}`
                                  : ""
                            }

                          </td>

                      

                        <td style={{ minWidth: '65px', maxWidth: '65px' }}> {row.Approver ? row.Approver.Title : row.AssignedTo.Title}</td>

                        <td style={{ minWidth: '65px', maxWidth: '65px' }}> {row.Requester ? row.Requester.Title : row.RequesterName.Title}</td>

                         {/* <td  style={{ minWidth: '70px', maxWidth: '70px' }}> {(new Date(row.Created)).toLocaleString()}</td> */}
                        <td style={{ minWidth: '65px', maxWidth: '65px' }}>
                          {new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(row.Created))}
                        </td>

                        {/* <td> {(row.Status != 'Pending') ? (row.Approver?.Title ? row.Approver.Title:(row.ActionTakenBy.Title?row.ActionTakenBy.Title:"")) : ""}</td> */}
                        <td style={{ minWidth: '65px', maxWidth: '65px' }}>
                          {row.Status !== "Pending"
                            ? row.Approver?.Title || row.ActionTakenBy?.Title || ""
                            : ""}
                        </td>

                        {/* <td style={{ minWidth: '70px', maxWidth: '70px' }}>{(row.Status != 'Pending') ? ((new Date(row.Modified)).toLocaleString()) : ""}</td> */}
                        <td style={{ minWidth: '65px', maxWidth: '65px' }}>
                          {(row.Status != 'Pending') ?(new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(row.Modified))):""}
                        </td>


                        <td style={{ minWidth: '65px', maxWidth: '65px' }}> {row.Remark}</td>

                        <td style={{ minWidth: '65px', maxWidth: '65px' }}> <div className="btn  btn-status">{row.Status}</div> </td>


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
