import * as React from 'react'

import { useMediaQuery } from 'react-responsive';

import UserContext from '../../../GlobalContext/context';

import { getSP } from '../loc/pnpjsConfig';

import "../../../Assets/Figtree/Figtree-VariableFont_wght.ttf"

import "bootstrap/dist/css/bootstrap.min.css";

import "../../../CustomCss/mainCustom.scss";

import "../../verticalSideBar/components/VerticalSidebar.scss"

import CustomBreadcrumb from '../../../CustomJSComponents/CustomBreadcrumb/CustomBreadcrumb';

import VerticalSideBar from '../../verticalSideBar/components/VerticalSideBar';

import Provider from '../../../GlobalContext/provider';

import "../../../CustomJSComponents/CustomTable/CustomTable.scss";

import { DeleteAnnouncementAPI, getAnncouncement, getAnncouncementMaster } from '../../../APISearvice/AnnouncementsService';

import { IAnnouncementmasterProps } from './IAnnouncementmasterProps';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faArrowDown, faArrowLeft, faEllipsisV, faFileExport, faPencilAlt, faPlusCircle, faSort } from '@fortawesome/free-solid-svg-icons';

import { faEdit, faTrashAlt, faEye } from '@fortawesome/free-regular-svg-icons';

import Swal from 'sweetalert2';

import { decryptId, encryptId } from "../../../APISearvice/CryptoService";

import { Tab, Tabs } from 'react-bootstrap';

import { getNews, getNewsMaster } from '../../../APISearvice/NewsService';

import "../components/announcementMaster.scss";

import * as XLSX from 'xlsx';

import { DataGrid, GridColDef } from '@mui/x-data-grid';

import Paper from '@mui/material/Paper';

import Tooltip from '@mui/material/Tooltip';

import { Button } from '@mui/material';


import moment from 'moment';

import HorizontalNavbar from '../../horizontalNavBar/components/HorizontalNavBar';


const Announcementmastercontext = ({ props }: any) => {

  const sp = getSP();

  const { useHide }: any = React.useContext(UserContext);

  const context = React.useContext(UserContext);

  const { setUseId, useId }: any = context;

  const elementRef = React.useRef<HTMLDivElement>(null);

  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const [announcementData, setAnnouncementData] = React.useState([]);

  const [newsData, setNewsData] = React.useState([]);

  const { setHide }: any = context;

  const [filters, setFilters] = React.useState({

    SNo: '',

    Title: '',

    Overview: '',

    Category: '',

    Type: '',

    Status: '',

    SubmittedDate: ''

  });

  let CurrentTab: boolean = true;
  let tabchange = false;
  const [sortConfig, setSortConfig] = React.useState({ key: '', direction: 'ascending' });


  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });


  const ApiCall = async () => {
    let announcementArr: any[] = [];
    let NewsArr: any[] = [];
    const userGroups = await sp.web.currentUser.groups();
    let groupTitles: string[] = userGroups.map((group) => group.Title.toLowerCase());

    if (groupTitles.includes("intranetadmin")) {
      announcementArr = await getAnncouncementMaster(sp, "yes");
      NewsArr = await getNewsMaster(sp, "yes");
    }
    else if (groupTitles.includes("intranetcontentcontributor")) {
      announcementArr = await getAnncouncementMaster(sp, "No");
      NewsArr = await getNewsMaster(sp, "No");
    }
    //if(announcementArr.length >0)
    setAnnouncementData(announcementArr);
    setNewsData(NewsArr);

  };


  React.useEffect(() => {

    sessionStorage.removeItem("announcementId")

    ApiCall();

  }, [useHide]);


  const handleSidebarToggle = (bol: boolean) => {

    setIsSidebarOpen((prevState) => !prevState);

    useHide(!bol);

    document.querySelector(".sidebar")?.classList.toggle("close");

  };


  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {

    setFilters({

      ...filters,

      [field]: e.target.value

    });

  };


  const handleSortChange = (key: string) => {

    let direction = 'ascending';

    if (sortConfig.key === key && sortConfig.direction === 'ascending') {

      direction = 'descending';

    }

    setSortConfig({ key, direction });

  };


  // const filteredAnnouncementData = announcementData.filter(item => {

  //   return (

  //     (filters.Title === '' || item.Title.toLowerCase().includes(filters.Title.toLowerCase())) &&

  //     (filters.Overview === '' || item.Overview.toLowerCase().includes(filters.Overview.toLowerCase())) &&

  //     (filters.Category === '' || item?.Category?.Category.toLowerCase().includes(filters.Category.toLowerCase())) &&

  //     (filters.Type === '' || item?.AnnouncementandNewsTypeMaster?.TypeMaster.toLowerCase().includes(filters.Type.toLowerCase())) &&

  //     (filters.Status === '' || item.Status.toLowerCase().includes(filters.Status.toLowerCase())) &&

  //     (filters.SubmitedDate === '' || item.Created.toLowerCase().includes(filters.SubmitedDate.toLowerCase()))

  //   );

  // });

  const applyFiltersAndSorting = (data: any[]) => {

    debugger

    // Filter data

    const filteredData = data.filter((item, index) => {

      return (

        (filters.SNo === '' || String(index + 1).includes(filters.SNo)) &&

        (filters.Title === '' || item.Title.toLowerCase().includes(filters.Title.toLowerCase())) &&

        (filters.Overview === '' || item.Overview.toLowerCase().includes(filters.Overview.toLowerCase())) &&

        (filters.Category === '' || item?.Category.Category !== null && item?.Category?.Category.toLowerCase().startsWith(filters.Category.toLowerCase())) &&

        (filters.Type === '' || item?.AnnouncementandNewsTypeMaster && item?.AnnouncementandNewsTypeMaster?.TypeMaster.toLowerCase().includes(filters.Type.toLowerCase())) &&

        (filters?.Status === '' || item?.Status?.toLowerCase().includes(filters?.Status?.toLowerCase())) &&

        (filters.SubmittedDate === '' || item.Created.toLowerCase().includes(filters.SubmittedDate.toLowerCase()))

      );

    });


    // Sort data

    // const sortedData = filteredData.sort((a, b) => {

    //   if (sortConfig.key) {

    //     const aValue = a[sortConfig.key] ? a[sortConfig.key].toLowerCase() : '';

    //     const bValue = b[sortConfig.key] ? b[sortConfig.key].toLowerCase() : '';


    //     if (aValue < bValue) {

    //       return sortConfig.direction === 'ascending' ? -1 : 1;

    //     }

    //     if (aValue > bValue) {

    //       return sortConfig.direction === 'ascending' ? 1 : -1;

    //     }

    //   }

    //   return 0;

    // });

    const sortedData = filteredData.sort((a, b) => {

      if (sortConfig.key === 'SNo') {

        // Sort by index

        const aIndex = data.indexOf(a);

        const bIndex = data.indexOf(b);


        return sortConfig.direction === 'ascending' ? aIndex - bIndex : bIndex - aIndex;

      } else if (sortConfig.key === 'Category') {

        // Sort by other keys
        console.log("a[sortConfig.key]", a[sortConfig.key], b[sortConfig.key])
        const aValue = a[sortConfig.key] ? a[sortConfig.key].Category.toLowerCase() : '';

        const bValue = b[sortConfig.key] ? b[sortConfig.key].Category.toLowerCase() : '';


        if (aValue < bValue) {

          return sortConfig.direction === 'ascending' ? -1 : 1;

        }

        if (aValue > bValue) {

          return sortConfig.direction === 'ascending' ? 1 : -1;

        }
      }

      else if (sortConfig.key) {

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


  const filteredAnnouncementData = applyFiltersAndSorting(announcementData);

  const filteredNewsData = applyFiltersAndSorting(newsData);


  const [currentPage, setCurrentPage] = React.useState(1);
  const [CurrentTabs, setCurrentTabs] = React.useState("Announcement");

  const itemsPerPage = 10;
  console.log("CurrentTabCurrentTab", CurrentTab);
  const totalPages = Math.ceil(filteredAnnouncementData.length / itemsPerPage);
  const totalPagesnews = Math.ceil(filteredNewsData.length / itemsPerPage);
  const tabclicked = (tab:any) => {
    debugger

    setCurrentTabs(tab);
    CurrentTab = !CurrentTab;
    tabchange =  true;
    setCurrentPage(1)
  }
  console.log("totalPages", totalPages, CurrentTab);
  const handlePageChange = (pageNumber: any) => {
    let currentpage = pageNumber;
    let totalpage: any;
    if (CurrentTab) {
      totalpage = totalPages
    } else {
      totalpage = totalPagesnews
    }
    console.log("totalPages on change", totalPages, CurrentTab, "totalpage", totalpage, currentpage, pageNumber, "tabchange", tabchange);
    if (pageNumber > 0 && pageNumber <= totalpage) {

      setCurrentPage(pageNumber);

    } else if (pageNumber > 0 && pageNumber > totalpage)
      setCurrentPage(1)
  };


  const startIndex = (currentPage - 1) * itemsPerPage;

  const endIndex = startIndex + itemsPerPage;

  const currentData = filteredAnnouncementData.slice(startIndex, endIndex);

  const newsCurrentData = filteredNewsData.slice(startIndex, endIndex);


  const siteUrl = props.siteUrl;


  const Breadcrumb = [

    {

      "MainComponent": "Settings",

      "MainComponentURl": `${siteUrl}/SitePages/Settings.aspx`

    },

    {

      "ChildComponent": "Announcements & News Master",

      "ChildComponentURl": `${siteUrl}/SitePages/announcementmaster.aspx`

    }

  ];


  const EditAnnouncement = (id: any) => {

    const encryptedId = encryptId(String(id));

    sessionStorage.setItem("announcementId", encryptedId);

    window.location.href = `${siteUrl}/SitePages/AddAnnouncement.aspx`;

  };

  const ViewFormReadOnly = (id: any) => {
    // debugger
    // setUseId(id)
    const encryptedId = encryptId(String(id));
    sessionStorage.setItem("announcementId", encryptedId)
    window.location.href = `${siteUrl}/SitePages/AddAnnouncement.aspx?mode=view`;
  }


  const DeleteAnnouncement = (id: any) => {

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

        DeleteAnnouncementAPI(sp, id).then(() => {

          ApiCall();

          Swal.fire("Deleted!", "Item has been deleted.", "success");

        });

      }

    });

  };


  const [activeTab, setActiveTab] = React.useState(0);


  const handleTabClick = (index: React.SetStateAction<number>) => {

    setActiveTab(index);

  };


  const handleExportClick = () => {

    const exportData = announcementData.map((item, index) => ({

      'S.No.': startIndex + index + 1,

      'Title': item.Title,

      'Overview': item.Overview,

      'Category': item?.Category?.Category,

      'Type': item?.AnnouncementandNewsTypeMaster?.TypeMaster,

      'Status': item.Status,

      'Submitted Date': item.Created,

    }));


    exportToExcel(exportData, 'Announcements');

  };

  const handleNewsExportClick = () => {

    const exportData = currentData.map((item, index) => ({

      'S.No.': startIndex + index + 1,

      'Title': item.Title,

      'Overview': item.Overview,

      'Category': item?.Category?.Category,

      'Type': item?.AnnouncementandNewsTypeMaster?.TypeMaster,

      'Status': item.Status,

      'Submitted Date': item.Created,

    }));


    exportToExcel(exportData, 'News');

  };


  const exportToExcel = (data: any[], fileName: string) => {

    const workbook = XLSX.utils.book_new();

    const worksheet = XLSX.utils.json_to_sheet(data);

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    XLSX.writeFile(workbook, `${fileName}.xlsx`);

  };

  const [isOpen, setIsOpen] = React.useState(false);

  const toggleDropdown = () => {

    setIsOpen(!isOpen);

  };

  const [isOpenNews, setIsOpenNews] = React.useState(false);

  const toggleDropdownNews = () => {

    setIsOpenNews(!isOpenNews);

  };

  const GotoAdd = (url: string) => {

    sessionStorage.removeItem("announcementId")

    window.location.href = url

  }

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

          <div className="container-fluid paddb">

            <div className="row">  {/* Edit by amjad */}

              <div className="col-lg-6">

                <CustomBreadcrumb Breadcrumb={Breadcrumb} />

              </div>

              <div className="col-lg-6">

                <div className="d-flex flex-wrap align-items-center justify-content-end mt-3">

                  <div className="d-flex flex-wrap align-items-center justify-content-start">

                    <a href={`${siteUrl}/SitePages/settings.aspx`}>

                      <div className="btn btn-secondary me-1 waves-effect waves-light">

                        <FontAwesomeIcon icon={faArrowLeft} className="me-1" />

                        Back

                      </div>

                    </a>

                    <a onClick={() => GotoAdd(`${siteUrl}/SitePages/AddAnnouncement.aspx`)}>

                      <div className="btn btn-primary waves-effect waves-light" style={{ background: '#1fb0e5' }}>

                        <FontAwesomeIcon icon={faPlusCircle} className="me-1" />

                        Add

                      </div>

                    </a>

                  </div>

                </div>

              </div>

            </div>


            <Tabs

              defaultActiveKey="Announcement"

              id="uncontrolled-tab-example"

              className="mb-3 mt-4" 
              onSelect={() => tabclicked(CurrentTabs == "Announcement" ? "News" : "Announcement")}
            >

              <Tab eventKey="Announcement" title="Announcement" >

                <div className="card cardCss mt-0">

                  <div className="card-body">


                    <div id="cardCollpase4" className="collapse show">

                      <div className="table-responsive pt-0">


                        <table className="mtbalenew mt-0 table-centered table-nowrap table-borderless mb-0" style={{ position: 'relative' }}>


                          <thead>

                            <tr>

                              <th style={{ borderBottomLeftRadius: '0px', minWidth: '50px', maxWidth: '50px', borderTopLeftRadius: '0px' }}>

                                <div className="d-flex pb-2" style={{ justifyContent: 'space-between' }}>

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

                              <th>

                                <div className="d-flex flex-column bd-highlight ">

                                  <div className="d-flex pb-2" style={{ justifyContent: 'space-between' }}>  <span >Title</span>  <span onClick={() => handleSortChange('Title')}><FontAwesomeIcon icon={faSort} /> </span></div>

                                  <div className=" bd-highlight">

                                    <input type="text" placeholder="Filter by Title" onChange={(e) => handleFilterChange(e, 'Title')}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                          e.preventDefault(); // Prevents the new line in textarea
                                        }
                                      }}
                                      className='inputcss' style={{ width: '100%' }} />

                                  </div>

                                </div>

                              </th>

                              {/* <th style={{ minWidth: '100px', maxWidth: '100px' }}>

                                  <div className="d-flex flex-column bd-highlight ">

                                    <div className="d-flex  pb-2" style={{ justifyContent: 'space-between' }}>  <span >Overview</span>  <span onClick={() => handleSortChange('Overview')}><FontAwesomeIcon icon={faSort} /> </span></div>

                                    <div className=" bd-highlight">  <input type="text" placeholder="Filter by Overview" onChange={(e) => handleFilterChange(e, 'Overview')} className='inputcss' style={{ width: '100%' }} /></div>

                                  </div>

                                </th> */}

                              <th >

                                <div className="d-flex flex-column bd-highlight ">

                                  <div className="d-flex  pb-2" style={{ justifyContent: 'space-between' }}>  <span >Category</span>  <span onClick={() => handleSortChange('Category')}><FontAwesomeIcon icon={faSort} /> </span></div>

                                  <div className=" bd-highlight">  <input type="text" placeholder="Filter by Category" onChange={(e) => handleFilterChange(e, 'Category')}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault(); // Prevents the new line in textarea
                                      }
                                    }} className='inputcss' style={{ width: '100%' }} /></div>

                                </div>

                              </th>

                              <th >

                                <div className="d-flex flex-column bd-highlight ">

                                  <div className="d-flex  pb-2" style={{ justifyContent: 'space-between' }}>  <span >Type</span>  <span onClick={() => handleSortChange('Type')}><FontAwesomeIcon icon={faSort} /> </span></div>

                                  <div className=" bd-highlight">     <input type="text" placeholder="Filter by Type" onChange={(e) => handleFilterChange(e, 'Type')}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault(); // Prevents the new line in textarea
                                      }
                                    }}
                                    className='inputcss' style={{ width: '100%' }} /></div>

                                </div>

                              </th>

                              <th style={{ minWidth: '100px', maxWidth: '100px' }}>

                                <div className="d-flex flex-column bd-highlight ">

                                  <div className="d-flex  pb-0" style={{ justifyContent: 'space-between' }}>  <span >Status</span>  <span onClick={() => handleSortChange('Status')}><FontAwesomeIcon icon={faSort} /> </span></div>

                                  <div className=" bd-highlight">     <input type="text" placeholder="Filter by Status" onChange={(e) => handleFilterChange(e, 'Status')}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault(); // Prevents the new line in textarea
                                      }
                                    }}
                                    className='inputcss' style={{ width: '100%' }} /></div>

                                </div>

                              </th>

                              <th style={{ minWidth: '100px', maxWidth: '100px' }}>

                                <div className="d-flex flex-column bd-highlight ">

                                  <div className="d-flex  pb-0" style={{ justifyContent: 'space-between' }}>  <span >Submitted Date</span>  <span onClick={() => handleSortChange('SubmittedDate')}><FontAwesomeIcon icon={faSort} /> </span></div>

                                  <div className=" bd-highlight">     <input type="text" placeholder="Filter by Submitted Date" onChange={(e) => handleFilterChange(e, 'SubmittedDate')}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault(); // Prevents the new line in textarea
                                      }
                                    }}
                                    className='inputcss' style={{ width: '100%' }} /></div>

                                </div>

                              </th>

                              <th style={{ textAlign: 'center', minWidth:'80px',maxWidth:'80px', borderBottomRightRadius: '0px', borderTopRightRadius: '0px' }}> <div className="d-flex flex-column bd-highlight pb-2">

                                <div className="d-flex  pb-2" style={{ justifyContent: 'space-between' }}>  <span >Action</span> <div className="dropdown">

                                  <FontAwesomeIcon icon={faEllipsisV} onClick={toggleDropdown} size='xl' />

                                </div>

                                </div>

                                <div className=" bd-highlight">   <div id="myDropdown" className={`dropdown-content ${isOpen ? 'show' : ''}`}>

                                  <div onClick={handleExportClick} className="" >

                                    <FontAwesomeIcon icon={faFileExport} />  Export

                                  </div>

                                </div></div>


                              </div>

                                <div style={{ height: '32px' }}></div>

                              </th>

                            </tr>

                          </thead>

                          <tbody>

                            {currentData.length === 0 ? (

                              <tr>

                                <td colSpan={7} style={{ textAlign: "center" }}>

                                  No results found

                                </td>

                              </tr>

                            ) : (

                              currentData.map((item: any, index: number) => (

                                <tr key={index}>

                                  <td style={{ minWidth: "50px", maxWidth: "50px" }}>
                                    <div className='indexdesign'>  {startIndex + index + 1}</div>


                                  </td>

                                  <td>{item.Title}</td>

                                  <td>{item?.Category?.Category}</td>

                                  <td>{item?.AnnouncementandNewsTypeMaster?.TypeMaster}</td>

                                  <td style={{ minWidth: "100px", maxWidth: "100px", textAlign:'center' }}>{item.Status}</td>

                                  <td style={{ minWidth: "100px", maxWidth: "100px",textAlign:'center' }}>


                                    <div className='btn  btn-light'>
                                      {moment(item.Created).format("L")}
                                    </div>
                                  </td>

                                  <td style={{ minWidth: "80px", maxWidth: "80px",textAlign:'center' }} className="ng-binding">

                                    <div className="d-flex pb-0" style={{ justifyContent: "space-around" }}>

                                      {/* Conditionally render the edit button based on status */}

                                      <span>

                                        <a

                                          className={`action-icon ${item.Status === "Save as draft" ? "text-primary" : "text-muted"

                                            }`}

                                          onClick={item.Status === "Save as draft" ? () => EditAnnouncement(item.ID) : () => ViewFormReadOnly(item.ID)}

                                          style={{

                                            cursor: item.Status === "Save as draft" ? "pointer" : "pointer"

                                          }}

                                        >

                                          {item?.Status == "Save as draft" ? <FontAwesomeIcon icon={faEdit} fontSize={18} /> :
                                            // <FontAwesomeIcon icon={faEye} fontSize={18} />
                                            <img src={require('../../../CustomAsset/Eye.png')} />
                                          }
                                        </a>

                                      </span>

                                      {item.Status === "Save as draft" ? (<span>

                                        <a

                                          className="action-icon text-danger"

                                          onClick={() => DeleteAnnouncement(item.ID)}

                                        >
<img src={require('../../../CustomAsset/del.png')} />
                                          {/* <FontAwesomeIcon icon={faTrashAlt} fontSize={18} /> */}

                                        </a>

                                      </span>) : (<div></div>)}

                                    </div>

                                  </td>

                                </tr>

                              ))

                            )}

                          </tbody>

                          {/* <div style={{position:'absolute'}}>

                              <img src={require("../../../Assets/ExtraImage/NodataFound.png")}/>

                            </div> */}

                        </table>


                      </div>

                      {currentData.length > 0 ? <nav className="pagination-container">

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

                      </nav> : <></>

                      }

                    </div>

                  </div>

                </div>

              </Tab>

              <Tab eventKey="News" title="News">

                <div className="card cardCss mt-4">

                  <div className="card-body">

                    <div id="cardCollpase4" className="collapse show">

                      <div className="table-responsive pt-0">

                        <table className="mtbalenew mt-0 table-centered table-nowrap table-borderless mb-0" style={{ position: 'relative' }}>

                          <thead>

                            <tr>

                              <th style={{ borderBottomLeftRadius: '10px', minWidth: '50px', maxWidth: '50px', borderTopLeftRadius: '10px' }}>

                                <div className="d-flex pb-2" style={{ justifyContent: 'space-between' }}>

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

                              <th>

                                <div className="d-flex flex-column bd-highlight ">

                                  <div className="d-flex pb-2" style={{ justifyContent: 'space-between' }}>  <span >Title</span>  <span onClick={() => handleSortChange('Title')}><FontAwesomeIcon icon={faSort} /> </span></div>

                                  <div className=" bd-highlight">

                                    <input type="text" placeholder="Filter by Title" onChange={(e) => handleFilterChange(e, 'Title')}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                          e.preventDefault(); // Prevents the new line in textarea
                                        }
                                      }}
                                      className='inputcss' style={{ width: '100%' }} />

                                  </div>

                                </div>

                              </th>

                              {/* <th style={{ minWidth: '100px', maxWidth: '100px' }}>

                                <div className="d-flex flex-column bd-highlight ">

                                  <div className="d-flex  pb-2" style={{ justifyContent: 'space-between' }}>  <span >Overview</span>  <span onClick={() => handleSortChange('Overview')}><FontAwesomeIcon icon={faSort} /> </span></div>

                                  <div className=" bd-highlight">  <input type="text" placeholder="Filter by Overview" onChange={(e) => handleFilterChange(e, 'Overview')} className='inputcss' style={{ width: '100%' }} /></div>

                                </div>

                              </th> */}

                              <th style={{ minWidth: '100px', maxWidth: '100px' }}>

                                <div className="d-flex flex-column bd-highlight ">

                                  <div className="d-flex  pb-2" style={{ justifyContent: 'space-between' }}>  <span >Category</span>  <span onClick={() => handleSortChange('Category')}><FontAwesomeIcon icon={faSort} /> </span></div>

                                  <div className=" bd-highlight">  <input type="text" placeholder="Filter by Category"
                                    onChange={(e) => handleFilterChange(e, 'Category')}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault(); // Prevents the new line in textarea
                                      }
                                    }} className='inputcss' style={{ width: '100%' }} /></div>

                                </div>

                              </th>

                              <th style={{ minWidth: '100px', maxWidth: '100px' }}>

                                <div className="d-flex flex-column bd-highlight ">

                                  <div className="d-flex  pb-2" style={{ justifyContent: 'space-between' }}>  <span >Type</span>  <span onClick={() => handleSortChange('Type')}><FontAwesomeIcon icon={faSort} /> </span></div>

                                  <div className=" bd-highlight">     <input type="text" placeholder="Filter by Type" onChange={(e) => handleFilterChange(e, 'Type')}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault(); // Prevents the new line in textarea
                                      }
                                    }}
                                    className='inputcss' style={{ width: '100%' }} /></div>

                                </div>

                              </th>

                              <th style={{ minWidth: '100px', maxWidth: '100px' }}>

                                <div className="d-flex flex-column bd-highlight ">

                                  <div className="d-flex  pb-2" style={{ justifyContent: 'space-between' }}>  <span >Status</span>  <span onClick={() => handleSortChange('Status')}><FontAwesomeIcon icon={faSort} /> </span></div>

                                  <div className=" bd-highlight">     <input type="text" placeholder="Filter by Status" onChange={(e) => handleFilterChange(e, 'Status')}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault(); // Prevents the new line in textarea
                                      }
                                    }}
                                    className='inputcss' style={{ width: '100%' }} /></div>

                                </div>

                              </th>

                              <th style={{ minWidth: '100px', maxWidth: '100px' }}>

                                <div className="d-flex flex-column bd-highlight ">

                                  <div className="d-flex  pb-2" style={{ justifyContent: 'space-between' }}>  <span >Submitted Date</span>  <span onClick={() => handleSortChange('SubmittedDate')}><FontAwesomeIcon icon={faSort} /> </span></div>

                                  <div className=" bd-highlight">     <input type="text" placeholder="Filter by Date" onChange={(e) => handleFilterChange(e, 'SubmittedDate')}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault(); // Prevents the new line in textarea
                                      }
                                    }} className='inputcss' style={{ width: '100%' }} /></div>

                                </div>

                              </th>

                              <th style={{ minWidth: '80px', maxWidth: '80px', textAlign:'center' }}>

                                <div className="d-flex flex-column bd-highlight pb-2">

                                  <div className="d-flex  pb-2" style={{ justifyContent: 'space-between' }}>  <span >Action</span> <div className="dropdown">

                                    <FontAwesomeIcon icon={faEllipsisV} onClick={toggleDropdownNews} fontSize={18} />

                                  </div>

                                  </div>

                                  <div className=" bd-highlight">   <div id="myDropdown" className={`dropdown-content ${isOpenNews ? 'showNews' : ''}`}>

                                    <div onClick={handleNewsExportClick} className="" >

                                      <FontAwesomeIcon icon={faFileExport} />  Export

                                    </div>

                                  </div></div>


                                </div>

                                <div style={{ height: '32px' }}></div>

                              </th>

                            </tr>

                          </thead>

                          <tbody>

                            {newsCurrentData.length === 0 ? (

                              <tr>

                                <td colSpan={7} style={{ textAlign: "center" }}>

                                  No results found

                                </td>

                              </tr>

                            ) : (

                              newsCurrentData.map(

                                (item: any, index: number) => (

                                  <tr key={index}>

                                    <td

                                      style={{

                                        minWidth: "50px",

                                        maxWidth: "50px",

                                      }}

                                    >

                                      {startIndex + index + 1}

                                    </td>

                                    <td >{item.Title}</td>

                                    <td style={{ minWidth: '100px', maxWidth: '100px' }}>{item?.Category?.Category}</td>

                                    <td style={{ minWidth: '100px', maxWidth: '100px' }}>

                                      {

                                        item?.AnnouncementandNewsTypeMaster

                                          ?.TypeMaster

                                      }

                                    </td>

                                    <td

                                      style={{

                                        minWidth: "100px",

                                        maxWidth: "100px",

                                      }}

                                    >

                                      {item.Status}

                                    </td>

                                    <td

                                      style={{

                                        minWidth: "100px",

                                        maxWidth: "100px",

                                      }}

                                    >

                                      {moment(item.Created).format("L")}

                                    </td>

                                    <td

                                      style={{

                                        minWidth: "80px",

                                        maxWidth: "80px",

                                      }}

                                      className="ng-binding"

                                    >

                                      <div

                                        className="d-flex pb-0"

                                        style={{

                                          justifyContent: "space-around",

                                        }}

                                      >

                                        {/* Conditionally render the edit button based on status */}

                                        <span>

                                          <a

                                            className={`action-icon ${item.Status === "Save as draft"

                                              ? "text-primary"

                                              : "text-muted"

                                              }`}

                                            onClick={

                                              item.Status === "Save as draft"

                                                ? () =>

                                                  EditAnnouncement(item.ID)

                                                : () => ViewFormReadOnly(item.ID)

                                            }

                                            style={{

                                              cursor:

                                                item.Status === "Save as draft"

                                                  ? "pointer"

                                                  : "not-allowed",

                                            }}

                                          >
    <img src={require('../../../CustomAsset/edit.png')} />
                                            {/* <FontAwesomeIcon

                                              icon={faEdit}

                                              fontSize={18}

                                            /> */}

                                          </a>

                                        </span>

                                        <span>

                                          {/* <a

                                            className="action-icon text-danger"

                                            onClick={() =>

                                              DeleteAnnouncement(item.ID)

                                            }

                                          >

                                            <FontAwesomeIcon

                                              icon={faTrashAlt}

                                              fontSize={18}

                                            />

                                          </a> */}

                                          {(item.Status === "Save as draft") ? (<a

                                            className="action-icon text-danger"

                                            onClick={() =>

                                              DeleteAnnouncement(item.ID)

                                            }

                                          >

                                            <FontAwesomeIcon

                                              icon={faTrashAlt}

                                              fontSize={18}

                                            />

                                          </a>) : (<div></div>)}

                                        </span>

                                      </div>

                                    </td>

                                  </tr>

                                )

                              )

                            )}

                          </tbody>

                          {/* <div style={{position:'absolute'}}>

                              <img src={require("../../../Assets/ExtraImage/NodataFound.png")}/>

                            </div> */}

                        </table>

                      </div>

                      {newsCurrentData.length > 0 ?

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

                            {Array.from({ length: totalPagesnews }, (_, num) => (

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

                            <li className={`page-item ${currentPage === totalPagesnews ? 'disabled' : ''}`}>

                              <a

                                className="page-link"

                                onClick={() => handlePageChange(currentPage + 1)}

                                aria-label="Next"

                              >

                                »

                              </a>

                            </li>

                          </ul>

                        </nav> : <></>}

                    </div>

                  </div>

                </div>

              </Tab>

            </Tabs>

          </div>

        </div>

      </div>

    </div>

  );

};




const Announcementmaster: React.FC<IAnnouncementmasterProps> = (props) => (

  <Provider>

    <Announcementmastercontext props={props} />

  </Provider>

);


export default Announcementmaster;