
import React from 'react'

import Provider from '../../../GlobalContext/provider';

import { IKnowledgeCenterFormProps } from './IKnowledgeCenterFormProps';

import { getSP } from '../loc/pnpjsConfig';

import { SPFI } from '@pnp/sp';

import { useMediaQuery } from 'react-responsive';

import UserContext from '../../../GlobalContext/context';

import { getCurrentUser, getEntity } from '../../../APISearvice/CustomService';

import { getMediaByID, getUrl, updateItem, uploadFile, uploadFileToLibrary } from '../../../APISearvice/MediaService';
import { addItemKnowledge, ARGKnowledgeCenterCategory, updateItemKnowledge, } from '../../../APISearvice/KnowledgeCenterService';

import { decryptId } from '../../../APISearvice/CryptoService';

import Swal from 'sweetalert2';

import CustomBreadcrumb from '../../../CustomJSComponents/CustomBreadcrumb/CustomBreadcrumb';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faPaperclip } from '@fortawesome/free-solid-svg-icons';

import VerticalSideBar from '../../verticalSideBar/components/VerticalSideBar';

import "../../../CustomJSComponents/CustomForm/CustomForm.scss";

import "../../../Assets/Figtree/Figtree-VariableFont_wght.ttf";

import "bootstrap/dist/css/bootstrap.min.css";

import "../../../CustomCss/mainCustom.scss";

import "../../verticalSideBar/components/VerticalSidebar.scss";

import { Modal } from 'react-bootstrap';

import "../components/AddKnowledgeCenter.scss";

import HorizontalNavbar from '../../horizontalNavBar/components/HorizontalNavBar';

import context from '../../../GlobalContext/context';

import { AddContentLevelMaster, AddContentMaster, getApprovalConfiguration, getLevel, UpdateContentMaster } from '../../../APISearvice/ApprovalService';

import { Delete, PlusCircle } from 'react-feather';

import Multiselect from 'multiselect-react-dropdown';

import { WorkflowAction } from '../../../CustomJSComponents/WorkflowAction/WorkflowAction';
import { getUrlParameterValue } from '../../../Shared/Helper';
import { FormSubmissionMode } from '../../../Shared/Interfaces';
import { WorkflowAuditHistory } from '../../../CustomJSComponents/WorkflowAuditHistory/WorkflowAuditHistory';
import { CONTENTTYPE_Media, LIST_TITLE_ContentMaster, LIST_TITLE_MediaGallery, LIST_TITLE_MyRequest } from '../../../Shared/Constants';
let mode = "";
const AddMediaGalaryContext = ({ props }: any) => {

  const sp: SPFI = getSP();

  const Spurl = sp.web;

  console.log(props, 'props');


  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  const { useHide }: any = React.useContext(UserContext);

  const { setHide }: any = context;

  console.log('This function is called only once', useHide);

  const elementRef = React.useRef<HTMLDivElement>(null);

  const [currentUser, setCurrentUser] = React.useState(null);

  const [Url, setBaseUrl] = React.useState([]);

  const [showModal, setShowModal] = React.useState(false);
  const [showModal1, setShowModal1] = React.useState(false);
  const [editForm, setEditForm] = React.useState(false);

  const [editID, setEditID] = React.useState(null);


  const [EnityData, setEnityData] = React.useState([])
  const [pageValue, setpage] = React.useState("");
  const [knowledgecenterCategorydata, setKnowledgeCenterCategory] = React.useState([])
  const [Loading, setLoading] = React.useState(false);
  const [modeValue, setmode] = React.useState("");
  const siteUrl = props.siteUrl;
  const tenantUrl = props.siteUrl.split("/sites/")[0];
  console.log(siteUrl);


  const [BnnerImagepostArr, setBannerImagepostArr] = React.useState([]);

  const [bannerByIDArr, setMediaByIdArr] = React.useState({

    title: '',

    description: "",

    BannerImage: "",

    URL: ""

  })

  const [bannerByIDArrs, setMediaByIdArrs] = React.useState([])

  const [ImagepostArr, setImagepostArr] = React.useState([]);

  const [showImgModal, setShowImgTable] = React.useState(false);


  const [ImagepostArr1, setImagepostArr1] = React.useState([]);

  const [ImagepostIdsArr, setImagepostIdsArr] = React.useState([]);


  const [showBannerModal, setShowBannerTable] = React.useState(false);
  const [showBannerModal2, SetShowMediaImgModal] = React.useState(false);
  const [formData, setFormData] = React.useState({

    title: '',

    BannerImage: "",

    entity: "",

    Category: ""

  })

  const [selectedValue, setSelectedValue] = React.useState([]);

  const [ApprovalConfigurationData, setApprovalConfiguration] = React.useState([]);

  const [levels, setLevel] = React.useState([]);

  const [rows, setRows] = React.useState<any>([]);

  const [ApprovalMode, setApprovalMode] = React.useState(false);
  const [ApprovalRequestItem, setApprovalRequestItem] = React.useState(null);
  const [InputDisabled, setInputDisabled] = React.useState(false);
  const [ValidDraft, setValidDraft] = React.useState(true);
  const [ValidSubmit, setValidSubmit] = React.useState(true);
  const [FormItemId, setFormItemId] = React.useState(null);

  //#region Breadcrumb

  const Breadcrumb = [

    {

      "MainComponent": "Settings",

      "MainComponentURl": `${siteUrl}SitePages/Settings.aspx`

    },

    {

      "ChildComponent": "Knowledge Center Gallery",

      "ChildComponentURl": `${siteUrl}/SitePages/KnowledgeCenterMaster.aspx`

    }

  ]

  //#endregion

  //#region UseEffact

  React.useEffect(() => {

    ApiCallFunc();
    let page = getUrlParameterValue('page');
    setpage(page);
    mode = getUrlParameterValue('mode');
    setmode(mode);
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

    function colorLink(this: HTMLElement) {

      if (linkColor) {

        linkColor.forEach(l => l.classList.remove('active'));

        this.classList.add('active');

      }

    }

    linkColor.forEach(l => l.addEventListener('click', colorLink));

  }, [useHide]);

  //#endregion


  //#region  all api call
  const fetchAudithistory = async () => {
    let mode = getUrlParameterValue('mode');
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

  }

  const ApiCallFunc = async () => {

    const siteUrl = props.siteUrl;

    console.log(siteUrl);

    setLevel(await getLevel(sp))

    await fetchUserInformationList();

    setCurrentUser(await getCurrentUser(sp, siteUrl))

    console.log(siteUrl, 'siteUrl');

    setKnowledgeCenterCategory(await ARGKnowledgeCenterCategory(sp))

    setBaseUrl(await (getUrl(sp, siteUrl)))

    setEnityData(await getEntity(sp)) //Entity

    let formitemid;
    //#region getdataByID
    if (sessionStorage.getItem("mediaId") != undefined) {
      const iD = sessionStorage.getItem("mediaId")
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
    console.log("formitemid", formitemid)
    // if (sessionStorage.getItem("mediaId") != undefined) {
    if (formitemid) {

      // const iD = sessionStorage.getItem("mediaId")

      // console.log(iD, 'iDssss');


      // let iDs = decryptId(iD)

      const setMediaById = await getMediaByID(sp, Number(formitemid))


      console.log(setMediaById, 'setMediaById');

      setEditID(Number(setMediaById[0].ID))

      if (setMediaById.length > 0) {

        debugger

        setEditForm(true)


        let arr = {

          title: setMediaById[0].Title,

          entity: setMediaById[0]?.entity,

          BannerImage: setMediaById[0]?.Image != null ? setMediaById[0]?.Image : [],

          Category: setMediaById[0]?.Category

        }


        let banneimagearr = []


        console.log(setMediaById[0]?.MediaGalleriesId, 'setMediaById[0]?.MediaGalleriesId');

        console.log(setMediaById[0]?.MediaGalleryJSON, 'setMediaById[0]?.MediaGalleryJSON');


        setImagepostIdsArr(setMediaById[0]?.MediaGalleriesId != null ? setMediaById[0]?.MediaGalleriesId : [])

        let imgArr = setMediaById[0].MediaGalleryJSON != null ? setMediaById[0].MediaGalleryJSON : [];

        console.log(imgArr, 'imgArr');


        if (imgArr.length > 0) {

          imgArr = JSON.parse(imgArr)

          setImagepostArr1(imgArr)

        }


        if (setMediaById[0].Image != '{}' && setMediaById[0].Image != null && setMediaById[0].Image.length) {
          let arr1 = {};
          arr1 = JSON.parse(setMediaById[0].Image);
          banneimagearr.push(arr1);

          console.log(banneimagearr, 'banneimagearr');

          setBannerImagepostArr(banneimagearr);

          setFormData(arr)


        }
        else {

          setFormData(arr)

        }

        const rowData: any[] = await getApprovalConfiguration(sp, Number(setMediaById[0].EntityId)) //baseUrl

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

  }


  //#endregion

  console.log(siteUrl)

  //#region OnchangeData

  const onChange = async (name: string, value: string) => {

    debugger

    setFormData((prevData) => ({

      ...prevData,

      [name]: value,

    }));

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
  interface CustomFile extends File {
    fileUrl?: string; // Add the fileUrl property to the CustomFile interface
  }



  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>, libraryName: string, docLib: string) => {

    debugger;
    if (ImagepostArr1.length > 0) {
      deleteLocalFile(0, ImagepostArr1, "Gallery");
    }

    event.preventDefault();
    setImagepostArr1([]);
    let uloadBannerImageFiles: any[] = [];

    let uloadImageFiles: any[] = [];

    let uloadImageFiles1: any[] = [];

    const formatFileSize = (size: number): string => {
      if (size < 1024) return `${size} B`;
      const i = Math.floor(Math.log(size) / Math.log(1024));
      const units = ['B', 'KB', 'MB', 'GB', 'TB'];
      return `${(size / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
    };


    if (event.target.files && event.target.files.length > 0) {

      const files = Array.from(event.target.files);
      (event.target as HTMLInputElement).value = '';


      if (libraryName === "Gallery" || libraryName === "bannerimg") {
        const imageVideoFiles = files.filter(file =>

          file.type.startsWith('image/') ||

          file.type.startsWith('video/')

        );


        if (imageVideoFiles.length > 0) {

          var arr = {};


          if (libraryName === "Gallery") {
            arr = {
              files: imageVideoFiles,

              libraryName: libraryName,

              docLib: docLib,


            };

            uloadImageFiles.push(arr);

            setImagepostArr(uloadImageFiles);

            if (ImagepostArr1.length > 0) {

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

                  "fileUrl": "",

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

            arr = {
              files: imageVideoFiles,

              libraryName: libraryName,

              docLib: docLib,
              name: imageVideoFiles[0].name,

              fileSize: imageVideoFiles[0].size,

              fileUrl: URL.createObjectURL(imageVideoFiles[0])

            };

            // fileSize :formatFileSize(imageVideoFiles[0].size),

            uloadBannerImageFiles.push(arr);

            setBannerImagepostArr(uloadBannerImageFiles);

          }

        } else {

          Swal.fire("only image & video can be upload")

        }



      }

    }

  };

  //#endregion


  //#region OpenModal

  const setShowModalFunc = (bol: boolean, name: string) => {


    if (name == "Gallery") {
      setShowModal(bol)

      setShowImgTable(true)
    }
    else {

      setShowModal1(bol)

      SetShowMediaImgModal(true)

    }



  }

  //#endregion
  const deleteLocalFile = (index: number, filArray: any[], name: string) => {

    // Remove the file at the specified index

    if (name == "Gallery") {

      filArray.splice(index, 1);

      // Update the state based on the title

      setImagepostArr1([...filArray]);

      filArray[0].files.length > 0 ? "" : setShowModal(false);

      clearFileInput(name);

    }
    else {
      filArray.splice(index, 1);

      // Update the state based on the title

      setBannerImagepostArr([...filArray]);

      filArray[0].files.length > 0 ? "" : setShowModal1(false);

      clearFileInput(name);
    }




    // Clear the file input

  };

  //#endregion


  const handleChange = (e: { target: { name: any; value: any; files: any; }; }) => {

    const { name, value, files } = e.target;

    setFormData({

      ...formData,

      [name]: files ? files[0] : value,

    });

  };

  // Handle form submission


  const handleCancel = () => {

    debugger
    if (pageValue == "MyRequest") {
      window.location.href = `${siteUrl}/SitePages/MyRequests.aspx`;
    } else if (pageValue == "MyApproval") {
      window.location.href = `${siteUrl}/SitePages/MyApprovals.aspx`;
    } else {
      window.location.href = `${siteUrl}/SitePages/MediaGalleryMaster.aspx`;
    }
    //window.location.href = `${siteUrl}/SitePages/MediaGalleryMaster.aspx`;

  }


  const validateForm = (formsubmode: FormSubmissionMode) => {

    debugger

    const { title, Category, entity, } = formData;


    let valid = true;

    setValidDraft(true);
    setValidSubmit(true);
    if (formsubmode == FormSubmissionMode.DRAFT) {
      if (!title) {

        //Swal.fire('Error', 'Title is required!', 'error');

        valid = false;

      }
      setValidDraft(valid);


    }
    else {
      if (!title) {

        //Swal.fire('Error', 'Title is required!', 'error');

        valid = false;

      }

      // else if (!entity) {

      //   //Swal.fire('Error', 'Entity is required!', 'error');

      //   valid = false;

      // }

      else if (!Category) {

        //Swal.fire('Error', 'Category is required!', 'error');

        valid = false;

      }
      else if (ImagepostArr1.length == 0) {

        //Swal.fire('Error', 'Category is required!', 'error');

        valid = false;

      }

      setValidSubmit(valid)


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

    if (!valid)
      Swal.fire('Please fill the mandatory fields.');
    return valid;

  };


  //#region  Submit Form

  const handleFormSubmit = async () => {

    if (validateForm(FormSubmissionMode.SUBMIT)) {

      // if (editForm) {

      //   Swal.fire({

      //     title: 'Do you want to submit this request?',

      //     showConfirmButton: true,

      //     showCancelButton: true,

      //     confirmButtonText: "Save",

      //     cancelButtonText: "Cancel",

      //     icon: 'warning'

      //   }

      //   ).then(async (result) => {

      //     //console.log("Form Submitted:", formValues, bannerImages, galleryImages, documents);

      //     if (result.isConfirmed) {
      //       setLoading(true);
      //       debugger

      //       let bannerImageArray: any = {};

      //       let galleryIds: any[] = [];

      //       let documentIds: any[] = [];

      //       let galleryArray: any[] = [];

      //       let documentArray: any[] = [];


      //       // formData.FeaturedAnnouncement === "on"?  true :false;


      //       // Upload Banner Images

      //       if (BnnerImagepostArr.length > 0 && BnnerImagepostArr[0]?.files?.length > 0) {

      //         for (const file of BnnerImagepostArr[0].files) {

      //           //  const uploadedBanner = await uploadFile(file, sp, "Documents", Url);

      //           bannerImageArray = await uploadFile(file, sp, "Documents", tenantUrl);

      //         }

      //       }
      //       else if (BnnerImagepostArr.length > 0) {
      //         bannerImageArray = BnnerImagepostArr[0];
      //       }

      //       else {

      //         bannerImageArray = null

      //       }

      //       debugger

      //       if (bannerImageArray != null) {

      //         // Create Post

      //         const postPayload = {

      //           Title: formData.title,

      //           EntityMasterId: Number(formData.entity),

      //           Status: "Submitted",

      //           AuthorId: currentUser.Id,

      //           Image: bannerImageArray != "{}" && JSON.stringify(bannerImageArray),

      //           MediaGalleryCategoryId: formData.Category

      //         };

      //         console.log(postPayload);


      //         const postResult = await updateItem(postPayload, sp, editID);

      //         const postId = postResult?.data?.ID;

      //         debugger

      //         // if (!postId) {

      //         //   console.error("Post creation failed.");

      //         //   return;

      //         // }


      //         // Upload Gallery Images

      //         // Upload Gallery Images

      //         if (ImagepostArr[0]?.files?.length > 0) {

      //           for (const file of ImagepostArr[0].files) {


      //             const uploadedGalleryImage = await uploadFileToLibrary(file, sp, "MediaGallery");


      //             galleryIds = galleryIds.concat(uploadedGalleryImage.map((item: { ID: any }) => item.ID));

      //             if (ImagepostArr1.length > 0) {


      //               ImagepostArr1.push(uploadedGalleryImage[0])

      //               const updatedData = ImagepostArr1.filter(item => item.ID !== 0);

      //               console.log(updatedData, 'updatedData');

      //               galleryArray = updatedData;

      //               //galleryArray.push(ImagepostArr1);


      //               ImagepostIdsArr.push(galleryIds[0]) //galleryIds.push(ImagepostIdsArr)

      //               galleryIds = ImagepostIdsArr

      //             }

      //             else {

      //               galleryArray.push(uploadedGalleryImage);

      //             }

      //           }

      //         }

      //         else {

      //           galleryIds = ImagepostIdsArr

      //           galleryArray = ImagepostArr1;

      //         }


      //         let ars = galleryArray.filter(x => x.ID == 0)

      //         if (ars.length > 0) {

      //           for (let i = 0; i < ars.length; i++) {

      //             galleryArray.slice(i, 1)

      //           }

      //         }


      //         console.log(galleryIds, 'galleryIds');

      //         // Update Post with Gallery and Document Information

      //         const updatePayload = {

      //           ...(galleryIds.length > 0 && {

      //             MediaGalleriesId: galleryIds,

      //             MediaGalleryJSON: JSON.stringify(flatArray(galleryArray)),

      //           }),


      //         };


      //         if (Object.keys(updatePayload).length > 0) {

      //           const updateResult = await updateItem(updatePayload, sp, editID);

      //           console.log("Update Result:", updateResult);

      //         }


      //       }

      //       else {

      //         // Create Post

      //         const postPayload = {

      //           Title: formData.title,

      //           EntityMasterId: Number(formData.entity),

      //           Status: "Submitted",

      //           AuthorId: currentUser.Id,

      //           MediaGalleryCategoryId: formData.Category

      //         };

      //         console.log(postPayload);


      //         const postResult = await updateItem(postPayload, sp, editID);

      //         const postId = postResult?.data?.ID;

      //         debugger

      //         // if (!postId) {

      //         //   console.error("Post creation failed.");

      //         //   return;

      //         // }


      //         // Upload Gallery Images

      //         // Upload Gallery Images

      //         if (ImagepostArr[0]?.files?.length > 0) {

      //           for (const file of ImagepostArr[0].files) {


      //             const uploadedGalleryImage = await uploadFileToLibrary(file, sp, "MediaGallery");


      //             galleryIds = galleryIds.concat(uploadedGalleryImage.map((item: { ID: any }) => item.ID));

      //             if (ImagepostArr1.length > 0) {


      //               ImagepostArr1.push(uploadedGalleryImage[0])

      //               const updatedData = ImagepostArr1.filter(item => item.ID !== 0);

      //               console.log(updatedData, 'updatedData');

      //               galleryArray = updatedData;

      //               // documentArray.push(documentArray);


      //               ImagepostIdsArr.push(galleryIds[0]) //galleryIds.push(ImagepostIdsArr)

      //               galleryIds = ImagepostIdsArr

      //             }

      //             else {

      //               galleryArray.push(uploadedGalleryImage);

      //             }

      //           }

      //         }

      //         else {

      //           galleryIds = ImagepostIdsArr

      //           galleryArray = ImagepostArr1;

      //         }



      //         let ars = galleryArray.filter(x => x.ID == 0)

      //         if (ars.length > 0) {

      //           for (let i = 0; i < ars.length; i++) {

      //             galleryArray.slice(i, 1)

      //           }

      //         }


      //         console.log(galleryIds, 'galleryIds');

      //         // Update Post with Gallery and Document Information

      //         const updatePayload = {

      //           ...(galleryIds.length > 0 && {

      //             MediaGalleriesId: galleryIds,


      //             MediaGalleryJSON: JSON.stringify(flatArray(galleryArray)),

      //           }),


      //         };


      //         if (Object.keys(updatePayload).length > 0) {

      //           const updateResult = await updateItem(updatePayload, sp, editID);

      //           console.log("Update Result:", updateResult);

      //         }

      //       }

      //       let arr = {

      //         ContentID: editID,

      //         ContentName: "ARGMediaGallery",

      //         Status: "Pending",

      //         EntityId: Number(formData.entity),
      //         Title: formData.title,
      //         SourceName: "Media",
      //         ReworkRequestedBy: "Initiator"


      //       }

      //       // await AddContentMaster(sp, arr)

      //       // const boolval = await handleClick(editID, "Media", Number(formData.entity))

      //       let boolval = false;
      //       if (ApprovalRequestItem && ApprovalRequestItem.IsRework && ApprovalRequestItem.IsRework == 'Yes') {
      //         const ctmasteritm = await sp.web.lists.getByTitle(LIST_TITLE_ContentMaster).items.filter('ContentID eq ' + ApprovalRequestItem.ContentId + " and SourceName eq '" + CONTENTTYPE_Media + "'")();
      //         if (ctmasteritm && ctmasteritm.length > 0) {
      //           let updaterec = { 'Status': 'Pending', 'ReworkRequestedBy': 'Initiator' }
      //           if (ApprovalRequestItem.LevelSequence == 1) updaterec.ReworkRequestedBy = "Level 1";
      //           await UpdateContentMaster(sp, ctmasteritm[0].Id, updaterec);
      //           await sp.web.lists.getByTitle(LIST_TITLE_MyRequest).items.getById(ApprovalRequestItem.Id).update({ 'Status': 'Submitted' });
      //           await sp.web.lists.getByTitle(LIST_TITLE_MediaGallery).items.getById(editID).update({ 'Status': 'Submitted' });
      //           boolval = true;
      //         }
      //       }
      //       else {

      //         console.log(" form edit content master");
      //         debugger
      //         await AddContentMaster(sp, arr)
      //         console.log(" form edit content master - added content master");

      //         boolval = await handleClick(editID, "Media", Number(formData.entity))
      //       }
      //       if (boolval == true) {
      //         setLoading(false);
      //         Swal.fire('Submitted successfully.', '', 'success');

      //         sessionStorage.removeItem("mediaId")

      //         setTimeout(() => {

      //           window.location.href = `${siteUrl}/SitePages/MediaGalleryMaster.aspx`;

      //         }, 2000);

      //       }

      //     }


      //   })

      // }

      // else {

      Swal.fire({

        title: 'Do you want to submit this request?',

        showConfirmButton: true,

        showCancelButton: true,

        confirmButtonText: "Yes ",

        cancelButtonText: "No",

        icon: 'warning'

      }

      ).then(async (result) => {

        if (result.isConfirmed) {

          //console.log("Form Submitted:", formValues, bannerImages, galleryImages, documents);
          setLoading(true);
          debugger

          let bannerImageArray: any = {};

          let galleryIds: any[] = [];

          let galleryArray: any[] = [];


          // Upload Banner Images

          // if (BnnerImagepostArr.length > 0 && BnnerImagepostArr[0]?.files?.length > 0) {

          //   for (const file of BnnerImagepostArr[0].files) {

          //     //  const uploadedBanner = await uploadFile(file, sp, "Documents", Url);

          //     bannerImageArray = await uploadFile(file, sp, "Documents", tenantUrl);

          //   }

          // }

          debugger

          // Create Post

          const postPayload = {

            Title: formData.title,

            //EntityMasterId: Number(formData.entity),

            Status: "Submitted",

            AuthorId: currentUser.Id,

            //Image: JSON.stringify(bannerImageArray),

            MediaGalleryCategoryId: formData.Category

          };

          console.log(postPayload);


          const postResult = await addItemKnowledge(postPayload, sp);

          const postId = postResult?.data?.ID;

          debugger

          if (!postId) {

            console.error("Post creation failed.");

            return;

          }


          // Upload Gallery Images

          if (ImagepostArr.length > 0) {

            for (const file of ImagepostArr[0]?.files) {

              const uploadedGalleryImage = await uploadFileToLibrary(file, sp, "KnowledgeCenterGallery");


              galleryIds = galleryIds.concat(uploadedGalleryImage.map((item: { ID: any }) => item.ID));

              galleryArray.push(uploadedGalleryImage);

            }

          }


          // Update Post with Gallery and Document Information

          const updatePayload = {

            ...(galleryIds.length > 0 && {

              MediaGalleriesId: galleryIds,

              MediaGalleryJSON: JSON.stringify(flatArray(galleryArray)),

            }),


          };

          console.log("updatePayload", postId , postResult?.data?.ID, ImagepostArr, updatePayload)
          if (Object.keys(updatePayload).length > 0) {

            const updateResult = await updateItemKnowledge(updatePayload, sp, postId);

            console.log("Update Result:h", updateResult);

          }

          let arr = {

            ContentID: postId,

            ContentName: "ARGKnowledgeCenter",

            Status: "Pending",

            //EntityId: Number(formData.entity),
            Title: formData.title,
            SourceName: "KnowledgeCenter",
            ReworkRequestedBy: "Initiator"


          }

          //await AddContentMaster(sp, arr)

          //const boolval = await handleClick(postId, "Media", Number(formData.entity))

          //if (boolval == true) {
          setLoading(false);
          Swal.fire('Submitted successfully.', '', 'success');

          // sessionStorage.removeItem("bannerId")

          setTimeout(() => {

            window.location.href = `${siteUrl}/SitePages/KnowledgeCenterMaster.aspx`;

          }, 2000);

          //}

        }

      })


      //}
      //fetchAudithistory();
    }


  }

  //#endregion

  //save as draft


  // const handleSaveAsDraft = async () => {

  //   if (validateForm(FormSubmissionMode.DRAFT)) {

  //     if (editForm) {

  //       Swal.fire({

  //         title: 'Do you want to save this request?',

  //         showConfirmButton: true,

  //         showCancelButton: true,

  //         confirmButtonText: "Yes",

  //         cancelButtonText: "No",

  //         icon: 'warning'

  //       }

  //       ).then(async (result) => {

  //         //console.log("Form Submitted:", formValues, bannerImages, galleryImages, documents);

  //         if (result.isConfirmed) {
  //           setLoading(true);
  //           debugger

  //           let bannerImageArray: any = {};

  //           let galleryIds: any[] = [];

  //           let documentIds: any[] = [];

  //           let galleryArray: any[] = [];

  //           let documentArray: any[] = [];


  //           // formData.FeaturedAnnouncement === "on"?  true :false;


  //           // Upload Banner Images

  //           if (BnnerImagepostArr.length > 0 && BnnerImagepostArr[0]?.files?.length > 0) {

  //             for (const file of BnnerImagepostArr[0].files) {

  //               //  const uploadedBanner = await uploadFile(file, sp, "Documents", Url);

  //               bannerImageArray = await uploadFile(file, sp, "Documents", tenantUrl);

  //             }

  //           }

  //           else {

  //             bannerImageArray = null

  //           }

  //           debugger

  //           if (bannerImageArray != null) {

  //             // Create Post

  //             const postPayload = {

  //               Title: formData.title,

  //               EntityMasterId: Number(formData.entity),

  //               Status: "Save as draft",

  //               AuthorId: currentUser.Id,

  //               Image: bannerImageArray != "{}" && JSON.stringify(bannerImageArray),

  //               MediaGalleryCategoryId: formData.Category

  //             };

  //             console.log(postPayload);


  //             const postResult = await updateItem(postPayload, sp, editID);

  //             const postId = postResult?.data?.ID;

  //             debugger

  //             // if (!postId) {

  //             //   console.error("Post creation failed.");

  //             //   return;

  //             // }


  //             // Upload Gallery Images

  //             // Upload Gallery Images

  //             if (ImagepostArr[0]?.files?.length > 0) {

  //               for (const file of ImagepostArr[0].files) {


  //                 const uploadedGalleryImage = await uploadFileToLibrary(file, sp, "MediaGallery");


  //                 galleryIds = galleryIds.concat(uploadedGalleryImage.map((item: { ID: any }) => item.ID));

  //                 if (ImagepostArr1.length > 0) {


  //                   ImagepostArr1.push(uploadedGalleryImage[0])

  //                   const updatedData = ImagepostArr1.filter(item => item.ID !== 0);

  //                   console.log(updatedData, 'updatedData');

  //                   galleryArray = updatedData;

  //                   //galleryArray.push(ImagepostArr1);


  //                   ImagepostIdsArr.push(galleryIds[0]) //galleryIds.push(ImagepostIdsArr)

  //                   galleryIds = ImagepostIdsArr

  //                 }

  //                 else {

  //                   galleryArray.push(uploadedGalleryImage);

  //                 }

  //               }

  //             }

  //             else {

  //               galleryIds = ImagepostIdsArr

  //               galleryArray = ImagepostArr1;

  //             }


  //             let ars = galleryArray.filter(x => x.ID == 0)

  //             if (ars.length > 0) {

  //               for (let i = 0; i < ars.length; i++) {

  //                 galleryArray.slice(i, 1)

  //               }

  //             }


  //             console.log(galleryIds, 'galleryIds');

  //             // Update Post with Gallery and Document Information

  //             const updatePayload = {

  //               ...(galleryIds.length > 0 && {

  //                 MediaGalleriesId: galleryIds,

  //                 MediaGalleryJSON: JSON.stringify(flatArray(galleryArray)),

  //               }),


  //             };


  //             if (Object.keys(updatePayload).length > 0) {

  //               const updateResult = await updateItem(updatePayload, sp, editID);

  //               console.log("Update Result:", updateResult);

  //             }

  //           }

  //           else {

  //             // Create Post
  //             var postPayload1 = {};
  //             if (BnnerImagepostArr.length > 0) {
  //               postPayload1 = {

  //                 Title: formData.title,

  //                 EntityMasterId: Number(formData.entity),

  //                 Status: "Save as draft",

  //                 AuthorId: currentUser.Id,



  //                 MediaGalleryCategoryId: formData.Category

  //               };


  //             }
  //             else {

  //               postPayload1 = {

  //                 Title: formData.title,

  //                 EntityMasterId: Number(formData.entity),

  //                 Status: "Save as draft",

  //                 AuthorId: currentUser.Id,

  //                 Image: "",

  //                 MediaGalleryCategoryId: formData.Category

  //               };

  //             }


  //             console.log(postPayload1);


  //             const postResult = await updateItem(postPayload1, sp, editID);

  //             const postId = postResult?.data?.ID;

  //             debugger

  //             // if (!postId) {

  //             //   console.error("Post creation failed.");

  //             //   return;

  //             // }


  //             // Upload Gallery Images

  //             // Upload Gallery Images

  //             if (ImagepostArr[0]?.files?.length > 0) {

  //               for (const file of ImagepostArr[0].files) {


  //                 const uploadedGalleryImage = await uploadFileToLibrary(file, sp, "MediaGallery");


  //                 galleryIds = galleryIds.concat(uploadedGalleryImage.map((item: { ID: any }) => item.ID));

  //                 if (ImagepostArr1.length > 0) {


  //                   ImagepostArr1.push(uploadedGalleryImage[0])

  //                   const updatedData = ImagepostArr1.filter(item => item.ID !== 0);

  //                   console.log(updatedData, 'updatedData');

  //                   galleryArray = updatedData;

  //                   // documentArray.push(documentArray);


  //                   ImagepostIdsArr.push(galleryIds[0]) //galleryIds.push(ImagepostIdsArr)

  //                   galleryIds = ImagepostIdsArr

  //                 }

  //                 else {

  //                   galleryArray.push(uploadedGalleryImage);

  //                 }

  //               }

  //             }

  //             else {

  //               galleryIds = ImagepostIdsArr

  //               galleryArray = ImagepostArr1;

  //             }



  //             let ars = galleryArray.filter(x => x.ID == 0)

  //             if (ars.length > 0) {

  //               for (let i = 0; i < ars.length; i++) {

  //                 galleryArray.slice(i, 1)

  //               }

  //             }


  //             console.log(galleryIds, 'galleryIds');

  //             // Update Post with Gallery and Document Information

  //             const updatePayload = {

  //               ...(galleryIds.length > 0 && {

  //                 MediaGalleriesId: galleryIds,


  //                 MediaGalleryJSON: JSON.stringify(flatArray(galleryArray)),

  //               }),


  //             };


  //             if (Object.keys(updatePayload).length > 0) {

  //               const updateResult = await updateItem(updatePayload, sp, editID);

  //               console.log("Update Result:", updateResult);

  //             }

  //           }
  //           setLoading(false);
  //           Swal.fire('Saved successfully.', '', 'success');

  //           sessionStorage.removeItem("mediaId")

  //           setTimeout(() => {

  //             window.location.href = `${siteUrl}/SitePages/MediaGalleryMaster.aspx`;

  //           }, 2000);

  //         }

  //       })

  //     }

  //     else {

  //       Swal.fire({

  //         title: 'Do you want to save this request?',

  //         showConfirmButton: true,

  //         showCancelButton: true,

  //         confirmButtonText: "Yes",

  //         cancelButtonText: "No",

  //         icon: 'warning'

  //       }

  //       ).then(async (result) => {

  //         if (result.isConfirmed) {
  //           setLoading(true);
  //           //console.log("Form Submitted:", formValues, bannerImages, galleryImages, documents);

  //           debugger

  //           let bannerImageArray: any = {};

  //           let galleryIds: any[] = [];

  //           let galleryArray: any[] = [];


  //           // Upload Banner Images

  //           if (BnnerImagepostArr.length > 0 && BnnerImagepostArr[0]?.files?.length > 0) {

  //             for (const file of BnnerImagepostArr[0].files) {

  //               //  const uploadedBanner = await uploadFile(file, sp, "Documents", Url);

  //               bannerImageArray = await uploadFile(file, sp, "Documents", tenantUrl);

  //             }

  //           }

  //           // debugger

  //           // Create Post

  //           let postPayload: any = {

  //             Title: formData.title,

  //             //EntityMasterId: Number(formData.entity),

  //             Status: "Save as draft",

  //             AuthorId: currentUser.Id,

  //             Image: JSON.stringify(bannerImageArray),

  //             //MediaGalleryCategoryId: (formData.Category && formData.Category!="")?Number(formData.Category):0

  //           };

  //           if (formData.entity && formData.entity != "") {
  //             postPayload.EntityMasterId = Number(formData.entity);
  //           }

  //           if (formData.Category && formData.Category != "") {
  //             postPayload.MediaGalleryCategoryId = Number(formData.Category);
  //           }
  //           console.log(postPayload);


  //           const postResult = await addItemKnowledge(postPayload, sp);

  //           const postId = postResult?.data?.ID;

  //           debugger

  //           if (!postId) {

  //             console.error("Post creation failed.");

  //             return;

  //           }


  //           // Upload Gallery Images

  //           if (ImagepostArr.length > 0) {

  //             for (const file of ImagepostArr[0]?.files) {

  //               const uploadedGalleryImage = await uploadFileToLibrary(file, sp, "MediaGallery");


  //               galleryIds = galleryIds.concat(uploadedGalleryImage.map((item: { ID: any }) => item.ID));

  //               galleryArray.push(uploadedGalleryImage);

  //             }

  //           }


  //           // Update Post with Gallery and Document Information

  //           const updatePayload = {

  //             ...(galleryIds.length > 0 && {

  //               MediaGalleriesId: galleryIds,

  //               MediaGalleryJSON: JSON.stringify(flatArray(galleryArray)),

  //             }),


  //           };


  //           if (Object.keys(updatePayload).length > 0) {

  //             const updateResult = await updateItem(updatePayload, sp, postId);

  //             console.log("Update Result:", updateResult);

  //           }
  //           setLoading(false);
  //           Swal.fire('Saved successfully.', '', 'success');

  //           // sessionStorage.removeItem("bannerId")

  //           setTimeout(() => {

  //             window.location.href = `${siteUrl}/SitePages/MediaGalleryMaster.aspx`;

  //           }, 2000);

  //         }

  //       })

  //     }

  //   }


  // }


  // end save as drft


  const flatArray = (arr: any[]): any[] => {

    return arr.reduce((acc, val) => acc.concat(val), []);

  };

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

  const clearFileInput = (name: any) => {

    // debugger

    const input = document.querySelector(`input[name=${name}]`) as HTMLInputElement;

    if (input) {

      input.value = ''; // Clears the selected files

    }

    else if (input == null) {

      input.value = ''; // Clears the selected files

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

        ContentName: "ARGMediaGallery",

        EntityMasterId: EntityId,

        ARGLevelMasterId: rows[i].LevelId,

        ApproverId: userIds,

        ApprovalType: rows[i].selectionType == "All" ? 1 : 0,

        SourceName: contentName

      }

      const addedData = await AddContentLevelMaster(sp, arrPost)

      console.log("created content level master items", addedData);


    }

    boolval = true

    return boolval;

    // Process rows data, e.g., submit to server or save to SharePoint list

    // Add your submit logic here

  };


  return (


    <div id="wrapper" ref={elementRef}>

      <div

        className="app-menu"

        id="myHeader">

        <VerticalSideBar _context={sp} />

      </div>

      <div className="content-page newbancss" style={{ marginTop: '-15px' }}> {/* Edit by Amjad */}

        <HorizontalNavbar _context={sp} siteUrl={siteUrl} />

        <div className="content" style={{ marginLeft: `${!useHide ? '240px' : '80px'}`, marginTop: '1.6rem' }}>

          <div className="container-fluid  paddb">

            <div className="row ">

              <div className="col-lg-3 mt-0">

                <CustomBreadcrumb Breadcrumb={Breadcrumb} />

              </div>

            </div>

            <div className="card mt-3">  {/* Edit by Amjad */}

              <div className="card-body">


                <div className="row mt-2" >

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
                    <form className='row' >

                      <div className="col-lg-4">

                        <div className="mb-3">

                          <label htmlFor="title" className="form-label">

                            Title <span className="text-danger">*</span>

                          </label>

                          <input

                            type="text"

                            id="title"

                            name="title"

                            placeholder='Enter title'

                            className={`form-control inputcs ${(!ValidDraft) ? "border-on-error" : ""} ${(!ValidSubmit) ? "border-on-error" : ""}`}

                            value={formData.title}
                            disabled={InputDisabled}

                            onChange={(e) => onChange(e.target.name, e.target.value)} />


                        </div>

                      </div>
                      <div className="col-lg-4">

                        <div className="mb-3">

                          <label htmlFor="Category" className="form-label">

                            Category <span className="text-danger">*</span>

                          </label>

                          <select

                            className={`form-control inputcs ${(!ValidSubmit) ? "border-on-error" : ""}`}

                            id="Category"

                            name="Category"

                            value={formData.Category}
                            disabled={InputDisabled}

                            onChange={(e) => onChange(e.target.name, e.target.value)}

                          >

                            <option value="">Select</option>

                            {

                              knowledgecenterCategorydata.map((item, index) => (

                                <option key={index} value={item.Id}>{item.CategoryName}</option>

                              ))

                            }

                          </select>

                        </div>

                      </div>

                      {/* <div className="col-lg-4">

                        <div className="mb-3">

                          <div className='d-flex justify-content-between'>

                            <div>

                              <label htmlFor="bannerImage" className="form-label">

                                Media Image<span className="text-danger">*</span>

                              </label>

                            </div>

                            <div>

                              {BnnerImagepostArr != undefined &&

                                BnnerImagepostArr.length > 0 &&

                                (<a onClick={() => setShowModalFunc(true, "Image")} style={{ fontSize: '0.875rem' }}>

                                  <FontAwesomeIcon icon={faPaperclip} /> 1 file Attached

                                </a>)

                              }

                              {BnnerImagepostArr != undefined &&

                                BnnerImagepostArr.length == 0 &&

                                (<a onClick={() => setShowModalFunc(true, "Image")} style={{ fontSize: '0.875rem' }}>

                                  <FontAwesomeIcon icon={faPaperclip} /> 0 file Attached

                                </a>)

                              }

                            </div>

                          </div>

                          <input

                            type="file"

                            id="bannerImage"

                            name="bannerImage"
                            className={`form-control inputcss ${(!ValidSubmit) ? "border-on-error" : ""}`}
                            //className="form-control inputcss"

                            disabled={InputDisabled}


                            onChange={(e) => onFileChange(e, "bannerimg", "Document")} />

                        </div>

                      </div> */}


                      <div className="col-lg-4">

                        <div className="mb-3">


                          <div className='d-flex justify-content-between'>

                            <div>

                              <label htmlFor="  " className="form-label">

                                Knowledge Center Gallery

                              </label>

                            </div>

                            <div>

                              {console.log("ImagepostArr1ImagepostArr1", ImagepostArr1, ImagepostArr)}
                              {ImagepostArr1 != null && ImagepostArr1.length > 0 &&

                                ImagepostArr1.length == 1 &&

                                (<a onClick={() => setShowModalFunc(true, "Gallery")} style={{ fontSize: '0.875rem' }}>

                                  <FontAwesomeIcon icon={faPaperclip} /> {ImagepostArr1.length} file Attached

                                </a>)

                                || ImagepostArr1 != null && ImagepostArr1.length > 0 && ImagepostArr1.length > 1 &&

                                (<a onClick={() => setShowModalFunc(true, "Gallery")} style={{ fontSize: '0.875rem' }}>

                                  <FontAwesomeIcon icon={faPaperclip} /> {ImagepostArr1.length} files Attached

                                </a>)
                                || (ImagepostArr1 == null || ImagepostArr1.length == 0 &&

                                  (<a onClick={() => setShowModalFunc(true, "Gallery")} style={{ fontSize: '0.875rem' }}>

                                    <FontAwesomeIcon icon={faPaperclip} /> 0 file Attached

                                  </a>))



                              }


                            </div>

                          </div>

                          <input

                            type="file"

                            id="announcementGallery"

                            name="announcementGallery"

                            className="form-control inputcss"

                            disabled={InputDisabled}

                            onChange={(e) => onFileChange(e, "Gallery", "KnowledgeCenterGallery")}

                          />

                        </div>

                      </div>


                      {!InputDisabled ? (<div className="text-center butncss">

                        {/* <div className="btn btn-success waves-effect waves-light m-1" style={{ fontSize: '0.875rem' }} onClick={handleSaveAsDraft}>

                          <div className='d-flex' style={{ justifyContent: 'space-around' }}>

                            <img src={require('../../../Assets/ExtraImage/checkcircle.svg')} style={{ width: '1rem' }} alt="Check" /> Save As Draft

                          </div>

                        </div> */}

                        <div className="btn btn-success waves-effect waves-light m-1" style={{ fontSize: '0.875rem' }} onClick={handleFormSubmit}>

                          <div className='d-flex' style={{ justifyContent: 'space-around', width: '70px' }}>

                            <img src={require('../../../Assets/ExtraImage/checkcircle.svg')} style={{ width: '1rem' }} alt="Check" /> Submit

                          </div>

                        </div>

                        <div className="btn btn-light waves-effect waves-light m-1" style={{ fontSize: '0.875rem' }} onClick={handleCancel}>

                          <div className='d-flex' style={{ justifyContent: 'space-around', width: '70px' }}>

                            <img src={require('../../../Assets/ExtraImage/xIcon.svg')} style={{ width: '1rem' }} className='me-0' alt="x" />

                            Cancel

                          </div>

                        </div>

                      </div>) : (modeValue == 'view') && (<div className="text-center butncss">
                        <div className="btn btn-light waves-effect waves-light m-1" style={{ fontSize: '0.875rem' }} onClick={handleCancel}>

                          <div className='d-flex' style={{ justifyContent: 'space-around', width: '70px' }}>

                            <img src={require('../../../Assets/ExtraImage/xIcon.svg')} style={{ width: '1rem' }} className='me-1' alt="x" />

                            Cancel

                          </div>

                        </div>
                      </div>)}

                    </form>
                  }
                </div>
              </div>

            </div>

            {/* {

              rows != null && rows.length > 0 && !ApprovalMode && (

                <div className="container mt-2">

                  <div className="card cardborder p-4">

                    <div className="font-16 mb-2">

                      <strong>Approval Hierarchy</strong>

                    </div>

                  
                    <div className="d-flex flex-column">
                      {rows.map((row: any) => (

                        <div className="row mb-2 mt-2" key={row.id}>

                          <div className="col-12 col-md-5">

                            <label htmlFor={`Level-${row.id}`} className="form-label">

                              Select Level

                            </label>

                            <select

                              className="form-select"

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

                          </div>


                          <div className="col-12 col-md-5">

                            <label htmlFor={`approver-${row.id}`} className="form-label">

                              Select Approver

                            </label>

                            <Multiselect

                              options={row.approvedUserList}

                              selectedValues={row.approvedUserListupdate}

                              onSelect={(selected) => handleUserSelect(selected, row.id)}

                              onRemove={(selected) => handleUserSelect(selected, row.id)}

                              displayValue="name"
                              disable={true}
                              placeholder=''
                              hidePlaceholder={true}

                            />

                          </div>



                        </div>

                      ))}

                    </div>




                  </div>

                </div>

              )
            } */}

            {/* {
              //let forrework=ApprovalRequestItem && ApprovalRequestItem.IsRework=='Yes'&& ApprovalRequestItem.LevelSequence!=0;
              (InputDisabled && ApprovalRequestItem) || (ApprovalRequestItem && ApprovalRequestItem.IsRework == 'Yes' && ApprovalRequestItem.LevelSequence != 0) ? (
                <WorkflowAction currentItem={ApprovalRequestItem} ctx={props.context}
                  DisableApproval={ApprovalRequestItem && ApprovalRequestItem.IsRework == 'Yes' && ApprovalRequestItem.LevelSequence != 0}
                  DisableCancel={ApprovalRequestItem && ApprovalRequestItem.IsRework == 'Yes' && ApprovalRequestItem.LevelSequence != 0}
                //  DisableReject={ApprovalRequestItem && ApprovalRequestItem.IsRework=='Yes'&& ApprovalRequestItem.LevelSequence!=0}
                />
              ) : (<div></div>)
            } */}
            {/* {
              <WorkflowAuditHistory ContentItemId={editID} ContentType={CONTENTTYPE_Media} ctx={props.context} />
            } */}

            {/* Modal to display uploaded files */}

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">

              <Modal.Header closeButton>

                <Modal.Title>Knowledge Center Gallery</Modal.Title>

                {/* {ImagepostArr1.length > 0 && showBannerModal && <Modal.Title>Media Images</Modal.Title>} */}

              </Modal.Header>

              <Modal.Body className="scrollbar" id="style-5">

                {ImagepostArr1.length > 0 && showImgModal &&

                  (

                    <>

                      <table className="mtable table-bordered" style={{ fontSize: '0.75rem' }}>

                        <thead style={{ background: '#eef6f7' }}>

                          <tr>

                            <th>Serial No.</th>

                            <th > Image </th>

                            <th>File Name</th>

                            <th>File Size</th>
                            {/* {modeValue == null && */}
                            <th className='text-center'>Action</th>
                            {/* } */}
                          </tr>

                        </thead>

                        <tbody>

                          {ImagepostArr1.map((file: any, index: number) => (

                            <tr key={index}>

                              <td className='text-center'>{index + 1}</td>

                              <td>
                                <img
                                  className='imagefe'
                                  src={file.fileType.startsWith('video/') ?
                                    require("../../../Assets/ExtraImage/video.jpg") :
                                    (file.fileUrl ? file.fileUrl : `${siteUrl}/MediaGallery/${file.fileName}`)}
                                  alt={'default image'}
                                />
                              </td>

                              <td>{file.fileName}</td>

                              <td className='text-right'>{file.fileSize}</td>
                              {/* {modeValue == null && */}
                              <td className='text-center'> <img src={require("../../../CustomAsset/trashed.svg")} style={{ width: '15px' }}

                                onClick={() => deleteLocalFile(index, ImagepostArr1, "Gallery")} /> </td>

                              {/* } */}
                            </tr>

                          ))}

                        </tbody>

                      </table>
                    </>

                  )}



              </Modal.Body>

            </Modal>



            {/* <Modal show={showModal1} onHide={() => setShowModal1(false)} size="lg">

              <Modal.Header closeButton>

                <Modal.Title>Media Image</Modal.Title>

                {/* {BnnerImagepostArr.length > 0 && showBannerModal2 && <Modal.Title>Media Image</Modal.Title>} */}


            {/* </Modal.Header>

              <Modal.Body className="scrollbar" id="style-5">

                {/* {BnnerImagepostArr.length > 0 && showBannerModal2 &&

    ( */}

            <>

              <table className="mtable table-bordered" style={{ fontSize: '0.75rem' }}>

                <thead style={{ background: '#eef6f7' }}>

                  <tr>

                    <th>Serial No.</th>

                    <th > Image </th>

                    <th>File Name</th>

                    <th>File Size</th>
                    {modeValue == null &&
                      <th className='text-center'>Action</th>
                    }
                  </tr>

                </thead>

                <tbody>

                  {BnnerImagepostArr.map((file: any, index: number) => (

                    <tr key={index}>

                      <td className='text-center'>{index + 1}</td>

                      <td>
                        <img
                          className="imagefe"
                          src={
                            file.serverUrl && file.serverRelativeUrl
                              ? `${file.serverUrl}${file.serverRelativeUrl}`
                              : file.fileUrl // Fallback to file.fileUrl if other values are missing
                          }
                          alt="Preview"
                        />
                      </td>

                      <td>{file.fileName ? file.fileName : file.name}</td>

                      <td className='text-right'>{file.fileSize}</td>
                      {modeValue == null &&
                        <td className='text-center'> <img src={require("../../../CustomAsset/trashed.svg")} style={{ width: '15px' }}

                          onClick={() => deleteLocalFile(index, BnnerImagepostArr, "Image")} /> </td>

                      }
                    </tr>

                  ))}

                </tbody>

              </table>
            </>

            {/* )} */}



            {/* </Modal.Body>

            </Modal> */}

          </div>

        </div>

      </div>

    </div>

  )

};

const KnowledgeCenterForm: React.FC<IKnowledgeCenterFormProps> = (props) => {

  return (

    <Provider>

      <AddMediaGalaryContext props={props} />

    </Provider>

  )

}

export default KnowledgeCenterForm