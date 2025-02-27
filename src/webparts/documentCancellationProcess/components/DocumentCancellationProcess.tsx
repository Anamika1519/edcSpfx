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
import { allowstringonly, getCurrentUser } from '../../../APISearvice/CustomService';
import { addAllProcessItem, addApprovalItem, addItem, addItem2, getAllDocumentCode, getAllProcessData, getApprovalByID, getApprovalByID2, getDataRoles, getDocumentLinkByID, getFormNameID, getItemByID, getItemByID2, getListNameID, getRequesterID, getRequestTypeID, UpdateAllProcessItem, updateApprovalItem, updateItem, updateItem2 } from '../../../APISearvice/DocumentCancellation';
import Select from "react-select";
import Swal from 'sweetalert2';
import { FormSubmissionMode } from '../../../Shared/Interfaces';
import { decryptId } from '../../../APISearvice/CryptoService';
import { getUrlParameterValue } from '../../../Shared/Helper';
import { WorkflowAction } from '../../../CustomJSComponents/WorkflowAction/WorkflowAction';
import { WorkflowAuditHistory } from '../../../CustomJSComponents/WorkflowAuditHistory/WorkflowAuditHistory';
import { CONTENTTYPE_DocumentCancel, LIST_TITLE_DocCancel, Tenant_URL } from '../../../Shared/Constants';
import { IPeoplePickerContext, PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';
import { Modal } from 'react-bootstrap';

interface ForwardTo {
    id: number;
    role: number;
    level: number;
    approvers: any[]; // Or a more specific type like `string[]` or `SPUser[]`
}

const DocumentCancellationProcessContext = ({ props }: any) => {
    const sp: SPFI = getSP();
    const elementRef = React.useRef<HTMLDivElement>(null);
    const siteUrl = props.siteUrl;
    const { useHide }: any = React.useContext(UserContext);
     const [InputDisabled, setInputDisabled] = React.useState(false);
    const Breadcrumb = [
        {
            MainComponent: "Home",
            MainComponentURl: `${siteUrl}/SitePages/Dashboard.aspx`,
        },
        {
            ChildComponent: "Document Cancellation",
            ChildComponentURl: `${siteUrl}/SitePages/DocumentCancellation.aspx`,
        },
    ];
    const [Loading, setLoading] = React.useState(false);
    const [FormItemId, setFormItemId] = React.useState(null);
    const [editID, setEditID] = React.useState(null);
    const [editItemID, setEditItemID] = React.useState(null);
    const [MainEditItem, setMainEditItem] = React.useState(null);
    const [rows, setRows] = React.useState<any>([]);
    const [UserRoles, setUserRoles] = React.useState<any>([]);
    const [rows1, setRows1] = React.useState<any>([]);
    const [currentUser, setCurrentUser] = React.useState(null);
    const [selectedOption, setSelectedOption] = React.useState(null);
    const [selectedPeople, setSelectedPeople] = React.useState(null);
    const [selectedRole, setSelectedRole] = React.useState(null);
    const [ValidDraft, setValidDraft] = React.useState(true);
    const [ValidSubmit, setValidSubmit] = React.useState(true);
    const [RequesterRoleId, setRequesterRoleId] = React.useState(null);
    const [RequestTypeId, setRequestTypeId] = React.useState(null);
    const [FormNameId, setFormNameId] = React.useState(null);
    const [ListNameId, setListNameId] = React.useState(null);
    const [editForm, setEditForm] = React.useState(false);
    const [modeValue, setmode] = React.useState("");
    const [DocumentLink, setDocumentLink] = React.useState(null);
    const [cancellReason, setcancellReason] = React.useState([{ id: 0, description: "", reason: "" }]);
    const [cancellReasonEdit, setcancellReasonEdit] = React.useState([]);
    const [showModal, setShowModal] = React.useState(false);
    const [formData, setFormData] = React.useState({
        RequesterNameId: 0,
        RequesterName: "",
        RequesterDesignation: "",
        Department: "",
        RequestDate: "",
        RequestDateNew: "",
        IssueDate: "",
        LocationId: 0,
        CustodianId: 0,
        SerialNumber: "",
        IssueNumber: "",
        RevisionNumber: "",
        RevisionDate: "",
        DocumentCode: "",
        ReferenceNumber: "",
        AmendmentTypeId: 0,
        RequestTypeId: 0,
        ClassificationId: 0,
        ChangeRequestTypeId: [],
        SubmiitedDate: "",
        SubmitStatus: "",
        Status: "",
        DocumentName: "",
        IsRework: false,
        DigitalSignStatus: false,
        ChangeRequestID: 0,
        AttachmentId: [],
        AttachmentJson: "",



    });

    const [forwardToArr, setForwardToArr] = React.useState<ForwardTo[]>([
        { id: 0, role: 0, level: 1, approvers: [] } // Default row
    ]);
    const [forwardToArrEdit, setForwardToArrEdit] = React.useState<ForwardTo[]>([]);
    const [selectedUsers, setSelectedUsers] = React.useState<any[]>([]);
    // const [remark, setRemark] = React.useState("");

    // Function to handle People Picker selection
    const onPeoplePickerChange = (items: any[]) => {
        setSelectedUsers(items);
    };

    const ApiCallFunc = async () => {
        setRequestTypeId(await getRequestTypeID(sp));
        var ReqId = await getRequestTypeID(sp)

        const path1 = window.location.pathname;

        if (path1.includes("/view/") || path1.includes("/approve/")) {
            setInputDisabled(true);
        }
        else {
            setInputDisabled(false);
        }

        const Currusers: any = await getCurrentUser(sp, siteUrl);
        setCurrentUser(await getCurrentUser(sp, siteUrl));
        const userProfile = await sp.profiles.myProperties();

        const AllUserRoles = await getDataRoles(sp);
        const setRolesValue = AllUserRoles.map(item => ({
            value: item.Id,
            label: item.Role,

        }));

        setUserRoles(setRolesValue)

        const users = await sp.web.siteUsers();
        const people = users.filter(user => user.PrincipalType === PrincipalType.User);

        const Selectedoptions = people.map(item => ({
            value: item.Id,
            label: item.Title,
            UserName: item.Title,
            UserEmail: item.Email
        }));

        setRows1(Selectedoptions);

        setFormData(prevData => ({
            ...prevData,
            RequesterNameId: Currusers?.Id || "",
            RequesterDesignation: userProfile?.Title || "",
            RequesterName: userProfile?.DisplayName || "",
            RequestDate: new Date().toLocaleDateString("en-CA"),
            // RequestedDate: new Date().toISOString().split("T")[0] // Format as YYYY-MM-DD
            RequestDateNew: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).replace(",", "")
        }));


        var DocCodeArr = await getAllDocumentCode(sp);
        const options = DocCodeArr.map((item: any) => ({
            value: item.DocumentCode,
            label: item.DocumentCode,
            IssueNumber: item.IssueNumber,
            ReferenceNumber: item.ReferenceNumber,
            RevisionNumber: item.RevisionNumber,
            ChangeRequestID: item.ID,
            IssueDate: item.IssueDate,
            LocationId: item.LocationId,
            CustodianId: item.CustodianId,
            SerialNumber: item.SerialNumber,
            RevisionDate: item.RevisionDate,
            AmendmentTypeId: item.AmendmentTypeId,
            RequestTypeId :ReqId,
            ClassificationId: item.ClassificationId,
            // ChangeRequestTypeId: item.ChangeRequestTypeId,
            ChangeRequestTypeId:RequestTypeId,
            SubmiitedDate: item.SubmiitedDate,
            SubmitStatus: item.SubmitStatus,
            DocumentTypeId: item.DocumentTypeId,
            Department:item.Department,
            AttachmentId:item.AttachmentId,
            AttachmentJson:item.AttachmentJson
            // DocumentName: "",
            // IsRework: false,
            // DigitalSignStatus: false,


        }));


        setRows(options);

       
        let formitemid;
        //#region getdataByID
        if (sessionStorage.getItem("DocumentCancelId") != undefined) {
          const iD = sessionStorage.getItem("DocumentCancelId")
          let iDs = decryptId(iD)
          formitemid = Number(iDs);
          setFormItemId(Number(iDs))
        }
        else {
        //   let formitemidparam = getUrlParameterValue('contentid');
        //   if (formitemidparam) {
        //     formitemid = Number(formitemidparam);
        //     setFormItemId(Number(formitemid));
        //   }

            const path = window.location.pathname;
            const segments = path.split('/').filter(Boolean); // Remove empty elements

            // Check if "edit" or "view" exists in the URL
            const paramIndex = segments.findIndex(seg => seg === "edit" || seg === "view" || seg === "approve");


            if (paramIndex !== -1 && segments[paramIndex + 1]) {
                setmode(segments[paramIndex])
                // mode = segments[paramIndex]; // Will be "edit" or "view"
                formitemid = segments[paramIndex + 1]; // Get the ID
                if (segments[paramIndex + 2] !== undefined) {
                    // var ProcessListItem={
                    //     Status:"",
                    //     Level:0,
                    //     CurrentUserRole:"",

                    // }

                    //  ProcessListItem =await getApprovalByID(sp, Number(segments[paramIndex + 2]),CONTENTTYPE_DocumentCancel);
                    // setInputDisabled((ProcessListItem.Status == "Pending" || ProcessListItem?.Status === "Save as draft") && ProcessListItem.Level === 0 && ProcessListItem.CurrentUserRole !=="OES")
                    setEditID(await getApprovalByID(sp, Number(segments[paramIndex + 2]), CONTENTTYPE_DocumentCancel));
                    var ProcessItemId : any= await getApprovalByID(sp, Number(segments[paramIndex + 2]), CONTENTTYPE_DocumentCancel);
                    setInputDisabled(await getApprovalByID2(sp, Number(segments[paramIndex + 2]), CONTENTTYPE_DocumentCancel));
                }
            }

        }
        // formitemid =20;
        if (formitemid) {
            setEditItemID(Number(formitemid));

            const setBannerById = await getItemByID(sp, Number(formitemid))

            if (setBannerById.length > 0) {
                debugger
                setEditForm(true);
                setMainEditItem(setBannerById[0]);
                // setCategoryData(await getCategory(sp, Number(setBannerById[0]?.TypeMaster))) // Category
                if (setBannerById[0].AttachmentId) {
                    setDocumentLink(await getDocumentLinkByID(sp, setBannerById[0].AttachmentId))
                }
                // if (ProcessItemId && ProcessItemId.Level === 0 && ProcessItemId.CurrentUserRole === "OES" && ProcessItemId.IsInitiator == "No") {
                    const ApprowData: any[] = await getAllProcessData(sp, Number(formitemid), CONTENTTYPE_DocumentCancel, setBannerById[0].DocumentCode)
                   
                    if(ApprowData.length >0){

                        const EditApprowData = ApprowData.map((item: any) => ({
                            id: item.ID,
                            role: item.ApproverRole?.Id || 0, // Assuming role comes from ApproverRole
                            level: item.Level || 1, // Default to 1 if missing
                            approvers: item.Approvers?.map((approver: any) => ({
                                value: approver.Id,
                                label: approver.Title,
                            })) || []
                        }));
                        setForwardToArr(EditApprowData);
                        setForwardToArrEdit(EditApprowData);

                    }
                   
                    // MainListID
                // }

                let arr = {

                    RequesterName: setBannerById[0].RequesterName,
                    RequesterNameId: setBannerById[0].RequesterNameId,
                    RequesterDesignation: setBannerById[0].RequesterDesignation,
                    Department: setBannerById[0].Department,
                    RequestDate: setBannerById[0].RequestDate,
                    RequestDateNew: new Date(setBannerById[0].RequestDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).replace(",", ""),

                    IssueDate: setBannerById[0].IssueDate,
                    LocationId: setBannerById[0].LocationId,
                    CustodianId: setBannerById[0].CustodianId,
                    SerialNumber: setBannerById[0].SerialNumber,
                    IssueNumber: setBannerById[0].IssueNumber,
                    RevisionNumber: setBannerById[0].RevisionNumber,
                    RevisionDate: setBannerById[0].RevisionDate,
                    DocumentCode: setBannerById[0].DocumentCode,
                    ReferenceNumber: setBannerById[0].ReferenceNumber,
                    AmendmentTypeId: setBannerById[0].AmendmentTypeId,
                    ClassificationId: setBannerById[0].ClassificationId,
                    ChangeRequestTypeId: setBannerById[0].ChangeRequestTypeId,
                    RequestTypeId :ReqId,
                    SubmiitedDate: setBannerById[0].SubmiitedDate,
                    SubmitStatus: setBannerById[0].SubmitStatus,
                    value: setBannerById[0].DocumentCode,
                    label: setBannerById[0].DocumentCode,
                    // Status: "Pending",
                    // DocumentName: "",
                    // IsRework: false,
                    // DigitalSignStatus: false,
                    ChangeRequestIDId: setBannerById[0].ChangeRequestID,
                    DocumentTypeId: setBannerById[0].DocumentTypeId,
                    AttachmentId: setBannerById[0].AttachmentId,
                    AttachmentJson: setBannerById[0].AttachmentJson


                }

                // let arr2 = {

                //     RequesterName: setBannerById[0].RequesterName,
                //     RequesterNameId: setBannerById[0].RequesterNameId,
                //     RequesterDesignation: setBannerById[0].RequesterDesignation,
                //     Department: setBannerById[0].Department,
                //     RequestDate: setBannerById[0].RequestDate,
                //     IssueDate: setBannerById[0].IssueDate,
                //     LocationId: setBannerById[0].LocationId,
                //     CustodianId: setBannerById[0].CustodianId,
                //     SerialNumber: setBannerById[0].SerialNumber,
                //     IssueNumber: setBannerById[0].IssueNumber,
                //     RevisionNumber: setBannerById[0].RevisionNumber,
                //     RevisionDate: setBannerById[0].RevisionDate,
                //     DocumentCode: setBannerById[0].value,
                //     ReferenceNumber: setBannerById[0].ReferenceNumber,
                //     AmendmentTypeId: setBannerById[0].AmendmentTypeId,
                //     ClassificationId: setBannerById[0].ClassificationId,
                //     ChangeRequestTypeId: setBannerById[0].ChangeRequestTypeId,
                //     SubmiitedDate: setBannerById[0].SubmiitedDate,
                //     SubmitStatus: setBannerById[0].SubmitStatus,
                //     // value: setBannerById[0].DocumentCode,
                //     // label: setBannerById[0].DocumentCode,
                //     // Status: "Pending",
                //     // DocumentName: "",
                //     // IsRework: false,
                //     // DigitalSignStatus: false,
                //     ChangeRequestIDId: setBannerById[0].ChangeRequestIDId,
                //     DocumentTypeId: setBannerById[0].DocumentTypeId,
                //     AttachmentId: setBannerById[0].AttachmentId,
                //     AttachmentJson: setBannerById[0].AttachmentJson


                // }

                setFormData(prevData => ({
                    ...prevData,
                    IssueNumber: setBannerById[0].IssueNumber,
                    ReferenceNumber: setBannerById[0].ReferenceNumber,
                    RevisionNumber: setBannerById[0].RevisionNumber,
                    ChangeRequestID: setBannerById[0].ChangeRequestIDId,
                    IssueDate: setBannerById[0].IssueDate,
                    LocationId: setBannerById[0].LocationId,
                    CustodianId: setBannerById[0].CustodianId,
                    SerialNumber: setBannerById[0].SerialNumber,
                    RevisionDate: setBannerById[0].RevisionDate,
                    AmendmentTypeId: setBannerById[0].AmendmentTypeId,
                    ClassificationId: setBannerById[0].ClassificationId,
                    ChangeRequestTypeId: setBannerById[0].ChangeRequestTypeId,
                    RequestTypeId :ReqId,
                    SubmiitedDate: setBannerById[0].SubmiitedDate,
                    SubmitStatus: setBannerById[0].SubmitStatus,
                    DocumentCode: setBannerById[0].DocumentCode,
                    DocumentTypeId: setBannerById[0].DocumentTypeId,
                    Department: setBannerById[0].Department,
                    AttachmentId: setBannerById[0].AttachmentId,
                    AttachmentJson: setBannerById[0].AttachmentJson

                    // Format as YYYY-MM-DD
                }));

                // setFormData(arr2);

                setSelectedOption(arr);

                const rowData: any[] = await getItemByID2(sp, Number(setBannerById[0].ID)) //baseUrl
                const initialRows = rowData.map((item: any) => ({
                    id: item.Id,
                    description: item.ChangeDescription,
                    reason: item.ReasonforChange,
                }));
                setcancellReason(initialRows);
                setcancellReasonEdit(initialRows);


            }

            setRequesterRoleId(await getRequesterID(sp))
            setFormNameId(await getFormNameID(sp, CONTENTTYPE_DocumentCancel))
            setListNameId(await getListNameID(sp, LIST_TITLE_DocCancel))



        }
        //}
        //#endregion

       
    };

    const onSelect = async (selectedList: any) => {
        console.log(selectedList, "selectedList");
        setFormData(prevData => ({
            ...prevData,
            IssueNumber: selectedList.IssueNumber,
            ReferenceNumber: selectedList.ReferenceNumber,
            RevisionNumber: selectedList.RevisionNumber,
            ChangeRequestID: selectedList.ChangeRequestID,
            IssueDate: selectedList.IssueDate,
            LocationId: selectedList.LocationId,
            CustodianId: selectedList.CustodianId,
            SerialNumber: selectedList.SerialNumber,
            RevisionDate: selectedList.RevisionDate,
            AmendmentTypeId: selectedList.AmendmentTypeId,
            ClassificationId: selectedList.ClassificationId,
            ChangeRequestTypeId: selectedList.ChangeRequestTypeId,
            RequestTypeId :RequestTypeId,
            SubmiitedDate: selectedList.SubmiitedDate,
            SubmitStatus: selectedList.SubmitStatus,
            DocumentCode: selectedList.value,
            DocumentTypeId: selectedList.DocumentTypeId,
            Department:selectedList.Department,
            AttachmentId:selectedList.AttachmentId,
            AttachmentJson:selectedList.AttachmentJson
            // Format as YYYY-MM-DD
        }));
        setSelectedOption(selectedList);
        if (selectedList.AttachmentId) {
            setDocumentLink(await getDocumentLinkByID(sp, selectedList.AttachmentId))
        }
        else {
            setDocumentLink(null);
        }  // Set the selected users
    };

    const onSelectApprovers = (selectedOptions: any, lvl: number) => {
        setForwardToArr((prev) =>
            prev.map((row) =>
                row.level === lvl ? { ...row, approvers: selectedOptions || [] } : row
            )
        );
    };


    // const onSelectRole = (selectedList: any) => {
    //     // console.log(selectedList , "selectedList");
    //     setSelectedRole(selectedList);  // Set the selected users
    // };

    const onSelectRole = (event: React.ChangeEvent<HTMLSelectElement>, lvl: number) => {
        const updatedArr = forwardToArr.map(row =>
            row.level === lvl ? { ...row, role: Number(event.target.value) } : row
        );
        setForwardToArr(updatedArr);
        setSelectedRole(forwardToArr.map(r => r.role).filter(role => role))
    };


    // const handleAddRow = () => {
    //     const newRow: ForwardTo = { id: Date.now(), role: 0, level: "", approvers: [] };
    //     setForwardToArr([...forwardToArr, newRow]);
    // };
    const handleAddRow = () => {
        setForwardToArr((prev) => [
            ...prev,
            { id: 0, role: 0, level: prev.length + 1, approvers: [] }
        ]);
    };

    // const handleDeleteRow = (index: number) => {
    //     // const updatedRows = forwardToArr.filter((_, i) => i !== index);
    //     // setForwardToArr(updatedRows);
    //     forwardToArr.splice(index, 1);
    //     setForwardToArr(forwardToArr);
    // };
    // const handleDeleteRow = (index: number) => {
    //     const updatedRows = forwardToArr.filter((_, i) => i !== index);
    //     setForwardToArr([...updatedRows]); // Ensure a new array reference
    // };
    const handleDeleteRow = (index: number) => {
        const updatedRows = forwardToArr
            .filter((_, i) => i !== index) // Remove selected row
            .map((row, newIndex) => ({ ...row, level: newIndex + 1 })); // Reassign levels
   
        setForwardToArr([...updatedRows]); // Ensure a new array reference
    };
   


    React.useEffect(() => {

        ApiCallFunc();




        // formData.title = currentUser.Title;

    }, [useHide]);

    const handleCancel = () => {
        window.location.href = `${siteUrl}/SitePages/EDCMAIN.aspx`;
        // debugger
        // if(pageValue == "MyRequest"){
        //   window.location.href = `${siteUrl}/SitePages/MyRequests.aspx`;
        // }else if(pageValue == "MyApproval"){
        //   window.location.href = `${siteUrl}/SitePages/MyApprovals.aspx`;
        // }else{
        //   window.location.href = `${siteUrl}/SitePages/announcementmaster.aspx`;
        // }
    }

    //#region deleteLocalFile
    const deleteLocalFile = (index: number, filArray: any[]) => {
        // Create a new array without mutating the existing state
        const updatedFiles = [...cancellReason];
        updatedFiles.splice(index, 1);

        // Update the state with the new array
        setcancellReason(updatedFiles);
    };

    const OpenFile = (obj: any) => {

        const fileUrl = `${Tenant_URL}${obj.FileRef}`;

        // if (obj.FileRef.endsWith(".docx")) {
        //     window.open(`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(fileUrl)}`, "_blank");
        //   } else if (obj.FileRef.endsWith(".xlsx")) {
        //     window.open(`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(fileUrl)}`, "_blank");
        //   } else {
        //     window.open(fileUrl, "_blank"); // Open PDF and other files normally
        //   }

        if (fileUrl.endsWith(".docx") || fileUrl.endsWith(".xlsx") || fileUrl.endsWith(".pptx")) {
            window.open(`${siteUrl}/_layouts/15/WopiFrame.aspx?sourcedoc=${encodeURIComponent(obj.FileRef)}&action=default`, "_blank");
        } else {
            window.open(fileUrl, "_blank"); // Open PDF and other files normally
        }
    }

    //#endregion


    const addCancelReason = () => {
        setcancellReason([...cancellReason, { id: 0, description: "", reason: "" }]);
    };
    const validateForm = async (fmode: FormSubmissionMode) => {
        const { RequesterName, RequesterDesignation, RequestDate, DocumentCode, IssueNumber, RevisionNumber, ReferenceNumber } = formData;
        // const { description } = richTextValues;
        let valid = true;
        // let validateOverview:boolean = false;
        // let validatetitlelength = false;
        // let validateTitle = false;
        setValidDraft(true);
        setValidSubmit(true);
        // if (title!== "") {
        //  validatetitlelength = title.length <= 255;
        //   validateTitle = title !== "" && await allowstringonly(title);
        // }
        // if (overview !==""){
        //   validateOverview = overview! == "" && await allowstringonly(overview);
        // }


        let errormsg = "";
        // console.log("validateTitleup", validateTitle, "validatetitlelength", validatetitlelength, title !== "", overview !== "","overview", overview, validateOverview);
        // if (title !== "" && !validateTitle && validatetitlelength) {
        //   errormsg = "No special character allowed in Title";
        //   valid = false;
        // } else if (title !== "" && validateTitle && !validatetitlelength) {
        //   errormsg = "Title must be less than 255 characters";
        //   valid = false;
        // }
        // else if (overview !== "" && !validateOverview) {
        //   errormsg = "No special character allowed in Overview";
        //   valid = false;
        //}
        // else if ((ImagepostArr.length > 0 && ImagepostArr.length > 5) || ( ImagepostArr1.length > 0 && ImagepostArr1.length > 5)){
        //     errormsg = "More than 5 attachments not allowed";
        //     valid = false;
        //   }
        if (fmode == FormSubmissionMode.SUBMIT) {
            if (!RequesterName) {
                //Swal.fire('Error', 'Title is required!', 'error');
                valid = false;
            } else if (!RequesterDesignation) {
                //Swal.fire('Error', 'Type is required!', 'error');
                valid = false;
            }
            //   else if (!RequestDate) {
            //     //Swal.fire('Error', 'Category is required!', 'error');
            //     valid = false;
            //   }
            else if (selectedOption == null || !selectedOption.value) {
                //Swal.fire('Error', 'Entity is required!', 'error');
                valid = false;
            }
            else if(cancellReason.length>0 && cancellReason.every((row:any) => row.description.trim() !== "" && row.reason.trim() !== "")==false){
                // const isValid = cancellReason.every((row:any) => row.description.trim() !== "" && row.reason.trim() !== "");
                valid = false;
            }
            else if(cancellReason.length == 0){
                // const isValid = rows.every((row:any) => row.description.trim() !== "" && row.reason.trim() !== "");
                valid = false;
            }
            else if (IssueNumber === "") {
                //Swal.fire('Error', 'Entity is required!', 'error');
                valid = false;
            }
            else if (RevisionNumber === "") {
                //Swal.fire('Error', 'Entity is required!', 'error');
                valid = false;
              }
              else if (!ReferenceNumber) {
                //Swal.fire('Error', 'Entity is required!', 'error');
                valid = false;
              }

            setValidSubmit(valid);

        }
        else {
            if (!RequesterName) {
                //Swal.fire('Error', 'Title is required!', 'error');
                valid = false;
            } else if (!RequesterDesignation) {
                //Swal.fire('Error', 'Type is required!', 'error');
                valid = false;
            }
            else if (selectedOption == null || !selectedOption.value) {
                //Swal.fire('Error', 'Entity is required!', 'error');
                valid = false;
            }

            setValidDraft(valid);

        }
       

       

   
        //else if (!overview) {
        //   Swal.fire('Error', 'Overview is required!', 'error');
        //   valid = false;
        // } else if (!description) {
        //   Swal.fire('Error', 'Description is required!', 'error');
        //   valid = false;
        // } else if (!FeaturedAnnouncement) {
        //   Swal.fire('Error', 'Featured Announcement is required!', 'error');
        //   valid = false;
        // }
        // console.log("validateTitle", validateTitle,"errormsg", errormsg,"valid,", valid, ImagepostArr.length);
        if (!valid && fmode == FormSubmissionMode.SUBMIT)
            Swal.fire(errormsg !== "" ? errormsg : 'Please fill all the mandatory fields.');
        // else if (!valid && fmode == FormSubmissionMode.SUBMIT && rows.length >0){
        //     Swal.fire(errormsg !== "" ? errormsg : 'Please fill all the mandatory fields.');
        // }
        else if (!valid && fmode == FormSubmissionMode.DRAFT) {
            Swal.fire(errormsg !== "" ? errormsg : 'Please fill the mandatory fields for draft - Title and Type');
        }
        return valid;
    };
    //#region  Submit Form
    const handleFormSubmit = async () => {
        if (await validateForm(FormSubmissionMode.SUBMIT)) {
            if (editForm) {
                Swal.fire({
                    title: 'Do you want to submit this request?',
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText: "Yes",
                    cancelButtonText: "No",
                    icon: 'warning'
                }
                ).then(async (result) => {
                    console.log(result)
                    if (result.isConfirmed) {
                        setLoading(true);

                        // let TypeMasterData: any = await getAnnouncementandNewsTypeMaster(sp, Number(formData.Type))
                        let arr = {
                            Title: formData.RequesterName,
                            RequesterNameId: formData.RequesterNameId,
                            RequesterDesignation: formData.RequesterDesignation,
                            Department: formData.Department,
                            RequestDate: formData.RequestDate,
                            IssueDate: formData.IssueDate,
                            LocationId: selectedOption.LocationId,
                            CustodianId: selectedOption.CustodianId,
                            SerialNumber: selectedOption.SerialNumber,
                            IssueNumber: selectedOption.IssueNumber,
                            RevisionNumber: selectedOption.RevisionNumber,
                            RevisionDate: selectedOption.RevisionDate,
                            DocumentCode: selectedOption.value,
                            ReferenceNumber: selectedOption.ReferenceNumber,
                            AmendmentTypeId: selectedOption.AmendmentTypeId,
                            RequestTypeId :RequestTypeId,
                            ClassificationId: selectedOption.ClassificationId,
                            ChangeRequestTypeId: selectedOption.ChangeRequestTypeId?selectedOption.ChangeRequestTypeId:[],
                            SubmiitedDate: selectedOption.SubmiitedDate,
                            // SubmitStatus: selectedOption.SubmitStatus,
                            SubmitStatus: "Yes",
                            Status: "Pending",
                            // DocumentName: "",
                            // IsRework: false,
                            // DigitalSignStatus: false,
                            ChangeRequestIDId: formData.ChangeRequestID,
                            DocumentTypeId: selectedOption.DocumentTypeId,
                            OESSubmitStatus:"No",
                            InitiatorSubmitStatus:"Yes",
                            CurrentUserRole:"OES",
                            AttachmentId:selectedOption.AttachmentId,
                            AttachmentJson:selectedOption.AttachmentJson


                        }
                        const postResult = await updateItem(arr, sp, editItemID);
                        const postId = postResult?.data?.ID;


                        for (const row of cancellReason) {

                            const postPayload2 = {
                                ChangeRequestDCIDId: editItemID, // Assuming "Title" column exists
                                ChangeDescription: row.description,
                                ReasonforChange: row.reason,
                            }
                           
                            if(!row.id){

                                const postResult2 = await addItem2(postPayload2, sp);
                                const postId2 = postResult2?.data?.ID;
                                // debugger
                                if (!postId2) {
                                    console.error("Post creation failed.");
                                    return;
                                }
                               
                            }
                            else if (row.id > 0) {
                                const postResult2 = await updateItem2(postPayload2, sp, row.id);
                                const postId2 = postResult2?.data?.ID;
                            }
                           
                        }

                        // let Apparr = {
                        //     // Title:,
                        //     RequestId:selectedOption.value,
                        //     Level:0,
                        //     // LevelType:
                        //     AssignedToId:currentUser?.Id,
                        //     RequesterNameId:currentUser?.Id,
                        //     RequestedDate:new Date().toLocaleDateString("en-CA"),
                        //     // RequesterRoleId:"Initiator",
                        //     // ActionTakenBy:
                        //     // ActionTakenOn:
                        //     // ActionTakenRole:
                        //     Status:"Pending",
                        //     // Remark:
                        //     // IsAutoRework:
                        //     IsRework:"No",
                        //     ListItemId:editItemID,
                        //     // ListName:"ChangeRequestDocumentCancellationList",
                        //     ProcessName:"Document Cancellation",
                        //     // FormName:
                        //     ApprovalType:"Assignment",
                        //     // RedirectionLink:
                        //     // ApprovalLevelListItemId:
                        //     // ApprovalLevelListName:
                        //     // Maxlevel :
                        //     InitiatorNameId:currentUser?.Id,
                        //     DirectTask:"No",
                        //     CurrentUserRole:"OES"                          


                        // }
                        // const postResult3 = await addApprovalItem(Apparr, sp);
                        // const postId3 = postResult3?.data?.ID;

                        // await AddContentMaster(sp, arr)

                        // const boolval = await handleClick(editID, TypeMasterData?.TypeMaster, Number(formData.entity))
                        // /*********** */

                        // Find items that are in cancellReasonEdit but NOT in cancellReason
                        const toDelete = cancellReasonEdit.filter(
                            (itemEdit) => !cancellReason.some(item => item.id === itemEdit.id) // Assuming ID is the unique key
                        );

                        // Delete each item from SharePoint
                        for (const item of toDelete) {
                            try {
                                await sp.web.lists.getByTitle("ChangeRequestReasonDocumentCancellationList").items.getById(item.id).delete();
                                // console.log(`Deleted item with ID: ${item.ID}`);
                            } catch (error) {
                                console.error(`Error deleting item with ID: ${item.id}`, error);
                            }
                        }

                        // ///////************* */
                        let boolval = false;

                        // if (boolval == true) {
                        setLoading(false);
                        Swal.fire('Submitted successfully.', '', 'success');
                        sessionStorage.removeItem("DocumentCancelId")
                        setTimeout(() => {
                            window.location.href = `${siteUrl}/SitePages/EDCMAIN.aspx`;
                        }, 500);
                        // }
                    }

                })
            }
            else {
                Swal.fire({
                    title: 'Do you want to submit this request?',
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText: "yes",
                    cancelButtonText: "No",
                    icon: 'warning'
                }
                ).then(async (result) => {
                    //console.log("Form Submitted:", formValues, bannerImages, galleryImages, documents);
                    if (result.isConfirmed) {
                        setLoading(true);

                        const postPayload = {
                            Title: formData.RequesterName,
                            RequesterNameId: formData.RequesterNameId,
                            RequesterDesignation: formData.RequesterDesignation,
                            Department: formData.Department,
                            RequestDate: formData.RequestDate,
                            IssueDate: formData.IssueDate ? formData.IssueDate : null,
                            LocationId: selectedOption.LocationId,
                            CustodianId: selectedOption.CustodianId,
                            SerialNumber: Number(selectedOption.SerialNumber),
                            IssueNumber: Number(selectedOption.IssueNumber),
                            RevisionNumber: selectedOption.RevisionNumber,
                            RevisionDate: selectedOption.RevisionDate ? selectedOption.RevisionDate : null,
                            DocumentCode: selectedOption.value,
                            ReferenceNumber: selectedOption.ReferenceNumber,
                            AmendmentTypeId: selectedOption.AmendmentTypeId,
                            RequestTypeId :RequestTypeId,
                            ClassificationId: selectedOption.ClassificationId,
                            ChangeRequestTypeId: selectedOption.ChangeRequestTypeId?selectedOption.ChangeRequestTypeId:[],
                            SubmiitedDate: selectedOption.SubmiitedDate,
                            // SubmitStatus: selectedOption.SubmitStatus,
                            SubmitStatus: "Yes",
                            Status: "Pending",
                            //   DocumentName: "",
                            //   IsRework: false,
                            //   DigitalSignStatus: false,
                            ChangeRequestIDId: formData.ChangeRequestID,
                            DocumentTypeId: selectedOption.DocumentTypeId,
                            OESSubmitStatus: "No",
                            InitiatorSubmitStatus: "Yes",
                            CurrentUserRole: "OES",
                            AttachmentId: selectedOption.AttachmentId,
                            AttachmentJson: selectedOption.AttachmentJson ? selectedOption.AttachmentJson : ""


                        };
                        console.log(postPayload);

                        const postResult = await addItem(postPayload, sp);
                        const postId = postResult?.data?.ID;
                        // debugger
                        if (!postId) {
                            console.error("Post creation failed.");
                            return;
                        }

                        for (const row of cancellReason) {

                            const postPayload2 = {
                                ChangeRequestDCIDId: postId, // Assuming "Title" column exists
                                ChangeDescription: row.description,
                                ReasonforChange: row.reason,
                            }

                            const postResult2 = await addItem2(postPayload2, sp);
                            const postId2 = postResult2?.data?.ID;
                            // debugger
                            if (!postId2) {
                                console.error("Post creation failed.");
                                return;
                            }
                        }

                        // let Apparr = {
                        //     // Title:,
                        //     RequestId:selectedOption.value,
                        //     Level:0,
                        //     // LevelType:
                        //     AssignedToId:currentUser?.Id,
                        //     RequesterName:currentUser.Title,
                        //     RequestedDate:new Date().toLocaleDateString("en-CA"),
                        //     RequesterRole:"Initiator",
                        //     // ActionTakenBy:
                        //     // ActionTakenOn:
                        //     // ActionTakenRole:
                        //     Status:"Pending",
                        //     // Remark:
                        //     // IsAutoRework:
                        //     IsRework:"No",
                        //     ListItemId:postId,
                        //     // ListName:"ChangeRequestDocumentCancellationList",
                        //     ProcessName:"Document Cancellation",
                        //     // FormName:
                        //     ApprovalType:"Assignment",
                        //     // RedirectionLink:
                        //     // ApprovalLevelListItemId:
                        //     // ApprovalLevelListName:
                        //     // Maxlevel :
                        //     InitiatorNameId:currentUser?.Id,
                        //     DirectTask:"No",
                        //     CurrentUserRole:"OES"                          


                        // }
                        // const postResult3 = await addApprovalItem(Apparr, sp);
                        // const postId3 = postResult3?.data?.ID;



                        let boolval;

                        // if (boolval == true) {
                        setLoading(false);
                        Swal.fire('Submitted successfully.', '', 'success');
                        // sessionStorage.removeItem("bannerId")
                        setTimeout(() => {
                            window.location.href = `${siteUrl}/SitePages/EDCMAIN.aspx`;
                        }, 500);
                        // }

                    }
                })

            }
        }

    }

    const handleSaveAsDraft = async () => {
        if (await validateForm(FormSubmissionMode.DRAFT)) {
            if (editForm) {
                Swal.fire({
                    title: 'Do you want to save this request?',
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText: "Yes",
                    cancelButtonText: "No",
                    icon: 'warning'
                }
                ).then(async (result) => {
                    console.log(result)
                    if (result.isConfirmed) {
                        setLoading(true);

                        // let TypeMasterData: any = await getAnnouncementandNewsTypeMaster(sp, Number(formData.Type))
                        let arr = {
                            Title: formData.RequesterName,
                            RequesterNameId: formData.RequesterNameId,
                            RequesterDesignation: formData.RequesterDesignation,
                            Department: formData.Department,
                            RequestDate: formData.RequestDate,
                            IssueDate: formData.IssueDate,
                            LocationId: selectedOption.LocationId,
                            CustodianId: selectedOption.CustodianId,
                            SerialNumber: selectedOption.SerialNumber,
                            IssueNumber: selectedOption.IssueNumber,
                            RevisionNumber: selectedOption.RevisionNumber,
                            RevisionDate: selectedOption.RevisionDate,
                            DocumentCode: selectedOption.value,
                            ReferenceNumber: selectedOption.ReferenceNumber,
                            AmendmentTypeId: selectedOption.AmendmentTypeId,
                            RequestTypeId :RequestTypeId,
                            ClassificationId: selectedOption.ClassificationId,
                            ChangeRequestTypeId: selectedOption.ChangeRequestTypeId?selectedOption.ChangeRequestTypeId:[],
                            SubmiitedDate: selectedOption.SubmiitedDate,
                            // SubmitStatus: selectedOption.SubmitStatus,
                            SubmitStatus: "No",
                            Status: "Save as draft",
                            // DocumentName: "",
                            // IsRework: false,
                            // DigitalSignStatus: false,
                            ChangeRequestIDId: formData.ChangeRequestID,
                            DocumentTypeId: selectedOption.DocumentTypeId,
                            OESSubmitStatus:"No",
                            InitiatorSubmitStatus:"No",
                            CurrentUserRole:"OES",
                            AttachmentId:selectedOption.AttachmentId,
                            AttachmentJson:selectedOption.AttachmentJson


                        }
                        const postResult = await updateItem(arr, sp, editItemID);
                        const postId = postResult?.data?.ID;


                        for (const row of cancellReason) {

                            const postPayload2 = {
                                ChangeRequestDCIDId: editItemID, // Assuming "Title" column exists
                                ChangeDescription: row.description,
                                ReasonforChange: row.reason,
                            }
                           
                            if(!row.id){

                                const postResult2 = await addItem2(postPayload2, sp);
                                const postId2 = postResult2?.data?.ID;
                                // debugger
                                if (!postId2) {
                                    console.error("Post creation failed.");
                                    return;
                                }
                               
                            }
                            else if(row.id>0){
                                const postResult2 = await updateItem2(postPayload2, sp, row.id);
                                const postId2 = postResult2?.data?.ID;
                            }
                           
                        }
                        // await AddContentMaster(sp, arr)

                        // const boolval = await handleClick(editID, TypeMasterData?.TypeMaster, Number(formData.entity))
                        // /*********** */

                        // Find items that are in cancellReasonEdit but NOT in cancellReason
                        const toDelete = cancellReasonEdit.filter(
                            (itemEdit) => !cancellReason.some(item => item.id === itemEdit.id) // Assuming ID is the unique key
                        );

                        // Delete each item from SharePoint
                        for (const item of toDelete) {
                            try {
                                await sp.web.lists.getByTitle("ChangeRequestReasonDocumentCancellationList").items.getById(item.id).delete();
                                // console.log(`Deleted item with ID: ${item.ID}`);
                            } catch (error) {
                                console.error(`Error deleting item with ID: ${item.id}`, error);
                            }
                        }

                        // ///////************* */
                        let boolval = false;

                        // if (boolval == true) {
                        setLoading(false);
                        Swal.fire('Saved successfully.', '', 'success');
                        sessionStorage.removeItem("DocumentCancelId")
                        setTimeout(() => {
                            window.location.href = `${siteUrl}/SitePages/EDCMAIN.aspx`;
                        }, 1000);
                        // }
                    }

                })
            }
            else {
                Swal.fire({
                    title: 'Do you want to save this request?',
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText: "Yes",
                    cancelButtonText: "No",
                    icon: 'warning'
                }
                ).then(async (result) => {
                    //console.log("Form Submitted:", formValues, bannerImages, galleryImages, documents);
                    if (result.isConfirmed) {
                        setLoading(true);


                        const postPayload = {
                            Title: formData.RequesterName,
                            RequesterNameId: formData.RequesterNameId,
                            RequesterDesignation: formData.RequesterDesignation,
                            Department: formData.Department,
                            RequestDate: formData.RequestDate,
                            IssueDate: formData.IssueDate,
                            LocationId: selectedOption.LocationId,
                            CustodianId: selectedOption.CustodianId,
                            SerialNumber: Number(selectedOption.SerialNumber),
                            IssueNumber: Number(selectedOption.IssueNumber),
                            RevisionNumber: selectedOption.RevisionNumber,
                            RevisionDate: selectedOption.RevisionDate,
                            DocumentCode: selectedOption.value,
                            ReferenceNumber: selectedOption.ReferenceNumber,
                            AmendmentTypeId: selectedOption.AmendmentTypeId,
                            RequestTypeId :RequestTypeId,
                            ClassificationId: selectedOption.ClassificationId,
                            ChangeRequestTypeId: selectedOption.ChangeRequestTypeId?selectedOption.ChangeRequestTypeId:[],
                            SubmiitedDate: selectedOption.SubmiitedDate,
                            SubmitStatus: "No",
                            Status: "Save as draft",
                            //   DocumentName: "",
                            //   IsRework: false,
                            //   DigitalSignStatus: false,
                            ChangeRequestIDId: formData.ChangeRequestID,
                            DocumentTypeId: selectedOption.DocumentTypeId,
                             OESSubmitStatus:"No",
                            InitiatorSubmitStatus:"No",
                            CurrentUserRole:"OES",
                            AttachmentId:selectedOption.AttachmentId,
                            AttachmentJson:selectedOption.AttachmentJson


                        };
                        console.log(postPayload);

                        const postResult = await addItem(postPayload, sp);
                        const postId = postResult?.data?.ID;
                        // debugger
                        if (!postId) {
                            console.error("Post creation failed.");
                            return;
                        }

                        for (const row of cancellReason) {

                            const postPayload2 = {
                                ChangeRequestDCIDId: postId, // Assuming "Title" column exists
                                ChangeDescription: row.description,
                                ReasonforChange: row.reason,
                            }

                            const postResult2 = await addItem2(postPayload2, sp);
                            const postId2 = postResult2?.data?.ID;
                            // debugger
                            if (!postId2) {
                                console.error("Post creation failed.");
                                return;
                            }
                        }


                        setLoading(false);
                        Swal.fire('Saved successfully.', '', 'success');
                        // sessionStorage.removeItem("bannerId")
                        setTimeout(() => {
                            window.location.href = `${siteUrl}/SitePages/EDCMAIN.aspx`;
                        }, 1000);
                    }
                })

            }
        }

    }


    // public render(): React.ReactElement<IDocumentCancellationProcessProps> {  
    //     const peoplePickerContext: IPeoplePickerContext = {
    //       absoluteUrl: this.props.context.pageContext.web.absoluteUrl,
    //       msGraphClientFactory: this.props.context.msGraphClientFactory,
    //       spHttpClient: this.props.context.spHttpClient
    //   };

    const ForwardApproval = async (status: string) => {
        let valid = true;
        let actionMessage = "";
        let successMessage = "";
        switch (status) {
            case "Forward":
                actionMessage = "Do you want to forward this request?";
                successMessage = "Request forwarded successfully.";
                break;
            case "Rejected":
                actionMessage = "Do you want to reject this request?";
                successMessage = "Request rejected successfully.";
                break;
            case "Rework":
                actionMessage = "Do you want to send this request for rework?";
                successMessage = "Request sent for rework successfully.";
                break;
        }


        if (status == "Forward") {
            if (forwardToArr.length === 0) {
                // alert("At least one row is required.");
                valid = false;
            }

            const isValid = forwardToArr.every(row => row.role !== 0 && row.approvers.length > 0);

            if (!isValid) {
                // alert("Each row must have a role selected and at least one approver.");
                valid = false;
            }

            if (!valid) {
                Swal.fire('Please fill all the mandatory fields.');
                return;
            }

            if (valid) {
                Swal.fire({
                    title: actionMessage,
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText: "Yes",
                    cancelButtonText: "No",
                    icon: 'warning'
                }
                ).then(async (result) => {
                    console.log(result)
                    if (result.isConfirmed) {
                        setLoading(true);

                        // let TypeMasterData: any = await getAnnouncementandNewsTypeMaster(sp, Number(formData.Type))

                        let arr = {
                            ActionTakenById: currentUser.Id,
                            ActionTakenOn: new Date().toLocaleDateString("en-CA"),
                            // ActionTakenRoleId: formData.RequesterDesignation,
                            Status: "Approved",
                            // Remark: remark,


                        }
                        const postResult = await updateApprovalItem(arr, sp, editID.Id);
                        const postId = postResult?.data?.ID;

                        for (const item of forwardToArr) {

                            const approversIds: any[] = [];
                            item.approvers.forEach((user: any) => {
                                if (user?.value) {
                                    approversIds.push(user.value);
                                }
                            });

                            let arr2 = {
                                Title:currentUser.Title,
                                ContentTitle:selectedOption.DocumentCode,
                                MainListNameId: ListNameId,
                                ApproverRoleId: item.role,
                                Level: Number(item.level),
                                ApproversId: approversIds,
                                LevelType: "One",
                                SubmitStatus: "Yes",
                                Maxlevel: item.approvers?.length,
                                // ContentTitle:,
                                MainListID: String(editItemID),
                                RequestId: selectedOption.DocumentCode,
                                // RequestId:String(editID.Id),
                                RequesterNameId: currentUser.Id,
                                RequestedDate: new Date().toLocaleDateString("en-CA"),
                                RequesterRoleId: RequesterRoleId,
                                ProcessName: "Document Cancellation",
                                FormNameId: FormNameId,
                                ApprovalType: "Approval",
                                IsApprovalGenerated:"No"
                                // RedirectionLink:,



                            }
                            if(item.id){
                                const postResult2 = await UpdateAllProcessItem(arr2, sp,item.id);
                                const postId2 = postResult2?.data?.ID;

                            }
                            else{

                                const postResult2 = await addAllProcessItem(arr2, sp);
                                const postId2 = postResult2?.data?.ID;

                            }
                           

                        }

                        let arr2 = {
                            // ActionTakenById: currentUser.Id,
                            SubmiitedDate: new Date().toLocaleDateString("en-CA"),
                            // ActionTakenRoleId: formData.RequesterDesignation,
                            // Status: status ==="Rework"?"Rework":"Rejected",
                            // IsRework: status ==="Rework"?"Yes":"No",
                            OESSubmitStatus: "Yes",
                            InitiatorSubmitStatus: "Yes",
                            SubmitStatus: "Yes",


                        }
                        const postResult3 = await updateItem(arr2, sp, editItemID);
                        const postId3 = postResult3?.data?.ID;

                        // //////// if approver row deleted

                        const toDelete = forwardToArrEdit.filter(
                            (itemEdit) => !forwardToArr.some(item => item.id === itemEdit.id) // Assuming ID is the unique key
                        );

                        // Delete each item from SharePoint
                        for (const item of toDelete) {
                            try {
                                await sp.web.lists.getByTitle("AllProcessApprovalLevelList").items.getById(item.id).delete();
                                // console.log(`Deleted item with ID: ${item.ID}`);
                            } catch (error) {
                                console.error(`Error deleting item with ID: ${item.id}`, error);
                            }
                        }




                        setLoading(false);
                        Swal.fire(successMessage, '', 'success');
                        sessionStorage.removeItem("DocumentCancelId")
                        setTimeout(() => {
                            window.location.href = `${siteUrl}/SitePages/MyTasks.aspx`;
                        }, 1000);
                        // }
                    }
                })
            }



        }
        else {

            if(forwardToArr.length){
            const isValid = forwardToArr.every(row => row.role !== 0 && row.approvers.length > 0);

            if (!isValid) {
                // alert("Each row must have a role selected and at least one approver.");
                valid = false;
            }
           
           

            if (!valid) {
                Swal.fire('Please fill all the mandatory fields.');
                return;
            }

            }


            if (valid) {
                Swal.fire({
                    title: actionMessage,
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText: "Yes",
                    cancelButtonText: "No",
                    icon: 'warning'
                }
                ).then(async (result) => {
                    console.log(result)
                    if (result.isConfirmed) {
                        setLoading(true);

                        // let TypeMasterData: any = await getAnnouncementandNewsTypeMaster(sp, Number(formData.Type))
                        let arr = {
                            ActionTakenById: currentUser.Id,
                            ActionTakenOn: new Date().toLocaleDateString("en-CA"),
                            // ActionTakenRoleId: formData.RequesterDesignation,
                            Status: status,
                            // Remark: remark,


                        }
                        const postResult = await updateApprovalItem(arr, sp, editID.Id);
                        const postId = postResult?.data?.ID;

                        for (const item of forwardToArr) {

                            const approversIds: any[] = [];
                            item.approvers.forEach((user: any) => {
                                if (user?.value) {
                                    approversIds.push(user.value);
                                }
                            });

                            let arr2 = {
                                Title:currentUser.Title,
                                ContentTitle:selectedOption.DocumentCode,

                                MainListNameId: ListNameId,
                                ApproverRoleId: item.role,
                                Level: Number(item.level),
                                ApproversId: approversIds,
                                LevelType: "One",
                                SubmitStatus: "Yes",
                                Maxlevel: item.approvers?.length,
                                // ContentTitle:,
                                MainListID: String(editItemID),
                                RequestId: selectedOption.DocumentCode,
                                // RequestId:String(editID.Id),
                                RequesterNameId: currentUser.Id,
                                RequestedDate: new Date().toLocaleDateString("en-CA"),
                                RequesterRoleId: RequesterRoleId,
                                ProcessName: "Document Cancellation",
                                FormNameId: FormNameId,
                                ApprovalType: "Approval",
                                IsApprovalGenerated:"No"
                                // RedirectionLink:,



                            }
                            if(item.id){
                                const postResult2 = await UpdateAllProcessItem(arr2, sp,item.id);
                                const postId2 = postResult2?.data?.ID;

                            }
                            else{
                            const postResult2 = await addAllProcessItem(arr2, sp);
                            const postId2 = postResult2?.data?.ID;
                            }

                        }

                        let arr2 = {
                            // ActionTakenById: currentUser.Id,
                            SubmiitedDate: new Date().toLocaleDateString("en-CA"),
                            // ActionTakenRoleId: formData.RequesterDesignation,
                            Status: status === "Rework" ? "Rework" : "Rejected",
                            IsRework: status === "Rework" ? "Yes" : "No",
                            OESSubmitStatus: "No",
                            InitiatorSubmitStatus: "No",
                            SubmitStatus: "No",


                        }
                        const postResult2 = await updateItem(arr2, sp, editItemID);
                        const postId2 = postResult2?.data?.ID;

                         // //////// if approver row deleted

                         const toDelete = forwardToArrEdit.filter(
                            (itemEdit) => !forwardToArr.some(item => item.id === itemEdit.id) // Assuming ID is the unique key
                        );

                        // Delete each item from SharePoint
                        for (const item of toDelete) {
                            try {
                                await sp.web.lists.getByTitle("AllProcessApprovalLevelList").items.getById(item.id).delete();
                                // console.log(`Deleted item with ID: ${item.ID}`);
                            } catch (error) {
                                console.error(`Error deleting item with ID: ${item.id}`, error);
                            }
                        }

                        setLoading(false);
                        Swal.fire(successMessage, '', 'success');
                        sessionStorage.removeItem("DocumentCancelId")
                        setTimeout(() => {
                            window.location.href = `${siteUrl}/SitePages/MyTasks.aspx`;
                        }, 1000);
                        // }
                    }

                })
            }
        }


    }


    const ForwardInitiatorApproval = async (status: string) => {
        // let valid = true;
        let actionMessage = "";
        let successMessage = "";
        switch (status) {
            case "Approved":
                actionMessage = "Do you want to submit this request?";
                successMessage = "Submitted successfully.";
                break;
            case "Save as draft":
                actionMessage = "Do you want to save this request?";
                successMessage = "Saved successfully.";
                break;
            // case "Rework":
            //     actionMessage = "Do you want to send this request for rework?";
            //     successMessage = "Request sent for rework successfully.";
            //     break;
        }


        if (status == "Approved") {
            if (await validateForm(FormSubmissionMode.SUBMIT)) {

                //   if (valid) {
                Swal.fire({
                    title: actionMessage,
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText: "Yes",
                    cancelButtonText: "No",
                    icon: 'warning'
                }
                ).then(async (result) => {
                    console.log(result)
                    if (result.isConfirmed) {
                        setLoading(true);

                        // let TypeMasterData: any = await getAnnouncementandNewsTypeMaster(sp, Number(formData.Type))
                        // //////////////Update Process Approval List when Submitted
                        let arr = {
                            ActionTakenById: currentUser.Id,
                            ActionTakenOn: new Date().toLocaleDateString("en-CA"),
                            // ActionTakenRoleId: formData.RequesterDesignation,
                            Status: "Approved",
                            // Remark: remark,

                        }
                        const postResult = await updateApprovalItem(arr, sp, editID.Id);
                        const postId = postResult?.data?.ID;

                        // //////////////Update Document cancellation List when Submitted
                        let arr3 = {
                            Title: formData.RequesterName,
                            RequesterNameId: formData.RequesterNameId,
                            RequesterDesignation: formData.RequesterDesignation,
                            Department: formData.Department,
                            RequestDate: formData.RequestDate,
                            IssueDate: formData.IssueDate,
                            LocationId: selectedOption.LocationId,
                            CustodianId: selectedOption.CustodianId,
                            SerialNumber: selectedOption.SerialNumber,
                            IssueNumber: selectedOption.IssueNumber,
                            RevisionNumber: selectedOption.RevisionNumber,
                            RevisionDate: selectedOption.RevisionDate,
                            DocumentCode: selectedOption.value,
                            ReferenceNumber: selectedOption.ReferenceNumber,
                            AmendmentTypeId: selectedOption.AmendmentTypeId,
                            RequestTypeId :RequestTypeId,
                            ClassificationId: selectedOption.ClassificationId,
                            ChangeRequestTypeId: selectedOption.ChangeRequestTypeId?selectedOption.ChangeRequestTypeId:[],
                            SubmiitedDate: selectedOption.SubmiitedDate,
                            SubmitStatus: "Yes",
                            Status: "Pending",
                            // DocumentName: "",
                            // IsRework: false,
                            // DigitalSignStatus: false,
                            ChangeRequestIDId: formData.ChangeRequestID,
                            DocumentTypeId: selectedOption.DocumentTypeId,
                            OESSubmitStatus: "No",
                            InitiatorSubmitStatus: "Yes",
                            CurrentUserRole: "OES",
                            AttachmentId: selectedOption.AttachmentId,
                            AttachmentJson: selectedOption.AttachmentJson


                        }
                        const postResult3 = await updateItem(arr3, sp, editItemID);
                        const postId3 = postResult?.data?.ID;


                        // //////////////Update Document cancellation Reason List when Submitted

                        for (const row of cancellReason) {

                            const postPayload2 = {
                                ChangeRequestDCIDId: editItemID, // Assuming "Title" column exists
                                ChangeDescription: row.description,
                                ReasonforChange: row.reason,
                            }

                            if (!row.id) {

                                const postResult2 = await addItem2(postPayload2, sp);
                                const postId2 = postResult2?.data?.ID;
                                // debugger
                                if (!postId2) {
                                    console.error("Post creation failed.");
                                    return;
                                }

                            }
                            else if (row.id > 0) {
                                const postResult2 = await updateItem2(postPayload2, sp, row.id);
                                const postId2 = postResult2?.data?.ID;
                            }

                        }

                        const toDelete = cancellReasonEdit.filter(
                            (itemEdit) => !cancellReason.some(item => item.id === itemEdit.id) // Assuming ID is the unique key
                        );

                        // Delete each item from SharePoint
                        for (const item of toDelete) {
                            try {
                                await sp.web.lists.getByTitle("ChangeRequestReasonDocumentCancellationList").items.getById(item.id).delete();
                                // console.log(`Deleted item with ID: ${item.ID}`);
                            } catch (error) {
                                console.error(`Error deleting item with ID: ${item.id}`, error);
                            }
                        }

                        setLoading(false);
                        Swal.fire(successMessage, '', 'success');
                        sessionStorage.removeItem("DocumentCancelId")
                        setTimeout(() => {
                            window.location.href = `${siteUrl}/SitePages/MyTasks.aspx`;
                        }, 1000);

                    }

                })



            }
        }
        else if (status == "Save as draft") {

            if (await validateForm(FormSubmissionMode.DRAFT)) {
                Swal.fire({
                    title: actionMessage,
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText: "Yes",
                    cancelButtonText: "No",
                    icon: 'warning'
                }
                ).then(async (result) => {
                    console.log(result)
                    if (result.isConfirmed) {
                        setLoading(true);

                        // let TypeMasterData: any = await getAnnouncementandNewsTypeMaster(sp, Number(formData.Type))
                        let arr = {
                            ActionTakenById: currentUser.Id,
                            ActionTakenOn: new Date().toLocaleDateString("en-CA"),
                            // ActionTakenRoleId: formData.RequesterDesignation,
                            Status: status,
                            // Remark: remark,

                        }
                        const postResult = await updateApprovalItem(arr, sp, editID.Id);
                        const postId = postResult?.data?.ID;

                        // //////////////Update Document cancellation List when Submitted
                        let arr3 = {
                            Title: formData.RequesterName,
                            RequesterNameId: formData.RequesterNameId,
                            RequesterDesignation: formData.RequesterDesignation,
                            Department: formData.Department,
                            RequestDate: formData.RequestDate,
                            IssueDate: formData.IssueDate,
                            LocationId: selectedOption.LocationId,
                            CustodianId: selectedOption.CustodianId,
                            SerialNumber: selectedOption.SerialNumber,
                            IssueNumber: selectedOption.IssueNumber,
                            RevisionNumber: selectedOption.RevisionNumber,
                            RevisionDate: selectedOption.RevisionDate,
                            DocumentCode: selectedOption.value,
                            ReferenceNumber: selectedOption.ReferenceNumber,
                            AmendmentTypeId: selectedOption.AmendmentTypeId,
                            RequestTypeId :RequestTypeId,
                            ClassificationId: selectedOption.ClassificationId,
                            ChangeRequestTypeId: selectedOption.ChangeRequestTypeId?selectedOption.ChangeRequestTypeId:[],
                            SubmiitedDate: selectedOption.SubmiitedDate,
                            SubmitStatus: "No",
                            Status: "Save as draft",
                            // DocumentName: "",
                            // IsRework: false,
                            // DigitalSignStatus: false,
                            ChangeRequestIDId: formData.ChangeRequestID,
                            DocumentTypeId: selectedOption.DocumentTypeId,
                            OESSubmitStatus: "No",
                            InitiatorSubmitStatus: "No",
                            CurrentUserRole: "OES",
                            AttachmentId: selectedOption.AttachmentId,
                            AttachmentJson: selectedOption.AttachmentJson


                        }
                        const postResult3 = await updateItem(arr3, sp, editItemID);
                        const postId3 = postResult?.data?.ID;


                        // //////////////Update Document cancellation Reason List when Submitted

                        for (const row of cancellReason) {

                            const postPayload2 = {
                                ChangeRequestDCIDId: editItemID, // Assuming "Title" column exists
                                ChangeDescription: row.description,
                                ReasonforChange: row.reason,
                            }

                            if (!row.id) {

                                const postResult2 = await addItem2(postPayload2, sp);
                                const postId2 = postResult2?.data?.ID;
                                // debugger
                                if (!postId2) {
                                    console.error("Post creation failed.");
                                    return;
                                }

                            }
                            else if (row.id > 0) {
                                const postResult2 = await updateItem2(postPayload2, sp, row.id);
                                const postId2 = postResult2?.data?.ID;
                            }

                        }

                        const toDelete = cancellReasonEdit.filter(
                            (itemEdit) => !cancellReason.some(item => item.id === itemEdit.id) // Assuming ID is the unique key
                        );

                        // Delete each item from SharePoint
                        for (const item of toDelete) {
                            try {
                                await sp.web.lists.getByTitle("ChangeRequestReasonDocumentCancellationList").items.getById(item.id).delete();
                                // console.log(`Deleted item with ID: ${item.ID}`);
                            } catch (error) {
                                console.error(`Error deleting item with ID: ${item.id}`, error);
                            }
                        }


                        setLoading(false);
                        Swal.fire(successMessage, '', 'success');
                        sessionStorage.removeItem("DocumentCancelId")
                        setTimeout(() => {
                            window.location.href = `${siteUrl}/SitePages/MyTasks.aspx`;
                        }, 1000);
                        // }
                    }

                })
            }

        }


    }


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

                                            <div className="mail-list mt-0">
                                                <a href="dossier-list.html"
                                                    style={{ background: "#fff !important" }}
                                                    className="list-group-item border-0  mb-0 bg-soft-secondary rounded-pill">
                                                    <img src={require("../assets/list.png")} className='sidebariconsmall'></img>My Request
                                                </a>
                                                <a href="favourite-folder.html"
                                                    style={{ background: "#f7fbfc !important" }}
                                                    className="list-group-item mb-0 border-0 rounded-pill">
                                                    <img src={require("../assets/star.png")} className='sidebariconsmall'></img>My Favourite
                                                </a>
                                                <a href="my-folder.html"
                                                    style={{ background: "#f7fbfc !important" }}
                                                    className="list-group-item mb-0 border-0 rounded-pill">
                                                    <img src={require("../assets/foldericon.png")} className='sidebariconsmall'></img>My Folder
                                                </a>
                                                <a href="share-with-other.html"
                                                    style={{ background: "#f7fbfc !important" }}
                                                    className="list-group-item border-0 mb-0 rounded-pill">
                                                    <img src={require("../assets/share.png")} className='sidebariconsmall'></img>Share with Other
                                                </a>
                                                <a href="share-with-me.html"
                                                    style={{ background: "#f7fbfc !important" }}
                                                    className="list-group-item border-0 mb-0 rounded-pill">
                                                    <img src={require("../assets/nodes.png")} className='sidebariconsmall'></img>Share with me
                                                </a>
                                            </div>



                                            <div style={{clear:'both',float:'left', width:'100%'}} className="mt-3 border-top pt-1">
                                                <button type="button" className="accordion4">
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
                                                  
                                                    <h4 className="header-title text-dark font-16 mb-3">Requested By</h4>
                                                    {/* <p className="sub-header">
                                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur, itaque.
                                                    </p> */}
                                                    {Loading ?
                                                        // <div className="loadercss" role="status">Loading...
                                                        //   <img src={require('../../../Assets/ExtraImage/loader.gif')} style={{ height: '80px', width: '70px' }} alt="Check" />
                                                        // </div>
                                                        <div style={{ minHeight: '100vh', marginTop: '100px' }} className="loadernewadd mt-10">
                                                            <div>
                                                                <img
                                                                    src={require("../../../CustomAsset/edc-gif.gif")}
                                                                    className="alignrightl"
                                                                    alt="Loading..."
                                                                />
                                                            </div>
                                                            <span>Loading </span>{" "}
                                                            <span>
                                                                <img
                                                                    src={require("../../../CustomAsset/edcnew.gif")}
                                                                    className="alignrightl"
                                                                    alt="Loading..."
                                                                />
                                                            </span>
                                                        </div>
                                                        :
                                                        <div className="row">
                                                            <div className="col-lg-4">


                                                                <div className="mb-3">
                                                                    <label htmlFor="RequesterName" className="form-label">Name:</label>
                                                                    <input type="text" id="Name" name="RequesterName" className="form-control" value={formData.RequesterName} disabled={true} />
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-4">


                                                                <div className="mb-3">
                                                                    <label htmlFor="RequesterDesignation" className="form-label">Designation:</label>
                                                                    <input type="text" id="RequesterDesignation" name="RequesterDesignation" className="form-control" value={formData.RequesterDesignation} disabled={true} />
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-4">

                                                                <div className="mb-3">
                                                                    <label htmlFor="RequestDate" className="form-label">Request Date:</label>
                                                                    <input type="text" id="RequestDate" name="RequestDate" className="form-control" value={formData.RequestDateNew} onChange={(e) => setFormData({ ...formData, RequestDate: e.target.value })} disabled={true} />

                                                                    {/* <input type="date" id="RequestDate" name="RequestDate" className="form-control" value={formData.RequestDate} onChange={(e) => setFormData({ ...formData, RequestDate: e.target.value })} disabled={InputDisabled} /> */}
                                                                </div>
                                                            </div>


                                                            <div className="col-lg-4">

                                                                <div className="mb-3">
                                                                    <label htmlFor="DocumentCode" className="form-label">Document Code <span className="text-danger">*</span></label>
                                                                    {/* <input type="text" id="example-email" name="example-email" className="form-control" placeholder="Search Document Code" value={formData.DocumentCode} /> */}
                                                                    <Select
                                                                        options={rows}
                                                                        value={selectedOption}
                                                                        name="DocumentCode"
                                                                        className={`newse ${(!ValidDraft) ? "border-on-error" : ""} ${(!ValidSubmit) ? "border-on-error" : ""}`}
                                                                        onChange={(selectedOption: any) => onSelect(selectedOption)}
                                                                        placeholder="Search Document Code" isDisabled={InputDisabled}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-4">

                                                                <div className="mb-3">
                                                                    <label htmlFor="example-email" className="form-label">Issue No:</label>
                                                                    <input disabled type="text" id="example-email" name="example-email" className="form-control" placeholder="" value={formData.IssueNumber} />
                                                                </div>
                                                            </div>

                                                            <div className="col-lg-4">

                                                                <div className="mb-3">
                                                                    <label htmlFor="example-email" className="form-label">Revision No:</label>
                                                                    <input disabled type="text" id="example-email" name="example-email" className="form-control" placeholder="" value={formData.RevisionNumber} />
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-4">

                                                                <div className="mb-3">
                                                                    <label htmlFor="example-email" className="form-label">Reference No:</label>
                                                                    <input disabled type="text" id="example-email" name="example-email" className="form-control" placeholder="" value={formData.ReferenceNumber} />
                                                                </div>
                                                            </div>

                                                            {/* <div className="col-lg-8">

                                                            <div className="mb-3">
                                                                <label htmlFor="example-email" className="form-label">Document Link:</label>


                                                                    <div className="text-dark mt-0"> <span onClick={() => OpenFile(DocumentLink)} style={{ color: "blue", cursor: "pointer" }}>{DocumentLink ? `${Tenant_URL}${DocumentLink?.FileRef}` : ""}</span>
                                                                    </div>

                                                                </div>
                                                            </div> */}

                                                            <div className="col-lg-4">
                                                                <div className="mb-3">

                                                                    <div className='d-flex justify-content-between'>
                                                                        <div>
                                                                            <label htmlFor="bannerImage" className="form-label">
                                                                                Documents Attached
                                                                            </label>
                                                                        </div>
                                                                        <div>
                                                                            <div>
                                                                                {DocumentLink != null ?
                                                                                    (<a style={{ fontSize: '0.875rem' }} onClick={() => setShowModal(true)}>
                                                                                        <FontAwesomeIcon icon={faPaperclip} />1 file Attached
                                                                                    </a>) : ""

                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <input
                                                                        type="file"

                                                                        id="bannerImage"
                                                                        name="bannerImage"
                                                                        accept=".jpeg,.jpg,.png,.gif"
                                                                        // className={`form-control  ${(!ValidSubmit) ? "border-on-error" : ""}`}
                                                                        className="form-control inputcss"
                                                                        // onChange={(e) => onFileChange(e, "bannerimg", "Document")}
                                                                        // disabled={ApprovalMode}
                                                                        disabled={true}

                                                                    />
                                                                </div>
                                                            </div>






                                                        </div>
                                                    }
                                                </div>


                                            </div>






                                            <div className="card">
                                                <div className="card-body">
                                                  <div className='row'>
                                                    <div className='col-sm-8'>
                                                    <h4 className="header-title text-dark font-16 mb-3">Description</h4>

                                                    </div>

                                                    <div className='col-sm-4'>
                                                    <div style={{ textAlign: "right"}} className="mt-2 float-end text-right">
                                                            {/* <i style={{ cursor: "pointer" }} onClick={addField}  className="fe-plus-circle  font-20 text-warning"></i> */}
                                                            {/* <i style={{ cursor: "pointer" }} className="fe-plus-circle  font-20 text-warning"></i> */}
                                                           {!InputDisabled && <img style={{width:'30px', cursor:'pointer', marginTop:'-7px'}} src={require("../assets/plus.png")} onClick={addCancelReason} className=''></img>}


                                                        </div>
                                                    </div>
                                                  </div>

                                                    {/* <p className="sub-header">
                                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s
                                                    </p> */}

                                                    <div className="row">
                                                        <table className="mtbalenew table-centered table-nowrap table-borderless mb-0" id="tbl">
                                                            <thead>
                                                                <tr>
                                                                    <th style={{ minWidth: "30px", maxWidth: "30px" }}>S.No</th>
                                                                    <th>Description</th>
                                                                    <th>Reason for Cancellation</th>
                                                                    {(modeValue === "" || modeValue === "edit" || InputDisabled != true) && <th style={{ minWidth: "50px", maxWidth: "50px" }}>Action</th>}
                                                                </tr>

                                                            </thead>
                                                            <tbody >
                                                                {cancellReason.map((row, index) => (
                                                                    <tr key={index}> <td style={{ minWidth: "30px", maxWidth: "30px" }}>
                                                                        <div
                                                                            style={{ marginLeft: "20px" }}
                                                                            className="indexdesign"
                                                                        >
                                                                            {index + 1}</div></td>
                                                                        <td>
                                                                            <textarea id="simpleinput" disabled={InputDisabled}
                                                                                // className="form-control"                                                                      
                                                                                className={`newse ${(!ValidDraft) ? "border-on-error" : ""} ${(!ValidSubmit) ? "border-on-error" : ""}`}

                                                                                value={row.description}
                                                                                onChange={(e) => {
                                                                                    const newRowscancellReason = [...cancellReason];
                                                                                    newRowscancellReason[index].description = e.target.value;
                                                                                    setcancellReason(newRowscancellReason);
                                                                                }}>

                                                                            </textarea>
                                                                            {/* <input type="text"
                                                                        /> */}

                                                                        </td>
                                                                        <td>
                                                                            <textarea id="simpleinput" disabled={InputDisabled}
                                                                                //  className="form-control"
                                                                                className={`newse ${(!ValidDraft) ? "border-on-error" : ""} ${(!ValidSubmit) ? "border-on-error" : ""}`}

                                                                                value={row.reason}
                                                                                onChange={(e) => {
                                                                                    const newRowscancellReason = [...cancellReason];
                                                                                    newRowscancellReason[index].reason = e.target.value;
                                                                                    setcancellReason(newRowscancellReason);
                                                                                }}>

                                                                            </textarea>

                                                                            {/* <input type="text"
                                                                        /> */}
                                                                        </td>
                                                                        {(modeValue === "" || modeValue === "edit" || InputDisabled != true) && <td style={{ minWidth: "50px", maxWidth: "50px", textAlign:'center' }}>
                                                                            <img src={require("../../../CustomAsset/del.png")} style={{ width: '30px', cursor: 'pointer', marginTop: '-7px' }} onClick={() => deleteLocalFile(index, cancellReason)}></img>

                                                                            {/* <img src={require("../../../CustomAsset/del.png")} className='sidebariconsmall' style={{ width: '30px', cursor: 'pointer', marginTop: '-7px' }} onClick={() => deleteLocalFile(index, cancellReason)}></img> */}
                                                                        </td>
                                                                        }
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    

                                                    </div>


                                                </div>


                                            </div>
                                            {/* /////////////////%%%%%%%%%%%%%%%%%%%%%%%% */}

                                            {/* {modeValue === "approve" && editID != null && editID.ApprovalType === "Assignment" && editID.Status === "Pending" && editID.CurrentUserRole === "OES" && */}
                                            {modeValue === "approve" && editID != null && editID.Status === "Pending" && editID.CurrentUserRole !== "Initiator" &&

                                                <div className="card">
                                                    <div className="card-body">
                                                        <div className='row'>
                                                            <div className='col-sm-8'>
                                                            <h4 className="header-title text-dark font-16 mb-3 ">Forward Approval To</h4>

                                                                </div>
                                                                <div className='col-sm-4'>
                                                                <div className="mt-0 mb-0 float-end text-right" style={{ textAlign: "right", paddingRight: "22px" }}>
                                                                {editID.CurrentUserRole === "OES" && <img style={{ width: '34px' }} src={require("../assets/plus.png")} onClick={handleAddRow} className='' />}

                                                            {/* <i style={{ cursor: "pointer" }} onClick={handleAddRow} className="fe-plus-circle font-20 text-warning"></i> */}
                                                        </div>
                                                        </div>

                                                            </div>
                                                        
                                                        <div style={{overflow:'inherit'}} className="table-responsive mt-3 pt-0">
                                                            <table  className="mtbalenew  table-centered table-nowrap table-borderless mb-0 newtabledc" id="myTabl">
                                                                <thead >
                                                                    <tr>
                                                                        <th style={{ borderBottomLeftRadius: "0px" }}>Role</th>
                                                                        <th style={{ minWidth: '70px', maxWidth: '70px' }} >Level</th>
                                                                        <th >Approver Name</th>
                                                                        <th style={{ minWidth: '70px', maxWidth: '70px'}}>Action</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody style={{ maxHeight: "8007px" }}>
                                                                    {forwardToArr.map((row, index) => (
                                                                        <tr>
                                                                            <td className="ng-binding">
                                                                                <select
                                                                                    // className="form-select"
                                                                                    className={`form-select newse ${(!ValidDraft) ? "border-on-error" : ""} ${(!ValidSubmit) ? "border-on-error" : ""}`}

                                                                                    onChange={(e) => onSelectRole(e, row.level)} value={row.role} disabled={editID.CurrentUserRole !== "OES"}>

                                                                                    <option value="" selected>Select Role</option>
                                                                                    {/* {UserRoles.map((role: any, index: number) => (
                                                                                    <option key={index} value={role.value}>{role.label}</option>
                                                                                ))} */}
                                                                                    {UserRoles.filter((role: any) =>
                                                                                        !forwardToArr.some((r) => r.role === role.value && r.level !== row.level) || role.value === row.role // Allow the current row's role
                                                                                    ).map((role: any, idx: number) => (
                                                                                        <option key={idx} value={role.value}>{role.label}</option>
                                                                                    ))}
                                                                                </select>

                                                                            </td>
                                                                            <td style={{ minWidth: '70px', maxWidth: '70px' }}>Level {index + 1}</td>
                                                                            <td >

                                                                                <Select
                                                                                    options={rows1}
                                                                                    isMulti
                                                                                    value={row.approvers}
                                                                                    name="Approvers"
                                                                                    className={`newse ${(!ValidDraft) ? "border-on-error" : ""} ${(!ValidSubmit) ? "border-on-error" : ""}`}
                                                                                    // onChange={(selectedOption: any) => onSelect(selectedOption)}
                                                                                    onChange={(selectedOptions: any) => onSelectApprovers(selectedOptions, row.level)}
                                                                                    placeholder="Enter Approver Name"
                                                                                    isDisabled={editID.CurrentUserRole !== "OES"}
                                                                                />



                                                                            </td>
                                                                            <td style={{ minWidth: '70px', maxWidth: '70px' }}>
                                                                                {/* <i className="fe-trash-2 text-danger"></i> */}
                                                                                {editID.CurrentUserRole === "OES"? <img src={require("../../../CustomAsset/del.png")} onClick={() => handleDeleteRow(index)} />:
                                                                                <img src={require("../assets/recycle-bin.png")}  className='sidebariconsmall' />}

                                                                            </td>
                                                                        </tr>

                                                                    ))}
                                                                   

                                                                </tbody>
                                                            </table>
                                                        </div>

                                                       

                                                       {editID.CurrentUserRole === "OES" && <div className="row mt-3">
                                                            <div className="col-12 text-center">
                                                                {/* <a href="my-approval.html"> */}
                                                                <button type="button" className="btn btn-primary waves-effect waves-light m-1" onClick={() => ForwardApproval("Forward")} >
                                                                    <i className="fe-check-circle me-1"></i> Forward
                                                                </button>
                                                                {/* </a> */}
                                                                {/* <a href="#"> */}
                                                                <button type="button" className="btn btn-warning waves-effect waves-light m-1" onClick={() => ForwardApproval("Rework")} >
                                                                    <i className="fe-corner-up-left me-1"></i> Rework
                                                                </button>
                                                                {/* </a> */}
                                                                {/* <a href="#"> */}
                                                                <button type="button" className="btn btn-danger waves-effect waves-light m-1" onClick={() => ForwardApproval("Rejected")} >
                                                                    <i className="fe-x me-1"></i> Reject
                                                                </button>
                                                                {/* </a> */}
                                                                {/* <a href="my-approval.html"> */}
                                                                <button type="button" className="btn cancel-btn waves-effect waves-light m-1" onClick={handleCancel}>
                                                                    <i className="fe-x me-1"></i> Cancel
                                                                </button>
                                                                {/* </a> */}
                                                            </div>
                                                        </div>
                                                         }
                                                    </div>
                                                </div>
                                            }

                                            {/* {modeValue === "approve" && editID != null && editID.ApprovalType === "Assignment" && editID.Status === "Pending" && editID.CurrentUserRole === "OES" && (
                                                <div className="card">
                                                    <div className="card-body">
                                                        <h4 className="header-title mb-0">Remarks</h4>
                                                        <textarea
                                                            className="form-control"
                                                            value={remark}
                                                            onChange={(e) => setRemark(e.target.value)}
                                                            placeholder="Enter your remarks here..."
                                                        ></textarea>
                                                    </div>
                                                </div>
                                            )} */}

                                            {/* ////////////Approval card */}

                                            {
                                                //let forrework=ApprovalRequestItem && ApprovalRequestItem.IsRework=='Yes'&& ApprovalRequestItem.LevelSequence!=0;
                                                // (InputDisabled && ApprovalRequestItem) || (ApprovalRequestItem && ApprovalRequestItem.IsRework == 'Yes' && ApprovalRequestItem.LevelSequence != 0) ? (
                                                (InputDisabled && editID != null && modeValue === "approve" && editID.ApprovalType === "Approval" && editID.Status === "Pending") ? (
                                                    <WorkflowAction currentItem={editID} ctx={props.context} ContentType={CONTENTTYPE_DocumentCancel}
                                                        DisableApproval={false} DisableCancel={false}
                                                    // DisableApproval={ApprovalRequestItem && ApprovalRequestItem.IsRework == 'Yes' && ApprovalRequestItem.LevelSequence != 0}
                                                    // DisableCancel={ApprovalRequestItem && ApprovalRequestItem.IsRework == 'Yes' && ApprovalRequestItem.LevelSequence != 0}
                                                    //DisableReject={ApprovalRequestItem && ApprovalRequestItem.IsRework=='Yes'&& ApprovalRequestItem.LevelSequence!=0}
                                                    />
                                                ) : (<div></div>)
                                            }

                                            {/* ////////////Audit History card */}
                                            {editID !== null && editID.length != 0 && modeValue === "approve" &&
                                                <WorkflowAuditHistory ContentItemId={editID} ContentType={CONTENTTYPE_DocumentCancel} ctx={props.context} />
                                            }
                                            {/* ////////////Audit History card */}

                                            {/* ////////////Approval card */}


                                            {/* </div> */}
                                            {/* /////////////////%%%%%%%%%%%%%%%%%%%%%%%% */}

                                            <div className="row mt-3">
                                            <div className="col-12 text-center">
                                                {/* <a href="my-approval.html">   */}
                                                {/* {(((InputDisabled != true && editItemID == null && MainEditItem == null) || (MainEditItem?.Status === "Save as draft" || MainEditItem?.Status === "Rework")) || (editID != null && editID.Level === 0 && editID.CurrentUserRole == "OES" && editID.IsInitiator == "No")) && <button type="button" className="btn btn-primary waves-effect waves-light m-1" onClick={handleSaveAsDraft}><i className="fe-check-circle me-1"></i> Save As Draft</button>}

                                                {(((InputDisabled != true && editItemID == null && MainEditItem == null) || (MainEditItem?.Status === "Save as draft" || MainEditItem?.Status === "Rework")) || (editID != null && editID.Level === 0 && editID.CurrentUserRole == "OES" && editID.IsInitiator == "No")) && <button type="button" className="btn btn-primary waves-effect waves-light m-1" onClick={handleFormSubmit}><i className="fe-check-circle me-1"></i> Submit</button>}
                                                */}

                                                {(((InputDisabled != true && editItemID == null && MainEditItem == null) || (MainEditItem?.Status === "Save as draft" && editID == null && (modeValue === ""||modeValue === "edit"))) || (editID && editID != null && editID.ApprovalType !== "Approval" && editID.ApprovalType !== "Assignment")) && <button type="button" className="btn btn-primary waves-effect waves-light m-1" onClick={handleSaveAsDraft}>  <img src={require('../../../Assets/ExtraImage/checkcircle.svg')} style={{ width: '1rem' }} className='me-1' alt="Check" /> Save As Draft</button>}

                                                {(((InputDisabled != true && editItemID == null && MainEditItem == null) || (MainEditItem?.Status === "Save as draft" && editID == null && (modeValue === ""||modeValue === "edit")))|| (editID && editID != null && editID.ApprovalType !== "Approval" && editID.ApprovalType !== "Assignment")) && <button type="button" className="btn btn-primary waves-effect waves-light m-1" onClick={handleFormSubmit}><img src={require('../../../Assets/ExtraImage/checkcircle.svg')} style={{ width: '1rem' }} className='me-1' alt="Check" /> Submit</button>}

                                                {((editID?.Status === "Pending" || editID?.Status === "Save as draft") && (editID.Level === 0 && editID.CurrentUserRole !== "OES" && editID.IsInitiator == "Yes")) && (modeValue === "approve") && <button type="button" className="btn btn-primary waves-effect waves-light m-1" onClick={() => ForwardInitiatorApproval("Save as draft")}>  <img src={require('../../../Assets/ExtraImage/checkcircle.svg')} style={{ width: '1rem' }} className='me-1' alt="Check" /> Save As Draft</button>}

                                                {((editID?.Status === "Pending" || editID?.Status === "Save as draft") && (editID.Level === 0 && editID.CurrentUserRole !== "OES" && editID.IsInitiator == "Yes")) && (modeValue === "approve") && <button type="button" className="btn btn-primary waves-effect waves-light m-1" onClick={() => ForwardInitiatorApproval("Approved")}><img src={require('../../../Assets/ExtraImage/checkcircle.svg')} style={{ width: '1rem' }} className='me-1' alt="Check" /> Submit</button>}


                                                    {/* </a> */}
                                                    {/* <a href="../sites/edcspfx/SitePages/EDCMAIN.aspx">       */}
                                                    {((modeValue === "" || modeValue === "edit") ||(editID !== null && editID.IsInitiator == "Yes")) &&
                                                        <button type="button" className="btn cancel-btn waves-effect waves-light m-1" onClick={handleCancel}> <img src={require('../../../Assets/ExtraImage/xIcon.svg')} style={{ width: '1rem' }}
                                                        className='me-1' alt="x" /> Cancel</button>
                                                    }
                                                    {/* </a> */}
                                                </div>
                                            </div>

                                            {/* /////////// */}

                                            <Modal show={showModal} onHide={() => setShowModal(false)} size='lg'  className='filemodal'>
                                                <Modal.Header closeButton>
                                                    <Modal.Title> Documents</Modal.Title>

                                                </Modal.Header>
                                                <Modal.Body className="" id="style-5">

                                                    {DocumentLink &&
                                                        (
                                                            <>
                                                                <table className="mtbalenew">
                                                                    <thead style={{ background: '#eef6f7' }}>
                                                                        <tr>
                                                                            <th style={{minWidth:'50px', maxWidth:'50px'}}>Serial No.</th>
                                                                            <th>File Name</th>
                                                                            {/* <th>File Size</th> */}
                                                                            {/* <th className='text-center'>Action</th> */}
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {DocumentLink != null && (
                                                                            <tr>
                                                                                <td style={{minWidth:'50px', maxWidth:'50px'}} className='text-center'>1</td>
                                                                                <td onClick={() => OpenFile(DocumentLink)} style={{ color: "blue", cursor: "pointer" }}>{DocumentLink?.FileLeafRef}</td>
                                                                                {/* <td className='text-right'>{file.fileSize}</td>
                                                                                <td className='text-center'> <img src={require("../../../CustomAsset/trashed.svg")} style={{ width: '15px' }} onClick={() => deleteLocalFile(index, DocumentpostArr1, "docs")} /> </td> */}
                                                                            </tr>
                                                                        )}
                                                                    </tbody>
                                                                </table></>
                                                        )
                                                    }

                                                </Modal.Body>

                                            </Modal>

                                            {/* ///////////////// */}

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
