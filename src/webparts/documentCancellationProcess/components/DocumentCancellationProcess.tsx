import * as React from 'react';

import type { IDocumentCancellationProcessProps } from './IDocumentCancellationProcessProps';
import { escape } from '@microsoft/sp-lodash-subset';
import Provider from '../../../GlobalContext/provider';
import VerticalSideBar from '../../verticalSideBar/components/VerticalSideBar';
import HorizontalNavbar from '../../horizontalNavBar/components/HorizontalNavBar';
import CustomBreadcrumb from '../../../CustomJSComponents/CustomBreadcrumb/CustomBreadcrumb';
import { getSP } from '../loc/pnpjsConfig';
import { SPFI } from '@pnp/sp';
import UserContext from "../../../GlobalContext/context";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../CustomCss/mainCustom.scss";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../../verticalSideBar/components/VerticalSidebar.scss";
import "../components/documentCancellation.scss";

const DocumentCancellationProcessContext = ({ props }: any) => {
    const sp: SPFI = getSP();
    const elementRef = React.useRef<HTMLDivElement>(null);
    const siteUrl = props.siteUrl;
    const { useHide }: any = React.useContext(UserContext);
    const Breadcrumb = [
        {
            MainComponent: "Home",
            MainComponentURl: `${siteUrl}/SitePages/Dashboard.aspx`,
        },
        {
            ChildComponent: "New Request",
            ChildComponentURl: `${siteUrl}/SitePages/Dashboard.aspx`,
        },
        {
            ChildComponent: "Document Cancellation",
            ChildComponentURl: `${siteUrl}/SitePages/Dashboard.aspx`,
        },
    ];

   

    return (
        <div id="wrapper" ref={elementRef}>
            <div
                className="app-menu"
                id="myHeader">
                <VerticalSideBar _context={sp} />
            </div>
            <div className="content-page">
                <HorizontalNavbar _context={sp} siteUrl={siteUrl} />
                <div className="content" style={{ marginLeft: `${!useHide ? '240px' : '80px'}`, marginTop: '2.3rem' }}>
                    <div className="container-fluid  paddb">
                        <div className="row">
                            <div className="col-lg-4">
                                <CustomBreadcrumb Breadcrumb={Breadcrumb} />
                            </div>

                        </div>
                        <div className="row mt-0">

                            {/* <!-- Right Sidebar --> */}
                            <div className="col-12">
                                <div >
                                    <div>
                                        {/* <!-- Left sidebar --> */}
                                        <div className="inbox-leftbar">

                                            <div className="mail-list mt-1">
                                                <a href="dossier-list.html"
                                                    style={{ background: "#fff !important" }}
                                                    className="list-group-item border-0 text-dark mb-1 bg-soft-secondary rounded-pill">
                                                    <i className="fe-list font-18 align-middle me-2"></i>My Request
                                                </a>
                                                <a href="favourite-folder.html"
                                                    style={{ background: "#f7fbfc !important" }}
                                                    className="list-group-item mb-1 border-0 rounded-pill">
                                                    <i className="fe-star font-18 align-middle me-2"></i>My Favourite
                                                </a>
                                                <a href="my-folder.html"
                                                    style={{ background: "#f7fbfc !important" }}
                                                    className="list-group-item mb-1 border-0 rounded-pill">
                                                    <i className="fe-folder font-18 align-middle me-2"></i>My Folder
                                                </a>
                                                <a href="share-with-other.html"
                                                    style={{ background: "#f7fbfc !important" }}
                                                    className="list-group-item border-0 mb-1 rounded-pill">
                                                    <i className="material-symbols-outlined font-18 align-middle me-2">forward</i>Share with Other
                                                </a>
                                                <a href="share-with-me.html"
                                                    style={{ background: "#f7fbfc !important" }}
                                                    className="list-group-item border-0 mb-1 rounded-pill">
                                                    <i className="fe-share-2 font-18 align-middle me-2"></i>Share with me
                                                </a>
                                            </div>



                                            <div className="mt-2 border-top pt-2">
                                                <button className="accordion4">
                                                    <span className="updatedorg">Strategy Department</span>
                                                </button>
                                                <div style={{ maxHeight: "50000px" }} className="panel4">
                                                    <ul id="myUL" className="mt-0">
                                                        <li>
                                                            <ul style={{ listStyle: "none" }} className="nested active">
                                                                <li style={{ paddingTop: "0px" }}>
                                                                    <span style={{ cursor: "pointer" }} className="box ng-binding check-box">
                                                                        <img  src={require("../assets/folder-plus.png")} className="foldert" alt="folder" />
                                                                        <a href="testing.html">Change Request</a>
                                                                    </span>
                                                                </li>
                                                                <li style={{ paddingTop: "10px" }} className="ng-scope">
                                                                    <span style={{ cursor: "pointer" }} className="box ng-binding">
                                                                        <img  src={require("../assets/folder-plus.png")} className="foldert" alt="folder" />
                                                                        Cancelled Documents
                                                                    </span>
                                                                </li>
                                                                <li style={{ paddingTop: "10px" }} className="ng-scope">
                                                                    <span style={{ cursor: "pointer" }} className="box ng-binding">
                                                                        <img  src={require("../assets/folder-plus.png")} className="foldert" alt="folder" />
                                                                        Audit Planning
                                                                    </span>
                                                                    <ul style={{ listStyle: "none" }} className="nested">
                                                                        <li style={{ paddingTop: "10px" }} className="ng-scope">
                                                                            <a href="Hr-folder-structure.html">
                                                                                <span style={{ cursor: "pointer" }} className="box ng-binding">
                                                                                    <img  src={require("../assets/folder-plus.png")} className="foldert" alt="folder" />
                                                                                    Memos
                                                                                </span>
                                                                            </a>
                                                                        </li>
                                                                        <li style={{ paddingTop: "10px" }} className="ng-scope">
                                                                            <a href="Hr-folder-structure.html">
                                                                                <span style={{ cursor: "pointer" }} className="box ng-binding">
                                                                                    <img  src={require("../assets/folder-plus.png")} className="foldert" alt="folder" />
                                                                                    Audit Plan
                                                                                </span>
                                                                            </a>
                                                                        </li>
                                                                        <li style={{ paddingTop: "10px" }} className="ng-scope">
                                                                            <a href="Hr-folder-structure.html">
                                                                                <span style={{ cursor: "pointer" }} className="box ng-binding">
                                                                                    <img  src={require("../assets/folder-plus.png")} className="foldert" alt="folder" />
                                                                                    Audit Checklist
                                                                                </span>
                                                                            </a>
                                                                        </li>
                                                                    </ul>
                                                                </li>
                                                            </ul>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>


                                        </div>


                                        <div className="inbox-rightbar">
                                            <div className="card">
                                                <div className="card-body">
                                                    <h4 className="header-title text-dark mb-0">Requested By</h4>
                                                    <p className="sub-header">
                                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur, itaque.
                                                    </p>

                                                    <div className="row">
                                                        <div className="col-lg-4">


                                                            <div className="mb-3">
                                                                <label htmlFor="simpleinput" className="form-label">Name:</label>
                                                                <input type="text" id="simpleinput" className="form-control" />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4">


                                                            <div className="mb-3">
                                                                <label htmlFor="simpleinput" className="form-label">Designation:</label>
                                                                <input type="text" id="simpleinput" className="form-control" />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4">

                                                            <div className="mb-3">
                                                                <label htmlFor="example-email" className="form-label">Request Date:</label>
                                                                <input type="date" id="example-email" name="example-email" className="form-control" placeholder="" />
                                                            </div>
                                                        </div>


                                                        <div className="col-lg-4">

                                                            <div className="mb-3">
                                                                <label htmlFor="example-email" className="form-label">Document Code:</label>
                                                                <input type="text" id="example-email" name="example-email" className="form-control" placeholder="Search Document Code" />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4">

                                                            <div className="mb-3">
                                                                <label htmlFor="example-email" className="form-label">Issue No:</label>
                                                                <input disabled type="text" id="example-email" name="example-email" className="form-control" placeholder="" />
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-4">

                                                            <div className="mb-3">
                                                                <label htmlFor="example-email" className="form-label">Revision No:</label>
                                                                <input disabled type="text" id="example-email" name="example-email" className="form-control" placeholder="" />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4">

                                                            <div className="mb-3">
                                                                <label htmlFor="example-email" className="form-label">Reference No:</label>
                                                                <input disabled type="text" id="example-email" name="example-email" className="form-control" placeholder="" />
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-8">

                                                            <div className="mb-3">
                                                                <label htmlFor="example-email" className="form-label">Document Link:</label>

                                                            </div>
                                                        </div>






                                                    </div>

                                                </div>


                                            </div>






                                            <div className="card">
                                                <div className="card-body">
                                                    <h4 className="header-title mb-0">Description</h4>
                                                    <p className="sub-header">
                                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s
                                                    </p>

                                                    <div className="row">
                                                        <table className="mtable" id="tbl">
                                                            <thead>
                                                                <tr>
                                                                    <th style={{ minWidth: "30px", maxWidth: "30px" }}>S.No</th>
                                                                    <th>Description</th>
                                                                    <th>Reason for Cancellation</th>
                                                                </tr>

                                                            </thead>
                                                            <tbody >
                                                                <tr> <td style={{ minWidth: "30px", maxWidth: "30px" }}>1</td>
                                                                    <td><input type="text" id="simpleinput" className="form-control" />

                                                                    </td>
                                                                    <td><input type="text" id="simpleinput" className="form-control" /></td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <div style={{ textAlign: "right", paddingRight: "22px" }} className="mt-2 float-end text-right">
                                                            {/* <i style={{ cursor: "pointer" }} onClick={addField}  className="fe-plus-circle  font-20 text-warning"></i> */}
                                                            <i style={{ cursor: "pointer" }} className="fe-plus-circle  font-20 text-warning"></i>


                                                        </div>

                                                    </div>

                                                    <div className="row mt-3">
                                                        <div className="col-12 text-center">
                                                            <a href="my-approval.html">  <button type="button" className="btn btn-primary waves-effect waves-light m-1"><i className="fe-check-circle me-1"></i> Submit</button></a>
                                                            <a href="my-approval.html">       <button type="button" className="btn btn-light waves-effect waves-light m-1"><i className="fe-x me-1"></i> Cancel</button> </a>
                                                        </div>
                                                    </div>
                                                </div>


                                            </div>

                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
}

const DocumentCancellationProcess: React.FC<IDocumentCancellationProcessProps> = (props) => (
    <Provider>
        <DocumentCancellationProcessContext props={props} />
    </Provider>
);


export default DocumentCancellationProcess
