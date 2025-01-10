import * as React from 'react'
import { useMediaQuery } from 'react-responsive';
import UserContext from '../../../GlobalContext/context';
import "../../../Assets/Figtree/Figtree-VariableFont_wght.ttf"
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../CustomCss/mainCustom.scss";
import "../../verticalSideBar/components/VerticalSidebar.scss"
import { DeletemediaAPI, getMedia } from "../../../APISearvice/MediaService";
import "@pnp/sp/webs";
import "@pnp/sp/folders";
import "@pnp/sp/files";
import "@pnp/sp/sites"
import "@pnp/sp/presets/all"
import "@pnp/sp/site-groups";
import "../components/mediamaster.scss"
import { getSP } from '../loc/pnpjsConfig';
import { encryptId } from '../../../APISearvice/CryptoService';
import Swal from 'sweetalert2';
import VerticalSideBar from '../../verticalSideBar/components/VerticalSideBar';
import CustomBreadcrumb from '../../../CustomJSComponents/CustomBreadcrumb/CustomBreadcrumb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEllipsisV, faFileExport, faPlusCircle, faSort } from '@fortawesome/free-solid-svg-icons';
import { faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { IMediaMasterProps } from './IMediaMasterProps';
import Provider from '../../../GlobalContext/provider';
import "../../../CustomJSComponents/CustomTable/CustomTable.scss";
import * as XLSX from 'xlsx';
import moment from 'moment';
import HorizontalNavbar from '../../horizontalNavBar/components/HorizontalNavBar';
const MediaMastercontext = ({ props }: any) => {
  const sp = getSP();
  const { useHide }: any = React.useContext(UserContext);
  const context = React.useContext(UserContext);
  const { setUseId, useId }: any = context;
  const elementRef = React.useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [mediaData, setmediaData] = React.useState([]);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const { setHide }: any = context;
  const [filters, setFilters] = React.useState({
    SNo: '',
    Title: '',
    Overview: '',
    Entity: '',
    Status: '',
    SubmittedDate: ''
  });
  const [sortConfig, setSortConfig] = React.useState({ key: '', direction: 'ascending' });

  const [isIntranetAdmin,setIsIntranetAdmin]=React.useState(false);
  let superA=false;
  let IntranetSuperAdmin:any[];
  const currentUserEmailRef = React.useRef('');
	  React.useEffect(() => {
    getcurrentuseremail();
  }, []);
	const getcurrentuseremail = async()=>{
      const userdata = await sp.web.currentUser();
      currentUserEmailRef.current = userdata.Email;
      getDetailsOfIntranetAdmin();

    }
   const getDetailsOfIntranetAdmin=async()=>{
      try {
          const usersFromDMSIntranetAdmin = await sp.web.siteGroups.getByName('IntranetAdmin').users();
          IntranetSuperAdmin=usersFromDMSIntranetAdmin;
          usersFromDMSIntranetAdmin.forEach((user)=>{
              if(user.Email === currentUserEmailRef.current){
                superA=true;
                setIsIntranetAdmin(true);
                // alert(`current user is intranet super admin ${currentUserEmailRef.current , user.Email }`)
                // setToggleManagePermission('Yes');
              }
          })
          console.log("usersFromIntranetAdmin",usersFromDMSIntranetAdmin);
      } catch (error) {
        console.log("error in getting the details of super admin",error);
      }
    }





  const ApiCall = async () => {
    let mediaArr:any[] = [];
    const userGroups = await sp.web.currentUser.groups();
    let groupTitles: string[] = userGroups.map((group) => group.Title.toLowerCase());
    
    if (groupTitles.includes("intranetadmin")) {
       mediaArr = await getMedia(sp,"yes");
    }
    else if (groupTitles.includes("intranetcontentcontributor")){
       mediaArr = await getMedia(sp,"No");
    }
   
    setmediaData(mediaArr);
  };
 
  React.useEffect(() => {
    // Usage
    ApiCall();
 
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
 
  const handleSidebarToggle = (bol: boolean) => {
    setIsSidebarOpen((prevState) => !prevState);
    useHide(!bol);
    document.querySelector(".sidebar")?.classList.toggle("close");
  };
 
  // const [currentPage, setCurrentPage] = React.useState(1);
  // const itemsPerPage = 10;
  // const totalPages = Math.ceil(mediaData.length / itemsPerPage);
 
  // const handlePageChange = (pageNumber: any) => {
  //   if (pageNumber > 0 && pageNumber <= totalPages) {
  //     setCurrentPage(pageNumber);
  //   }
  // };
 
  // const startIndex = (currentPage - 1) * itemsPerPage;
  // const endIndex = startIndex + itemsPerPage;
  // const currentData = mediaData.slice(startIndex, endIndex);
  // console.log(currentData, 'currentData');
 
  const siteUrl = props.siteUrl
  const headers = [
    { label: 'S.No.', key: 'ID', style: { width: '5%' } },
    { label: 'Title', key: 'Title', style: { width: '20%' } },
    { label: 'Image', key: 'mediaandNewsBannerImage', type: 'image', style: { width: '10%' } },
    { label: 'Description', key: 'Description', style: { width: '50%' } },
    { label: 'Date', key: 'SubmittedDate', style: { width: '15%' } },
    { label: 'Action', key: 'Action', style: { width: '15%' } },
 
  ];
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setFilters({
      ...filters,
      [field]: e.target.value,
    });
  };
 
  const handleSortChange = (key: string) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  const applyFiltersAndSorting = (data: any[]) => {
    debugger
    // Filter data
    const filteredData = data.filter((item, index) => {
      return (
        (filters.SNo === '' || String(index + 1).includes(filters.SNo)) &&
        (filters.Title === '' || item.Title && item.Title.toLowerCase().includes(filters.Title.toLowerCase())) &&
        (filters.Entity === '' || item.EntityMaster && item.EntityMaster.Entity.toLowerCase().includes(filters?.Entity?.toLowerCase())) &&
        (filters?.Status === '' || item?.Status?.toLowerCase().includes(filters?.Status?.toLowerCase())) &&
        (filters.SubmittedDate === '' || item.Created.toLowerCase().includes(filters?.SubmittedDate?.toLowerCase()))
      );
    });
    const sortedData = filteredData.sort((a, b) => {
      if (sortConfig.key === 'SNo') {
        // Sort by index
        const aIndex = data.indexOf(a);
        const bIndex = data.indexOf(b);
 
        return sortConfig.direction === 'ascending' ? aIndex - bIndex : bIndex - aIndex;
      } else if (sortConfig.key) {
        // Sort by other keys
        const aValue = a[sortConfig.key] ? a[sortConfig.key].toLowerCase() : '';
        const bValue = b[sortConfig.key] ? b[sortConfig.key].toLowerCase() : '';
 
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
      }
      return 0;
    });
    return sortedData;
  };
 
  const filteredAnnouncementData = applyFiltersAndSorting(mediaData);
 
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredAnnouncementData.length / itemsPerPage);
 
  const handlePageChange = (pageNumber: any) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
 
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredAnnouncementData.slice(startIndex, endIndex);
 
 
  //#region Download exl file
  const handleExportClick = () => {
    console.log(currentData, 'currentData');
 
    const exportData = mediaData.map((item, index) => ({
      'S.No.': startIndex + index + 1,
      'Title': item.Title,
      'Entity': item?.EntityMaster?.Entity,
      'Status': item.Status,
      'Submitted Date': item.Created,
    }));
 
    exportToExcel(exportData, 'MeadiaGallery');
  };
  const exportToExcel = (data: any[], fileName: string) => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };
  //#endregion
  //#region Breadcrumb
  const Breadcrumb = [
    {
      "MainComponent": "Settings",
      "MainComponentURl": `${siteUrl}/SitePages/Settings.aspx`
     },
    {
      "ChildComponent": "Media Master",
      "ChildComponentURl": `${siteUrl}/SitePages/MediaGalleryMaster.aspx`
    }
  ]
  //#endregion
 
 
  //#region
  const Editmedia = (id: any , superadminedit:any
  ) => {
    debugger
    // setUseId(id)
 
    const encryptedId = encryptId(String(id));
    sessionStorage.setItem("mediaId", encryptedId)
    window.location.href = `${siteUrl}/SitePages/MediaGalleryForm.aspx?superadminedit=${superadminedit}`;
  }
  //#endregion
 

  const ViewFormReadOnly = (id: any) => {
    // debugger
    // setUseId(id)
    const encryptedId = encryptId(String(id));
    sessionStorage.setItem("mediaId", encryptedId)
    window.location.href = `${siteUrl}/SitePages/MediaGalleryForm.aspx?mode=view`;
  }

  //#region
  const Deletemedia = (id: any) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        const DeleteRes = DeletemediaAPI(sp, id)
        ApiCall()
        Swal.fire({
          title: "Deleted!",
          text: "Item has been deleted.",
          icon: "success"
        })
        // .then(async res => {
        //   setmediaData(await getMedia(sp));
        // }
        // ).catch(async err => {
        //   setmediaData(await getMedia(sp));
        // }
        //)
 
      }
    })
  }
  const GotoAdd = (url: string) => {
    sessionStorage.removeItem("mediaId")
    window.location.href = url
  }
  const [isOpen, setIsOpen] = React.useState(false);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
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
        <div className="content" style={{ marginLeft: `${!useHide ? '240px' : '80px'}`}}>
          <div className="container-fluid  paddb">
            <div className="row pt-0">
              <div className="col-lg-3">
                <CustomBreadcrumb Breadcrumb={Breadcrumb} />
              </div>
              <div className="col-lg-9">
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
              </div>
            </div>
            <div className="card cardCss mt-4 mb-0">
              <div className="card-body">
                <div id="cardCollpase4" className="collapse show">
                  <div className="table-responsive pt-0">
                    <table className="mtbalenew mt-0 pt-0 table-centered table-nowrap table-borderless mb-0">
                      <thead>
                        <tr>
                          <th style={{ borderBottomLeftRadius: '0px', minWidth: '0px', maxWidth: '50px', borderTopLeftRadius: '0px' }}>
 
                            <div className="d-flex pb-2"
                              style={{ justifyContent: 'space-evenly' }}>
                              <span>S.No.</span>
                              <span onClick={() => handleSortChange('SNo')}>
                                <FontAwesomeIcon icon={faSort} />
                              </span>
                            </div>
                            <div className="bd-highlight">
                              <input
                                type="text"
                                placeholder="index"
                                onChange={(e) => handleFilterChange(e, 'SNo')}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault(); // Prevents the new line in textarea
                                  }
                                }}
                                className="inputcss"
                                style={{ width: '100%' }}
                              />
                            </div>
                          </th>
                          <th  style={{
                                    minWidth: "110px",
                                    maxWidth: "110px",
                                  }}><div className="d-flex flex-column bd-highlight ">
                            <div className="d-flex pb-2" style={{ justifyContent: 'space-evenly' }}>
                              <span >Title</span>  <span onClick={() => handleSortChange('Title')}><FontAwesomeIcon icon={faSort} /> </span></div>
                            <div className=" bd-highlight">
                              <input type="text" placeholder="Filter by Title" onChange={(e) => handleFilterChange(e, 'Title')}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                      e.preventDefault(); // Prevents the new line in textarea
                                    }
                                  }}
                                className='inputcss' style={{ width: '100%' }} />
                            </div>
                          </div></th>
                          <th style={{
                                    minWidth: "110px",
                                    maxWidth: "110px",
                                  }}>
                            <div className="d-flex flex-column bd-highlight ">
                              <div className="d-flex pb-2" style={{ justifyContent: 'space-evenly' }}>
                                <span >Entity</span>  <span onClick={() => handleSortChange('Entity')}><FontAwesomeIcon icon={faSort} /> </span></div>
                              <div className=" bd-highlight">
                                <input type="text" placeholder="Filter by Entity" onChange={(e) => handleFilterChange(e, 'Entity')}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault(); // Prevents the new line in textarea
                                      }
                                    }}
                                  className='inputcss' style={{ width: '100%' }} />
                              </div>
                            </div>
                          </th>
                          <th style={{
                                    minWidth: "60px",
                                    maxWidth: "60px",
                                  }}>
                            <div className="d-flex flex-column bd-highlight ">
                              <div className="d-flex pb-2" style={{ justifyContent: 'space-evenly' }}>
                                <span >Status</span>  <span onClick={() => handleSortChange('Status')}><FontAwesomeIcon icon={faSort} /> </span></div>
                              <div className=" bd-highlight">
                                <input type="text" placeholder="Filter by Status" onChange={(e) => handleFilterChange(e, 'Status')}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault(); // Prevents the new line in textarea
                                      }
                                    }}
                                  className='inputcss' style={{ width: '100%' }} />
                              </div>
                            </div>
                          </th>
                          <th style={{ minWidth: '60px', maxWidth: '60px' }}><div className="d-flex flex-column bd-highlight ">
                            <div className="d-flex pb-2" style={{ justifyContent: 'space-evenly' }}>
                              <span >SubmittedDate</span>  <span onClick={() => handleSortChange('SubmittedDate')}><FontAwesomeIcon icon={faSort} /> </span></div>
                            <div className=" bd-highlight">
                              <input type="text" placeholder="Filter by Date" onChange={(e) => handleFilterChange(e, 'SubmittedDate')}
                                 onKeyDown={(e) => {
                                  if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault(); // Prevents the new line in textarea
                                  }
                                }}
                               className='inputcss' style={{ width: '100%' }} />
                            </div>
                          </div></th>
                          <th style={{ textAlign: 'center', minWidth:'50px', maxWidth:'50px' }}>
                            <div className="d-flex flex-column bd-highlight pb-2">
                              <div className="d-flex  pb-0" style={{ justifyContent: 'space-evenly' }}>  <span >Action</span> <div className="dropdown">
                                <FontAwesomeIcon style={{top:'4px'}} icon={faEllipsisV} onClick={toggleDropdown} size='xl' />
                              </div>
                              </div>
                              {/* <div className=" bd-highlight">   <div id="myDropdown" className={`dropdown-content ${isOpen ? 'show' : ''}`}>
                                <div onClick={handleExportClick} className="" >
                                  <FontAwesomeIcon icon={faFileExport} />  Export
                                </div>
                              </div></div> */}
 
                            </div>
                            <div style={{ height: '32px' }}></div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentData.length > 0
                          ? currentData.map((item, index) => {
                            const ImageUrl =
                              item.Image == undefined || item.Image == null
                                ? ""
                                : JSON.parse(item.Image);
                            return (
                              <tr key={index}>
                                <td
                                  style={{
                                    minWidth: "50px",
                                    maxWidth: "50px",
                                  }}
                                >
                               <div style={{marginLeft:'28px'}} className='indexdesign'> {startIndex + index + 1}</div>     
                                </td>
                                <td style={{
                                    minWidth: "110px",
                                    maxWidth: "110px",
                                  }}>{item.Title}</td>
                                <td style={{
                                    minWidth: "110px",
                                    maxWidth: "110px",
                                  }}>{item?.EntityMaster?.Entity}</td>
                                <td   style={{
                                    minWidth: "60px",
                                    maxWidth: "60px",textAlign:'center'
                                  }}><div className='btn btn-status'> {item.Status}</div></td>
                                <td
                                  style={{
                                    minWidth: "60px",
                                    maxWidth: "60px", textAlign:'center'
                                  }}
                                >
                                  <div className='btn  btn-light'>
                                  {moment(item.Created).format("L")}</div>
                                </td>
                                <td
                                  style={{
                                    minWidth: "50px",
                                    maxWidth: "50px",textAlign:'center'
                                  }}
                                  className="ng-binding"
                                >
                                  <div
                                    className="d-flex pb-0"
                                    style={{ justifyContent: "center", gap:'3px' }}
                                  >
                                    {/* Conditionally render the edit button based on status */}
                                    {
                                      isIntranetAdmin ? (
                                        <div>
                                      <span>
                                          {/* <a
                                            className={`action-icon ${item.Status === "Save as draft"
                                                ? "text-primary"
                                                : "text-muted"
                                              }`
                                            }
                                            onClick={
                                              item.Status === "Save as draft"
                                                ? () => Editmedia(item.ID)
                                                :  () => ViewFormReadOnly(item.ID)
                                            }
                                            style={{
                                              cursor:'pointer'
                                            }}
                                          >
                                              <img src={require('../../../CustomAsset/edit.png')}/>
                                
                                          </a> */}
                                          <a
                                            className={`action-icon`}
                                            onClick={() => Editmedia(item.ID , "True")}
                                            style={{
                                              cursor:'pointer'
                                            }}
                                          >
                                              <img src={require('../../../CustomAsset/edit.png')}/>
                                          
                                          </a>
                                       
                                        </span>
                                           <span>
                                           <a
                                         className="action-icon text-danger"
                                         onClick={() => Deletemedia(item.ID)}
                                       > <img src={require('../../../CustomAsset/del.png')}/>
                                        
                                       </a>
                                     </span>
                                        </div>
                                      
                                      ) : 
                                      (
                                        <div>
                                             <span>
                                      <a
                                        className={`action-icon ${item.Status === "Save as draft"
                                            ? "text-primary"
                                            : "text-muted"
                                          }`}
                                        onClick={
                                          item.Status === "Save as draft"
                                            ? () => Editmedia(item.ID , "False")
                                            :  () => ViewFormReadOnly(item.ID)
                                        }
                                        style={{
 
                                          cursor:'pointer'
                           
                                           
                           
                                        }}
                                      >
                                          <img src={require('../../../CustomAsset/edit.png')}/>
                                      
                                      </a>
                                    </span>
                                    {/* <span>
                                    {(item.Status === "Save as draft")?(  <a
                                        className="action-icon text-danger"
                                        onClick={() => Deletemedia(item.ID)}
                                      > <img src={require('../../../CustomAsset/del.png')}/>
                                       
                                      </a>):(<div></div>)}
                                    </span> */}
                                        </div>
                                      )
                                    }

                                    {/* previous code */}
                                    {/* <span>
                                      <a
                                        className={`action-icon ${item.Status === "Save as draft"
                                            ? "text-primary"
                                            : "text-muted"
                                          }`}
                                        onClick={
                                          item.Status === "Save as draft"
                                            ? () => Editmedia(item.ID)
                                            :  () => ViewFormReadOnly(item.ID)
                                        }
                                        style={{
 
                                          cursor:'pointer'
                           
                                           
                           
                                        }}
                                      >
                                          <img src={require('../../../CustomAsset/edit.png')}/>
                                      
                                      </a>
                                    </span>
                                    <span>
                                    {(item.Status === "Save as draft")?(  <a
                                        className="action-icon text-danger"
                                        onClick={() => Deletemedia(item.ID)}
                                      > <img src={require('../../../CustomAsset/del.png')}/>
                                       
                                      </a>):(<div></div>)}
                                    </span> */}
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                          : ""}
                      </tbody>
                    </table>
                    <nav className="pagination-container">
                      <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <a
                            className="page-link"
                            onClick={() => handlePageChange(currentPage - 1)}
                            aria-label="Previous"
                          >
                            «
                          </a>
                        </li>
                        {Array.from({ length: totalPages }, (_, num) => (
                          <li
                            key={num}
                            className={`page-item ${currentPage === num + 1 ? 'active' : ''}`}
                          >
                            <a
                              className="page-link"
                              onClick={() => handlePageChange(num + 1)}
                            >
                              {num + 1}
                            </a>
                          </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                          <a
                            className="page-link"
                            onClick={() => handlePageChange(currentPage + 1)}
                            aria-label="Next"
                          >
                            »
                          </a>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* End table content */}
          {/* End container */}
        </div>
      </div>
    </div>
  )
}
 
const MediaMaster: React.FC<IMediaMasterProps> = (props) => (
  <Provider>
    <MediaMastercontext props={props} />
  </Provider>
);
 
export default MediaMaster;