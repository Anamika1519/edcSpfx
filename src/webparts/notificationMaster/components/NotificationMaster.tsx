import * as React from 'react'
import Provider from '../../../GlobalContext/provider';
import { INotificationMasterProps } from './INotificationMasterProps';
import VerticalSideBar from '../../verticalSideBar/components/VerticalSideBar';
import "../../verticalSideBar/components/VerticalSidebar.scss";
import { getSP } from '../loc/pnpjsConfig';
import HorizontalNavbar from '../../horizontalNavBar/components/HorizontalNavBar';
import CustomBreadcrumb from '../../../CustomJSComponents/CustomBreadcrumb/CustomBreadcrumb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEllipsisV, faFileExport, faPlusCircle, faSort } from '@fortawesome/free-solid-svg-icons';
import { faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../CustomCss/mainCustom.scss";
import UserContext from '../../../GlobalContext/context';
import "../components/notificationmaster.scss";

import { getAllNotificationConfigMaster,getAllModuleListMaster,updateItem,addItem } from "../../../APISearvice/ManageNotification";
var UserNotificationConfigArr: any[]=[];
const NotificationMastercontext = ({ props }: any) => {
  const elementRef = React.useRef<HTMLDivElement>(null);
  const { useHide }: any = React.useContext(UserContext);
  
  
  const siteUrl = props.siteUrl;
  const [NotificationConfigData, setNotificationConfig] = React.useState([]);
  const [UserNotificationHistory, setUserNotificationConfig] = React.useState([]);
  const sp = getSP();
  console.log("spUserContext:",sp);
  

  // const currentUser = await sp.web.currentUser();

   //#region Breadcrumb
   const Breadcrumb = [
    {
      "MainComponent": "Home",
      "MainComponentURl": `${siteUrl}/SitePages/Dashboard.aspx`
    },
    {
      "ChildComponent": "Manage Notification",
      "ChildComponentURl": `${siteUrl}/SitePages/ManageNotification.aspx`
    }
  ]
  //#endregion

  const TypeData = [
    { id: 'Active', name: 'Active' },
    { id: 'InActive', name: 'InActive' },
  ];

  const ApiCall = async () => {
    UserNotificationConfigArr =[];
    const currentUser = (await sp.web.currentUser()).Id;
    const NotificationConfigArr1 = await getAllNotificationConfigMaster(sp,currentUser);
    UserNotificationConfigArr = NotificationConfigArr1;
    setUserNotificationConfig(NotificationConfigArr1);
    const NotificationConfigArr = await getAllModuleListMaster(sp);

    const updatedNotificationConfigArr = NotificationConfigArr.map((module) => {
      const matchingConfig = NotificationConfigArr1.find(
        (config) => config.Modules.ModuleName === module.ModuleName
      );
      if (matchingConfig) {
        return {
          ...module,
          Status: matchingConfig.Notifications, // Add Status key with notifications value
        };
      }
      return module;
    });
    // setNotificationConfig(NotificationConfigArr);
    setNotificationConfig(updatedNotificationConfigArr);
   
    // console.log("NotificationConfig:",NotificationConfigArr);

  };

  const onChangeSetStatus = async (name: string, value: string,mId:number,MName:string,evt:any) => {
    // console.log(`${name}: ${value}`);
    // console.log(evt);
    const currentUser = (await sp.web.currentUser()).Id;
    const postPayload = {
      Notifications: value,
     
      UserNameId: currentUser,
      ModulesId: Number(mId),
     
    };

    const matchingRecord = UserNotificationConfigArr.find(
      (item) =>
        item.Modules?.ID === mId && item.UserName?.Id === currentUser
    );
  
    // Check if a matching record is found
    if (matchingRecord) {
     
      // console.log(postPayload);
  
      const updateResult = await updateItem(postPayload, sp, matchingRecord.ID);
      // const postId = postResult?.data?.ID;
      // debugger
      // if (!postId) {
      //   console.error("Post creation failed.");
      //   return;
      // }
      // else{
        ApiCall();
      // }
    } else {
    
      // console.log(postPayload);
  
      const postResult = await addItem(postPayload, sp);
      const postId = postResult?.data?.ID;
      debugger
      if (!postId) {
        console.error("Post creation failed.");
        return;
      }
      else{
        ApiCall();
      }
    }


  };



  
  React.useEffect(() => {

    ApiCall();

  }, [useHide]);


  return (
    <div id="wrapper" ref={elementRef}>
      <div
        className="app-menu"
        id="myHeader">
        <VerticalSideBar _context={sp} />
      </div>

      <div className="content-page">

      <HorizontalNavbar _context={sp} siteUrl={siteUrl} />

            <div className="content" style={{
            marginLeft: `${!useHide ? "240px" : "80px"}`,
            marginTop: "2rem",
          }}>

                {/* <!-- Start Content--> */}
                <div className="container-fluid paddb">

                    {/* <!-- start page title --> */}
          <div className="row">
              <div className="col-lg-3">
                <CustomBreadcrumb Breadcrumb={Breadcrumb} />
              </div>
              {/* <div className="col-lg-7">
                <div className="d-flex flex-wrap align-items-center justify-content-end mt-3">
                  <div className="d-flex flex-wrap align-items-center justify-content-start">
                    <a href={`${siteUrl}/SitePages/settings.aspx`}>
                      <button type="button" className="btn btn-secondary me-1 waves-effect waves-light">
                        <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                        Back
                      </button>
                    </a> 
                     <a onClick={() => GotoAdd(`${siteUrl}/SitePages/MediaGalleryForm.aspx`)} >
                      <button type="button" className="btn btn-primary waves-effect waves-light" style={{ background: '#1fb0e5' }}>
                        <FontAwesomeIcon icon={faPlusCircle} className="me-1" />
                        Add
                      </button>
                    </a>
                  </div>
                </div>
              </div> */}
            </div>
                    
                   
                    <div className="tab-content mt-3">
              

                    <div className="tab-pane show active" id="profile1" role="tabpanel">
                       
                        <div className="card">
                            <div className="card-body">
                           

                                <div id="cardCollpase4" className="collapse show">
                                    <div className="table-responsive pt-0">
                                        <table className="mtable table-centered table-nowrap table-borderless mb-0">
                                            <thead>
                                                <tr>
                                                <th style={{ borderBottomLeftRadius: '0px', minWidth: '50px', maxWidth: '50px',  }}>  S.No.</th>
                                                    <th >Module</th>
                                                  
                                                    <th style={{borderBottomLeftRadius: '0px', minWidth: '150px', maxWidth: '150px'}}>Status</th>
                                                
                                                </tr>
                                            </thead>
                                            <tbody style={{maxHeight: '5000px'}}>
                                                
                            {NotificationConfigData.length === 0 ? (

                              <tr>

                                <td colSpan={7} style={{ textAlign: "center" }}>

                                  No results found

                                </td>

                              </tr>

                            ) : (
                              NotificationConfigData.map((item, index1) => (
                                <tr>
                                  <td style={{ minWidth: '50px', maxWidth:'50px' }}> <span className='indexdesign'>{index1 +1} </span> </td>
                                  <td>{item.ModuleName}
                                  </td>

                                  <td style={{minWidth: '150px', maxWidth:'150px' }}>
                                    

                        <select
                          className="form-select inputcss"
                         
                          
                          value={item.Status}
                          
                          onChange={(e) => onChangeSetStatus(e.target.name, e.target.value,item.ID,item.ModuleName,e.target)}
                        >
                          <option selected disabled>Select</option>
                          {
                            TypeData.map((opt, index) => (
                              <option key={index} value={opt.id}>{opt.name}</option>
                            )
                            )
                          }


                        </select>

                                  </td>

                                </tr>
                              ))
                            )}

                                            </tbody>
                                        </table>
                                     
                                    </div> 
                                </div> 
                            </div> 
                        </div>
                    


                       
                    </div></div>
              
                </div> 

            </div> 

        </div>

      {/* //////////////// */}
      
    </div>
  )
}

const NotificationMaster: React.FC<INotificationMasterProps> = (props) => (
  <Provider>
    <NotificationMastercontext props={props} />
  </Provider>
);

export default NotificationMaster;