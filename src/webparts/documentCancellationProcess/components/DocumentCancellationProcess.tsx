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
import { addItem, addItem2, getAllDocumentCode, getItemByID, getItemByID2, updateItem, updateItem2 } from '../../../APISearvice/DocumentCancellation';
import Select from "react-select";
import Swal from 'sweetalert2';
import { FormSubmissionMode } from '../../../Shared/Interfaces';
import { decryptId } from '../../../APISearvice/CryptoService';
import { getUrlParameterValue } from '../../../Shared/Helper';

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
            ChildComponent: "Document Cancellation",
            ChildComponentURl: `${siteUrl}/SitePages/DocumentCancellation.aspx`,
        },
    ];
    const [Loading, setLoading] = React.useState(false);
    const [FormItemId, setFormItemId] = React.useState(null);
    const [editID, setEditID] = React.useState(null);
    const [rows, setRows] = React.useState<any>([]);
    const [currentUser, setCurrentUser] = React.useState(null);
    const [selectedOption, setSelectedOption] = React.useState(null);
    const [ValidDraft, setValidDraft] = React.useState(true);
    const [ValidSubmit, setValidSubmit] = React.useState(true);
    const [editForm, setEditForm] = React.useState(false);
    const [cancellReason, setcancellReason] = React.useState([{ id: 0, description: "", reason: "" }]);
    const [formData, setFormData] = React.useState({
        RequesterNameId: 0,
        RequesterName: "",
        RequesterDesignation: "",
        Department: "",
        RequestDate: "",
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
        Attachment: [],
        AttachmentJson: "",



    });
    const ApiCallFunc = async () => {
        const Currusers: any = await getCurrentUser(sp, siteUrl);
        const userProfile = await sp.profiles.myProperties();

        setFormData(prevData => ({
            ...prevData,
            RequesterNameId: Currusers?.Id || "",
            RequesterDesignation: userProfile?.Title || "",
            RequesterName: userProfile?.DisplayName || "",
            RequestDate: new Date().toLocaleDateString("en-CA")
            // RequestedDate: new Date().toISOString().split("T")[0] // Format as YYYY-MM-DD
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
           
            ClassificationId: item.ClassificationId,
            ChangeRequestTypeId: item.ChangeRequestTypeId,
            SubmiitedDate: item.SubmiitedDate,
            SubmitStatus: item.SubmitStatus,
            DocumentTypeId: item.DocumentTypeId,
            Department:item.Department,
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
          let formitemidparam = getUrlParameterValue('contentid');
          if (formitemidparam) {
            formitemid = Number(formitemidparam);
            setFormItemId(Number(formitemid));
          }
        }
        formitemid =20;
         if (formitemid) {
             
              const setBannerById = await getItemByID(sp, Number(formitemid))
       
              console.log(setBannerById, 'DocumentCancelId');
              setEditID(Number(setBannerById[0].ID))
              if (setBannerById.length > 0) {
                debugger
                setEditForm(true)
                // setCategoryData(await getCategory(sp, Number(setBannerById[0]?.TypeMaster))) // Category
       
                let arr = {
               
               RequesterName: setBannerById[0].RequesterName,
                RequesterNameId: setBannerById[0].RequesterNameId,
                RequesterDesignation: setBannerById[0].RequesterDesignation,
                Department: setBannerById[0].Department,
                RequestDate: setBannerById[0].RequestDate,
                IssueDate: setBannerById[0].IssueDate,
                LocationId: setBannerById[0].LocationId,
                CustodianId: setBannerById[0].CustodianId,
                SerialNumber: setBannerById[0].SerialNumber,
                IssueNumber: setBannerById[0].IssueNumber,
                RevisionNumber: setBannerById[0].RevisionNumber,
                RevisionDate: setBannerById[0].RevisionDate,
                DocumentCode: setBannerById[0].value,
                ReferenceNumber: setBannerById[0].ReferenceNumber,
                AmendmentTypeId: setBannerById[0].AmendmentTypeId,                
                ClassificationId: setBannerById[0].ClassificationId,
                ChangeRequestTypeId:setBannerById[0].ChangeRequestTypeId,
                SubmiitedDate: setBannerById[0].SubmiitedDate,
                SubmitStatus: setBannerById[0].SubmitStatus,
                value: setBannerById[0].DocumentCode,
                label: setBannerById[0].DocumentCode,
                // Status: "Pending",
                // DocumentName: "",
                // IsRework: false,
                // DigitalSignStatus: false,
                ChangeRequestIDId: setBannerById[0].ChangeRequestID,
                DocumentTypeId: setBannerById[0].DocumentTypeId
               
                 
                }

                let arr2 = {
               
                    RequesterName: setBannerById[0].RequesterName,
                    RequesterNameId: setBannerById[0].RequesterNameId,
                    RequesterDesignation: setBannerById[0].RequesterDesignation,
                    Department: setBannerById[0].Department,
                    RequestDate: setBannerById[0].RequestDate,
                    IssueDate: setBannerById[0].IssueDate,
                    LocationId: setBannerById[0].LocationId,
                    CustodianId: setBannerById[0].CustodianId,
                    SerialNumber: setBannerById[0].SerialNumber,
                    IssueNumber: setBannerById[0].IssueNumber,
                    RevisionNumber: setBannerById[0].RevisionNumber,
                    RevisionDate: setBannerById[0].RevisionDate,
                    DocumentCode: setBannerById[0].value,
                    ReferenceNumber: setBannerById[0].ReferenceNumber,
                    AmendmentTypeId: setBannerById[0].AmendmentTypeId,                
                    ClassificationId: setBannerById[0].ClassificationId,
                    ChangeRequestTypeId:setBannerById[0].ChangeRequestTypeId,
                    SubmiitedDate: setBannerById[0].SubmiitedDate,
                    SubmitStatus: setBannerById[0].SubmitStatus,
                    // value: setBannerById[0].DocumentCode,
                    // label: setBannerById[0].DocumentCode,
                    // Status: "Pending",
                    // DocumentName: "",
                    // IsRework: false,
                    // DigitalSignStatus: false,
                    ChangeRequestIDId: setBannerById[0].ChangeRequestIDId,
                    DocumentTypeId: setBannerById[0].DocumentTypeId
                   
                     
                    }

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
                        SubmiitedDate: setBannerById[0].SubmiitedDate,
                        SubmitStatus: setBannerById[0].SubmitStatus,
                        DocumentCode: setBannerById[0].value,
                        DocumentTypeId: setBannerById[0].DocumentTypeId,
                        Department:setBannerById[0].Department,
                       
                        // Format as YYYY-MM-DD
                    }));

                // setFormData(arr2);

                setSelectedOption(arr);

                const rowData: any[] = await getItemByID2(sp, Number(setBannerById[0].ChangeRequestIDId)) //baseUrl
                const initialRows = rowData.map((item: any) => ({
                  id: item.Id,
                  description: item.ChangeDescription,
                  reason: item.ReasonforChange,
                  }));
                 setcancellReason(initialRows);
               
       
                }
               
               
       
              }
            //}
            //#endregion

       
    };

    const onSelect = (selectedList: any) => {
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
            SubmiitedDate: selectedList.SubmiitedDate,
            SubmitStatus: selectedList.SubmitStatus,
            DocumentCode: selectedList.value,
            DocumentTypeId: selectedList.DocumentTypeId,
            Department:selectedList.Department,
           
            // Format as YYYY-MM-DD
        }));
        setSelectedOption(selectedList);  // Set the selected users
    };


    React.useEffect(() => {

        ApiCallFunc();



        // formData.title = currentUser.Title;

    }, [useHide]);

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
            else if (!selectedOption.value) {
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
               else if (IssueNumber =="") {
                //Swal.fire('Error', 'Entity is required!', 'error');
                valid = false;
              }
              else if (RevisionNumber =="") {
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
                            // RequestTypeId: selectedOption.RequestTypeId,
                            ClassificationId: selectedOption.ClassificationId,
                            ChangeRequestTypeId:selectedOption.ChangeRequestTypeId,
                            SubmiitedDate: selectedOption.SubmiitedDate,
                            SubmitStatus: selectedOption.SubmitStatus,
                            Status: "Pending",
                            // DocumentName: "",
                            // IsRework: false,
                            // DigitalSignStatus: false,
                            ChangeRequestIDId: formData.ChangeRequestID,
                            DocumentTypeId: selectedOption.DocumentTypeId


                        }
                         const postResult = await updateItem(arr, sp, editID);
                        const postId = postResult?.data?.ID;


                        for (const row of cancellReason) {

                            const postPayload2 = {
                                ChangeRequestIDId: formData.ChangeRequestID, // Assuming "Title" column exists
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
                                const postResult2 = await updateItem2(arr, sp, row.id);
                                const postId2 = postResult2?.data?.ID;
                            }
                           
                        }
                        // await AddContentMaster(sp, arr)

                        // const boolval = await handleClick(editID, TypeMasterData?.TypeMaster, Number(formData.entity))
                        let boolval = false;

                        // if (boolval == true) {
                        setLoading(false);
                        Swal.fire('Submitted successfully.', '', 'success');
                        sessionStorage.removeItem("DocumentCancelId")
                        setTimeout(() => {
                            window.location.href = `${siteUrl}/SitePages/Dashboard.aspx`;
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
                            //   RequestTypeId: selectedOption.RequestTypeId,
                            ClassificationId: selectedOption.ClassificationId,
                            ChangeRequestTypeId: selectedOption.ChangeRequestTypeId,
                            SubmiitedDate: selectedOption.SubmiitedDate,
                            SubmitStatus: selectedOption.SubmitStatus,
                            Status: "Pending",
                            //   DocumentName: "",
                            //   IsRework: false,
                            //   DigitalSignStatus: false,
                            ChangeRequestIDId: formData.ChangeRequestID,
                            DocumentTypeId: selectedOption.DocumentTypeId


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
                                ChangeRequestIDId: formData.ChangeRequestID, // Assuming "Title" column exists
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


                        let boolval;

                        // if (boolval == true) {
                        setLoading(false);
                        Swal.fire('Submitted successfully.', '', 'success');
                        // sessionStorage.removeItem("bannerId")
                        setTimeout(() => {
                            window.location.href = `${siteUrl}/SitePages/Dashboard.aspx`;
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
                            // RequestTypeId: selectedOption.RequestTypeId,
                            ClassificationId: selectedOption.ClassificationId,
                            ChangeRequestTypeId:selectedOption.ChangeRequestTypeId,
                            SubmiitedDate: selectedOption.SubmiitedDate,
                            SubmitStatus: selectedOption.SubmitStatus,
                            Status: "Save as draft",
                            // DocumentName: "",
                            // IsRework: false,
                            // DigitalSignStatus: false,
                            ChangeRequestIDId: formData.ChangeRequestID,
                            DocumentTypeId: selectedOption.DocumentTypeId


                        }
                         const postResult = await updateItem(arr, sp, editID);
                        const postId = postResult?.data?.ID;


                        for (const row of cancellReason) {

                            const postPayload2 = {
                                ChangeRequestIDId: formData.ChangeRequestID, // Assuming "Title" column exists
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
                        let boolval = false;

                        // if (boolval == true) {
                            setLoading(false);
                            Swal.fire('Saved successfully.', '', 'success');
                            sessionStorage.removeItem("DocumentCancelId")
                            setTimeout(() => {
                                window.location.href = `${siteUrl}/SitePages/Dashboard.aspx`;
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
                            //   RequestTypeId: selectedOption.RequestTypeId,
                            ClassificationId: selectedOption.ClassificationId,
                            ChangeRequestTypeId: selectedOption.ChangeRequestTypeId,
                            SubmiitedDate: selectedOption.SubmiitedDate,
                            SubmitStatus: selectedOption.SubmitStatus,
                            Status: "Save as draft",
                            //   DocumentName: "",
                            //   IsRework: false,
                            //   DigitalSignStatus: false,
                            ChangeRequestIDId: formData.ChangeRequestID,
                            DocumentTypeId: selectedOption.DocumentTypeId


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
                                ChangeRequestIDId: formData.ChangeRequestID, // Assuming "Title" column exists
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
                            window.location.href = `${siteUrl}/SitePages/Dashboard.aspx`;
                        }, 1000);
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
                                                                    <input type="date" id="RequestDate" name="RequestDate" className="form-control" value={formData.RequestDate} onChange={(e) => setFormData({ ...formData, RequestDate: e.target.value })} />
                                                                </div>
                                                            </div>


                                                            <div className="col-lg-4">

                                                                <div className="mb-3">
                                                                    <label htmlFor="DocumentCode" className="form-label">Document Code:</label>
                                                                    {/* <input type="text" id="example-email" name="example-email" className="form-control" placeholder="Search Document Code" value={formData.DocumentCode} /> */}
                                                                    <Select
                                                                        options={rows}
                                                                        value={selectedOption}
                                                                        name="DocumentCode"
                                                                        className={`newse ${(!ValidDraft) ? "border-on-error" : ""} ${(!ValidSubmit) ? "border-on-error" : ""}`}
                                                                        onChange={(selectedOption: any) => onSelect(selectedOption)}
                                                                        placeholder="Search Document Code"
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

                                                        <div className="col-lg-8">

                                                            <div className="mb-3">
                                                                <label htmlFor="example-email" className="form-label">Document Link:</label>

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
                                                            <img style={{width:'30px', cursor:'pointer', marginTop:'-7px'}} src={require("../assets/plus.png")} onClick={addCancelReason} className=''></img>


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
                                                                        <td><input type="text" id="simpleinput" className="form-control"
                                                                            value={row.description}
                                                                            onChange={(e) => {
                                                                                const newRowscancellReason = [...cancellReason];
                                                                                newRowscancellReason[index].description = e.target.value;
                                                                                setcancellReason(newRowscancellReason);
                                                                            }}
                                                                        />

                                                                        </td>
                                                                        <td><input type="text" id="simpleinput" className="form-control"
                                                                            value={row.reason}
                                                                            onChange={(e) => {
                                                                                const newRowscancellReason = [...cancellReason];
                                                                                newRowscancellReason[index].reason = e.target.value;
                                                                                setcancellReason(newRowscancellReason);
                                                                            }}
                                                                        /></td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    

                                                    </div>

                                                    <div className="row mt-3">
                                                        <div className="col-12 text-center">
                                                            {/* <a href="my-approval.html">   */}
                                                            <button type="button" className="btn btn-primary waves-effect waves-light m-1" onClick={handleSaveAsDraft}><i className="fe-check-circle me-1"></i> Save As Draft</button>

                                                            <button type="button" className="btn btn-primary waves-effect waves-light m-1" onClick={handleFormSubmit}><i className="fe-check-circle me-1"></i> Submit</button>
                                                            {/* </a> */}
                                                            {/* <a href="my-approval.html">       */}
                                                            <button type="button" className="btn cancel-btn waves-effect waves-light m-1"><i className="fe-x me-1"></i> Cancel</button>
                                                            {/* </a> */}
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
