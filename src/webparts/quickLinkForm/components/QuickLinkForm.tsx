import * as React from 'react';
//import styles from './QuickLinkForm.module.scss';
import type { IQuickLinkFormProps } from './IQuickLinkFormProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { getSP } from '../loc/pnpjsConfig';
import UserContext from '../../../GlobalContext/context';
import { SPFI } from '@pnp/sp/presets/all';
import Provider from '../../../GlobalContext/provider';
import VerticalSideBar from '../../verticalSideBar/components/VerticalSideBar';
import HorizontalNavbar from '../../horizontalNavBar/components/HorizontalNavBar';
import CustomBreadcrumb from '../../../CustomJSComponents/CustomBreadcrumb/CustomBreadcrumb';
import { FormSubmissionMode } from '../../../Shared/Interfaces';
import { allowstringonly, getCurrentUser } from '../../../APISearvice/CustomService';
import Swal from 'sweetalert2';
import { addItem, getEntity, getItemByID,updateItem, uploadFileBanner } from '../../../APISearvice/QuickLinksService';
import { decryptId } from '../../../APISearvice/CryptoService';
import { getUrlParameterValue } from '../../../Shared/Helper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';
import { Modal } from 'react-bootstrap';

const QuickLinkFormContext =({ props }: any) => {
  const sp: SPFI = getSP();
  const siteUrl = props.siteUrl;
  const [Loading, setLoading] = React.useState(false);
  const { useHide }: any = React.useContext(UserContext);
  const elementRef = React.useRef<HTMLDivElement>(null);
  const [ValidDraft, setValidDraft] = React.useState(true);
  const [ValidSubmit, setValidSubmit] = React.useState(true);
  const [InputDisabled, setInputDisabled] = React.useState(false);
  const [modeValue, setmode] = React.useState(null);
   const [EnityData, setEnityData] = React.useState([]);
  const [selectedOption, setSelectedOption] = React.useState(null);
  const [editForm, setEditForm] = React.useState(false);
  const [editID, setEditID] = React.useState(null);
  const [FormItemId, setFormItemId] = React.useState(null);
  const [BnnerImagepostArr, setBannerImagepostArr] = React.useState([]);
const [ImagepostArr, setImagepostArr] = React.useState([]);
  const [ImagepostArr1, setImagepostArr1] = React.useState([]);
   const [showModal, setShowModal] = React.useState(false);
    const [showDocTable, setShowDocTable] = React.useState(false);
    const [showImgModal, setShowImgTable] = React.useState(false);
    const [showBannerModal, setShowBannerTable] = React.useState(false);
  const Breadcrumb = [
    {
      "MainComponent": "Settings",
      "MainComponentURl": `${siteUrl}/SitePages/Settings.aspx`
    },
    {
      "ChildComponent": "Add QuickLink",
      "ChildComponentURl": `${siteUrl}/SitePages/QuickLinksMaster.aspx`
    }
  ]

  const [formData, setFormData] = React.useState({
      Title: "",
      URL: "",
      RedirectTONewTab:false  ,
      EntityId: 0,
      IsActive:false
    });

    
  const Statusdata = [
    
    { ID: 1, Title: 'Yes' },
    { ID: 2, Title: 'No' },
    
  ];

    //#region onChange
    const onChange = async (name: string, value: string) => {
      setFormData((prevData) => ({
        ...prevData,
        [name]: name === "RedirectTONewTab" || name === "IsActive" ? value === "true" : value,
        
      }));
  
     
    };
    //#endregion

     React.useEffect(() => {
         
          ApiCallFunc();
    
    
    
          // formData.title = currentUser.Title;
    
        }, [useHide]);


            //#endregion
  const ApiCallFunc = async () => {
    const entityDefaultitem = await getEntity(sp);
    if (entityDefaultitem.find((item) => item.name === 'Global').id) {
      formData.EntityId = entityDefaultitem.find((item) => item.name === 'Global').id;

    }
    setEnityData(await getEntity(sp)) //Entity
   
        //     // setCurrentUser(await getCurrentUser(sp, siteUrl))
        //     const Currusers :any= await getCurrentUser(sp, siteUrl);
        //     const users = await sp.web.siteUsers();
        
        //     // const options = users.map(item => ({
        //     //   value: item.Id,
        //     //   label: item.Title,
        //     //   UserName :item.Title,
        //     //   UserEmail :item.Email
        //     // }));
        
        //     // setRows(options);
        // // if(Currusers){
        //   const formobj = {
        //     Title: "",
        //      URL: "",
        //     RedirectTONewTab:false  
           
        
        //    }
        //   setFormData(formobj);
        
        // }
        // var encryptedId = "U2FsdGVkX1/ZSx0oFhvAh5NpBkgWn8gIfZcjgTT+DyI=";
        // sessionStorage.setItem("quicklinkId", encryptedId)
         let formitemid;
            //#region getdataByID
            if (sessionStorage.getItem("quicklinkId") != undefined && sessionStorage.getItem("quicklinkId") != null) {
              const iD = sessionStorage.getItem("quicklinkId")
              let iDs = decryptId(iD)
              formitemid = Number(iDs);
              setFormItemId(Number(iDs))
            }
            // else {
            //   let formitemidparam = getUrlParameterValue('contentid');
            //   if (formitemidparam) {
            //     formitemid = Number(formitemidparam);
            //     setFormItemId(Number(formitemid));
            //   }
            // }
       
            //#region getdataByID
        
        
            // /////////////////
        
             // if (sessionStorage.getItem("announcementId") != undefined) {
                if (formitemid) {
                  // const iD = sessionStorage.getItem("announcementId")
                  // let iDs = decryptId(iD)
                  const setDelegateById = await getItemByID(sp, Number(formitemid))
            
                  // console.log(setBannerById, 'setBannerById');
                  setEditID(Number(setDelegateById[0].ID))
                  if (setDelegateById.length > 0) {
                    debugger
                    setEditForm(true)
                    // setCategoryData(await getCategory(sp, Number(setBannerById[0]?.TypeMaster))) // Category
                    // const startDate = setDelegateById[0].StartDate ?new Date(setDelegateById[0].StartDate).toISOString()?.split("T")[0]:"";
                    // const endDate =setDelegateById[0].EndDate? new Date(setDelegateById[0].EndDate).toISOString()?.split("T")[0]:"";
        
        
                    let arr = {

                      Title: setDelegateById[0].Title,
                      URL: setDelegateById[0].URL,
                      RedirectTONewTab: setDelegateById[0].RedirectToNewTab ,
                      EntityId: setDelegateById[0].EntityId?setDelegateById[0].EntityId:0,
                      IsActive:setDelegateById[0].IsActive
                      // QuickLinkImage: setDelegateById[0]?.QuickLinkImage,
                      
        
                    }
                    let banneimagearr = []
                    if (setDelegateById[0].QuickLinkImage.length > 0) {
                      banneimagearr = setDelegateById[0].QuickLinkImage
                      console.log(banneimagearr, 'banneimagearr');
            
                      setBannerImagepostArr(banneimagearr);
                      setFormData(arr)
            
                    }
                    else {
                      setFormData(arr)
                    }
                    
                      // setFormData(arr)
            
                      // setFormData((prevValues) => ({
                      //   ...prevValues,
                      //   [FeaturedAnnouncement]: setBannerById[0].FeaturedAnnouncement === "on" ? true : false, // Ensure the correct boolean value is set for checkboxes
                      // }));
            
                    }
                    
            
                  }
                }
                //#endregion

     const validateForm = async (fmode: FormSubmissionMode) => {
            const { Title,URL, RedirectTONewTab,EntityId } = formData;
            // const { description } = richTextValues;
            let valid = true;
            let validateOverview:boolean = false;
            let validatetitlelength = false;
            let validateTitle = false;
            setValidDraft(true);
            setValidSubmit(true);
            // if (DelegateName!== "") {
            //  validatetitlelength = DelegateName.length <= 255;
            //   validateTitle = DelegateName !== "" && await allowstringonly(DelegateName);
            // }
            // if (EndDate !==""){
            //   validateOverview = EndDate! == "" && await allowstringonly(EndDate);
            // }
    
       if (fmode == FormSubmissionMode.SUBMIT) {
         if (!Title) {
           //Swal.fire('Error', 'Title is required!', 'error');
           valid = false;
         } else if (!URL) {
           //Swal.fire('Error', 'Type is required!', 'error');
           valid = false;
         }
         else if(!EntityId){
          valid = false;
         }
         else if(BnnerImagepostArr.length == 0 ){
          valid = false;
         }
        //   else if (!RedirectTONewTab) {
        //    //Swal.fire('Error', 'Category is required!', 'error');
        //    valid = false;
        //  }
        //   else if (!selectedOption) {
        //    //Swal.fire('Error', 'Entity is required!', 'error');
        //    valid = false;
        //  }
        

         setValidSubmit(valid);

       }
       if (!valid && fmode == FormSubmissionMode.SUBMIT) {
        
           Swal.fire('Please fill all the mandatory fields.');
        
       }
                 
                return valid;
          }

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
                    var postPayload = {};
                    

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
                          `${siteUrl}`
                        );
                      }

                      postPayload = {
                        Title: formData.Title,
                        URL: formData.URL,
                        RedirectToNewTab: formData.RedirectTONewTab,
                        EntityId: formData.EntityId,
                        IsActive:formData.IsActive,
                        QuickLinkImage: JSON.stringify(bannerImageArray)
                      };
                    }
                    else{
                      postPayload = {
                        Title: formData.Title,
                        URL: formData.URL,
                        RedirectToNewTab: formData.RedirectTONewTab,
                        EntityId: formData.EntityId,
                        IsActive:formData.IsActive

                      };
                    }
                    
                    //   console.log(postPayload);
        
                      const postResult = await updateItem(postPayload, sp, editID);
                     
                      setLoading(false);
                      Swal.fire('Updated successfully.', '', 'success');
                      sessionStorage.removeItem("quicklinkId")
                      setTimeout(() => {
                        window.location.href = `${siteUrl}/SitePages/QuickLinksMaster.aspx`;
                      }, 500);
        
                               
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

                     const modalBackdrop = document.querySelector('.modal-backdrop');
                     if (modalBackdrop) {
                       modalBackdrop.classList.remove('modal-backdrop');
                       modalBackdrop.classList.remove('fade');
                       modalBackdrop.classList.remove('show');
                       // modalBackdrop.remove();
                     }
                     let bannerImageArray: any = {};
                    //  let galleryIds: any[] = [];
                    //  let documentIds: any[] = [];
                    //  let galleryArray: any[] = [];
                    //  let documentArray: any[] = [];
 
                     
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
                           `${siteUrl}`
                         );
                       }
                     }
                  
                  //   // Create Post
                  const postPayload = {
                    Title :formData.Title,
                    URL :formData.URL,
                    RedirectToNewTab:formData.RedirectTONewTab,
                    QuickLinkImage: JSON.stringify(bannerImageArray),
                    EntityId: formData.EntityId,
                    IsActive:formData.IsActive
                    
                  };
                    // console.log(postPayload);
        
                    const postResult = await addItem(postPayload, sp);
                    const postId = postResult?.data?.ID;
                    // openEmailDialog(formData,postPayload);
                    // sendEmailUsingSMTP(formData,postPayload);
                  //   debugger
                  //   if (!postId) {
                  //     console.error("Post creation failed.");
                  //     return;
                  //   }
        
                       setLoading(false);
                      Swal.fire('Submitted successfully.', '', 'success');
                  
                      setTimeout(() => {
                        window.location.href = `${siteUrl}/SitePages/QuickLinksMaster.aspx`;
                      }, 500);
                   
        
                   }
                })
        
              }
            }
        
          }
          //#endregion
    
          const handleCancel = () => {
            // debugger
            sessionStorage.removeItem("quicklinkId")
            window.location.href = `${siteUrl}/SitePages/QuickLinksMaster.aspx`;
          }

          const onSelect = (selectedList:any) => {
            console.log(selectedList , "selectedList");
            setSelectedOption(selectedList);  // Set the selected users
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
                     name:imageVideoFiles[0].name,
                     size:imageVideoFiles[0].size,
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

           //#region deleteLocalFile
const deleteLocalFile = (index: number, filArray: any[],BnnerArr:any[], name: string) => {
  debugger
  //console.log(filArray, 'filArray');

  // Remove the file at the specified index
  BnnerImagepostArr.splice(index, 1);
  //console.log(filArray, 'filArray');

  // Update the state based on the title
  // if (name === "bannerimg") {
    // BnnerImagepostArr[0].files=filArray;
  //   // setBannerImagepostArr([...filArray]);
  BnnerImagepostArr.length > 0 ? "" : setShowModal(false); clearFileInput(name);
  // } else if (name === "Gallery") {
  //   setImagepostArr1([...filArray]);
  //   filArray[0].files.length > 0 ? "" : setShowModal(false); clearFileInput(name);
  // } 
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
          <div style={{marginTop:'2.4rem'}} className="container-fluid  paddb">
            <div style={{paddingLeft:'0.5rem'}} className="row">
              <div className="col-lg-5">
                <CustomBreadcrumb Breadcrumb={Breadcrumb} />
              </div>
            </div>
            <div style={{paddingLeft:'1.3rem', paddingRight:'1.5rem'}} className="row">
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
                      <div className="col-lg-4">
                        <div className="mb-3">
                          <label htmlFor="title" className="form-label">
                            Title <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            id="title"
                            name="Title"
                            placeholder='Enter Title'
                            // className="form-control inputcss"
                            className={`form-control ${(!ValidDraft) ? "border-on-error" : ""} ${(!ValidSubmit) ? "border-on-error" : ""}`}
                            value={formData.Title}
                            onChange={(e) => onChange(e.target.name, e.target.value)}
                           

                          />

                             
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="mb-3">
                          <label htmlFor="URL" className="form-label">
                            URL <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            id="URL"
                            name="URL"
                            placeholder='Enter URL'
                            // className="form-control inputcss"
                            className={`form-control ${(!ValidDraft) ? "border-on-error" : ""} ${(!ValidSubmit) ? "border-on-error" : ""}`}
                            value={formData.URL}
                            onChange={(e) => onChange(e.target.name, e.target.value)}
                           

                          />

                             
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="mb-3">
                          <label htmlFor="EntityId" className="form-label">
                            Department <span className="text-danger">*</span>
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
                      {/*  */}
                      {/* className={`form-label form-control ${!ValidDraft ? "border-on-error" : ""} ${!ValidSubmit ? "border-on-error" : ""}`} */}

                        <div className="col-lg-3">
                          <div className="mb-3">
                            <div className="d-flex justify-content-between">
                              <div>
                                <label
                                  htmlFor="bannerImage"

                                  className="form-label"
                                  >
                                   Image{" "}
                                  <span className="text-danger">*</span>
                                </label>
                              </div>
                              <div>
                                <div>
                                  {
                                    BnnerImagepostArr[0] != false &&
                                      BnnerImagepostArr.length > 0 &&
                                      BnnerImagepostArr != undefined
                                      ? BnnerImagepostArr.length == 1  && (
                                        <a style={{ fontSize: "0.875rem" }} onClick={() => setShowModalFunc(true, "bannerimg")}>
                                          <FontAwesomeIcon
                                            icon={faPaperclip}
                                          />
                                          {BnnerImagepostArr.length} file Attached
                                        </a>
                                      )
                                      : ""
                                    
                                  }
                                </div>
                              </div>
                            </div>
                            <input
                              type="file"
                              id="bannerImage"
                              name="bannerImage"
                              className={`form-control ${(!ValidDraft) ? "border-on-error" : ""} ${(!ValidSubmit) ? "border-on-error" : ""}`}
                              accept="image/*"
                              onChange={(e) =>
                                onFileChange(e, "bannerimg", "Document")
                              }
                            />
                          </div>
                        </div>
                                          {/*  */}
                      <div className="col-lg-4">
                        <div className="mb-3">
                          <label htmlFor="title" className="form-label">
                         Active
                          </label>

                          <input type="checkbox"  id="IsActive"
                            name="IsActive"
                            checked={formData.IsActive}  onChange={(e) =>
                              onChange(e.target.name, e.target.checked.toString())
                            } ></input>
                          

                        </div>
                      </div>

                      <div className="col-lg-4">
                        <div className="mb-3">
                          <label htmlFor="title" className="form-label">
                          Want to Redirect in New Tab ?
                          </label>

                          <input type="checkbox"  id="RedirectTONewTab"
                            name="RedirectTONewTab"
                            checked={formData.RedirectTONewTab}  onChange={(e) =>
                              onChange(e.target.name, e.target.checked.toString())
                            } ></input>
                          

                        </div>
                      </div>

                      {/* <div className="col-lg-4">
                        <div className="mb-3">
                          <label htmlFor="StartDate" className="form-label">
                            Start Date<span className="text-danger">*</span>
                          </label>
                          <input
                            type="date"
                            id="StartDate"
                            name="StartDate"
                            placeholder='Enter Start Date'
                            className={`form-control ${(!ValidDraft) ? "border-on-error" : ""} ${(!ValidSubmit) ? "border-on-error" : ""}`}
                            value={formData.StartDate}
                            
                            onChange={(e) => onChange(e.target.name, e.target.value)}
                            disabled={InputDisabled}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="mb-3">
                          <label htmlFor="EndDate" className="form-label">
                            Finish Date<span className="text-danger">*</span>
                          </label>
                          <input
                            type="date"
                            id="EndDate"
                            name="EndDate"
                            placeholder='Enter End Date'
                            className={`form-control ${(!ValidDraft) ? "border-on-error" : ""} ${(!ValidSubmit) ? "border-on-error" : ""}`}
                            value={formData.EndDate}
                            // value={formData.EventDate}
                            onChange={(e) => onChange(e.target.name, e.target.value)}
                            disabled={InputDisabled}
                          />
                        </div>
                      </div> */}
                      {/* <div className="col-lg-4">
                        <div className="mb-3">
                          <label htmlFor="Type" className="form-label">
                            Status <span className="text-danger">*</span>
                          </label>
                          <select
                            // className="form-select inputcss"
                            id="Status"
                            name="Status"
                            value={formData.Status}
                            onChange={(e) => onChange(e.target.name, e.target.value)}
                            className={`form-control ${(!ValidDraft) ? "border-on-error" : ""} ${(!ValidSubmit) ? "border-on-error" : ""}`}
                            disabled={InputDisabled}
                          >
                            <option >Select</option>
                            {
                              Statusdata.map((item, index) => (
                                <option key={index} value={item.Title}>{item.Title}</option>
                              )
                              )
                            }


                          </select>
                        </div>
                      </div> */}
                      {/* <div className="col-lg-4">
                        <div className="mb-3">
                          <label htmlFor="category" className="form-label">
                            Category <span className="text-danger">*</span>
                          </label>
                          <select
                            // className="form-select inputcss"
                            className={`form-control inputcs ${(!ValidSubmit) ? "border-on-error" : ""}`}
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
                      </div> */}

                      {/* <div className="col-lg-4">
                        <div className="mb-3">
                          <label htmlFor="entity" className="form-label">
                            Entity <span className="text-danger">*</span>
                          </label>
                          <select
                            // className="form-select inputcss"
                            className={`form-control inputcs ${(!ValidSubmit) ? "border-on-error" : ""}`}
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
                      </div> */}
                     

                     


                      {/* <div className="col-lg-12">
                        <div className="mb-3">
                          <label htmlFor="overview" className="form-label">
                            Overview <span className="text-danger">*</span>
                          </label>
                          <textarea
                            className={`form-control inputcss ${(!ValidSubmit) ? "border-on-error" : ""}`}
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
                      </div> */}

                      {/* <div className="col-lg-12">
                        <div className="mb-3">
                          <label htmlFor="description" className="form-label">
                            Description
                            
                          </label>
                          <div style={{ display: "contents", justifyContent: "start" }}>
                            <ReactQuill
                              theme="snow"
                              modules={modules}
                              formats={formats}
                              placeholder={'Write your content ...'}
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
                      </div> */}
                    
                    </form>
                  }
                </div>
              </div>
             
            </div>
            </div>
            

            {
                        !InputDisabled ?
                          (<div className="text-center" style={{ marginTop: '1.5rem' }}>
                            {/* <div className="btn btn-success waves-effect waves-light m-1" style={{ fontSize: '0.875rem' }} onClick={handleSaveAsDraft}>
                              <div className='d-flex' style={{ justifyContent: 'space-around' }}>
                                <img src={require('../../../Assets/ExtraImage/checkcircle.svg')} style={{ width: '1rem' }} alt="Check" /> Save As Draft
                              </div>
                            </div> */}
                            <div className="btn btn-success waves-effect waves-light m-1"  style={{  width: '100px'  }}  onClick={handleFormSubmit}>
                              <div className='d-flex' style={{ justifyContent: 'center' }}>
                                <img src={require('../../../Assets/ExtraImage/checkcircle.svg')} style={{ width: '1rem', marginRight:'5px' }} alt="Check" /> Submit
                              </div>
                            </div>
                            <button type="button" className="btn cancel-btn waves-effect waves-light m-1" style={{  width: '100px'  }} onClick={handleCancel}>
                              <img src={require('../../../Assets/ExtraImage/xIcon.svg')} style={{ width: '1rem', marginRight:'5px' }}
                                className='me-1' alt="x" />
                              Cancel
                            </button>
                          </div>) :
                          (modeValue == 'view') && (<div className="text-center" style={{ width: '100px' }}><button type="button" className="btn cancel-btn waves-effect waves-light m-1"  onClick={handleCancel}>
                            <img src={require('../../../Assets/ExtraImage/xIcon.svg')} style={{ width: '1rem', marginRight:'5px' }}
                              className='me-1' alt="x" />
                            Cancel
                          </button></div>)
                      }

{/*  */}
<Modal show={showModal} onHide={() => setShowModal(false)} size='lg' className="newm" >
              <Modal.Header closeButton>
                { showDocTable && <Modal.Title>Documents</Modal.Title>}
                { showImgModal && <Modal.Title>Gallery Images/Videos</Modal.Title>}
                { showBannerModal && <Modal.Title>Banner Images</Modal.Title>}
              </Modal.Header>
              <Modal.Body className="" id="style-5">
 
              
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
                          {BnnerImagepostArr.length >0 && BnnerImagepostArr.map((file: any, index: number) => (
                            <tr key={index}>
                              <td style={{minWidth:'40px',maxWidth:'40px'}} className='text-center'>{index + 1}</td>
                             <td style={{minWidth:'50px',maxWidth:'50px',textAlign:'center'}} >  <img style={{width:'40px',height:'40px', borderRadius:'1000px'}} src={file.fileUrl?file.fileUrl:`${file.serverRelativeUrl}`} /></td>
                              <td>{file.name}</td>
                              <td style={{minWidth:'40px',maxWidth:'40px'}} className='text-right'>{file.size}</td>
                              <td style={{minWidth:'40px',maxWidth:'40px'}} className='text-center'> <img style={{cursor:'pointer'}} src={require("../../../CustomAsset/del.png")}  onClick={() => deleteLocalFile(index, file.files,BnnerImagepostArr, "bannerimg")} /> </td>
                            </tr>
                          ))}
                        </tbody>
                      </table></>
                  )}
 
              </Modal.Body>
 
            </Modal>
 {/*  */}
          </div>
        </div>
      </div>
     
    </div>
  )
}


const QuickLinkForm: React.FC<IQuickLinkFormProps> = (props) => {
  return (
    <Provider>
      <QuickLinkFormContext props={props} />
    </Provider>
  )
}

export default QuickLinkForm

