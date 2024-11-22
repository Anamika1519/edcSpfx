import { escape } from "@microsoft/sp-lodash-subset";

import React, { useState } from "react";
import { updateItemApproval } from "../../APISearvice/ApprovalService";
import { getSP } from "../../webparts/addDynamicBanner/loc/pnpjsConfig";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import Swal from "sweetalert2";

export interface IWorkflowActionProps
{
    currentItem:any;
    ctx:WebPartContext;

}

export const WorkflowAction=(props: IWorkflowActionProps) => {

    
    const siteUrl = props.ctx.pageContext.site.absoluteUrl;

    const sp=getSP(props.ctx);

    const [formData, setFormData] = React.useState({
        Remark: '',    
      })

    const onChange = (name: string, value: string) => {

        debugger
    
        setFormData((prevData) => ({
    
          ...prevData,
    
          [name]: value,
    
        }));
    
      };
    
      const handleFromSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, Status: string) => {

        e.preventDefault();
    
      
        const postPayload = {
    
          Remark: formData.Remark,
    
          Status: Status
    
        };
    
        console.log(postPayload);
       let confirmation="";
       if(Status=='Approved') confirmation="Do you want to approve this request?";
       else if(Status=='Rejected') confirmation="Do you want to reject this request?";
       else if(Status=='Rework') confirmation="Do you want to rework this request?";

       Swal.fire({
        // title: 'Do you want to save?',
        title: confirmation ,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No"
        
      }).then(async (result) => {
        console.log(result)
        if (result.isConfirmed) {

          const postResult = await updateItemApproval(postPayload, sp, props.currentItem.Id);
    
          if (postResult) {
              Swal.fire('Request '+Status.toLowerCase()+' successfully.', '', 'success');
              setTimeout(() => {
        
                // window.location.reload()
    
                location.href=`${siteUrl}/SitePages/MyApprovals.aspx`;
        
              }, 1000);
        
        
            }

        }}) 
       
    
      }

    return(
         
        <div className="card">

                    <div className="card-body">

                      <div className="row">
                        {

                        (props.currentItem.Status == "Pending" || props.currentItem.IsRework) && (<div className="col-lg-12">

                            <div className="mb-0" >

                              <label htmlFor="example-textarea" className="form-label text-dark font-14">Remarks:</label>

                              <textarea className="form-control" id="example-textarea" rows={5} name="Remark" value={formData.Remark}

                                onChange={(e) => onChange(e.target.name, e.target.value)}></textarea>

                            </div>

                          </div>)

                        }


                      </div>

                      {


                        (props.currentItem.Status == "Pending" || props.currentItem.IsRework)  && (

                          <div className="row mt-3">

                            <div className="col-12 text-center">

                              <a href="my-approval.html">

                                <button type="button" className="btn btn-success waves-effect waves-light m-1" onClick={(e) => handleFromSubmit(e, 'Approved')}>

                                  <i className="fe-check-circle me-1"></i> Approve

                                </button>

                              </a>

                              <a href="my-approval.html">

                                <button type="button" className="btn btn-warning waves-effect waves-light m-1" onClick={(e) => handleFromSubmit(e, 'Rework')}>

                                  <i className="fe-corner-up-left me-1"></i> Rework

                                </button>

                              </a>

                              <a href="my-approval.html">

                                <button type="button" className="btn btn-danger waves-effect waves-light m-1" onClick={(e) => handleFromSubmit(e, 'Rejected')}>

                                  <i className="fe-x-circle me-1"></i> Reject

                                </button>

                              </a>

                              <button type="button" className="btn btn-light waves-effect waves-light m-1">

                                <i className="fe-x me-1"></i> Cancel

                              </button>

                            </div>

                          </div>

                        )

                      }


                    </div>

                  </div>
    )

}