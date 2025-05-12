import React from 'react'

import Provider from '../../../GlobalContext/provider';

import { IAddBusinessAppProps } from './IAddBusinessAppProps';

import { getSP } from '../loc/pnpjsConfig';

import { SPFI } from '@pnp/sp';

import { useMediaQuery } from 'react-responsive';

import UserContext from '../../../GlobalContext/context';

import { getCurrentUser, getEntity } from '../../../APISearvice/CustomService';

import { addItem, ARGBusinessAppCategory, getBusinessAppsByID, getUrl, updateItem, uploadFile, uploadFileToLibrary } from '../../../APISearvice/BusinessAppsService';

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

 import "../components/addbusinessApp.scss"

import HorizontalNavbar from '../../horizontalNavBar/components/HorizontalNavBar';

import context from '../../../GlobalContext/context';

import { AddContentLevelMaster, AddContentMaster, getApprovalConfiguration, getLevel } from '../../../APISearvice/ApprovalService';

import { Delete, PlusCircle } from 'react-feather';

import Multiselect from 'multiselect-react-dropdown';
import { Tenant_URL } from '../../../Shared/Constants';

const AddBusinessAppContext = ({ props }: any) => {

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

  const [editForm, setEditForm] = React.useState(false);

  const [editID, setEditID] = React.useState(null);


  const [EnityData, setEnityData] = React.useState([])

  const [mediaCategorydata, setMediaCategory] = React.useState([])


  const siteUrl = props.siteUrl;

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

  const [formData, setFormData] = React.useState({
    title: "",
    Category: "",
    redirectionlink: "",
    BannerImage: "",
    entity: ""

  })

  const [selectedValue, setSelectedValue] = React.useState([]);

  const [ApprovalConfigurationData, setApprovalConfiguration] = React.useState([]);

  const [levels, setLevel] = React.useState([]);

  const [rows, setRows] = React.useState<any>([]);

  //#region Breadcrumb

  const Breadcrumb = [

    {

      "MainComponent": "Settings",

      "MainComponentURl": `${siteUrl}/SitePages/Settings.aspx`

    },

    {

      "ChildComponent": "Business App",

      "ChildComponentURl": `${siteUrl}/SitePages/BusinessApps.aspx`

    }

  ]

  //#endregion

  //#region UseEffact

  React.useEffect(() => {

    ApiCallFunc();


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

  const ApiCallFunc = async () => {

    const siteUrl = props.siteUrl;

    console.log(siteUrl);

    setLevel(await getLevel(sp))

    await fetchUserInformationList();

    setCurrentUser(await getCurrentUser(sp, siteUrl))

    console.log(siteUrl, 'siteUrl');

    setMediaCategory(await ARGBusinessAppCategory(sp))

    setBaseUrl(await (getUrl(sp, siteUrl)))

    setEnityData(await getEntity(sp)) //Entity


    if (sessionStorage.getItem("mediaId") != undefined) {

      const iD = sessionStorage.getItem("mediaId")

      console.log(iD, 'iDssss');


      let iDs = decryptId(iD)

      const setMediaById = await getBusinessAppsByID(sp, Number(iDs))


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
          redirectionlink: setMediaById[0]?.redirectionlink
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


        if (setMediaById[0].Image.length) {

          banneimagearr = setMediaById[0].Image

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


  //#region File select function

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>, libraryName: string, docLib: string) => {

    debugger;

    event.preventDefault();

    let uloadBannerImageFiles: any[] = [];

    let uloadImageFiles: any[] = [];

    let uloadImageFiles1: any[] = [];


    if (event.target.files && event.target.files.length > 0) {

      const files = Array.from(event.target.files);


      if (libraryName === "Gallery" || libraryName === "bannerimg") {

        const imageVideoFiles = files.filter(file =>

          file.type.startsWith('image/') ||

          file.type.startsWith('video/')

        );


        if (imageVideoFiles.length > 0) {

          const arr = {

            files: imageVideoFiles,

            libraryName: libraryName,

            docLib: docLib

          };

          if (libraryName === "Gallery") {

            uloadImageFiles.push(arr);

            setImagepostArr(uloadImageFiles);

            if (ImagepostArr1.length > 0) {

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

    debugger


    setShowModal(bol)

    setShowImgTable(true)


  }

  //#endregion

  //#region deleteLocalFile

  const deleteLocalFile = (index: number, filArray: any[], name: string) => {

    // Remove the file at the specified index

    filArray.splice(index, 1);

    // Update the state based on the title

    setImagepostArr1([...filArray]);

    filArray[0].files.length > 0 ? "" : setShowModal(false);

    clearFileInput(name);


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

    window.location.href = `${siteUrl}/SitePages/MediaGalleryMaster.aspx`;

  }


  const validateForm = () => {
    const { title,
      Category,
      redirectionlink,
      BannerImage,
      entity } = formData;
    //const { description } = richTextValues;
    let valid = true;

    if (!title) {
      Swal.fire('Error', 'App Name is required!', 'error');
      valid = false;
    } else if (!Category) {
      Swal.fire('Error', 'Category is required!', 'error');
      valid = false;
    }
    else if (!redirectionlink) {
      Swal.fire('Error', 'redirectionlink is required!', 'error');
      valid = false;
    } else if (!ImagepostArr1) {
      Swal.fire('Error', 'image is required!', 'error');
      valid = false;
    }
    // else if (!subtitle) {
    //   Swal.fire('Error', 'subtitle is required!', 'error');
    //   valid = false;
    // }
    // else if (!EntityId) {
    //   Swal.fire('Error', 'Entity is required!', 'error');
    //   valid = false;
    // }

    return valid;
  };

  //#region  Submit Form

  const handleFormSubmit = async () => {

    if (validateForm()) {

      if (editForm) {

        Swal.fire({

          title: 'Do you want to update?',

          showConfirmButton: true,

          showCancelButton: true,

          confirmButtonText: "Save",

          cancelButtonText: "Cancel",

          icon: 'warning'

        }

        ).then(async (result) => {

          //console.log("Form Submitted:", formValues, bannerImages, galleryImages, documents);

          if (result.isConfirmed) {

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

                bannerImageArray = await uploadFile(file, sp, "Documents", Tenant_URL);

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

                Status: "Submitted",

                AuthorId: currentUser.Id,

                Image: bannerImageArray != "{}" && JSON.stringify(bannerImageArray),

                CategoryId: formData.Category

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


                  const uploadedGalleryImage = await uploadFileToLibrary(file, sp, "MediaGallery");


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

              const postPayload = {

                Title: formData.title,

                EntityMasterId: Number(formData.entity),

                Status: "Submitted",

                AuthorId: currentUser.Id,

                CategoryId: formData.Category

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


                  const uploadedGalleryImage = await uploadFileToLibrary(file, sp, "MediaGallery");


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

            let arr = {

              ContentID: editID,

              ContentName: "ARGMediaGallery",

              Status: "Panding",

              EntityId: Number(formData.entity),

              SourceName: "Media"

            }

            await AddContentMaster(sp, arr)

            const boolval = await handleClick(editID, "Media", Number(formData.entity))

            if (boolval == true) {

              Swal.fire('Item update successfully', '', 'success');

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

          title: 'Do you want to save?',

          showConfirmButton: true,

          showCancelButton: true,

          confirmButtonText: "Save",

          cancelButtonText: "Cancel",

          icon: 'warning'

        }

        ).then(async (result) => {

          if (result.isConfirmed) {

            //console.log("Form Submitted:", formValues, bannerImages, galleryImages, documents);

            debugger

            let bannerImageArray: any = {};

            let galleryIds: any[] = [];

            let galleryArray: any[] = [];


            // Upload Banner Images

            if (BnnerImagepostArr.length > 0 && BnnerImagepostArr[0]?.files?.length > 0) {

              for (const file of BnnerImagepostArr[0].files) {

                //  const uploadedBanner = await uploadFile(file, sp, "Documents", Url);

                bannerImageArray = await uploadFile(file, sp, "Documents", Tenant_URL);

              }

            }

            debugger

            // Create Post

            const postPayload = {

              Title: formData.title,

              EntityMasterId: Number(formData.entity),

              Status: "Submitted",

              AuthorId: currentUser.Id,

              Image: JSON.stringify(bannerImageArray),

              CategoryId: formData.Category

            };

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

                const uploadedGalleryImage = await uploadFileToLibrary(file, sp, "MediaGallery");


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

            let arr = {

              ContentID: postId,

              ContentName: "ARGMediaGallery",

              Status: "Panding",

              EntityId: Number(formData.entity),

              SourceName: "Media"

            }

            await AddContentMaster(sp, arr)

            const boolval = await handleClick(postId, "Media", Number(formData.entity))

            if (boolval == true) {

              Swal.fire('Item added successfully', '', 'success');

              // sessionStorage.removeItem("bannerId")

              setTimeout(() => {

                window.location.href = `${siteUrl}/SitePages/MediaGalleryMaster.aspx`;

              }, 2000);

            }

          }

        })


      }

    }


  }

  //#endregion

  //save as draft


  const handleSaveAsDraft = async () => {

    if (validateForm()) {

      if (editForm) {

        Swal.fire({

          title: 'Do you want to update?',

          showConfirmButton: true,

          showCancelButton: true,

          confirmButtonText: "Save",

          cancelButtonText: "Cancel",

          icon: 'warning'

        }

        ).then(async (result) => {

          //console.log("Form Submitted:", formValues, bannerImages, galleryImages, documents);

          if (result.isConfirmed) {

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

                bannerImageArray = await uploadFile(file, sp, "Documents", Tenant_URL);

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

                CategoryId: formData.Category

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


                  const uploadedGalleryImage = await uploadFileToLibrary(file, sp, "MediaGallery");


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

              const postPayload = {

                Title: formData.title,

                EntityMasterId: Number(formData.entity),

                Status: "Save as draft",

                AuthorId: currentUser.Id,

                CategoryId: formData.Category

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


                  const uploadedGalleryImage = await uploadFileToLibrary(file, sp, "MediaGallery");


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

            Swal.fire('Item update successfully', '', 'success');

            sessionStorage.removeItem("mediaId")

            setTimeout(() => {

              window.location.href = `${siteUrl}/SitePages/MediaGalleryMaster.aspx`;

            }, 2000);

          }

        })

      }

      else {

        Swal.fire({

          title: 'Do you want to save?',

          showConfirmButton: true,

          showCancelButton: true,

          confirmButtonText: "Save",

          cancelButtonText: "Cancel",

          icon: 'warning'

        }

        ).then(async (result) => {

          if (result.isConfirmed) {

            //console.log("Form Submitted:", formValues, bannerImages, galleryImages, documents);

            debugger

            let bannerImageArray: any = {};

            let galleryIds: any[] = [];

            let galleryArray: any[] = [];


            // Upload Banner Images

            if (BnnerImagepostArr.length > 0 && BnnerImagepostArr[0]?.files?.length > 0) {

              for (const file of BnnerImagepostArr[0].files) {

                //  const uploadedBanner = await uploadFile(file, sp, "Documents", Url);

                bannerImageArray = await uploadFile(file, sp, "Documents", Tenant_URL);

              }

            }

            debugger

            // Create Post

            const postPayload = {

              Title: formData.title,

              EntityMasterId: Number(formData.entity),

              Status: "Save as draft",

              AuthorId: currentUser.Id,

              Image: JSON.stringify(bannerImageArray),

              CategoryId: formData.Category

            };

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

                const uploadedGalleryImage = await uploadFileToLibrary(file, sp, "MediaGallery");


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

            Swal.fire('Item added successfully in draft', '', 'success');

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

    debugger

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

      console.log(addedData);


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

              <div className="col-lg-3 mt-1">

                <CustomBreadcrumb Breadcrumb={Breadcrumb} />

              </div>

            </div>

            <div className="card mt-3">  {/* Edit by Amjad */}

              <div className="card-body">

                <div className="row mt-2">

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

                          className="form-control inputcss"

                          value={formData.title}

                          onChange={(e) => onChange(e.target.name, e.target.value)} />

                      </div>

                    </div>

                    <div className="col-lg-4">

                      <div className="mb-3">

                        <label htmlFor="entity" className="form-label">

                          Entity <span className="text-danger">*</span>

                        </label>

                        <select

                          className="form-select inputcss"

                          id="entity"

                          name="entity"

                          value={formData.entity}

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

                      <div className="mb-3">

                        <label htmlFor="Category" className="form-label">

                          Category <span className="text-danger">*</span>

                        </label>

                        <select

                          className="form-select inputcss"

                          id="Category"

                          name="Category"

                          value={formData.Category}

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
                    <div className="col-lg-9">
                      <div className="mb-3">
                        <label htmlFor="overview" className="form-label">
                          Redirection Link <span className="text-danger">*</span>
                        </label>
                        <textarea
                          className="form-control inputcss"
                          id="redirectionlink"
                          placeholder="Enter Redirection link"
                          name="redirectionlink"
                          style={{ height: "90px" }}
                          value={formData.redirectionlink}
                          onChange={(e) =>
                            onChange(e.target.name, e.target.value)
                          }
                        ></textarea>
                       
                      </div>
                    </div>
                    <div className="col-lg-4">

                      <div className="mb-3">

                        <div className='d-flex justify-content-between'>

                          <div>

                            <label htmlFor="bannerImage" className="form-label">

                              Banner Image

                            </label>

                          </div>

                          <div>

                            {BnnerImagepostArr != undefined &&

                              BnnerImagepostArr.length > 0 &&

                              (<a style={{ fontSize: '0.875rem' }}>

                                <FontAwesomeIcon icon={faPaperclip} /> {BnnerImagepostArr.length} file Attached

                              </a>)

                            }

                          </div>

                        </div>

                        <input

                          type="file"

                          id="bannerImage"

                          name="bannerImage"

                          className="form-control inputcss"

                          onChange={(e) => onFileChange(e, "bannerimg", "Document")} />

                      </div>

                    </div>


                    {/* <div className="col-lg-4">

                      <div className="mb-3">


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

                            }


                          </div>

                        </div>

                        <input

                          type="file"

                          id="announcementGallery"

                          name="announcementGallery"

                          className="form-control inputcss"

                          multiple

                          onChange={(e) => onFileChange(e, "Gallery", "MediaGallery")}

                        />

                      </div>

                    </div> */}


                    <div className="text-center butncss">

                      <div className="btn btn-success waves-effect waves-light m-1" style={{ fontSize: '0.875rem' }} onClick={handleSaveAsDraft}>

                        <div className='d-flex' style={{ justifyContent: 'space-around' }}>

                          <img src={require('../../../Assets/ExtraImage/checkcircle.svg')} style={{ width: '1rem' }} alt="Check" /> Save As Draft

                        </div>

                      </div>

                      <div className="btn btn-success waves-effect waves-light m-1" style={{ fontSize: '0.875rem' }} onClick={handleFormSubmit}>

                        <div className='d-flex' style={{ justifyContent: 'space-around', width: '70px' }}>

                          <img src={require('../../../Assets/ExtraImage/checkcircle.svg')} style={{ width: '1rem' }} alt="Check" /> Submit

                        </div>

                      </div>

                      <div className="btn btn-light waves-effect waves-light m-1" style={{ fontSize: '0.875rem' }} onClick={handleCancel}>

                        <div className='d-flex' style={{ justifyContent: 'space-around', width: '70px' }}>

                          <img src={require('../../../Assets/ExtraImage/xIcon.svg')} style={{ width: '1rem' }} className='me-1' alt="x" />

                          Cancel

                        </div>

                      </div>

                    </div>

                  </form>

                </div>

              </div>

            </div>

            {

              rows != null && rows.length > 0 && (

                <div className="container mt-2">

                  <div className="card cardborder p-4">

                    <div className="font-16">

                      <strong>Approval Hierarchy</strong>

                    </div>

                    <div className="d-flex justify-content-between align-items-center">

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

                    </div>


                    <div className="d-flex flex-column">

                      <div className="row mb-2">

                        <div className="col-12 col-md-5">

                          <label className="form-label">Level</label>

                        </div>

                        <div className="col-12 col-md-5">

                          <label className="form-label">Approver</label>

                        </div>

                      </div>


                      {rows.map((row: any) => (

                        <div className="row mb-2" key={row.id}>

                          <div className="col-12 col-md-5">

                            <label htmlFor={`Level-${row.id}`} className="form-label">

                              Select Level

                            </label>

                            <select

                              className="form-select"

                              id={`Level-${row.id}`}

                              name="Level"

                              value={row.LevelId}

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

                            />

                          </div>


                          <div className="col-12 col-md-2 d-flex align-items-center" style={{ gap: '10px' }}>

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

                          </div>

                        </div>

                      ))}

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

            {/* Modal to display uploaded files */}

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">

              <Modal.Header closeButton>

                {ImagepostArr1.length > 0 && showBannerModal && <Modal.Title>Banner Images</Modal.Title>}

              </Modal.Header>

              <Modal.Body className="scrollbar" id="style-5">

                {ImagepostArr1.length > 0 && showImgModal &&

                  (

                    <>

                      <table className="table table-bordered" style={{ fontSize: '0.75rem' }}>

                        <thead style={{ background: '#eef6f7' }}>

                          <tr>

                            <th>Serial No.</th>

                            <th style={{ width: '100px' }}> Image </th>

                            <th>File Name</th>

                            <th>File Size</th>

                            <th className='text-center'>Action</th>

                          </tr>

                        </thead>

                        <tbody>

                          {ImagepostArr1.map((file: any, index: number) => (

                            <tr key={index}>

                              <td className='text-center'>{index + 1}</td>

                              <td>  <img src={`${siteUrl}/MediaGallery/${file.fileName}`}

                                style={{ maxWidth: '150px', maxHeight: '200px' }} /></td>


                              <td>{file.fileName}</td>

                              <td className='text-right'>{file.fileSize}</td>

                              <td className='text-center'> <img src={require("../../../CustomAsset/trashed.svg")} style={{ width: '15px' }} onClick={() => deleteLocalFile(index, ImagepostArr1, "Gallery")} /> </td>


                            </tr>

                          ))}

                        </tbody>

                      </table></>

                  )}

                <div className="force-overflow"></div>

              </Modal.Body>

            </Modal>

          </div>

        </div>

      </div>

    </div>

  )

};

const AddBusinessApp: React.FC<IAddBusinessAppProps> = (props) => {

  return (

    <Provider>

      <AddBusinessAppContext props={props} />

    </Provider>

  )

}

export default AddBusinessApp
