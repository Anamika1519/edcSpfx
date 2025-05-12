import * as React from 'react';
import { getSP } from '../loc/pnpjsConfig';
import { SPFI } from '@pnp/sp';
import { IReportNavigationProps } from './IReportNavigationProps';
import Provider from '../../../GlobalContext/provider';
import VerticalSideBar from '../../verticalSideBar/components/VerticalSideBar';
import HorizontalNavbar from '../../horizontalNavBar/components/HorizontalNavBar';
import CustomBreadcrumb from '../../../CustomJSComponents/CustomBreadcrumb/CustomBreadcrumb';
import UserContext from '../../../GlobalContext/context';
import "bootstrap/dist/css/bootstrap.min.css";
// import "mdi/css/materialdesignicons.min.css"; // Import MDI icons
import "../../../CustomCss/mainCustom.scss";
import "../components/NCReport.scss";
import ChartComponent from './ChartComponent';
import DepartmentPieChart from './PieChart';
import CircularProgressBar from './ProgressBar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faSyncAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
const NCReport = ({ props }: any) => {

    const { useHide }: any = React.useContext(UserContext);
    const elementRef = React.useRef<HTMLDivElement>(null);
    const SiteUrl = props.siteUrl;
    const sp: SPFI = getSP();
    const [NCArray, setNCArray] = React.useState([]);
    const [PendingNCArray, setPendingNCArray] = React.useState(0);
    const [ClosedNCArray, setClosedNCArray] = React.useState(0);
    const [OpenNCArray, setOpenNCArray] = React.useState(0);
    const [UniqNCDept, setUniqNCDept] = React.useState([]);

    const Breadcrumb = [
        // {
        //     "MainComponent": "Home",
        //     "MainComponentURl": `${SiteUrl}/SitePages/Dashboard.aspx`
        // },
        {
            "MainComponent": "Reports",
            "MainComponentURl": `${SiteUrl}/SitePages/Reports.aspx`
        },
        {
            "ChildComponent": "Non Conformity Report",
            // "ChildComponentURl": `${SiteUrl}/SitePages/NonConformityReport.aspx`

        }
    ]


    React.useEffect(() => {
        ApiCall();
        const tableBody = document.querySelector('.mtable tbody');
        const tableHead = document.querySelector('.mtable thead') as HTMLElement;

        if (!tableBody || !tableHead) return;

        const handleScroll = () => {
            (tableHead as HTMLElement).style.left = `-${tableBody.scrollLeft}px`;
        };

        tableBody.addEventListener('scroll', handleScroll);
        tableBody.addEventListener('mouseover', () => {
            tableBody.addEventListener('scroll', handleScroll);
        });

        // Cleanup function to remove event listeners
        return () => {
            tableBody.removeEventListener('scroll', handleScroll);
            tableBody.removeEventListener('mouseover', () => {
                tableBody.removeEventListener('scroll', handleScroll);
            });
        };
    }, []);

    // Empty dependency array means this effect runs once on mount

    const ApiCall = async () => {
        let arr: any[] = [];
        await sp.web.lists.getByTitle("NonConformityList").items.select("*,Department/Title,PersonAssigned/Title,Category/Id,Category/Title,SubCategory/Id,SubCategory/Title,Location/Id,Location/Title").expand("Department,PersonAssigned,Category,SubCategory,Location").orderBy("Created", false)()


            // await sp.web.lists.getByTitle("NonConformityList").items.select("ID,ProblemDescription,Department/Department,Author/Title,Author/Id,Location/Location,SubCategory/SubCategory,Category/Category").expand("Author,Department,Location,SubCategory,Category").orderBy("Created", false)()
            .then((res: any) => {
                // console.log("Responce of data for get setting:", res);
                arr = res;

                // arr = res.filter((nav: any) => {

                //   return (!nav.EnableAudienceTargeting || (nav.EnableAudienceTargeting && nav.Audience && nav.Audience.some((nv1: any) => { return grptitle.includes(nv1.Title.toLowerCase()) || nv1.Id === currentUserId.Id; })))
                // }
                // )
            })
            .catch((error: any) => {
                console.log("Error fetching data: ", error);
            });

        setNCArray(arr);
        const pendingItems = arr.filter((item: any) => item.Status === "Pending");
        setPendingNCArray(pendingItems.length);

        const ClosedItems = arr.filter((item: any) => item.CloseOutStatus === "Close");
        setClosedNCArray(ClosedItems.length);

        const OpneItems = arr.filter((item: any) => item.CloseOutStatus === "Open");
        setOpenNCArray(OpneItems.length);

        const uniqueDepartments = arr.map((item: any) => ({ Title: item.Department?.Title }));
        setUniqNCDept(uniqueDepartments);

        // const uniqueDepartment = [...new Set(arr.map(item => item.Department?.Title))];
        // setUniqNCDept(uniqueDepartment);



    }


    return (
        <>

            <div className="col-lg-3">
                <CustomBreadcrumb Breadcrumb={Breadcrumb} />
            </div>
            {/*  */}


            <div className="row">
                <div className="col-md-6 col-xl-3">
                    <div className="widget-rounded-circle card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-4">
                                    <div className="avatar-lg rounded-circle bg-soft-success border-success border">
                                        <i className="fe-shopping-bag font-22 avatar-title text-success"></i>
                                    </div>
                                </div>
                                <div className="col-8">
                                    <div className="text-end">
                                        <h3 className="mt-1"><span>{NCArray.length}</span></h3>
                                        <p style={{ textAlign: 'right' }} className="text-muted text-right mb-1 text-truncate">
                                            Total Observations
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-xl-3">
                    <div className="widget-rounded-circle card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-4">
                                    <div className="avatar-lg rounded-circle bg-soft-secondary border-secondary border">
                                        <i className="fe-bar-chart-line font-22 avatar-title text-blue"></i>
                                    </div>
                                </div>
                                <div className="col-8">
                                    <div className="text-end">
                                        <h3 className="mt-1"><span>55</span></h3>
                                        <p style={{ textAlign: 'right' }} className="text-muted text-right mb-1 text-truncate">
                                            Active Observations
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-xl-3">
                    <div className="widget-rounded-circle card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-4">
                                    <div className="avatar-lg rounded-circle bg-soft-blue border-blue border">
                                        <i className="fe-bar-chart-line font-22 avatar-title text-blue"></i>
                                    </div>
                                </div>
                                <div className="col-8">
                                    <div className="text-end">
                                        <h3 className="mt-1"><span>{PendingNCArray}</span></h3>
                                        <p style={{ textAlign: 'right' }} className="text-muted mb-1 text-truncate">
                                            Pending Observations
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-xl-3">
                    <div className="widget-rounded-circle card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-4">
                                    <div className="avatar-lg rounded-circle bg-soft-pink border-pink border">
                                        <i className="fe-users font-22 avatar-title text-pink"></i>
                                    </div>
                                </div>
                                <div className="col-8">
                                    <div className="text-end">
                                        <h3 className="mt-1"><span>5</span></h3>
                                        <p style={{ textAlign: 'right' }} className="text-muted text-right mb-1 text-truncate">
                                            Priority Rating
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/*  */}
            {/* .... */}

            <div className="row">
                <div className="col-xl-4 col-md-6">
                    <div style={{ height: '420px' }} className="card">
                        <div className="card-body">
                            <div className="card-widgets">
                            {/* <a href="javascript: void(0);" data-bs-toggle="reload"><i className="mdi mdi-refresh"></i></a> */}
                            {/* <a href="javascript: void(0);" data-bs-toggle="reload"><FontAwesomeIcon icon={faSyncAlt} size="2x" /></a> */}
                                
                                {/* Plus Icon */}
                                 {/* <a data-bs-toggle="collapse" href="#cardCollpase1" role="button" aria-expanded="false" aria-controls="cardCollpase1"><FontAwesomeIcon icon={faPlus} size="2x" style={{ marginRight: '10px', color: 'green' }} /><FontAwesomeIcon icon={faMinus} size="2x" style={{ color: 'red' }} /></a> */}

                                

                                {/* Minus Icon */}
                                

                                {/* <FontAwesomeIcon icon={faTimes} size="2x" style={{ color: 'red' }} /> */}


                                {/* <a data-bs-toggle="collapse" href="#cardCollpase1" role="button" aria-expanded="false" aria-controls="cardCollpase1"><i className="mdi mdi-minus"></i></a> */}
                                {/* <a href="javascript: void(0);" data-bs-toggle="remove"><i className="mdi mdi-close"></i></a> */}
                                {/* <a href="javascript: void(0);" data-bs-toggle="remove"><FontAwesomeIcon icon={faTimes} size="2x" style={{ color: 'red' }} /></a> */}
                            </div>
                            <h4 className="header-title mb-0">Department Wise NC</h4>

                            <div id="cardCollpase1" className="collapse show">
                                <div className="text-center pt-3">
                                    <div className="row mt-2">
                                        {UniqNCDept.length > 0 && <DepartmentPieChart UniqNCDept={UniqNCDept} />}
                                        {/* <div className="col-3">
                                            <h3 style={{ textAlign: 'left' }} className="mb-1 font-12">
                                                <span style={{
                                                    backgroundColor: '#eee',
                                                    width: '10px',
                                                    height: '10px',
                                                    borderRadius: '1px',
                                                    float: 'left',
                                                    marginRight: '5px',
                                                    position: 'relative'
                                                }}></span>
                                                Finance
                                            </h3>
                                        </div> */}
                                        {/* {UniqNCDept.map((dept, index) => (
                                            <div key={index} style={{ padding: '0px', textAlign: 'left' }} className="col-3">
                                                <h3 className="mb-1 font-12">
                                                    <span style={{
                                                        backgroundColor: `hsl(${(index * 40) % 360}, 70%, 50%)`,
                                                        width: '10px',
                                                        height: '10px',
                                                        borderRadius: '1px',
                                                        float: 'left',
                                                        marginRight: '5px',
                                                        position: 'relative'
                                                    }}></span>
                                                    {dept}
                                                </h3>
                                            </div>
                                        ))} */}
                                        {/* <div style={{ padding: '0px', textAlign: 'left' }} className="col-3">
                                            <h3 className="mb-1 font-12">
                                                <span style={{
                                                    backgroundColor: '#6658dd',
                                                    width: '10px',
                                                    height: '10px',
                                                    borderRadius: '1px',
                                                    float: 'left',
                                                    marginRight: '5px',
                                                    position: 'relative'
                                                }}></span>
                                                HR
                                            </h3>
                                        </div>
                                        <div style={{ padding: '0px', textAlign: 'left' }} className="col-3">
                                            <h3 className="mb-1 font-12">
                                                <span style={{
                                                    backgroundColor: '#4fc6e1',
                                                    width: '10px',
                                                    height: '10px',
                                                    borderRadius: '1px',
                                                    float: 'left',
                                                    marginRight: '5px',
                                                    position: 'relative'
                                                }}></span>
                                                R&D
                                            </h3>
                                        </div> */}
                                    </div>


                                    {/* <div dir="ltr">
                                        <div id="lifetime-sales" data-colors="#4fc6e1,#6658dd,#eee,#747171" style={{ height: '270px' }} className="morris-chart mt-3"></div>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-4 col-md-6">
                    <div style={{ height: '420px' }} className="card">
                        <div className="card-body">
                            <div className="card-widgets">
                                <a href="javascript: void(0);" data-bs-toggle="reload"><i className="mdi mdi-refresh"></i></a>
                                <a data-bs-toggle="collapse" href="#cardCollpase3" role="button" aria-expanded="false" aria-controls="cardCollpase3"><i className="mdi mdi-minus"></i></a>
                                <a href="javascript: void(0);" data-bs-toggle="remove"><i className="mdi mdi-close"></i></a>
                            </div>
                            <h4 className="header-title mb-0">Category</h4>

                            <div id="cardCollpase3" className="collapse show">
                                <div className="text-center pt-3">
                                    <div className="row mt-2">
                                        <div className="col-xl-4">
                                            <h3 data-plugin="counterup">{NCArray.length}</h3>
                                            <p className="text-muted font-13 mb-0 text-truncate">Total NC</p>
                                        </div>
                                        <div className="col-4">
                                            <h3 data-plugin="counterup">{OpenNCArray}</h3>
                                            <p className="text-muted font-13 mb-0 text-truncate">Open</p>
                                        </div>
                                        <div className="col-4">
                                            <h3 data-plugin="counterup">{ClosedNCArray}</h3>
                                            <p className="text-muted font-13 mb-0 text-truncate">Close</p>
                                        </div>
                                    </div>
                                    <ChartComponent NCArray={NCArray} />

                                    <div dir="ltr">
                                        <div id="statistics-chart" data-colors="#747171" style={{ height: '230px' }} className="morris-chart mt-3"></div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-xl-4 col-md-12">
                <div style={{ height: '420px' }} className="card">
                    <div className="card-body">
                        <div className="card-widgets">
                            <a href="javascript: void(0);" data-bs-toggle="reload"><i className="mdi mdi-refresh"></i></a>
                            <a data-bs-toggle="collapse" href="#cardCollpase2" role="button" aria-expanded="false" aria-controls="cardCollpase2"><i className="mdi mdi-minus"></i></a>
                            <a href="javascript: void(0);" data-bs-toggle="remove"><i className="mdi mdi-close"></i></a>
                        </div>
                        <h4 className="header-title mb-0">Observation Status</h4>

                        <div id="cardCollpase2" className="collapse show">
                            <div className="new">


                                <div className="widget-chart text-center" dir="ltr">
                                    <CircularProgressBar value={OpenNCArray === 0
                                        ? 0
                                        : parseFloat(((OpenNCArray / NCArray.length) * 100).toFixed(2))} />

                                    {/* <div id="total-revenue" className="mt-4" data-colors="#d03f36"></div> */}





                                    <div className="row mt-3">
                                        <div className="col-4">
                                            <p className="text-muted font-15 mb-1 text-truncate">Total</p>
                                            <h4>100%</h4>
                                        </div>
                                        <div className="col-4">
                                            <p className="text-muted font-15 mb-1 text-truncate">  Open</p>
                                            {/* <h4>68%</h4> */}
                                            <h4>{OpenNCArray === 0
                                                ? "0%"
                                                : `${((OpenNCArray / NCArray.length) * 100).toFixed(2)}%`}</h4>
                                        </div>
                                        <div className="col-4">
                                            <p className="text-muted font-15 mb-1 text-truncate">Close</p>
                                            {/* <h4>32%</h4> */}
                                            <h4>{ClosedNCArray === 0
                                                ? "0%"
                                                : `${((ClosedNCArray / NCArray.length) * 100).toFixed(2)}%`}</h4>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            {/* <div style={{ visibility: 'hidden', position: 'absolute' }} className="text-center  pt-3">
                                <div className="row mt-2">

                                    <div className="col-6">
                                        <h3 data-plugin="counterup">45%</h3>
                                        <p className="text-muted font-13 mb-0 text-truncate">Open </p>
                                    </div>
                                    <div className="col-6">
                                        <h3 data-plugin="counterup">55%</h3>
                                        <p className="text-muted font-13 mb-0 text-truncate">Close</p>
                                    </div>
                                </div> 

                                <div dir="ltr">
                                    <div id="income-amounts" data-colors="#747171,#e3eaef" style={{ height: '230px' }} className="morris-chart mt-3"></div>
                                </div>
                                <div dir="ltr">
                                    <div id="lifetime-sales" data-colors="#4fc6e1,#6658dd,#eee,#747171" style={{ height: '270px' }} className="morris-chart mt-3"></div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>








            <div className="row">
                <div className="col-12">
                    {/* Portlet card */}
                    <div className="card">
                        <div className="card-body">
                            <div className="card-widgets">
                                <a href="javascript: void(0);" data-bs-toggle="reload"><i className="mdi mdi-refresh"></i></a>
                                <a data-bs-toggle="collapse" href="#cardCollpase4" role="button" aria-expanded="false" aria-controls="cardCollpase4"><i className="mdi mdi-minus"></i></a>
                                <a href="javascript: void(0);" data-bs-toggle="remove"><i className="mdi mdi-close"></i></a>
                            </div>
                            <h4 className="header-title mb-0">Details</h4>

                            <div id="cardCollpase4" className="collapse show">
                                <div style={{ display: 'grid' }} className="table-responsive pt-3">
                                    <table className="mtable table-centered table-nowrap table-borderless mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th style={{ minWidth: '50px', maxWidth: '50px' }}>S.No</th>
                                                <th style={{ minWidth: '110px', maxWidth: '110px' }}>Department</th>
                                                <th style={{ minWidth: '110px', maxWidth: '110px' }}>Location</th>
                                                <th style={{ minWidth: '120px', maxWidth: '120px' }}>Date</th>
                                                <th style={{ minWidth: '110px', maxWidth: '110px' }}>Category</th>
                                                <th style={{ minWidth: '110px', maxWidth: '110px' }}>Sub Category</th>
                                                <th style={{ minWidth: '110px', maxWidth: '110px' }}>Criteria</th>
                                                {/* <th style={{ minWidth: '175px', maxWidth: '175px' }}>NC/Observation Detail</th>
                                                <th style={{ minWidth: '140px', maxWidth: '140px' }}>Catogaries of NCR</th>
                                                <th style={{ minWidth: '215px', maxWidth: '215px' }}>Corrective Action Taken Date</th>
                                                <th style={{ minWidth: '140px', maxWidth: '140px' }}>Catogaries of NCR</th> */}
                                                <th style={{ minWidth: '100px', maxWidth: '100px' }}>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {NCArray.map((num, index) => (
                                                <tr key={num}>
                                                    <td style={{ minWidth: '50px', maxWidth: '50px' }}>{index + 1}</td>
                                                    <td style={{ minWidth: '110px', maxWidth: '110px' }}>{num.Department?.Title}</td>
                                                    <td style={{ minWidth: '110px', maxWidth: '110px' }}>{num.Location?.map((cat: any) => cat.Title).join(', ')}</td>
                                                    <td style={{ minWidth: '120px', maxWidth: '120px' }}>
                                                        <button type="button" className="btn btn-outline-light rounded-pill waves-effect">{num.Date}</button>
                                                    </td>
                                                    <td style={{ minWidth: '110px', maxWidth: '110px' }}>
                                                        {num.Category?.map((cat: any) => cat.Title).join(', ')}
                                                    </td>
                                                    <td style={{ minWidth: '110px', maxWidth: '110px' }}>
                                                        {num.SubCategory?.map((cat: any) => cat.Title).join(', ')}
                                                    </td>
                                                    <td style={{ minWidth: '110px', maxWidth: '110px' }}>{num.Criteria}</td>
                                                    {/* <td style={{ minWidth: '175px', maxWidth: '175px' }}>Lorem ipsum</td>
                                                    <td style={{ minWidth: '140px', maxWidth: '140px' }}>Lorem ipsum</td>
                                                    <td style={{ minWidth: '215px', maxWidth: '215px' }}>Lorem ipsum</td>
                                                    <td style={{ minWidth: '140px', maxWidth: '140px' }}>Lorem ipsum</td> */}
                                                    <td style={{ minWidth: '100px', maxWidth: '100px' }}>
                                                        <span className="badge bg-soft-info text-info p-1">{num.Status}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div> {/* .table-responsive */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>




            {/* /........... */}


        </>
    )
}

// const NCReport: React.FC<IReportNavigationProps> = (props) => {
//     return (
//         <Provider>
//             <NCReportContext props={props} />
//         </Provider>
//     )
// }


export default NCReport
