import React, { useEffect, useRef, useState } from 'react'
import { IEventFormProps } from './IEventFormProps';
import { SPFI } from '@pnp/sp/presets/all';
import "../../../Assets/Figtree/Figtree-VariableFont_wght.ttf";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../CustomCss/mainCustom.scss";
import "../../verticalSideBar/components/VerticalSidebar.scss";
import VerticalSideBar from '../../verticalSideBar/components/VerticalSideBar';
import UserContext from '../../../GlobalContext/context';
import Provider from '../../../GlobalContext/provider';
import { useMediaQuery } from 'react-responsive';
let hidesavasdraft : string = 'false';
import context from '../../../GlobalContext/context';
import CustomBreadcrumb from '../../../CustomJSComponents/CustomBreadcrumb/CustomBreadcrumb';
import { allowstringonly, getCurrentUser, getEntity } from '../../../APISearvice/CustomService';
import { getUrl } from '../../../APISearvice/MediaService';
import { decryptId } from '../../../APISearvice/CryptoService';
import { addItem, getEventByID, updateItem, uploadFileBanner } from "../../../APISearvice/Eventmaster";
import "../../../CustomJSComponents/CustomForm/CustomForm.scss";
import Swal from 'sweetalert2';
import 'react-quill/dist/quill.snow.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';
import "../components/addEventMaster.scss";
import { uploadFile, uploadFileToLibrary } from '../../../APISearvice/AnnouncementsService';
import { Button, Modal } from 'react-bootstrap';
import { getSP } from '../loc/pnpjsConfig';
import HorizontalNavbar from '../../horizontalNavBar/components/HorizontalNavBar';
import { AddContentLevelMaster, AddContentMaster, getApprovalConfiguration, getLevel, UpdateContentMaster } from '../../../APISearvice/ApprovalService';
import { Delete, PlusCircle } from 'react-feather';
import Multiselect from 'multiselect-react-dropdown';
import { WorkflowAction } from '../../../CustomJSComponents/WorkflowAction/WorkflowAction';
import { getUrlParameterValue } from '../../../Shared/Helper';
import { FormSubmissionMode } from '../../../Shared/Interfaces';
import { WorkflowAuditHistory } from '../../../CustomJSComponents/WorkflowAuditHistory/WorkflowAuditHistory';
import { CONTENTTYPE_Event, LIST_TITLE_ContentMaster, LIST_TITLE_EventMaster, LIST_TITLE_MyRequest } from '../../../Shared/Constants';
import moment from 'moment';
let mode = "";
const HelloWorldContext = ({ props }: any) => {
  const sp: SPFI = getSP();
  console.log(sp, 'sp');
    
    const [show, setShow] = useState(false);
    const [modalImageSrc, setModalImageSrc] = useState('');
  
    const handleClose = () => setShow(false);
    const handleShow = (src:any) => {
      setModalImageSrc(src);
      setShow(true);
    };
  
    useEffect(() => { 
      // alert("useEffect called");
      const currentUrl = window.location.href;
      const urlParams = new URLSearchParams(window.location.search);
      const superadminedit = urlParams.get('superadminedit');
      console.log("Superadminedit value:", superadminedit);
      if (superadminedit) {

        // alert(`super admin edit ${superadminedit}`)
        console.log("Superadminedit value:", superadminedit);
        hidesavasdraft = 'true'

        // alert(hidesavasdraft)
        // alert(`${typeof(hidesavasdraft)} , ${hidesavasdraft}`)
        
      } else {
        // alert(`else super admin edit ${superadminedit}`)
        console.log("Superadminedit parameter not found.");
      }
    }, []);
  // const { useHide }: any = React.useContext(UserContext);
  // const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const { useHide }: any = React.useContext(UserContext);
  console.log('This function is called only once', useHide);
  const elementRef = React.useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const context = React.useContext(UserContext);
  const { setHide }: any = context;
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [pageValue, setpage] = React.useState("");
  const siteUrl = props.siteUrl;
  const videositeurl = props.siteUrl.split("/sites")[0];
  const tenantUrl = props.siteUrl.split("/sites/")[0];
  const [currentUser, setCurrentUser] = React.useState(null)
  const [EnityData, setEnityData] = React.useState([])
  const [editForm, setEditForm] = React.useState(false);
  const [editID, setEditID] = React.useState(null);
  const [Url, setBaseUrl] = React.useState({});
  const [BnnerImagepostArr, setBannerImagepostArr] = React.useState([]);
  const [EventGalleryArr, setEventGalleryArr] = React.useState([]);
  const [EventGalleryArr1, setEventGalleryArr1] = React.useState([]);
  const [EventThumbnailArr, setEventThumbnailArr] = React.useState([]);
  const [EventThumbnailArr1, setEventThumbnailArr1] = React.useState([]);
  const [EventGalleryArrIdsArrs, setEventGalleryArrIdsArr] = React.useState([]);

  const [showImgModal, setShowImgTable] = React.useState(false);
  const [EventThumbnailIdsArr, setEventThumbnailIdsArr] = React.useState([]);
  const [showModal, setShowModal] = React.useState(false);
  const [showDocTable, setShowDocTable] = React.useState(false);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedRegistrationDueDate, setSelectedRegistrationDueDate] = useState("");

  const [ApprovalMode, setApprovalMode] = React.useState(false);
  const [ApprovalRequestItem, setApprovalRequestItem] = React.useState(null);
  const [InputDisabled, setInputDisabled] = React.useState(false);
  const [ValidDraft, setValidDraft] = React.useState(true);
  const [ValidSubmit, setValidSubmit] = React.useState(true);
  const [FormItemId, setFormItemId] = React.useState(null);
  const [Loading, setLoading] = React.useState(false);
  //#region State to hold form data
  //  const [formData, setFormData] = React.useState({
  //   title: "",
  //   category: "",
  //   entity: "",
  //   Type: "",
  //   description: "",
  //   overview: "",
  //   FeaturedAnnouncement: false
  // });
  const [formData, setFormData] = React.useState({
    EventName: "",
    EventDate: "",
    RegistrationDueDate: "",
    EntityId: 0,
    EventAgenda: "",
    Overview: "",
    Status: "",
  });
  const [richTextValues, setRichTextValues] = React.useState<{ [key: string]: string }>({});
  const [levels, setLevel] = React.useState([]);
  const [rows, setRows] = React.useState<any>([]);
  //#region Breadcrumb
  const Breadcrumb = [
    {
      "MainComponent": "Settings",
      "MainComponentURl": `${siteUrl}/SitePages/Settings.aspx`
    },
    {
      "ChildComponent": "Add-Event",
      "ChildComponentURl": `${siteUrl}/SitePages/EventMaster.aspx`
    }
  ]
  //#endregion
  React.useEffect(() => {
    ApiCallFunc()
    let page = getUrlParameterValue('page');
    setpage(page);
    mode = getUrlParameterValue('mode');
    if (mode && mode == 'approval') {
      setApprovalMode(true);
      let requestid = getUrlParameterValue('requestid');
      setInputDisabled(true);
      sp.web.lists.getByTitle('ARGMyRequest').items.getById(Number(requestid))().then(itm => {
        setApprovalRequestItem(itm);
        setInputDisabled(true && (!itm.IsRework || itm.IsRework == "No"))
        //setInputDisabled(ApprovalMode)
      })
    }
    else if (mode && mode == 'view') {
      setInputDisabled(true);
    }


    console.log('This function is called only once', useHide);

    const showNavbar = (
      toggleId: string,
      navId: string,
      bodyId: string,
      headerId: string
    ) => {
      const toggle = document.getElementById(toggleId);
      const nav = document.getElementById(navId);
      const bodypd = document.getElementById(bodyId);
      const headerpd = document.getElementById(headerId);

      if (toggle && nav && bodypd && headerpd) {
        toggle.addEventListener('click', () => {
          nav.classList.toggle('show');
          toggle.classList.toggle('bx-x');
          bodypd.classList.toggle('body-pd');
          headerpd.classList.toggle('body-pd');
        });
      }
    };

    showNavbar('header-toggle', 'nav-bar', 'body-pd', 'header');

    const linkColor = document.querySelectorAll('.nav_link');

    // const [BnnerImagepostArr, setBannerImagepostArr] = React.useState([]);
    function colorLink(this: HTMLElement) {
      if (linkColor) {
        linkColor.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
      }
    }

    linkColor.forEach(l => l.addEventListener('click', colorLink));
  }, [useHide]);
  // Media query to check if the screen width is less than 768px
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const handleSidebarToggle = (bol: boolean) => {
    setIsSidebarOpen((prevState: any) => !prevState);
    setHide(!bol);
    document.querySelector(".sidebar")?.classList.toggle("close");
  };

  //#region Events
  const handleChangeCheckBox = (name: string, value: string | boolean) => {
    setFormData((prevValues) => ({
      ...prevValues,
      [name]: value === true ? true : false, // Ensure the correct boolean value is set for checkboxes
    }));
  };
  const onChange = async (name: string, value: any) => {
    //debugger
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name == "EntityId") {
      //ARGApprovalConfiguration
      const rowData: any[] = await getApprovalConfiguration(sp, Number(value)) //baseUrl
      const initialRows = rowData.map((item: any) => ({
        id: item.Id,
        Level: item.Level.Level,
        LevelId: item.LevelId,
        approvedUserListupdate: item.Users.map((user: any) => ({
          id: user.ID,
          name: user.Title,
          email: user.EMail
        })),
        selectionType: 'All' // default selection type, if any
      }));
      setRows(initialRows);
    }

  };
  // Function to fetch or return the initial description value
  const getDescription = (des: any) => {
    // You can fetch this from an API, or return dynamic content.
    return des;
  };
  const formats = [
    "header", "height", "bold", "italic",
    "underline", "strike", "blockquote",
    "list", "color", "bullet", "indent",
    "link", "image", "align", "size",
  ];

  const modules = {
    toolbar: [
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" }
      ],
      [{ "color": ["#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466", 'custom-color'] }],
    ]
  };
  const validateForm = async (formsubmode: FormSubmissionMode) => {
    const { EventName, EventDate, EventAgenda, RegistrationDueDate, EntityId, Overview } = formData;
    const { description } = richTextValues;
    let valid = true;
    setValidDraft(true);
    setValidSubmit(true);
    let validatetitlelength = false;
    let validateTitle = false;
    let errormsg = "";
    if (EventName !== "") {
      validatetitlelength = EventName.length <= 100;
      validateTitle = EventName !== "" && await allowstringonly(EventName);
    }
    if (EventName !== "" && !validateTitle && validatetitlelength) {
      errormsg = "No special character allowed in Title";
      valid = false;
    } else if (EventName !== "" && validateTitle && !validatetitlelength) {
      errormsg = "Title must be less than 255 characters";
      valid = false;
    }
    if (formsubmode == FormSubmissionMode.DRAFT) {
      if (!EventName) {
        valid = false;
      }
      else if (EventDate && new Date(EventDate).getTime() < new Date().getTime()) {
        valid = false;
      }
      else if (RegistrationDueDate && new Date(RegistrationDueDate).getTime() < new Date().getTime()) {
        valid = false;
      }
      else if (EventDate && RegistrationDueDate && new Date(RegistrationDueDate).getTime() > new Date(EventDate).getTime()) {
        valid = false;
      }
      setValidDraft(valid);
    }
    else {
      if (!EventName) {
        valid = false;
      }
      //  else if (!EventDate || (EventDate && moment(new Date(EventDate)).format("DD-MM-YYYY") < moment(new Date()).format("DD-MM-YYYY"))) {
      //   valid = false;
      // }
      else if (!EventDate || (EventDate && new Date(EventDate).getTime() < new Date().getTime())) {
        valid = false;
      }
      else if (!RegistrationDueDate || RegistrationDueDate && new Date(RegistrationDueDate).getTime() < new Date().getTime()) {
        valid = false;
      }
      else if (EventDate && RegistrationDueDate && new Date(RegistrationDueDate).getTime() > new Date(EventDate).getTime()) {
        valid = false;
      }
      // else if (!RegistrationDueDate || RegistrationDueDate && moment(new Date(RegistrationDueDate)).format("DD-MM-YYYY") < moment(new Date()).format("DD-MM-YYYY")) {
      //   valid = false;
      // }
      // else if (EventDate && RegistrationDueDate && moment(new Date(RegistrationDueDate)).format("DD-MM-YYYY") > moment(new Date(EventDate)).format("DD-MM-YYYY")) {
      //   valid = false;
      // }
      else if (!EntityId) {
        valid = false;
      }
      else if (BnnerImagepostArr.length == 0) {
        valid = false;
      }
      // else if (EventGalleryArr1.length == 0) {
      //   valid = false;
      // }
      setValidSubmit(valid)
    }
    console.log("new Date(RegistrationDueDate) > new Date(EventDate)", EventGalleryArr1.length, BnnerImagepostArr.length, valid);

    if (!valid && (EventDate && RegistrationDueDate && new Date(RegistrationDueDate).getTime() > new Date(EventDate).getTime())) {
      Swal.fire('Registration date cannot be later than the event date.');
    } else if (!valid && (EventDate && new Date(EventDate).getTime() < new Date().getTime())) {
      if(hidesavasdraft === 'true'){
        valid = true;
      }else{
        Swal.fire('Event date cannot be earlier than today.');
      }
     
    }
    else if (!valid && (RegistrationDueDate && new Date(RegistrationDueDate).getTime() < new Date().getTime())) {
      Swal.fire('Registration date cannot be earlier than today.');
    }
    else {
      Swal.fire(errormsg !== "" ? errormsg : 'Please fill the mandatory fields.');
    }


    return valid;
  };


  //#endregion
  //#region  Submit Form
  //    else
  // if (EventDate && moment(new Date(EventDate)).format("DD-MM-YYYY") >= moment(new Date()).format("DD-MM-YYYY")) {
  //   Swal.fire(errormsg !== "" ? errormsg : 'Please fill the mandatory fields.');
  // } else
  //   if (!valid && (EventDate && moment(new Date(EventDate)).format("DD-MM-YYYY") >= moment(new Date()).format("DD-MM-YYYY")) &&
  //     (EventDate && RegistrationDueDate && moment(new Date(RegistrationDueDate)).format("DD-MM-YYYY") <= moment(new Date(EventDate)).format("DD-MM-YYYY"))) {
  //     Swal.fire(errormsg !== "" ? errormsg : 'Please fill the mandatory fields.');
  //   }
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
            //console.log("Form Submitted:", formValues, bannerImages, galleryImages, documents);
            //debugger
            setLoading(true);
            let bannerImageArray: any = {};
            let galleryIds: any[] = [];
            let documentIds: any[] = [];
            let galleryArray: any[] = [];
            let documentArray: any[] = [];

            // formData.FeaturedAnnouncement === "on"?  true :false;

            // Upload Banner Images
            if (BnnerImagepostArr.length > 0 && BnnerImagepostArr[0]?.files?.length > 0) {
              for (const file of BnnerImagepostArr[0].files) {
                //  const uploadedBanner = await uploadFile(file, sp, "Documents", Url);
                bannerImageArray = await uploadFileBanner(file, sp, "Documents", tenantUrl);
              }
            }
            else if (BnnerImagepostArr.length > 0) {
              bannerImageArray = BnnerImagepostArr[0];
            }
            else {
              bannerImageArray = null
            }
            const eventDate = new Date(formData.EventDate).toISOString().split("T")[0];
            const RegistrationDueDate = new Date(formData.RegistrationDueDate).toISOString().split("T")[0];
            // update Post
            const postPayload = {
              EventName: formData.EventName,
              Overview: formData.Overview,
              EventAgenda: formData.EventAgenda,
              EntityId: Number(formData.EntityId),
              Status: formData.Status,
              RegistrationDueDate: RegistrationDueDate,
              EventDate: eventDate,
              AuthorId: currentUser.Id,
              image: bannerImageArray != "{}" && JSON.stringify(bannerImageArray)
              // EventThumbnail: EventThumbnailArr != "{}" && JSON.stringify(EventThumbnailArr)
            };
            console.log(postPayload);

            const postResult = await updateItem(postPayload, sp, editID);
            const postId = postResult?.data?.ID;
            //debugger
            // if (!postId) {
            //   console.log("Post creation failed.");
            //   return;
            // }

            // Upload Gallery Images
            // Upload Gallery Images
            if (EventGalleryArr[0]?.files?.length > 0) {
              for (let i = 0; i < EventGalleryArr[0]?.files.length; i++) {

                const uploadedGalleryImage = await uploadFileToLibrary(EventGalleryArr[0]?.files[i], sp, "EventGallery");
                if (uploadedGalleryImage != null) {
                  galleryIds = galleryIds.concat(uploadedGalleryImage.map((item: { ID: any }) => item.ID));
                  if (EventGalleryArr1.length > 0) {

                    EventGalleryArr1.push(uploadedGalleryImage[0])
                    const updatedData = EventGalleryArr1.filter(item => item.ID !== 0);
                    console.log(updatedData, 'updatedData');
                    galleryArray = updatedData;


                    EventGalleryArrIdsArrs.push(galleryIds[0]) //galleryIds.push(EventGalleryIdsArr)
                    galleryIds = EventGalleryArrIdsArrs



                  }
                  else {
                    galleryArray.push(uploadedGalleryImage);
                  }
                }

              }
            }
            else {
              galleryIds = EventGalleryArrIdsArrs
              galleryArray = EventGalleryArr1;
            }
            // Upload Documents
            if (EventThumbnailArr[0]?.files?.length > 0) {
              for (let i = 0; i < EventThumbnailArr[0]?.files.length; i++) {
                const uploadedDocument = await uploadFileToLibrary(EventThumbnailArr[0]?.files[i], sp, "EventThumbnail");
                if (uploadedDocument != null) {
                  documentIds = documentIds.concat(uploadedDocument.map((item: { ID: any }) => item.ID));
                  if (EventThumbnailArr1.length > 0) {
                    EventThumbnailArr1.push(uploadedDocument[0])
                    // documentArray.push(EventThumbnailArr1)
                    const updatedData = EventThumbnailArr1.filter(item => item.ID !== 0);
                    console.log(updatedData, 'updatedData');
                    documentArray = updatedData;

                    EventThumbnailIdsArr.push(documentIds[0])//.push(EventThumbnailIdsArr)
                    documentIds = EventThumbnailIdsArr
                  }
                  else {
                    documentArray.push(uploadedDocument);
                  }
                }
              }
            }
            else {
              documentIds = EventThumbnailIdsArr;
              documentArray = EventThumbnailArr1;
            }
            if (galleryArray.length > 0) {
              let ars = galleryArray.filter(x => x.ID == 0)
              if (ars.length > 0) {
                for (let i = 0; i < ars.length; i++) {
                  galleryArray.slice(i, 1)
                }
              }
            }

            if (documentArray.length > 0) {
              let arsdoc = documentArray.filter(x => x.ID == 0)
              if (arsdoc.length > 0) {
                for (let i = 0; i < arsdoc.length; i++) {
                  documentArray.slice(i, 1)
                }
              }
            }

            console.log(documentIds, 'documentIds');
            console.log(galleryIds, 'galleryIds');
            // Update Post with Gallery and Document Information
            const updatePayload = {
              ...(galleryIds.length > 0 && {
                EventGalleryId: galleryIds,

                EventGalleryJson: JSON.stringify(flatArray(galleryArray)),
              }),
              ...(documentIds.length > 0 && {
                EventThumbnailId: documentIds,
                EventThumbnailJson: JSON.stringify(flatArray(documentArray)),
              }),
            };

            if (Object.keys(updatePayload).length > 0) {
              const updateResult = await updateItem(updatePayload, sp, editID);
              console.log("Update Result:", updateResult);
            }
            let arr = {
              ContentID: editID,
              ContentName: "ARGEventMaster",
              Status: "Pending",
              EntityId: Number(formData.EntityId),
              SourceName: "Event",
              Title: formData.EventName,
              ReworkRequestedBy: "Initiator"
            }

            let boolval = false;
            if (ApprovalRequestItem && ApprovalRequestItem.IsRework && ApprovalRequestItem.IsRework == 'Yes') {
              const ctmasteritm = await sp.web.lists.getByTitle(LIST_TITLE_ContentMaster).items.filter('ContentID eq ' + ApprovalRequestItem.ContentId + " and SourceName eq '" + CONTENTTYPE_Event + "'")();
              if (ctmasteritm && ctmasteritm.length > 0) {
                let updaterec = { 'Status': 'Pending', 'ReworkRequestedBy': 'Initiator' }
                if (ApprovalRequestItem.LevelSequence == 1) updaterec.ReworkRequestedBy = "Level 1";
                await UpdateContentMaster(sp, ctmasteritm[0].Id, updaterec);
                await sp.web.lists.getByTitle(LIST_TITLE_MyRequest).items.getById(ApprovalRequestItem.Id).update({ 'Status': 'Submitted' });
                await sp.web.lists.getByTitle(LIST_TITLE_EventMaster).items.getById(editID).update({ 'Status': 'Submitted' });
                boolval = true;
              }
            }
            else {
              await AddContentMaster(sp, arr)
              boolval = await handleClick(editID, "Event", Number(formData.EntityId))
            }
            if (boolval == true) {
              setLoading(false);
              Swal.fire('Submitted successfully.', '', 'success');
              sessionStorage.removeItem("EventId")
              setTimeout(() => {
                window.location.href = `${siteUrl}/SitePages/EventMaster.aspx`;
              }, 2000);
            }
          }

        })
      }
      else {
        Swal.fire({
          // title: 'Do you want to save?',
          title: 'Do you want to submit this request?',
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          icon: 'warning'
        }
        ).then(async (result) => {
          //console.log("Form Submitted:", formValues, bannerImages, galleryImages, documents);
          if (result.isConfirmed) {
            //debugger
            setLoading(true);
            let bannerImageArray: any = {};
            let galleryIds: any[] = [];
            let documentIds: any[] = [];
            let galleryArray: any[] = [];
            let documentArray: any[] = [];

            // formData.FeaturedAnnouncement === "on"?  true :false;



            //   Upload Banner Images
            if (BnnerImagepostArr.length > 0 && BnnerImagepostArr[0]?.files?.length > 0) {
              for (const file of BnnerImagepostArr[0].files) {
                //  const uploadedBanner = await uploadFile(file, sp, "Documents", Url);
                bannerImageArray = await uploadFileBanner(file, sp, "Documents", tenantUrl);
              }
            }
            //debugger
            const eventDate = new Date(formData.EventDate).toISOString().split("T")[0];
            const RegistrationDueDate = new Date(formData.RegistrationDueDate).toISOString().split("T")[0];
            // Create Post
            const postPayload = {
              EventName: formData.EventName,
              Overview: formData.Overview,
              EventAgenda: formData.EventAgenda,
              EntityId: Number(formData.EntityId),
              Status: "Submitted",
              RegistrationDueDate: RegistrationDueDate,
              EventDate: eventDate,
              AuthorId: currentUser.Id,
              image: bannerImageArray != "{}" && JSON.stringify(bannerImageArray)
            };
            console.log(postPayload);

            const postResult = await addItem(postPayload, sp);
            const postId = postResult?.data?.ID;
            //debugger
            if (!postId) {
              console.error("Post creation failed.");
              return;
            }

            console.log(EventGalleryArr, 'EventGalleryArr', EventGalleryArr1, 'EventGalleryArr1', EventThumbnailArr1, 'EventThumbnailArr1', EventThumbnailArr, 'EventThumbnailArr');

            // Upload Gallery Images
            if (EventGalleryArr.length > 0) {
              for (let i = 0; i < EventGalleryArr[0]?.files.length; i++) {
                const uploadedGalleryImage = await uploadFileToLibrary(EventGalleryArr[0]?.files[i], sp, "EventGallery");

                galleryIds = galleryIds.concat(uploadedGalleryImage.map((item: { ID: any }) => item.ID));
                galleryArray.push(uploadedGalleryImage);
              }
            }

            // Upload Documents
            if (EventThumbnailArr.length > 0) {
              for (let i = 0; i < EventThumbnailArr[0]?.files.length; i++) {
                const uploadedDocument = await uploadFileToLibrary(EventThumbnailArr[0]?.files[i], sp, "EventThumbnail");
                documentIds = documentIds.concat(uploadedDocument.map((item: { ID: any }) => item.ID));
                documentArray.push(uploadedDocument);
              }
            }

            // Update Post with Gallery and Document Information
            const updatePayload = {
              ...(galleryIds.length > 0 && {
                EventGalleryId: galleryIds,
                EventGalleryJson: JSON.stringify(flatArray(galleryArray)),
              }),
              ...(documentIds.length > 0 && {
                EventThumbnailId: documentIds,
                EventThumbnailJson: JSON.stringify(flatArray(documentArray)),
              }),
            };

            if (Object.keys(updatePayload).length > 0) {
              const updateResult = await updateItem(updatePayload, sp, postId);
              console.log("Update Result:", updateResult);
            }
            let arr = {
              ContentID: postId,
              ContentName: "ARGEventMaster",
              Status: "Pending",
              EntityId: Number(formData.EntityId),
              SourceName: "Event",
              Title: formData.EventName,
              ReworkRequestedBy: "Initiator"
            }
            await AddContentMaster(sp, arr)
            const boolval = await handleClick(postId, "Event", Number(formData.EntityId))
            if (boolval == true) {
              setLoading(false);
              Swal.fire('Submitted successfully.', '', 'success');
              sessionStorage.removeItem("bannerId")
              setTimeout(() => {
                window.location.href = `${siteUrl}/SitePages/EventMaster.aspx`;
              }, 2000);
            }
          }
        })

      }
    }

  }
  //#endregion

  //#region  save as draft

  const handleSaveAsDraft = async () => {
    if (await validateForm(FormSubmissionMode.DRAFT)) {
      if (editForm) {
        Swal.fire({
          // title: 'Do you want to update?',
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
            //console.log("Form Submitted:", formValues, bannerImages, galleryImages, documents);
            //debugger
            setLoading(true);
            let bannerImageArray: any = {};
            let galleryIds: any[] = [];
            let documentIds: any[] = [];
            let galleryArray: any[] = [];
            let documentArray: any[] = [];

            // formData.FeaturedAnnouncement === "on"?  true :false;

            // Upload Banner Images
            if (BnnerImagepostArr.length > 0 && BnnerImagepostArr[0]?.files?.length > 0) {
              for (const file of BnnerImagepostArr[0].files) {
                //  const uploadedBanner = await uploadFile(file, sp, "Documents", Url);
                bannerImageArray = await uploadFileBanner(file, sp, "Documents", tenantUrl);
              }
            }
            else {
              bannerImageArray = null
            }
            const eventDate = new Date(formData.EventDate).toISOString().split("T")[0];
            const RegistrationDueDate = new Date(formData.RegistrationDueDate).toISOString().split("T")[0];
            // update Post
            const postPayload = {
              EventName: formData.EventName,
              Overview: formData.Overview,
              EventAgenda: formData.EventAgenda,
              EntityId: Number(formData.EntityId),
              Status: "Save as draft",
              RegistrationDueDate: RegistrationDueDate,
              EventDate: eventDate,
              AuthorId: currentUser.Id,
              image: bannerImageArray != "{}" && JSON.stringify(bannerImageArray)
              // EventThumbnail: EventThumbnailArr != "{}" && JSON.stringify(EventThumbnailArr)
            };
            console.log(postPayload);

            const postResult = await updateItem(postPayload, sp, editID);
            const postId = postResult?.data?.ID;
            //debugger
            // if (!postId) {
            //   console.log("Post creation failed.");
            //   return;
            // }

            // Upload Gallery Images
            // Upload Gallery Images
            if (EventGalleryArr[0]?.files?.length > 0) {
              for (let i = 0; i < EventGalleryArr[0]?.files.length; i++) {

                const uploadedGalleryImage = await uploadFileToLibrary(EventGalleryArr[0]?.files[i], sp, "EventGallery");
                if (uploadedGalleryImage != null) {
                  galleryIds = galleryIds.concat(uploadedGalleryImage.map((item: { ID: any }) => item.ID));
                  if (EventGalleryArr1.length > 0) {

                    EventGalleryArr1.push(uploadedGalleryImage[0])
                    const updatedData = EventGalleryArr1.filter(item => item.ID !== 0);
                    console.log(updatedData, 'updatedData');
                    galleryArray = updatedData;


                    EventGalleryArrIdsArrs.push(galleryIds[0]) //galleryIds.push(EventGalleryIdsArr)
                    galleryIds = EventGalleryArrIdsArrs



                  }
                  else {
                    galleryArray.push(uploadedGalleryImage);
                  }
                }

              }
            }
            else {
              galleryIds = EventGalleryArrIdsArrs
              galleryArray = EventGalleryArr1;
            }
            // Upload Documents
            if (EventThumbnailArr[0]?.files?.length > 0) {
              for (let i = 0; i < EventThumbnailArr[0]?.files.length; i++) {
                const uploadedDocument = await uploadFileToLibrary(EventThumbnailArr[0]?.files[i], sp, "EventThumbnail");
                if (uploadedDocument != null) {
                  documentIds = documentIds.concat(uploadedDocument.map((item: { ID: any }) => item.ID));
                  if (EventThumbnailArr1.length > 0) {
                    EventThumbnailArr1.push(uploadedDocument[0])
                    // documentArray.push(EventThumbnailArr1)
                    const updatedData = EventThumbnailArr1.filter(item => item.ID !== 0);
                    console.log(updatedData, 'updatedData');
                    documentArray = updatedData;

                    EventThumbnailIdsArr.push(documentIds[0])//.push(EventThumbnailIdsArr)
                    documentIds = EventThumbnailIdsArr
                  }
                  else {
                    documentArray.push(uploadedDocument);
                  }
                }
              }
            }
            else {
              documentIds = EventThumbnailIdsArr;
              documentArray = EventThumbnailArr1;
            }
            if (galleryArray.length > 0) {
              let ars = galleryArray.filter(x => x.ID == 0)
              if (ars.length > 0) {
                for (let i = 0; i < ars.length; i++) {
                  galleryArray.slice(i, 1)
                }
              }
            }

            if (documentArray.length > 0) {
              let arsdoc = documentArray.filter(x => x.ID == 0)
              if (arsdoc.length > 0) {
                for (let i = 0; i < arsdoc.length; i++) {
                  documentArray.slice(i, 1)
                }
              }
            }

            console.log(documentIds, 'documentIds');
            console.log(galleryIds, 'galleryIds');
            // Update Post with Gallery and Document Information
            const updatePayload = {
              ...(galleryIds.length > 0 && {
                EventGalleryId: galleryIds,

                EventGalleryJson: JSON.stringify(flatArray(galleryArray)),
              }),
              ...(documentIds.length > 0 && {
                EventThumbnailId: documentIds,
                EventThumbnailJson: JSON.stringify(flatArray(documentArray)),
              }),
            };

            if (Object.keys(updatePayload).length > 0) {
              const updateResult = await updateItem(updatePayload, sp, editID);
              console.log("Update Result:", updateResult);
            }
          }
          setLoading(false);
          Swal.fire('Saved successfully.', '', 'success');
          sessionStorage.removeItem("EventId")
          setTimeout(() => {
            window.location.href = `${siteUrl}/SitePages/EventMaster.aspx`;
          }, 2000);



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
            //debugger
            setLoading(true);
            let bannerImageArray: any = {};
            let galleryIds: any[] = [];
            let documentIds: any[] = [];
            let galleryArray: any[] = [];
            let documentArray: any[] = [];

            // formData.FeaturedAnnouncement === "on"?  true :false;



            //   Upload Banner Images
            if (BnnerImagepostArr.length > 0 && BnnerImagepostArr[0]?.files?.length > 0) {
              for (const file of BnnerImagepostArr[0].files) {
                //  const uploadedBanner = await uploadFile(file, sp, "Documents", Url);
                bannerImageArray = await uploadFileBanner(file, sp, "Documents", tenantUrl);
              }
            }
            //debugger
            const eventDate = new Date(formData.EventDate).toISOString().split("T")[0];
            const RegistrationDueDate = new Date(formData.RegistrationDueDate).toISOString().split("T")[0];
            // Create Post
            const postPayload = {
              EventName: formData.EventName,
              Overview: formData.Overview,
              EventAgenda: formData.EventAgenda,
              EntityId: Number(formData.EntityId),
              Status: "Save as draft",
              RegistrationDueDate: RegistrationDueDate,
              EventDate: eventDate,
              AuthorId: currentUser.Id,
              image: bannerImageArray != "{}" && JSON.stringify(bannerImageArray)
            };
            console.log(postPayload);

            const postResult = await addItem(postPayload, sp);
            const postId = postResult?.data?.ID;
            //debugger
            if (!postId) {
              console.error("Post creation failed.");
              return;
            }

            console.log(EventGalleryArr, 'EventGalleryArr', EventGalleryArr1, 'EventGalleryArr1', EventThumbnailArr1, 'EventThumbnailArr1', EventThumbnailArr, 'EventThumbnailArr');

            // Upload Gallery Images
            if (EventGalleryArr.length > 0) {
              for (let i = 0; i < EventGalleryArr[0]?.files.length; i++) {
                const uploadedGalleryImage = await uploadFileToLibrary(EventGalleryArr[0]?.files[i], sp, "EventGallery");

                galleryIds = galleryIds.concat(uploadedGalleryImage.map((item: { ID: any }) => item.ID));
                galleryArray.push(uploadedGalleryImage);
              }
            }

            // Upload Documents
            if (EventThumbnailArr.length > 0) {
              for (let i = 0; i < EventThumbnailArr[0]?.files.length; i++) {
                const uploadedDocument = await uploadFileToLibrary(EventThumbnailArr[0]?.files[i], sp, "EventThumbnail");
                documentIds = documentIds.concat(uploadedDocument.map((item: { ID: any }) => item.ID));
                documentArray.push(uploadedDocument);
              }
            }

            // Update Post with Gallery and Document Information
            const updatePayload = {
              ...(galleryIds.length > 0 && {
                EventGalleryId: galleryIds,
                EventGalleryJson: JSON.stringify(flatArray(galleryArray)),
              }),
              ...(documentIds.length > 0 && {
                EventThumbnailId: documentIds,
                EventThumbnailJson: JSON.stringify(flatArray(documentArray)),
              }),
            };

            if (Object.keys(updatePayload).length > 0) {
              const updateResult = await updateItem(updatePayload, sp, postId);
              console.log("Update Result:", updateResult);
            }

            setLoading(false);
            Swal.fire('Saved successfully.', '', 'success');
            sessionStorage.removeItem("bannerId")
            setTimeout(() => {
              window.location.href = `${siteUrl}/SitePages/EventMaster.aspx`;
            }, 2000);

          }
        })

      }
    }

  }

  //#endregion save as draft


  const handleCancel = () => {
    //debugger
    if(pageValue == "MyRequest"){
      window.location.href = `${siteUrl}/SitePages/MyRequests.aspx`;
    }else if(pageValue == "MyApproval"){
      window.location.href = `${siteUrl}/SitePages/MyApprovals.aspx`;
    }else{
      window.location.href = `${siteUrl}/SitePages/EventMaster.aspx`;
    }
    //window.location.href = `${siteUrl}/SitePages/EventMaster.aspx`;
  }
  //#region flatArray
  const flatArray = (arr: any[]): any[] => {
    return arr.reduce((acc, val) => acc.concat(val), []);
  };
  //#endregion


  //#region ApiCallFunc
  const ApiCallFunc = async () => {
    setCurrentUser(await getCurrentUser(sp, siteUrl)) //currentUser
    setEnityData(await getEntity(sp)) //Entity
    setLevel(await getLevel(sp))
    setBaseUrl(await (getUrl(sp, siteUrl))) //baseUrl
    await fetchUserInformationList();
    let formitemid;
    //#region getdataByID
    if (sessionStorage.getItem("EventId") != undefined) {
      const iD = sessionStorage.getItem("EventId")
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
    if (formitemid) {
      // const iD = sessionStorage.getItem("EventId")
      // let iDs = decryptId(iD)
      // setFormItemId(Number(iDs))  
      // const setEventById = await getEventByID(sp, Number(iDs))
      const setEventById = await getEventByID(sp, formitemid)

      console.log(setEventById, 'setEventById');

      if (setEventById.length > 0) {
        //debugger
        setEditID(Number(setEventById[0].ID))
        setEditForm(true)
        // setCategoryData(await getCategory(sp, Number(setBannerById[0]?.TypeMaster))) // Category
        const eventDate = new Date(setEventById[0].EventDate).toISOString().split("T")[0];
        const RegistrationDueDate = new Date(setEventById[0].RegistrationDueDate).toISOString().split("T")[0];

        //  setSelectedDate(eventDate);
        //  setSelectedRegistrationDueDate(RegistrationDueDate);
        let arr = {
          EventName: setEventById[0].EventName,
          Overview: setEventById[0].Overview,
          EventAgenda: setEventById[0].EventAgenda,
          EntityId: Number(setEventById[0].EntityId),
          RegistrationDueDate: RegistrationDueDate,
          EventDate: eventDate,
          Status : setEventById[0].Status

        }
        const initialContent = getDescription(setEventById[0].description);
        let banneimagearr = []
        // setRichTextValues((prevValues) => ({
        //   ...prevValues,
        //   description: initialContent,
        // }));


        setEventGalleryArrIdsArr(setEventById[0]?.EventGalleryId)
        setEventThumbnailIdsArr(setEventById[0]?.EventThumbnailId)
        setEventGalleryArr1(setEventById[0].EventGalleryJson)
        setEventThumbnailArr1(setEventById[0].EventThumbnailJson)
        if (setEventById[0].BannerImage.length) {
          banneimagearr = setEventById[0].BannerImage
          console.log(banneimagearr, 'banneimagearr');

          setBannerImagepostArr(banneimagearr);
          setFormData(arr)

          // setFormData((prevValues) => ({
          //   ...prevValues,
          //   [FeaturedAnnouncement]: setBannerById[0].FeaturedAnnouncement === "on" ? true : false, // Ensure the correct boolean value is set for checkboxes
          // }));

        }
        else {
          setFormData(arr)
        }
        // setFormData((prevValues) => ({
        //   ...prevValues,
        //   [FeaturedAnnouncement]: setEventById[0].FeaturedAnnouncement === "on" ? true : false, // Ensure the correct boolean value is set for checkboxes
        // }));
        const rowData: any[] = await getApprovalConfiguration(sp, Number(setEventById[0].EntityId)) //baseUrl
        const initialRows = rowData.map((item: any) => ({
          id: item.Id,
          Level: item.Level.Level,
          LevelId: item.LevelId,
          approvedUserListupdate: item.Users.map((user: any) => ({
            id: user.ID,
            name: user.Title,
            email: user.EMail
          })),
          selectionType: 'All' // default selection type, if any
        }));
        setRows(initialRows);



      }
    }
    //#endregion
  }
  //#endregion
  const inputFile = useRef(null);

  // Function to reset the input element
  const handleReset = () => {
    if (inputFile.current) {
      inputFile.current.value = "";
      inputFile.current.type = "text";
      inputFile.current.type = "file";
    }
  };
  const inputFilegal = useRef(null);

  // Function to reset the input element
  const handleResetgal = () => {
    if (inputFilegal.current) {
      inputFilegal.current.value = "";
      inputFilegal.current.type = "text";
      inputFilegal.current.type = "file";
    }
  };
  //#region onFileChange
  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>, libraryName: string, docLib: string) => {
    //debugger;
    event.preventDefault();
    let uloadDocsFiles: any[] = [];
    let uloadDocsFiles1: any[] = [];

    let uloadImageFiles: any[] = [];
    let uloadImageFiles1: any[] = [];

    let uloadBannerImageFiles: any[] = [];

    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files);

      if (libraryName === "Docs") {
        const docFiles = files.filter(file =>
          file.type === 'application/pdf' ||
          file.type === 'application/msword' ||
          file.type === 'application/xsls' ||
          file.type === 'text/csv' || file.type === 'text/csv' ||
          file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          file.type === "application/vnd.openxmlformats-officedocument.presentationml.presentation" || file.type === 'text/'
        );

        if (docFiles.length > 0) {
          const arr = {
            files: docFiles,
            libraryName: libraryName,
            docLib: docLib
          };
          uloadDocsFiles.push(arr);
          setEventThumbnailArr(uloadDocsFiles);
          if (EventThumbnailArr.length > 0) {
            //  uloadDocsFiles1.push(DocumentpostArr1)
            docFiles.forEach(ele => {
              let arr1 = {
                "ID": 0,
                "Createdby": "",
                "Modified": "",
                "fileUrl": "",
                "fileSize": ele.size,
                "fileType": ele.type,
                "fileName": ele.name
              }
              EventThumbnailArr1.push(arr1);

            }
            )

            setEventThumbnailArr1(EventThumbnailArr1);
          }
          else {
            docFiles.forEach(ele => {
              let arr1 = {
                "ID": 0,
                "Createdby": "",
                "Modified": "",
                "fileUrl": "",
                "fileSize": ele.size,
                "fileType": ele.type,
                "fileName": ele.name
              }
              uloadDocsFiles1.push(arr1);

            }
            )

            setEventThumbnailArr1(uloadDocsFiles1);
          }


        } else {
          Swal.fire("only document can be upload")
        }
      }
      if (libraryName === "Gallery" || libraryName === "bannerimg") {
        const imageVideoFiles = files.filter(file =>
          libraryName === "Gallery" ?
            (file.type.startsWith('image/') || file.type.startsWith('video/'))
            : file.type.startsWith('image/')
        );

        if (imageVideoFiles.length > 0) {
          const arr = {
            files: imageVideoFiles,
            libraryName: libraryName,
            docLib: docLib,
            fileUrl: URL.createObjectURL(imageVideoFiles[0])
          };
          if (libraryName === "Gallery") {
            uloadImageFiles.push(arr);
            setEventGalleryArr(uloadImageFiles);
            if (EventGalleryArr1.length > 0) {
              imageVideoFiles.forEach(ele => {
                let arr1 = {
                  "ID": 0,
                  "Createdby": "",
                  "Modified": "",
                  // "fileUrl": URL.createObjectURL(ele),
                  "fileUrl": '',
                  "fileSize": ele.size,
                  "fileType": ele.type,
                  "fileName": ele.name
                }
                EventGalleryArr1.push(arr1);

              }
              )
              setEventGalleryArr1(EventGalleryArr1);
            }
            else {

              imageVideoFiles.forEach(ele => {
                let arr1 = {
                  "ID": 0,
                  "Createdby": "",
                  "Modified": "",
                  "fileUrl": "",
                  "fileSize": ele.size,
                  "fileType": ele.type,
                  "fileName": ele.name
                }
                uloadImageFiles1.push(arr1);

              }
              )
              setEventGalleryArr1(uloadImageFiles1);

            }
          } else {
            uloadBannerImageFiles.push(arr);
            setBannerImagepostArr(uloadBannerImageFiles);
          }

        } else {
          handleResetgal();
          handleReset();
          Swal.fire(libraryName === "Gallery" ? "only image & video can be upload" : "only image can be upload")
        }
      }
    }
  };
  //#endregion

  //#region OpenModal

  const setShowModalFunc = (bol: boolean, name: string) => {

    if (name == "docs") {
      setShowModal(bol)
      setShowImgTable(false)
      setShowDocTable(true)
    }
    else if (name == "Gallery") {
      setShowModal(bol)
      setShowImgTable(true)
      setShowDocTable(false)
    }

  }

  //#region deleteLocalFile
  const deleteLocalFile = (index: number, filArray: any[], name: string) => {
    //debugger
    console.log(filArray, 'filArray');

    // Remove the file at the specified index
    filArray.splice(index, 1);
    console.log(filArray, 'filArray');

    // Update the state based on the title
    if (name === "bannerimg") {
      setEventGalleryArr([...filArray]);
      filArray[0].files.length > 0 ? "" : setShowModal(false); clearFileInput(name);
    } else if (name === "Gallery") {
      setEventGalleryArr1([...filArray]);
      filArray[0].files.length > 0 ? "" : setShowModal(false); clearFileInput(name);
    } else {
      setEventThumbnailArr1([...filArray]);
      filArray[0].files.length > 0 ? "" : setShowModal(false); clearFileInput(name);
    }
    // Clear the file input

  };
  //#endregion

  //#region clearFileInput
  const clearFileInput = (name: any) => {

    const input = document.querySelector(`input[name=${name}]`) as HTMLInputElement;
    if (input) {
      input.value = ''; // Clears the selected files
    }
    else if (input == null) {
      input.value = ''; // Clears the selected files
    }
  };
  //#endregion


  //#endregion

  const [usersitem, setUsersArr] = React.useState([]);

  const fetchUserInformationList = async () => {
    try {
      const userList = await sp.web.lists
        .getByTitle("User Information List")
        .items.select("ID", "Title", "EMail", "Department", "JobTitle", "Picture")
        .filter("EMail ne null")();
      setUsersArr(userList);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const userOptions = usersitem.map((user: any) => ({
    id: user.ID,
    name: user.Title,
    email: user.EMail
  }));
  const handleAddRow = () => {
    setRows((prevRows: any) => [
      ...prevRows,
      {
        id: Date.now(), // unique ID for the new row
        Level: "", // default value for the level
        approvedUserList: userOptions, // empty array for approvers
        selectionType: "All", // default selection type
      },
    ]);
  };

  const handleUserSelect = (selectedUsers: any, rowId: any) => {
    setRows((prevRows: any) =>
      prevRows.map((row: any) =>
        row.id === rowId
          ? { ...row, approvedUserListupdate: selectedUsers }
          : row
      )
    );
  };

  const handleSelectionModeChange = (rowId: any, selectionType: any) => {
    setRows((prevRows: any) =>
      prevRows.map((row: any) =>
        row.id === rowId ? { ...row, selectionType } : row
      )
    );
  };

  const handleRemoveRow = (rowId: any, e: any) => {
    e.preventDefault();
    setRows((prevRows: any) => prevRows.filter((row: any) => row.id !== rowId));
  };
  const handleClick = async (contentId: number, contentName: any, EntityId: number) => {
    console.log("Creating approval hierarchy with data:", rows);
    let boolval = false
    for (let i = 0; i < rows.length; i++) {
      const userIds = rows[i].approvedUserListupdate.map((user: any) => user.id);
      let arrPost = {
        LevelSequence: i + 1,
        ContentId: contentId,
        ContentName: "ARGEventMaster",
        EntityMasterId: EntityId,
        ARGLevelMasterId: rows[i].LevelId,
        ApproverId: userIds,
        ApprovalType: rows[i].selectionType == "All" ? 1 : 0,
        SourceName: contentName
      }
      const addedData = await AddContentLevelMaster(sp, arrPost)
      console.log(addedData);

    }
    boolval = true
    return boolval;
    // Process rows data, e.g., submit to server or save to SharePoint list
    // Add your submit logic here
  };


  return (

    <div id="wrapper" ref={elementRef}>
      <div className="app-menu">
        <VerticalSideBar _context={sp} />
      </div>
      <div className="content-page newbancss" style={{ marginTop: '-15px' }}> {/* Edit by amjad */}
        <HorizontalNavbar _context={sp} siteUrl={siteUrl} />
        <div className="content" style={{ marginLeft: `${!useHide ? '240px' : '80px'}`, marginTop: '0.8rem' }}> {/* Edit by amjad */}
          <div className="container-fluid  paddb">
            <div className="row">
              <div className="col-lg-5">
                <CustomBreadcrumb Breadcrumb={Breadcrumb} />
              </div>
            </div>
            <div className="card mt-3">
              <div className="card-body">
                <div className="mt-0">
                  {Loading ?
                    <div style={{ minHeight: '100vh', marginTop: '100px' }} className="loadernewadd mt-10">
                      <div>
                        <img
                          src={require("../../../CustomAsset/birdloader.gif")}
                          className="alignrightl"
                          alt="Loading..."
                        />
                      </div>
                      <span>Loading </span>{" "}
                      <span>
                        <img
                          src={require("../../../CustomAsset/argloader.gif")}
                          className="alignrightl"
                          alt="Loading..."
                        />
                      </span>
                    </div>
                    // <div className="loadercss" role="status">Loading...
                    //   <img src={require('../../../Assets/ExtraImage/loader.gif')} style={{ height: '80px', width: '70px' }} alt="Check" />
                    // </div>
                    :
                    <form className='row'  >
                      <div className="">

<strong className='font-16 mb-1'>Basic Information</strong>
<p className='font-14 text-muted mb-3 mt-1'>Specify basic information </p>

</div>
                      <div className="col-lg-4">
                        <div className="mb-3">
                          <label htmlFor="title" className="form-label">
                            Event Name <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            id="title"
                            name="EventName"
                            placeholder='Enter Event Name'
                            className={`form-control ${(!ValidDraft) ? "border-on-error" : ""} ${(!ValidSubmit) ? "border-on-error" : ""}`}
                            value={formData.EventName}
                            onChange={(e) => onChange(e.target.name, e.target.value)}
                            disabled={InputDisabled}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="mb-3">
                          <label htmlFor="EventDate" className="form-label">
                            Event Date<span className="text-danger">*</span>
                          </label>
                          <input
                            type="date"
                            id="EventDate"
                            name="EventDate"
                            placeholder='Enter Event Date'
                            className={`form-control ${(!ValidDraft) ? "border-on-error" : ""} ${(!ValidSubmit) ? "border-on-error" : ""}`}
                            value={formData.EventDate}
                            // value={formData.EventDate}
                            onChange={(e) => onChange(e.target.name, e.target.value)}
                            disabled={InputDisabled}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="mb-3">
                          <label htmlFor="RegistrationDueDate" className="form-label">
                            Registration Due Date <span className="text-danger">*</span>
                          </label>
                          <input
                            type="date"
                            id="RegistrationDueDate"
                            name="RegistrationDueDate"
                            value={formData.RegistrationDueDate}
                            placeholder='Enter Registration Due Date'
                            className={`form-control ${(!ValidDraft) ? "border-on-error" : ""} ${(!ValidSubmit) ? "border-on-error" : ""}`}
                            // value={formData.RegistrationDueDate}
                            onChange={(e) => onChange(e.target.name, e.target.value)}
                            disabled={InputDisabled}
                          />
                        </div>
                      </div>


                      <div className="col-lg-4">
                        <div className="mb-3">
                          <label htmlFor="EntityId" className="form-label">
                            Entity <span className="text-danger">*</span>
                          </label>
                          <select
                            className={`form-control ${(!ValidSubmit) ? "border-on-error" : ""}`}
                            id="EntityId"
                            name="EntityId"
                            value={formData.EntityId}
                            onChange={(e) => onChange(e.target.name, e.target.value)}
                            disabled={InputDisabled}
                          >
                            <option value="">Select</option>
                            {
                              EnityData.map((item, index) => (
                                <option key={index} value={item.id}>{item.name}</option>
                              ))
                            }
                          </select>
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="mb-3">

                          <div className='d-flex justify-content-between'>
                            <div>
                              <label htmlFor="bannerImage" className="form-label">
                                Event Image <span className="text-danger">*</span>
                              </label>
                            </div>
                            <div>

                              <div>


                                {BnnerImagepostArr[0] != false && BnnerImagepostArr.length > 0 &&
                                  BnnerImagepostArr != undefined ? BnnerImagepostArr.length == 1 &&
                                (<a style={{ fontSize: '0.875rem' }}>
                                  <FontAwesomeIcon icon={faPaperclip} />1 file Attached
                                </a>) : ""
                                  // || BnnerImagepostArr.length > 0 && BnnerImagepostArr[0].files.length > 1 &&
                                  // (<a onClick={() => setShowModalFunc(true, "bannerimg")} style={{ fontSize: '0.875rem' }}>
                                  //   <FontAwesomeIcon icon={faPaperclip} /> {BnnerImagepostArr[0].files.length} files Attached
                                  // </a>)
                                }
                              </div>
                            </div>
                          </div>
                          <input
                            type="file"
                            ref={inputFile}
                            id="bannerImage"
                            name="bannerImage"
                            accept=".jpeg,.jpg,.png,.gif"
                            //value={}
                            className={`form-control ${(!ValidSubmit) ? "border-on-error" : ""}`}
                            onChange={(e) => onFileChange(e, "bannerimg", "Document")}
                            disabled={InputDisabled}
                          />
                        </div>
                      </div>


                      <div className="col-lg-4">
                        <div className="mb-3">

                          <div className='d-flex justify-content-between'>
                            <div>
                              <label htmlFor="EventGallery" className="form-label">
                                Event Gallery <span className="text-danger">*</span>
                              </label>
                            </div>
                            <div>

                              {EventGalleryArr1.length > 0 &&
                                EventGalleryArr1.length == 1 &&
                                (<a onClick={() => setShowModalFunc(true, "Gallery")} style={{ fontSize: '0.875rem' }}>
                                  <FontAwesomeIcon icon={faPaperclip} /> 1 file Attached
                                </a>)
                                || EventGalleryArr1.length > 0 && EventGalleryArr1.length > 1 &&
                                (<a onClick={() => setShowModalFunc(true, "Gallery")} style={{ fontSize: '0.875rem' }}>
                                  <FontAwesomeIcon icon={faPaperclip} /> {EventGalleryArr1.length} files Attached
                                </a>)
                              }

                            </div>
                          </div>
                          <input
                            type="file"
                            ref={inputFilegal}
                            id="EventGallery"
                            name="EventGallery"
                            accept=".jpeg,.jpg,.png,.gif,.mp4,.mp3,.mkv,.webm,.flv,.vob,.ogg,.wmv,.yuv.,MTS,.TS,.m4p..mpeg,.mpe,.mpv,.m4v,.svi,.3gp,.3g2,.roq,.nsv,.flv,.f4v,.f4p,.f4a,.f4b"
                            className={`form-control ${(!ValidSubmit) ? "border-on-error" : ""}`}
                            multiple
                            onChange={(e) => onFileChange(e, "Gallery", "EventGallery")}
                            disabled={InputDisabled}
                          />
                        </div>
                      </div>

                      {/* <div className="col-lg-4">
                      <div className="mb-3">

                        <div className='d-flex justify-content-between'>
                          <div>
                            <label htmlFor="EventThumbnail" className="form-label">
                              Event Document <span className="text-danger">*</span>
                            </label>
                          </div>
                          <div>
                            {EventThumbnailArr1.length > 0 &&
                              EventThumbnailArr1.length == 1 &&
                              (<a onClick={() => setShowModalFunc(true, "docs")} style={{ fontSize: '0.875rem' }}>
                                <FontAwesomeIcon icon={faPaperclip} />1 file Attached
                              </a>)
                              || EventThumbnailArr1.length > 0 && EventThumbnailArr1.length > 1 &&
                              (<a onClick={() => setShowModalFunc(true, "docs")} style={{ fontSize: '0.875rem' }}>
                                <FontAwesomeIcon icon={faPaperclip} /> {EventThumbnailArr1.length} files Attached
                              </a>)
                            }
                          </div>
                        </div>
                        <input
                          type="file"
                          id="EventThumbnail"
                          name="EventThumbnail"
                          className="form-control inputcss"
                          multiple
                          onChange={(e) => onFileChange(e, "Docs", "EventThumbnail")}
                          disabled={InputDisabled}
                        />
                      </div>
                    </div> */}


                      <div className="col-lg-12">
                        <div className="mb-3">
                          <label htmlFor="overview" className="form-label">
                            Event Overview
                          </label>
                          <textarea
                            className="form-control"
                            id="overview"
                            placeholder='Enter Event Overview'
                            name="Overview"
                            style={{ height: "100px" }}
                            value={formData.Overview}
                            onChange={(e) => onChange(e.target.name, e.target.value)}
                            disabled={InputDisabled}
                          ></textarea>
                        </div>
                      </div>



                      <div className="col-lg-12">
                        <div className="mb-0">
                          <label htmlFor="EventAgenda" className="form-label">
                            Event Agenda
                          </label>
                          <div style={{ display: "contents", justifyContent: "start" }}>
                            <textarea
                              className="form-control"
                              id="EventAgenda"
                              placeholder='Enter Event Agenda'
                              name="EventAgenda"
                              style={{ height: "100px" }}
                              value={formData.EventAgenda}
                              onChange={(e) => onChange(e.target.name, e.target.value)}
                              disabled={InputDisabled}
                            ></textarea>
                          </div>

                        </div>
                      </div>

                     
                    </form>
                  }
                </div>
              </div>
            </div>
            {
              rows != null && rows.length > 0 && !ApprovalMode && (
                <div className="card cardborder mt-2">
                  <div className="card-body p-4">
                  <div className="">

<strong className='font-16 mb-1'>Approval Hierarchy</strong>
<p className='font-14 text-muted mb-3 mt-1'>Define Approaval Hierarchy for the documents.</p>

</div>
                    {/* <div className="d-flex justify-content-between align-items-center">
                      <p className="font-14 mb-3 flex-grow-1">
                        Define approval hierarchy for the documents submitted by Team members in this folder.
                      </p>
                      <div className="mt-2 me-1">
                        <span onClick={handleAddRow} style={{ cursor: 'pointer' }}>
                          <div className="bi linkpos">
                            <PlusCircle size={30} color="#008751" />
                          </div>
                        </span>
                      </div>
                    </div> */}

                    <div className="d-flex flex-column">
                      {/* <div className="row mb-2">
                        <div className="col-12 col-md-5">
                          <label className="form-label">Level</label>
                        </div>
                        <div className="col-12 col-md-5">
                          <label className="form-label">Approver</label>
                        </div>
                      </div> */}
                      <table className="mtbalenew scrollrem">
                                                    <thead>
                                                      <tr>
                                                      <th style={{minWidth:'60px', maxWidth:'60px'}} className="newpad">  Select Level</th>
                                                      <th className="newpad"> Select Approver</th>
                                                      </tr>
                                                    </thead>
                                                    <tbody style={{overflowX:'hidden',overflow:'initial'}}>

                      {rows.map((row: any) => (
                        <div className="row mb-0" key={row.id}>
                                                                  <tr style={{overflow:'initial'}}>
                                                                  <td style={{minWidth:'60px', maxWidth:'60px',overflow:'initial'}} className=""> 
                                                                  <select style={{border:"0px solid #ccc", background:'#fff'}}
                              className="form-select removeb"
                              id={`Level-${row.id}`}
                              name="Level"
                              value={row.LevelId}
                              disabled={true}

                              onChange={(e) => {
                                const selectedLevel = e.target.value;
                                setRows((prevRows: any) =>
                                  prevRows.map((r: any) =>
                                    r.id === row.id
                                      ? { ...r, LevelId: selectedLevel }
                                      : r
                                  )
                                );
                              }}
                            >
                              <option value="">Select</option>
                              {levels.map((item: any) => (
                                <option key={item.Id} value={item.Id}>
                                  {item.Level}
                                </option>
                              ))}
                            </select> </td>
                                                                    <td style={{overflow:'initial'}}>
                                                                    <Multiselect className="removeb" style={{border:"0px solid #ccc", background:'#fff'}}
                              options={row.approvedUserList}
                              selectedValues={row.approvedUserListupdate}
                              onSelect={(selected) => handleUserSelect(selected, row.id)}
                              onRemove={(selected) => handleUserSelect(selected, row.id)}
                              displayValue="name"
                              disable={true}
                              placeholder=''
                              hidePlaceholder={true}
                            />

                                                                    </td>
                                                                    </tr>
                          <div className="col-12 col-md-5">
                            {/* <label htmlFor={`Level-${row.id}`} className="form-label">
                              Select Level
                            </label> */}
                         
                          </div>

                          <div className="col-12 col-md-5">
                            {/* <label htmlFor={`approver-${row.id}`} className="form-label">
                              Select Approver
                            </label> */}
                          
                          </div>

                          {/* <div className="col-12 col-md-2 d-flex align-items-center" style={{ gap: '10px' }}>
                            <div className="d-flex align-items-center">
                              <input
                                className="form-check-input custom-radio"
                                type="radio"
                                name={`selection-${row.id}`}
                                value="all"
                                checked={row.selectionType === 'All'}
                                onChange={() => handleSelectionModeChange(row.id, 'All')}
                                style={{ marginRight: '5px' }}
                              />
                              <label className="form-check-label mb-0" htmlFor={`all-${row.id}`}>
                                All
                              </label>
                            </div>

                            <div className="d-flex align-items-center">
                              <input
                                className="form-check-input custom-radio"
                                type="radio"
                                name={`selection-${row.id}`}
                                value="one"
                                checked={row.selectionType === 'One'}
                                onChange={() => handleSelectionModeChange(row.id, 'One')}
                                style={{ marginRight: '5px' }}
                              />
                              <label className="form-check-label mb-0" htmlFor={`one-${row.id}`}>
                                One
                              </label>
                            </div>

                            {row.id !== 0 && (
                              <a onClick={(e) => handleRemoveRow(row.id, e)} style={{ cursor: 'pointer' }}>
                                <Delete />
                              </a>
                            )}
                          </div> */}
                        </div>
                      ))}
                      <tr>
                        <td style={{height:'30px', background:'#fff', border:'0px solid #ccc'}}></td>
                        <td style={{height:'30px', background:'#fff', border:'0px solid #ccc'}}> </td>
                      </tr>
  </tbody>  </table>
                    </div>

                    {/* <div className="text-center butncss">
                    <div className="btn btn-success" onClick={IsAdded?handleClick:null}>
                      Create
                    </div>
                    <div className="btn btn-light" data-bs-dismiss="modal">
                      Cancel
                    </div>
                  </div> */}
                  </div>
                </div>
              )

              // <ApprovalHierarchy data={ApprovalConfigurationData} levels={levels} usersitem={usersitem} IsAdded={IsAdded}/>

            }

            {
              //let forrework=ApprovalRequestItem && ApprovalRequestItem.IsRework=='Yes'&& ApprovalRequestItem.LevelSequence!=0;
              (InputDisabled && ApprovalRequestItem) || (ApprovalRequestItem && ApprovalRequestItem.IsRework == 'Yes' && ApprovalRequestItem.LevelSequence != 0) ? (
                <WorkflowAction currentItem={ApprovalRequestItem} ctx={props.context}
                  DisableApproval={ApprovalRequestItem && ApprovalRequestItem.IsRework == 'Yes' && ApprovalRequestItem.LevelSequence != 0}
                  DisableCancel={ApprovalRequestItem && ApprovalRequestItem.IsRework == 'Yes' && ApprovalRequestItem.LevelSequence != 0}
                //DisableReject={ApprovalRequestItem && ApprovalRequestItem.IsRework=='Yes'&& ApprovalRequestItem.LevelSequence!=0}
                />
              ) : (<div></div>)
            }
            {
              <WorkflowAuditHistory ContentItemId={editID} ContentType={CONTENTTYPE_Event} ctx={props.context} />
            }

{
                        !InputDisabled ? (<div className="text-center butncss mb-4">
                          <div className="btn btn-success waves-effect waves-light m-1" style={{ width:'145px' }} onClick={handleSaveAsDraft}>
                            <div className='d-flex' style={{ justifyContent: 'center' }}>
                              <img src={require('../../../Assets/ExtraImage/checkcircle.svg')} style={{ width: '1rem',marginRight:'3px' }} alt="Check" /> Save As Draft
                            </div>
                          </div>
                          <div className="btn btn-success waves-effect waves-light m-1" style={{ width:'145px' }} onClick={handleFormSubmit}>
                            <div className='d-flex' style={{ justifyContent: 'center' }}>
                              <img src={require('../../../Assets/ExtraImage/checkcircle.svg')} style={{ width: '1rem', marginRight:'3px' }} alt="Check" /> Submit
                            </div>
                          </div>
                          <button type="button" className="btn cancel-btn waves-effect waves-light m-1" style={{ width:'145px'}} onClick={handleCancel}>
                            <img src={require('../../../Assets/ExtraImage/xIcon.svg')} style={{ width: '1rem', marginRight:'3px' }}
                              className='me-1' alt="x" />
                            Cancel
                          </button>
                        </div>) : (<div className="text-center butncss mb-4">
                          <button type="button" className="btn cancel-btn waves-effect waves-light m-1" onClick={handleCancel}>
                            <img src={require('../../../Assets/ExtraImage/xIcon.svg')} style={{ width: '1rem', marginRight:'3px' }}
                              className='me-1' alt="x" />
                            Cancel
                          </button>
                        </div>)}
            {/* Modal to display uploaded files */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size='lg' >
              <Modal.Header closeButton>
                {EventThumbnailArr1.length > 0 && showDocTable && <Modal.Title>Documents</Modal.Title>}
                {EventGalleryArr1.length > 0 && showImgModal && <Modal.Title>Gallery Images/Videos</Modal.Title>}

              </Modal.Header>
              <Modal.Body >
                {EventThumbnailArr1.length > 0 && showDocTable &&
                  <div className={`${EventThumbnailArr1.length > 3 ? 'scrollbar' : ''}`} id={`${EventThumbnailArr1.length > 3 ? 'style-5' : ''}`}>
                    {EventThumbnailArr1.length > 0 && showDocTable &&
                      (
                        <>
                          <table className="table table-bordered" style={{ fontSize: '0.75rem' }}>
                            <thead style={{ background: '#eef6f7' }}>
                              <tr>
                                <th>Serial No.</th>
                                <th>File Name</th>
                                <th>File Size</th>
                                {mode != 'view' &&
                                  <th className='text-center'>Action</th>
                                }
                              </tr>
                            </thead>
                            <tbody>
                              {EventThumbnailArr1.map((file: any, index: number) => (
                                <tr key={index}>
                                  <td className='text-center'>{index + 1}</td>
                                  <td>{file.fileName}</td>
                                  <td className='text-right'>{file.fileSize}</td>
                                  {mode != 'view' &&
                                    <td className='text-center'> <img src={require("../../../CustomAsset/trashed.svg")} style={{ width: '15px' }} onClick={() => deleteLocalFile(index, EventThumbnailArr1, "docs")} /> </td>
                                  }
                                </tr>
                              ))}
                            </tbody>
                          </table></>
                      )
                    }
                    <div className="force-overflow"></div>
                  </div>
                }
                {EventGalleryArr1.length > 0 && showImgModal &&
                  <div className={`${EventGalleryArr1.length > 3 ? 'scrollbar' : ''}`} id={`${EventGalleryArr1.length > 3 ? 'style-5' : ''}`}>

                    {EventGalleryArr1.length > 0 && showImgModal &&
                      (
                        <>
                          <table className="table table-bordered" style={{ fontSize: '0.75rem' }}>
                            <thead style={{ background: '#eef6f7' }}>
                              <tr>
                                <th>Serial No.</th>
                                <th> Image </th>
                                <th>File Name</th>
                                <th>File Size</th>
                                {mode != 'view' &&
                                  <th className='text-center'>Action</th>
                                }
                              </tr>
                            </thead>
                            <tbody>
                              {EventGalleryArr1.map((file: any, index: number) => (
                                <tr key={index}>
                                  <td className='text-center'>{index + 1}</td>
                                  <td>
                                   
                                    <img
                                      className='imagefe'
                                      src={file.fileType.startsWith('video/') ?
                                        require("../../../Assets/ExtraImage/video.jpg") :
                                        (file.fileUrl ? file.fileUrl : `${file.serverUrl}${file.serverRelativeUrl}`)}
                                   
                                        alt={'default image'}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleShow(
                    file.serverUrl && file.serverRelativeUrl
                      ? `${siteUrl}/MediaGallery/${file.fileName}`
                      : file.fileUrl
                  )}
                                    />

                                  </td>

                                  <td>{file.fileName}</td>
                                  <td className='text-right'>{file.fileSize}</td>
                                  {mode != 'view' &&
                                    <td className='text-center'> <img src={require("../../../CustomAsset/trashed.svg")} style={{ width: '15px' }} onClick={() => deleteLocalFile(index, EventGalleryArr1, "Gallery")} /> </td>
                                  }
                                </tr>
                              ))}
                            </tbody>
                          </table></>
                      )}

                  </div>
                }

              </Modal.Body>

              </Modal>
            <Modal show={show} onHide={handleClose} className='previewpp'>
        <Modal.Header closeButton>
          <Modal.Title>Image Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={modalImageSrc} alt="Image Preview" style={{ width: '100%' }} />
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer> */}
              </Modal>

          </div>
        </div>
      </div>
    </div>
  );
};
const EventForm: React.FC<IEventFormProps> = (props) => {
  return (
    <Provider>
      <HelloWorldContext props={props} />
    </Provider>
  );
}

export default EventForm