import * as React from 'react';
import styles from './ArgDelegation.module.scss';
import "../components/argDelegation.scss";
import type { IArgDelegationProps } from './IArgDelegationProps';
import { escape } from '@microsoft/sp-lodash-subset';
import VerticalSideBar from '../../verticalSideBar/components/VerticalSideBar';
import HorizontalNavbar from '../../horizontalNavBar/components/HorizontalNavBar';
import Provider from '../../../GlobalContext/provider';
import CustomBreadcrumb from '../../../CustomJSComponents/CustomBreadcrumb/CustomBreadcrumb';
import { getSP } from '../loc/pnpjsConfig';

import { SPFI } from '@pnp/sp/presets/all';
import UserContext from '../../../GlobalContext/context';
import context from '../../../GlobalContext/context';
import { allowstringonly, getCurrentUser } from '../../../APISearvice/CustomService';
import Multiselect from 'multiselect-react-dropdown';

import "../../../Assets/Figtree/Figtree-VariableFont_wght.ttf";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../CustomCss/mainCustom.scss";
import "../../verticalSideBar/components/VerticalSidebar.scss";
import "../../../CustomJSComponents/CustomForm/CustomForm.scss";
import Select from "react-select";
import { FormSubmissionMode } from '../../../Shared/Interfaces';
import Swal from 'sweetalert2';
import { addItem, getDelegateByID,updateItem } from '../../../APISearvice/DelegateService';
import { decryptId } from '../../../APISearvice/CryptoService';
import { getUrlParameterValue } from '../../../Shared/Helper';

const ArgDelegationContext = ({ props }: any) => {
  const [currentUser, setCurrentUser] = React.useState(null)
  const sp: SPFI = getSP();
  const siteUrl = props.siteUrl;
 
  const { useHide }: any = React.useContext(UserContext);
  const elementRef = React.useRef<HTMLDivElement>(null);
  
  // const tenantUrl = props.siteUrl.split("/sites/")[0];
  const [Loading, setLoading] = React.useState(false);
  const [ValidDraft, setValidDraft] = React.useState(true);
  const [ValidSubmit, setValidSubmit] = React.useState(true);
  const [InputDisabled, setInputDisabled] = React.useState(false);
  const [modeValue, setmode] = React.useState(null);
  const [rows, setRows] = React.useState<any>([]);
  const [selectedOption, setSelectedOption] = React.useState(null);
  const [editForm, setEditForm] = React.useState(false);
   const [FormItemId, setFormItemId] = React.useState(null);
    const [editID, setEditID] = React.useState(null);
  const [formData, setFormData] = React.useState({
    DelegateName: "",
    DelegateNameID:"",
    StartDate: "",
    EndDate: "",
    Status: "",
    ActingFor: ""

  });

  const Statusdata = [
    
    { ID: 1, Title: 'Active' },
    { ID: 2, Title: 'InActive' },
    
  ];
  //#region Breadcrumb
  const Breadcrumb = [
    {
      "MainComponent": "Settings",
      "MainComponentURl": `${siteUrl}/SitePages/Settings.aspx`
    },
    {
      "ChildComponent": "Delegate Form",
      "ChildComponentURl": `${siteUrl}/SitePages/announcementmaster.aspx`
    }
  ]

  
  
    React.useEffect(() => {
     
      ApiCallFunc();



      // formData.title = currentUser.Title;

    }, [useHide]);

    //#endregion
  const ApiCallFunc = async () => {
    // setCurrentUser(await getCurrentUser(sp, siteUrl)) 
    const Currusers :any= await getCurrentUser(sp, siteUrl);
    const users = await sp.web.siteUsers();

    const options = users.map(item => ({
      value: item.Id,
      label: item.Title,
    }));

    setRows(options);
if(Currusers){
  const formobj = {
    DelegateName: Currusers.Title,
    DelegateNameID:Currusers.Id,
    StartDate: "",
    EndDate: "",
    Status: "",
    ActingFor:""

  }
  setFormData(formobj);

}

 let formitemid;
    //#region getdataByID
    if (sessionStorage.getItem("delegateId") != undefined) {
      const iD = sessionStorage.getItem("delegateId")
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


    // /////////////////

     // if (sessionStorage.getItem("announcementId") != undefined) {
        if (formitemid) {
          // const iD = sessionStorage.getItem("announcementId")
          // let iDs = decryptId(iD)
          const setDelegateById = await getDelegateByID(sp, Number(formitemid))
    
          // console.log(setBannerById, 'setBannerById');
          setEditID(Number(setDelegateById[0].ID))
          if (setDelegateById.length > 0) {
            debugger
            setEditForm(true)
            // setCategoryData(await getCategory(sp, Number(setBannerById[0]?.TypeMaster))) // Category
            const startDate = setDelegateById[0].StartDate ?new Date(setDelegateById[0].StartDate).toISOString().split("T")[0]:"";
            const endDate =setDelegateById[0].EndDate? new Date(setDelegateById[0].EndDate).toISOString().split("T")[0]:"";


            let arr = {
           
              StartDate:startDate,
              EndDate: endDate,
              Status: setDelegateById[0].Status,
              DelegateNameID: setDelegateById[0].DelegateName?.ID,

              DelegateName: setDelegateById[0].DelegateName.Title,
              ActingFor: setDelegateById[0].ActingFor

            }
            var obj ={label:setDelegateById[0].ActingFor?.Title,
              value:setDelegateById[0].ActingFor?.ID
            };
            setSelectedOption(obj);
            
              setFormData(arr)
    
              // setFormData((prevValues) => ({
              //   ...prevValues,
              //   [FeaturedAnnouncement]: setBannerById[0].FeaturedAnnouncement === "on" ? true : false, // Ensure the correct boolean value is set for checkboxes
              // }));
    
            }
            
    
          }
        }
        //#endregion

    // /////////////////
   
 
  // }



     const validateForm = async (fmode: FormSubmissionMode) => {
        const { DelegateName,DelegateNameID, StartDate, EndDate, Status, ActingFor } = formData;
        // const { description } = richTextValues;
        let valid = true;
        let validateOverview:boolean = false;
        let validatetitlelength = false;
        let validateTitle = false;
        setValidDraft(true);
        setValidSubmit(true);
        if (DelegateName!== "") {
         validatetitlelength = DelegateName.length <= 255;
          validateTitle = DelegateName !== "" && await allowstringonly(DelegateName);
        }
        if (EndDate !==""){
          validateOverview = EndDate! == "" && await allowstringonly(EndDate);
        }

         if (fmode == FormSubmissionMode.SUBMIT) {
              if (!DelegateNameID) {
                //Swal.fire('Error', 'Title is required!', 'error');
                valid = false;
              } else if (!Status) {
                //Swal.fire('Error', 'Type is required!', 'error');
                valid = false;
              } else if (!StartDate) {
                //Swal.fire('Error', 'Category is required!', 'error');
                valid = false;
              } else if (!EndDate) {
                //Swal.fire('Error', 'Entity is required!', 'error');
                valid = false;
              } else if (!selectedOption) {
                //Swal.fire('Error', 'Entity is required!', 'error');
                valid = false;
              }
             
              setValidSubmit(valid);
        
            }
             if (!valid && fmode == FormSubmissionMode.SUBMIT)
                  Swal.fire('Please fill all the mandatory fields.');
                // else if (!valid && fmode == FormSubmissionMode.DRAFT) {
                //   Swal.fire('Please fill the mandatory fields for draft - Title and Type');
                // }
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
                const postPayload = {
                  DelegateNameId: Number(formData.DelegateNameID),
                  ActingForId: Number(selectedOption.value),
                  Status: formData.Status,
                  StartDate: formData.StartDate,                 
                  EndDate: formData.EndDate,
                };
                //   console.log(postPayload);
    
                  const postResult = await updateItem(postPayload, sp, editID);
                  // const postId = postResult?.data?.ID;
                  // // debugger
                  // if (!postId) {
                  //   console.error("Post creation failed.");
                  //   return;
                  // }
    
    
                  setLoading(false);
                  Swal.fire('Updated successfully.', '', 'success');
                  sessionStorage.removeItem("delegateId")
                  setTimeout(() => {
                    window.location.href = `${siteUrl}/SitePages/DelegateMaster.aspx`;
                  }, 500);
    
                // }              
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
              
              //   // Create Post
              const postPayload = {
                DelegateNameId: Number(formData.DelegateNameID),
                ActingForId: Number(selectedOption.value),
                Status: formData.Status,
                StartDate: formData.StartDate,                 
                EndDate: formData.EndDate,
              };
                // console.log(postPayload);
    
                const postResult = await addItem(postPayload, sp);
                const postId = postResult?.data?.ID;
              //   debugger
              //   if (!postId) {
              //     console.error("Post creation failed.");
              //     return;
              //   }
    
                   setLoading(false);
                  Swal.fire('Submitted successfully.', '', 'success');
              
                  setTimeout(() => {
                    window.location.href = `${siteUrl}/SitePages/DelegateMaster.aspx`;
                  }, 500);
                // }
    
               }
            })
    
          }
        }
    
      }
      //#endregion

      const handleCancel = () => {
        // debugger
        sessionStorage.removeItem("delegateId")
        window.location.href = `${siteUrl}/SitePages/DelegateMaster.aspx`;
      }


  //#region onChange
    const onChange = async (name: string, value: string) => {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
  
      if (name == "Type") {
        // setCategoryData(await getCategory(sp, Number(value))) // Category
      }
      if (name == "entity") {
        //ARGApprovalConfiguration
        // const rowData: any[] = await getApprovalConfiguration(sp, Number(value)) //baseUrl
        // const initialRows = rowData.map((item: any) => ({
        //   id: item.Id,
        //   Level: item.Level.Level,
        //   LevelId: item.LevelId,
        //   approvedUserListupdate: item.Users.map((user: any) => ({
        //     id: user.ID,
        //     name: user.Title,
        //     email: user.EMail
        //   })),
        //   selectionType: 'All' // default selection type, if any
        // }));
        // setRows(initialRows);
      }
    };
    //#endregion

    const handleUserSelect = (selectedUsers: any, rowId: any) => {
      setRows((prevRows: any) =>
        prevRows.map((row: any) =>
          row.id === rowId
            ? { ...row, approvedUserListupdate: selectedUsers }
            : row
        )
      );
    };

    const onSelect = (selectedList:any) => {
      console.log(selectedList , "selectedList");
      setSelectedOption(selectedList);  // Set the selected users
    };


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
                    <form className='row' >
                      <div className="col-lg-4">
                        <div className="mb-3">
                          <label htmlFor="title" className="form-label">
                            Delegate Name <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            id="title"
                            name="title"
                            placeholder='Enter Title'
                            // className="form-control inputcss"
                            className={`form-control inputcs ${(!ValidDraft) ? "border-on-error" : ""} ${(!ValidSubmit) ? "border-on-error" : ""}`}
                            value={formData.DelegateName}
                            onChange={(e) => onChange(e.target.name, e.target.value)}
                            disabled={true}

                          />

                             
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="mb-3">
                          <label htmlFor="title" className="form-label">
                            Acting For <span className="text-danger">*</span>
                          </label>
                          {/* <input
                            type="text"
                            id="title"
                            name="title"
                            placeholder='Enter Title'
                            // className="form-control inputcss"
                            className={`form-control inputcs ${(!ValidDraft) ? "border-on-error" : ""} ${(!ValidSubmit) ? "border-on-error" : ""}`}
                            value={formData.title}
                            onChange={(e) => onChange(e.target.name, e.target.value)}
                            disabled={InputDisabled}

                          /> */}

                             {/* <Multiselect
                                options={rows.approvedUserList}
                                selectedValues={rows.approvedUserListupdate}
                                onSelect={(selected) => handleUserSelect(selected, rows.id)}
                                onRemove={(selected) => handleUserSelect(selected, rows.id)}
                                displayValue="name"
                                disable={true}
                                placeholder=''
                                hidePlaceholder={true}
                              /> */}
                          <Select
                            options={rows}
                            value={selectedOption}
                            name="rows"
                            className={`form-control inputcs ${(!ValidDraft) ? "border-on-error" : ""} ${(!ValidSubmit) ? "border-on-error" : ""}`}
                            onChange={(selectedOption:any) => onSelect(selectedOption)}
                            placeholder="Select"
                          />

                        </div>
                      </div>

                      <div className="col-lg-4">
                        <div className="mb-3">
                          <label htmlFor="StartDate" className="form-label">
                            Start Date<span className="text-danger">*</span>
                          </label>
                          <input
                            type="date"
                            id="StartDate"
                            name="StartDate"
                            placeholder='Enter Start Date'
                            className={`form-control inputcs ${(!ValidDraft) ? "border-on-error" : ""} ${(!ValidSubmit) ? "border-on-error" : ""}`}
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
                            className={`form-control inputcs ${(!ValidDraft) ? "border-on-error" : ""} ${(!ValidSubmit) ? "border-on-error" : ""}`}
                            value={formData.EndDate}
                            // value={formData.EventDate}
                            onChange={(e) => onChange(e.target.name, e.target.value)}
                            disabled={InputDisabled}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4">
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
                            className={`form-control inputcs ${(!ValidDraft) ? "border-on-error" : ""} ${(!ValidSubmit) ? "border-on-error" : ""}`}
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
                      </div>
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
                      {
                        !InputDisabled ?
                          (<div className="text-center" style={{ marginTop: '3rem' }}>
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
                            <button type="button" className="btn btn-light waves-effect waves-light m-1" style={{ fontSize: '0.875rem' }} onClick={handleCancel}>
                              <img src={require('../../../Assets/ExtraImage/xIcon.svg')} style={{ width: '1rem' }}
                                className='me-1' alt="x" />
                              Cancel
                            </button>
                          </div>) :
                          (modeValue == 'view') && (<div className="text-center" style={{ marginTop: '3rem' }}><button type="button" className="btn btn-light waves-effect waves-light m-1" style={{ fontSize: '0.875rem' }} onClick={handleCancel}>
                            <img src={require('../../../Assets/ExtraImage/xIcon.svg')} style={{ width: '1rem' }}
                              className='me-1' alt="x" />
                            Cancel
                          </button></div>)
                      }
                    </form>
                  }
                </div>
              </div>
            </div>
            


          </div>
        </div>
      </div>
    </div>
  )
}


const ArgDelegation: React.FC<IArgDelegationProps> = (props) => {
  return (
    <Provider>
      <ArgDelegationContext props={props} />
    </Provider>
  )
}

export default ArgDelegation