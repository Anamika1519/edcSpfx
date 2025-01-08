import React, { useState } from "react";
import { IBlogsProps } from "./IBlogsProps";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../CustomCss/mainCustom.scss";
import "../components/Blogs.scss";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../../verticalSideBar/components/VerticalSidebar.scss";
import VerticalSideBar from "../../verticalSideBar/components/VerticalSideBar";
import HorizontalNavbar from "../../horizontalNavBar/components/HorizontalNavBar";
import Provider from "../../../GlobalContext/provider";
import { SPFI } from "@pnp/sp";
import UserContext from "../../../GlobalContext/context";
import CustomBreadcrumb from "../../../CustomJSComponents/CustomBreadcrumb/CustomBreadcrumb";
import "../../../Assets/Figtree/Figtree-VariableFont_wght.ttf";
import {
  addItem,
  fetchBlogdata,
  getBlog,
  updateItem,
  uploadFileBanner,
} from "../../../APISearvice/BlogService";
import CustomBlogpartTemplate from "../../../CustomJSComponents/CustomBlogWebpartTemplate/CustomBlogWebpartTemplate";
import { GetCategory } from "../../../APISearvice/DiscussionForumService";
import { getCategory, getEntity } from "../../../APISearvice/CustomService";
import { getNews } from "../../../APISearvice/NewsService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import {
  uploadFile,
  uploadFileToLibrary,
} from "../../../APISearvice/BlogService";
import Swal from "sweetalert2";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { getSP } from "../loc/pnpjsConfig";
import context from "../../../GlobalContext/context";
import { useMediaQuery } from "react-responsive";
import { WorkflowAuditHistory } from "../../../CustomJSComponents/WorkflowAuditHistory/WorkflowAuditHistory";
import { WorkflowAction } from "../../../CustomJSComponents/WorkflowAction/WorkflowAction";
// import { getApprovalConfiguration, getLevel } from "../../../APISearvice/ApprovalService";
import Multiselect from "multiselect-react-dropdown";
import { Modal } from 'react-bootstrap';

// import { CONTENTTYPE_Media, LIST_TITLE_ContentMaster, LIST_TITLE_MediaGallery, LIST_TITLE_MyRequest } from '../../../Shared/Constants';
import { AddContentLevelMaster, AddContentMaster, getApprovalConfiguration, getLevel, UpdateContentMaster } from '../../../APISearvice/ApprovalService';


const BlogsContext = ({ props }: any) => {
  const sp: SPFI = getSP();
  const { useHide }: any = React.useContext(UserContext);
  const elementRef = React.useRef<HTMLDivElement>(null);
  const [modeValue, setmode] = React.useState(null);
  const [rows, setRows] = React.useState<any>([]);
   const [Loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    topic: "",
    category: "",
    entity: "",
    Type: "",
    bannerImage: null,
    // announcementGallery: null,
    // announcementThumbnail: null,
    description: "",
    overview: "",
    FeaturedAnnouncement: false,
  });
  const siteUrl = props.siteUrl;
  const { setHide }: any = context;
  const [EnityData, setEnityData] = React.useState([]);
  const [announcementData, setAnnouncementData] = React.useState([]);
  const [newsData, setNewsData] = React.useState([]);
  const [CategoryData, setCategoryData] = React.useState([]);
  const [InputDisabled, setInputDisabled] = React.useState(true);
  const SiteUrl = props.siteUrl;
  // const [blogData, setBlogData] = useState<any[]>([]);
  const [blogData, setBlogData] = useState<any | null>(null);
  const [richTextValues, setRichTextValues] = React.useState<{
    [key: string]: string;
  }>({});
  const [levels, setLevel] = React.useState([]);
  const [BnnerImagepostArr, setBannerImagepostArr] = React.useState([]);
  const [DocumentpostArr, setDocumentpostArr] = React.useState([]);
  const [DocumentpostArr1, setDocumentpostArr1] = React.useState([]);
  const [ImagepostArr, setImagepostArr] = React.useState([]);
  const [ImagepostArr1, setImagepostArr1] = React.useState([]);
  const [showModal, setShowModal] = React.useState(false);
  const [showDocTable, setShowDocTable] = React.useState(false);
  const [showImgModal, setShowImgTable] = React.useState(false);
  const [showBannerModal, setShowBannerTable] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState(null);
  const [editForm, setEditForm] = React.useState(false);
  const [editID, setEditID] = React.useState(null);
  const [ImagepostIdsArr, setImagepostIdsArr] = React.useState([]);
  const [DocumentpostIdsArr, setDocumentpostIdsArr] = React.useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const handleSidebarToggle = (bol: boolean) => {
    setIsSidebarOpen((prevState: any) => !prevState);
    setHide(!bol);
    document.querySelector(".sidebar")?.classList.toggle("close");
  };
  const ApiCall = async () => {
    setLevel(await getLevel(sp));
    const announcementArr = await getBlog(sp);
    // const categorylist = await GetCategory(sp);
    setCategoryData(await GetCategory(sp));
    setEnityData(await getEntity(sp)); //Entity
    setAnnouncementData(announcementArr);
    const NewsArr = await getNews(sp);
    setNewsData(NewsArr);
  };

  const Breadcrumb = [
    {
      MainComponent: "Home",
      MainComponentURl: `${SiteUrl}/SitePages/Dashboard.aspx`,
    },
    {
      ChildComponent: "Blogs",
      ChildComponentURl: `${SiteUrl}/SitePages/Blogs.aspx`,
    },
  ];

  React.useEffect(() => {
    //console.log("This function is called only once", useHide);
    sessionStorage.removeItem("announcementId");
    ApiCall();
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
        toggle.addEventListener("click", () => {
          nav.classList.toggle("show");
          toggle.classList.toggle("bx-x");
          bodypd.classList.toggle("body-pd");
          headerpd.classList.toggle("body-pd");
        });
      }
    };

    showNavbar("header-toggle", "nav-bar", "body-pd", "header");

    const linkColor = document.querySelectorAll(".nav_link");

    function colorLink(this: HTMLElement) {
      if (linkColor) {
        linkColor.forEach((l) => l.classList.remove("active"));
        this.classList.add("active");
      }
    }

    // ApiCall();

    linkColor.forEach((l) => l.addEventListener("click", colorLink));
  }, [useHide]);

  // const ApiCall = async () => {
  //   const dataofblog = await fetchBlogdata(sp);
  //   setBlogData(dataofblog);
  //   //console.log("check-data-of--dataofblog", dataofblog);
  // };

  const onFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    libraryName: string,
    docLib: string
  ) => {
    debugger;
    //console.log("libraryName-->>>>", libraryName)
    event.preventDefault();
    let uloadDocsFiles: any[] = [];
    let uloadDocsFiles1: any[] = [];

    let uloadImageFiles: any[] = [];
    let uloadImageFiles1: any[] = [];

    let uloadBannerImageFiles: any[] = [];

    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files);
      (event.target as HTMLInputElement).value = '';

      if (libraryName === "Docs") {
        const docFiles = files.filter(
          (file) =>
            file.type === "application/pdf" ||
            file.type === "application/msword" ||
            file.type === "application/xsls" ||
            file.type === "text/csv" ||
            file.type === "text/csv" ||
            file.type ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
            file.type ===
            "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
            file.type === "text/"
        );

        if (docFiles.length > 0) {
          const arr = {
            files: docFiles,
            libraryName: libraryName,
            docLib: docLib,
          };
          uloadDocsFiles.push(arr);
          setDocumentpostArr(uloadDocsFiles);
          if (DocumentpostArr1.length > 0) {
            //  uloadDocsFiles1.push(DocumentpostArr1)
            docFiles.forEach((ele) => {
              let arr1 = {
                ID: 0,
                Createdby: "",
                Modified: "",
                fileUrl: "",
                fileSize: ele.size,
                fileType: ele.type,
                fileName: ele.name,
              };
              DocumentpostArr1.push(arr1);
            });

            setDocumentpostArr1(DocumentpostArr1);
          } else {
            docFiles.forEach((ele) => {
              let arr1 = {
                ID: 0,
                Createdby: "",
                Modified: "",
                fileUrl: "",
                fileSize: ele.size,
                fileType: ele.type,
                fileName: ele.name,
              };
              uloadDocsFiles1.push(arr1);
            });

            setDocumentpostArr1(uloadDocsFiles1);
          }
        } else {
          Swal.fire("only document can be upload");
        }
      }
      if (libraryName === "Gallery" || libraryName === "bannerimg") {
        // const imageVideoFiles = files.filter(
        //   (file) =>
        //     file.type.startsWith("image/") || file.type.startsWith("video/")
        // );
        var imageVideoFiles: any[] =[];
        if(libraryName === "Gallery"){
           imageVideoFiles = files.filter(
              (file) =>
                  file.type.startsWith("image/") || file.type.startsWith("video/")
          );
      }
      else if(libraryName === "bannerimg"){
           imageVideoFiles = files.filter(
              (file) =>
                  file.type.startsWith("image/")
          );
      }      

        if (imageVideoFiles.length > 0) {
          const arr = {
            files: imageVideoFiles,
            libraryName: libraryName,
            docLib: docLib,
            fileUrl:  URL.createObjectURL(imageVideoFiles[0])
          };
         
          //console.log("arr-->>>", arr)
          if (libraryName === "Gallery") {
            uloadImageFiles.push(arr);
            setImagepostArr(uloadImageFiles);
            if (ImagepostArr1.length > 0) {
              imageVideoFiles.forEach((ele) => {
                //console.log("ele in if-->>>>", ele)
                let arr1 = {
                  ID: 0,
                  Createdby: "",
                  Modified: "",
                  fileUrl:  URL.createObjectURL(ele),
                  fileSize: ele.size,
                  fileType: ele.type,
                  fileName: ele.name,
                };
                ImagepostArr1.push(arr1);
              });
              setImagepostArr1(ImagepostArr1);
            } else {
              imageVideoFiles.forEach((ele) => {
                //console.log("ele in else-->>>>", ele)
                let arr1 = {
                  ID: 0,
                  Createdby: "",
                  Modified: "",
                  fileUrl: URL.createObjectURL(ele),
                  fileSize: ele.size,
                  fileType: ele.type,
                  fileName: ele.name,
                };
                uloadImageFiles1.push(arr1);
              });
              setImagepostArr1(uloadImageFiles1);
            }
          } else {
            uloadBannerImageFiles.push(arr);
            //console.log("uloadBannerImageFiles-->>", uloadBannerImageFiles)
            setBannerImagepostArr(uloadBannerImageFiles);
          }
        } else {
          if(libraryName === "bannerimg"){
            Swal.fire("only image can be upload");
          }else{
            Swal.fire("only image & video can be upload");
          }
         
        }
      }
    }
  };

  const validateForm = () => {
    const { topic, Type, category, entity, overview, FeaturedAnnouncement } =
      formData;
    const { description } = richTextValues;
    let valid = true;

    if (!topic) {
      Swal.fire("Error", "Topic is required!", "error");
      valid = false;
    } else if (!entity) {
      Swal.fire("Error", "Entity is required!", "error");
      valid = false;
    }
    else if (BnnerImagepostArr.length == 0 ) {
      Swal.fire('Error', 'Banner image is required!', 'error');
      valid = false;
    }
    else if (ImagepostArr.length == 0) {
      Swal.fire('Error', 'Gallery image is required!', 'error');
      valid = false;
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

    return valid;
  };
  const validateFormDraft = () => {
    const { topic, Type, category, entity, overview, FeaturedAnnouncement } =
      formData;
    const { description } = richTextValues;
    let valid = true;

    if (!topic) {
      Swal.fire("Error", "Topic is required!", "error");
      valid = false;
    } else if (!entity) {
      Swal.fire("Error", "Entity is required!", "error");
      valid = false;
    }
    else if (BnnerImagepostArr.length == 0) {
      Swal.fire('Error', 'Banner image is required!', 'error');
      valid = false;
    }
    // else if (ImagepostArr.length == 0 && ImagepostArr1Edit.length == 0) {
    //     Swal.fire('Error', 'Gallery image is required!', 'error');
    //     valid = false;
    // }
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

    return valid;
  };
  const setShowModalFunc = (bol: boolean, name: string) => {
    if (name == "bannerimg") {
      setShowModal(bol);
      setShowBannerTable(true);
      setShowImgTable(false);
      setShowDocTable(false);
    } else if (name == "Gallery") {
      setShowModal(bol);
      setShowImgTable(true);
      setShowBannerTable(false);
      setShowDocTable(false);
    } else {
      setShowModal(bol);
      setShowDocTable(true);
      setShowBannerTable(false);
      setShowImgTable(false);
    }
  };
  const flatArray = (arr: any[]): any[] => {
    return arr.reduce((acc, val) => acc.concat(val), []);
  };
  const dismissModal = () => {
    const modalElement = document.getElementById('discussionModal');
   
    // Remove Bootstrap classes and attributes manually
    modalElement.classList.remove('show');
    modalElement.style.display = 'none';
    modalElement.setAttribute('aria-hidden', 'true');
    modalElement.removeAttribute('aria-modal');
    modalElement.removeAttribute('role');
 
    // Optionally, remove the backdrop if it was added manually
    const modalBackdrop = document.querySelector('.modal-backdrop');
                        if (modalBackdrop) {
                            modalBackdrop.classList.remove('modal-backdrop');
                            modalBackdrop.classList.remove('fade');
                            modalBackdrop.classList.remove('show');
                            // modalBackdrop.remove();
                        }
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

  const handleClick = async (contentId: number, contentName: any, EntityId: number) => {
 
    //  //console.log("Creating approval hierarchy with data:", rows);
 
      let boolval = false
 
      for (let i = 0; i < rows.length; i++) {
 
        const userIds = rows[i].approvedUserListupdate.map((user: any) => user.id);
 
        let arrPost = {
          LevelSequence: i + 1,
          ContentId: contentId,
 
          ContentName: "ARGBlogs",
 
          EntityMasterId: EntityId,
 
          ARGLevelMasterId: rows[i].LevelId,
 
          ApproverId: userIds,
 
          ApprovalType: rows[i].selectionType == "All" ? 1 : 0,
 
          SourceName: contentName
 
        }
 
        const addedData = await AddContentLevelMaster(sp, arrPost)
 
        ////console.log("created content level master items", addedData);
 
 
      }
 
      boolval = true
 
      return boolval;
 
      // Process rows data, e.g., submit to server or save to SharePoint list
 
      // Add your submit logic here
 
    };

  const handleFormSubmit = async () => {
    if (validateForm()) {
     
        Swal.fire({
          title: "Are you sure you want to submit this blog?",
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          icon: "warning",
        }).then(async (result) => {
          ////console.log("Form Submitted:", formValues, bannerImages, galleryImages, documents);
          if (result.isConfirmed) {
            // debugger;
            setLoading(true);
            const modalBackdrop = document.querySelector('.modal-backdrop');
                        if (modalBackdrop) {
                            modalBackdrop.classList.remove('modal-backdrop');
                            modalBackdrop.classList.remove('fade');
                            modalBackdrop.classList.remove('show');
                            // modalBackdrop.remove();
                        }
            let bannerImageArray: any = {};
            let galleryIds: any[] = [];
            let documentIds: any[] = [];
            let galleryArray: any[] = [];
            let documentArray: any[] = [];

            // formData.FeaturedAnnouncement === "on"?  true :false;

            // Upload Banner Images
            if (
              BnnerImagepostArr.length > 0 &&
              BnnerImagepostArr[0]?.files?.length > 0
            ) {
              for (const file of BnnerImagepostArr[0].files) {
                //  const uploadedBanner = await uploadFile(file, sp, "Documents", Url);
                bannerImageArray = await uploadFileBanner(
                  file,
                  sp,
                  "Documents",
                  "https://alrostamanigroupae.sharepoint.com"
                );
              }
            }
            // debugger;
            // Create Post
            const postPayload = {
              Title: formData.topic,
              Overview: formData.overview,
              Description: richTextValues.description,
              EntityId: Number(formData.entity),
              Status:"Submitted",
              BlogBannerImage: JSON.stringify(bannerImageArray)
              // DiscussionForumCategoryId: Number(formData.category),
            };
            //console.log("postPayload 3-->>>>>", postPayload);

            const postResult = await addItem(postPayload, sp);
            const postId = postResult?.data?.ID;
            debugger;
            if (!postId) {
              console.error("Post creation failed.");
              return;
            }

            // //console.log(
            //   ImagepostArr,
            //   "ImagepostArr",
            //   ImagepostArr1,
            //   "ImagepostArr1",
            //   DocumentpostArr1,
            //   "DocumentpostArr1",
            //   DocumentpostArr,
            //   "DocumentpostArr"
            // );

            // Upload Gallery Images
            if (ImagepostArr.length > 0) {
              for (const file of ImagepostArr[0]?.files) {
                const uploadedGalleryImage = await uploadFileToLibrary(
                  file,
                  sp,
                  "BlogGallery"
                );

                galleryIds = galleryIds.concat(
                  uploadedGalleryImage.map((item: { ID: any }) => item.ID)
                );
                galleryArray.push(uploadedGalleryImage);
              }
            }

            // Upload Documents
            // if (DocumentpostArr.length > 0) {
            //   for (const file of DocumentpostArr[0]?.files) {
            //     const uploadedDocument = await uploadFileToLibrary(
            //       file,
            //       sp,
            //       "BlogsDoc"
            //     );
            //     documentIds = documentIds.concat(
            //       uploadedDocument.map((item: { ID: any }) => item.ID)
            //     );
            //     documentArray.push(uploadedDocument);
            //   }
            // }

            // Update Post with Gallery and Document Information
            const updatePayload = {
              ...(galleryIds.length > 0 && {
                BlogsGalleryId: galleryIds,
                BlogGalleryJSON: JSON.stringify(
                  flatArray(galleryArray)
                ),
              }),
              // ...(documentIds.length > 0 && {
              //   BlogsDocsId: documentIds,
              //   BlogDocsJSON: JSON.stringify(
              //     flatArray(documentArray)
              //   ),
              // }),
            };

            if (Object.keys(updatePayload).length > 0) {
              const updateResult = await updateItem(updatePayload, sp, postId);
              //console.log("Update Result:", updateResult);
            }

         // //////######### changes ############  ////////////

                  let arr = {
                       Title:formData.topic,
                       ContentID: postId,
         
                       ContentName: "ARGBlogs",
         
                       Status: "Pending",
         
                       EntityId: Number(formData.entity),
         
                       SourceName: "Blogs",
                       ReworkRequestedBy: "Initiator"
         
         
                     }
         
                     await AddContentMaster(sp, arr)
         
                     const boolval = await handleClick(postId, "Blogs", Number(formData.entity))

            // //////######### changes ############  ////////////
             //Swal.fire("Item published successfully", "", "success");
            // sessionStorage.removeItem("bannerId");
            setTimeout(async () => {
              setAnnouncementData(await getBlog(sp));
              setLoading(false);
              dismissModal()
              window.location.href = `${siteUrl}/SitePages/Blogs.aspx`;
            }, 1000);
          }
        });
      //}
    }
  };
  const handleFormSaevasDraft = async () => {
    if (validateFormDraft()) {
    Swal.fire({
      title: "Do you want to save as Draft?",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      icon: "warning",
    }).then(async (result) => {
      ////console.log("Form Submitted:", formValues, bannerImages, galleryImages, documents);
      if (result.isConfirmed) {
        // debugger;
        setLoading(true);
        const modalBackdrop = document.querySelector('.modal-backdrop');
                        if (modalBackdrop) {
                            modalBackdrop.classList.remove('modal-backdrop');
                            modalBackdrop.classList.remove('fade');
                            modalBackdrop.classList.remove('show');
                            // modalBackdrop.remove();
                        }
        let bannerImageArray: any = {};
        let galleryIds: any[] = [];
        let documentIds: any[] = [];
        let galleryArray: any[] = [];
        let documentArray: any[] = [];

        // formData.FeaturedAnnouncement === "on"?  true :false;

        // Upload Banner Images
        if (
          BnnerImagepostArr.length > 0 &&
          BnnerImagepostArr[0]?.files?.length > 0
        ) {
          for (const file of BnnerImagepostArr[0].files) {
            //  const uploadedBanner = await uploadFile(file, sp, "Documents", Url);
            bannerImageArray = await uploadFileBanner(
              file,
              sp,
              "Documents",
              "https://alrostamanigroupae.sharepoint.com"
            );
          }
        }
        // debugger;
        // Create Post
        const postPayload = {
          Title: formData.topic,
          Overview: formData.overview,
          Description: richTextValues.description,
          EntityId:formData.entity && Number(formData.entity),
          Status:"Save as Draft",
          BlogBannerImage:bannerImageArray && JSON.stringify(bannerImageArray)
          // DiscussionForumCategoryId: Number(formData.category),
        };
        //console.log("postPayload 3-->>>>>", postPayload);

        const postResult = await addItem(postPayload, sp);
        const postId = postResult?.data?.ID;
        debugger;
       
        if (!postId) {
          console.error("Post creation failed.");
          return;
        } else {
         
          //sessionStorage.removeItem("announcementId");
          setTimeout(() => {
            setLoading(false);
            dismissModal()
          }, 500);
        }
        // Upload Gallery Images
        if (ImagepostArr.length > 0) {
          for (const file of ImagepostArr[0]?.files) {
            const uploadedGalleryImage = await uploadFileToLibrary(
              file,
              sp,
              "BlogGallery"
            );

            galleryIds = galleryIds.concat(
              uploadedGalleryImage.map((item: { ID: any }) => item.ID)
            );
            galleryArray.push(uploadedGalleryImage);
          }
        }

        // Update Post with Gallery and Document Information
        const updatePayload = {
          ...(galleryIds.length > 0 && {
            BlogsGalleryId: galleryIds,
            BlogGalleryJSON: JSON.stringify(
              flatArray(galleryArray)
            ),
          }),
         
        };

        if (Object.keys(updatePayload).length > 0) {
          const updateResult = await updateItem(updatePayload, sp, postId);
          //console.log("Update Result:", updateResult);
        }

        // Swal.fire("Item added successfully", "", "success");
        // sessionStorage.removeItem("bannerId");
        setTimeout(async () => {
         // Swal.fire("Item saved successfully", "", "success");
          dismissModal();
          setLoading(false);
          setAnnouncementData(await getBlog(sp));
          window.location.href = `${siteUrl}/SitePages/Blogs.aspx`;
         
        }, 1000);
      }
    });
 
  }
};

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

//#region deleteLocalFile
const deleteLocalFile = (index: number, filArray: any[], name: string) => {
  debugger
  //console.log(filArray, 'filArray');

  // Remove the file at the specified index
  filArray.splice(index, 1);
  //console.log(filArray, 'filArray');

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

};


//#endregion
  const handleCancel = () => {
    // debugger;
 
    setBannerImagepostArr([]);
    setDocumentpostArr([]);
    setDocumentpostArr1([]);
    setImagepostArr([]);
    setImagepostArr1([]);
    // window.location.href =
    //   `${siteUrl}/SitePages/Blogs.aspx`;
  };
  const handleChangeCheckBox = (name: string, value: string | boolean) => {
    setFormData((prevValues) => ({
      ...prevValues,
      [name]: value === true ? true : false, // Ensure the correct boolean value is set for checkboxes
    }));
  };

  const onChange = async (name: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name == "Type") {
      setCategoryData(await getCategory(sp, Number(value))); // Category
    }
    else if(name == "entity"){

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
  const formats = [
    "header",
    "height",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "color",
    "bullet",
    "indent",
    "link",
    "image",
    "align",
    "size",
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
        { indent: "+1" },
      ],
      [
        {
          color: [
            "#000000",
            "#e60000",
            "#ff9900",
            "#ffff00",
            "#008a00",
            "#0066cc",
            "#9933ff",
            "#ffffff",
            "#facccc",
            "#ffebcc",
            "#ffffcc",
            "#cce8cc",
            "#cce0f5",
            "#ebd6ff",
            "#bbbbbb",
            "#f06666",
            "#ffc266",
            "#ffff66",
            "#66b966",
            "#66a3e0",
            "#c285ff",
            "#888888",
            "#a10000",
            "#b26b00",
            "#b2b200",
            "#006100",
            "#0047b2",
            "#6b24b2",
            "#444444",
            "#5c0000",
            "#663d00",
            "#666600",
            "#003700",
            "#002966",
            "#3d1466",
            "custom-color",
          ],
        },
      ],
    ],
  };

  return (
    <div id="wrapper" ref={elementRef}>
    <div
      className="app-menu"
      id="myHeader">
      <VerticalSideBar _context={sp} />
    </div>
    <div className="content-page">
        <HorizontalNavbar  _context={sp} siteUrl={siteUrl}/>
      <div className="content mt-0" style={{marginLeft: `${!useHide ? '240px' : '80px'}`}}>
          <div className="container-fluid  paddb">
          {Loading ?
                    // <div className="loadercss" role="status">Loading...
                    //   <img src={require('../../../Assets/ExtraImage/loader.gif')} style={{ height: '80px', width: '70px' }} alt="Check" />
                    // </div>
                    <div style={{minHeight:'100vh',marginTop:'100px'}} className="loadernewadd mt-10">
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
                  :
            <div className="row">
              <div className="col-lg-3">
                <CustomBreadcrumb Breadcrumb={Breadcrumb} />
              </div>
             
             
              <div className="col-lg-9">
                <div className="d-flex flex-wrap align-items-center justify-content-end mt-0 mb-3">
                 
                  <div className="col-lg-8">
                    <div className="d-flex flex-wrap align-items-center justify-content-end mt-2">
                      {/* Button to trigger modal */}
                      <button
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target="#discussionModal"
                        className="btn btn-secondary waves-effect waves-light"
                      >
                        <i className="fe-plus-circle"></i> Start New Blog
                      </button>
                    </div>

                    {/* Bootstrap Modal */}
                    <div
                      className="modal fade bd-example-modal-lg"
                      id="discussionModal"
                      tabIndex={-1}
                      aria-labelledby="exampleModalLabel"
                      aria-hidden="true"
                      data-target=".bd-example-modal-lg"
                    >
                      <div style={{minWidth:'80%'}} className="modal-dialog modal-lg ">
                        <div className="modal-content">
                          <div className="modal-header d-block">
                            <h5 className="modal-title" id="exampleModalLabel">
                              New Blog
                            </h5>
                            <button style={{right:'22px', top:'18px'}}
                              type="button"
                              className="btn-close newclose1"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            ></button>
                          </div>
                          <div className="modal-body">
                            <form className="row">
                              <div className="col-lg-3">
                                <div className="mb-3">
                                  <label htmlFor="topic" className="form-label">
                                    Topic <span className="text-danger">*</span>
                                  </label>
                                  <input style={{height:"38px"}}
                                    type="text"
                                    id="topic"
                                    name="topic"
                                    placeholder="Enter Topic"
                                    className="form-control"
                                    value={formData.topic}
                                    onChange={(e) =>
                                      onChange(e.target.name, e.target.value)
                                    }
                                  />
                                </div>
                              </div>

                              <div className="col-lg-3">
                                <div className="mb-3">
                                  <label
                                    htmlFor="entity"
                                    className="form-label"
                                  >
                                    Entity{" "}
                                    <span className="text-danger">*</span>
                                  </label>
                                  <select
                                    className="form-select"
                                    id="entity"
                                    name="entity"
                                    value={formData.entity}
                                    onChange={(e) =>
                                      onChange(e.target.name, e.target.value)
                                    }
                                  >
                                    <option value="">Select</option>
                                    {EnityData.map((item, index) => (
                                      <option key={index} value={item.id}>
                                        {item.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>

                              <div className="col-lg-3">
                                <div className="mb-3">
                                  <div className="d-flex justify-content-between">
                                    <div>
                                      <label
                                        htmlFor="bannerImage"
                                        className="form-label"
                                      >
                                        Banner Image{" "}
                                        <span className="text-danger">*</span>
                                      </label>
                                    </div>
                                    <div>
                                      <div>
                                        {
                                          BnnerImagepostArr[0] != false &&
                                            BnnerImagepostArr.length > 0 &&
                                            BnnerImagepostArr != undefined
                                            ? BnnerImagepostArr.length == 1 && (
                                              <a style={{ fontSize: "0.875rem" }} onClick={() =>setShowModalFunc(true, "bannerimg")}>
                                                <FontAwesomeIcon
                                                  icon={faPaperclip}
                                                />
                                                1 file Attached
                                              </a>
                                            )
                                            : ""
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
                                    className="form-control"
                                    accept="image/*"
                                    onChange={(e) =>
                                      onFileChange(e, "bannerimg", "Document")
                                    }
                                  />
                                </div>
                              </div>

                              <div className="col-lg-3">
                                <div className="mb-3">
                                  <div className="d-flex justify-content-between">
                                    <div>
                                      <label
                                        htmlFor="discussionGallery"
                                        className="form-label"
                                      >
                                        Discussion Gallery{" "}
                                        <span className="text-danger">*</span>
                                      </label>
                                    </div>
                                    <div>
                                      {(ImagepostArr1.length > 0 &&
                                        ImagepostArr1.length == 1 && (
                                          <a
                                            onClick={() =>
                                              setShowModalFunc(true, "Gallery")
                                            }
                                            style={{ fontSize: "0.875rem" }}
                                          >
                                            <FontAwesomeIcon
                                              icon={faPaperclip}
                                            />{" "}
                                            {ImagepostArr1.length} file Attached
                                          </a>
                                        )) ||
                                        (ImagepostArr1.length > 0 &&
                                          ImagepostArr1.length > 1 && (
                                            <a
                                              onClick={() =>
                                                setShowModalFunc(
                                                  true,
                                                  "Gallery"
                                                )
                                              }
                                              style={{ fontSize: "0.875rem" }}
                                            >
                                              <FontAwesomeIcon
                                                icon={faPaperclip}
                                              />{" "}
                                              {ImagepostArr1.length} files
                                              Attached
                                            </a>
                                          ))}
                                    </div>
                                  </div>
                                  <input
                                    type="file"
                                    id="discussionforumGallery"
                                    name="discussionforumGallery"
                                    className="form-control"
                                    multiple
                                    onChange={(e) =>
                                      onFileChange(
                                        e,
                                        "Gallery",
                                        "DiscussionForumGallery"
                                      )
                                    }
                                  />
                                </div>
                              </div>

                              <div className="col-lg-12">
                                <div className="mb-3">
                                  <label
                                    htmlFor="overview"
                                    className="form-label"
                                  >
                                    Overview{" "}
                                    <span className="text-danger">*</span>
                                  </label>
                                  <textarea
                                    className="form-control"
                                    id="overview"
                                    placeholder="Enter Overview"
                                    name="overview"
                                    style={{ minHeight: "80px",maxHeight:"80px" }}
                                    value={formData.overview}
                                    onChange={(e) =>
                                      onChange(e.target.name, e.target.value)
                                    }
                                  ></textarea>
                                </div>
                              </div>

                              <div className="col-lg-12">
                                <div className="mb-3">
                                  <label
                                    htmlFor="description"
                                    className="form-label"
                                  >
                                    Description{" "}
                                    <span className="text-danger">*</span>
                                  </label>
                                  <div
                                    style={{
                                      display: "contents",
                                      justifyContent: "start",
                                      width: "100px",
                                    }}
                                  >
                                    <ReactQuill
                                      theme="snow"
                                      modules={modules}
                                      formats={formats}
                                      placeholder={""}
                                      value={richTextValues.description}
                                      onChange={(content) => {
                                        setRichTextValues((prevValues) => ({
                                          ...prevValues,
                                          ["description"]: content,
                                        }));
                                      }}
                                      style={{
                                        width: "100%",
                                        fontSize: "14px",
                                        // height: "100px",
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>


                               {
                             
                                            rows != null && rows.length > 0  && (
                             
                                              <div className="">
                             
                                                <div style={{border:"1px solid #ccc", borderRadius:'7px'}} className="p-3">
                             
                                                  <div >
                             
                                                    <strong className="font-16 mb-1">Approval Hierarchy</strong>
                                                    <p className="font-14 text-muted mb-3">Define Approval Hierarchy for the document submitted</p>
                             
                                                  </div>

                                                 
                             
                                                 
                             
                             
                                                  <div className="d-flex flex-column">
                             
                                                   
                             
                                      {/* /////////changes/////////// */}
                                      <table className="mtbalenew ">
                                                    <thead>
                                                      <tr>
                                                      <th style={{minWidth:'60px', maxWidth:'60px'}} className="newpad">  Select Level</th>
                                                      <th className="newpad"> Select Approver</th>
                                                      </tr>
                                                    </thead>
                                                    </table>
                                                    
                                                    {rows.map((row: any) => (
                                                      <div className="row mb-0" key={row.id}>
                                                         
                                                   
                                                            <table className="mtbalenew">
                                                    <tbody>
                                                      <tr>
                                                        <td style={{minWidth:'60px', maxWidth:'60px'}}>
                                                        <select style={{border:"0px solid #ccc", background:'#fff'}}
                             
                             className="form-control removeb"

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
                                                        <td>
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
                                                    </tbody>

                                                  </table>
                             
                                                        <div className="col-12 col-md-4">
                             
                                                          {/* <label htmlFor={`Level-${row.id}`} className="form-label">
                             
                                                            Select Level
                             
                                                          </label> */}
                             
                                                          
                             
                                                        </div>
                             
                             
                                                        <div className="col-12 col-md-8">
                             
                                                          {/* <label htmlFor={`approver-${row.id}`} className="form-label">
                             
                                                            Select Approver
                             
                                                          </label> */}
                             
                                                         
                             
                                                        </div>
                             
                             
                                                       
                             
                                                      </div>
                             
                                                    ))}
                             
                                                  </div>
                             
                             
                                                 
                             
                                                </div>
                             
                                              </div>
                             
                                            )
                             
                                 
                             
                                          }
                             
       

                                          {/* /////////changes/////////// */}

                              {/* <div className="col-lg-6">
                                <div className="mb-3">
                                  <div className="d-flex justify-content-between">
                                    <div>
                                      <label
                                        htmlFor="discussionThumbnail"
                                        className="form-label"
                                      >
                                        Discussion Document
                                        <span className="text-danger">*</span>
                                      </label>
                                    </div>
                                    <div>
                                      {(DocumentpostArr1.length > 0 &&
                                        DocumentpostArr1.length == 1 && (
                                          <a
                                            onClick={() =>
                                              setShowModalFunc(true, "docs")
                                            }
                                            style={{ fontSize: "0.875rem" }}
                                          >
                                            <FontAwesomeIcon
                                              icon={faPaperclip}
                                            />{" "}
                                            {DocumentpostArr1.length} file
                                            Attached
                                          </a>
                                        )) ||
                                        (DocumentpostArr1.length > 0 &&
                                          DocumentpostArr1.length > 1 && (
                                            <a
                                              onClick={() =>
                                                setShowModalFunc(true, "docs")
                                              }
                                              style={{ fontSize: "0.875rem" }}
                                            >
                                              <FontAwesomeIcon
                                                icon={faPaperclip}
                                              />{" "}
                                              {DocumentpostArr1.length} files
                                              Attached
                                            </a>
                                          ))}
                                    </div>
                                  </div>
                                  <input
                                    type="file"
                                    id="discussionforumThumbnail"
                                    name="discussionforumThumbnail"
                                    className="form-control inputcss"
                                    multiple
                                    onChange={(e) =>
                                      onFileChange(
                                        e,
                                        "Docs",
                                        "DiscussionForumDocs"
                                      )
                                    }
                                  />
                                </div>
                              </div> */}

                              {/* <div className="col-lg-2">
                                <div className="mb-3">
                                  <label
                                    htmlFor="FeaturedAnnouncement"
                                    className="form-label"
                                  >
                                    Featured Blog{" "}
                                    <span className="text-danger">*</span>
                                  </label>
                                  <br />
                                  <div className="form-check">
                                    <input
                                      type="checkbox"
                                      id="FeaturedAnnouncement"
                                      name="FeaturedAnnouncement"
                                      checked={formData.FeaturedAnnouncement}
                                      onChange={(e) =>
                                        handleChangeCheckBox(
                                          e.target.name,
                                          e.target.checked
                                        )
                                      }
                                      className="form-check-input inputcss"
                                    />
                                  </div>
                                </div>
                              </div> */}

                              <div className="text-center butncss mt-2">
                              <div style={{width:'140px', justifyContent:'center', textAlign:'center'}}
                                  className="btn btn-success waves-effect waves-light m-1"
                                  
                                  onClick={handleFormSaevasDraft}
                                >
                                  <div
                                                                                        className="d-flex"
                                                                                        style={{
                                                                                            justifyContent: "center",
                                                                                           
                                                                                        }}
                                                                                    >
                                                                                        <img
                                                                                            src={require("../assets/checkcircle.svg")}
                                                                                            style={{ width: "1rem", marginRight:'3px' }}
                                                                                            alt="Check"
                                                                                        />{" "}
                                                                                        Save as Draft
                                                                                    </div>
                                </div>
                                <div style={{width:'140px', justifyContent:'center', textAlign:'center'}}
                                  className="btn btn-success waves-effect waves-light m-1"
                                 
                                  onClick={handleFormSubmit}
                                >
                                  <div
                                    className="d-flex"
                                    style={{
                                      justifyContent: "center",
                                     
                                    }}
                                  >
                                    <img
                                      src={require("../assets/checkcircle.svg")}
                                      style={{ width: "1rem",marginRight:'3px' }}
                                      alt="Check"
                                    />{" "}
                                    Submit
                                  </div>
                                </div>
                                <button
                                  type="button" style={{width:'140px', justifyContent:'center', textAlign:'center'}}
                                  className="btn cancel-btn waves-effect waves-light m-1"
                                  
                                  onClick={handleCancel}
                                >
                                  <img
                                    src={require("../assets/xIcon.svg")}
                                    style={{ width: "1rem",marginRight:'3px' }}
                                    className="me-1"
                                    alt="x"
                                  />
                                  Cancel
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                   {/* Modal to display uploaded files */}
            {/* <Modal show={showModal} onHide={() => setShowModal(false)} size='lg' >
              <Modal.Header closeButton>
                {showDocTable && <Modal.Title>Documents</Modal.Title>}
                {showImgModal && <Modal.Title>Gallery Images/Videos</Modal.Title>}
                {showBannerModal && <Modal.Title>Banner Images</Modal.Title>}
              </Modal.Header>
             
              <Modal.Body className="scrollbar" id="style-5">

                {showDocTable &&
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
                              <td>{file.fileName.replace("/sites/IntranetUAT", "")}</td>
                              <td className='text-right'>{file.fileSize}</td>
                              <td className='text-center'> <img src={require("../../../CustomAsset/trashed.svg")} style={{ width: '15px' }} onClick={() => deleteLocalFile(index, DocumentpostArr1, "docs")} /> </td>
                            </tr>
                          ))}
                        </tbody>
                      </table></>
                  )
                }
                {showImgModal &&
                  (
                    <>
                      <table className="table table-bordered" style={{ fontSize: '0.75rem' }}>
                        <thead style={{ background: '#eef6f7' }}>
                          <tr>
                            <th>Serial No.</th>
                            <th> Image </th>
                            <th>File Name</th>
                            <th>File Size</th> */}
                            {/* {modeValue == 'null' && <th className='text-center'>Action</th>
                            } */}
                            {/* <th className='text-center'>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ImagepostArr1.map((file: any, index: number) => (
                            <tr key={index}>
                              <td className='text-center'>{index + 1}</td>
                              <td>  <img className='imagefe' src={file.fileType.startsWith('video/') ?
                             
                                        require("../../../Assets/ExtraImage/video.jpg") : file.fileUrl ?file.fileUrl: `${siteUrl}/AnnouncementAndNewsGallary/${file.fileName}`}
                              /></td>

                              <td>{file.fileName}</td>
                              <td className='text-right'>{file.fileSize}</td> */}
                              {/* {modeValue != 'view' && <td className='text-center'>
                                <img src={require("../../../CustomAsset/trashed.svg")} style={{ width: '15px' }} onClick={() => deleteLocalFile(index, ImagepostArr1, "Gallery")} />

                              </td>
                              } */}
                              {/* <td className='text-center'>
                                <img src={require("../../../CustomAsset/trashed.svg")} style={{ width: '15px' }} onClick={() => deleteLocalFile(index, ImagepostArr1, "Gallery")} />

                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table></>
                  )}
                {showBannerModal &&
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
                              <img src={file.fileType.startsWith('video/') ?
                                        require("../../../Assets/ExtraImage/video.jpg") :BnnerImagepostArr[0].fileUrl?BnnerImagepostArr[0].fileUrl:`${siteUrl}/${file.name}`} />
                              <td>{file.name}</td>
                              <td className='text-right'>{file.size}</td>
                              <td className='text-center'> <img src={require("../../../CustomAsset/trashed.svg")} style={{ width: '15px' }} onClick={() => deleteLocalFile(index, BnnerImagepostArr, "bannerimg")} /> </td>
                            </tr>
                          ))}
                        </tbody>
                      </table></>
                  )}

              </Modal.Body>
       

            </Modal> */}
            {/*  */}



            {/* modal css */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size='lg' className="newm" >
              <Modal.Header closeButton>
                { showDocTable && <Modal.Title>Documents</Modal.Title>}
                { showImgModal && <Modal.Title>Gallery Images/Videos</Modal.Title>}
                { showBannerModal && <Modal.Title>Banner Images</Modal.Title>}
              </Modal.Header>
              <Modal.Body className="" id="style-5">
 
                { showDocTable &&
                  (
                    <>
                      <table className="mtbalenew" style={{ fontSize: '0.75rem' }}>
                        <thead style={{ background: '#eef6f7' }}>
                          <tr>
                            <th style={{minWidth:'40px',maxWidth:'40px'}}>Serial No.</th>
                            <th style={{minWidth:'100px',maxWidth:'100px'}}>File Name</th>
                            <th style={{minWidth:'40px',maxWidth:'40px'}}>File Size</th>
                            <th style={{minWidth:'40px',maxWidth:'40px'}} className='text-center'>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {DocumentpostArr1.map((file: any, index: number) => (
                            <tr key={index}>
                              <td style={{minWidth:'40px',maxWidth:'40px'}} className='text-center'>{index + 1}</td>
                              <td style={{minWidth:'100px',maxWidth:'100px'}}>{file.fileName.replace("/sites/IntranetUAT", "")}</td>
                              <td style={{minWidth:'40px',maxWidth:'40px'}} className='text-right'>{file.fileSize}</td>
                              <td style={{minWidth:'40px',maxWidth:'40px'}} className='text-center'> <img style={{cursor:'pointer'}} src={require("../../../CustomAsset/del.png")}  onClick={() => deleteLocalFile(index, DocumentpostArr1, "docs")} /> </td>
                            </tr>
                          ))}
                        </tbody>
                      </table></>
                  )
                }
                { showImgModal &&
                  (
                    <>
                      <table className="mtbalenew" style={{ fontSize: '0.75rem' }}>
                        <thead style={{ background: '#eef6f7' }}>
                          <tr>
                            <th  style={{minWidth:'40px',maxWidth:'40px'}}>Serial No.</th>
                            <th style={{minWidth:'50px',maxWidth:'50px'}}> Image </th>
                            <th>File Name</th>
                            <th  style={{minWidth:'40px',maxWidth:'40px'}}>File Size</th>
                             <th className='text-center'>Action</th>
                           
                          </tr>
                        </thead>
                        <tbody>
                          {ImagepostArr1.map((file: any, index: number) => (
                            <tr key={index}>
                              <td style={{minWidth:'40px',maxWidth:'40px'}} className='text-center'>{index + 1}</td>
                              <td style={{minWidth:'50px',maxWidth:'50px', textAlign:'center'}}>  <img style={{width:'40px',height:'40px', borderRadius:'1000px'}} className='imagefe' src={file.fileType.startsWith('video/') ?
                             
                              require("../../../Assets/ExtraImage/video.jpg") :file.fileUrl ?file.fileUrl: `${siteUrl}/AnnouncementAndNewsGallary/${file.fileName}`}
                              /></td>
 
                              <td  >{file.fileName}</td>
                              <td  style={{minWidth:'40px',maxWidth:'40px'}} className='text-right'>{file.fileSize}</td>
                              <td className='text-center'>
                                <img style={{cursor:'pointer'}} src={require("../../../CustomAsset/del.png")}  onClick={() => deleteLocalFile(index, ImagepostArr1, "Gallery")} />
 
                              </td>
                             
                            </tr>
                          ))}
                        </tbody>
                      </table></>
                  )}
                { showBannerModal &&
                  (
                    <>
                      <table className="mtbalenew" style={{ fontSize: '0.75rem' }}>
                        <thead style={{ background: '#eef6f7' }}>
                          <tr>
                            <th style={{minWidth:'40px',maxWidth:'40px'}}>Serial No.</th>
                            <th style={{minWidth:'50px',maxWidth:'50px'}}>Image</th>
                            <th>File Name</th>
                            <th style={{minWidth:'40px',maxWidth:'40px'}}>File Size</th>
                            <th style={{minWidth:'40px',maxWidth:'40px'}} className='text-center'>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {BnnerImagepostArr[0].files.map((file: any, index: number) => (
                            <tr key={index}>
                              <td style={{minWidth:'40px',maxWidth:'40px'}} className='text-center'>{index + 1}</td>
                             <td style={{minWidth:'50px',maxWidth:'50px',textAlign:'center'}} >  <img style={{width:'40px',height:'40px', borderRadius:'1000px'}} src={BnnerImagepostArr[0].fileUrl?BnnerImagepostArr[0].fileUrl:`${siteUrl}/${file.name}`} /></td>
                              <td>{file.name}</td>
                              <td style={{minWidth:'40px',maxWidth:'40px'}} className='text-right'>{file.size}</td>
                              <td style={{minWidth:'40px',maxWidth:'40px'}} className='text-center'> <img style={{cursor:'pointer'}} src={require("../../../CustomAsset/del.png")}  onClick={() => deleteLocalFile(index, BnnerImagepostArr, "bannerimg")} /> </td>
                            </tr>
                          ))}
                        </tbody>
                      </table></>
                  )}
 
              </Modal.Body>
 
            </Modal>

            {/* modal css ends */}
                </div>
              </div>
           
            </div>
             }
            <CustomBlogpartTemplate _sp={sp} SiteUrl={SiteUrl} />
            <div style={{height:'20px'}}></div>

          </div>
        </div>
      </div>
    </div>
  );
};

const Blogs: React.FC<IBlogsProps> = (props) => (
  <Provider>
    <BlogsContext props={props} />
  </Provider>
);

export default Blogs;
