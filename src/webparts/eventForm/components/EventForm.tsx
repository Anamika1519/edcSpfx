import React, { useState } from 'react'
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
import context from '../../../GlobalContext/context';
import CustomBreadcrumb from '../../../CustomJSComponents/CustomBreadcrumb/CustomBreadcrumb';
import { getCurrentUser, getEntity } from '../../../APISearvice/CustomService';
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
import { Modal } from 'react-bootstrap';
import { getSP } from '../loc/pnpjsConfig';
import HorizontalNavbar from '../../horizontalNavBar/components/HorizontalNavBar';
const HelloWorldContext = ({ props }: any) => {
  const sp: SPFI = getSP();
  console.log(sp, 'sp');
  // const { useHide }: any = React.useContext(UserContext);
  // const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const { useHide }: any = React.useContext(UserContext);
  console.log('This function is called only once', useHide);
  const elementRef = React.useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const context = React.useContext(UserContext);
  const { setHide }: any = context;
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const siteUrl = props.siteUrl;
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
  });
  const [richTextValues, setRichTextValues] = React.useState<{ [key: string]: string }>({});

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
    // debugger
    // if(name=="EventDate")
    // {
    //   value=new Date(value);
    // }
    // else if(name=="RegistrationDueDate")
    // {
    //   value=new Date(value);
    // }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // if (name == "Type") {
    //   setCategoryData(await getCategory(sp, Number(value))) // Category
    // }

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
  const validateForm = () => {
    const { EventName, EventDate, EventAgenda, RegistrationDueDate, EntityId, Overview } = formData;
    const { description } = richTextValues;
    let valid = true;

    if (!EventName) {
      Swal.fire('Error', 'Event Name is required!', 'error');
      valid = false;
    } else if (!EventDate) {
      Swal.fire('Error', 'Event Date is required!', 'error');
      valid = false;
    }
    //else if (!overview) {
    //   Swal.fire('Error', 'Overview is required!', 'error');
    //   valid = false;
    // } else if (!description) {
    //   Swal.fire('Error', 'Description is required!', 'error');
    //   valid = false;
    // }
    else if (!RegistrationDueDate) {
      Swal.fire('Error', 'Registration Due Date is required!', 'error');
      valid = false;
    }
     else if (!EntityId) {
      Swal.fire('Error', 'Entity is required!', 'error');
      valid = false;
    }

    return valid;
  };

  //#endregion
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
          console.log(result)
          if (result.isConfirmed) {
            //console.log("Form Submitted:", formValues, bannerImages, galleryImages, documents);
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
                bannerImageArray = await uploadFileBanner(file, sp, "Documents", "https://officeindia.sharepoint.com");
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
              RegistrationDueDate: RegistrationDueDate,
              EventDate: eventDate,
              AuthorId: currentUser.Id,
              image:bannerImageArray != "{}" && JSON.stringify(bannerImageArray)
              // EventThumbnail: EventThumbnailArr != "{}" && JSON.stringify(EventThumbnailArr)
            };
            console.log(postPayload);

            const postResult = await updateItem(postPayload, sp, editID);
            const postId = postResult?.data?.ID;
            debugger
            // if (!postId) {
            //   console.log("Post creation failed.");
            //   return;
            // }

            // Upload Gallery Images
            // Upload Gallery Images
            if (EventGalleryArr[0]?.files?.length > 0) {
              for (let i = 0; i < EventGalleryArr[0]?.files.length; i++) {

                const uploadedGalleryImage = await uploadFileToLibrary(EventGalleryArr[0]?.files[i], sp, "EventGallery");
                if(uploadedGalleryImage!=null){
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
          Swal.fire('Item update successfully', '', 'success');
          sessionStorage.removeItem("EventId")
          setTimeout(() => {
            window.location.href = `${siteUrl}/SitePages/EventMaster.aspx`;
          }, 2000);


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
          //console.log("Form Submitted:", formValues, bannerImages, galleryImages, documents);
          if (result.isConfirmed) {
            debugger
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
                bannerImageArray = await uploadFileBanner(file, sp, "Documents", "https://officeindia.sharepoint.com");
              }
            }
            debugger
            const eventDate = new Date(formData.EventDate).toISOString().split("T")[0];
            const RegistrationDueDate = new Date(formData.RegistrationDueDate).toISOString().split("T")[0];
            // Create Post
            const postPayload = {
              EventName: formData.EventName,
              Overview: formData.Overview,
              EventAgenda: formData.EventAgenda,
              EntityId: Number(formData.EntityId),
              RegistrationDueDate: RegistrationDueDate,
              EventDate: eventDate,
              AuthorId: currentUser.Id,
              image:bannerImageArray != "{}" && JSON.stringify(bannerImageArray)
            };
            console.log(postPayload);

            const postResult = await addItem(postPayload, sp);
            const postId = postResult?.data?.ID;
            debugger
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
            Swal.fire('Item add successfully', '', 'success');
            sessionStorage.removeItem("bannerId")
            setTimeout(() => {
              window.location.href = `${siteUrl}/SitePages/EventMaster.aspx`;
            }, 2000);
          }
        })

      }
    }

  }
  //#endregion
  const handleCancel = () => {
    debugger
    window.location.href =  `${siteUrl}/SitePages/EventMaster.aspx`;
  }
  //#region flatArray
  const flatArray = (arr: any[]): any[] => {
    return arr.reduce((acc, val) => acc.concat(val), []);
  };
  //#endregion


  //#region ApiCallFunc
  const ApiCallFunc = async () => {
    setCurrentUser(await getCurrentUser(sp,siteUrl)) //currentUser
    setEnityData(await getEntity(sp)) //Entity

    setBaseUrl(await (getUrl(sp, siteUrl))) //baseUrl
    //#region getdataByID
    if (sessionStorage.getItem("EventId") != undefined) {
      const iD = sessionStorage.getItem("EventId")
      let iDs = decryptId(iD)
      const setEventById = await getEventByID(sp, Number(iDs))

      console.log(setEventById, 'setEventById');
     
      if (setEventById.length > 0) {
        debugger
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




      }
    }
    //#endregion
  }
  //#endregion

  //#region onFileChange
  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>, libraryName: string, docLib: string) => {
    debugger;
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
            setEventGalleryArr(uloadImageFiles);
            if (EventGalleryArr1.length > 0) {
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
          }else {
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
    debugger
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
  return (

    <div id="wrapper" ref={elementRef}>
      <div className="app-menu">
        <VerticalSideBar _context={sp} />
      </div>
      <div className="content-page newbancss" style={{ marginTop: '-15px' }}> {/* Edit by amjad */}
          <HorizontalNavbar  _context={sp} siteUrl={siteUrl}/>
        <div className="content" style={{marginLeft: `${!useHide ? '240px' : '80px'}`, marginTop:'0.8rem'}}> {/* Edit by amjad */}
          <div className="container-fluid  paddb">
            <div className="row">
              <div className="col-lg-5">
                <CustomBreadcrumb Breadcrumb={Breadcrumb} />
              </div>
            </div>
            <div className="card mt-3">
              <div className="card-body">
                <div className="row mt-2">
                  <form className='row' >
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
                          className="form-control inputcss"
                          value={formData.EventName}
                          onChange={(e) => onChange(e.target.name, e.target.value)}
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
                          className="form-control inputcss"
                          value={formData.EventDate}
                          // value={formData.EventDate}
                          onChange={(e) => onChange(e.target.name, e.target.value)}
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
                          className="form-control inputcss"
                          // value={formData.RegistrationDueDate}
                          onChange={(e) => onChange(e.target.name, e.target.value)}
                        />
                      </div>
                    </div>


                    <div className="col-lg-4">
                      <div className="mb-3">
                        <label htmlFor="EntityId" className="form-label">
                          Entity <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select inputcss"
                          id="EntityId"
                          name="EntityId"
                          value={formData.EntityId}
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

                        <div className='d-flex justify-content-between'>
                          <div>
                            <label htmlFor="bannerImage" className="form-label">
                              Banner Image <span className="text-danger">*</span>
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
                          id="bannerImage"
                          name="bannerImage"
                          className="form-control inputcss"
                          onChange={(e) => onFileChange(e, "bannerimg", "Document")}
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
                          id="EventGallery"
                          name="EventGallery"
                          className="form-control inputcss"
                          multiple
                          onChange={(e) => onFileChange(e, "Gallery", "EventGallery")}
                        />
                      </div>
                    </div>

                    <div className="col-lg-4">
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
                        />
                      </div>
                    </div>


                    <div className="col-lg-8">
                      <div className="mb-3">
                        <label htmlFor="overview" className="form-label">
                          Event Overview  <span className="text-danger">*</span>
                        </label>
                        <textarea
                          className="form-control inputcss"
                          id="overview"
                          placeholder='Enter Event Overview'
                          name="Overview"
                          style={{ height: "100px" }}
                          value={formData.Overview}
                          onChange={(e) => onChange(e.target.name, e.target.value)}
                        ></textarea>
                      </div>
                    </div>



                    <div className="col-lg-12">
                      <div className="mb-3">
                        <label htmlFor="EventAgenda" className="form-label">
                          Event Agenda  <span className="text-danger">*</span>
                        </label>
                        <div style={{ display: "contents", justifyContent: "start" }}>
                          <textarea
                            className="form-control inputcss"
                            id="EventAgenda"
                            placeholder='Enter Event Agenda'
                            name="EventAgenda"
                            style={{ height: "100px" }}
                            value={formData.EventAgenda}
                            onChange={(e) => onChange(e.target.name, e.target.value)}
                          ></textarea>
                        </div>

                      </div>
                    </div>



                    <div className="text-center butncss">
                      <div className="btn btn-success waves-effect waves-light m-1" style={{ fontSize: '0.875rem' }} onClick={handleFormSubmit}>
                        <div className='d-flex' style={{ justifyContent: 'space-around', width: '70px' }}>
                          <img src={require('../../../Assets/ExtraImage/checkcircle.svg')} style={{ width: '1rem' }} alt="Check" /> Submit
                        </div>
                      </div>
                      <button type="button" className="btn btn-light waves-effect waves-light m-1" style={{ fontSize: '0.875rem' }} onClick={handleCancel}>
                        <img src={require('../../../Assets/ExtraImage/xIcon.svg')} style={{ width: '1rem' }}
                          className='me-1' alt="x" />
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
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
                                <th className='text-center'>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {EventThumbnailArr1.map((file: any, index: number) => (
                                <tr key={index}>
                                  <td className='text-center'>{index + 1}</td>
                                  <td>{file.fileName}</td>
                                  <td className='text-right'>{file.fileSize}</td>
                                  <td className='text-center'> <img src={require("../../../CustomAsset/trashed.svg")} style={{ width: '15px' }} onClick={() => deleteLocalFile(index, EventThumbnailArr1, "docs")} /> </td>
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
                                <th style={{ width: '100px' }}> Image </th>
                                <th>File Name</th>
                                <th>File Size</th>
                                <th className='text-center'>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {EventGalleryArr1.map((file: any, index: number) => (
                                <tr key={index}>
                                  <td className='text-center'>{index + 1}</td>
                                  <td>  <img src={`${siteUrl}/EventGallery/${file.fileName}`}
                                    style={{ maxWidth: '150px', maxHeight: '200px' }} /></td>

                                  <td>{file.fileName}</td>
                                  <td className='text-right'>{file.fileSize}</td>
                                  <td className='text-center'> <img src={require("../../../CustomAsset/trashed.svg")} style={{ width: '15px' }} onClick={() => deleteLocalFile(index, EventGalleryArr1, "Gallery")} /> </td>

                                </tr>
                              ))}
                            </tbody>
                          </table></>
                      )}
                    <div className="force-overflow"></div>
                  </div>
                }

              </Modal.Body>

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