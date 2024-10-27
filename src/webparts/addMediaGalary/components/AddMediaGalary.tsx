import React from 'react'
import Provider from '../../../GlobalContext/provider';
import { IAddMediaGalaryProps } from './IAddMediaGalaryProps';
import { getSP } from '../loc/pnpjsConfig';
import { SPFI } from '@pnp/sp';
import { useMediaQuery } from 'react-responsive';
import UserContext from '../../../GlobalContext/context';
import { getCurrentUser, getEntity } from '../../../APISearvice/CustomService';
import { addItem, ARGMediaGalleryCategory, getMediaByID, getUrl, updateItem, uploadFile, uploadFileToLibrary } from '../../../APISearvice/MediaService';
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
// import "../components/AddMediaGalary.scss"
import HorizontalNavbar from '../../horizontalNavBar/components/HorizontalNavBar';
import context from '../../../GlobalContext/context';
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
    title: '',
    BannerImage: "",
    entity: "",
    Category:""
  })
  //#region Breadcrumb
  const Breadcrumb = [
    {
      "MainComponent": "Settings",
      "MainComponentURl": `${siteUrl}SitePages/Settings.aspx`
    },
    {
      "ChildComponent": "Media Gallery",
      "ChildComponentURl": `${siteUrl}/SitePages/MediaGalleryMaster.aspx`
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
    setCurrentUser(await getCurrentUser(sp,siteUrl))
    console.log(siteUrl, 'siteUrl');
    setMediaCategory(await ARGMediaGalleryCategory(sp))
    setBaseUrl(await (getUrl(sp, siteUrl)))
    setEnityData(await getEntity(sp)) //Entity

    if (sessionStorage.getItem("mediaId") != undefined) {
      const iD = sessionStorage.getItem("mediaId")
      console.log(iD, 'iDssss');

      let iDs = decryptId(iD)
      const setMediaById = await getMediaByID(sp, Number(iDs))

      console.log(setMediaById, 'setMediaById');
      setEditID(Number(setMediaById[0].ID))
      if (setMediaById.length > 0) {
        debugger
        setEditForm(true)

        let arr = {
          title: setMediaById[0].Title,
          entity: setMediaById[0]?.entity,
          BannerImage: setMediaById[0]?.Image != null ? setMediaById[0]?.Image : [],
          Category:setMediaById[0]?.Category
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


      }
    }
  }

  //#endregion
  console.log(siteUrl)
  //#region OnchangeData
  const onChange = (name: string, value: string) => {
    debugger
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
    window.location.href =  `${siteUrl}/SitePages/MediaGalleryMaster.aspx`;
  }


  const validateForm = () => {
    debugger
    const { title,  Category, entity, } = formData;
   
    let valid = true;

    if (!title) {
      Swal.fire('Error', 'Title is required!', 'error');
      valid = false;
    }
    else if (!entity) {
      Swal.fire('Error', 'Entity is required!', 'error');
      valid = false;
    }
    else if (!Category) {
      Swal.fire('Error', 'Category is required!', 'error');
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
              bannerImageArray = await uploadFile(file, sp, "Documents", "https://officeindia.sharepoint.com");
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
              MediaGalleryCategoryId:formData.Category
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
              MediaGalleryCategoryId:formData.Category
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
              bannerImageArray = await uploadFile(file, sp, "Documents", "https://officeindia.sharepoint.com");
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
            MediaGalleryCategoryId:formData.Category
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
          Swal.fire('Item added successfully', '', 'success');
          // sessionStorage.removeItem("bannerId")
          setTimeout(() => {
            window.location.href = `${siteUrl}/SitePages/MediaGalleryMaster.aspx`;
          }, 2000);
        }
      })


    }
  }

   }
  //#endregion


  const flatArray = (arr: any[]): any[] => {
    return arr.reduce((acc, val) => acc.concat(val), []);
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


  return (

    <div id="wrapper" ref={elementRef}>
      <div 
        className="app-menu"
        id="myHeader">
        <VerticalSideBar _context={sp} />
      </div>
      <div className="content-page newbancss" style={{ marginTop: '-15px' }}> {/* Edit by Amjad */}
        <HorizontalNavbar />
        <div className="content" style={{marginLeft: `${!useHide ? '240px' : '80px'}`, marginTop:'1.6rem'}}>
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
                                  <FontAwesomeIcon icon={faPaperclip} /> 1 file Attached
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

                      <div className="col-lg-4">
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
                      </div>

                      <div className="text-center butncss">
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
const AddMediaGalary: React.FC<IAddMediaGalaryProps> = (props) => {
  return (
    <Provider>
      <AddMediaGalaryContext props={props} />
    </Provider>
  )
}
export default AddMediaGalary