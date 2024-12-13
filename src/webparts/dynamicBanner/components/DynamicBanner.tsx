import React from 'react';
import { IDynamicBannerProps } from './IDynamicBannerProps';
import Provider from '../../../GlobalContext/provider';
import { getSP } from '../loc/pnpjsConfig';
import UserContext from '../../../GlobalContext/context';
import { useMediaQuery } from 'react-responsive';
import { DeleteBannerAPI, getDynamicBanner } from "../../../APISearvice/BannerService";
import { encryptId } from '../../../APISearvice/CryptoService';
import Swal from 'sweetalert2';
import VerticalSideBar from '../../verticalSideBar/components/VerticalSideBar';
import CustomBreadcrumb from '../../../CustomJSComponents/CustomBreadcrumb/CustomBreadcrumb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEdit, faPlusCircle, faSort, faEllipsisV, faFileExport } from '@fortawesome/free-solid-svg-icons';
import "../../../Assets/Figtree/Figtree-VariableFont_wght.ttf";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../CustomCss/mainCustom.scss";
import "../../verticalSideBar/components/VerticalSidebar.scss";
import "../../../CustomJSComponents/CustomTable/CustomTable.scss";
import "../components/adddynamicbanner.scss"
import * as XLSX from 'xlsx';
import HorizontalNavbar from '../../horizontalNavBar/components/HorizontalNavBar';
import moment from 'moment';
const DynamicBannercontext = ({ props }: any) => {
  const sp = getSP();
  const { useHide }: any = React.useContext(UserContext);
  const context = React.useContext(UserContext);
  const { setUseId, useId }: any = context;
  const elementRef = React.useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [bannersData, setBannersData] = React.useState([]);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const ApiCall = async () => {
    let bannersArr: any[] = [];
    const userGroups = await sp.web.currentUser.groups();
    let groupTitles: string[] = userGroups.map((group) => group.Title.toLowerCase());

    if (groupTitles.includes("intranetadmin")) {
      bannersArr = await getDynamicBanner(sp, "yes");
    }
    else if (groupTitles.includes("intranetcontentcontributor")) {
      bannersArr = await getDynamicBanner(sp, "No");
    }

    setBannersData(bannersArr);

  };
  const [filters, setFilters] = React.useState({
    SNo: '',
    Title: '',
    Overview: '',
    URL: '',
    Status: '',
    SubmittedDate: ''
  });
  const [sortConfig, setSortConfig] = React.useState({ key: '', direction: 'ascending' });


  React.useEffect(() => {
    // Usage
    // const id = "12345";
    // const encryptedId = encryptId(id);
    // console.log("Encrypted ID:", encryptedId);

    // const decryptedId = decryptId(encryptedId);
    // console.log("Decrypted ID:", decryptedId);
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
  // const totalPages = Math.ceil(bannersData.length / itemsPerPage);

  // const handlePageChange = (pageNumber: any) => {
  //   if (pageNumber > 0 && pageNumber <= totalPages) {
  //     setCurrentPage(pageNumber);
  //   }
  // };

  // const startIndex = (currentPage - 1) * itemsPerPage;
  // const endIndex = startIndex + itemsPerPage;
  // const currentData = bannersData.slice(startIndex, endIndex);
  // console.log(currentData, 'currentData');
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
        (filters.Title === '' || item.Title.toLowerCase().includes(filters.Title.toLowerCase())) &&
        (filters.URL === '' || item.URL.toLowerCase().includes(filters.URL.toLowerCase())) &&
        (filters?.Status === '' || item?.Status?.toLowerCase().includes(filters?.Status?.toLowerCase())) &&
        (filters.SubmittedDate === '' || item.Created.toLowerCase().includes(filters.SubmittedDate.toLowerCase()))
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

  const filteredAnnouncementData = applyFiltersAndSorting(bannersData);

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
    const exportData = currentData.map((item, index) => ({
      'S.No.': startIndex + index + 1,
      'Title': item.Title,
      'Url': item.Url,

      'Status': item.Status,
      'Submitted Date': item.Created,
    }));

    exportToExcel(exportData, 'Banner');
  };
  const exportToExcel = (data: any[], fileName: string) => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };
  //#endregion

  const siteUrl = props.siteUrl
  //#region Breadcrumb
  const Breadcrumb = [
    {
      "MainComponent": "Settings",
      "MainComponentURl": `${siteUrl}/SitePages/settings.aspx`
    },
    {
      "ChildComponent": "Banner Master",
      "ChildComponentURl": `${siteUrl}/SitePages/BannerMaster.aspx`
    }
  ]
  //#endregion


  //#region 
  const EditBanner = (id: any) => {
    debugger
    // setUseId(id)
    const encryptedId = encryptId(String(id));
    sessionStorage.setItem("bannerId", encryptedId)
    window.location.href = `${siteUrl}/SitePages/BannerForm.aspx`;
  }
  //#endregion

  //#region 
  const DeleteBanner = (id: any) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        await DeleteBannerAPI(sp, id)
        setBannersData(prevBanners => prevBanners.filter(item => item.ID !== id));
        Swal.fire({
          title: "Deleted!",
          text: "Item has been deleted.",
          icon: "success"
        });

      }
    })
  }
  const goToAddForm = () => {
    sessionStorage.removeItem("bannerId")
    window.location.href = `${siteUrl}/SitePages/BannerForm.aspx`;
  }

  const [isOpenNews, setIsOpenNews] = React.useState(false);
  const toggleDropdownNews = () => {
    setIsOpenNews(!isOpenNews);
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

    exportToExcel(exportData, 'Banner');
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
        <div className="content " style={{ marginLeft: `${!useHide ? '240px' : '80px'}` }}>
          <div className="container-fluid  paddb">
            <div className="row">
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
                    <a href={`${siteUrl}/SitePages/BannerForm.aspx`} onClick={() => goToAddForm()}>
                      <button type="button" className="btn btn-primary waves-effect waves-light" style={{ background: '#1fb0e5' }}>
                        <FontAwesomeIcon icon={faPlusCircle} className="me-1" />
                        Add
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="card cardCss mt-3">
              <div className="card-body">
                <div id="cardCollpase4" className="collapse show">
                  <div className="table-responsive pt-0">
                    <table className="mtable mt-0 table-centered table-nowrap table-borderless mb-0">
                      <thead>
                        <tr>
                          <th style={{
                            borderBottomLeftRadius: '0px', minWidth: '50px',
                            maxWidth: '50px', borderTopLeftRadius: '0px'
                          }}>
                            <div className="d-flex pb-2"
                              style={{ justifyContent: 'space-between' }}>
                              <span>S.No.</span>
                              <span onClick={() => handleSortChange('SNo')}>
                                <FontAwesomeIcon icon={faSort} />
                              </span>
                            </div>
                            <div className="bd-highlight">
                              <input
                                type="text"
                                placeholder="index"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault(); // Prevents the new line in textarea
                                  }
                                }}
                                onChange={(e) => handleFilterChange(e, 'SNo')}
                                className="inputcss"
                                style={{ width: '100%' }}
                              />
                            </div>
                          </th>
                          <th>
                            <div className="d-flex flex-column bd-highlight ">
                              <div className="d-flex pb-2" style={{ justifyContent: 'space-between' }}>
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
                            </div>
                          </th>
                          {/* <th style={{ minWidth: '100px', maxWidth: '100px' }}>Banner Image
                            <div className="d-flex flex-column bd-highlight ">
                                    <div className="d-flex pb-2" style={{ justifyContent: 'space-between' }}>  
                                      <span >Title</span>  <span onClick={() => handleSortChange('Title')}><FontAwesomeIcon icon={faSort} /> </span></div>
                                    <div className=" bd-highlight">
                                      <input type="text" placeholder="Filter by Title" onChange={(e) => handleFilterChange(e, 'Title')}
                                        className='inputcss' style={{ width: '100%' }} />
                                    </div>
                                  </div>
                            </th> */}
                          {/* <th style={{ minWidth: '100px', maxWidth: '100px' }}>
                            <div className="d-flex flex-column bd-highlight ">
                                    <div className="d-flex pb-2" style={{ justifyContent: 'space-between' }}>  
                                      <span >Url</span>  <span onClick={() => handleSortChange('URL')}><FontAwesomeIcon icon={faSort} /> </span></div>
                                    <div className=" bd-highlight">
                                      <input type="text" placeholder="Filter by URL" onChange={(e) => handleFilterChange(e, 'URL')}
                                        className='inputcss' style={{ width: '100%' }} />
                                    </div>
                                  </div>
                            </th> */}
                          <th style={{ minWidth: '60px', maxWidth: '60px' }}>
                            <div className="d-flex flex-column bd-highlight ">
                              <div className="d-flex pb-2" style={{ justifyContent: 'space-between' }}>
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
                          <th style={{ minWidth: '80px', maxWidth: '80px' }}>
                            <div className="d-flex flex-column bd-highlight ">
                              <div className="d-flex pb-2" style={{ justifyContent: 'space-between' }}>
                                <span >SubmittedDate</span>  <span onClick={() => handleSortChange('SubmittedDate')}><FontAwesomeIcon icon={faSort} /> </span></div>
                              <div className=" bd-highlight">
                                <input type="text" placeholder="Filter by SubmittedDate" onChange={(e) => handleFilterChange(e, 'SubmittedDate')}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                      e.preventDefault(); // Prevents the new line in textarea
                                    }
                                  }}
                                  className='inputcss' style={{ width: '100%' }} />
                              </div>
                            </div>
                          </th>
                          <th style={{ borderBottomRightRadius: '0px', minWidth: '50px', maxWidth: '50px', borderTopRightRadius: '0px' }}>
                            <div className="d-flex flex-column bd-highlight pb-2">
                              <div className="d-flex  pb-2" style={{ justifyContent: 'space-between' }}>  <span >Action</span> <div className="dropdown">
                                <FontAwesomeIcon icon={faEllipsisV} onClick={toggleDropdownNews} size='xl' />
                              </div>
                              </div>
                              <div className=" bd-highlight">   <div id="myDropdown" className={`dropdown-content ${isOpenNews ? 'showNews' : ''}`}>
                                <div onClick={handleExportClick} className="" >
                                  <FontAwesomeIcon icon={faFileExport} />  Export
                                </div>
                              </div></div>

                            </div>
                            <div style={{ height: '32px' }}></div>
                          </th>
                        </tr>
                      </thead>
                      <tbody style={{ maxHeight: '5000px' }}>
                        {currentData.length === 0 ?
                          (
                            <div className="no-results" style={{ display: 'flex', justifyContent: 'center' }}>No results found</div>
                          )
                          :
                          currentData.map((item, index) => {
                            const ImageUrl = item.BannerImage == undefined || item.BannerImage == null ? "" : JSON.parse(item.BannerImage);
                            return (
                              <tr key={index}>
                                <td style={{ minWidth: '50px', maxWidth: '50px' }}><div style={{ marginLeft: '20px' }} className='indexdesign'> {index + 1}</div>  </td>
                                <td>{item.Title}</td>

                                <td style={{ minWidth: '60px', maxWidth: '60px' }}>  <div className='btn btn-status'> {item.Status} </div> </td>
                                <td style={{ minWidth: '80px', maxWidth: '80px' }}> {moment(item.Created).format("DD-MMM-YYYY")}</td>
                                <td style={{ minWidth: '50px', maxWidth: '50px' }} className="ng-binding">
                                  <div className="d-flex  pb-2" style={{ justifyContent: 'center', gap: '5px' }}>
                                    <span > <a className="action-icon text-primary" onClick={() => EditBanner(item.ID)}>
                                      <img src={require('../../../CustomAsset/edit.png')} />
                                    </a> </span >
                                    <span>   <a className="action-icon text-danger" onClick={() => DeleteBanner(item.ID)}>
                                      <img src={require('../../../CustomAsset/del.png')} />
                                    </a> </span>
                                  </div>
                                </td>
                              </tr>
                            )
                          })
                        }
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
        </div>
        {/* End table content */}
        {/* End container */}
      </div>
    </div>

  )
}

const DynamicBanner: React.FC<IDynamicBannerProps> = (props) => (

  <Provider>
    <DynamicBannercontext props={props} />
  </Provider>
)


export default DynamicBanner