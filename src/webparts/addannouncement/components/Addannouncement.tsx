import * as React from 'react'
import VerticalSideBar from '../../verticalSideBar/components/VerticalSideBar';
import CustomBreadcrumb from '../../../CustomJSComponents/CustomBreadcrumb/CustomBreadcrumb';
import { useMediaQuery } from 'react-responsive';
import UserContext from '../../../GlobalContext/context';
import context from '../../../GlobalContext/context';
import { getSP } from '../loc/pnpjsConfig';
import Provider from '../../../GlobalContext/provider';
import "../../../Assets/Figtree/Figtree-VariableFont_wght.ttf";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../CustomCss/mainCustom.scss";
import "../../verticalSideBar/components/VerticalSidebar.scss";
import DynamicForm from '../../../CustomJSComponents/CustomForm/DynamicForm';
import { IAddannouncementProps } from './IAddannouncementProps';
import { AllowAlphaNumericNotStartWithNumbers, allowstringandnumber, allowstringonly, getCategory, getCurrentUser, getEntity, getType } from "../../../APISearvice/CustomService";
import { addItem, getAnncouncementByID, getAnnouncementandNewsTypeMaster, getUrl, updateItem, uploadFile, uploadFileToLibrary } from '../../../APISearvice/AnnouncementsService';
import { SPFI } from '@pnp/sp/presets/all';
import Swal from 'sweetalert2';
import "../components/addannoncement.scss";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';
import "../../../CustomJSComponents/CustomForm/CustomForm.scss";
import { Button, Modal } from 'react-bootstrap';
import { decryptId } from '../../../APISearvice/CryptoService';
import HorizontalNavbar from '../../horizontalNavBar/components/HorizontalNavBar';
import { AddContentLevelMaster, AddContentMaster, getApprovalConfiguration, getLevel, UpdateContentMaster } from '../../../APISearvice/ApprovalService';
import { Delete, PlusCircle } from 'react-feather';
import Multiselect from 'multiselect-react-dropdown';
import { WorkflowAction } from '../../../CustomJSComponents/WorkflowAction/WorkflowAction';
import { getUrlParameterValue } from '../../../Shared/Helper';
import { FormSubmissionMode } from '../../../Shared/Interfaces';
import { WorkflowAuditHistory } from '../../../CustomJSComponents/WorkflowAuditHistory/WorkflowAuditHistory';
import { CONTENTTYPE_Announcement, CONTENTTYPE_News, LIST_TITLE_ContentMaster, LIST_TITLE_AnnouncementAndNews, LIST_TITLE_MyRequest } from '../../../Shared/Constants';
import { useRef, useState } from 'react';
let newfileupload: any
let newfilepreview: any
interface FormField {
  type: string;
  name: string;
  label: string;
  docLib?: string;
  placeholder?: string;
  options?: any[];
  required: boolean;
  // Array of options for select, radio buttons, etc.
}
interface Result {
  data: { ID: number };
}
const AddannouncementContext = ({ props }: any) => {

  const sp: SPFI = getSP();
  // Media query to check if the screen width is less than 768px
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const { useHide }: any = React.useContext(UserContext);
  const elementRef = React.useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const { setHide }: any = context;
  const [currentUser, setCurrentUser] = React.useState(null)
  const [EnityData, setEnityData] = React.useState([])
  const [CategoryData, setCategoryData] = React.useState([])
  const [TypeData, setTypeData] = React.useState([])
  const [options, setOpions] = React.useState([]);
  const [Url, setBaseUrl] = React.useState("");
  const [showModal, setShowModal] = React.useState(false);
  const [showDocTable, setShowDocTable] = React.useState(false);
  const [showImgModal, setShowImgTable] = React.useState(false);
  const [showBannerModal, setShowBannerTable] = React.useState(false);
  const siteUrl = props.siteUrl;
  const tenantUrl = props.siteUrl?.split("/sites/")[0];
  const [editID, setEditID] = React.useState(null);
  const [selectedUsers, setSelectedUsers] = React.useState<any[]>([]);
  const [errorsForUserSelection, setErrorsForUserSelection] = React.useState<{
    [key: number]: { userSelect?: string };
  }>({});
  const [IsAdded, setIsAdded] = React.useState(false);
  const [modeValue, setmode] = React.useState("");
  const [pageValue, setpage] = React.useState("");

  const [Loading, setLoading] = React.useState(false);
  //#region State to hold form data
  const [formData, setFormData] = React.useState({
    title: "",
    category: "",
    entity: "",
    Type: "",
    bannerImage: null,
    // announcementGallery: null,
    // announcementThumbnail: null,
    description: "",
    overview: "",
    FeaturedAnnouncement: false,
    Status: "",
  });
  const [richTextValues, setRichTextValues] = React.useState<{ [key: string]: string }>({});
  const [DocumentpostArr, setDocumentpostArr] = React.useState([]);
  const [DocumentpostArr1, setDocumentpostArr1] = React.useState([]);

  const [ImagepostArr, setImagepostArr] = React.useState([]);
  const [ImagepostArr1, setImagepostArr1] = React.useState([]);

  const [BnnerImagepostArr, setBannerImagepostArr] = React.useState([]);
  const [ImagepostIdsArr, setImagepostIdsArr] = React.useState([]);

  const [DocumentpostIdsArr, setDocumentpostIdsArr] = React.useState([]);

  const [editForm, setEditForm] = React.useState(false);
  const [levels, setLevel] = React.useState([]);
  const [selectedValue, setSelectedValue] = React.useState([]);
  const [ApprovalConfigurationData, setApprovalConfiguration] = React.useState([]);

  const [rows, setRows] = React.useState<any>([]);
  const [ApprovalMode, setApprovalMode] = React.useState(false);
  const [ApprovalRequestItem, setApprovalRequestItem] = React.useState(null);
  const [InputDisabled, setInputDisabled] = React.useState(false);
  const [ValidDraft, setValidDraft] = React.useState(true);
  const [ValidSubmit, setValidSubmit] = React.useState(true);
  const [FormItemId, setFormItemId] = React.useState(null);
  //const [placeholder, setPlaceholder] = React.useState("")
  console.log(ApprovalConfigurationData, 'ApprovalConfigurationData');
  //#endregion
  // const handleChangeCheckBox = (name: string, value: string | boolean) => {
  //   setFormData((prevValues) => ({
  //     ...prevValues,
  //     [name]: value === true ? true : false, // Ensure the correct boolean value is set for checkboxes
  //   }));
  // };
  //#region Breadcrumb
  const Breadcrumb = [
    {
      "MainComponent": "Settings",
      "MainComponentURl": `${siteUrl}/SitePages/MasterSettings.aspx`
    },
    {
      "ChildComponent": "Add News",
      "ChildComponentURl": `${siteUrl}/SitePages/newsmaster.aspx`
    }
  ]
  //#endregion

  const [show, setShow] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = (src: any) => {
    setModalImageSrc(src);
    setShow(true);
  };


  //#region UseEffact
  React.useEffect(() => {


    //window.location.href = url
    ApiCallFunc()

    // Determine whether the form in opened for approval

    let mode = getUrlParameterValue('mode');
    setmode(mode);
    let page = getUrlParameterValue('page');
    setpage(page);
    if (mode && mode == 'approval') {
      setApprovalMode(true);
      let requestid = getUrlParameterValue('requestid');
      setInputDisabled(true);
      sp.web.lists.getByTitle('ARGMyRequest').items.getById(Number(requestid))().then(itm => {
        setApprovalRequestItem(itm);
        setInputDisabled(true && (!itm.IsRework || itm.IsRework == "No"))
        // if(itm.IsRework == "Yes")
        //   setInputDisabled(false);
        // else
        //   setInputDisabled(true);
        //setInputDisabled(true && (!itm.IsRework || itm.IsRework == "No"))
        //  setInputDisabled(false && (itm.IsRework || itm.IsRework == "Yes"))
        //setInputDisabled(ApprovalMode)
      })
    }
    else if (mode && mode == 'view') {
      setInputDisabled(true);
    }



    //


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

    function colorLink(this: HTMLElement) {
      if (linkColor) {
        linkColor.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
      }
    }

    linkColor.forEach(l => l.addEventListener('click', colorLink));
  }, [useHide]);
  //#endregion

  //#region ApiCallFunc
  const ApiCallFunc = async () => {
    setLevel(await getLevel(sp))
    await fetchUserInformationList();

    setCurrentUser(await getCurrentUser(sp, siteUrl)) //currentUser
    setEnityData(await getEntity(sp)) //Entity
    setTypeData(await getType(sp)) // Type
    const defaultItem = await getType(sp);
    if (defaultItem.find((item) => item.name === 'News').id) {
      formData.Type = defaultItem.find((item) => item.name === 'News').id;
      setCategoryData(await getCategory(sp, Number(formData.Type)))

    }
    const entityDefaultitem = await getEntity(sp);
    if (entityDefaultitem.find((item) => item.name === 'Global').id) {
      formData.entity = entityDefaultitem.find((item) => item.name === 'Global').id;

    }



    setBaseUrl(await (getUrl(sp))) //baseUrl
    let formitemid;
    //#region getdataByID
    if (sessionStorage.getItem("announcementId") != undefined) {
      const iD = sessionStorage.getItem("announcementId")
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

    //#region getdataByID
    // if (sessionStorage.getItem("announcementId") != undefined) {
    if (formitemid) {
      // const iD = sessionStorage.getItem("announcementId")
      // let iDs = decryptId(iD)
      const setBannerById = await getAnncouncementByID(sp, Number(formitemid))

      console.log(setBannerById, 'setBannerById');
      setEditID(Number(setBannerById[0].ID))
      if (setBannerById.length > 0) {
        debugger
        setEditForm(true)
        setCategoryData(await getCategory(sp, Number(setBannerById[0]?.TypeMaster))) // Category

        let arr = {
          title: setBannerById[0].Title,
          category: setBannerById[0]?.Category,
          entity: setBannerById[0]?.Entity ? setBannerById[0]?.Entity : 0,
          Type: setBannerById[0]?.TypeMaster,
          bannerImage: setBannerById[0]?.BannerImage,
          description: setBannerById[0].description,
          overview: setBannerById[0].overview,
          FeaturedAnnouncement: true,
          Status: setBannerById[0].Status,
          // announcementGallery: setBannerById[0].AnnouncementAndNewsGallaryJSON,
          // announcementThumbnail: setBannerById[0].AnnouncementAndNewsDocsJSON,
        }
        const initialContent = getDescription(setBannerById[0].description);
        let banneimagearr = []
        setRichTextValues((prevValues) => ({
          ...prevValues,
          description: initialContent,
        }));
        setImagepostIdsArr(setBannerById[0]?.AnnouncementAndNewsGallaryId != null ? setBannerById[0]?.AnnouncementAndNewsGallaryId:[])
        setImagepostArr(setBannerById[0]?.AnnouncementAndNewsGallaryId != null ? setBannerById[0].AnnouncementAndNewsGallaryJSON:[]);
        setDocumentpostIdsArr(setBannerById[0]?.AnnouncementsAndNewsDocsId != null ? setBannerById[0]?.AnnouncementsAndNewsDocsId:[])
        setImagepostArr1(setBannerById[0]?.AnnouncementAndNewsGallaryId != null ?setBannerById[0].AnnouncementAndNewsGallaryJSON:[])
        setDocumentpostArr1(setBannerById[0]?.AnnouncementsAndNewsDocsId != null ?setBannerById[0].AnnouncementAndNewsDocsJSON:[])
        if (setBannerById[0].BannerImage.length > 0) {
          banneimagearr = setBannerById[0].BannerImage
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
        const rowData: any[] = await getApprovalConfiguration(sp, Number(setBannerById[0].Entity)) //baseUrl
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

  // Prepare options for multiselect

  // Function to fetch or return the initial description value
  const getDescription = (des: any) => {
    // You can fetch this from an API, or return dynamic content.
    return des;
  };

  //#region Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };
  //#endregion

  //#region Handle file input changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, files } = e.target;
    if (files && files.length > 0) {
      setFormData({ ...formData, [id]: files[0] });
    }
  };
  //#endregion


  const validateForm = async (fmode: FormSubmissionMode) => {
    debugger
    const { title, Type, category, entity, overview } = formData;
    const { description } = richTextValues;
    let valid = true;
    let validateOverview: boolean = false;
    let validatetitlelength = false;
    let validateTitle = false;
    setValidDraft(true);
    setValidSubmit(true);
    if (title !== "") {
      validatetitlelength = title.length <= 255;
      validateTitle = title !== "" && await allowstringonly(title);
    }
    if (overview !== "") {
      validateOverview = overview! == "" && await allowstringonly(overview);
    }


    let errormsg = "";
    console.log("validateTitleup", validateTitle, "validatetitlelength", validatetitlelength, title !== "", overview !== "", "overview", overview, validateOverview);
    if (title !== "" && !validateTitle && validatetitlelength) {
      errormsg = "No special character allowed in Title";
      valid = false;
    } else if (title !== "" && validateTitle && !validatetitlelength) {
      errormsg = "Title must be less than 255 characters";
      valid = false;
      // }
      // else if (overview !== "" && !validateOverview) {
      //   errormsg = "No special character allowed in Overview";
      //   valid = false;
    }
    // else if ((ImagepostArr.length > 0 && ImagepostArr.length > 5) || ( ImagepostArr1.length > 0 && ImagepostArr1.length > 5)){
    //     errormsg = "More than 5 attachments not allowed";
    //     valid = false;
    //   }
    if (fmode == FormSubmissionMode.SUBMIT) {
      if (!title) {
        //Swal.fire('Error', 'Title is required!', 'error');
        valid = false;
      } else if (!Type) {
        //Swal.fire('Error', 'Type is required!', 'error');
        valid = false;
      } else if (!category || category == "Select") {
        //Swal.fire('Error', 'Category is required!', 'error');
        valid = false;
      }
      else if (!entity) {
        //Swal.fire('Error', 'Entity is required!', 'error');
        valid = false;
      }
      else if (!overview) {
        //Swal.fire('Error', 'Entity is required!', 'error');
        valid = false;
      }
      else if (BnnerImagepostArr.length == 0) {
        valid = false;
      }
      // else if ((ImagepostArr.length == 0 || ImagepostArr.length > 5) && (ImagepostArr1.length > 0 && ImagepostArr1.length > 5)) {
      //   valid = false;
      // }
      setValidSubmit(valid);

    }
    else {
      if (!title) {
        //Swal.fire('Error', 'Title is required!', 'error');
        valid = false;
      } else if (!Type) {
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
    console.log("validateTitle", validateTitle, "errormsg", errormsg, "valid,", valid, ImagepostArr.length);
    if (!valid && fmode == FormSubmissionMode.SUBMIT)
      Swal.fire(errormsg !== "" ? errormsg : 'Please fill all the mandatory fields.');
    else if (!valid && fmode == FormSubmissionMode.DRAFT) {
      Swal.fire(errormsg !== "" ? errormsg : 'Please fill the mandatory fields for draft - Title and Type');
    }
    return valid;
  };

  // Handle form submission
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
            //console.log("Form Submitted:", formValues, bannerImages, galleryImages, documents);
            // debugger
            let bannerImageArray: any = {};
            let galleryIds: any[] = [];
            let documentIds: any[] = [];
            let galleryArray: any[] = [];
            let documentArray: any[] = [];
            let ImagepostIdsArrN:any[]=[];
            // formData.FeaturedAnnouncement === "on"?  true :false;

            // Upload Banner Images
            if (BnnerImagepostArr.length > 0 && BnnerImagepostArr[0]?.files?.length > 0) {
              for (const file of BnnerImagepostArr[0].files) {
                //  const uploadedBanner = await uploadFile(file, sp, "Documents", Url);
                bannerImageArray = await uploadFile(file, sp, "Documents", tenantUrl);
              }
            }
            else if (BnnerImagepostArr.length > 0) {
              bannerImageArray = BnnerImagepostArr[0];
            }
            else {
              bannerImageArray = null
            }

            // debugger
            if (bannerImageArray != null) {
              // Create Post
              const postPayload = {
                Title: formData.title,
                Overview: formData.overview,
                Description: richTextValues.description,
                EntityId: Number(formData.entity),
                CategoryId: Number(formData.category),
                AnnouncementandNewsTypeMasterId: Number(formData.Type),
                FeaturedAnnouncement: true,
                // Status: formData.Status,
                Status: rows.length > 0 ? "Submitted" : "Approved",
                AuthorId: currentUser.Id,
                AnnouncementandNewsBannerImage: bannerImageArray != "{}" && JSON.stringify(bannerImageArray)
              };
              console.log(postPayload);

              const postResult = await updateItem(postPayload, sp, editID);
              const postId = postResult?.data?.ID;
              // debugger
              // if (!postId) {
              //   console.error("Post creation failed.");
              //   return;
              // }

              // Upload Gallery Images
              // Upload Gallery Images
              console.log(ImagepostArr, 'ImagepostArrImagepostArrImagepostArr');
              if (ImagepostArr[0]?.files?.length > 0 && ImagepostArr[0]?.files?.length < 6) {
                for (const file of ImagepostArr[0].files) {

                  const uploadedGalleryImage = await uploadFileToLibrary(file, sp, "AnnouncementAndNewsGallary");
                  debugger
                  galleryIds = galleryIds.concat(uploadedGalleryImage.map((item: { ID: any }) => item.ID));
                  if (ImagepostArr1.length > 0 && ImagepostArr1.length < 6) {

                    ImagepostArr1.push(uploadedGalleryImage[0])
                    const updatedData = ImagepostArr1.filter(item => item.ID !== 0);
                    console.log(updatedData, 'updatedData');
                    galleryArray = updatedData;
                    //galleryArray.push(ImagepostArr1);
                    //ImagepostIdsArrN.push(galleryIds != null ? galleryIds[0] : [])
                    ImagepostIdsArr.push(galleryIds != null ? galleryIds[0] : []) //galleryIds.push(ImagepostIdsArr)
                    galleryIds = ImagepostIdsArr
                  }
                  else {
                    galleryArray.push(uploadedGalleryImage);
                  }
                }
              }
              else {
                galleryIds = ImagepostIdsArr
                galleryArray = ImagepostArr1;
              }

              // Upload Documents
              // if (DocumentpostArr[0]?.files?.length > 0) {
              //   for (const file of DocumentpostArr[0].files) {
              //     const uploadedDocument = await uploadFileToLibrary(file, sp, "ARGAnnouncementAndNewsDocs");
              //     documentIds = documentIds.concat(uploadedDocument.map((item: { ID: any }) => item.ID));
              //     if (DocumentpostArr1.length > 0) {
              //       DocumentpostArr1.push(uploadedDocument[0])
              //       const updatedData = DocumentpostArr1.filter(item => item.ID !== 0);
              //       console.log(updatedData, 'updatedData');
              //       documentArray = updatedData;
              //       // documentArray.push(DocumentpostArr1)
              //       DocumentpostIdsArr.push(documentIds[0])//.push(DocumentpostIdsArr)
              //       documentIds = DocumentpostIdsArr
              //     }
              //     else {
              //       documentArray.push(uploadedDocument);
              //     }

              //   }
              // }
              // else {
              //   documentIds = DocumentpostIdsArr
              //   documentArray = DocumentpostArr1
              // }
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
                console.log(documentIds, 'documentIds');
                console.log(galleryIds, 'galleryIds');
                // Update Post with Gallery and Document Information

              }
              const updatePayload = {
                ...(galleryIds != null && galleryIds.length > 0 && {
                  AnnouncementAndNewsGallaryId: galleryIds,

                  AnnouncementAndNewsGallaryJSON: JSON.stringify(flatArray(galleryArray)),
                }),
                ...(documentIds != null && documentIds.length > 0 && {
                  AnnouncementsAndNewsDocsId: documentIds,
                  AnnouncementAndNewsDocsJSON: JSON.stringify(flatArray(documentArray)),
                }),
              };

              if (Object.keys(updatePayload).length > 0) {
                const updateResult = await updateItem(updatePayload, sp, editID);
                console.log("Update Result:", updateResult);
              }

            }
            else {
              // Create Post
              const postPayload = {
                Title: formData.title,
                Overview: formData.overview,
                Description: richTextValues.description,
                EntityId: Number(formData.entity),
                CategoryId: Number(formData.category),
                AnnouncementandNewsTypeMasterId: Number(formData.Type),
                //FeaturedAnnouncement: formData.FeaturedAnnouncement === true ? true : false,
                FeaturedAnnouncement: true,
                // Status: "Submitted",
                Status: formData.Status,
                AuthorId: currentUser.Id
              };
              console.log(postPayload);

              const postResult = await updateItem(postPayload, sp, editID);
              const postId = postResult?.data?.ID;
              debugger
              // if (!postId) {
              //   console.error("Post creation failed.");
              //   return;
              // }

              // Upload Gallery Images
              // Upload Gallery Images
              console.log(ImagepostArr, 'updatedDatarewrImagepostArr');
              if (ImagepostArr[0]?.files?.length > 0 && ImagepostArr[0]?.files?.length < 6) {
                for (const file of ImagepostArr[0].files) {

                  const uploadedGalleryImage = await uploadFileToLibrary(file, sp, "AnnouncementAndNewsGallary");

                  galleryIds = galleryIds.concat(uploadedGalleryImage.map((item: { ID: any }) => item.ID));
                  if (ImagepostArr1.length > 0 && ImagepostArr1.length < 6) {

                    ImagepostArr1.push(uploadedGalleryImage[0])
                    const updatedData = ImagepostArr1.filter(item => item.ID !== 0);
                    console.log(updatedData, 'updatedDatarewr');
                    galleryArray = updatedData;
                    // galleryArray.push(ImagepostArr1);

                    ImagepostIdsArr.push(galleryIds != null ? galleryIds[0] : []) //galleryIds.push(ImagepostIdsArr)
                    galleryIds = ImagepostIdsArr
                  }
                  else {
                    galleryArray.push(uploadedGalleryImage);
                  }
                }
              }
              else {
                galleryIds = ImagepostIdsArr
                galleryArray = ImagepostArr1;
              }

              // Upload Documents
              // if (DocumentpostArr[0]?.files?.length > 0) {
              //   for (const file of DocumentpostArr[0].files) {
              //     const uploadedDocument = await uploadFileToLibrary(file, sp, "ARGAnnouncementAndNewsDocs");
              //     documentIds = documentIds.concat(uploadedDocument.map((item: { ID: any }) => item.ID));
              //     if (DocumentpostArr1.length > 0) {
              //       DocumentpostArr1.push(uploadedDocument[0])
              //       const updatedData = DocumentpostArr1.filter(item => item.ID !== 0);
              //       console.log(updatedData, 'updatedData');
              //       documentArray = updatedData;
              //       // documentArray.push(DocumentpostArr1)
              //       DocumentpostIdsArr.push(documentIds[0])//.push(DocumentpostIdsArr)
              //       documentIds = DocumentpostIdsArr
              //     }
              //     else {
              //       documentArray.push(uploadedDocument);
              //     }

              //   }
              // }
              // else {
              //   documentIds = DocumentpostIdsArr;
              //   documentArray = DocumentpostArr1;
              // }
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
                ...(galleryIds != null && galleryIds.length > 0 && {
                  AnnouncementAndNewsGallaryId: galleryIds,

                  AnnouncementAndNewsGallaryJSON: JSON.stringify(flatArray(galleryArray)),
                }),
                ...(documentIds != null && documentIds.length > 0 && {
                  AnnouncementsAndNewsDocsId: documentIds,
                  AnnouncementAndNewsDocsJSON: JSON.stringify(flatArray(documentArray)),
                }),
              };

              if (Object.keys(updatePayload).length > 0) {
                const updateResult = await updateItem(updatePayload, sp, editID);
                console.log("Update Result:", updateResult);
              }
            }
            // ARGContentMaster
            // let TypeMasterData: any = [];
            let TypeMasterData: any = await getAnnouncementandNewsTypeMaster(sp, Number(formData.Type))
            let arr = {
              ContentID: editID,
              ContentName: "ARGAnnouncementAndNews",
              Status: "Pending",
              EntityId: Number(formData.entity),
              // SourceName: TypeMasterData.TypeMaster
              Title: formData.title,
              SourceName: TypeMasterData?.TypeMaster,
              ReworkRequestedBy: "Initiator"

            }
            // await AddContentMaster(sp, arr)

            // const boolval = await handleClick(editID, TypeMasterData?.TypeMaster, Number(formData.entity))
            let boolval = false;
            if (ApprovalRequestItem && ApprovalRequestItem.IsRework && ApprovalRequestItem.IsRework == 'Yes') {
              const ctmasteritm = await sp.web.lists.getByTitle(LIST_TITLE_ContentMaster).items.filter('ContentID eq ' + ApprovalRequestItem.ContentId + " and SourceName eq '" + TypeMasterData?.TypeMaster + "'")();
              if (ctmasteritm && ctmasteritm.length > 0) {
                let updaterec = { 'Status': 'Pending', 'ReworkRequestedBy': 'Initiator' }
                if (ApprovalRequestItem.LevelSequence == 1) updaterec.ReworkRequestedBy = "Level 1";
                await UpdateContentMaster(sp, ctmasteritm[0].Id, updaterec);
                await sp.web.lists.getByTitle(LIST_TITLE_MyRequest).items.getById(ApprovalRequestItem.Id).update({ 'Status': 'Submitted' });
                await sp.web.lists.getByTitle(LIST_TITLE_AnnouncementAndNews).items.getById(editID).update({ 'Status': 'Submitted' });
                boolval = true;
              }
            }
            else {
              await AddContentMaster(sp, arr)
              boolval = await handleClick(editID, TypeMasterData?.TypeMaster, Number(formData.entity))
            }
            if (boolval == true) {
              setLoading(false);
              Swal.fire('Submitted successfully.', '', 'success');
              sessionStorage.removeItem("announcementId")
              setTimeout(() => {
                window.location.href = `${siteUrl}/SitePages/newsmaster.aspx`;
              }, 1000);
            }
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
            let galleryIds: any[] = [];
            let documentIds: any[] = [];
            let galleryArray: any[] = [];
            let documentArray: any[] = [];
            let ImagepostIdsArrN: any[] = [];
            // formData.FeaturedAnnouncement === "on"?  true :false;



            // Upload Banner Images
            if (BnnerImagepostArr.length > 0 && BnnerImagepostArr[0]?.files?.length > 0) {
              for (const file of BnnerImagepostArr[0].files) {
                //  const uploadedBanner = await uploadFile(file, sp, "Documents", Url);
                bannerImageArray = await uploadFile(file, sp, "Documents", tenantUrl);
              }
            }
            debugger
            // Create Post
            const postPayload = {
              Title: formData.title,
              Overview: formData.overview,
              Description: richTextValues.description,
              EntityId: Number(formData.entity),
              CategoryId: Number(formData.category),
              AnnouncementandNewsTypeMasterId: Number(formData.Type),
              //FeaturedAnnouncement: formData.FeaturedAnnouncement === true ? true : false,
              FeaturedAnnouncement: true,
              Status: rows.length > 0 ? "Submitted" : "Approved",
              AuthorId: currentUser.Id,
              AnnouncementandNewsBannerImage: JSON.stringify(bannerImageArray)
            };
            console.log(postPayload);

            const postResult = await addItem(postPayload, sp);
            const postId = postResult?.data?.ID;
            debugger
            if (!postId) {
              console.error("Post creation failed.");
              return;
            }


            console.log(ImagepostArr, 'ImagepostArr', ImagepostArr1, 'ImagepostArr1', DocumentpostArr1, 'DocumentpostArr1', DocumentpostArr, 'DocumentpostArr');

            // Upload Gallery Images
            if (ImagepostArr.length > 0) {
              for (const file of ImagepostArr[0]?.files) {
                const uploadedGalleryImage = await uploadFileToLibrary(file, sp, "AnnouncementAndNewsGallary");

                galleryIds = galleryIds.concat(uploadedGalleryImage.map((item: { ID: any }) => item.ID));
                galleryArray.push(uploadedGalleryImage);
              }
            }

            // Upload Documents
            // if (DocumentpostArr.length > 0) {
            //   for (const file of DocumentpostArr[0]?.files) {
            //     const uploadedDocument = await uploadFileToLibrary(file, sp, "ARGAnnouncementAndNewsDocs");
            //     documentIds = documentIds.concat(uploadedDocument.map((item: { ID: any }) => item.ID));
            //     documentArray.push(uploadedDocument);
            //   }
            // }

            // Update Post with Gallery and Document Information
            const updatePayload = {
              ...(galleryIds != null && galleryIds.length > 0 && {
                AnnouncementAndNewsGallaryId: galleryIds,
                AnnouncementAndNewsGallaryJSON: JSON.stringify(flatArray(galleryArray)),
              }),
              ...(documentIds != null && documentIds.length > 0 && {
                AnnouncementsAndNewsDocsId: documentIds,
                AnnouncementAndNewsDocsJSON: JSON.stringify(flatArray(documentArray)),
              }),
            };

            if (Object.keys(updatePayload).length > 0) {
              const updateResult = await updateItem(updatePayload, sp, postId);
              console.log("Update Result:", updateResult);
            }
            //Chhaya Approval code
            setIsAdded(true)

            let TypeMasterData: any;
            TypeMasterData = await getAnnouncementandNewsTypeMaster(sp, Number(formData.Type))

            let arr = {
              ContentID: postId,
              ContentName: "ARGAnnouncementAndNews",
              // Status: "Panding",
              Status: "Pending",
              Title: formData.title,
              EntityId: Number(formData.entity),
              SourceName: TypeMasterData?.TypeMaster,
              ReworkRequestedBy: "Initiator"

            }
            let boolval;
            if (rows.length > 0) {
              await AddContentMaster(sp, arr)
              boolval = await handleClick(postId, TypeMasterData?.TypeMaster, Number(formData.entity))


            }
            else {
              boolval = true;
            }

            if (boolval == true) {
              setLoading(false);
              Swal.fire('Submitted successfully.', '', 'success');
              // sessionStorage.removeItem("bannerId")
              setTimeout(() => {
                window.location.href = `${siteUrl}/SitePages/newsmaster.aspx`;
              }, 1000);
            }

          }
        })

      }
    }

  }

  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // To store the file preview URL
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);   // To manage modal visibility

  const handlePreviewClick = (fileObj: any) => {
    if (newfileupload === true) {
      console.log(newfilepreview, "here is newfilepreview")
      //alert(`new file ${newfilepreview}`)

      setPreviewUrl(newfilepreview); // Set the preview URL
      setIsModalOpen(true);   // Open the modal
    } else {
      console.log(fileObj, "here is fileObj")
      //alert(`here is fileObj${fileObj}`)
      //alert(`${fileObj.serverUrl} ${fileObj.serverRelativeUrl}`)
      //alert(`fileObj:${fileObj} + fileObj.serverRelativeUrl ${fileObj.serverRelativeUrl}`)
      if (fileObj && fileObj.serverUrl && fileObj.serverRelativeUrl) {
        const fileUrl = `${fileObj.serverUrl.trim()}${fileObj.serverRelativeUrl.trim()}`;
        // Combine serverUrl and serverRelativeUrl
        setPreviewUrl(fileUrl); // Set the preview URL
        setIsModalOpen(true);   // Open the modal
      } else {
        //alert("Invalid file object. Cannot generate preview URL.");
      }
    }


  };

  const closeModal = () => {
    setPreviewUrl(null);
    setIsModalOpen(false);
  };

  //#endregion

  // start save as draft

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
            //console.log("Form Submitted:", formValues, bannerImages, galleryImages, documents);

            let bannerImageArray: any = {};
            let galleryIds: any[] = [];
            let documentIds: any[] = [];
            let galleryArray: any[] = [];
            let documentArray: any[] = [];
            let ImagepostIdsArrN: any[] = [];
            // formData.FeaturedAnnouncement === "on"?  true :false;

            // Upload Banner Images
            if (BnnerImagepostArr.length > 0 && BnnerImagepostArr[0]?.files?.length > 0) {
              for (const file of BnnerImagepostArr[0].files) {
                //  const uploadedBanner = await uploadFile(file, sp, "Documents", Url);
                bannerImageArray = await uploadFile(file, sp, "Documents", tenantUrl);
              }
            }
            else {
              bannerImageArray = null
            }
            debugger
            if (bannerImageArray != null) {
              // Create Post
              const postPayload = {
                Title: formData.title,
                Overview: formData.overview,
                Description: richTextValues.description,
                EntityId: Number(formData.entity),
                CategoryId: Number(formData.category),
                AnnouncementandNewsTypeMasterId: Number(formData.Type),
                //FeaturedAnnouncement: formData.FeaturedAnnouncement === true ? true : false,
                FeaturedAnnouncement: true,
                Status: "Save as draft",
                AuthorId: currentUser.Id,
                AnnouncementandNewsBannerImage: bannerImageArray != "{}" && JSON.stringify(bannerImageArray)
              };
              console.log(postPayload);

              const postResult = await updateItem(postPayload, sp, editID);
              const postId = postResult?.data?.ID;
              debugger
              // if (!postId) {
              //   console.error("Post creation failed.");
              //   return;
              // }

              // Upload Gallery Images
              // Upload Gallery Images
              if (ImagepostArr[0]?.files?.length > 0) {
                for (const file of ImagepostArr[0].files) {

                  const uploadedGalleryImage = await uploadFileToLibrary(file, sp, "AnnouncementAndNewsGallary");

                  galleryIds = galleryIds.concat(uploadedGalleryImage.map((item: { ID: any }) => item.ID));
                  if (ImagepostArr1.length > 0) {

                    ImagepostArr1.push(uploadedGalleryImage[0])
                    const updatedData = ImagepostArr1.filter(item => item.ID !== 0);
                    console.log(updatedData, 'updatedData');
                    galleryArray = updatedData;
                    //galleryArray.push(ImagepostArr1);

                    ImagepostIdsArr.push(galleryIds != null ? galleryIds[0] : []) //galleryIds.push(ImagepostIdsArr)
                    galleryIds = ImagepostIdsArr
                  }
                  else {
                    galleryArray.push(uploadedGalleryImage);
                  }
                }
              }
              else {
                galleryIds = ImagepostIdsArr
                galleryArray = ImagepostArr1;
              }

              // Upload Documents
              // if (DocumentpostArr[0]?.files?.length > 0) {
              //   for (const file of DocumentpostArr[0].files) {
              //     const uploadedDocument = await uploadFileToLibrary(file, sp, "ARGAnnouncementAndNewsDocs");
              //     documentIds = documentIds.concat(uploadedDocument.map((item: { ID: any }) => item.ID));
              //     if (DocumentpostArr1.length > 0) {
              //       DocumentpostArr1.push(uploadedDocument[0])
              //       const updatedData = DocumentpostArr1.filter(item => item.ID !== 0);
              //       console.log(updatedData, 'updatedData');
              //       documentArray = updatedData;
              //       // documentArray.push(DocumentpostArr1)
              //       DocumentpostIdsArr.push(documentIds[0])//.push(DocumentpostIdsArr)
              //       documentIds = DocumentpostIdsArr
              //     }
              //     else {
              //       documentArray.push(uploadedDocument);
              //     }

              //   }
              // }
              // else {
              //   documentIds = DocumentpostIdsArr
              //   documentArray = DocumentpostArr1
              // }
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
                console.log(documentIds, 'documentIds');
                console.log(galleryIds, 'galleryIds');
                // Update Post with Gallery and Document Information

              }
              const updatePayload = {
                ...(galleryIds != null && galleryIds.length > 0 && {
                  AnnouncementAndNewsGallaryId: galleryIds,

                  AnnouncementAndNewsGallaryJSON: JSON.stringify(flatArray(galleryArray)),
                }),
                ...(documentIds != null && documentIds.length > 0 && {
                  AnnouncementsAndNewsDocsId: documentIds,
                  AnnouncementAndNewsDocsJSON: JSON.stringify(flatArray(documentArray)),
                }),
              };

              if (Object.keys(updatePayload).length > 0) {
                const updateResult = await updateItem(updatePayload, sp, editID);
                console.log("Update Result:", updateResult);
              }
            }
            else {
              // Create Post
              const postPayload = {
                Title: formData.title,
                Overview: formData.overview,
                Description: richTextValues.description,
                EntityId: Number(formData.entity),
                CategoryId: Number(formData.category),
                AnnouncementandNewsTypeMasterId: Number(formData.Type),
                //FeaturedAnnouncement: formData.FeaturedAnnouncement === true ? true : false,
                FeaturedAnnouncement: true,
                Status: "Save as draft",
                AuthorId: currentUser.Id
              };
              console.log(postPayload);

              const postResult = await updateItem(postPayload, sp, editID);
              const postId = postResult?.data?.ID;
              debugger
              // if (!postId) {
              //   console.error("Post creation failed.");
              //   return;
              // }

              // Upload Gallery Images
              // Upload Gallery Images
              if (ImagepostArr[0]?.files?.length > 0) {
                for (const file of ImagepostArr[0].files) {

                  const uploadedGalleryImage = await uploadFileToLibrary(file, sp, "AnnouncementAndNewsGallary");

                  galleryIds = galleryIds.concat(uploadedGalleryImage.map((item: { ID: any }) => item.ID));
                  if (ImagepostArr1.length > 0) {

                    ImagepostArr1.push(uploadedGalleryImage[0])
                    const updatedData = ImagepostArr1.filter(item => item.ID !== 0);
                    console.log(updatedData, 'updatedData');
                    galleryArray = updatedData;
                    // galleryArray.push(ImagepostArr1);

                    ImagepostIdsArr.push(galleryIds != null ? galleryIds[0] : []) //galleryIds.push(ImagepostIdsArr)
                    galleryIds = ImagepostIdsArr
                  }
                  else {
                    galleryArray.push(uploadedGalleryImage);
                  }
                }
              }
              else {
                galleryIds = ImagepostIdsArr
                galleryArray = ImagepostArr1;
              }

              // Upload Documents
              // if (DocumentpostArr[0]?.files?.length > 0) {
              //   for (const file of DocumentpostArr[0].files) {
              //     const uploadedDocument = await uploadFileToLibrary(file, sp, "ARGAnnouncementAndNewsDocs");
              //     documentIds = documentIds.concat(uploadedDocument.map((item: { ID: any }) => item.ID));
              //     if (DocumentpostArr1.length > 0) {
              //       DocumentpostArr1.push(uploadedDocument[0])
              //       const updatedData = DocumentpostArr1.filter(item => item.ID !== 0);
              //       console.log(updatedData, 'updatedData');
              //       documentArray = updatedData;
              //       // documentArray.push(DocumentpostArr1)
              //       DocumentpostIdsArr.push(documentIds[0])//.push(DocumentpostIdsArr)
              //       documentIds = DocumentpostIdsArr
              //     }
              //     else {
              //       documentArray.push(uploadedDocument);
              //     }

              //   }
              // }
              // else {
              //   documentIds = DocumentpostIdsArr;
              //   documentArray = DocumentpostArr1;
              // }
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

                ...(galleryIds != null && galleryIds.length > 0 && {
                  AnnouncementAndNewsGallaryId: galleryIds,

                  AnnouncementAndNewsGallaryJSON: JSON.stringify(flatArray(galleryArray)),
                }),
                ...(documentIds != null && documentIds.length > 0 && {
                  AnnouncementsAndNewsDocsId: documentIds,
                  AnnouncementAndNewsDocsJSON: JSON.stringify(flatArray(documentArray)),
                }),
              };

              if (Object.keys(updatePayload).length > 0) {
                const updateResult = await updateItem(updatePayload, sp, editID);
                console.log("Update Result:", updateResult);
              }
            }
            setLoading(false);
            Swal.fire('Saved successfully.', '', 'success');
            sessionStorage.removeItem("announcementId")
            setTimeout(() => {
              window.location.href = `${siteUrl}/SitePages/newsmaster.aspx`;
            }, 1000);
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
            let galleryIds: any[] = [];
            let documentIds: any[] = [];
            let galleryArray: any[] = [];
            let documentArray: any[] = [];
            let ImagepostIdsArrN: any[] = [];
            // formData.FeaturedAnnouncement === "on"?  true :false;



            // Upload Banner Images
            if (BnnerImagepostArr.length > 0 && BnnerImagepostArr[0]?.files?.length > 0) {
              for (const file of BnnerImagepostArr[0].files) {
                //  const uploadedBanner = await uploadFile(file, sp, "Documents", Url);
                bannerImageArray = await uploadFile(file, sp, "Documents", tenantUrl);
              }
            }
            debugger
            // Create Post
            const postPayload = {
              Title: formData.title,
              Overview: formData.overview,
              Description: richTextValues.description,
              EntityId: Number(formData.entity),
              CategoryId: Number(formData.category),
              AnnouncementandNewsTypeMasterId: Number(formData.Type),
              //FeaturedAnnouncement: formData.FeaturedAnnouncement === true ? true : false,
              FeaturedAnnouncement: true,
              Status: "Save as draft",
              AuthorId: currentUser.Id,
              AnnouncementandNewsBannerImage: JSON.stringify(bannerImageArray)
            };
            console.log(postPayload);

            const postResult = await addItem(postPayload, sp);
            const postId = postResult?.data?.ID;
            debugger
            if (!postId) {
              console.error("Post creation failed.");
              return;
            }

            console.log(ImagepostArr, 'ImagepostArr', ImagepostArr1, 'ImagepostArr1', DocumentpostArr1, 'DocumentpostArr1', DocumentpostArr, 'DocumentpostArr');

            // Upload Gallery Images
            if (ImagepostArr.length > 0) {
              for (const file of ImagepostArr[0]?.files) {
                const uploadedGalleryImage = await uploadFileToLibrary(file, sp, "AnnouncementAndNewsGallary");

                galleryIds = galleryIds.concat(uploadedGalleryImage.map((item: { ID: any }) => item.ID));
                galleryArray.push(uploadedGalleryImage);
              }
            }

            // Upload Documents
            // if (DocumentpostArr.length > 0) {
            //   for (const file of DocumentpostArr[0]?.files) {
            //     const uploadedDocument = await uploadFileToLibrary(file, sp, "ARGAnnouncementAndNewsDocs");
            //     documentIds = documentIds.concat(uploadedDocument.map((item: { ID: any }) => item.ID));
            //     documentArray.push(uploadedDocument);
            //   }
            // }

            // Update Post with Gallery and Document Information
            const updatePayload = {
              ...(galleryIds != null && galleryIds.length > 0 && {
                AnnouncementAndNewsGallaryId: galleryIds,
                AnnouncementAndNewsGallaryJSON: JSON.stringify(flatArray(galleryArray)),
              }),
              ...(documentIds != null && documentIds.length > 0 && {
                AnnouncementsAndNewsDocsId: documentIds,
                AnnouncementAndNewsDocsJSON: JSON.stringify(flatArray(documentArray)),
              }),
            };

            if (Object.keys(updatePayload).length > 0) {
              const updateResult = await updateItem(updatePayload, sp, postId);
              console.log("Update Result:", updateResult);
            }
            setLoading(false);
            Swal.fire('Saved successfully.', '', 'success');
            // sessionStorage.removeItem("bannerId")
            setTimeout(() => {
              window.location.href = `${siteUrl}/SitePages/newsmaster.aspx`;
            }, 1000);
          }
        })

      }
    }

  }

  // end save as draft

  //#region flatArray

  const flatArray = (arr: any[]): any[] => {
    return arr.reduce((acc, val) => acc.concat(val), []);
  };
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

    if (libraryName === 'bannerimg') {
      newfileupload = true
      //alert(`banner img `)
    }
    debugger;
    event.preventDefault();
    let uloadDocsFiles: any[] = [];
    let uloadDocsFiles1: any[] = [];

    let uloadImageFiles: any[] = [];
    let uloadImageFiles1: any[] = [];

    let uloadBannerImageFiles: any[] = [];

    if (event.target.files && event.target.files.length > 0 && event.target.files.length < 6) {
      const files = Array.from(event.target.files);
      (event.target as HTMLInputElement).value = '';
      // if (libraryName === "Docs") {
      //   const docFiles = files.filter(file =>
      //     file.type === 'application/pdf' ||
      //     file.type === 'application/msword' ||
      //     file.type === 'application/xsls' ||
      //     file.type === 'text/csv' || file.type === 'text/csv' ||
      //     file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      //     file.type === "application/vnd.openxmlformats-officedocument.presentationml.presentation" || file.type === 'text/'
      //   );

      //   if (docFiles.length > 0) {
      //     const arr = {
      //       files: docFiles,
      //       libraryName: libraryName,
      //       docLib: docLib
      //     };
      //     uloadDocsFiles.push(arr);
      //     setDocumentpostArr(uloadDocsFiles);
      //     if (DocumentpostArr1.length > 0) {
      //       //  uloadDocsFiles1.push(DocumentpostArr1)
      //       docFiles.forEach(ele => {
      //         let arr1 = {
      //           "ID": 0,
      //           "Createdby": "",
      //           "Modified": "",
      //           "fileUrl": "",
      //           "fileSize": ele.size,
      //           "fileType": ele.type,
      //           "fileName": ele.name
      //         }
      //         DocumentpostArr1.push(arr1);

      //       }
      //       )

      //       setDocumentpostArr1(DocumentpostArr1);
      //     }
      //     else {
      //       docFiles.forEach(ele => {
      //         let arr1 = {
      //           "ID": 0,
      //           "Createdby": "",
      //           "Modified": "",
      //           "fileUrl": "",
      //           "fileSize": ele.size,
      //           "fileType": ele.type,
      //           "fileName": ele.name
      //         }
      //         uloadDocsFiles1.push(arr1);

      //       }
      //       )

      //       setDocumentpostArr1(uloadDocsFiles1);
      //     }


      //   } else {
      //     Swal.fire("only document can be upload")
      //   }
      // }
      let errormsg = "";

      if (libraryName === "Gallery" || libraryName === "bannerimg") {
        const imageVideoFiles = libraryName === "Gallery" ? files.filter(file =>
          file.type.startsWith('image/') ||
          file.type.startsWith('video/')
        ) : files.filter(file =>
          file.type.startsWith('image/')
        );

        if (imageVideoFiles.length > 0) {
          const preview = URL.createObjectURL(imageVideoFiles[0]); // Generate preview URL
          //alert(`preview ${preview}`)
          newfilepreview = preview
          setPreviewUrl(preview);
          const arr = {
            files: imageVideoFiles,
            libraryName: libraryName,
            docLib: docLib,
            fileUrl: URL.createObjectURL(imageVideoFiles[0])
          };
          if (libraryName === "Gallery") {
            uloadImageFiles.push(arr);
            setImagepostArr(uloadImageFiles);
            if (ImagepostArr1.length > 0 && ImagepostArr1.length < 6) {
              imageVideoFiles.forEach(ele => {
                let arr1 = {
                  "ID": 0,
                  "Createdby": "",
                  "Modified": "",
                  "fileUrl": URL.createObjectURL(ele),
                  "fileSize": ele.size,
                  "fileType": ele.type,
                  "fileName": ele.name
                }
                ImagepostArr1.push(arr1);

              }
              )
              setImagepostArr1(ImagepostArr1);
            }
            else {

              imageVideoFiles.forEach(ele => {
                let arr1 = {
                  "ID": 0,
                  "Createdby": "",
                  "Modified": "",
                  "fileUrl": URL.createObjectURL(ele),
                  "fileSize": ele.size,
                  "fileType": ele.type,
                  "fileName": ele.name
                }
                uloadImageFiles1.push(arr1);

              }
              )
              setImagepostArr1(uloadImageFiles1);

            }
          } else {
            uloadBannerImageFiles.push(arr);
            setBannerImagepostArr(uloadBannerImageFiles);
          }
        } else {
          handleResetgal();
          handleReset();
          Swal.fire(libraryName === "Gallery" ? "only image & video can be uploaded" : "only image can be uploaded")
        }
      }
    }
  };
  //#endregion
  console.log(DocumentpostArr1, 'DocumentpostArr', ImagepostArr1, 'ImagepostArr', BnnerImagepostArr, 'BnnerImagepostArr');
  //#region handleChange
  const handleChange = (e: { target: { name: any; value: any; files: any; }; }) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };
  //#endregion

  const handleCancel = () => {
    debugger
    if (pageValue == "MyRequest") {
      window.location.href = `${siteUrl}/SitePages/MyRequests.aspx`;
    } else if (pageValue == "MyApproval") {
      window.location.href = `${siteUrl}/SitePages/MyApprovals.aspx`;
    } else {
      window.location.href = `${siteUrl}/SitePages/newsmaster.aspx`;
    }

  }
  const formats = [
    "header", "height", "bold", "italic",
    "underline", "strike", "blockquote",
    "list", "color", "bullet", "indent",
    //"link",
    "image", "align", "size",
  ];

  const modules = {
    toolbar: [
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      [
        //"link",
        "image"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" }
      ],
      [{ "color": ["#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466", 'custom-color'] }],
    ]
  };

  //#region onCancel
  const onCancel = (val: any) => {
    debugger
    console.log(val, 'valll')
    Swal.fire({
      title: "Do you want to cancel this request?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (val == true) {
        window.location.href = `${siteUrl}/SitePages/newsmaster.aspx`
      }
    });


  }
  //#endregion

  //#region OpenModal
  console.log(DocumentpostArr, 'DocumentpostArr', ImagepostArr, 'ImagepostArr', BnnerImagepostArr, 'BnnerImagepostArr');
  const setShowModalFunc = (bol: boolean, name: string) => {

    if (name == "bannerimg") {
      setShowModal(bol)
      setShowBannerTable(true)
      setShowImgTable(false)
      setShowDocTable(false)
    }
    else if (name == "Gallery") {
      setShowModal(bol)
      setShowImgTable(true)
      setShowBannerTable(false)
      setShowDocTable(false)
    }
    else {
      setShowModal(bol)
      setShowDocTable(true)
      setShowBannerTable(false)
      setShowImgTable(false)
    }
  }
  //#endregion

  //#region deleteLocalFile
  const deleteLocalFile = (index: number, filArray: any[], name: string) => {
    debugger
    console.log(filArray, 'filArrayhj');

    // Remove the file at the specified index
    filArray.splice(index, 1);
    console.log(filArray, 'filArraymmmmmm');

    // Update the state based on the title
    if (name === "bannerimg") {
      setBannerImagepostArr([...filArray]);
      filArray[0].files.length > 0 ? "" : setShowModal(false); clearFileInput(name);
    } else if (name === "Gallery") {
      setImagepostArr1([...filArray]);
      filArray[0].files.length > 0 ? "" : setShowModal(false); clearFileInput(name);
    } else {
      setDocumentpostArr1([...filArray]);
      filArray[0].files.length > 0 ? "" : setShowModal(false); clearFileInput(name);
    }
    // Clear the file input
    console.log(filArray, 'filArray');
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

  //#region onChange
  const onChange = async (name: string, value: string) => {
    debugger
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name == "Type") {
      setCategoryData(await getCategory(sp, Number(value))) // Category
    }
    if (name == "entity") {
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
  //#endregion

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
        ContentName: "ARGAnnouncementAndNews",
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


  //#region view
  return (
    <div id="wrapper" ref={elementRef}>
      <div
        className="app-menu"
        id="myHeader">
        <VerticalSideBar _context={sp} />
      </div>
      <div className="content-page">
        <HorizontalNavbar _context={sp} siteUrl={siteUrl} />
        <div className="content" style={{ marginLeft: `${!useHide ? '240px' : '80px'}`, marginTop: '0rem' }}>
          <div className="container-fluid  paddb">
            <div className="row">
              <div className="col-lg-5">
                <CustomBreadcrumb Breadcrumb={Breadcrumb} />
              </div>
            </div>
            <div className="card mt-3" >
              <div className="card-body">
                <div className="row mt-2">
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
                    <form className='row' >
                      <div className=""><strong className="font-16 mb-1">Basic Information</strong><p className="font-14 text-muted mb-3 mt-1">Specify basic information </p></div>
                      <div className="col-lg-4">
                        <div className="mb-3">
                          <label htmlFor="title" className="form-label">
                            Title <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            id="title"
                            name="title"
                            placeholder='Enter Title'
                            // className="form-control inputcss"
                            className={`form-control ${(!ValidDraft) ? "border-on-error" : ""} ${(!ValidSubmit) ? "border-on-error" : ""}`}
                            value={formData.title}
                            onChange={(e) => onChange(e.target.name, e.target.value)}
                            disabled={InputDisabled}

                          />
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="mb-3">
                          <label htmlFor="Type" className="form-label">
                            Type <span className="text-danger">*</span>
                          </label>
                          <select
                            // className="form-select inputcss"
                            id="Type"
                            name="Type"
                            value={formData.Type}
                            onChange={(e) => onChange(e.target.name, e.target.value)}
                            className={`form-select ${(!ValidDraft) ? "border-on-error" : ""} ${(!ValidSubmit) ? "border-on-error" : ""}`}
                            disabled={true}
                          >
                            <option>Select</option>
                            {
                              TypeData.map((item, index) => (
                                <option key={index} value={item.id}>{item.name}</option>
                              )
                              )
                            }


                          </select>
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="mb-3">
                          <label htmlFor="category" className="form-label">
                            Category <span className="text-danger">*</span>
                          </label>
                          <select
                            // className="form-select inputcss"
                            className={`form-select ${(!ValidSubmit) ? "border-on-error" : ""}`}
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={(e) => onChange(e.target.name, e.target.value)}
                            // disabled={ApprovalMode}
                            disabled={InputDisabled}

                          >
                            <option>Select</option>
                            {
                              CategoryData.map((item, index) => (
                                <option key={index} value={item.id}>{item.name}</option>
                              )
                              )
                            }


                          </select>
                        </div>
                      </div>

                      <div className="col-lg-4">
                        <div className="mb-3">
                          <label htmlFor="entity" className="form-label">
                            Department <span className="text-danger">*</span>
                          </label>
                          <select
                            //  className="form-select inputcss"
                            className={`form-select ${(!ValidSubmit) ? "border-on-error" : ""}`}
                            id="entity"
                            name="entity"
                            value={formData.entity}
                            onChange={(e) => onChange(e.target.name, e.target.value)}
                            // disabled={ApprovalMode}
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
                                News Image <span className="text-danger">*</span>
                              </label>
                            </div>
                            <div>
                              <div>
                                {BnnerImagepostArr[0] != false && BnnerImagepostArr.length > 0 &&
                                  BnnerImagepostArr != undefined ? BnnerImagepostArr.length == 1 &&
                                (<a style={{ fontSize: '0.875rem' }} onClick={() => handlePreviewClick(BnnerImagepostArr[0])}>
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
                            className={`form-control  ${(!ValidSubmit) ? "border-on-error" : ""}`}
                            // className="form-control inputcss"
                            onChange={(e) => onFileChange(e, "bannerimg", "Document")}
                            // disabled={ApprovalMode}
                            disabled={InputDisabled}

                          />
                        </div>
                      </div>

                      <div className="col-lg-4">
                        <div className="mb-3">

                          <div className='d-flex justify-content-between'>
                            <div>
                              <label htmlFor="announcementGallery" className="form-label">
                                News Gallery <span className="text-danger">*</span>
                              </label>
                            </div>
                            <div>

                              {ImagepostArr1.length > 0 &&
                                ImagepostArr1.length == 1 &&
                                (<a onClick={() => setShowModalFunc(true, "Gallery")} style={{ fontSize: '0.875rem' }}>
                                  <FontAwesomeIcon icon={faPaperclip} /> {ImagepostArr1.length} file Attached
                                </a>)
                                || ImagepostArr1.length > 0 && ImagepostArr1.length > 1 &&
                                (<a onClick={() => setShowModalFunc(true, "Gallery")} style={{ fontSize: '0.875rem' }}>
                                  <FontAwesomeIcon icon={faPaperclip} /> {ImagepostArr1.length} files Attached
                                </a>)
                              }

                            </div>
                          </div>
                          <input
                            type="file"
                            ref={inputFilegal}
                            id="announcementGallery"
                            name="announcementGallery"
                            accept=".jpeg,.jpg,.png,.gif,.mp4,.mp3,.mkv,.webm,.flv,.vob,.ogg,.wmv,.yuv.,MTS,.TS,.m4p..mpeg,.mpe,.mpv,.m4v,.svi,.3gp,.3g2,.roq,.nsv,.flv,.f4v,.f4p,.f4a,.f4b"

                            //className="form-control inputcss"
                            className={`form-control  ${(!ValidSubmit) ? "border-on-error" : ""}`}
                            multiple
                            //maxLength={5}
                            onChange={(e) => onFileChange(e, "Gallery", "AnnouncementAndNewsGallary")}
                            // disabled={ApprovalMode}
                            disabled={InputDisabled}

                          />
                        </div>
                      </div>

                      {/* <div className="col-lg-4">
                      <div className="mb-3">

                        <div className='d-flex justify-content-between'>
                          <div>
                            <label htmlFor="announcementThumbnail" className="form-label">
                              Announcement Document <span className="text-danger">*</span>
                            </label>
                          </div>
                          <div>
                            {DocumentpostArr1.length > 0 &&
                              DocumentpostArr1.length == 1 &&
                              (<a onClick={() => setShowModalFunc(true, "docs")} style={{ fontSize: '0.875rem' }}>
                                <FontAwesomeIcon icon={faPaperclip} /> {DocumentpostArr1.length} file Attached
                              </a>)
                              || DocumentpostArr1.length > 0 && DocumentpostArr1.length > 1 &&
                              (<a onClick={() => setShowModalFunc(true, "docs")} style={{ fontSize: '0.875rem' }}>
                                <FontAwesomeIcon icon={faPaperclip} /> {DocumentpostArr1.length} files Attached
                              </a>)
                            }
                          </div>
                        </div>
                        <input
                          type="file"
                          id="announcementThumbnail"
                          name="announcementThumbnail"
                          className="form-control inputcss"
                          multiple
                          onChange={(e) => onFileChange(e, "Docs", "ARGAnnouncementAndNewsDocs")}
                          // disabled={ApprovalMode}
                          disabled={InputDisabled}

                        />
                      </div>
                    </div> */}

                      {/* <div className="col-lg-3">
                      <div className="mb-3">
                        <label htmlFor="FeaturedAnnouncement" className="form-label">
                          Featured Announcement <span className="text-danger">*</span>
                        </label>
                        <br />
                        <div className="form-check">
                          <input
                            type="checkbox"
                            id="FeaturedAnnouncement"
                            name="FeaturedAnnouncement"
                            checked={formData.FeaturedAnnouncement}
                            onChange={(e) => handleChangeCheckBox(e.target.name, e.target.checked)}
                            // disabled={ApprovalMode}
                            disabled={InputDisabled}

                            className="form-check-input inputcss"
                           
                          />
                        </div>
                      </div>
                    </div> */}

                      <div className="col-lg-12">
                        <div className="mb-3">
                          <label htmlFor="overview" className="form-label">
                            Overview <span className="text-danger">*</span>
                          </label>
                          <textarea
                            className={`form-control  ${(!ValidSubmit) ? "border-on-error" : ""}`}
                            // className="form-control inputcss"
                            id="overview"
                            placeholder='Enter Overview'
                            name="overview"
                            style={{ height: "100px" }}
                            value={formData.overview}
                            onChange={(e) => onChange(e.target.name, e.target.value)}
                            // disabled={ApprovalMode}
                            disabled={InputDisabled}

                          ></textarea>
                        </div>
                      </div>

                      <div className="col-lg-12">
                        <div className="mb-3">
                          <label htmlFor="description" className="form-label">
                            Description
                            {/* <span className="text-danger">*</span> */}
                          </label>
                          <div style={{ display: "contents", justifyContent: "start" }}>
                            <ReactQuill
                              theme="snow"
                              modules={modules}
                              formats={formats}
                              placeholder={''}
                              value={richTextValues.description}
                              onChange={(content) => {
                                setRichTextValues((prevValues) => ({
                                  ...prevValues,
                                  ["description"]: content,
                                }));
                              }}
                              style={{ width: '100%', fontSize: '6px', height: '100px' }}
                              readOnly={InputDisabled}
                            />
                          </div>
                        </div>
                      </div>

                    </form>
                  }
                </div>
              </div>
            </div>
            {
              // rows != null && rows.length > 0 &&
              rows != null && rows.length > 0 && !ApprovalMode ?
                (
                  <div className="mt-2">
                    <div className="card cardborder p-4">
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

                        <table className="mtbalenew nretabl0">
                          <thead>
                            <tr>
                              <th style={{ minWidth: '60px', maxWidth: '60px' }} className="newpad">  Select Level</th>
                              <th className="newpad"> Select Approver</th>
                            </tr>
                          </thead>
                          <tbody style={{ overflowX: 'hidden', overflow: 'initial' }}>

                            {rows.map((row: any) => (
                              <div className="row mb-0" key={row.id}>
                                <tr style={{ overflow: 'initial' }}>
                                  <td style={{ minWidth: '60px', maxWidth: '60px', overflow: 'initial' }} className="">
                                    <select style={{ border: "0px solid #ccc", background: '#fff' }}
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
                                    </select>

                                  </td>
                                  <td style={{ overflow: 'initial' }} className="">
                                    <Multiselect className="removeb" style={{ border: "0px solid #ccc", background: '#fff' }}
                                      options={row.approvedUserList}
                                      selectedValues={row.approvedUserListupdate}
                                      onSelect={(selected) => handleUserSelect(selected, row.id)}
                                      onRemove={(selected) => handleUserSelect(selected, row.id)}
                                      displayValue="name"
                                      disable={true}
                                      placeholder=''
                                      hidePlaceholder={true}
                                    /> </td>
                                </tr>

                              </div>
                            ))}
                          </tbody>
                        </table>
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
                ) : (<div></div>)




              // <ApprovalHierarchy data={ApprovalConfigurationData} levels={levels} usersitem={usersitem} IsAdded={IsAdded}/>

            }

            {
              //let forrework=ApprovalRequestItem && ApprovalRequestItem.IsRework=='Yes'&& ApprovalRequestItem.LevelSequence!=0;
              (InputDisabled && ApprovalRequestItem) || (ApprovalRequestItem && ApprovalRequestItem.IsRework == 'Yes' && ApprovalRequestItem.LevelSequence != 0) ? (
                <WorkflowAction currentItem={ApprovalRequestItem} ctx={props.context} ContentType={LIST_TITLE_MyRequest}
                  DisableApproval={ApprovalRequestItem && ApprovalRequestItem.IsRework == 'Yes' && ApprovalRequestItem.LevelSequence != 0}
                  DisableCancel={ApprovalRequestItem && ApprovalRequestItem.IsRework == 'Yes' && ApprovalRequestItem.LevelSequence != 0}
                //DisableReject={ApprovalRequestItem && ApprovalRequestItem.IsRework=='Yes'&& ApprovalRequestItem.LevelSequence!=0}
                />
              ) : (<div></div>)
            }
            {
              !InputDisabled ?
                (<div className="text-center" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                  <div className="btn btn-success waves-effect waves-light m-1" style={{ width: '145px' }} onClick={handleSaveAsDraft}>
                    <div className='d-flex' style={{ justifyContent: 'center' }}>
                      <img src={require('../../../Assets/ExtraImage/checkcircle.svg')} style={{ width: '1rem' }} className='me-1' alt="Check" /> Save As Draft
                    </div>
                  </div>
                  <div className="btn btn-success waves-effect waves-light m-1" style={{ width: '145px' }} onClick={handleFormSubmit}>
                    <div className='d-flex' style={{ justifyContent: 'center' }}>
                      <img src={require('../../../Assets/ExtraImage/checkcircle.svg')} style={{ width: '1rem' }} className='me-1' alt="Check" /> Submit
                    </div>
                  </div>
                  <button type="button" className="btn cancel-btn waves-effect waves-light m-1" style={{ width: '145px' }} onClick={handleCancel}>
                    <img src={require('../../../Assets/ExtraImage/xIcon.svg')} style={{ width: '1rem' }}
                      className='me-1' alt="x" />
                    Cancel
                  </button>
                </div>) :
                (modeValue == 'view') && (<div className="text-center" style={{ marginTop: '2rem' }}><button type="button" className="btn cancel-btn waves-effect waves-light m-1" style={{ width: '145px' }} onClick={handleCancel}>
                  <img src={require('../../../Assets/ExtraImage/xIcon.svg')} style={{ width: '1rem' }}
                    className='me-1' alt="x" />
                  Cancel
                </button></div>)
            }
            {rows != null && rows.length > 0 && formData.title != "" && editID !== null &&
              <WorkflowAuditHistory ContentItemId={editID} ContentType={CONTENTTYPE_News} ctx={props.context} />
            }
            {/* Modal to display uploaded files */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size='lg' >
              <Modal.Header closeButton>
                {DocumentpostArr1.length > 0 && showDocTable && <Modal.Title>Documents</Modal.Title>}
                {ImagepostArr1.length > 0 && showImgModal && <Modal.Title>Gallery Images/Videos</Modal.Title>}
                {BnnerImagepostArr.length > 0 && showBannerModal && <Modal.Title>Banner Images</Modal.Title>}
              </Modal.Header>
              <Modal.Body className="scrollbar" id="style-5">

                {DocumentpostArr1.length > 0 && showDocTable &&
                  (
                    <>
                      <table className="table table-bordered" style={{ fontSize: '0.75rem' }}>
                        <thead style={{ background: '#eef6f7' }}>
                          <tr>
                            <th>Serial No.</th>
                            <th>File Name</th>
                            <th>File Size</th>
                            <th className='text-center'>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {DocumentpostArr1.map((file: any, index: number) => (
                            <tr key={index}>
                              <td className='text-center'>{index + 1}</td>
                              <td>{file.fileName.replace("/sites/ededms/", "")}</td>
                              <td className='text-right'>{file.fileSize}</td>
                              <td className='text-center'> <img src={require("../../../CustomAsset/trashed.svg")} style={{ width: '15px' }} onClick={() => deleteLocalFile(index, DocumentpostArr1, "docs")} /> </td>
                            </tr>
                          ))}
                        </tbody>
                      </table></>
                  )
                }
                {ImagepostArr1.length > 0 && showImgModal &&
                  (
                    <>
                      <table className="table table-bordered" style={{ fontSize: '0.75rem' }}>
                        <thead style={{ background: '#eef6f7' }}>
                          <tr>
                            <th>Serial No.</th>
                            <th> Image </th>
                            <th>File Name</th>
                            <th>File Size</th>
                            {modeValue == 'null' && <th className='text-center'>Action</th>
                            }
                          </tr>
                        </thead>
                        <tbody>
                          {ImagepostArr1.map((file: any, index: number) => (
                            <tr key={index}>
                              <td className='text-center'>{index + 1}</td>
                              <td>
                                <img className='imagefe' src={file.fileUrl ? file.fileUrl : `${siteUrl}/AnnouncementAndNewsGallary/${file.fileName}`}
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => handleShow(
                                    `${siteUrl}/AnnouncementAndNewsGallary/${file.fileName}`
                                  )}
                                />
                              </td>

                              <td>{file.fileName}</td>
                              <td className='text-right'>{file.fileSize}</td>
                              {(modeValue != 'view' || pageValue != 'MyApproval') && <td className='text-center'>
                                <img src={require("../../../CustomAsset/trashed.svg")} style={{ width: '15px' }} onClick={() => deleteLocalFile(index, ImagepostArr1, "Gallery")} />

                              </td>
                              }
                            </tr>
                          ))}
                        </tbody>
                      </table></>
                  )}
                {BnnerImagepostArr.length > 0 && showBannerModal &&
                  (
                    <>
                      <table className="table table-bordered" style={{ fontSize: '0.75rem' }}>
                        <thead style={{ background: '#eef6f7' }}>
                          <tr>
                            <th>Serial No.</th>
                            <th>Image</th>
                            <th>File Name</th>
                            <th>File Size</th>
                            <th className='text-center'>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {BnnerImagepostArr[0].files.map((file: any, index: number) => (
                            <tr key={index}>
                              <td className='text-center'>{index + 1}</td>
                              <img
                                className='imagefe'
                                src={file.fileType.startsWith('video/') ?
                                  require("../../../Assets/ExtraImage/video.jpg") :
                                  (file.fileUrl ? file.fileUrl : `${siteUrl}/MediaGallery/${file.fileName}`)}
                                alt={'default image'}
                              />
                              <td>{file.name}</td>
                              <td className='text-right'>{file.size}</td>
                              <td className='text-center'> <img src={require("../../../CustomAsset/trashed.svg")} style={{ width: '15px' }} onClick={() => deleteLocalFile(index, BnnerImagepostArr, "bannerimg")} /> </td>
                            </tr>
                          ))}
                        </tbody>
                      </table></>
                  )}

              </Modal.Body>

            </Modal>
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Image Preview</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <img src={modalImageSrc} alt="Image Preview" style={{ width: '100%' }} />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
            <Modal show={isModalOpen} onHide={closeModal}>
              <Modal.Header closeButton>
                <Modal.Title>Image Preview</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <img src={previewUrl} alt="Image Preview" style={{ width: '100%' }} />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  )
  //#endregion

}
const Addannouncement: React.FC<IAddannouncementProps> = (props) => {
  return (
    <Provider>
      <AddannouncementContext props={props} />
    </Provider>
  )
}
export default Addannouncement