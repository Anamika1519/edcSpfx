import * as React from 'react';

import type { IChangeDocumentRequestProps } from './IChangeDocumentRequestProps';
import { escape } from '@microsoft/sp-lodash-subset';
// import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

import Provider from '../../../GlobalContext/provider';
import VerticalSideBar from '../../verticalSideBar/components/VerticalSideBar';
import HorizontalNavbar from '../../horizontalNavBar/components/HorizontalNavBar';
import CustomBreadcrumb from '../../../CustomJSComponents/CustomBreadcrumb/CustomBreadcrumb';
import { getSP } from '../../documentCancellationProcess/loc/pnpjsConfig';
import { SPFI } from '@pnp/sp';
import UserContext from "../../../GlobalContext/context";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../CustomCss/mainCustom.scss";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../../verticalSideBar/components/VerticalSidebar.scss";
import "../components/changeDocumentRequest.scss";
import { allowstringonly, getCurrentUser } from '../../../APISearvice/CustomService';
import { addAllProcessItem, addApprovalItem, addItem, addItemChangeRequestReasonlist, addItemChangeRequestList, getAllAmendmentType, getAllClassificationMaster, getAllDocumentCode, getAllProcessData, getAllRequestType, getApprovalByID, getApprovalByID2, getDataRoles, getDocumentLinkByID, getFormNameID, getItemByID, getItemByIDChangeRequest, getItemByIDCR, getListNameID, GetQueryString, getRequesterID, UpdateAllProcessItem, updateApprovalItem, updateItem, updateItemChangeRequestReasonList, updateItemChangeRequestList, getDocumentCodeselected, getDocumentLinkByIDarr } from '../../../APISearvice/DocumentCancellation';
import Select from "react-select";
import Swal from 'sweetalert2';
import { FormSubmissionMode } from '../../../Shared/Interfaces';
import { decryptId } from '../../../APISearvice/CryptoService';
import { getUrlParameterValue } from '../../../Shared/Helper';
import { WorkflowAction } from '../../../CustomJSComponents/WorkflowAction/WorkflowAction';
import { WorkflowAuditHistory } from '../../../CustomJSComponents/WorkflowAuditHistory/WorkflowAuditHistory';
import { CONTENTTYPE_ChangeDocument, CONTENTTYPE_DocumentCancel, LIST_TITLE_ChangeRequest, Tenant_URL } from '../../../Shared/Constants';
import { IPeoplePickerContext, PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faPaperclip } from '@fortawesome/free-solid-svg-icons';
import { uploadFile } from '../../../APISearvice/MediaService';
import { Modal } from 'react-bootstrap';
import { Link } from '@fluentui/react';
import moment from 'moment';
let newfileupload: any
let newfilepreview: any
interface ForwardTo {
  id: number;
  role: number;
  level: number;
  approvers: any[]; // Or a more specific type like `string[]` or `SPUser[]`
}
interface ChangeRequestCheckbox {
  id: number;
  name: string;
  isActive: boolean;
}
interface Location {
  locationId: number; // ID for Location lookup
  locationName: string;
  locationCode: string;
}
interface Custodian {
  custodianId: number; // ID for Custodian lookup
  custodianName: string;
  custodianCode: string;
}

interface DocumentType {
  documentTypeId: number; // ID for Document Type lookup
  documentTypeName: string;
  documentTypeCode: string;
}
interface IEmployeeDetails {
  userId: number;
  preffedName?: string;
  deptName?: string;
  office?: string;
  Title?: string;
}
const ChangeDocumentRequestContext = ({ props }: any) => {
  const sp: SPFI = getSP();
  const elementRef = React.useRef<HTMLDivElement>(null);
  const siteUrl = props.siteUrl;
  const tenantUrl = props.siteUrl?.split("/sites/")[0];
  const { useHide }: any = React.useContext(UserContext);
  const [InputDisabled, setInputDisabled] = React.useState(false);
  const Breadcrumb = [
    {
      MainComponent: "Home",
      MainComponentURl: `${siteUrl}/SitePages/Dashboard.aspx`,
    },
    {
      ChildComponent: "Change Request",
      ChildComponentURl: `${siteUrl}/SitePages/ChangeRequest.aspx`,
    },
  ];
  const [Loading, setLoading] = React.useState(false);
  const [FormItemId, setFormItemId] = React.useState(null);
  const [editID, setEditID] = React.useState(null);
  const [editItemID, setEditItemID] = React.useState(null);
  const [MainEditItem, setMainEditItem] = React.useState(null);
  const [rows, setRows] = React.useState<any>([]);
  const [ReqType, setReqType] = React.useState<any>([]);
  const [Amendtype, setAmendtype] = React.useState<any>([]);
  const [Classificationopt, setClassificationopt] = React.useState<any>([]);
  const [LocationOpt, setLocationOpt] = React.useState<any>([]);
  const [Custodianopt, setCustodianopt] = React.useState<any>([]);
  const [DocumentTypeOpt, setDocumentTypeOpt] = React.useState<any>([]);
  const [UserRoles, setUserRoles] = React.useState<any>([]);
  const [rows1, setRows1] = React.useState<any>([]);
  const [DocumentLink, setDocumentLink] = React.useState(null);
  const [currentUser, setCurrentUser] = React.useState(null);
  const [selectedOption, setSelectedOption] = React.useState(null);
  const [selectedOptionReq, setSelectedOptionReq] = React.useState(null);
  const [selectedOptionAmend, setSelectedOptionAmend] = React.useState(null);
  const [selectedOptionClass, setSelectedOptionClassification] = React.useState(null);
  const [selectedOptionLoc, setselectedOptionLoc] = React.useState(null);
  const [selectedOptionCusto, setselectedOptionCusto] = React.useState(null);
  const [selectedOptionDoctype, setselectedOptionDoctype] = React.useState(null);
  const [selectedPeople, setSelectedPeople] = React.useState(null);
  const [selectedRole, setSelectedRole] = React.useState(null);
  const [ValidDraft, setValidDraft] = React.useState(true);
  const [ValidSubmit, setValidSubmit] = React.useState(true);
  const [RequesterRoleId, setRequesterRoleId] = React.useState(null);
  const [FormNameId, setFormNameId] = React.useState(null);
  const [ListNameId, setListNameId] = React.useState(null);
  const [editForm, setEditForm] = React.useState(false);
  const [modeValue, setmode] = React.useState("");
  const [referencedocCode, setreferencedocCode] = React.useState("");
  const [docCode, setdocCode] = React.useState("");
  const [serialNo, setserialNo] = React.useState("");
  const [issueNo, setissueNo] = React.useState("");
  const [revisionNo, setrevisionNo] = React.useState("");
  const [pageValue, setpage] = React.useState("");
  const [cancellReason, setcancellReason] = React.useState([{ id: 0, description: "", reason: "" }]);
  const [cancellReasonEdit, setcancellReasonEdit] = React.useState([]);
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
    AttachmentId: [],
    AttachmentJson: "",
    DocumentTypeId: 0
  });
  const [Attachmentarr, setAttachmentarr] = React.useState([]);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null); // To store the file preview URL
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [showModal, setShowModal] = React.useState(false);
  const [forwardToArr, setForwardToArr] = React.useState<ForwardTo[]>([
    { id: 0, role: 0, level: 1, approvers: [] } // Default row
  ]);
  const [forwardToArrEdit, setForwardToArrEdit] = React.useState<ForwardTo[]>([]);
  const [changeRequestCheckboxes, setChangeRequestCheckboxes] = React.useState<ChangeRequestCheckbox[]>([]);
  const [employeeDetails, setemployeeDetails] = React.useState<IEmployeeDetails[] | null>([]);
  const [selectedCheckboxIds, setselectedCheckboxIds] = React.useState<number[]>([]);
  const [isCheckboxSectionHighlighted, setisCheckboxSectionHighlighted] = React.useState<boolean>(false);

  const [selectedUsers, setSelectedUsers] = React.useState<any[]>([]);
  const [remark, setRemark] = React.useState("");

  // Function to handle People Picker selection
  const onPeoplePickerChange = (items: any[]) => {
    setSelectedUsers(items);
  };

  const ApiCallFunc = async () => {
    const path1 = window.location.pathname;

    if (path1.includes("/view/") || path1.includes("/approve/")) {
      setInputDisabled(true);
    }
    else {
      setInputDisabled(false);
    }
    var ReqTypeArr = await getAllRequestType(sp);
    const optionsreq = ReqTypeArr.map((item: any) => ({
      value: item.ID,
      label: item.RequestType,
      itemId: item.ID
    }));
    setReqType(optionsreq);
    var AmendmentTypeArr = await getAllAmendmentType(sp);
    const optionsamendment = AmendmentTypeArr.map((item: any) => ({
      value: item.ID,
      label: item.AmendmentType,
      itemId: item.ID
    }));
    setAmendtype(optionsamendment);
    var ClassificationArr = await getAllClassificationMaster(sp);
    const optionsclassification = ClassificationArr.map((item: any) => ({
      value: item.ID,
      label: item.Classification,
      itemId: item.ID
    }));
    setClassificationopt(optionsclassification);
    const Currusers: any = await getCurrentUser(sp, siteUrl);
    setCurrentUser(await getCurrentUser(sp, siteUrl));
    const userProfile = await sp.profiles.myProperties();
    let requesttypesoptions = await fetchChangeRequestTypes();
    let locationoptions = await fetchLocations();
    let custodianoptions = await fetchCustodian();
    let documenttypeoptions = await fetchDocumentTypes();
    const AllUserRoles = await getDataRoles(sp);
    const setRolesValue = AllUserRoles.map(item => ({
      value: item.Id,
      label: item.Role,

    }));

    setUserRoles(setRolesValue)

    const users = await sp.web.siteUsers();

    const Selectedoptions = users.map(item => ({
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
      RequestDate: new Date().toLocaleDateString("en-CA")
      //RequestedDate: new Date().toISOString().split("T")[0] // Format as YYYY-MM-DD

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
      Department: item.Department,
      AttachmentId: item.AttachmentId,
      AttachmentJson: item.AttachmentJson
      // DocumentName: "",
      // IsRework: false,
      // DigitalSignStatus: false,


    }));
    setRows(options);



    let formitemid;
    let ProcessItemId: any
    //#region getdataByID
    if (sessionStorage.getItem("ChangeRequestId") != undefined) {
      const iD = sessionStorage.getItem("ChangeRequestId")
      let iDs = decryptId(iD)
      formitemid = Number(iDs);
      setFormItemId(Number(iDs));
      setEditID(await getApprovalByID(sp, Number(iDs), CONTENTTYPE_ChangeDocument));
       ProcessItemId = await getApprovalByID(sp, Number(iDs), CONTENTTYPE_ChangeDocument);
      setInputDisabled(await getApprovalByID2(sp, Number(iDs), CONTENTTYPE_ChangeDocument));
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
     
      //let segmentsnew = GetQueryString("mode");
      if (paramIndex !== -1 && segments[paramIndex + 1]) {
        setmode(segments[paramIndex])
        // mode = segments[paramIndex]; // Will be "edit" or "view"
        formitemid = segments[paramIndex + 1]; // Get the ID
        if (segments[paramIndex + 2] !== undefined) {
          debugger
          setEditID(await getApprovalByID(sp, Number(segments[paramIndex + 2]), CONTENTTYPE_ChangeDocument));
           ProcessItemId = await getApprovalByID(sp, Number(segments[paramIndex + 2]), CONTENTTYPE_ChangeDocument);
          setInputDisabled(await getApprovalByID2(sp, Number(segments[paramIndex + 2]), CONTENTTYPE_ChangeDocument));
        }
      }


    }
    // formitemid =20;
    if (formitemid) {
      setEditItemID(Number(formitemid));

      const setBannerById = await getItemByIDCR(sp, Number(formitemid))
      // setEditID(Number(setBannerById[0].ID))
      if (setBannerById.length > 0) {
        debugger
        setEditForm(true);
        setMainEditItem(setBannerById[0]);
        // setCategoryData(await getCategory(sp, Number(setBannerById[0]?.TypeMaster))) // Category
        if (setBannerById[0].AttachmentId) {
          let arrn = await getDocumentLinkByIDarr(sp, setBannerById[0].AttachmentId);
          //let arraynew: any[];
          //arraynew.push(arrn)
          console.log("arrrrrrnh", arrn);
          setAttachmentarr(arrn);
          setDocumentLink(await getDocumentLinkByID(sp, setBannerById[0].AttachmentId))
        }
        if (ProcessItemId && ProcessItemId.Level === 0 && ProcessItemId.CurrentUserRole === "OES" && ProcessItemId.IsInitiator == "No") {
          const ApprowData: any[] = await getAllProcessData(sp, Number(formitemid), CONTENTTYPE_ChangeDocument, setBannerById[0].DocumentCode)

          if (ApprowData.length > 0) {

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
        }
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
          DocumentCode: setBannerById[0].DocumentCode,
          ReferenceNumber: setBannerById[0].ReferenceNumber,
          AmendmentTypeId: setBannerById[0].AmendmentTypeId,
          ClassificationId: setBannerById[0].ClassificationId,
          ChangeRequestTypeId: setBannerById[0].ChangeRequestTypeId,
          SubmiitedDate: setBannerById[0].SubmiitedDate,
          SubmitStatus: setBannerById[0].SubmitStatus,
          value: setBannerById[0].DocumentCode,
          label: setBannerById[0].DocumentCode,
          RequestTypeId: setBannerById[0].RequestTypeId,
          // Status: "Pending",
          // DocumentName: "",
          // IsRework: false,
          // DigitalSignStatus: false,
          //ChangeRequestIDId: setBannerById[0].ID,
          DocumentTypeId: setBannerById[0].DocumentTypeId,
          AttachmentId: setBannerById[0].AttachmentId,
          AttachmentJson: setBannerById[0].AttachmentJson


        }

        // let arr2 = {

        //   RequesterName: setBannerById[0].RequesterName,
        //   RequesterNameId: setBannerById[0].RequesterNameId,
        //   RequesterDesignation: setBannerById[0].RequesterDesignation,
        //   Department: setBannerById[0].Department,
        //   RequestDate: setBannerById[0].RequestDate,
        //   IssueDate: setBannerById[0].IssueDate,
        //   LocationId: setBannerById[0].LocationId,
        //   CustodianId: setBannerById[0].CustodianId,
        //   SerialNumber: setBannerById[0].SerialNumber,
        //   IssueNumber: setBannerById[0].IssueNumber,
        //   RevisionNumber: setBannerById[0].RevisionNumber,
        //   RevisionDate: setBannerById[0].RevisionDate,
        //   DocumentCode: setBannerById[0].value,
        //   ReferenceNumber: setBannerById[0].ReferenceNumber,
        //   AmendmentTypeId: setBannerById[0].AmendmentTypeId,
        //   ClassificationId: setBannerById[0].ClassificationId,
        //   ChangeRequestTypeId: setBannerById[0].ChangeRequestTypeId,
        //   SubmiitedDate: setBannerById[0].SubmiitedDate,
        //   SubmitStatus: setBannerById[0].SubmitStatus,
        //   // value: setBannerById[0].DocumentCode,
        //   // label: setBannerById[0].DocumentCode,
        //   // Status: "Pending",
        //   // DocumentName: "",
        //   // IsRework: false,
        //   // DigitalSignStatus: false,
        //   ChangeRequestIDId: setBannerById[0].ChangeRequestIDId,
        //   DocumentTypeId: setBannerById[0].DocumentTypeId,
        //   AttachmentId: setBannerById[0].AttachmentId,
        //   AttachmentJson: setBannerById[0].AttachmentJson


        // }
        setissueNo(setBannerById[0].IssueNumber);
        setserialNo(setBannerById[0].SerialNumber);
        setFormData(prevData => ({
          ...prevData,
          IssueNumber: setBannerById[0].IssueNumber,
          ReferenceNumber: setBannerById[0].ReferenceNumber,
          RevisionNumber: setBannerById[0].RevisionNumber,
          ChangeRequestID: setBannerById[0].ID,
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
          DocumentCode: setBannerById[0].DocumentCode,
          RequestTypeId: setBannerById[0].RequestTypeId,
          DocumentTypeId: setBannerById[0].DocumentTypeId,
          Department: setBannerById[0].Department,
          AttachmentId: setBannerById[0].AttachmentId,
          AttachmentJson: setBannerById[0].AttachmentJson

          // Format as YYYY-MM-DD
        }));

        // setFormData(arr2);
        debugger
        setSelectedOption(arr);
        const selectedLocation = locationoptions.filter((loc: { locationId: any; }) => loc.locationId === setBannerById[0].LocationId)[0] || null;
        const selectedCustodian = custodianoptions.filter((cust: { custodianId: any; }) => cust.custodianId === setBannerById[0].CustodianId)[0] || null;
        const selectedDocumentType = documenttypeoptions.filter((docType: { documentTypeId: any; }) => docType.documentTypeId === setBannerById[0].DocumentTypeId)[0] || null;
        const selectedAmendment = optionsamendment.filter((amend: { value: any; }) => amend.value === setBannerById[0].AmendmentTypeId)[0] || null;
        const selectedClassifiction = optionsclassification.filter((classi: { value: any; }) => classi.value === setBannerById[0].ClassificationId)[0] || null;
        const selectedRequesttype = optionsreq.filter((cust: { value: any; }) => cust.value === setBannerById[0].RequestTypeId)[0] || null;
        setselectedOptionDoctype(selectedDocumentType);
        setSelectedOptionClassification(selectedClassifiction);
        setSelectedOptionAmend(selectedAmendment);
        setselectedOptionCusto(selectedCustodian);
        setselectedOptionLoc(selectedLocation);
        setselectedCheckboxIds(setBannerById[0].ChangeRequestTypeId);
        setSelectedOptionReq(selectedRequesttype);

        if (setBannerById[0].AttachmentId) {
          setDocumentLink(await getDocumentLinkByID(sp, setBannerById[0].AttachmentId));
          let arrn = await getDocumentLinkByIDarr(sp, setBannerById[0].AttachmentId);
          //let arraynew: any[];
          //arraynew.push(arrn)
          console.log("arrrrrrnty", arrn);
          setAttachmentarr(arrn);
        }
        else {
          setDocumentLink(null);
        }  // Set the selected users
        const rowData: any[] = await getItemByIDChangeRequest(sp, Number(setBannerById[0].ID)) //baseUrl
        const initialRows = rowData.map((item: any) => ({
          id: item.Id,
          description: item.ChangeDescription,
          reason: item.ReasonforChange,
        }));
        setcancellReason(initialRows);
        setcancellReasonEdit(initialRows);


      }
      setRequesterRoleId(await getRequesterID(sp))
      setFormNameId(await getFormNameID(sp, CONTENTTYPE_ChangeDocument))
      setListNameId(await getListNameID(sp, LIST_TITLE_ChangeRequest))

    }
    //}
    //#endregion


  };
  const onSelectDocCode = async (selectedList: any) => {
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
      Department: selectedList.Department,
      AttachmentId: selectedList.AttachmentId,
      AttachmentJson: selectedList.AttachmentJson
      // Format as YYYY-MM-DD
    }));
    setSelectedOption(selectedList);
    const rowData: any[] = await getItemByIDChangeRequest(sp, Number(selectedList.ID)) //baseUrl
    const initialRows = rowData.map((item: any) => ({
      id: item.Id,
      description: item.ChangeDescription,
      reason: item.ReasonforChange,
    }));
    setcancellReason(initialRows);
    setcancellReasonEdit(initialRows);
    const selectedLocation = LocationOpt.filter((loc: { locationId: any; }) => loc.locationId === selectedList.LocationId)[0] || null;
    const selectedCustodian = Custodianopt.filter((cust: { custodianId: any; }) => cust.custodianId === selectedList.CustodianId)[0] || null;
    const selectedDocumentType = DocumentTypeOpt.filter((docType: { documentTypeId: any; }) => docType.documentTypeId === selectedList.DocumentTypeId)[0] || null;
    const selectedAmendment = Amendtype.filter((cust: { value: any; }) => cust.value === selectedList.AmendmentTypeId)[0] || null;
    const selectedClassifiction = Classificationopt.filter((docType: { value: any; }) => docType.value === selectedList.ClassificationId)[0] || null;
    //const selectedRequesttype = optionsreq.filter((cust: { value: any; }) => cust.value === selectedList.RequestTypeId)[0] || null;
    setselectedOptionDoctype(selectedDocumentType);
    setSelectedOptionClassification(selectedClassifiction);
    setSelectedOptionAmend(selectedAmendment);
    setselectedOptionCusto(selectedCustodian);
    setselectedOptionLoc(selectedLocation);
    setselectedCheckboxIds(selectedList.ChangeRequestTypeId)
    if (selectedList.AttachmentId) {
      let arrn = await getDocumentLinkByIDarr(sp, selectedList.AttachmentId);
      //let arraynew: any[];
      //arraynew.push(arrn)
      console.log("arrrrrrn56", arrn);
      setAttachmentarr(arrn);
      setDocumentLink(await getDocumentLinkByID(sp, selectedList.AttachmentId))
    }
    else {
      setDocumentLink(null);
    }  // Set the selected users
  };
  // const onSelectDocCode = (selectedList: any) => {
  //   console.log(selectedList, "selectedList");
  //   setFormData(prevData => ({
  //     ...prevData,
  //     DocumentCode: selectedList.value
  //   }));
  //   setSelectedOption(selectedList);  // Set the selected users

  // };
  const onSelectReq = (selectedList: any) => {
    console.log(selectedList, "selectedListreq");
    setFormData(prevData => ({
      ...prevData,
      RequestTypeId: selectedList.value
      // Format as YYYY-MM-DD
    }));
    setSelectedOptionReq(selectedList);  // Set the selected users
  };
  const onSelectAmend = (selectedList: any) => {
    console.log(selectedList, "selectedListamenddd");
    setFormData(prevData => ({
      ...prevData,
      AmendmentTypeId: selectedList.value
      // Format as YYYY-MM-DD
    }));
    setSelectedOptionAmend(selectedList);  // Set the selected users
  };
  const onSelectClassification = (selectedList: any) => {
    console.log(selectedList, "selectedListclasss");
    setFormData(prevData => ({
      ...prevData,
      ClassificationId: selectedList.value
      // Format as YYYY-MM-DD
    }));
    setSelectedOptionClassification(selectedList);  // Set the selected users
  };

  const onSelectLocation = (selectedList: any) => {
    console.log(selectedList, "selectedListclasss");
    setFormData(prevData => ({
      ...prevData,
      LocationId: selectedList.value
      // Format as YYYY-MM-DD
    }));
    setselectedOptionLoc(selectedList);  // Set the selected users
  };

  const onSelectCustodian = (selectedList: any) => {
    console.log(selectedList, "selectedListclasss");
    setFormData(prevData => ({
      ...prevData,
      CustodianId: selectedList.value
      // Format as YYYY-MM-DD
    }));
    setselectedOptionCusto(selectedList);  // Set the selected users
  };

  const onSelectDocumentType = (selectedList: any) => {
    console.log(selectedList, "selectedListclasss");
    setFormData(prevData => ({
      ...prevData,
      DocumentTypeId: selectedList.value
      // Format as YYYY-MM-DD
    }));
    setselectedOptionDoctype(selectedList);  // Set the selected users
  };
  const onSelectApprovers = (selectedOptions: any, id: number) => {
    setForwardToArr((prev) =>
      prev.map((row) =>
        row.level === id ? { ...row, approvers: selectedOptions || [] } : row
      )
    );
  };

  const fetchLocations = async () => {
    try {
      // Fetch the items
      const items = await sp.web.lists
        .getByTitle("LocationMaster") // Your list name
        .items.filter("IsActive eq 'Yes'") // Filter active items
        .select("ID", "Location", "LocationCode") // Select required fields
        .top(5000) // Limit number of records
        (); // Call get() to fetch data

      // Use map on the result to create the desired array structure
      const locations: Location[] = items.map((item: any) => ({
        locationId: item.ID, // Store the ID for lookup
        locationName: item.Location, // Name of the location
        locationCode: item.LocationCode, // Code of the location
        label: item.Location,
        value: item.ID
      }));

      // Update state with the fetched locations
      setLocationOpt(locations);
      return locations;
    } catch (error) {
      console.error("Error fetching locations: ", error);
    }
  };

  const fetchCustodian = async () => {
    // debugger
    try {
      const items = await sp.web.lists
        .getByTitle("CustodianMaster")
        .items.filter("IsActive eq 'Yes'")
        .select("ID", "Custodian", "CustodianCode")
        .top(5000) // Limit number of records
        ();

      const custodians: Custodian[] = items.map((item: any) => ({
        custodianId: item.ID, // Store the Custodian ID for lookup
        custodianName: item.Custodian,
        custodianCode: item.CustodianCode,
        label: item.Custodian,
        value: item.ID
      }));

      setCustodianopt(custodians);
      return custodians;
    } catch (error) {
      console.error("Error fetching Custodian: ", error);
    }
  };

  const fetchDocumentTypes = async () => {
    try {
      const items = await sp.web.lists
        .getByTitle("DocumentTypeMaster")
        .items.select("ID", "DocumentType", "DocumentTypeCode")
        .top(5000)();

      const documentTypes: DocumentType[] = items.map((item: any) => ({
        documentTypeId: item.ID, // Store the Document Type ID for lookup
        documentTypeName: item.DocumentType,
        documentTypeCode: item.DocumentTypeCode,
        label: item.DocumentType,
        value: item.ID
      }));

      setDocumentTypeOpt(documentTypes);
      return documentTypes;
    } catch (error) {
      console.error("Error fetching Document Types: ", error);
    }
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
        setUserRoles(UserRoles.filter((x: any) => x.label !== event.target.value))
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

  const handleDeleteRow = (index: number) => {
    // const updatedRows = forwardToArr.filter((_, i) => i !== index);
    // setForwardToArr(updatedRows);
    const updatedRows = forwardToArr
      .filter((_, i) => i !== index) // Remove selected row
      .map((row, newIndex) => ({ ...row, level: newIndex + 1 })); // Reassign levels

    setForwardToArr([...updatedRows]); // Ensure a new array reference
    //forwardToArr.splice(index, 1);
    //setForwardToArr(forwardToArr);
  };


  React.useEffect(() => {
    ApiCallFunc();
    // const path = window.location.pathname;
    //if (path.includes("/view/") || path.includes("/approve/")) {
    // setInputDisabled(true);
    // }
    //else {
    // setInputDisabled(false);
    //}
    // formData.title = currentUser.Title;
  }, [useHide]);

  const handleCancel = () => {
    window.location.href = `${siteUrl}/SitePages/EDCMAIN.aspx`;

  }

  //#region deleteLocalFile
  const deleteLocalFile = (index: number, filArray: any[]) => {
    // Create a new array without mutating the existing state
    const updatedFiles = [...cancellReason];
    updatedFiles.splice(index, 1);

    // Update the state with the new array
    setcancellReason(updatedFiles);
  };

  //#endregion
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

    let errormsg = "";

    if (fmode == FormSubmissionMode.SUBMIT) {
      if (!RequesterName) {
        //Swal.fire('Error', 'Title is required!', 'error');
        valid = false;
      } else if (!RequesterDesignation) {
        //Swal.fire('Error', 'Type is required!', 'error');
        valid = false;
      }
      else if (!selectedOptionLoc) {
        //Swal.fire('Error', 'Category is required!', 'error');
        //errormsg = "Please select Location"
        valid = false;
      }
      else if (!selectedOptionCusto) {
        //Swal.fire('Error', 'Category is required!', 'error');
        //errormsg = "Please select Custodian"
        valid = false;
      }
      else if (!selectedOptionDoctype) {
        //errormsg = "Please select Document Type"
        //Swal.fire('Error', 'Category is required!', 'error');
        valid = false;
      }
      else if (!selectedOptionClass) {
        //errormsg = "Please select Classification"
        //Swal.fire('Error', 'Category is required!', 'error');
        valid = false;
      }
      else if (!selectedOptionReq) {
        //errormsg = "Please select Classification"
        //Swal.fire('Error', 'Category is required!', 'error');
        valid = false;
      }
      else if (selectedOptionReq.label != "Change Request for New Addition" && !selectedOption.value) {
        //errormsg = "Please select Document code"
        //Swal.fire('Error', 'Entity is required!', 'error');
        valid = false;
      }
      else if (!selectedOptionAmend) {
        //errormsg = "Please select Amendment Type"
        //Swal.fire('Error', 'Category is required!', 'error');
        valid = false;
      }
      else if (cancellReason.length > 0 && cancellReason.every((row: any) => row.description.trim() !== "" && row.reason.trim() !== "") == false) {
        // const isValid = cancellReason.every((row:any) => row.description.trim() !== "" && row.reason.trim() !== "");
        //errormsg = "Please enter Description and Reason"
        valid = false;
      }
      else if (cancellReason.length == 0) {
        //errormsg = "Please enter atleast one Description and Reason"
        // const isValid = rows.every((row:any) => row.description.trim() !== "" && row.reason.trim() !== "");
        valid = false;
      }
      // else if (IssueNumber === "") {
      //   //Swal.fire('Error', 'Entity is required!', 'error');
      //   valid = false;
      // }
      // else if (RevisionNumber === "") {
      //   //Swal.fire('Error', 'Entity is required!', 'error');
      //   valid = false;
      // }
      // else if (!ReferenceNumber) {
      //   //Swal.fire('Error', 'Entity is required!', 'error');
      //   valid = false;
      // }

      // return true;

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
      else if (!selectedOptionReq) {
        //errormsg = "Please select Classification"
        //Swal.fire('Error', 'Category is required!', 'error');
        valid = false;
      }
      setValidDraft(valid);

    }

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
      debugger
      let serialnumber = await getDocumentCodeselected(sp, selectedOptionLoc.locationId, selectedOptionCusto.custodianId, selectedOptionDoctype.documentTypeId)
      let issueno = "";
      let serialno = "";
      let revisionno = "";
      if (selectedOptionReq.label == "Change Request for New Addition"){
      if (serialnumber.length > 0) {
        issueno = serialnumber[0].IssueNo;
        serialno = serialnumber[0].SerialNo;
        revisionno = serialnumber[0].RevisionNo;
        setissueNo(serialnumber[0].IssueNo);
        setserialNo(serialnumber[0].SerialNo);
        setrevisionNo(serialnumber[0].RevisionNo)
      } else {
        issueno = issueNo == "" ? "01" : issueNo;
        serialno = serialNo == "" ? "01" : serialNo;
        revisionno = revisionNo == "" ? "00" : revisionNo;
        setissueNo(issueNo == "" ? "01" : issueNo);
        setserialNo(serialNo == "" ? "01" : serialNo);
      }
    } else{
        issueno = selectedOption.IssueNumber + 1;
        serialno = selectedOption.SerialNumber +1;
        revisionno = selectedOption.RevisionNumber +1;
        setissueNo(issueNo == "" ? "01" : issueNo);
        setserialNo(serialNo == "" ? "01" : serialNo);
    }
      let doccode = await generateDocCode();
      let referencecode = await generateReferenceCode();
      console.log("doccode doccode", doccode, referencecode);
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
            let bannerImageArray: any = {};
            let DocumentName: string = "";
            let attachmentIds = [];
            const folder = sp.web.getFolderByServerRelativePath('/sites/EDeDMS/ChangeRequestDocs');
            if (Attachmentarr.length > 0 && Attachmentarr[0]?.files?.length > 0) {
              for (const file of Attachmentarr[0].files) {
                //bannerImageArray = await uploadFile(file, sp, "ChangeRequestDocs", tenantUrl);
                DocumentName = file.name;
                const fileAddResult = await folder.files.addChunked(file.name, file);
                const fileNew = fileAddResult.file;
                const documentName = fileAddResult.data.Name;
                bannerImageArray = fileAddResult;
                // Get the item ID for the uploaded file
                const currentItemId = await fileNew.getItem<{ Id: number }>();
                const itemId = currentItemId.Id;
                await currentItemId.update({
                  FileName: documentName, // Assuming FileName is the internal name of the column
                });

                // Save the document ID for the attachment field in ChangeRequestList
                attachmentIds.push(itemId);
              }
            }
            // let TypeMasterData: any = await getAnnouncementandNewsTypeMaster(sp, Number(formData.Type))
            let arr = {
              Title: formData.RequesterName,
              RequesterNameId: formData.RequesterNameId,
              RequesterDesignation: formData.RequesterDesignation,
              Department: formData.Department,
              RequestDate: new Date(formData.RequestDate).toISOString(),
              IssueDate: new Date(formData.IssueDate).toISOString(),
              LocationId: formData.LocationId,
              CustodianId: formData.CustodianId,
              SerialNumber: Number(serialno),
              IssueNumber: Number(issueno),
              RevisionNumber: Number(revisionno),
              RevisionDate: formData.RevisionDate,
              DocumentCode: doccode,
              ReferenceNumber:referencecode,
              RequestTypeId: formData.RequestTypeId,
              AmendmentTypeId: formData.AmendmentTypeId,
              ChangeRequestTypeId: selectedCheckboxIds,
              ClassificationId: formData.ClassificationId,
              SubmiitedDate: new Date(formData.RequestDate).toISOString(),
              SubmitStatus: "Yes",
              Status: "Pending",
              OESSubmitStatus: "No",
              InitiatorSubmitStatus: "Yes",
              CurrentUserRole: "OES",
              DocumentName: DocumentName,
              DocumentTypeId: formData.DocumentTypeId,
              AttachmentId: attachmentIds,
              AttachmentJson: JSON.stringify(bannerImageArray)
            }
            const postResult = await updateItemChangeRequestList(arr, sp, editItemID);
            const postId = postResult?.data?.ID;
            console.log("postPayload edit arr", arr, postResult);

            for (const row of cancellReason) {

              const postPayload2 = {
                ChangeRequestIDId: postId, // Assuming "Title" column exists
                ChangeDescription: row.description,
                ReasonforChange: row.reason,
              }

              if (!row.id) {

                const postResult2 = await addItemChangeRequestReasonlist(postPayload2, sp);
                const postId2 = postResult2?.data?.ID;
                // debugger
                if (!postId2) {
                  console.error("Post creation failed.");
                  return;
                }

              }
              else if (row.id > 0) {
                const postResult2 = await updateItemChangeRequestReasonList(postPayload2, sp, row.id);
                const postId2 = postResult2?.data?.ID;
              }

            }

            const toDelete = cancellReasonEdit.filter(
              (itemEdit) => !cancellReason.some(item => item.id === itemEdit.id) // Assuming ID is the unique key
            );

            // Delete each item from SharePoint
            for (const item of toDelete) {
              try {
                await sp.web.lists.getByTitle("ChangeRequestReasonList").items.getById(item.id).delete();
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
            sessionStorage.removeItem("ChangeRequestId")
            setTimeout(() => {
              window.location.href = `${siteUrl}/SitePages/EDCMAIN.aspx`;
            }, 1000);
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
            let bannerImageArray: any = {};
            let DocumentName: string = "";
            let attachmentIds = [];
            const folder = sp.web.getFolderByServerRelativePath('/sites/EDeDMS/ChangeRequestDocs');
            if (Attachmentarr.length > 0 && Attachmentarr[0]?.files?.length > 0) {
              for (const file of Attachmentarr[0].files) {
                //bannerImageArray = await uploadFile(file, sp, "ChangeRequestDocs", tenantUrl);
                DocumentName = file.name;
                const fileAddResult = await folder.files.addChunked(file.name, file);
                const fileNew = fileAddResult.file;
                const documentName = fileAddResult.data.Name;
                bannerImageArray = fileAddResult;
                // Get the item ID for the uploaded file
                const currentItemId = await fileNew.getItem<{ Id: number }>();
                const itemId = currentItemId.Id;
                await currentItemId.update({
                  FileName: documentName, // Assuming FileName is the internal name of the column
                });

                // Save the document ID for the attachment field in ChangeRequestList
                attachmentIds.push(itemId);
              }
            }
            const postPayload = {
              Title: formData.RequesterName,
              RequesterNameId: formData.RequesterNameId,
              RequesterDesignation: formData.RequesterDesignation,
              Department: formData.Department,
              RequestDate: formData.RequestDate != "" ? new Date(formData.RequestDate).toISOString() : new Date().toISOString(),
              //IssueDate: formData.IssueDate,
              LocationId: formData.LocationId,
              CustodianId: formData.CustodianId,
              SerialNumber: Number(serialno),
              IssueNumber: Number(issueno),
              RevisionNumber: Number(revisionno),
              //RevisionNumber: selectedOption.RevisionNumber,
              RevisionDate: new Date().toISOString(),
              DocumentCode: doccode,
              ReferenceNumber: referencecode,
              AmendmentTypeId: formData.AmendmentTypeId,
              RequestTypeId: formData.RequestTypeId,
              ClassificationId: formData.ClassificationId,
              ChangeRequestTypeId: selectedCheckboxIds,
              //SubmiitedDate: selectedOption.SubmiitedDate,
              SubmiitedDate: new Date().toISOString(),
              SubmitStatus: "Yes",
              Status: "Pending",
              OESSubmitStatus: "No",
              InitiatorSubmitStatus: "Yes",
              CurrentUserRole: "OES",
              DocumentName: DocumentName,
              DocumentTypeId: formData.DocumentTypeId,
              AttachmentId: attachmentIds,
              AttachmentJson: JSON.stringify(bannerImageArray)
            };
            console.log("postPayload new", postPayload);

            const postResult = await addItemChangeRequestList(postPayload, sp);
            const postId = postResult?.data?.ID;
            // debugger
            if (!postId) {
              console.error("Post creation failed.");
              return;
            }

            for (const row of cancellReason) {

              const postPayload2 = {
                ChangeRequestIDId: postId, // Assuming "Title" column exists
                ChangeDescription: row.description,
                ReasonforChange: row.reason,
              }

              const postResult2 = await addItemChangeRequestReasonlist(postPayload2, sp);
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
              window.location.href = `${siteUrl}/SitePages/EDCMAIN.aspx`;
            }, 1000);
            // }

          }
        })

      }
    }

  }
  const generateDocCode = async () => {
    debugger
    //const { selectedLocationId, selectedCustodianId, selectedDocumentTypeId, locations, custodians, documentTypes } = this.state;

    // Use filter to find the selected items
    const selectedLocation = LocationOpt.filter((loc: { locationId: any; }) => loc.locationId === selectedOptionLoc.locationId)[0] || null;
    const selectedCustodian = Custodianopt.filter((cust: { custodianId: any; }) => cust.custodianId === selectedOptionCusto.custodianId)[0] || null;
    const selectedDocumentType = DocumentTypeOpt.filter((docType: { documentTypeId: any; }) => docType.documentTypeId === selectedOptionDoctype.documentTypeId)[0] || null;

    // If all selections are available, generate the document code
    if (selectedLocation && selectedCustodian && selectedDocumentType) {
      const docCode = `${selectedCustodian.custodianCode}.${selectedDocumentType.documentTypeCode}.${selectedLocation.locationCode}.${issueNo == "" ? "01" : issueNo}`;
      setdocCode(docCode)
      return docCode;
      // Store docCode in state
    } else {
      // Reset docCode if any selection is missing
      setdocCode("")
      return;
    }
  };
  const generateReferenceCode = async () => {
    debugger
    //const { selectedLocationId, selectedCustodianId, selectedDocumentTypeId, locations, custodians, documentTypes } = this.state;
    const selectedLocation = LocationOpt.filter((loc: { locationId: any; }) => loc.locationId === selectedOptionLoc.locationId)[0] || null;
    const selectedCustodian = Custodianopt.filter((cust: { custodianId: any; }) => cust.custodianId === selectedOptionCusto.custodianId)[0] || null;
    const selectedDocumentType = DocumentTypeOpt.filter((docType: { documentTypeId: any; }) => docType.documentTypeId === selectedOptionDoctype.documentTypeId)[0] || null;
    if (selectedLocation && selectedCustodian && selectedDocumentType) {
      const referencedocCode = `${selectedDocumentType.documentTypeCode}.${selectedLocation.locationCode}.${selectedCustodian.custodianCode}.TMP-${serialNo == "" ? "01" : serialNo}.${issueNo == "" ? "01" : issueNo}`;
      setreferencedocCode(referencedocCode);
      return referencedocCode;
      // Store docCode in state
    } else {
      // Reset docCode if any selection is missing.TMP-01.01

      setreferencedocCode("")
      return;
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
            let bannerImageArray: any = {};
            let DocumentName: string = "";
            let attachmentIds = [];
            const folder = sp.web.getFolderByServerRelativePath('/sites/EDeDMS/ChangeRequestDocs');
            if (Attachmentarr.length > 0 && Attachmentarr[0]?.files?.length > 0) {
              for (const file of Attachmentarr[0].files) {
                //bannerImageArray = await uploadFile(file, sp, "ChangeRequestDocs", tenantUrl);
                DocumentName = file.name;
                const fileAddResult = await folder.files.addChunked(file.name, file);
                const fileNew = fileAddResult.file;
                const documentName = fileAddResult.data.Name;
                bannerImageArray = fileAddResult;
                // Get the item ID for the uploaded file
                const currentItemId = await fileNew.getItem<{ Id: number }>();
                const itemId = currentItemId.Id;
                await currentItemId.update({
                  FileName: documentName, // Assuming FileName is the internal name of the column
                });

                // Save the document ID for the attachment field in ChangeRequestList
                attachmentIds.push(itemId);
              }
            }
            // let TypeMasterData: any = await getAnnouncementandNewsTypeMaster(sp, Number(formData.Type))
            let arr = {
              Title: formData.RequesterName,
              RequesterNameId: formData.RequesterNameId,
              RequesterDesignation: formData.RequesterDesignation,
              Department: formData.Department,
              RequestDate: new Date().toISOString(),
              LocationId: formData.LocationId,
              CustodianId: formData.CustodianId,
              SerialNumber: formData.SerialNumber,
              IssueNumber: formData.IssueNumber,
              RevisionNumber: formData.RevisionNumber,
              //RevisionDate: formData.RevisionDate,
              DocumentCode: formData.DocumentCode,
              ReferenceNumber: formData.ReferenceNumber,
              AmendmentTypeId: formData.AmendmentTypeId,
              RequestTypeId: formData.RequestTypeId,
              ClassificationId: formData.ClassificationId,
              ChangeRequestTypeId: formData.ChangeRequestTypeId,
              //SubmiitedDate: selectedOption.SubmiitedDate,
              SubmiitedDate: new Date(formData.SubmiitedDate).toISOString(),
              SubmitStatus: "No",
              Status: "Save as draft",
              DocumentName: DocumentName,
              DocumentTypeId: selectedOption.DocumentTypeId,
              OESSubmitStatus: "No",
              InitiatorSubmitStatus: "No",
              CurrentUserRole: "OES",
              AttachmentId: selectedOption.AttachmentId,
              AttachmentJson: selectedOption.AttachmentJson

            }
            console.log("postPayloaddrafttedit", arr, editItemID);
            const postResult = await updateItemChangeRequestList(arr, sp, editItemID);
            const postId = postResult?.data?.ID;


            for (const row of cancellReason) {

              const postPayload2 = {
                ChangeRequestIDId: postId, // Assuming "Title" column exists
                ChangeDescription: row.description,
                ReasonforChange: row.reason,
              }

              if (!row.id) {

                const postResult2 = await addItemChangeRequestReasonlist(postPayload2, sp);
                const postId2 = postResult2?.data?.ID;
                // debugger
                if (!postId2) {
                  console.error("Post creation failed.");
                  return;
                }

              }
              else if (row.id > 0) {
                const postResult2 = await updateItemChangeRequestReasonList(postPayload2, sp, row.id);
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
                await sp.web.lists.getByTitle("ChangeRequestReasonList").items.getById(item.id).delete();
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
            sessionStorage.removeItem("ChangeRequestId")
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
            let bannerImageArray: any = {};
            let DocumentName: string = "";
            let attachmentIds = [];
            const folder = sp.web.getFolderByServerRelativePath('/sites/EDeDMS/ChangeRequestDocs');
            if (Attachmentarr.length > 0 && Attachmentarr[0]?.files?.length > 0) {
              for (const file of Attachmentarr[0].files) {
                //bannerImageArray = await uploadFile(file, sp, "ChangeRequestDocs", tenantUrl);
                DocumentName = file.name;
                const fileAddResult = await folder.files.addChunked(file.name, file);
                const fileNew = fileAddResult.file;
                const documentName = fileAddResult.data.Name;
                bannerImageArray = fileAddResult;
                // Get the item ID for the uploaded file
                const currentItemId = await fileNew.getItem<{ Id: number }>();
                const itemId = currentItemId.Id;
                await currentItemId.update({
                  FileName: documentName, // Assuming FileName is the internal name of the column
                });
                console.log("JSON.stringify(fileAddResult)", JSON.stringify(fileAddResult))
                // Save the document ID for the attachment field in ChangeRequestList
                attachmentIds.push(itemId);
              }
            }


            const postPayload = {
              Title: formData.RequesterName,
              RequesterNameId: formData.RequesterNameId,
              RequesterDesignation: formData.RequesterDesignation,
              Department: formData.Department,
              RequestDate: new Date().toISOString(),
              IssueDate: new Date().toISOString(),
              LocationId: formData.LocationId,
              CustodianId: formData.CustodianId,
              SerialNumber: Number("01"),
              IssueNumber: Number("01"),
              RevisionNumber: Number("00"),
              RequestTypeId: formData.RequestTypeId,
              AmendmentTypeId: formData.AmendmentTypeId,
              ClassificationId: formData.ClassificationId,
              ChangeRequestTypeId: selectedCheckboxIds,
              SubmiitedDate: new Date().toISOString(),
              SubmitStatus: "No",
              Status: "Save as draft",
              DocumentName: DocumentName,
              DocumentTypeId: formData.DocumentTypeId,
              AttachmentId: attachmentIds,
              AttachmentJson: JSON.stringify(bannerImageArray)
            };
            console.log("postPayloaddraftttt", postPayload);

            const postResult = await addItemChangeRequestList(postPayload, sp);
            const postId = postResult?.data?.ID;
            // debugger
            if (!postId) {
              console.error("Post creation failed.");
              return;
            }

            for (const row of cancellReason) {

              const postPayload2 = {
                ChangeRequestIDId: postId, // Assuming "Title" column exists
                ChangeDescription: row.description,
                ReasonforChange: row.reason,
              }

              const postResult2 = await addItemChangeRequestReasonlist(postPayload2, sp);
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
  const GetUserProperties = async () => {
    // let employeeDetails: IEmployeeDetails = {
    //   userId: 0, // Initialize with default value
    // };
    let employeeDetails: any = {
      userId: 0,
      preffedName: '',
      deptName: '',
      office: '',
      Title: ''
    };
    debugger;
    try {
      // Fetch the current user's profile details
      const userProfile = await sp.profiles.myProperties();

      // Fetch the current user's ID
      const currentUser = await sp.web.currentUser();

      // Add the user ID to the employeeDetails object
      employeeDetails.userId = currentUser.Id;

      // Assuming the userProfile has the UserProfileProperties you need
      const userProperties = userProfile.UserProfileProperties;

      // Loop through properties and update the employeeDetails object
      for (let property of userProperties) {
        if (property.Key === "PreferredName") {
          employeeDetails.preffedName = property.Value;
        }
        if (property.Key === "Department") {
          employeeDetails.deptName = property.Value;
        }
        if (property.Key === "Office") {
          employeeDetails.office = property.Value;
        }
        if (property.Key === "Title") {
          employeeDetails.Title = property.Value;
        }
      }
      //   this.setState({
      //     name: employeeDetails.preffedName,
      //     designation: employeeDetails.Title,
      // });

      setemployeeDetails(employeeDetails)

    } catch (error) {
      console.error("Error fetching user properties:", error);

    }
  }
  const ForwardApproval = (status: string) => {
    let valid = true;
    let actionMessage = "";
    let successMessage = "";
    switch (status) {
      case "Forward":
        actionMessage = "Do you want to forward this request?";
        successMessage = "Request forwarded successfully.";
        break;
      case "Reject":
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
              Remark: remark,


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
                ProcessName: "Change Request",
                FormNameId: FormNameId,
                ApprovalType: "Approval",
                IsApprovalGenerated: "No"
              }
              if (item.id) {
                const postResult2 = await UpdateAllProcessItem(arr2, sp, item.id);
                const postId2 = postResult2?.data?.ID;
              }
              else {
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
            const postResult3 = await updateItemChangeRequestList(arr2, sp, editItemID);
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
            sessionStorage.removeItem("ChangeRequestId")
            setTimeout(() => {
              window.location.href = `${siteUrl}/SitePages/Dashboard.aspx`;
            }, 1000);
            // }
          }

        })
      }



    }
    else {

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
              Remark: remark,


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
                ProcessName: "Change Request",
                FormNameId: FormNameId,
                ApprovalType: "Approval",
                IsApprovalGenerated: "No"
                // RedirectionLink:,
              }
              if (item.id) {
                const postResult2 = await UpdateAllProcessItem(arr2, sp, item.id);
                const postId2 = postResult2?.data?.ID;
              }
              else {
                const postResult2 = await addAllProcessItem(arr2, sp);
                const postId2 = postResult2?.data?.ID;
              }
            }
            let arr2 = {
              SubmiitedDate: new Date().toLocaleDateString("en-CA"),
              // ActionTakenRoleId: formData.RequesterDesignation,
              Status: status === "Rework" ? "Rework" : "Rejected",
              IsRework: status === "Rework" ? "Yes" : "No",
              OESSubmitStatus: "No",
              InitiatorSubmitStatus: "No",
              SubmitStatus: "No",
            }
            const postResult2 = await updateItemChangeRequestList(arr2, sp, editItemID);
            const postId2 = postResult2?.data?.ID;
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
            sessionStorage.removeItem("ChangeRequestId")
            setTimeout(() => {
              window.location.href = `${siteUrl}/SitePages/Dashboard.aspx`;
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
              RequestTypeId: selectedOption.RequestTypeId,
              ClassificationId: selectedOption.ClassificationId,
              ChangeRequestTypeId: selectedOption.ChangeRequestTypeId,
              SubmiitedDate: selectedOption.SubmiitedDate,
              SubmitStatus: "Yes",
              Status: "Pending",
              // DocumentName: "",
              // IsRework: false,
              // DigitalSignStatus: false,
              //ChangeRequestIDId: formData.ChangeRequestID,
              DocumentTypeId: selectedOption.DocumentTypeId,
              OESSubmitStatus: "No",
              InitiatorSubmitStatus: "Yes",
              CurrentUserRole: "OES",
              AttachmentId: selectedOption.AttachmentId,
              AttachmentJson: selectedOption.AttachmentJson


            }
            const postResult3 = await updateItemChangeRequestList(arr3, sp, editItemID);
            const postId3 = postResult?.data?.ID;


            // //////////////Update Document cancellation Reason List when Submitted

            for (const row of cancellReason) {

              const postPayload2 = {
                ChangeRequestIDId: formData.ChangeRequestID, // Assuming "Title" column exists
                ChangeDescription: row.description,
                ReasonforChange: row.reason,
              }

              if (!row.id) {

                const postResult2 = await addItemChangeRequestReasonlist(postPayload2, sp);
                const postId2 = postResult2?.data?.ID;
                // debugger
                if (!postId2) {
                  console.error("Post creation failed.");
                  return;
                }

              }
              else if (row.id > 0) {
                const postResult2 = await updateItemChangeRequestReasonList(postPayload2, sp, row.id);
                const postId2 = postResult2?.data?.ID;
              }

            }

            const toDelete = cancellReasonEdit.filter(
              (itemEdit) => !cancellReason.some(item => item.id === itemEdit.id) // Assuming ID is the unique key
            );

            // Delete each item from SharePoint
            for (const item of toDelete) {
              try {
                await sp.web.lists.getByTitle("ChangeRequestReasonList").items.getById(item.id).delete();
                // console.log(`Deleted item with ID: ${item.ID}`);
              } catch (error) {
                console.error(`Error deleting item with ID: ${item.id}`, error);
              }
            }

            setLoading(false);
            Swal.fire(successMessage, '', 'success');
            sessionStorage.removeItem("ChangeRequestId")
            setTimeout(() => {
              window.location.href = `${siteUrl}/SitePages/EDCMAIN.aspx`;
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
              RequestTypeId: selectedOption.RequestTypeId,
              ClassificationId: selectedOption.ClassificationId,
              ChangeRequestTypeId: selectedOption.ChangeRequestTypeId,
              SubmiitedDate: selectedOption.SubmiitedDate,
              SubmitStatus: "No",
              Status: "Save as draft",
              // DocumentName: "",
              // IsRework: false,
              // DigitalSignStatus: false,
              //ChangeRequestIDId: formData.ChangeRequestID,
              DocumentTypeId: selectedOption.DocumentTypeId,
              OESSubmitStatus: "No",
              InitiatorSubmitStatus: "No",
              CurrentUserRole: "OES",
              AttachmentId: selectedOption.AttachmentId,
              AttachmentJson: selectedOption.AttachmentJson


            }
            const postResult3 = await updateItemChangeRequestList(arr3, sp, editItemID);
            const postId3 = postResult?.data?.ID;


            // //////////////Update Document cancellation Reason List when Submitted

            for (const row of cancellReason) {

              const postPayload2 = {
                ChangeRequestIDId: formData.ChangeRequestID, // Assuming "Title" column exists
                ChangeDescription: row.description,
                ReasonforChange: row.reason,
              }

              if (!row.id) {

                const postResult2 = await addItemChangeRequestReasonlist(postPayload2, sp);
                const postId2 = postResult2?.data?.ID;
                // debugger
                if (!postId2) {
                  console.error("Post creation failed.");
                  return;
                }

              }
              else if (row.id > 0) {
                const postResult2 = await updateItemChangeRequestReasonList(postPayload2, sp, row.id);
                const postId2 = postResult2?.data?.ID;
              }

            }

            const toDelete = cancellReasonEdit.filter(
              (itemEdit) => !cancellReason.some(item => item.id === itemEdit.id) // Assuming ID is the unique key
            );

            // Delete each item from SharePoint
            for (const item of toDelete) {
              try {
                await sp.web.lists.getByTitle("ChangeRequestReasonList").items.getById(item.id).delete();
                // console.log(`Deleted item with ID: ${item.ID}`);
              } catch (error) {
                console.error(`Error deleting item with ID: ${item.id}`, error);
              }
            }


            setLoading(false);
            Swal.fire(successMessage, '', 'success');
            sessionStorage.removeItem("ChangeRequestId")
            setTimeout(() => {
              window.location.href = `${siteUrl}/SitePages/EDCMAIN.aspx`;
            }, 1000);
            // }
          }

        })
      }

    }


  }

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>, libraryName: string, docLib: string) => {
    event.preventDefault();
    let uloadBannerImageFiles: any[] = [];
    let uloadImageFiles: any[] = [];
    let uloadImageFiles1: any[] = [];
    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files);
      (event.target as HTMLInputElement).value = '';
      if (files.length > 0) {
        const preview = URL.createObjectURL(files[0]); // Generate preview URL
        //alert(`preview ${preview}`)
        newfilepreview = preview
        setPreviewUrl(preview);
        var arr = {};
        arr = {
          files: files,
          libraryName: libraryName,
          docLib: docLib,
          name: files[0].name,
          fileSize: files[0].size,
          fileUrl: URL.createObjectURL(files[0])
        };
        uloadBannerImageFiles.push(arr);
        setAttachmentarr(uloadBannerImageFiles);
      } else {
        Swal.fire("upload a document")
      }
    }
  };
  const handlePreviewClick = (fileObj: any) => {
    if (newfileupload === true) {
      console.log(newfilepreview, "here is newfilepreview")
      //alert(`new file ${newfilepreview}`)
      setPreviewUrl(newfilepreview); // Set the preview URL
      setIsModalOpen(true);   // Open the modal
    } else {
      if (fileObj && fileObj.serverUrl && fileObj.serverRelativeUrl) {
        const fileUrl = `${fileObj.serverUrl.trim()}${fileObj.serverRelativeUrl.trim()}`;
        setPreviewUrl(fileUrl); // Set the preview URL
        setIsModalOpen(true);   // Open the modal
      } else {
        //alert("Invalid file object. Cannot generate preview URL.");
      }
    }
  };
  const fetchChangeRequestTypes = async () => {
    try {
      const items = await sp.web.lists
        .getByTitle('ChangeRequestTypeMaster')
        .items.select('ID', 'ChangeRequestType', 'IsActive')
        // .filter('IsActive eq Yes') // Fetch only active items
        ();

      const changeRequestCheckboxes = items.map((item: any) => ({
        id: item.ID,
        name: item.ChangeRequestType,
        isActive: item.IsActive,
      }));
      // alert(changeRequestCheckboxes)
      setChangeRequestCheckboxes(changeRequestCheckboxes);
      return changeRequestCheckboxes;
    } catch (error) {
      console.error('Error fetching ChangeRequestTypeMaster:', error);
    }
  };
  const validateCheckboxSelection = () => {
    if (selectedCheckboxIds.length === 0) {
      setisCheckboxSectionHighlighted(true);
      return false;
    }
    return true;
  };
  // Handle checkbox selection
  const handleCheckboxChange = (id: number) => {
    const updatedSelectedIds =
      selectedCheckboxIds.indexOf(id) !== -1
        ? selectedCheckboxIds.filter((selectedId) => selectedId !== id)
        : [...selectedCheckboxIds, id];
    setselectedCheckboxIds(updatedSelectedIds);
    setisCheckboxSectionHighlighted(false);
  };
  const renderCheckboxes = () => {
    //const { changeRequestCheckboxes, selectedCheckboxIds } = this.state;

    return changeRequestCheckboxes.map((checkbox) => (

      <div className="col-lg-3">
        <div key={checkbox.id} className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id={`checkbox-${checkbox.id}`}
            // disabled={this.state.isReadonly} // Make the checkbox readonly if the condition is true
            // Use indexOf instead of includes
            checked={selectedCheckboxIds.indexOf(checkbox.id) !== -1}
            onChange={() => handleCheckboxChange(checkbox.id)}
          />
          <label className="form-check-label" htmlFor={`checkbox-${checkbox.id}`}>
            {checkbox.name}
          </label>
        </div>
      </div>
    ));
  };
  const deleteLocalFileAttachment = async (index: number, ImagepostArr: any[], columnName: string) => {
    try {
      // Extract the file information from the array
      const fileToDelete = ImagepostArr[index];

      if (!fileToDelete || !fileToDelete.fileUrl) {
        throw new Error("File URL not found");
      }

      // Delete the file from SharePoint document library
      const fileUrl = fileToDelete.fileUrl;
      console.log(fileUrl, "fileUrl")
      debugger
      const removeimage = await sp.web.getFileByServerRelativePath(fileUrl).recycle(); // Sends the file to the recycle bin
      console.log(removeimage, "removeimage")
      debugger
      // Remove the file from the MediaGalleryJSON column
      if (editID > 0) {
        const list = sp.web.lists.getByTitle("ChangeRequestList");
        const item = await list.items.getById(editID).select("AttachmentJson")();
        debugger
        console.log("items of MediaGalleryJSON", item)
        const AttachmentJSON = item.AttachmentJson ? JSON.parse(item.AttachmentJson) : [];

        // Filter out the deleted file from the JSON array
        const updatedGalleryJSON = AttachmentJSON.filter((image: any) => image.ID !== fileToDelete.ID);
        console.log(updatedGalleryJSON, "updatedGalleryJSON")
        debugger
        // Update the item in SharePoint
        await list.items.getById(editID).update({
          MediaGalleryJSON: JSON.stringify(updatedGalleryJSON),
        });
      }
      // Remove the file from the local array and update the state
      const updatedArray = [...ImagepostArr];
      updatedArray.splice(index, 1);
      setAttachmentarr(updatedArray);

      Swal.fire("Deleted successfully", "", "success");
    } catch (error) {
      console.error("Error deleting file:", error);
      Swal.fire("Error", error.message, "error");
    }
  };
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



                      <div style={{ clear: 'both', float: 'left', width: '100%' }} className="mt-3 border-top pt-1">
                        <button type="button" className="accordion4">
                          <span className="updatedorg">Strategy Department</span>
                        </button>
                        <div style={{ maxHeight: "50000px" }} className="panel4">
                          <ul id="myUL" className="mt-0">
                            <li>
                              <ul style={{ listStyle: "none" }} className="nested active">
                                <li style={{ paddingTop: "0px" }}>
                                  <span style={{ cursor: "pointer" }} className="box ng-binding check-box">
                                    <img src={require("../assets/folder-plus.png")} className="foldert" alt="folder" />
                                    <a href="testing.html">Change Request</a>
                                  </span>
                                </li>
                                <li style={{ paddingTop: "10px" }} className="ng-scope">
                                  <span style={{ cursor: "pointer" }} className="box ng-binding">
                                    <img src={require("../assets/folder-plus.png")} className="foldert" alt="folder" />
                                    Cancelled Documents
                                  </span>
                                </li>
                                <li style={{ paddingTop: "10px" }} className="ng-scope">
                                  <span style={{ cursor: "pointer" }} className="box ng-binding">
                                    <img src={require("../assets/folder-plus.png")} className="foldert" alt="folder" />
                                    Audit Planning
                                  </span>
                                  <ul style={{ listStyle: "none" }} className="nested">
                                    <li style={{ paddingTop: "10px" }} className="ng-scope">
                                      <a href="Hr-folder-structure.html">
                                        <span style={{ cursor: "pointer" }} className="box ng-binding">
                                          <img src={require("../assets/folder-plus.png")} className="foldert" alt="folder" />
                                          Memos
                                        </span>
                                      </a>
                                    </li>
                                    <li style={{ paddingTop: "10px" }} className="ng-scope">
                                      <a href="Hr-folder-structure.html">
                                        <span style={{ cursor: "pointer" }} className="box ng-binding">
                                          <img src={require("../assets/folder-plus.png")} className="foldert" alt="folder" />
                                          Audit Plan
                                        </span>
                                      </a>
                                    </li>
                                    <li style={{ paddingTop: "10px" }} className="ng-scope">
                                      <a href="Hr-folder-structure.html">
                                        <span style={{ cursor: "pointer" }} className="box ng-binding">
                                          <img src={require("../assets/folder-plus.png")} className="foldert" alt="folder" />
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
                                  <input type="date" id="RequestDate" name="RequestDate" className="form-control" value={formData.RequestDate} onChange={(e) => setFormData({ ...formData, RequestDate: e.target.value })} disabled={InputDisabled} />
                                </div>
                              </div>

                              <div className="col-lg-4 newpaddinput">

                                <div className="mb-3">
                                  <label htmlFor="DocumentCode" className="form-label">Request Type:<span className="text-danger">*</span></label>
                                  {/* <input type="text" id="example-email" name="example-email" className="form-control" placeholder="Search Document Code" value={formData.DocumentCode} /> */}
                                  <Select
                                    options={ReqType}
                                    value={selectedOptionReq}
                                    name="Request Type"
                                     className={`form-control ${(!ValidDraft) ? "border-on-error" : ""} ${(!ValidSubmit) ? "border-on-error" : ""}`}
                                    onChange={(selectedOption: any) => onSelectReq(selectedOption)}
                                    placeholder="Search Request Type" isDisabled={InputDisabled}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-4 newpaddinput">
                                {console.log("selectedOptionReqselectedOptionReq", selectedOptionReq)}
                                <div className="mb-3">
                                  <label htmlFor="DocumentCode" className="form-label">Document Code:</label>
                                  {/* <input type="text" id="example-email" name="example-email" className="form-control" placeholder="Search Document Code" value={formData.DocumentCode} /> */}
                                  <Select
                                    options={rows}
                                    value={selectedOption}
                                    name="DocumentCode"
                                    isClearable={true}
                                    //isOptionDisabled={() => selectedOptionReq.label == "Change Request for New Addition"}
                                    isSearchable={true}
                                     className={`form-control ${(!ValidDraft) ? "border-on-error" : ""} ${(!ValidSubmit) ? "border-on-error" : ""}`}
                                    onChange={(selectedOption: any) => onSelectDocCode(selectedOption)}
                                    placeholder="Search Document Code"
                                    isDisabled={selectedOptionReq == null || (selectedOptionReq != null && selectedOptionReq?.label == "Change Request for New Addition")}
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
                              <div className="col-lg-4 newpaddinput">

                                <div className="mb-3">
                                  <label htmlFor="DocumentCode" className="form-label">Amendment Type:<span className="text-danger">*</span></label>
                                  {/* <input type="text" id="example-email" name="example-email" className="form-control" placeholder="Search Document Code" value={formData.DocumentCode} /> */}
                                  <Select
                                    options={Amendtype}
                                    value={selectedOptionAmend}
                                    name="Amendment Type"
                                     className={`form-control ${(!ValidDraft) ? "border-on-error" : ""} ${(!ValidSubmit) ? "border-on-error" : ""}`}
                                    onChange={(selectedOption: any) => onSelectAmend(selectedOption)}
                                    placeholder="Search Amendment Type" isDisabled={InputDisabled}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-4 newpaddinput">

                                <div className="mb-3">
                                  <label htmlFor="DocumentCode" className="form-label">Classification:<span className="text-danger">*</span></label>
                                  {/* <input type="text" id="example-email" name="example-email" className="form-control" placeholder="Search Document Code" value={formData.DocumentCode} /> */}
                                  <Select
                                    options={Classificationopt}
                                    value={selectedOptionClass}
                                    name="Classification"
                                     className={`form-control ${(!ValidDraft) ? "border-on-error" : ""} ${(!ValidSubmit) ? "border-on-error" : ""}`}
                                    onChange={(selectedOption: any) => onSelectClassification(selectedOption)}
                                    placeholder="Search Classification" isDisabled={InputDisabled}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-4 newpaddinput">

                                <div className="mb-3">
                                  <label htmlFor="DocumentCode" className="form-label">Location:<span className="text-danger">*</span></label>
                                  {/* <input type="text" id="example-email" name="example-email" className="form-control" placeholder="Search Document Code" value={formData.DocumentCode} /> */}
                                  <Select
                                    options={LocationOpt}
                                    value={selectedOptionLoc}
                                    name="Location"
                                     className={`form-control ${(!ValidDraft) ? "border-on-error" : ""} ${(!ValidSubmit) ? "border-on-error" : ""}`}
                                    onChange={(selectedOption: any) => onSelectLocation(selectedOption)}
                                    placeholder="Search Location" isDisabled={InputDisabled}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-4 newpaddinput">

                                <div className="mb-3">
                                  <label htmlFor="DocumentCode" className="form-label">Custodian:<span className="text-danger">*</span></label>
                                  {/* <input type="text" id="example-email" name="example-email" className="form-control" placeholder="Search Document Code" value={formData.DocumentCode} /> */}
                                  <Select
                                    options={Custodianopt}
                                    value={selectedOptionCusto}
                                    name="Custodian"
                                    className={`form-control ${(!ValidDraft) ? "border-on-error" : ""} ${(!ValidSubmit) ? "border-on-error" : ""}`}
                                    onChange={(selectedOption: any) => onSelectCustodian(selectedOption)}
                                    placeholder="Search Custodian" isDisabled={InputDisabled}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-4 newpaddinput">

                                <div className="mb-3">
                                  <label htmlFor="DocumentCode" className="form-label">Document Type:<span className="text-danger">*</span></label>
                                  {/* <input type="text" id="example-email" name="example-email" className="form-control" placeholder="Search Document Code" value={formData.DocumentCode} /> */}
                                  <Select
                                    options={DocumentTypeOpt}
                                    value={selectedOptionDoctype}
                                    name="Document Type"
                                    className={`form-control ${(!ValidDraft) ? "border-on-error" : ""} ${(!ValidSubmit) ? "border-on-error" : ""}`}
                                    onChange={(selectedOption: any) => onSelectDocumentType(selectedOption)}
                                    placeholder="Search Document Type" isDisabled={InputDisabled}
                                  />
                                </div>
                              </div>
                              {editID == null &&
                                <div className="col-lg-4">

                                  <div className="mb-3">
                                    <label htmlFor="DocumentCode" className="form-label">Attachment:<span className="text-danger">*</span></label>
                                    {Attachmentarr[0] != false && Attachmentarr.length > 0 &&
                                      Attachmentarr != undefined ? Attachmentarr.length == 1 &&
                                    (<a style={{ fontSize: '0.875rem' }}
                                      //onClick={() => handlePreviewClick(Attachmentarr[0])}
                                      onClick={() => setShowModal(true)}>
                                      <FontAwesomeIcon icon={faPaperclip} />1 file Attached
                                    </a>) : ""
                                    }
                                    <input
                                      type="file"
                                      id="attachment"
                                      name="attachment"
                                      //disabled={handleSectionState('requestedBySection')}
                                       className={`form-control ${(!ValidDraft) ? "border-on-error" : ""} ${(!ValidSubmit) ? "border-on-error" : ""}`}
                                      onChange={(e) => onFileChange(e, "bannerimg", "Document")}
                                    />
                                  </div>
                                </div>
                              }
                              {console.log("editiiiID", editID)}
                              {(editID != null || (selectedOptionReq != null && selectedOptionReq?.label !== "Change Request for New Addition")) &&
                                // <div className="col-lg-8">

                                //                                                                 <div className="mb-3">
                                //                                                                     <label htmlFor="example-email" className="form-label">Document Link:</label>


                                //                                                                     <div className="text-dark mt-0"> <span onClick={() => OpenFile(DocumentLink)} style={{ color: "blue", cursor: "pointer" }}>{DocumentLink ? `${Tenant_URL}${DocumentLink?.FileRef}` : ""}</span>
                                //                                                                     </div>

                                //                                                                 </div>
                                //                                                             </div>

                                <div className="col-lg-4">
                                  <div className="mb-3">
                                    <label htmlFor="DocumentCode" className="form-label">Document Link:</label>
                                    {/* <input type="text" id="example-email" name="example-email" className="form-control" placeholder="Search Document Code" value={formData.DocumentCode} /> */}
                                    
                                    <div className="text-dark mt-0"> <span >
                                      <a onClick={() => setShowModal(true)} ><FontAwesomeIcon icon={faPaperclip} />1 file Attached</a>
                                      
                                    </span>
                                    </div>
                                    {/* <a style={{ fontSize: '0.875rem' }}
                                      //onClick={() => handlePreviewClick(Attachmentarr[0])}
                                      onClick={() => setShowModal(true)}>
                                      <FontAwesomeIcon icon={faPaperclip} />1 file Attached
                                    </a> */}
                                    {/* <div className="text-dark mt-0"> <span onClick={() => OpenFile(DocumentLink)} style={{ color: "blue", cursor: "pointer" }}>{DocumentLink ? `${Tenant_URL}${DocumentLink?.FileRef}` : ""}</span>
                                    </div> */}
                                    {/* <Link
                                      href={selectedOption != null && formData.AttachmentJson != "" && (JSON.parse(formData.AttachmentJson)?.serverUrl +
                                        JSON.parse(formData.AttachmentJson)?.serverRelativeUrl)}
                                      className="anchor"
                                      target="_blank"
                                    >
                                      {selectedOption != null && formData.AttachmentJson != "" && (JSON.parse(formData.AttachmentJson)?.serverUrl +
                                        JSON.parse(formData.AttachmentJson)?.serverRelativeUrl)}
                                    </Link> */}

                                  </div>
                                </div>
                              }
                            </div>
                          }
                        </div>
                      </div>

                      <div className="card">
                        <div className="card-body">
                          <div className='row'>
                            <div className='col-sm-12'>
                              <h4 className="header-title text-dark font-16 mb-3">Request Details</h4>
                              <h6>Change Request Type</h6>
                              <div className="row"> {renderCheckboxes()}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="card">
                        <div className="card-body">
                          <div className='row'>
                            <div className='col-sm-8'>
                              <h4 className="header-title text-dark font-16 mb-3">Description</h4>

                            </div>

                            <div className='col-sm-4'>
                              <div style={{ textAlign: "right" }} className="mt-2 float-end text-right">
                                {/* <i style={{ cursor: "pointer" }} onClick={addField}  className="fe-plus-circle  font-20 text-warning"></i> */}
                                {/* <i style={{ cursor: "pointer" }} className="fe-plus-circle  font-20 text-warning"></i> */}
                                {!InputDisabled && <img style={{ width: '30px', cursor: 'pointer', marginTop: '-7px' }} src={require("../assets/plus.png")} onClick={addCancelReason} className=''></img>}


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
                                  <th>Change Description</th>
                                  <th>Reason for Change</th>
                                  <th style={{ minWidth: "80px", maxWidth: "80px" }}>Action</th>
                                </tr>

                              </thead>
                              <tbody >
                                {console.log("cancellReasonn", cancellReason)}
                                {cancellReason.map((row, index) => (
                                  <tr key={index}> <td style={{ minWidth: "30px", maxWidth: "30px" }}>
                                    <div
                                      style={{ marginLeft: "4px" }}
                                      className="indexdesign"
                                    >
                                      {index + 1}</div></td>
                                    <td><input type="text" id="simpleinput" className='form-control' disabled={InputDisabled} 
                                      value={row.description}
                                      onChange={(e) => {
                                        const newRowscancellReason = [...cancellReason];
                                        newRowscancellReason[index].description = e.target.value;
                                        setcancellReason(newRowscancellReason);
                                      }}
                                    />

                                    </td>
                                    <td><input type="text" id="simpleinput" disabled={InputDisabled} 
                                      className={`form-control ${(!ValidDraft) ? "border-on-error" : ""} ${(!ValidSubmit) ? "border-on-error" : ""}`}
                                      value={row.reason}
                                      onChange={(e) => {
                                        const newRowscancellReason = [...cancellReason];
                                        newRowscancellReason[index].reason = e.target.value;
                                        setcancellReason(newRowscancellReason);
                                      }}
                                    /></td>
                                    {(modeValue === "" || modeValue === "edit" || InputDisabled != true) && <td style={{ minWidth: "80px", maxWidth: "80px" }}>
                                      <img src={require("../assets/recycle-bin.png")} className='sidebariconsmall' onClick={() => deleteLocalFile(index, cancellReason)}></img>
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
                      {console.log("editiiiiifhifassignmentt", editID, modeValue, InputDisabled)}
                      {modeValue === "approve" && editID != null && editID.ApprovalType === "Assignment" && editID.Status === "Pending" && editID.CurrentUserRole === "OES" &&
                        <div className="card">
                          <div className="card-body">
                            <div className='row'>
                              <div className='col-sm-8'>
                                <h4 className="header-title text-dark font-16 mb-3 ">Forward Approval To</h4>

                              </div>
                              <div className='col-sm-4'>
                                <div className="mt-0 mb-0 float-end text-right" style={{ textAlign: "right", paddingRight: "22px" }}>
                                  <img style={{ width: '34px' }} src={require("../assets/plus.png")} onClick={handleAddRow} className='' />

                                  {/* <i style={{ cursor: "pointer" }} onClick={handleAddRow} className="fe-plus-circle font-20 text-warning"></i> */}
                                </div>
                              </div>

                            </div>

                            <div style={{ overflow: 'inherit' }} className="table-responsive mt-3 pt-0">
                              <table className="mtbalenew  table-centered table-nowrap table-borderless mb-0 newtabledc" id="myTabl">
                                <thead >
                                  <tr>
                                    <th style={{ borderBottomLeftRadius: "0px" }}>Role</th>
                                    <th style={{ minWidth: '70px', maxWidth: '70px' }} >Level</th>
                                    <th >Approver Name</th>
                                    <th style={{ minWidth: '70px', maxWidth: '70px' }}>Action</th>
                                  </tr>
                                </thead>
                                <tbody style={{ maxHeight: "8007px" }}>
                                  {forwardToArr.map((row, index) => (
                                    <tr>
                                      <td className="ng-binding">
                                        <select className="form-select" onChange={(e) => onSelectRole(e, row.level)} value={row.role}>
                                          <option value="" selected>Select Role</option>
                                          {UserRoles.map((role: any, index: number) => (
                                            <option key={index} value={role.value}>{role.label}</option>
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
                                           className={`form-control ${(!ValidDraft) ? "border-on-error" : ""} ${(!ValidSubmit) ? "border-on-error" : ""}`}
                                          // onChange={(selectedOption: any) => onSelect(selectedOption)}
                                          onChange={(selectedOptions: any) => onSelectApprovers(selectedOptions, row.level)}
                                          placeholder="Enter Approver Name"
                                        />



                                      </td>
                                      <td style={{ minWidth: '70px', maxWidth: '70px' }}>
                                        {/* <i className="fe-trash-2 text-danger"></i> */}
                                        <img src={require("../../../CustomAsset/del.png")} onClick={() => handleDeleteRow(index)} className='' />

                                      </td>
                                    </tr>

                                  ))}

                                </tbody>
                              </table>
                            



                            <div className="row mt-3">
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
                            </div>
                          </div>
                        </div>
                      }
                      {console.log("editiiiiifhifapprovee", editID, modeValue, InputDisabled)}
                      {modeValue === "approve" && editID != null && editID.ApprovalType === "Assignment" && editID.Status === "Pending" && editID.CurrentUserRole === "OES" && (
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
                      )}

                      {/* ////////////Approval card */}
                      {console.log("editiiiiifhif", editID, modeValue, InputDisabled)}
                      {
                        //let forrework=ApprovalRequestItem && ApprovalRequestItem.IsRework=='Yes'&& ApprovalRequestItem.LevelSequence!=0;
                        // (InputDisabled && ApprovalRequestItem) || (ApprovalRequestItem && ApprovalRequestItem.IsRework == 'Yes' && ApprovalRequestItem.LevelSequence != 0) ? (
                        (InputDisabled && editID != null && modeValue === "approve" && editID.ApprovalType === "Approval" && editID.Status === "Pending") ? (
                          <WorkflowAction currentItem={editID} ctx={props.context} ContentType={CONTENTTYPE_ChangeDocument}
                            DisableApproval={false} DisableCancel={false}
                          // DisableApproval={ApprovalRequestItem && ApprovalRequestItem.IsRework == 'Yes' && ApprovalRequestItem.LevelSequence != 0}
                          // DisableCancel={ApprovalRequestItem && ApprovalRequestItem.IsRework == 'Yes' && ApprovalRequestItem.LevelSequence != 0}
                          //DisableReject={ApprovalRequestItem && ApprovalRequestItem.IsRework=='Yes'&& ApprovalRequestItem.LevelSequence!=0}
                          />
                        ) : (<div></div>)
                      }

                      {/* ////////////Audit History card */}
                      {editID !== null && editID.length != 0 && modeValue === "approve" &&
                        <WorkflowAuditHistory ContentItemId={editID} ContentType={CONTENTTYPE_ChangeDocument} ctx={props.context} />
                      }
                      {/* ////////////Audit History card */}

                      {/* ////////////Approval card */}


                      {/* </div> */}
                      {/* /////////////////%%%%%%%%%%%%%%%%%%%%%%%% */}

                   
                    {console.log("ediiiiitiitiititID", editID, InputDisabled, editItemID, MainEditItem, modeValue)}
                    <div className="row mt-3">
                      <div className="col-12 text-center">
                        {/* <a href="my-approval.html">   */}
                        {(((InputDisabled != true && editItemID == null && MainEditItem == null) || (MainEditItem?.Status === "Save as draft" && editID == null && (modeValue === "" || modeValue === "edit"))) || (editID && editID != null && editID.ApprovalType !== "Approval" && editID.ApprovalType !== "Assignment")) && <button type="button" className="btn btn-primary waves-effect waves-light m-1" onClick={handleSaveAsDraft}><i className="fe-check-circle me-1"></i> Save As Draft</button>}

                        {(((InputDisabled != true && editItemID == null && MainEditItem == null) || (MainEditItem?.Status === "Save as draft" && editID == null && (modeValue === "" || modeValue === "edit"))) || (editID && editID != null && editID.ApprovalType !== "Approval" && editID.ApprovalType !== "Assignment")) && <button type="button" className="btn btn-primary waves-effect waves-light m-1" onClick={handleFormSubmit}><i className="fe-check-circle me-1"></i> Submit</button>}
                        {((editID?.Status === "Pending" || editID?.Status === "Save as draft") && (editID.Level === 0 && editID.CurrentUserRole !== "OES" && editID.IsInitiator == "Yes")) && (modeValue === "approve") && <button type="button" className="btn btn-primary waves-effect waves-light m-1" onClick={() => ForwardInitiatorApproval("Save as draft")}><i className="fe-check-circle me-1"></i> Save As Draft</button>}

                        {((editID?.Status === "Pending" || editID?.Status === "Save as draft") && (editID.Level === 0 && editID.CurrentUserRole !== "OES" && editID.IsInitiator == "Yes")) && (modeValue === "approve") && <button type="button" className="btn btn-primary waves-effect waves-light m-1" onClick={() => ForwardInitiatorApproval("Approved")}><i className="fe-check-circle me-1"></i> Submit</button>}

                        {/* </a> */}
                        {/* <a href="../sites/EDeDMS/SitePages/EDCMAIN.aspx">       */}
                        <button type="button" className="btn cancel-btn waves-effect waves-light m-1" onClick={handleCancel}><i className="fe-x me-1"></i> Cancel</button>
                        {/* </a> */}
                      </div>
                    </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
              <Modal.Header closeButton>
                <Modal.Title>
                  <FontAwesomeIcon icon={faPaperclip} style={{ width: '40px',height:'25px' }} />
                  Attachment Details</Modal.Title>
                {/* {ImagepostArr1.length > 0 && showBannerModal && <Modal.Title>Media Images</Modal.Title>} */}
              </Modal.Header>
              <Modal.Body className="" id="style-5">
                <>
                  <table className="mtbalenew  table-bordered" style={{ fontSize: '0.75rem' }}>
                    <thead style={{ background: '#eef6f7' }}>
                      <tr>
                        <th>File Name</th>
                        <th style={{minWidth:'40px', maxWidth:'40px'}}> File Link </th>
                       
                        <th style={{minWidth:'40px', maxWidth:'40px'}}>Upload date</th>
                        {/* {modeValue == null && */}
                        {/* <th className='text-center'>Action</th> */}
                        {/* } */}
                      </tr>
                    </thead>
                    <tbody>
                      {console.log("Attachmentarrnmnm", Attachmentarr,DocumentLink)}
                      {/* {Attachmentarr.map((file: any, index: number) => ( */}
                        <tr >
                          {/* <td className='text-center'>{index + 1}</td> */}
                        <td>{DocumentLink ? `${Tenant_URL}${DocumentLink?.FileLeafRef}` : Attachmentarr && Attachmentarr[0]?.fileName}</td>
                          <td style={{textAlign:'center',minWidth:'40px', maxWidth:'40px'}}>
                            <FontAwesomeIcon icon={faDownload} style={{ width: '35px', height: '30px' }} 
                            onClick={() => OpenFile(DocumentLink ? DocumentLink : Attachmentarr && Attachmentarr[0]?.fileUrl)}/>
                            {/* <Link
                              href={file.fileUrl}
                              className="anchor"
                              target="_blank"
                            >
                              {file.fileUrl}
                            </Link> */}
                          </td>
                        <td style={{textAlign:'center',minWidth:'40px', maxWidth:'40px'}}>{DocumentLink ? moment(DocumentLink?.Created).format("DD-MMM-YYYY") : Attachmentarr && moment(Attachmentarr[0]?.Created).format("DD-MMM-YYYY")}</td>
                          {/* <td>{file.fileName}</td>
                          <td className='text-right'>{file.fileSize}</td> */}
                          {/* <td className='text-center'>
                            <img src={require("../../../CustomAsset/trashed.svg")} style={{ width: '15px' }}
                              onClick={() => deleteLocalFileAttachment(index, Attachmentarr, "Gallery")} /> </td> */}
                        </tr>
                      {/* ))} */}
                    </tbody>
                  </table>
                </>
              </Modal.Body>
            </Modal>
          </div>
        </div>
      </div>
    </div >
  );
}

const ChangeDocumentRequest: React.FC<IChangeDocumentRequestProps> = (props) => (
  <Provider>
    <ChangeDocumentRequestContext props={props} />
  </Provider>
);


export default ChangeDocumentRequest
