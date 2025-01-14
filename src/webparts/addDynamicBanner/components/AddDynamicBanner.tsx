import * as  React from 'react'
import { useMediaQuery } from 'react-responsive';
import Provider from '../../../GlobalContext/provider';
import { IAddDynamicBannerProps } from './IAddDynamicBannerProps';
import { getSP } from '../loc/pnpjsConfig';
import { SPFI } from '@pnp/sp/presets/all';
import UserContext from '../../../GlobalContext/context';
import { allowstringonly, getCurrentUser } from '../../../APISearvice/CustomService';
import { decryptId } from '../../../APISearvice/CryptoService';
import { addItem, getBannerByID, getUrl, updateItem, uploadFile } from '../../../APISearvice/BannerService';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';
import "../../../Assets/Figtree/Figtree-VariableFont_wght.ttf";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../CustomCss/mainCustom.scss";
import "../../verticalSideBar/components/VerticalSidebar.scss";
import VerticalSideBar from '../../verticalSideBar/components/VerticalSideBar';
import CustomBreadcrumb from '../../../CustomJSComponents/CustomBreadcrumb/CustomBreadcrumb';
import "../components/addbanner.scss";
import "../../../CustomJSComponents/CustomForm/CustomForm.scss"
import HorizontalNavbar from '../../horizontalNavBar/components/HorizontalNavBar';
import context from '../../../GlobalContext/context';
import { useRef } from 'react';
import { Modal } from 'react-bootstrap';
const AddDynamicBannerContext = ({ props }: any) => {
  const sp: SPFI = getSP();
  const Spurl = sp.web;
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const { useHide }: any = React.useContext(UserContext);
  console.log('This function is called only once', useHide);
  const elementRef = React.useRef<HTMLDivElement>(null);
  const [currentUser, setCurrentUser] = React.useState(null);
  const [Url, setBaseUrl] = React.useState("");
  const [showModal, setShowModal] = React.useState(false);
  const [editForm, setEditForm] = React.useState(false);
  const [editID, setEditID] = React.useState(null);
  const { setHide }: any = context;
  const siteUrl = props.siteUrl;
  const tenantUrl = props.siteUrl.split("/sites/")[0];
  const [BnnerImagepostArr, setBannerImagepostArr]: any = React.useState();
  const inputFile = useRef(null);
  const [ValidSubmit, setValidSubmit] = React.useState(true);
    const [InputDisabled, setInputDisabled] = React.useState(false);
  const [bannerByIDArr, setBannerByIdArr] = React.useState({
    title: '',
    description: "",
    BannerImage: "",
    IsVedio: "",
    IsImage: "",
    URL: ""
  })
  const [bannerByIDArrs, setBannerByIdArrs] = React.useState([])

  const [showBannerModal, setShowBannerTable] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: '',
    description: "",
    BannerImage: "",
    IsVedio: "",
    IsImage: "",
    URL: "",
    Status:''
  })

     React.useEffect(() => { 
        // alert("useEffect called");
        const currentUrl = window.location.href;
        const urlParams = new URLSearchParams(window.location.search);
        const modeiseditorview = urlParams.get('mode');
        console.log("modeiseditorview value:", modeiseditorview);
        if (modeiseditorview === 'view') {
          // alert(`${typeof(modeiseditorview)} , ${modeiseditorview}`)
          setInputDisabled(true);
        } else {

          console.log("modeiseditorview parameter not found.");
        }
      }, []);

  const validateForm = async () => {
    const { title, URL, description } = formData;

    let valid = true;
    let validatetitlelength = false;
    let validateTitle = false;
    let errormsg = "";
    setValidSubmit(true);
    if (title !== "") {
      validatetitlelength = title.length <= 255;
      validateTitle = title !== "" && await allowstringonly(title);
    }
    if (title !== "" && !validateTitle && validatetitlelength) {
      errormsg = "No special character allowed in Title";
      valid = false;
    } else if (title !== "" && validateTitle && !validatetitlelength) {
      errormsg = "Title must be less than 255 characters";
      valid = false;
    }
    if (!title) {

      valid = false;
    }
    else if (!description) {

      valid = false;
    } else if (BnnerImagepostArr == null || BnnerImagepostArr.length == 0) {

      valid = false;
    }
    setValidSubmit(valid);
    if (!valid)
      Swal.fire(errormsg !== "" ? errormsg : 'Please fill all the mandatory fields.');

    return valid;
  };
  const handleReset = () => {
    if (inputFile.current) {
      inputFile.current.value = "";
      inputFile.current.type = "text";
      inputFile.current.type = "file";
    }
  };

  //#region Breadcrumb
  const Breadcrumb = [
    {
      "MainComponent": "Settings",
      "MainComponentURl": `${siteUrl}/SitePages/Settings.aspx`
    },
    {
      "ChildComponent": "Banner Master",
      "ChildComponentURl": `${siteUrl}/SitePages/BannerMaster.aspx`
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
    setCurrentUser(await getCurrentUser(sp, siteUrl))
    setBaseUrl(await (getUrl(sp)))




    //setBannerByIdArr(bannerByIDArrs)
    //setFormData(bannerByIDArr)
    if (sessionStorage.getItem("bannerId") != undefined) {
      const iD = sessionStorage.getItem("bannerId")
      let iDs = decryptId(iD)
      // const arrrsss = await getBannerByID(sp, iDs)
      // console.log(arrrsss);
      let setBannerById = await getBannerByID(sp, iDs)
      console.log(setBannerById, 'setBannerById');
      setEditID(setBannerById[0].ID)
      if (setBannerById.length > 0) {
        setEditForm(true)
        let arr = {
          title: setBannerById[0].title,
          description: setBannerById[0].description,
          BannerImage: setBannerById[0].BannerImage,
          IsVedio: setBannerById[0].IsVedio,
          IsImage: setBannerById[0].IsImage,
          URL: setBannerById[0].URL,
          Status: setBannerById[0].Status
        }
        let banneimagearr = []
        // banneimagearr = JSON.parse(setBannerById[0].BannerImage)
        banneimagearr = setBannerById[0].BannerImage
        console.log(setBannerById, 'setBannerById', setBannerById[0].BannerImage, banneimagearr);
        setBannerImagepostArr(banneimagearr);
        setFormData(arr)
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
    let arrr: any[] = [];
    event.preventDefault();
    let uloadBannerImageFiles: any[] = [];

    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files);

      if (libraryName === "Gallery" || libraryName === "bannerimg") {
        const imageVideoFiles = files.filter(file =>
          file.type.startsWith('image/')
          //|| file.type.startsWith('video/')
        );

        setBannerImagepostArr(arrr);
        console.log("imageVideoFiles", files, imageVideoFiles, BnnerImagepostArr)
        if (imageVideoFiles.length > 0) {
          const arr = {
            files: imageVideoFiles,
            libraryName: libraryName,
            docLib: docLib
          };

          // console.log(imageVideoFiles, 'imageVideoFiles');
          //  if(BnnerImagepostArr.length>0)
          //  {
          //   let bannerPost={
          //     filename:BnnerImagepostArr[0].Filename,
          //     size:BnnerImagepostArr[0].size,
          //     type:BnnerImagepostArr[0].type
          //   }
          //   uloadBannerImageFiles.push(bannerPost)
          //   let bannerPost1={
          //     filename:imageVideoFiles[0].name,
          //     size:imageVideoFiles[0].size,
          //     type:imageVideoFiles[0].type
          //   }
          //   uloadBannerImageFiles.push(bannerPost1);
          //   setBannerImagepostArr(uloadBannerImageFiles);
          //  }
          //  else{
          //   uloadBannerImageFiles.push(imageVideoFiles[0]);
          //   setBannerImagepostArr(uloadBannerImageFiles);
          //  }
          uloadBannerImageFiles.push(imageVideoFiles[0]);
          setBannerImagepostArr(uloadBannerImageFiles);

        } else {
          handleReset();
          setBannerImagepostArr(arrr);
          Swal.fire("Only image can be uploaded")
        }
      }
    }
  };
  //#endregion

  //#region OpenModal
  const setShowModalFunc = (bol: boolean, name: string) => {
    debugger
    if (name == "bannerimg") {
      setShowModal(bol)
      setShowBannerTable(true)
    }
  }
  //#endregion

  const handleChange = (e: { target: { name: any; value: any; files: any; }; }) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleCancel = () => {
    debugger
    window.location.href = `${siteUrl}/SitePages/BannerMaster.aspx`;
  }
  // Handle form submission
  //#region  Submit Form
  const handleFormSubmit = async () => {

    if (await validateForm()) {
      Swal.fire({
        title: 'Do you want to submit',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        icon: 'warning'
      }
      ).then(async (result) => {
        //console.log("Form Submitted:", formValues, bannerImages, galleryImages, documents);
        if (result.isConfirmed) {
          // Swal.fire("Saved!", "", "success");

          let bannerImageArray: any = [];
          let galleryIds: any[] = [];
          let documentIds: any[] = [];
          let galleryArray: any[] = [];
          let documentArray: any[] = [];

          // formData.FeaturedAnnouncement === "on"?  true :false;

          if (editID) {
            // Upload Banner Images
            // if (BnnerImagepostArr.length > 0) {
            //   for (const file of BnnerImagepostArr) {
            //     if (!file.serverRelativeUrl) {
            //       // const uploadedBanner = await uploadFile(file, sp, "Documents", Url);
            //       bannerImageArray = await uploadFile(file, sp, "Documents", "https://OfficeIndia.sharepoint.com");
            //     }

            //   }
            // }
            if (BnnerImagepostArr.length > 0 && BnnerImagepostArr[0]?.files?.length > 0) {
              for (const file of BnnerImagepostArr[0].files) {
                //  const uploadedBanner = await uploadFile(file, sp, "Documents", Url);
                bannerImageArray = await uploadFile(file, sp, "Documents", siteUrl);
              }
            }
            else if (BnnerImagepostArr.length > 0) {
              bannerImageArray = BnnerImagepostArr[0];
            }
            else {
              bannerImageArray = null
            }
            debugger
            let bannerPost = {}
            if (BnnerImagepostArr.serverRelativeUrl != undefined && BnnerImagepostArr.serverRelativeUrl != null) {
              let bannerPost = {
                filename: BnnerImagepostArr.fileName,
                size: BnnerImagepostArr.size,
                type: BnnerImagepostArr.type
              }
              const jsonString = JSON.stringify(bannerPost)
              // Create Post
              const postPayload = {
                Title: formData.title,
                Description: formData.description,
                IsImage: formData.IsImage === "on" ? true : false,
                // IsVideo: formData.IsVedio === "on"?  true :false,
                URL: formData.URL,
                Status: formData.Status,
                AuthorId: currentUser.Id,
                BannerImage: JSON.stringify(bannerImageArray),
                BannerImageJSON: jsonString
              };
              console.log(postPayload);
              const postResult = await updateItem(postPayload, sp, editID);
              const postId = postResult?.data?.ID;

              if (postResult != null) {
                sessionStorage.removeItem("bannerId")
                window.location.href = `${siteUrl}/SitePages/BannerMaster.aspx`;
              }
            }
            else {
              const postPayload = {
                Title: formData.title,
                Description: formData.description,
                IsImage: formData.IsImage === "on" ? true : false,
                // IsVideo: formData.IsVedio === "on"?  true :false,
                URL: formData.URL,
                Status: formData.Status,
                AuthorId: currentUser.Id,
                BannerImage: JSON.stringify(bannerImageArray),
                // BannerImageJSON: jsonString
              };
              console.log(postPayload);
              const postResult = await updateItem(postPayload, sp, editID);
              const postId = postResult?.data?.ID;
              if (postResult != null) {
                sessionStorage.removeItem("bannerId")
                setTimeout(() => {

                  window.location.href = `${siteUrl}/SitePages/BannerMaster.aspx`;
                }, 2000);

              }
            }
            // let bannerImg =JSON.stringify(BnnerImagepostArr[0])

          }
          else {
            // Upload Banner Images
            // if (BnnerImagepostArr.length > 0) {
            //   for (const file of BnnerImagepostArr) {
            //     // const uploadedBanner = await uploadFile(file, sp, "Documents", Url);
            //     bannerImageArray = await uploadFile(file, sp, "Documents", "https://OfficeIndia.sharepoint.com");
            //   }
            // }
            if (BnnerImagepostArr.length > 0 && BnnerImagepostArr[0]?.files?.length > 0) {
              for (const file of BnnerImagepostArr[0].files) {
                //  const uploadedBanner = await uploadFile(file, sp, "Documents", Url);
                bannerImageArray = await uploadFile(file, sp, "Documents", siteUrl);
              }
            }
            debugger
            let bannerPost = {
              filename: BnnerImagepostArr.name,
              size: BnnerImagepostArr.size,
              type: BnnerImagepostArr.type
            }
            console.log("JSON.stringify(bannerImageArray)",bannerImageArray,
              JSON.stringify(bannerImageArray))
            // let bannerImg =JSON.stringify(BnnerImagepostArr[0])
            const jsonString = JSON.stringify(bannerPost)
            // Create Post
            const postPayload = {
              Title: formData.title,
              Description: formData.description,
              IsImage: formData.IsImage === "on" ? true : false,
              // IsVideo: formData.IsVedio === "on"?  true :false,
              URL: formData.URL,
              Status: "Submitted",
              AuthorId: currentUser.Id,
              BannerImage: JSON.stringify(bannerImageArray),
              BannerImageJSON: jsonString
            };
            console.log(postPayload);
            const postResult = await addItem(postPayload, sp);
            const postId = postResult?.data?.ID;
            if (postResult != null) {
              sessionStorage.removeItem("bannerId")
              setTimeout(() => {
                window.location.href = `${siteUrl}/SitePages/BannerMaster.aspx`;
              }, 2000);

            }
          }
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
        // if(postResult?.data?.ID)
      }).catch(error => {
        Swal.fire("Changes are not saved", "", "info");
      }
      )
    }
  }

  //#endregion
  console.log(bannerByIDArr, 'bannerByID');

  console.log(bannerByIDArrs, 'bannerByIDArrs');
  const flatArray = (arr: any[]): any[] => {
    return arr.reduce((acc, val) => acc.concat(val), []);
  };
  const deleteLocalFile = (index: number, filArray: any[], title: string, name: string) => {
    debugger
    // Remove the file at the specified index
    filArray[0].files.splice(index, 1);

    // Update the state based on the title
    if (name === "bannerimg") {
      setBannerImagepostArr([...filArray]);
      filArray[0].files.length > 0 ? "" : setShowModal(false); clearFileInput(name);
    }
    // Clear the file input

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

  console.log(BnnerImagepostArr, "BnnerImagepostArr");

  return (
    <div id="wrapper" ref={elementRef}>
      <div
        className="app-menu"
        id="myHeader">
        <VerticalSideBar _context={sp} />
      </div>
      <div className="content-page">
        <HorizontalNavbar _context={sp} siteUrl={siteUrl} />
        <div className="content" style={{ marginLeft: `${!useHide ? '240px' : '80px'}` }}>
          <div className="container-fluid  paddb">
            <div className="row">
              <div className="col-lg-3">
                <CustomBreadcrumb Breadcrumb={Breadcrumb} />
              </div>
            </div>
            <div className="card mt-3">
              <div className="card-body">
                <div className="row mt-2">
                  <form className='row' >
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label htmlFor="title" className="form-label">
                          Title <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          placeholder='Enter Title'
                          className={`form-control ${(!ValidSubmit) ? "border-on-error" : ""}`}
                          value={formData.title}
                          onChange={(e) => onChange(e.target.name, e.target.value)} 
                          disabled={InputDisabled}

                          />
                          
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <div className='d-flex justify-content-between'>
                          <div>
                            <label htmlFor="bannerImage" className="form-label">
                              Banner Image <span className="text-danger">*</span>
                            </label>
                          </div>
                          <div>
                            {BnnerImagepostArr != undefined && BnnerImagepostArr.length > 0 ?
                              (<><a style={{ fontSize: '0.875rem' }}>
                                <FontAwesomeIcon icon={faPaperclip} /> 1 file Attached {BnnerImagepostArr[0]?.fieldName}
                              </a>
                                {/* <img src={`${BnnerImagepostArr[0]?.serverUrl + BnnerImagepostArr[0]?.serverRelativeUrl}`} /> */}
                              </>
                              ) : ""


                            }
                            {/* {BnnerImagepostArr!=undefined&& BnnerImagepostArr.length>0&&
                           (<img src={`${BnnerImagepostArr[0].serverUrl +BnnerImagepostArr[0].serverRelativeUrl}`} />)}  */}
                          </div>
                        </div>
                        <input
                          type="file"
                          ref={inputFile}
                          id="bannerImage"
                          name="bannerImage"
                          className={`form-control ${(!ValidSubmit) ? "border-on-error" : ""}`}
                          onChange={(e) => onFileChange(e, "bannerimg", "Document")} 
                          disabled={InputDisabled}
                          />
                          
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="mb-3">
                        <label htmlFor="description" className="form-label">
                          Description <span className="text-danger">*</span>
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          placeholder='Enter description'
                          className={`form-control  ${(!ValidSubmit) ? "border-on-error" : ""}`}
                          style={{ height: '100px' }}
                          value={formData.description}
                          onChange={(e) => onChange(e.target.name, e.target.value)}
                          disabled={InputDisabled}

                          >
                        </textarea>
                      </div>
                    </div>
                    {/* <div className="col-lg-6">
                        <div className="mb-3">
                          <label htmlFor="url" className="form-label">
                            URL <span className="text-danger">*</span>
                          </label>
                          <textarea
                            id="url"
                            name="URL"
                            placeholder='Enter url'
                            className="form-control inputcss"
                            style={{ height: '50px' }}
                            value={formData.URL}
                            onChange={(e) => onChange(e.target.name, e.target.value)}>
                          </textarea>
                        </div>
                      </div> */}
                    {/* {BnnerImagepostArr!=undefined&&BnnerImagepostArr.length>0?
                    (<><div>{BnnerImagepostArr[0].fileName}</div><img src={BnnerImagepostArr[0].fileName} /></>):""} */}
                      <div className="text-center butncss">
                    { InputDisabled == false && (
                    
                                            <div className="btn btn-success waves-effect waves-light m-1" style={{  width: '100px' }} onClick={handleFormSubmit}>
                        <div className='d-flex' style={{ justifyContent: 'center' }}>
                          <img src={require('../../../Assets/ExtraImage/checkcircle.svg')} style={{ width: '1rem' }} alt="Check" /> Submit
                        </div>
                      </div>
                      
             
                    ) }
                      <button type="button" className="btn cancel-btn waves-effect waves-light m-1" style={{ width: '100px' }} onClick={handleCancel}>
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
            {BnnerImagepostArr != undefined && BnnerImagepostArr.length > 0 ?
              <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                  {BnnerImagepostArr.length > 0 && showBannerModal && <Modal.Title>Banner Images</Modal.Title>}
                </Modal.Header>
                <Modal.Body>
                  {BnnerImagepostArr.length > 0 && showBannerModal &&
                    (
                      <>
                        <table className="table table-bordered" style={{ fontSize: '0.75rem' }}>
                          <thead style={{ background: '#eef6f7' }}>
                            <tr>
                              <th>Serial No.</th>
                              <th>File Name</th>
                              {editForm ? "" : <th>File Size</th>}
                              <th className='text-center'>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {editForm ?
                              BnnerImagepostArr.map((file: any, index: number) => (
                                <tr key={index}>
                                  <td className='text-center'>{index + 1}</td>
                                  <td>{file.fileName}</td>
                                  {editForm ? <td className='text-center'> <img src={require("../../../CustomAsset/trashed.svg")} style={{ width: '15px' }} onClick={() => deleteLocalFile(index, BnnerImagepostArr, BnnerImagepostArr[0].docLib, "bannerimg")} /> </td> : <td className='text-center'> <img src={require("../../../CustomAsset/trashed.svg")} style={{ width: '15px' }} onClick={() => deleteLocalFile(index, BnnerImagepostArr, BnnerImagepostArr[0].docLib, "bannerimg")} /> </td>
                                  }
                                </tr>
                              )) : BnnerImagepostArr.map((file: any, index: number) => (
                                <tr key={index}>
                                  <td className='text-center'>{index + 1}</td>
                                  <td>{file.name}</td>
                                  {editForm ? "" : <td className='text-right'>{file.size}</td>}
                                  {editForm ? <td className='text-center'> <img src={require("../../../CustomAsset/trashed.svg")} style={{ width: '15px' }} onClick={() => deleteLocalFile(index, BnnerImagepostArr, BnnerImagepostArr[0].docLib, "bannerimg")} /> </td> : <td className='text-center'> <img src={require("../../../CustomAsset/trashed.svg")} style={{ width: '15px' }} onClick={() => deleteLocalFile(index, BnnerImagepostArr, BnnerImagepostArr[0].docLib, "bannerimg")} /> </td>
                                  }
                                </tr>
                              ))}
                          </tbody>
                        </table></>
                    )}
                </Modal.Body>
              </Modal> : ""
            }
          </div>
        </div>
      </div>
    </div>
  )
};
const AddDynamicBanner: React.FC<IAddDynamicBannerProps> = (props) => {
  return (
    <Provider>
      <AddDynamicBannerContext props={props} />
    </Provider>
  )
}
export default AddDynamicBanner