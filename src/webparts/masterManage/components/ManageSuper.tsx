import * as React from 'react';
import { getSP } from '../loc/pnpjsConfig';
import { SPFI } from '@pnp/sp';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../CustomCss/mainCustom.scss";
import "../../verticalSideBar/components/VerticalSidebar.scss"
import VerticalSideBar from '../../verticalSideBar/components/VerticalSideBar';
import HorizontalNavbar from "../../horizontalNavBar/components/HorizontalNavBar";
import UserContext from '../../../GlobalContext/context';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../CustomCss/mainCustom.scss";
import "../../verticalSideBar/components/VerticalSidebar.scss"
import Provider from '../../../GlobalContext/provider';
import { useMediaQuery } from 'react-responsive';
import styles from './MasterManage.module.scss'
import Swal from 'sweetalert2';
import Select from "react-select";

import context from '../../../GlobalContext/context';
// import classNames from "classnames";
// import { useState, useEffect, useRef , useMemo } from "react";
// import JoditEditor from "jodit-react";
// import Jodit from 'jodit-react';
let selectedUsersForPermission: any[];
// let description:any;

interface ManageSuperProps {
  _context: any; // Ideally, use WebPartContext instead of `any`
  onButtonClick: () => void;
}
export const ManageSuper: React.FC<ManageSuperProps> = ({ _context, onButtonClick }) => {
  const sp: SPFI = getSP();
  const { useHide }: any = React.useContext(UserContext);
  const elementRef = React.useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const [selectedUser, setSelectedUser] = React.useState([]);
  const [refresh, setRefresh] = React.useState(false);
  const [activeComponent, setActiveComponent] = React.useState('');
  const [user, setUser] = React.useState<any[]>([]);
  const [Loading, setLoading] = React.useState(false);
  // const [description,setDescription]=React.useState('');
  console.log("selectedUser", selectedUser);
  //console.log("props", props);

  // React.useEffect(() => {
  //   console.log("hjhjhj");
  //   const test = sp.web.currentUser();
  //   // const fetchUserFromSelectedGroup = async () => {
  //   //   try {
  //   //     const usersFromDMSSuperAdmin = await sp.web.siteGroups.getByName('OESMembers').users();
  //   //     setSelectedUser(usersFromDMSSuperAdmin);
  //   //   } catch (error) {
  //   //     console.log("error from getting the users from the groups after selecting the groups", error);
  //   //   }
  //   // }
  //   // fetchUserFromSelectedGroup();
  // }, []);
  const fetchUserFromSelectedGroup = async () => {
    try {
      const usersFromDMSSuperAdmin = await sp.web.siteGroups.getByName('OESMembers').users();
      setSelectedUser(usersFromDMSSuperAdmin);
    } catch (error) {
      console.log("error from getting the users from the groups after selecting the groups", error);
    }
  };
  const handleDeleteUser = async (userId: any, UserTitle: any) => {
    console.log("UserId", userId);
    try {
      debugger
      const group = await sp.web.siteGroups.getByName('OESMembers');

      confirmDelete(group, userId, UserTitle)
    } catch (error) {
      console.error("Error removing user from group: ", error);
    }
  }

  const handleToggleAddUsers = () => {
    setActiveComponent("AddUser");
  }

  const handleUsersSelect = (selectedUsers: any) => {
    console.log("selectedUsers", selectedUsers);
    selectedUsersForPermission = selectedUsers;
  }

  React.useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
    console.log("ghghgjfrytrtdfg")
    const fetchUsers = async () => {
      const user = await sp.web.siteUsers();
      //const groups = await sp.web.siteGroups.get;
      //console.log(groups.map(g => g.Title)); // See if 'OESMembers' is in there
      const group = await sp.web.siteGroups.getByName('OESMembers');
      const group1 = await sp.web.siteGroups.getById(83);
      const usersInGroup = await group.users();
      //const usergroup = await sp.web.siteGroups.getByName('OESMembers').users();
      console.log("users fetch from the site", user, group, usersInGroup, group1);
      await fetchUserFromSelectedGroup();
      const usersArray = user.map((user) => (
        {
          id: String(user.Id),
          value: user.Title,
          email: user.Email,
          label: user.Title,
          loginName: user.LoginName
        }
      ))
      console.log("site users", usersArray);
      setUser(usersArray);
    }
    fetchUsers();
    // fetchUserFromSelectedGroup();

  }, [refresh])


  const handleAddUsers = async () => {
    console.log("selectedUsersForPermission", selectedUsersForPermission);
    // console.log("selectedGropuForPermission",props.selectedGropuForPermission.value);
    // console.log("selectedEntityForPermission",props.selectedEntityForPermission.value);

    if (selectedUsersForPermission === undefined || selectedUsersForPermission.length === 0) {
      checkValidation();
      return;
    }

    // New Code start
    // await Promise.all(selectedUsersForPermission.map(async (user: any) => {
    //   try {
    //     const userObj = await sp.web.ensureUser(user.email);
    //     const group = await sp.web.siteGroups.getByName("OESMembers");

    //     // 2. Get existing users in the group
    //     const existingUsers = await group.users();
    //     console.log("Existing users in group:", existingUsers);

    //     // 3. Remove each existing user (optional: filter who you want to remove)
    //     for (const user of existingUsers) {
    //       const group = await sp.web.siteGroups.getByName('OESMembers');
    //       await group.users.removeById(user.Id);
    //       //setRefresh(!refresh);
    //       // await sp.web.siteGroups.getById(group.Id).users.removeById(user.Id);
    //       console.log(`Removed user: ${user.Title}`);
    //     }
    //     console.log("userObj", userObj);
    //     const users = await sp.web.siteGroups.getByName('OESMembers').users.add(userObj.data.LoginName);
    //     console.log(`${user.email} added to the super admin group successfully.`, users);
    //   } catch (error) {
    //     console.error(`Failed to add ${user.email} to the group: `, error);
    //   }
    // }));
    try {
      const group = await sp.web.siteGroups.getByName("OESMembers");

      // 1. Get and remove all existing users (only once!)
      const existingUsers = await group.users();
      for (const user of existingUsers) {
        await group.users.removeById(user.Id);
        console.log(`Removed user: ${user.Title}`);
      }

      // 2. Add new selected users
      await Promise.all(
        selectedUsersForPermission.map(async (user: any) => {
          try {
            const userObj = await sp.web.ensureUser(user.email);
            await group.users.add(userObj.data.LoginName);
            console.log(`${user.email} added to the group successfully.`);
          } catch (error) {
            console.error(`Failed to add ${user.email} to the group:`, error);
          }
        })
      );

    } catch (error) {
      console.error("Error managing group users:", error);
    }

    selectedUsersForPermission = undefined;
    //   End
    onSuccess();
    setActiveComponent('');
    setRefresh(!refresh);

  }

  const handleBackToTable = () => {
    setActiveComponent('');
  }
  const onSuccess = () => {
    Swal.fire(`Users Added Successsfully`, "", "success");
  }
  const onRemove = (UserTitle: any) => {
    Swal.fire(`${UserTitle} Removed Successsfully`, "", "success");
  }
  const checkValidation = () => {
    Swal.fire("Please fill out the fields!", "All fields are required");
  }

  // Already present erro start
  // const alreadyPresent=()=>{
  // Swal.fire(`User Already Exist`, "Please Change the User", "warning");
  // }
  // End

  // Added confirm popup start
  const confirmDelete = (group: any, userId: any, userTitle: any) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Removed it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        await group.users.removeById(userId);
        setRefresh(!refresh);
        Swal.fire({
          title: "Removed!",
          text: `${userTitle} Suucessfuly Removed.`,
          icon: "success"
        });
      }
    });
  }
  //   End


  // Code for filter and search start
  const [filters, setFilters] = React.useState({
    SNo: '',
    Title: '',
    // Title: '',
    Email: '',
    Modified: '',
    Status: '',

    SubmittedDate: ''
  });
  const [sortConfig, setSortConfig] = React.useState({ key: '', direction: 'ascending' });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setFilters({
      ...filters,
      [field]: e.target.value,
    });
    console.log(filters, "filters filters")
  };

  const handleSortChange = (key: string) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const applyFiltersAndSorting = (data: any[]) => {
    const filteredData = data.filter((item, index) => {
      return (
        (filters.SNo === '' || String(index + 1).includes(filters.SNo)) &&
        (filters.Title === '' ||
          (item.Title && item.Title.toLowerCase().includes(filters.Title.toLowerCase()))) &&
        (filters.Email === '' ||
          (item.Email && item.Email.toLowerCase().includes(filters.Email.toLowerCase()))) &&
        (filters.Modified === '' ||
          (item.Editor.Title && item.Editor.Title.toLowerCase().includes(filters.Modified.toLowerCase()))) &&
        (filters.SubmittedDate === '' ||
          (item.Status && item.Status.toLowerCase().includes(filters.SubmittedDate.toLowerCase())))
      );
    });

    const naturalSort = (a: any, b: any) => {
      return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
    };

    const sortedData = filteredData.sort((a, b) => {
      if (sortConfig.key === 'SNo') {
        const aIndex = data.indexOf(a);
        const bIndex = data.indexOf(b);
        return sortConfig.direction === 'ascending' ? aIndex - bIndex : bIndex - aIndex;
      } else if (sortConfig.key) {
        const aValue = a[sortConfig.key] ? a[sortConfig.key].toLowerCase() : '';
        const bValue = b[sortConfig.key] ? b[sortConfig.key].toLowerCase() : '';
        return sortConfig.direction === 'ascending' ? naturalSort(aValue, bValue) : naturalSort(bValue, aValue);
      }
      return 0;
    });

    return sortedData;
  };

  const filteredUserData = applyFiltersAndSorting(selectedUser);
  // end

  // Add pagination start
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredUserData.length / itemsPerPage);

  const handlePageChange = (pageNumber: any) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredUserData.slice(startIndex, endIndex);

  interface PaginationProps {
    currentPage: number;
    totalPages: any;
    handlePageChange: any;
  }
  const Pagination = ({ currentPage, totalPages, handlePageChange }: PaginationProps) => {
    const pageLimit = 5; // Number of visible page items

    // Determine the start and end page based on the current page and total pages
    const startPage = Math.max(1, currentPage - Math.floor(pageLimit / 2));
    const endPage = Math.min(totalPages, startPage + pageLimit - 1);

    // Adjust start page if it's too close to the end
    const adjustedStartPage = Math.max(1, Math.min(startPage, totalPages - pageLimit + 1));

    // Create an array for the visible page numbers
    const visiblePages = Array.from(
      { length: Math.min(pageLimit, totalPages) },
      (_, index) => adjustedStartPage + index
    );

    return (
      <nav className="pagination-container">
        <ul className="pagination">
          {/* Previous Button */}
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <a
              className="page-link PreviousPage"
              onClick={() => handlePageChange(currentPage - 1)}
              aria-label="Previous"
            >
              «
            </a>
          </li>

          {/* Render visible page numbers */}
          {visiblePages.map((pageNumber) => (
            <li
              key={pageNumber}
              className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}
            >
              <a className="page-link" onClick={() => handlePageChange(pageNumber)}>
                {pageNumber}
              </a>
            </li>
          ))}

          {/* Next Button */}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <a
              className="page-link NextPage"
              onClick={() => handlePageChange(currentPage + 1)}
              aria-label="Next"
            >
              »
            </a>
          </li>
        </ul>
      </nav>
    );
  };
  // End
  return (
    <>

      {/* {activeComponent === '' && (
        
        <div className={styles.argform}>
          <div className='row'>
      //       <div className='col-md-7'>
      //         <div className='page-title fw-bold mb-0 font-16'>Manage OES User
      //         </div>
      //         {/* <div className='mb-2 mt-0'>
      //           <span className='text-muted font-14' style={{
      //             color: "Black"
      //           }}>User From Admin Group will have Full Control</span>
      //         </div> 
             </div>
      //       <div className="col-md-5 d-flex justify-content-end">
      //         <div className="d-flex gap-2">
      //           <button
      //             type="button"
      //             className="btn btn-primary adduserbtn"
      //             onClick={handleToggleAddUsers}
      //             style={{
      //               height: '40px',
      //               borderRadius: '4px',
      //               padding: '9px 10px'
      //             }}
      //           >
      //             Add User
      //           </button>
      //           <button
      //             type="button"
      //             className="btn btn-secondary"
      //             onClick={onButtonClick}
      //             style={{
      //               height: '40px',
      //               borderRadius: '4px',
      //               padding: '9px 10px'
      //             }}
      //           >
      //             Back
      //           </button>
      //         </div>
      //       </div>
      //     </div>
      //     <div style={{ padding: '15px' }} className={styles.container}>
      //       <table className="mtbalenew">
      //         <thead>
      //           <tr>
      //             <th style={{ minWidth: '20px', maxWidth: '20px' }}>S.No.</th>
      //             <th style={{ minWidth: '80px', maxWidth: '80px' }}>User</th>
      //             <th>Email</th>
      //             <th style={{ minWidth: '40px', maxWidth: '40px' }}>Action</th>
      //           </tr>
      //         </thead>
      //         <tbody>
      //           {currentData.map((item: any, index: any) => (
      //             <React.Fragment key={item.Id}>
      //               <tr>
      //                 <td style={{ minWidth: '20px', maxWidth: '20px' }}>
      //                   <span className='indexdesign'> {index + 1}</span>
      //                 </td>
      //                 <td style={{ minWidth: '80px', maxWidth: '80px' }}>
      //                   {item.Title || ''}
      //                 </td>
      //                 <td >
      //                   {item.Email || ''}
      //                 </td>
      //                 <td style={{ minWidth: '40px', maxWidth: '40px' }}>
      //                   <img
      //                     className={styles.deleteicon}
      //                     src={require("../../../CustomAsset/del.png")}
      //                     alt="Delete"
      //                     onClick={(event) => {
      //                       handleDeleteUser(item.Id, item.Title)
      //                     }}
      //                   />
      //                 </td>
      //               </tr>
      //             </React.Fragment>
      //           ))}
      //         </tbody>
      //       </table>
      //       <div className="d-flex justify-content-end mt-3">
      //         <Pagination
      //           currentPage={currentPage}
      //           totalPages={totalPages}
      //           handlePageChange={handlePageChange}
      //         />
      //       </div>

      //     </div>
      //   </div>
      // )} */}
      {activeComponent === '' && (
        Loading ? (
          <div
            style={{ minHeight: '100vh', marginTop: '100px' }}
            className="loadernewadd mt-10"
          >
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
        ) : (
          <div className={styles.argform}>
            <div className="row">
              <div className="col-md-7">
                <div className="page-title fw-bold mb-0 font-16">
                  Manage OES User
                </div>
              </div>
              <div className="col-md-5 d-flex justify-content-end">
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-primary adduserbtn"
                    onClick={handleToggleAddUsers}
                    style={{
                      height: '40px',
                      borderRadius: '4px',
                      padding: '9px 10px',
                      marginBottom: '10px',
                    }}
                  >
                    Add User
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onButtonClick}
                    style={{
                      height: '40px',
                      borderRadius: '4px',
                      padding: '9px 10px',
                    }}
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>

            <div style={{ padding: '15px' }} className={styles.container}>
              <table className={styles.customTable}>
                <thead>
                  <tr>
                    <th style={{ width: '50px' }}>S.No.</th>
                    <th style={{ width: '150px' }}>User</th>
                    <th style={{ width: '200px' }}>Email</th>
                    <th style={{ width: '80px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((item: any, index: number) => (
                    <tr key={item.Id}>
                      <td>
                        <span className="indexdesign">{index + 1}</span>
                      </td>
                      <td>{item.Title || ''}</td>
                      <td>{item.Email || ''}</td>
                      <td>
                        <img
                          className={styles.deleteicon}
                          src={require("../../../CustomAsset/del.png")}
                          alt="Delete"
                          onClick={() => handleDeleteUser(item.Id, item.Title)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>



              <div className="d-flex justify-content-end mt-3">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  handlePageChange={handlePageChange}
                />
              </div>
            </div>
          </div>
        )
      )}


      {activeComponent === "AddUser" &&
        (
          <div className={styles.argform}>
            <div className='row'>
              <div className='col-md-7'>



                <div className={styles.title}>Add OES User</div>
              </div>
              <div className='col-md-5 d-flex justify-content-end'>
                <div className='padd-right1 mt-0'>
                  <button style={{ display: "inline-block", minWidth: "auto" }} type='button' onClick={handleBackToTable} className={styles.backbuttonform}>
                    Back
                  </button>
                </div>
              </div>
            </div>
            <div style={{

              position: "relative",

              marginTop: "10px",
              padding: "20px",
              border: "2px solid #54ade0",
              borderRadius: "10px",
              background: "#fff",

            }}>
              <p style={{
                color: "Black",

              }}>Add Users</p>
              <div style={{
                gap: "30px",
                display: "flex"
              }}>
                <div style={{
                  width: "370px"
                }}>
                  <Select
                    isMulti
                    options={user}
                    onChange={(selected: any) =>
                      handleUsersSelect(selected)
                    }
                    placeholder="Select User..."
                    noOptionsMessage={() => "No User Found..."}
                  />
                </div>

                <div>
                  <button type='button' style={{ padding: '9px 10px', borderRadius: '4px' }} className='btn btn-primary' onClick={handleAddUsers}>
                    Add
                  </button>
                </div>
              </div>

            </div>
          </div>
        )
      }
    </>

  )
}
