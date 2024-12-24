import React, { useState ,useRef} from 'react'
import { IBlogMasterProps } from './IBlogMasterProps';
import Provider from '../../../GlobalContext/provider';
import UserContext from '../../../GlobalContext/context';
import { getSP } from '../loc/pnpjsConfig';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../CustomCss/mainCustom.scss";
import "../../verticalSideBar/components/VerticalSidebar.scss";
import "../../../Assets/Figtree/Figtree-VariableFont_wght.ttf";
import { SPFI } from '@pnp/sp/presets/all';
import VerticalSideBar from '../../verticalSideBar/components/VerticalSideBar';
import HorizontalNavbar from '../../horizontalNavBar/components/HorizontalNavBar';
import CustomBreadcrumb from '../../../CustomJSComponents/CustomBreadcrumb/CustomBreadcrumb';
import context from '../../../GlobalContext/context';
import { useMediaQuery } from 'react-responsive';
import { addItem, getBlog, GetBlogCategory, GetCategory, updateItem, uploadFileBlog } from '../../../APISearvice/BlogService';
import { addActivityLeaderboard, getCategory, getEntity } from '../../../APISearvice/CustomService';
import { getNews, uploadFile, uploadFileToLibrary } from '../../../APISearvice/NewsService';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';
import ReactQuill from 'react-quill';
import "react-quill/dist/quill.snow.css";
import "../components/Blogs.scss";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import CustomBlogpartTemplate from "../../../CustomJSComponents/CustomBlogWebpartTemplate/CustomBlogWebpartTemplate";
const BlogsContext = ({ props }: any) => {
  const sp: SPFI = getSP();
  const { useHide }: any = React.useContext(UserContext);
  const elementRef = useRef<HTMLDivElement>(null);
  const SiteUrl = props.siteUrl;
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
  const { setHide }: any = context;
  const [EnityData, setEnityData] = React.useState([]);
  const [announcementData, setAnnouncementData] = React.useState([]);
  const [newsData, setNewsData] = React.useState([]);
  const [CategoryData, setCategoryData] = React.useState([]);
  const [BlogCategoryData, setBlogCategoryData] = React.useState([]);

  const [blogData, setBlogData] = useState<any | null>(null);
  const [richTextValues, setRichTextValues] = React.useState<{
    [key: string]: string;
  }>({});
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
    const announcementArr = await getBlog(sp);
    // const categorylist = await GetCategory(sp);
    setCategoryData(await GetCategory(sp));
    setBlogCategoryData(await GetBlogCategory(sp));

    setEnityData(await getEntity(sp)); //Entity
    setAnnouncementData(announcementArr);
    const NewsArr = await getNews(sp);
    setNewsData(NewsArr);
  };
  
  React.useEffect(() => {
    console.log("This function is called only once", useHide);
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
  //   console.log("check-data-of--dataofblog", dataofblog);
  // };

  const onFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    libraryName: string,
    docLib: string
  ) => {
    debugger;
    console.log("libraryName-->>>>", libraryName)
    event.preventDefault();
    let uloadDocsFiles: any[] = [];
    let uloadDocsFiles1: any[] = [];

    let uloadImageFiles: any[] = [];
    let uloadImageFiles1: any[] = [];

    let uloadBannerImageFiles: any[] = [];

    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files);

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
        const imageVideoFiles = files.filter(
          (file) =>
            file.type.startsWith("image/") || file.type.startsWith("video/")
        );

        if (imageVideoFiles.length > 0) {
          const arr = {
            files: imageVideoFiles,
            libraryName: libraryName,
            docLib: docLib,
          };
          console.log("arr-->>>", arr)
          if (libraryName === "Gallery") {
            uloadImageFiles.push(arr);
            setImagepostArr(uloadImageFiles);
            if (ImagepostArr1.length > 0) {
              imageVideoFiles.forEach((ele) => {
                console.log("ele in if-->>>>", ele)
                let arr1 = {
                  ID: 0,
                  Createdby: "",
                  Modified: "",
                  fileUrl: "",
                  fileSize: ele.size,
                  fileType: ele.type,
                  fileName: ele.name,
                };
                ImagepostArr1.push(arr1);
              });
              setImagepostArr1(ImagepostArr1);
            } else {
              imageVideoFiles.forEach((ele) => {
                console.log("ele in else-->>>>", ele)
                let arr1 = {
                  ID: 0,
                  Createdby: "",
                  Modified: "",
                  fileUrl: "",
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
            console.log("uloadBannerImageFiles-->>", uloadBannerImageFiles)
            setBannerImagepostArr(uloadBannerImageFiles);
          }
        } else {
          Swal.fire("only image & video can be upload");
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
    else if (!category) {
      Swal.fire("Error", "Category is required!", "error");
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

  const handleFormSubmit = async () => {
    if (validateForm()) {
      if (editForm) {
        Swal.fire({
          title: "Are you sure you want to publish this blog?",
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          icon: "warning",
        }).then(async (result) => {
          console.log(result);
          if (result.isConfirmed) {
            //console.log("Form Submitted:", formValues, bannerImages, galleryImages, documents);
            debugger;
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
              debugger
              for (const file of BnnerImagepostArr[0].files) {
                debugger
                //  const uploadedBanner = await uploadFile(file, sp, "Documents", Url);
                bannerImageArray = await uploadFileBlog(
                  file,
                  sp,
                  "Documents",
                  "https://officeindia.sharepoint.com"
                );
              }
            } else {
              bannerImageArray = null;
            }
            debugger;
            if (bannerImageArray != null) {
              // Create Post
              const postPayload = {
                Topic: formData.topic,
                Overview: formData.overview,
                Description: richTextValues.description,
                EntityId: Number(formData.entity),
                BlogCategoryId: Number(formData.category),
                BlogBannerImage: JSON.stringify(bannerImageArray),
                // DiscussionForumCategoryId: Number(formData.category),
              };
              console.log("postPayload-->>>>>", postPayload);

              const postResult = await updateItem(postPayload, sp, editID);
              const postId = postResult?.data?.ID;
              debugger;
              // if (!postId) {
              //   console.log("Post creation failed.");
              //   return;
              // }

              // Upload Gallery Images
              // Upload Gallery Images
              if (ImagepostArr[0]?.files?.length > 0) {
                for (const file of ImagepostArr[0].files) {
                  const uploadedGalleryImage = await uploadFileToLibrary(
                    file,
                    sp,
                    "BlogGallery"
                  );

                  galleryIds = galleryIds.concat(
                    uploadedGalleryImage.map((item: { ID: any }) => item.ID)
                  );
                  if (ImagepostArr1.length > 0) {
                    ImagepostArr1.push(uploadedGalleryImage[0]);
                    const updatedData = ImagepostArr1.filter(
                      (item) => item.ID !== 0
                    );
                    debugger;
                    console.log(updatedData, "updatedData");
                    galleryArray = updatedData;
                    //galleryArray.push(ImagepostArr1);

                    ImagepostIdsArr.push(galleryIds[0]); //galleryIds.push(ImagepostIdsArr)
                    galleryIds = ImagepostIdsArr;
                  } else {
                    galleryArray.push(uploadedGalleryImage);
                  }
                }
              } else {
                galleryIds = ImagepostIdsArr;
                galleryArray = ImagepostArr1;
              }

              // Upload Documents
              if (DocumentpostArr[0]?.files?.length > 0) {
                for (const file of DocumentpostArr[0].files) {
                  const uploadedDocument = await uploadFileToLibrary(
                    file,
                    sp,
                    "BlogsDocs"
                  );
                  documentIds = documentIds.concat(
                    uploadedDocument.map((item: { ID: any }) => item.ID)
                  );
                  if (DocumentpostArr1.length > 0) {
                    DocumentpostArr1.push(uploadedDocument[0]);
                    const updatedData = DocumentpostArr1.filter(
                      (item) => item.ID !== 0
                    );
                    console.log(updatedData, "updatedData");
                    documentArray = updatedData;
                    // documentArray.push(DocumentpostArr1)
                    DocumentpostIdsArr.push(documentIds[0]); //.push(DocumentpostIdsArr)
                    documentIds = DocumentpostIdsArr;
                  } else {
                    documentArray.push(uploadedDocument);
                  }
                }
              } else {
                documentIds = DocumentpostIdsArr;
                documentArray = DocumentpostArr1;
              }
              if (galleryArray.length > 0) {
                let ars = galleryArray.filter((x) => x.ID == 0);
                if (ars.length > 0) {
                  for (let i = 0; i < ars.length; i++) {
                    galleryArray.slice(i, 1);
                  }
                }
              }
              if (documentArray.length > 0) {
                let arsdoc = documentArray.filter((x) => x.ID == 0);
                if (arsdoc.length > 0) {
                  for (let i = 0; i < arsdoc.length; i++) {
                    documentArray.slice(i, 1);
                  }
                }
                console.log(documentIds, "documentIds");
                console.log(galleryIds, "galleryIds");
                // Update Post with Gallery and Document Information
              }

              const updatePayload = {
                ...(galleryIds.length > 0 && {
                  BlogsGalleryId: galleryIds,
                  BlogGalleryJSON: JSON.stringify(
                    flatArray(galleryArray)
                  ),
                }),
                ...(documentIds.length > 0 && {
                  BlogsDocsId: documentIds,
                  BlogDocsJSON: JSON.stringify(
                    flatArray(documentArray)
                  ),
                }),
              };

              if (Object.keys(updatePayload).length > 0) {
                const updateResult = await updateItem(
                  updatePayload,
                  sp,
                  editID
                );
                console.log("Update Result:", updateResult);
              }
            } else {
              if (
                BnnerImagepostArr.length > 0 &&
                BnnerImagepostArr[0]?.files?.length > 0
              ) {
                debugger
                for (const file of BnnerImagepostArr[0].files) {
                  debugger
                  //  const uploadedBanner = await uploadFile(file, sp, "Documents", Url);
                  bannerImageArray = await uploadFileBlog(
                    file,
                    sp,
                    "Documents",
                    "https://officeindia.sharepoint.com"
                  );
                }
              } else {
                bannerImageArray = null;
              }
              // Create Post
              const postPayload = {
                Title: formData.topic,
                Overview: formData.overview,
                Description: richTextValues.description,
                EntityId: Number(formData.entity),
                BlogCategoryId: Number(formData.category),
                BlogBannerImage: JSON.stringify(bannerImageArray)
                // DiscussionForumCategoryId: Number(formData.category),
              };
              console.log("postPayload else-->>>>", postPayload);

              const postResult = await updateItem(postPayload, sp, editID);
              const postId = postResult?.data?.ID;
              debugger;
              // if (!postId) {
              //   console.log("Post creation failed.");
              //   return;
              // }

              // Upload Gallery Images
              // Upload Gallery Images
              if (ImagepostArr[0]?.files?.length > 0) {
                for (const file of ImagepostArr[0].files) {
                  const uploadedGalleryImage = await uploadFileToLibrary(
                    file,
                    sp,
                    "BlogGallery"
                  );

                  galleryIds = galleryIds.concat(
                    uploadedGalleryImage.map((item: { ID: any }) => item.ID)
                  );
                  if (ImagepostArr1.length > 0) {
                    ImagepostArr1.push(uploadedGalleryImage[0]);
                    const updatedData = ImagepostArr1.filter(
                      (item) => item.ID !== 0
                    );
                    console.log(updatedData, "updatedData");
                    galleryArray = updatedData;
                    // galleryArray.push(ImagepostArr1);

                    ImagepostIdsArr.push(galleryIds[0]); //galleryIds.push(ImagepostIdsArr)
                    galleryIds = ImagepostIdsArr;
                  } else {
                    galleryArray.push(uploadedGalleryImage);
                  }
                }
              } else {
                galleryIds = ImagepostIdsArr;
                galleryArray = ImagepostArr1;
              }

              // Upload Documents
              if (DocumentpostArr[0]?.files?.length > 0) {
                for (const file of DocumentpostArr[0].files) {
                  const uploadedDocument = await uploadFileToLibrary(
                    file,
                    sp,
                    "BlogsDocs"
                  );
                  documentIds = documentIds.concat(
                    uploadedDocument.map((item: { ID: any }) => item.ID)
                  );
                  if (DocumentpostArr1.length > 0) {
                    DocumentpostArr1.push(uploadedDocument[0]);
                    const updatedData = DocumentpostArr1.filter(
                      (item) => item.ID !== 0
                    );
                    console.log(updatedData, "updatedData");
                    documentArray = updatedData;
                    // documentArray.push(DocumentpostArr1)
                    DocumentpostIdsArr.push(documentIds[0]); //.push(DocumentpostIdsArr)
                    documentIds = DocumentpostIdsArr;
                  } else {
                    documentArray.push(uploadedDocument);
                  }
                }
              } else {
                documentIds = DocumentpostIdsArr;
                documentArray = DocumentpostArr1;
              }
              if (galleryArray.length > 0) {
                let ars = galleryArray.filter((x) => x.ID == 0);
                if (ars.length > 0) {
                  for (let i = 0; i < ars.length; i++) {
                    galleryArray.slice(i, 1);
                  }
                }
              }
              if (documentArray.length > 0) {
                let arsdoc = documentArray.filter((x) => x.ID == 0);
                if (arsdoc.length > 0) {
                  for (let i = 0; i < arsdoc.length; i++) {
                    documentArray.slice(i, 1);
                  }
                }
              }
              console.log(documentIds, "documentIds");
              console.log(galleryIds, "galleryIds");
              // Update Post with Gallery and Document Information
              const updatePayload = {
                ...(galleryIds.length > 0 && {
                  BlogsGalleryId: galleryIds,

                  BlogGalleryJSON: JSON.stringify(
                    flatArray(galleryArray)
                  ),
                }),
                ...(documentIds.length > 0 && {
                  BlogsDocsId: documentIds,
                  BlogDocsJSON: JSON.stringify(
                    flatArray(documentArray)
                  ),
                }),
              };

              if (Object.keys(updatePayload).length > 0) {
                const updateResult = await updateItem(
                  updatePayload,
                  sp,
                  editID
                );
                console.log("Update Result:", updateResult);
              }
            }
            //Swal.fire("Item update successfully", "", "success");
            sessionStorage.removeItem("announcementId");
            setTimeout(() => {
              dismissModal()
            }, 2000);
          }
        });
      } else {
        Swal.fire({
          title: "Are you sure you want to publish this blog?",
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          icon: "warning",
        }).then(async (result) => {
          //console.log("Form Submitted:", formValues, bannerImages, galleryImages, documents);
          if (result.isConfirmed) {
            debugger;
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
                bannerImageArray = await uploadFileBlog(
                  file,
                  sp,
                  "Documents",
                  "https://officeindia.sharepoint.com"
                );
              }
            }
            debugger;
            // Create Post
            const postPayload = {
              Title: formData.topic,
              Overview: formData.overview,
              Description: richTextValues.description,
              EntityId: Number(formData.entity),
              BlogCategoryId: Number(formData.category),
              BlogBannerImage: JSON.stringify(bannerImageArray)
              // DiscussionForumCategoryId: Number(formData.category),
            };
            console.log("postPayload 3-->>>>>", postPayload);

            const postResult = await addItem(postPayload, sp);
            const postId = postResult?.data?.ID;
            debugger;
            if (!postId) {
              console.log("Post creation failed.");
              return;
            }
            // Blog by user

            addActivity()

            console.log(
              ImagepostArr,
              "ImagepostArr",
              ImagepostArr1,
              "ImagepostArr1",
              DocumentpostArr1,
              "DocumentpostArr1",
              DocumentpostArr,
              "DocumentpostArr"
            );

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
            if (DocumentpostArr.length > 0) {
              for (const file of DocumentpostArr[0]?.files) {
                const uploadedDocument = await uploadFileToLibrary(
                  file,
                  sp,
                  "BlogsDoc"
                );
                documentIds = documentIds.concat(
                  uploadedDocument.map((item: { ID: any }) => item.ID)
                );
                documentArray.push(uploadedDocument);
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
              ...(documentIds.length > 0 && {
                BlogsDocsId: documentIds,
                BlogDocsJSON: JSON.stringify(
                  flatArray(documentArray)
                ),
              }),
            };

            if (Object.keys(updatePayload).length > 0) {
              const updateResult = await updateItem(updatePayload, sp, postId);
              console.log("Update Result:", updateResult);
              Swal.fire("Item added successfully", "", "success");
            }
            
            // sessionStorage.removeItem("bannerId");
            setAnnouncementData(await getBlog(sp));
            setTimeout(async () => {
           
              setFormData({ topic: "",
                category: "",
                entity: "",
                Type: "",
                bannerImage: null,
                // announcementGallery: null,
                // announcementThumbnail: null,
                description: "",
                overview: "",
                FeaturedAnnouncement: false,});
              setDocumentpostArr1([]);
              setDocumentpostArr([]);
               setImagepostArr([])
               setImagepostArr1([])
               window.location.reload() //forNow
              dismissModal()
            }, 2000);
          }
        });
      }
    }
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
      modalBackdrop.remove();
    }
  };

  const addActivity=async ()=>
    { 
      await addActivityLeaderboard(sp,"Blog by user");
    }

  const handleCancel = () => {
    debugger;
    window.location.href =
      `${SiteUrl}/SitePages/Blogs.aspx`;
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
          <HorizontalNavbar  _context={sp} siteUrl={SiteUrl}/>
        <div className="content mt-0" style={{ marginLeft: `${!useHide ? '240px' : '80px'}` }}>
          <div className="container-fluid  paddb">
            <div className="row">
              <div className="col-lg-3">
                <CustomBreadcrumb Breadcrumb={Breadcrumb} />
              </div>
              <div className="col-lg-9">
                <div className="d-flex flex-wrap align-items-center justify-content-end mt-3 mb-3">
                  {/* <div style={{ width: '310px' }}>
                    <label style={{ float: 'left', textAlign: 'right', width: '150px' }} className="me-2 mt-1" >Select Category</label>
                    <select style={{ float: 'left', width: '130px' }} className="form-select me-1">
                      {
                       AllCategory.length>0? AllCategory.map((item:any)=>
                        {
                          <option>{item.Category}</option>
                        }):""
                      }
                      
                    </select>
                  </div> */}
                  {/* <label className="me-2">From</label>
                  <div className="me-3">
                    <input type="date" className="form-control my-1 my-md-0" id="inputPassword2" placeholder="Search..." />
                  </div>

                  <label className="me-2">To</label>
                  <div className="me-2">
                    <input type="date" className="form-control my-1 my-md-0" id="inputPassword2" placeholder="Search..." />
                  </div> */}
                  <div className="col-lg-8">
                    <div className="d-flex flex-wrap align-items-center justify-content-end mt-3">
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
                      <div className="modal-dialog modal-lg ">
                        <div className="modal-content">
                          <div className="modal-header d-block">
                            <h5 className="modal-title" id="exampleModalLabel">
                              New Blog
                            </h5>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            ></button>
                          </div>
                          <div className="modal-body">
                            <form className="row">
                              <div className="col-lg-4">
                                <div className="mb-3">
                                  <label htmlFor="topic" className="form-label">
                                    Topic <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    id="topic"
                                    name="topic"
                                    placeholder="Enter Topic"
                                    className="form-control inputcss"
                                    value={formData.topic}
                                    onChange={(e) =>
                                      onChange(e.target.name, e.target.value)
                                    }
                                  />
                                </div>
                              </div>

                              <div className="col-lg-4">
                                <div className="mb-3">
                                  <label
                                    htmlFor="entity"
                                    className="form-label"
                                  >
                                    Entity{" "}
                                    <span className="text-danger">*</span>
                                  </label>
                                  <select
                                    className="form-select inputcss"
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
                              <div className="col-lg-4">
                                <div className="mb-3">
                                  <label
                                    htmlFor="category"
                                    className="form-label"
                                  >
                                    Category
                                    <span className="text-danger">*</span>
                                  </label>
                                  <select
                                    className="form-select inputcss"
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={(e) =>
                                      onChange(e.target.name, e.target.value)
                                    }
                                  >
                                    <option value="">Select</option>
                                    {BlogCategoryData.map((item, index) => (
                                      <option key={index} value={item.Id}>
                                        {item.CategoryName}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                              <div className="col-lg-4">
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
                                              <a style={{ fontSize: "0.875rem" }}>
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
                                    className="form-control inputcss"
                                    onChange={(e) =>
                                      onFileChange(e, "bannerimg", "Document")
                                    }
                                  />
                                </div>
                              </div>

                              <div className="col-lg-4">
                                <div className="mb-3">
                                  <div className="d-flex justify-content-between">
                                    <div>
                                      <label
                                        htmlFor="discussionGallery"
                                        className="form-label"
                                      >
                                        Blog Gallery{" "}
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
                                    className="form-control inputcss"
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
                              <div className="col-lg-4">
                                <div className="mb-3">
                                  <div className="d-flex justify-content-between">
                                    <div>
                                      <label
                                        htmlFor="discussionThumbnail"
                                        className="form-label"
                                      >
                                        Blog Document{" "}
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
                              </div>

                              {/* <div className="col-lg-4">
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

                              <div className="col-lg-8">
                                <div className="mb-3">
                                  <label
                                    htmlFor="overview"
                                    className="form-label"
                                  >
                                    Overview{" "}
                                    <span className="text-danger">*</span>
                                  </label>
                                  <textarea
                                    className="form-control inputcss"
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
                                      placeholder={"Write your content ..."}
                                      value={richTextValues.description}
                                      onChange={(content) => {
                                        setRichTextValues((prevValues) => ({
                                          ...prevValues,
                                          ["description"]: content,
                                        }));
                                      }}
                                      style={{
                                        width: "100%",
                                        fontSize: "6px",
                                        // height: "100px",
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>

                            

                              <div className="text-center butncss">
                                <div
                                  className="btn btn-success waves-effect waves-light m-1"
                                  style={{ fontSize: "0.875rem" }}
                                  onClick={handleFormSubmit}
                                >
                                  <div
                                    className="d-flex"
                                    style={{
                                      justifyContent: "space-around",
                                      width: "70px",
                                    }}
                                  >
                                    <img
                                      src={require("../../../Assets/ExtraImage/checkcircle.svg")}
                                      style={{ width: "1rem" }}
                                      alt="Check"
                                    />{" "}
                                    Submit
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  className="btn btn-light waves-effect waves-light m-1"
                                  style={{ fontSize: "0.875rem" }}
                                  onClick={dismissModal}
                                >
                                  <img
                                    src={require("../../../Assets/ExtraImage/xIcon.svg")}
                                    style={{ width: "1rem" }}
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
                </div>
              </div>
            </div>
            <CustomBlogpartTemplate _sp={sp} SiteUrl={SiteUrl} />
          </div>
        </div>
      </div>
    </div>
  )
}


const BlogMaster: React.FC<IBlogMasterProps> = (props) => (
  <Provider>
    <BlogsContext props={props} />
  </Provider>
);

export default BlogMaster;
