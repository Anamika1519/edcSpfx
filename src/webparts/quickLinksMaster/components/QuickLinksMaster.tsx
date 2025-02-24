import * as React from 'react';
// import styles from './QuickLinksMaster.module.scss';
import type { IQuickLinksMasterProps } from './IQuickLinksMasterProps';
import { escape } from '@microsoft/sp-lodash-subset';
import Provider from '../../../GlobalContext/provider';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Bootstrap JS + Popper.js
import "../../../CustomCss/mainCustom.scss";
import "../../verticalSideBar/components/VerticalSidebar.scss";
import VerticalSideBar from "../../verticalSideBar/components/VerticalSideBar";
import HorizontalNavbar from "../../horizontalNavBar/components/HorizontalNavBar";
import { SPFI } from "@pnp/sp/presets/all";
import { getSP } from "../loc/pnpjsConfig";
import CustomBreadcrumb from "../../../CustomJSComponents/CustomBreadcrumb/CustomBreadcrumb";
import UserContext from "../../../GlobalContext/context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faEllipsisV, faFileExport, faPlusCircle, faSort } from '@fortawesome/free-solid-svg-icons';
import { DeleteQuickLink, getQuickLinkList } from '../../../APISearvice/QuickLinksService';
import { encryptId } from '../../../APISearvice/CryptoService';
import Swal from 'sweetalert2';
import moment from 'moment';
import * as XLSX from "xlsx";

 

const QuickLinksMasterContext = ({ props }: any) => {
  const sp: SPFI = getSP();
  const siteUrl = props.siteUrl;
  const elementRef = React.useRef<HTMLDivElement>(null);
  const { useHide }: any = React.useContext(UserContext);
  const [QuickLinklistdata, setQuickLinkData] = React.useState([]);
  const [sortConfig, setSortConfig] = React.useState({ key: '', direction: 'ascending' });
  
  const ApiCall = async () => {
      let QuickLinkArr: any[] = [];
    //  const userGroups = await sp.web.currentUser.groups();
    //  let groupTitles: string[] = userGroups.map((group) => group.Title.toLowerCase());
 
    //  if (groupTitles.includes("intranetadmin")) {
    //   DelegateArr = await getDelegateList(sp, "yes");
    //  }
    //  else if (groupTitles.includes("intranetcontentcontributor")) {
      QuickLinkArr = await getQuickLinkList(sp, "No");
    //  }
 
    setQuickLinkData(QuickLinkArr);
 
   };

    const [isOpen, setIsOpen] = React.useState(false);
       
         const toggleDropdown = () => {
       
           setIsOpen(!isOpen);
       
         };

   React.useEffect(() => {
       ApiCall();
      });
   

   const [filters, setFilters] = React.useState({
       SNo: '',
       Title: '',
       URL: '',
       RedirectToNewTab: '',
       Entity:{
        ID:'',
        Entity:''
       },
       IsActive:''
       
     });
   const applyFiltersAndSorting = (data: any[]) => {
    // debugger
    // Filter data
    const filteredData = data.filter((item, index) => {
      return (
        (filters.SNo === '' || String(index + 1).includes(filters.SNo)) &&
        (filters.Title === '' || item.Title.toLowerCase().includes(filters.Title.toLowerCase())) &&
        (filters.URL === '' || item.URL.toLowerCase().includes(filters.URL.toLowerCase())) &&
        // (filters.RedirectToNewTab === '' || String(item.RedirectToNewTab).toLowerCase() === filters.RedirectToNewTab.toLowerCase())&&
        (filters.RedirectToNewTab === '' || String(item.RedirectToNewTab ? 'Yes' : 'No').toLowerCase() === filters.RedirectToNewTab.toLowerCase())&&

        // (filters?.RedirectToNewTab === '' || item?.RedirectToNewTab?.toLowerCase().includes(filters?.RedirectToNewTab?.toLowerCase()))&&
        (Object.keys(filters.Entity).length === 0 || item.Entity?.Entity?.toLowerCase().includes(filters.Entity.Entity.toLowerCase())) &&
        (filters.IsActive === '' || String(item.IsActive ? 'Yes' : 'No').toLowerCase() === filters.IsActive.toLowerCase())

        // (filters?.IsActive === '' || item?.IsActive?.toLowerCase().includes(filters?.IsActive?.toLowerCase()))
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

   const filteredQuickLinkData = applyFiltersAndSorting(QuickLinklistdata);
     
       const [currentPage, setCurrentPage] = React.useState(1);
       const itemsPerPage = 10;
       const totalPages = Math.ceil(filteredQuickLinkData.length / itemsPerPage);
     
       const handlePageChange = (pageNumber: any) => {
         if (pageNumber > 0 && pageNumber <= totalPages) {
           setCurrentPage(pageNumber);
         }
       };
     
       const startIndex = (currentPage - 1) * itemsPerPage;
       const endIndex = startIndex + itemsPerPage;
       const currentData = filteredQuickLinkData.slice(startIndex, endIndex);





    const Breadcrumb = [
      {
        "MainComponent": "Settings",
        "MainComponentURl": `${siteUrl}/SitePages/Settings.aspx`
      },
      {
        ChildComponent: "QuickLinks Master",
        ChildComponentURl: `${siteUrl}/SitePages/QuickLinksMaster.aspx`,
      },
    ];


    const goToAddForm = () => {
      sessionStorage.removeItem("quicklinkId")
      window.location.href = `${siteUrl}/SitePages/QuickLinksForm.aspx`;
    }
    const handleSortChange = (key: string) => {
      let direction = 'ascending';
      if (sortConfig.key === key && sortConfig.direction === 'ascending') {
        direction = 'descending';
      }
      setSortConfig({ key, direction });
    };

    // const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    //       setFilters({
    //         ...filters,
    //         [field]: e.target.value,
    //       });
    //     };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
      setFilters((prevFilters) => ({
        ...prevFilters,
        ...(field === "Entity"
          ? { Entity: { ...prevFilters.Entity, Entity: e.target.value } } // Corrected bracket placement
          : { [field]: e.target.value }) // Update other fields normally
      }));
    };
   
   
   

        //#region 
            const EditDelegate = (id: any) => {
              // debugger
              // setUseId(id)
              const encryptedId = encryptId(String(id));
              sessionStorage.setItem("quicklinkId", encryptedId)
              window.location.href = `${siteUrl}/SitePages/QuickLinksForm.aspx`;
            }
            //#endregion
          
            //#region 
            const DeleteDelegate = (id: any) => {
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
                  await DeleteQuickLink(sp, id)
                  setQuickLinkData(prevBanners => prevBanners.filter(item => item.ID !== id));
                  Swal.fire({
                    title: "Deleted!",
                    text: "Item has been deleted.",
                    icon: "success"
                  });
          
                }
              })
            }

            //#region Download exl file
              const handleExportClick = () => {
                const exportData = currentData.map((item, index) => ({
                  // 'S.No.': startIndex + index + 1,
                  // 'Title': item.Title,
                  // 'Url': item.Url,
           
                  // 'Status': item.Status,
                  // 'Submitted Date': item.Created,
                  "S.No.": startIndex + index + 1,
           
                  Title: item.Title,
           
                  URL: item.URL,
                  Department: item.Entity.Entity,
           
                  "Redirect to new tab": item.RedirectToNewTab,
           
                  Active: item.IsActive,
           
                  "Submitted Date": item.Created,
                }));
           
                exportToExcel(exportData, "Application Links Master");
              };
              const exportToExcel = (data: any[], fileName: string) => {
                const workbook = XLSX.utils.book_new();
                const worksheet = XLSX.utils.json_to_sheet(data);
                XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
                XLSX.writeFile(workbook, `${fileName}.xlsx`);
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
        <div className="content " style={{ marginLeft: `${!useHide ? '240px' : '80px'}` }}>
          <div style={{marginTop:'2.4rem'}} className="container-fluid  paddb">
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
                    <a href={`${siteUrl}/SitePages/QuickLinksForm.aspx`} onClick={() => goToAddForm()}>
                      <button type="button" className="btn btn-primary waves-effect waves-light" style={{ background: '#f37421 ' }}>
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
                    <table className="mtbalenew mt-0 table-centered table-nowrap table-borderless mb-0">
                      <thead>
                        <tr>
                          <th style={{
                            borderBottomLeftRadius: '0px', minWidth: '40px',
                            maxWidth: '40px', borderTopLeftRadius: '0px'
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
                                placeholder="SNo"
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
                          <th style={{ minWidth: '120px', maxWidth: '120px' }}>
                            <div className="d-flex flex-column bd-highlight ">
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
                            </div>
                          </th>

                          <th style={{ minWidth: '120px', maxWidth: '120px' }}>
                            <div className="d-flex flex-column bd-highlight ">
                              <div className="d-flex pb-2" style={{ justifyContent: 'space-evenly' }}>
                                <span >URL</span>  <span onClick={() => handleSortChange('URL')}><FontAwesomeIcon icon={faSort} /> </span></div>
                              <div className=" bd-highlight">
                                <input type="text" placeholder="Filter by URL" onChange={(e) => handleFilterChange(e, 'URL')}
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
                              <div className="d-flex pb-2" style={{ justifyContent: 'space-evenly' }}>
                                <span >Department</span>  <span onClick={() => handleSortChange('Department')}><FontAwesomeIcon icon={faSort} /> </span></div>
                              <div className=" bd-highlight">
                                <input type="text" placeholder="Filter by Department" onChange={(e) => handleFilterChange(e, 'Entity')}
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
                              <div className="d-flex pb-2" style={{ justifyContent: 'space-evenly' }}>
                                <span >Redirect to other tab</span>  <span onClick={() => handleSortChange('RedirectToNewTab')}><FontAwesomeIcon icon={faSort} /> </span></div>
                              <div className=" bd-highlight">
                                <input type="text" placeholder="Filter by Redirect" onChange={(e) => handleFilterChange(e, 'RedirectToNewTab')}
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
                              <div className="d-flex pb-2" style={{ justifyContent: 'space-evenly' }}>
                                <span >Active</span>  <span onClick={() => handleSortChange('IsActive')}><FontAwesomeIcon icon={faSort} /> </span></div>
                              <div className=" bd-highlight">
                                <input type="text" placeholder="Filter by Active" onChange={(e) => handleFilterChange(e, 'IsActive')}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                      e.preventDefault(); // Prevents the new line in textarea
                                    }
                                  }}
                                  className='inputcss' style={{ width: '100%' }} />
                              </div>
                            </div>
                          </th>
                          

                          <th style={{ textAlign: 'center', minWidth:'80px',maxWidth:'80px', borderBottomRightRadius: '0px', borderTopRightRadius: '0px' }}> <div className="d-flex flex-column bd-highlight pb-2">
                          
                                                          <div className="d-flex  pb-2" style={{ justifyContent: 'space-evenly' }}>  <span >Action</span> <div className="dropdown">
                          
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
                          {/* <th style={{ borderBottomRightRadius: '0px', minWidth: '50px', maxWidth: '50px', borderTopRightRadius: '0px' }}>
                            <div className="d-flex flex-column bd-highlight pb-2">
                              <div className="d-flex  pb-2" style={{ justifyContent: 'space-evenly' }}>  <span >Action</span> <div className="dropdown">
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
                          </th> */}
                        </tr>
                      </thead>
                      <tbody style={{ maxHeight: '5000px' }}>
                        {currentData.length === 0 ?
                          (
                            <div className="no-results" style={{ display: 'flex', justifyContent: 'center' }}>No results found</div>
                          )
                          :
                          currentData.map((item, index) => {
                            // const ImageUrl = item.BannerImage == undefined || item.BannerImage == null ? "" : JSON.parse(item.BannerImage);
                            return (
                              <tr key={index}>
                                <td style={{ minWidth: '40px', maxWidth: '40px' }}><div style={{ marginLeft: '10px' }} className='indexdesign'> {index + 1}</div>  </td>
                                <td style={{ minWidth: '120px', maxWidth: '120px' }}>{item.Title}</td>
                                <td style={{ minWidth: '120px', maxWidth: '120px' }}>{item.URL}</td>
                                <td style={{ minWidth: '120px', maxWidth: '120px' }}>{item?.Entity?.Entity}</td>
                               
                                {/* <td style={{ minWidth: '80px', maxWidth: '80px',textAlign:'center' }}><div className='btn btn-light newlight'> {moment(item.StartDate).format("DD-MMM-YYYY")} </div> </td>
                                <td style={{ minWidth: '80px', maxWidth: '80px',textAlign:'center' }}><div className='btn btn-light newlight'> {moment(item.EndDate).format("DD-MMM-YYYY")} </div> </td> */}
                                <td style={{ minWidth: '80px', maxWidth: '80px',textAlign:'center' }}>  <div className='btn btn-status newlight'> {item.RedirectToNewTab?"Yes":"No"} </div> </td>
                                <td style={{ minWidth: '80px', maxWidth: '80px',textAlign:'center' }}>  <div className='btn btn-status newlight'> {item.IsActive?"Yes":"No"} </div> </td>
                                <td style={{ minWidth: '80px', maxWidth: '80px' }} className="ng-binding">
                                  <div className="d-flex  pb-0" style={{ justifyContent: 'center', gap: '5px' }}>
                                    <span > <a className="action-icon text-primary" onClick={() => EditDelegate(item.ID)}>
                                      <img src={require('../../../CustomAsset/edit.png')} />
                                    </a> </span >
                                    <span>   <a className="action-icon text-danger" onClick={() => DeleteDelegate(item.ID)}>
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

const QuickLinksMaster = (props: any) => {
  return (
    <Provider>
      <QuickLinksMasterContext props={props} />
    </Provider>
  );
};

export default QuickLinksMaster
