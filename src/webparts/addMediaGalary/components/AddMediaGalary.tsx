import React, { useEffect, useState } from 'react'

import Provider from '../../../GlobalContext/provider';

import { IAddMediaGalaryProps } from './IAddMediaGalaryProps';

import { getSP } from '../loc/pnpjsConfig';

import { SPFI } from '@pnp/sp';

import { useMediaQuery } from 'react-responsive';

import UserContext from '../../../GlobalContext/context';

import { getCurrentUser, getEntity } from '../../../APISearvice/CustomService';

import { addItem, ARGMediaGalleryCategory, getMediaByID, getUrl, updateItem, uploadFile, uploadFileToLibrary , uploadAllFiles } from '../../../APISearvice/MediaService';

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

import { Button, Modal } from 'react-bootstrap';

import "../components/AddMediaGalary.scss";

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
let hidesavasdraft : any;
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
  const [mediaCategorydata, setMediaCategory] = React.useState([])
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

    Category: "",

    Status : ""

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

      "MainComponentURl": `${siteUrl}/SitePages/Settings.aspx`

    },

    {

      "ChildComponent": "Media Gallery",

      "ChildComponentURl": `${siteUrl}/SitePages/MediaGalleryMaster.aspx`

    }

  ]

  //#endregion

  //#region UseEffact

  const [show, setShow] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState('');
  const [isVideo, setIsVideo] = useState(false);
  
  const handleClose = () => setShow(false);
  const handleShow = (src: any, isVideo: boolean) => {
    setModalImageSrc(src);
    setIsVideo(isVideo);
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
      
    } else {
      // alert(`else super admin edit ${superadminedit}`)
      console.log("Superadminedit parameter not found.");
    }
  }, []);

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

    setMediaCategory(await ARGMediaGalleryCategory(sp))

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

          Category: setMediaById[0]?.Category,

          Status: setMediaById[0]?.Status

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


  //#region File select function

  // const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>, libraryName: string, docLib: string) => {

  //   debugger;

  //   event.preventDefault();

  //   let uloadBannerImageFiles: any[] = [];

  //   let uloadImageFiles: any[] = [];

  //   let uloadImageFiles1: any[] = [];


  //   if (event.target.files && event.target.files.length > 0) {

  //     const files = Array.from(event.target.files);


  //     if (libraryName === "Gallery" || libraryName === "bannerimg") {

  //       const imageVideoFiles = files.filter(file =>

  //         file.type.startsWith('image/') ||

  //         file.type.startsWith('video/')

  //       );


  //       if (imageVideoFiles.length > 0) {

  //         const arr = {

  //           files: imageVideoFiles,

  //           libraryName: libraryName,

  //           docLib: docLib

  //         };

  //         if (libraryName === "Gallery") {

  //           uloadImageFiles.push(arr);

  //           setImagepostArr(uloadImageFiles);

  //           if (ImagepostArr1.length > 0) {

  //             imageVideoFiles.forEach(ele => {

  //               let arr1 = {

  //                 "ID": 0,

  //                 "Createdby": "",

  //                 "Modified": "",

  //                 "fileUrl": "",

  //                 "fileSize": ele.size,

  //                 "fileType": ele.type,

  //                 "fileName": ele.name

  //               }

  //               ImagepostArr1.push(arr1);


  //             }

  //             )

  //             setImagepostArr1(ImagepostArr1);

  //           }

  //           else {


  //             imageVideoFiles.forEach(ele => {

  //               let arr1 = {

  //                 "ID": 0,

  //                 "Createdby": "",

  //                 "Modified": "",

  //                 "fileUrl": "",

  //                 "fileSize": ele.size,

  //                 "fileType": ele.type,

  //                 "fileName": ele.name

  //               }

  //               uloadImageFiles1.push(arr1);


  //             }

  //             )

  //             setImagepostArr1(uloadImageFiles1);


  //           }

  //         } else {

  //           uloadBannerImageFiles.push(arr);

  //           setBannerImagepostArr(uloadBannerImageFiles);

  //         }

  //       } else {

  //         Swal.fire("only image & video can be upload")

  //       }

  //     }

  //   }

  // };
  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>, libraryName: string, docLib: string) => {

    debugger;


    event.preventDefault();

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


        //       const imageVideoFiles: CustomFile[] = files
        // .filter(file => file.type.startsWith('image/') || file.type.startsWith('video/')) // Filter files based on type
        // .map(file => ({
        //   ...file, // Spread existing properties of the file
        //   fileUrl: URL.createObjectURL(file), // Add the new fileUrl property with the object URL
        // }));

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

  //#region deleteLocalFile

  // const deleteLocalFile = (index: number, filArray: any[], name: string) => {

  //   // Remove the file at the specified index

  //   filArray.splice(index, 1);

  //   // Update the state based on the title

  //   setImagepostArr1([...filArray]);

  //   filArray[0].files.length > 0 ? "" : setShowModal(false);

  //   clearFileInput(name);


  //   // Clear the file input

  // };

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

      else if (!entity) {

        //Swal.fire('Error', 'Entity is required!', 'error');

        valid = false;

      }

      else if (!Category) {

        //Swal.fire('Error', 'Category is required!', 'error');

        valid = false;

      }
      else if (BnnerImagepostArr.length == 0) {

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

  // const handleFormSubmit = async () => {

  //   if (validateForm(FormSubmissionMode.SUBMIT)) {

  //     if (editForm) {
  //       // alert('coming here in if')

  //       Swal.fire({

  //         title: 'Do you want to submit this request?',

  //         showConfirmButton: true,

  //         showCancelButton: true,

  //         confirmButtonText: "Save",

  //         cancelButtonText: "Cancel",

  //         icon: 'warning'

  //       }

  //       ).then(async (result) => {
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
  //           else if (BnnerImagepostArr.length > 0) {
  //             bannerImageArray = BnnerImagepostArr[0];
  //           }

  //           else {

  //             bannerImageArray = null

  //           }

  //           debugger

  //           if (bannerImageArray != null) {

  //             // Create Post
  //               console.log("form of ARG Master List" , formData) ;
  //               // if(formData.Status == "Submitted"){ 

  //               // }else if(formData.Status == "Submitted0"){
                  
  //               // }else if(formData.Status == "Submitted1"){  

  //               // }else if(formData.Status == "Submitted2"){
                  
  //               // }
  //             const postPayload = {

  //               Title: formData.title,

  //               EntityMasterId: Number(formData.entity),

  //               Status: formData.Status,

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


  //                 const uploadedGalleryImage = await uploadAllFiles(file, sp, "MediaGallery");


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

  //             const postPayload = {

  //               Title: formData.title,

  //               EntityMasterId: Number(formData.entity),

  //               Status: "Submitted01",

  //               AuthorId: currentUser.Id,

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


  //                 const uploadedGalleryImage = await uploadAllFiles(file, sp, "MediaGallery");


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

  //               // console.log("Update Result:", updateResult);

  //             }

  //           }

  //           let arr = {

  //             ContentID: editID,

  //             ContentName: "ARGMediaGallery",

  //             Status: "Pending",

  //             EntityId: Number(formData.entity),
  //             Title: formData.title,
  //             SourceName: "Media",
  //             ReworkRequestedBy: "Initiator"


  //           }

  //           // await AddContentMaster(sp, arr)

  //           // const boolval = await handleClick(editID, "Media", Number(formData.entity))

  //           let boolval = false;
  //           if (ApprovalRequestItem && ApprovalRequestItem.IsRework && ApprovalRequestItem.IsRework == 'Yes') {
  //             const ctmasteritm = await sp.web.lists.getByTitle(LIST_TITLE_ContentMaster).items.filter('ContentID eq ' + ApprovalRequestItem.ContentId + " and SourceName eq '" + CONTENTTYPE_Media + "'")();
  //             if (ctmasteritm && ctmasteritm.length > 0) {
  //               let updaterec = { 'Status': 'Pending', 'ReworkRequestedBy': 'Initiator' }
  //               if (ApprovalRequestItem.LevelSequence == 1) updaterec.ReworkRequestedBy = "Level 1";
  //               await UpdateContentMaster(sp, ctmasteritm[0].Id, updaterec);
  //               await sp.web.lists.getByTitle(LIST_TITLE_MyRequest).items.getById(ApprovalRequestItem.Id).update({ 'Status': 'Submitted1' });
  //               await sp.web.lists.getByTitle(LIST_TITLE_MediaGallery).items.getById(editID).update({ 'Status': 'Submitted2' });
  //               boolval = true;
  //             }
  //           }
  //           else {

  //             console.log(" form edit content master");
  //             debugger
  //             await AddContentMaster(sp, arr)
  //             console.log(" form edit content master - added content master");

  //             boolval = await handleClick(editID, "Media", Number(formData.entity))
  //           }
  //           if (boolval == true) {
  //             setLoading(false);
  //             Swal.fire('Submitted successfully.', '', 'success');

  //             sessionStorage.removeItem("mediaId")

  //             setTimeout(() => {

  //               window.location.href = `${siteUrl}/SitePages/MediaGalleryMaster.aspx`;

  //             }, 2000);

  //           }

  //         }


  //       })

  //     }

  //     else {
  //       // alert('coming here in else')
  //       Swal.fire({

  //         title: 'Do you want to submit this request?',

  //         showConfirmButton: true,

  //         showCancelButton: true,

  //         confirmButtonText: "Yes ",

  //         cancelButtonText: "No",

  //         icon: 'warning'

  //       }

  //       ).then(async (result) => {

  //         if (result.isConfirmed) {

  //           //console.log("Form Submitted:", formValues, bannerImages, galleryImages, documents);
  //           setLoading(true);
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

  //           debugger

  //           // Create Post

  //           const postPayload = {

  //             Title: formData.title,

  //             EntityMasterId: Number(formData.entity),

  //             Status: "Submitted",

  //             AuthorId: currentUser.Id,

  //             Image: JSON.stringify(bannerImageArray),

  //             MediaGalleryCategoryId: formData.Category

  //           };

  //           console.log(postPayload);


  //           const postResult = await addItem(postPayload, sp);

  //           const postId = postResult?.data?.ID;

  //           debugger

  //           if (!postId) {

  //             console.error("Post creation failed.");

  //             return;

  //           }


  //           // Upload Gallery Images

  //           if (ImagepostArr.length > 0) {

  //             for (const file of ImagepostArr[0]?.files) {

  //               const uploadedGalleryImage = await uploadAllFiles(file, sp, "MediaGallery");


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

  //           let arr = {

  //             ContentID: postId,

  //             ContentName: "ARGMediaGallery",

  //             Status: "Pending",

  //             EntityId: Number(formData.entity),
  //             Title: formData.title,
  //             SourceName: "Media",
  //             ReworkRequestedBy: "Initiator"


  //           }

  //           await AddContentMaster(sp, arr)

  //           const boolval = await handleClick(postId, "Media", Number(formData.entity))

  //           if (boolval == true) {
  //             setLoading(false);
  //             Swal.fire('Submitted successfully.', '', 'success');

  //             // sessionStorage.removeItem("bannerId")

  //             setTimeout(() => {

  //               window.location.href = `${siteUrl}/SitePages/MediaGalleryMaster.aspx`;

  //             }, 2000);

  //           }

  //         }

  //       })


  //     }
  //     fetchAudithistory();
  //   }


  // }


  //  old code of mine for media gallery to add and update 
  // const handleFormSubmit = async () => {
  //   if (!validateForm(FormSubmissionMode.SUBMIT)) return;
  
  //   try {
  //     setLoading(true);
  
  //     let bannerImageArray = null;
  //     let galleryArray = [];
  //     let existingGalleryJSON = [];
  //     let existingGalleryIds = [];
  
  //     // Upload new banner images if any
  //     // if (BnnerImagepostArr.length > 0 && BnnerImagepostArr[0]?.files?.length > 0) {
  //     //   bannerImageArray = await uploadAllFiles(BnnerImagepostArr[0].files, sp, "Documents");
  //     // }
  //     if (BnnerImagepostArr.length > 0 && BnnerImagepostArr[0]?.files?.length > 0) {
  
  //       for (const file of BnnerImagepostArr[0].files) {
  
  //         //  const uploadedBanner = await uploadFile(file, sp, "Documents", Url);
  
  //         bannerImageArray = await uploadFile(file, sp, "Documents", tenantUrl);
  
  //       }
  
  //     }
  //     // Check if updating an existing item
  //     if (editForm) {
  //       // Fetch existing item data to merge
  //       const existingItem = await sp.web.lists.getByTitle('ARGMediaGallery').items.getById(editID)();
  //       if (existingItem.MediaGalleryJSON) {
  //         existingGalleryJSON = JSON.parse(existingItem.MediaGalleryJSON);
  //         existingGalleryIds = existingGalleryJSON.map((item:any) => item.ID);
  //       }
  //     }
  
  //     // Upload new gallery images if any
  //     if (ImagepostArr[0]?.files?.length > 0) {
  //       const newGalleryArray = await uploadAllFiles(ImagepostArr[0].files, sp, "MediaGallery");
  //       galleryArray = [...existingGalleryJSON, ...newGalleryArray];
  //     } else {
  //       // Retain existing gallery data if no new files are uploaded
  //       galleryArray = existingGalleryJSON;
  //     }
  
  //     // Prepare payloads
  //     const postPayload = {
  //       Title: formData.title,
  //       EntityMasterId: Number(formData.entity),
  //       Status: "Submitted",
  //       AuthorId: currentUser.Id,
  //       Image: JSON.stringify(bannerImageArray),
  //       MediaGalleryCategoryId: formData.Category,
  //     };
  
  //     const updatePayload = {
  //       ...(galleryArray.length > 0 && {
  //         MediaGalleriesId: galleryArray.map((item:any) => item.ID),
  //         MediaGalleryJSON: JSON.stringify(flatArray(galleryArray)),
  //       }),
  //     };
  
  //     // Create or update item
  //     if (editForm) {
  //       await updateItem({ ...postPayload, ...updatePayload }, sp, editID);
  //     } else {
  //       const postResult = await addItem(postPayload, sp);
  //       const postId = postResult?.data?.ID;
  
  //       if (!postId) {
  //         throw new Error("Failed to create item.");
  //       }
  
  //       if (Object.keys(updatePayload).length > 0) {
  //         await updateItem(updatePayload, sp, postId);
  //       }
  //     }
  
  //     Swal.fire('Submitted successfully.', '', 'success');
  //     window.location.href = `${siteUrl}/SitePages/MediaGalleryMaster.aspx`;
  //   } catch (error) {
  //     console.error("Error during form submission:", error);
  //     Swal.fire('Error', error.message, 'error');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
const handleFormSubmit = async () => {
  if (!validateForm(FormSubmissionMode.SUBMIT)) return;

  try {
    setLoading(true);

    let bannerImageArray = null;
    let galleryArray = [];
    let existingGalleryJSON = [];
    let existingGalleryIds = [];

    // Upload new banner images if any
    // if (BnnerImagepostArr.length > 0 && BnnerImagepostArr[0]?.files?.length > 0) {
    //   bannerImageArray = await uploadAllFiles(BnnerImagepostArr[0].files, sp, "Documents");
    // }
    if (BnnerImagepostArr.length > 0 && BnnerImagepostArr[0]?.files?.length > 0) {

      for (const file of BnnerImagepostArr[0].files) {

        //  const uploadedBanner = await uploadFile(file, sp, "Documents", Url);

        bannerImageArray = await uploadFile(file, sp, "Documents", tenantUrl);

      }

    }
    // Check if updating an existing item
    if (editForm) {
      // Fetch existing item data to merge
      const existingItem = await sp.web.lists.getByTitle('ARGMediaGallery').items.getById(editID)();
      if (existingItem.MediaGalleryJSON) {
        existingGalleryJSON = JSON.parse(existingItem.MediaGalleryJSON);
        existingGalleryIds = existingGalleryJSON.map((item:any) => item.ID);
      }
    }

    // Upload new gallery images if any
    if (ImagepostArr[0]?.files?.length > 0) {
      const newGalleryArray = await uploadAllFiles(ImagepostArr[0].files, sp, "MediaGallery");
      galleryArray = [...existingGalleryJSON, ...newGalleryArray];
    } else {
      // Retain existing gallery data if no new files are uploaded
      galleryArray = existingGalleryJSON;
    }
    
    //  if(editForm == false){
    //    alert(`editForm:${editForm}`)
    //    let status = "Submitted"
    //  }
    // Prepare payloads
    const postPayload = {
      Title: formData.title,
      EntityMasterId: Number(formData.entity),
      Status: "Submitted",
      AuthorId: currentUser.Id,
      Image: JSON.stringify(bannerImageArray),
      MediaGalleryCategoryId: formData.Category,
    };

    const updatePayload = {
      ...(galleryArray.length > 0 && {
        MediaGalleriesId: galleryArray.map((item:any) => item.ID),
        MediaGalleryJSON: JSON.stringify(flatArray(galleryArray)),
      }),
    };

    // Create or update item
    if (editForm) {
      let existingItem :any;
      if (!existingItem) {
        existingItem = await sp.web.lists.getByTitle('ARGMediaGallery').items.getById(editID)();
        // alert(`existingItem:${JSON.stringify(existingItem)}`)
      }
    
      const postPayload = {
        Title: formData.title,
        EntityMasterId: Number(formData.entity),
        //  Status: "Submitted",
         Status: formData.Status,
        AuthorId: currentUser.Id,
        // Image: JSON.stringify(bannerImageArray),
        Image: JSON.stringify(bannerImageArray || JSON.parse(existingItem.Image)),
        MediaGalleryCategoryId: formData.Category,
      };
      await updateItem({ ...postPayload, ...updatePayload }, sp, editID);
    } else {
      const postResult = await addItem(postPayload, sp);
      const postId = postResult?.data?.ID;

      if (!postId) {
        throw new Error("Failed to create item.");
      }

      if (Object.keys(updatePayload).length > 0) {
        await updateItem(updatePayload, sp, postId);
      }

      // here i have added 
      let arr = {

        ContentID: postId,
        // ContentID: editID,

        ContentName: "ARGMediaGallery",

        Status: "Pending",

        EntityId: Number(formData.entity),
        Title: formData.title,
        SourceName: "Media",
        ReworkRequestedBy: "Initiator"


      }
      await AddContentMaster(sp, arr)
    }

    Swal.fire('Submitted successfully.', '', 'success');
    window.location.href = `${siteUrl}/SitePages/MediaGalleryMaster.aspx`;
  } catch (error) {
    console.error("Error during form submission:", error);
    Swal.fire('Error', error.message, 'error');
  } finally {
    setLoading(false);
  }
};

  //#endregion

  //save as draft


  const handleSaveAsDraft = async () => {

    if (validateForm(FormSubmissionMode.DRAFT)) {

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

          //console.log("Form Submitted:", formValues, bannerImages, galleryImages, documents);

          if (result.isConfirmed) {
            setLoading(true);
            debugger

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

                EntityMasterId: Number(formData.entity),

                Status: "Save as draft",

                AuthorId: currentUser.Id,

                Image: bannerImageArray != "{}" && JSON.stringify(bannerImageArray),

                MediaGalleryCategoryId: formData.Category

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


                  const uploadedGalleryImage = await uploadAllFiles(file, sp, "MediaGallery");


                  galleryIds = galleryIds.concat(uploadedGalleryImage.map((item: { ID: any }) => item.ID));

                  if (ImagepostArr1.length > 0) {


                    ImagepostArr1.push(uploadedGalleryImage[0])

                    const updatedData = ImagepostArr1.filter(item => item.ID !== 0);

                    console.log(updatedData, 'updatedData');

                    galleryArray = updatedData;

                    //galleryArray.push(ImagepostArr1);


                    ImagepostIdsArr.push(galleryIds[0]) //galleryIds.push(ImagepostIdsArr)

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


              let ars = galleryArray.filter(x => x.ID == 0)

              if (ars.length > 0) {

                for (let i = 0; i < ars.length; i++) {

                  galleryArray.slice(i, 1)

                }

              }


              console.log(galleryIds, 'galleryIds');

              // Update Post with Gallery and Document Information

              const updatePayload = {

                ...(galleryIds.length > 0 && {

                  MediaGalleriesId: galleryIds,

                  MediaGalleryJSON: JSON.stringify(flatArray(galleryArray)),

                }),


              };


              if (Object.keys(updatePayload).length > 0) {

                const updateResult = await updateItem(updatePayload, sp, editID);

                console.log("Update Result:", updateResult);

              }

            }

            else {

              // Create Post
              var postPayload1 = {};
              if (BnnerImagepostArr.length > 0) {
                postPayload1 = {

                  Title: formData.title,

                  EntityMasterId: Number(formData.entity),

                  Status: "Save as draft",

                  AuthorId: currentUser.Id,



                  MediaGalleryCategoryId: formData.Category

                };


              }
              else {

                postPayload1 = {

                  Title: formData.title,

                  EntityMasterId: Number(formData.entity),

                  Status: "Save as draft",

                  AuthorId: currentUser.Id,

                  Image: "",

                  MediaGalleryCategoryId: formData.Category

                };

              }


              console.log(postPayload1);


              const postResult = await updateItem(postPayload1, sp, editID);

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


                  const uploadedGalleryImage = await uploadAllFiles(file, sp, "MediaGallery");


                  galleryIds = galleryIds.concat(uploadedGalleryImage.map((item: { ID: any }) => item.ID));

                  if (ImagepostArr1.length > 0) {


                    ImagepostArr1.push(uploadedGalleryImage[0])

                    const updatedData = ImagepostArr1.filter(item => item.ID !== 0);

                    console.log(updatedData, 'updatedData');

                    galleryArray = updatedData;

                    // documentArray.push(documentArray);


                    ImagepostIdsArr.push(galleryIds[0]) //galleryIds.push(ImagepostIdsArr)

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



              let ars = galleryArray.filter(x => x.ID == 0)

              if (ars.length > 0) {

                for (let i = 0; i < ars.length; i++) {

                  galleryArray.slice(i, 1)

                }

              }


              console.log(galleryIds, 'galleryIds');

              // Update Post with Gallery and Document Information

              const updatePayload = {

                ...(galleryIds.length > 0 && {

                  MediaGalleriesId: galleryIds,


                  MediaGalleryJSON: JSON.stringify(flatArray(galleryArray)),

                }),


              };


              if (Object.keys(updatePayload).length > 0) {

                const updateResult = await updateItem(updatePayload, sp, editID);

                console.log("Update Result:", updateResult);

              }

            }
            setLoading(false);
            Swal.fire('Saved successfully.', '', 'success');

            sessionStorage.removeItem("mediaId")

            setTimeout(() => {

              window.location.href = `${siteUrl}/SitePages/MediaGalleryMaster.aspx`;

            }, 2000);

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

          if (result.isConfirmed) {
            setLoading(true);
            //console.log("Form Submitted:", formValues, bannerImages, galleryImages, documents);

            debugger

            let bannerImageArray: any = {};

            let galleryIds: any[] = [];

            let galleryArray: any[] = [];


            // Upload Banner Images

            if (BnnerImagepostArr.length > 0 && BnnerImagepostArr[0]?.files?.length > 0) {

              for (const file of BnnerImagepostArr[0].files) {

                //  const uploadedBanner = await uploadFile(file, sp, "Documents", Url);

                bannerImageArray = await uploadFile(file, sp, "Documents", tenantUrl);

              }

            }

            // debugger

            // Create Post

            let postPayload: any = {

              Title: formData.title,

              //EntityMasterId: Number(formData.entity),

              Status: "Save as draft",

              AuthorId: currentUser.Id,

              Image: JSON.stringify(bannerImageArray),

              //MediaGalleryCategoryId: (formData.Category && formData.Category!="")?Number(formData.Category):0

            };

            if (formData.entity && formData.entity != "") {
              postPayload.EntityMasterId = Number(formData.entity);
            }

            if (formData.Category && formData.Category != "") {
              postPayload.MediaGalleryCategoryId = Number(formData.Category);
            }
            console.log(postPayload);


            const postResult = await addItem(postPayload, sp);

            const postId = postResult?.data?.ID;

            debugger

            if (!postId) {

              console.error("Post creation failed.");

              return;

            }


            // Upload Gallery Images

            if (ImagepostArr.length > 0) {

              for (const file of ImagepostArr[0]?.files) {

                const uploadedGalleryImage = await uploadAllFiles(file, sp, "MediaGallery");


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


            if (Object.keys(updatePayload).length > 0) {

              const updateResult = await updateItem(updatePayload, sp, postId);

              console.log("Update Result:", updateResult);

            }
            setLoading(false);
            Swal.fire('Saved successfully.', '', 'success');

            // sessionStorage.removeItem("bannerId")

            setTimeout(() => {

              window.location.href = `${siteUrl}/SitePages/MediaGalleryMaster.aspx`;

            }, 2000);

          }

        })

      }

    }


  }


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


                <div className="" >

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
                      <div className="">

                        <strong className='font-16 mb-1'>Basic Information</strong>
                        <p className='font-14 text-muted mb-3 mt-1'>Specify basic information </p>

                      </div>

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

                          <label htmlFor="entity" className="form-label">

                            Entity <span className="text-danger">*</span>

                          </label>

                          <select

                            className={`form-control inputcs ${(!ValidSubmit) ? "border-on-error" : ""}`}

                            id="entity"

                            name="entity"

                            value={formData.entity}
                            disabled={InputDisabled}


                            onChange={(e) => onChange(e.target.name, e.target.value)}

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

                        <div className="mb-0">

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

                              mediaCategorydata.map((item, index) => (

                                <option key={index} value={item.Id}>{item.CategoryName}</option>

                              ))

                            }

                          </select>

                        </div>

                      </div>

                      <div className="col-lg-4">

                        <div className="mb-0">

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
                            className={`form-control ${(!ValidSubmit) ? "border-on-error" : ""}`}
                            //className="form-control inputcss"

                            disabled={InputDisabled}


                            onChange={(e) => onFileChange(e, "bannerimg", "Document")} />

                        </div>

                      </div>


                      <div className="col-lg-4">

                        <div className="mb-0">


                          <div className='d-flex justify-content-between'>

                            <div>

                              <label htmlFor="  " className="form-label">

                                Media Gallery

                              </label>

                            </div>

                            <div>


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

                            className="form-control"

                            multiple

                            disabled={InputDisabled}

                            onChange={(e) => onFileChange(e, "Gallery", "MediaGallery")}

                          />

                        </div>

                      </div>




                    </form>
                  }
                </div>
              </div>

            </div>

            {

              rows != null && rows.length > 0 && !ApprovalMode && (

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

                            <div className="row mb-0 mt-0" key={row.id}>


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

                                  </select>  </td>
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
                            <td style={{ height: '30px', background: '#fff', border: '0px solid #ccc' }}></td>
                            <td style={{ height: '30px', background: '#fff', border: '0px solid #ccc' }}> </td>
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
                //  DisableReject={ApprovalRequestItem && ApprovalRequestItem.IsRework=='Yes'&& ApprovalRequestItem.LevelSequence!=0}
                />
              ) : (<div></div>)
            }
            {
              <WorkflowAuditHistory ContentItemId={editID} ContentType={CONTENTTYPE_Media} ctx={props.context} />
            }

            {!InputDisabled ? (<div className="text-center butncss">

              <div className="btn btn-success waves-effect waves-light m-1" style={{ width: '145px' }} onClick={handleSaveAsDraft}>

                <div className='d-flex' style={{ justifyContent: 'center' }}>

                  <img src={require('../../../Assets/ExtraImage/checkcircle.svg')} style={{ width: '1rem', marginRight: '3px' }} alt="Check" /> Save As Draft

                </div>

              </div>

              <div className="btn btn-success waves-effect waves-light m-1" style={{ width: '145px' }} onClick={handleFormSubmit}>

                <div className='d-flex' style={{ justifyContent: 'center' }}>

                  <img src={require('../../../Assets/ExtraImage/checkcircle.svg')} style={{ width: '1rem', marginRight: '3px' }} alt="Check" /> Submit

                </div>

              </div>

              <div className="btn cancel-btn waves-effect waves-light m-1" style={{ width: '145px' }} onClick={handleCancel}>

                <div className='d-flex' style={{ justifyContent: 'center' }}>

                  <img src={require('../../../Assets/ExtraImage/xIcon.svg')} style={{ width: '1rem', marginRight: '3px' }} alt="x" />

                  Cancel

                </div>

              </div>

            </div>) : (modeValue == 'view') && (<div className="text-center butncss">
              <div className="btn cancel-btn waves-effect waves-light m-1" style={{ fontSize: '0.875rem' }} onClick={handleCancel}>

                <div className='d-flex' style={{ justifyContent: 'space-around', width: '70px' }}>

                  <img src={require('../../../Assets/ExtraImage/xIcon.svg')} style={{ width: '1rem' }} className='me-1' alt="x" />

                  Cancel

                </div>

              </div>
            </div>)}

            {/* Modal to display uploaded files */}

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">

              <Modal.Header closeButton>

                <Modal.Title>Media Gallery</Modal.Title>

                {/* {ImagepostArr1.length > 0 && showBannerModal && <Modal.Title>Media Images</Modal.Title>} */}

              </Modal.Header>

              <Modal.Body className="scrollbar" id="style-5">

                {/* {ImagepostArr1.length > 0 && showImgModal &&

    (*/}

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

                      {ImagepostArr1.map((file: any, index: number) => (

                        <tr key={index}>

                          <td className='text-center'>{index + 1}</td>

                          <td>
                            {/* <img
                              className='imagefe'
                              src={file.fileType.startsWith('video/') ?
                                require("../../../Assets/ExtraImage/video.jpg") :
                                (file.fileUrl ? file.fileUrl : `${siteUrl}/MediaGallery/${file.fileName}`)}
                              alt={'default image'}
                            /> */}
                                     
                             {/* <img
                  className='imagefe'
                  src={file.fileType.startsWith('video/')
                    ? require("../../../Assets/ExtraImage/video.jpg")
                    : (file.fileUrl ? file.fileUrl : `${siteUrl}/MediaGallery/${file.fileName}`)}
                  alt='default image'
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleShow(file.fileType.startsWith('video/')
                    ? require("../../../Assets/ExtraImage/video.jpg")
                    : (file.fileUrl ? file.fileUrl : `${siteUrl}/MediaGallery/${file.fileName}`))}
                /> */}

<img
          className='imagefe'
          src={file.fileType && file.fileType.startsWith('video/') ? 
	  require("../../../Assets/ExtraImage/video.jpg") : 
	  (file.fileUrl ? file.fileUrl : `${siteUrl}/MediaGallery/${file.fileName}`)}
          alt='default image'
          style={{ cursor: 'pointer' }}
	  onClick={() => handleShow(file.fileUrl ? file.fileUrl : `${siteUrl}/MediaGallery/${file.fileName}`, file.fileType && file.fileType.startsWith('video/'))}
        />
                          </td>

                          <td>{file.fileName}</td>

                          <td className='text-right'>{file.fileSize}</td>
                          {modeValue == null &&
                            <td className='text-center'>
                              
                               <img src={require("../../../CustomAsset/trashed.svg")} style={{ width: '15px' }}

                              onClick={() => deleteLocalFile(index, ImagepostArr1, "Gallery")} /> </td>

                          }
                        </tr>

                      ))}

                    </tbody>

                  </table>
                </>

                {/*  )} */}



              </Modal.Body>

            </Modal>

            {/* <Modal show={show} onHide={handleClose}>
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
      </Modal> */}
<Modal show={show} onHide={handleClose} className='previewpp'>
  <Modal.Header closeButton>
    <Modal.Title>{isVideo ? 'Video Preview' : 'Image Preview'}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {isVideo ? (
      <video controls style={{ width: '100%' }}>
        <source src={modalImageSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    ) : (
      <img src={modalImageSrc} alt="Image Preview" style={{ width: '100%' }} />
    )}
  </Modal.Body>
  {/* <Modal.Footer>
    <Button variant="secondary" onClick={handleClose}>
      Close
    </Button>
  </Modal.Footer> */}
</Modal>

            <Modal show={showModal1} onHide={() => setShowModal1(false)} size="lg">

              <Modal.Header closeButton>

                <Modal.Title>Media Image</Modal.Title>

                {/* {BnnerImagepostArr.length > 0 && showBannerModal2 && <Modal.Title>Media Image</Modal.Title>} */}


              </Modal.Header>

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
                            {/* <img
                              className="imagefe"
                              src={
                                file.serverUrl && file.serverRelativeUrl
                                  ? `${file.serverUrl}${file.serverRelativeUrl}`
                                  : file.fileUrl // Fallback to file.fileUrl if other values are missing
                              }
                              alt="Preview"
                            /> */}
                            {/* <img
                  className="imagefe"
                  src={
                    file.serverUrl && file.serverRelativeUrl
                      ? `${file.serverUrl}${file.serverRelativeUrl}`
                      : file.fileUrl // Fallback to file.fileUrl if other values are missing
                  }
                  alt="Preview"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleShow(
                    file.serverUrl && file.serverRelativeUrl
                      ? `${file.serverUrl}${file.serverRelativeUrl}`
                      : file.fileUrl
                  )}
                /> */}
                <img
          className="imagefe"
          src={
            file?.serverUrl && file?.serverRelativeUrl
              ? `${file?.serverUrl}${file?.serverRelativeUrl}`
              : file?.fileUrl // Fallback to file.fileUrl if other values are missing
          }
          alt="Preview"
          style={{ cursor: 'pointer' }}
          onClick={() => handleShow(
            file?.serverUrl && file?.serverRelativeUrl
              ? `${file?.serverUrl}${file?.serverRelativeUrl}`
              : file?.fileUrl, false
          )}
        />
                          </td>

                          <td>{file?.fileName ? file?.fileName : file?.name}</td>

                          <td className='text-right'>{file?.fileSize}</td>
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



              </Modal.Body>

            </Modal>

          </div>

        </div>

      </div>

    </div>

  )

};

const AddMediaGalary: React.FC<IAddMediaGalaryProps> = (props) => {

  return (

    <Provider>

      <AddMediaGalaryContext props={props} />

    </Provider>

  )

}

export default AddMediaGalary