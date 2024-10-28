import React, { useState, useEffect } from 'react';
import HorizontalNavbar from '../../horizontalNavBar/components/HorizontalNavBar';
import VerticalSideBar from '../../verticalSideBar/components/VerticalSideBar';
import { getSP } from '../loc/pnpjsConfig';
import { IApprovalConfigurationProps } from './IApprovalConfigurationProps';
import Provider from '../../../GlobalContext/provider';
import UserContext from '../../../GlobalContext/context';
import CustomBreadcrumb from '../../../CustomJSComponents/CustomBreadcrumb/CustomBreadcrumb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import "../../../CustomJSComponents/CustomTable/CustomTable.scss";
import "../../../CustomCss/mainCustom.scss";
import "../../verticalSideBar/components/VerticalSidebar.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../../../Assets/Figtree/Figtree-VariableFont_wght.ttf";
import { getEntity } from '../../../APISearvice/CustomService';
import Multiselect from 'multiselect-react-dropdown';
import "../components/ApprovalConfiguration.scss"
import {getLevel} from "../../../APISearvice/ApprovalService";

export const ApprovalConfigurationcontext = ({ props }: any) => {
  const sp = getSP();
  const { useHide }: any = React.useContext(UserContext);
  const context = React.useContext(UserContext);
  const { setUseId, useId }: any = context;
  const elementRef = React.useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const siteUrl = props.siteUrl;
  const [usersitem, setUsersArr] = useState<any[]>([]);
  const [entityOptions, setEntityOptions] = useState([]);

  // Load numLevels and rows from localStorage if available
  const [numLevels, setNumLevels] = useState(() => {
    getLevel(sp)
    const savedNumLevels = localStorage.getItem('savedNumLevels');
    return savedNumLevels ? JSON.parse(savedNumLevels) : 3; // Default to 3 levels if no saved data
  });

  const [rows, setRows] = useState(() => {
    const savedRows = localStorage.getItem('savedTableData');
    return savedRows ? JSON.parse(savedRows) : []; // Default to an empty array if no saved data
  });



  React.useEffect(() => {
    apiCall();
  }, [props]);

  const apiCall = async () => {
    setEntityOptions(await getEntity(sp)); // Load entities
    await fetchUserInformationList();
  };

  const fetchUserInformationList = async () => {
    try {
      const userList = await sp.web.lists
        .getByTitle("User Information List")
        .items.select("ID", "Title", "EMail", "Department", "JobTitle", "Picture")
        .filter("EMail ne null")();
      setUsersArr(userList);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Function to add a new row
  const addRow = (e: any) => {
    e.preventDefault();

    const newRow = {
      entity: '', // Default empty entity
      levels: Array(numLevels).fill([]), // Create an array for levels based on the current numLevels
      workflowType: '', // Empty workflowType
      rework: '' // Empty rework
    };

    // Add the new row to the rows array
    setRows((prevRows: any) => [...prevRows, newRow]);
  };

  // Save table data to localStorage


  // Function to add a new level column dynamically
  const addLevelColumn = (e: any) => {
    e.preventDefault();
    setNumLevels(numLevels + 1);
    setRows(rows.map((row: any) => ({
      ...row,
      levels: [...row.levels, []], // Add a new empty array for each level to handle multi-select
    })));
  };

  // Save table data to localStorage
  const saveTable = (e: any) => {
    e.preventDefault();
    localStorage.setItem('savedTableData', JSON.stringify(rows));
    localStorage.setItem('savedNumLevels', JSON.stringify(numLevels)); // Save the number of levels
    alert('Table data and levels saved to localStorage!');
  };


  // Prepare options for multiselect-react-dropdown
  const userOptions = usersitem.map((user) => ({
    id: user.EMail,  // We'll use the email as the ID
    name: user.Title // The display name
  }));

  const Breadcrumb = [
    {
      "MainComponent": "Settings",
      "MainComponentURl": "",
    },
    {
      "ChildComponent": "Approval Configuration",
      "ChildComponentURl": `${siteUrl}/SitePages/Approval.aspx`,
    },
  ];

  return (
    <div id="wrapper" ref={elementRef}>
      <div className="app-menu" id="myHeader">
        <VerticalSideBar _context={sp} />
      </div>
      <div className="content-page">
          <HorizontalNavbar  _context={sp} siteUrl={siteUrl}/>
        <div className="content mt-4" style={{ marginLeft: `${!useHide ? '240px' : '80px'}` }}>
          <div className="container-fluid paddb">
            <div className="row">
              <div className="col-lg-6 pt-3">
                <CustomBreadcrumb Breadcrumb={Breadcrumb} />
              </div>
              <div className="col-lg-6">
                <div className="d-flex flex-wrap align-items-center justify-content-end mt-3">
                  <a className="me-1" href={`${siteUrl}/SitePages/settings.aspx`}>
                    <div className="btn btn-secondary me-1 waves-effect waves-light">
                      <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                      Back
                    </div>
                  </a>
                  <a className="me-1" onClick={addRow}>
                    <div className="btn btn-primary waves-effect waves-light" style={{ background: '#1fb0e5' }}>
                      <FontAwesomeIcon icon={faPlusCircle} className="me-1" />
                      Row
                    </div>
                  </a>
                  <a className="me-1" onClick={addLevelColumn}>
                    <div className="btn btn-primary waves-effect waves-light" style={{ background: '#1fb0e5' }}>
                      <FontAwesomeIcon icon={faPlusCircle} className="me-1" />
                      Level Column
                    </div>
                  </a>
                </div>
              </div>
            </div>
            <div className="row col-md-12 m-0">
              <div className="card cardcss p-2">
                <div className="table-responsive">
                  <table className="mtable mt-0 table-centered table-nowrap table-borderless mb-0">
                    <thead>
                      <tr>
                        <th>Entity</th>
                        {[...Array(numLevels)].map((_, index) => (
                          <th key={index}>Level {index + 1}</th>
                        ))}
                        <th>Workflow Type</th>
                        <th>Rework</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row: any, rowIndex: any) => (
                        <tr key={rowIndex}>
                          <td>
                            <select
                              value={row.entity}
                              style={{ height: '40px'}}
                              onChange={(e) => {
                                const updatedRows = [...rows];
                                updatedRows[rowIndex].entity = e.target.value;
                                setRows(updatedRows);                               }}
                            >
                              <option value="" disabled>Select Entity</option>
                              {entityOptions.map((entity, index) => (
                                <option key={index} value={entity.id}>
                                  {entity.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          {row.levels.map((level: any, levelIndex: 0) => (
                            <td key={levelIndex}>
                              <Multiselect
                                options={userOptions}
                                displayValue="name"
                                selectedValues={level}
                                onSelect={(selectedList) => {
                                  const updatedRows = [...rows];
                                  updatedRows[rowIndex].levels[levelIndex] = selectedList;
                                  setRows(updatedRows);
                                }}
                                onRemove={(selectedList) => {
                                  const updatedRows = [...rows];
                                  updatedRows[rowIndex].levels[levelIndex] = selectedList;
                                  setRows(updatedRows);
                                }}
                              />
                            </td>
                          ))}
                          <td>
                            <input
                              type="text"
                              value={row.workflowType}
                              onChange={(e) => {
                                const updatedRows = [...rows];
                                updatedRows[rowIndex].workflowType = e.target.value;
                                setRows(updatedRows);
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={row.rework}
                              onChange={(e) => {
                                const updatedRows = [...rows];
                                updatedRows[rowIndex].rework = e.target.value;
                                setRows(updatedRows);
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-end mt-3">
                  <button className="btn btn-primary" onClick={saveTable}>Save Table</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ApprovalConfiguration: React.FC<IApprovalConfigurationProps> = (props) => (
  <Provider>
    <ApprovalConfigurationcontext props={props} />
  </Provider>
);

export default ApprovalConfiguration;
