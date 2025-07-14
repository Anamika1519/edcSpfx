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
import { faMinus, faPlus, faSort, faSyncAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ArrowSortDownLinesRegular, ArrowSortUpLinesRegular } from '@fluentui/react-icons';
// import Select from '@mui/material/Select';
import Select from 'react-select';
const NCReport = ({ props }: any) => {

    const { useHide }: any = React.useContext(UserContext);
    const elementRef = React.useRef<HTMLDivElement>(null);
    const SiteUrl = props.siteUrl;
    const sp: SPFI = getSP();
    const [NClistArray, setNClistArray] = React.useState([]); //main array
    const [BarChartArr, setBarChartArr] = React.useState([]); //main array




    const [TotalNCType, setTotalNCType] = React.useState(0); // total NC
    const [TotalObservationType, setTotalObservationType] = React.useState(0); // total Observation


    const [PendingNCArray, setPendingNCArray] = React.useState(0); // active NC
    const [ClosedNCArray, setClosedNCArray] = React.useState(0); // closed NC

    const [PendingObservationArray, setPendingObservationArray] = React.useState(0);//active Observation
    const [ClosedObservationArray, setClosedObservationArray] = React.useState(0);//closed Observation


    const [OpenNCArray, setOpenNCArray] = React.useState(0);
    const [UniqNCDept, setUniqNCDept] = React.useState([]);


    const [error, setError] = React.useState<string>('');
    const [sortConfig, setSortConfig] = React.useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);
    const [columnFilters, setColumnFilters] = React.useState<Record<string, string>>({});
    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const rowsPerPage = 10;



    // Dropdown states
    const [selectedStatus, setSelectedStatus] = React.useState(null);
    const [selectedType, setSelectedType] = React.useState(null);
    const [selectedDepartment, setSelectedDepartment] = React.useState(null);
    const [selectedCategory, setSelectedCategory] = React.useState(null);
    const [selectedSubCategory, setSelectedSubCategory] = React.useState(null);
    const [selectedLocation, setSelectedLocation] = React.useState(null);
    const [selectedReportCode, setSelectedReportCode] = React.useState(null);
    const [selectedNCObservation, setSelectedNCObservation] = React.useState(null);


    const [Department, setDepartment] = React.useState([]); // Department master list
    const [Category, setCategory] = React.useState([]);
    const [SubCategoryOptions, setSubCategoryOptions] = React.useState([]);
    const [Location, setLocation] = React.useState([]);
    const [reportCodeOptions, setreportCodeOptions] = React.useState([]);
    const [ncObservationOptions, setncObservationOptions] = React.useState([]);


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
    ];

    const columns = [
        { key: 'NCRNo', displayName: 'NCR No.' },
        { key: 'Date', displayName: 'Date' },
        { key: 'Department.Title', displayName: 'Department' },
        { key: 'Category', displayName: 'Category' },
        { key: 'SubCategory', displayName: 'Sub Category' },
        { key: 'Location', displayName: 'Location' },
        { key: 'ProblemDescription', displayName: 'Problem Description' },
        { key: 'PersonAssigned.Title', displayName: 'Person Assigned' },
        { key: 'Correctionproblem', displayName: 'Correction' },
        { key: 'Deadlineforcompletion', displayName: 'Deadline For Completion' },
        { key: 'RootCause', displayName: 'Root Cause' },
        { key: 'CorrectiveAction', displayName: 'Corrective Action' },
        { key: 'CloseOutStatus', displayName: 'Close Out Status' },
        { key: 'Status', displayName: 'Status' }
    ];


    // Dropdown options
    const statusOptions = [
        { value: 'Pending', label: 'Pending' },
        { value: 'Approved', label: 'Approved' },
        { value: 'Rework', label: 'Rework' },
        { value: 'Rejected', label: 'Rejected' }
    ];

    const typeOptions = [
        { value: 'NC', label: 'NC' },
        { value: 'Observation', label: 'Observation' },

    ];

    // const reportCodeOptions = [
    //     { value: 'rep001', label: 'REP-001' },
    //     { value: 'rep002', label: 'REP-002' },
    //     { value: 'rep003', label: 'REP-003' },
    //     { value: 'rep004', label: 'REP-004' }
    // ];

    // const ncObservationOptions = [
    //     { value: 'nc001', label: 'NC-001' },
    //     { value: 'nc002', label: 'NC-002' },
    //     { value: 'nc003', label: 'NC-003' },
    //     { value: 'nc004', label: 'NC-004' }
    // ];



    React.useEffect(() => {
        ApiCall();
        fetchDepartment();
        fetchCategory();
        fetchSubCategories();
        fetchLocation();
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
        await sp.web.lists.getByTitle("NonConformityList").items.select("*,Department/Title,Department/ID,PersonAssigned/Title,Category/Id,Category/Title,SubCategory/Id,SubCategory/Title,Location/Id,Location/Title").expand("Department,PersonAssigned,Category,SubCategory,Location").orderBy("Created", false)()


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

        setNClistArray(arr);

        const categoryOptions1 = arr.map((cat: any) => ({
            value: cat.ID,
            label: cat.NCRNo
        }));
        setreportCodeOptions(categoryOptions1);

        const categoryOptions2 = arr.map((cat: any) => ({
            value: cat.ID,
            label: cat.NCNumber
        }));
        setncObservationOptions(categoryOptions2);

        //total

        setTotalNCType(arr.filter((item: any) => item.NCType === "NC").length); // total NC Type

        setTotalObservationType(arr.filter((item: any) => item.NCType === "Observation").length); // total Observation Type


        //Active/Open NC type
        const pendingItems = arr.filter((item: any) => (item.Status === "Pending" || item.Status === "Save as Draft" || item.Status === "Rework") && item.NCType === "NC"); // active NC
        setPendingNCArray(pendingItems.length);

        //Closed NC type
        const ClosedItems = arr.filter((item: any) => (item.Status === "Approved" || item.Status === "Rejected") && item.NCType === "NC");
        setClosedNCArray(ClosedItems.length);

        //Active/Open Observation type
        const pendingItems1 = arr.filter((item: any) => (item.Status === "Pending" || item.Status === "Save as Draft" || item.Status === "Rework") && item.NCType === "Observation");
        setPendingObservationArray(pendingItems1.length);
        //Closed Observation type
        const ClosedItems1 = arr.filter((item: any) => (item.Status === "Approved" || item.Status === "Rejected") && item.NCType === "Observation");
        setClosedObservationArray(ClosedItems1.length);

        // const OpneItems = arr.filter((item: any) => item.CloseOutStatus === "Open");
        // setOpenNCArray(OpneItems.length);

        const uniqueDepartments = arr.map((item: any) => ({ Title: item.Department?.Title }));
        setUniqNCDept(uniqueDepartments);

        // const uniqueDepartment = [...new Set(arr.map(item => item.Department?.Title))];
        // setUniqNCDept(uniqueDepartment);

        // .............

        const openStatuses = ['Rework', 'Save as Draft', 'Pending'];
        const closedStatuses = ['Approved', 'Rejected'];
        const groupedData: { [key: string]: { name: string; total: number; open: number; closed: number } } = {};

        arr.forEach(item => {
            const status = item.Status;
            const categories = item.Category || [];

            categories.forEach((cat: any) => {
                const category = cat.Title;

                if (!groupedData[category]) {
                    groupedData[category] = { name: category, total: 0, open: 0, closed: 0 };
                }

                groupedData[category].total += 1;

                if (openStatuses.includes(status)) {
                    groupedData[category].open += 1;
                } else if (closedStatuses.includes(status)) {
                    groupedData[category].closed += 1;
                }
            });
        });

        const finalChartData = Object.values(groupedData);
        setBarChartArr(finalChartData);

    }

    const fetchDepartment = async () => {
        try {
            const departments = await sp.web.lists.getByTitle("DepartmentMasterList").items.select("Title,ID").orderBy("Title", true)();
            const departmentOptions = departments.map((dept: any) => ({
                value: dept.ID,
                label: dept.Title
            }));
            setDepartment(departmentOptions);
        } catch (error) {
            console.error("Error fetching department list:", error);
            setDepartment([]);
        }
    };

    const fetchCategory = async () => {
        try {
            const categories = await sp.web.lists.getByTitle("NCCategoryMasterList").items.select("Title,ID").orderBy("Title", true)();
            const categoryOptions = categories.map((cat: any) => ({
                value: cat.ID,
                label: cat.Title
            }));
            setCategory(categoryOptions);
        } catch (error) {
            console.error("Error fetching category list:", error);
            setCategory([]);
        }
    };

    const fetchSubCategories = async () => {
        try {
            const items = await sp.web.lists.getByTitle("NCSubCategoryMasterList").items.select("Title,ID")();
            const options = items.map(item => ({
                value: item.ID,
                label: item.Title
            }));
            setSubCategoryOptions(options);
        } catch (error) {
            console.error("Error fetching subcategories:", error);
            setSubCategoryOptions([]);
        }
    };

    const fetchLocation = async () => {
        try {
            const locations = await sp.web.lists.getByTitle("NCLocationMasterList").items.select("Title,ID").orderBy("Title", true)();
            const locationOptions = locations.map((loc: any) => ({
                value: loc.ID,
                label: loc.Title
            }));
            setLocation(locationOptions);
        } catch (error) {
            console.error("Error fetching location list:", error);
            setLocation([]);
        }
    };



    const getNestedValue = (item: any, key: string) => {
        const keys = key.split('.');
        let value = item;

        for (const k of keys) {
            value = value?.[k];
        }

        if (Array.isArray(value)) {
            return value.map((v) => v.Title).join(', ');
        }

        if (typeof value === 'string' && value.includes('T') && !isNaN(Date.parse(value))) {
            const date = new Date(value);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }

        return value ? value.toString() : '';
    };

    const handleColumnFilterChange = (columnKey: string, value: string) => {
        setColumnFilters(prev => ({
            ...prev,
            [columnKey]: value.toLowerCase()
        }));
    };

    const requestSort = (key: string) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortedAndFilteredItems = () => {
        let filteredItems = [...NClistArray];

        // Apply column filters
        filteredItems = filteredItems.filter((item, itemIndex) => {
            return Object.entries(columnFilters).every(([columnKey, filterValue]) => {
                if (!filterValue) return true;

                // Exact match for S.No.
                if (columnKey === 'S.No') {
                    return (itemIndex + 1).toString() === filterValue;
                }

                const value = getNestedValue(item, columnKey);
                return value.toLowerCase().includes(filterValue);
            });
        });

        // Apply sorting
        if (sortConfig !== null) {
            filteredItems.sort((a, b) => {
                const aValue = getNestedValue(a, sortConfig.key);
                const bValue = getNestedValue(b, sortConfig.key);

                if (sortConfig.key === 'Date' || sortConfig.key === 'Deadlineforcompletion') {
                    const aDate = new Date(aValue);
                    const bDate = new Date(bValue);
                    return sortConfig.direction === 'ascending' ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime();
                }

                if (sortConfig.key === 'NCRNo' || sortConfig.key === 'S.No') {
                    return sortConfig.direction === 'ascending'
                        ? Number(aValue) - Number(bValue)
                        : Number(bValue) - Number(aValue);
                }

                if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }

        return filteredItems;
    };

    const sortedAndFilteredItems = getSortedAndFilteredItems();
    const totalPages = Math.ceil(sortedAndFilteredItems.length / rowsPerPage);

    // Get current rows
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = sortedAndFilteredItems.slice(indexOfFirstRow, indexOfLastRow);

    // Change page
    const paginate = (pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5; // Number of page buttons to show

        if (totalPages <= maxVisiblePages) {
            // Show all pages if total pages is less than max visible
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Show sliding window of page numbers
            let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
            let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

            if (endPage - startPage + 1 < maxVisiblePages) {
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
            }

            // Always show first page
            if (startPage > 1) {
                pageNumbers.push(1);
                if (startPage > 2) {
                    pageNumbers.push('...');
                }
            }

            // Add middle pages
            for (let i = startPage; i <= endPage; i++) {
                if (i > 0 && i <= totalPages) {
                    pageNumbers.push(i);
                }
            }

            // Always show last page
            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    pageNumbers.push('...');
                }
                pageNumbers.push(totalPages);
            }
        }

        return pageNumbers;
    };

    const handleFilterChange = async (selectedOption: any, field: string) => {
        let filteredItems;

        let filteredItemsMain;
        filteredItemsMain = NClistArray;
        // let groupedData;

        const openStatuses = ['Rework', 'Save as Draft', 'Pending'];
        const closedStatuses = ['Approved', 'Rejected'];

        const isStatusSelected = selectedStatus !== null && selectedStatus !== undefined;
        const isTypeSelected = selectedType !== null && selectedType !== undefined;
        const isDepartmentSelected = selectedDepartment !== null && selectedDepartment !== undefined;
        const isCategorySelected = selectedCategory !== null && selectedCategory !== undefined;
        const isSubCategorySelected = selectedSubCategory !== null && selectedSubCategory !== undefined;
        const isLocationSelected = selectedLocation !== null && selectedLocation !== undefined;
        const isReportCodeSelected = selectedReportCode !== null && selectedReportCode !== undefined;
        const isNCObservationSelected = selectedNCObservation !== null && selectedNCObservation !== undefined;

        switch (field) {
            case 'status': setSelectedStatus(selectedOption); break;
            case 'type': setSelectedType(selectedOption); break;

            case 'department': setSelectedDepartment(selectedOption); break;

            case 'category': setSelectedCategory(selectedOption); break;
            case 'subcategory': setSelectedSubCategory(selectedOption); break;
            case 'location': setSelectedLocation(selectedOption); break;
            case 'reportcode': setSelectedReportCode(selectedOption); break;
            case 'ncobservation': setSelectedNCObservation(selectedOption); break;
        }

        if ((isStatusSelected || field === "status")) {
            if(selectedOption)
            filteredItemsMain = filteredItemsMain.filter((item: any) => item.Status === selectedOption?.value || item.Status === selectedStatus?.value);

        }
        if ((isTypeSelected || field === "type")) {
            if(selectedOption)
            filteredItemsMain = filteredItemsMain.filter((item: any) => item.NCType === selectedOption?.value || item.NCType === selectedType?.value);

        }
        if ((isDepartmentSelected || field === "department")) {
            if(selectedOption)
            filteredItemsMain = filteredItemsMain.filter((item: any) => item.DepartmentId === selectedOption?.value ||  item.DepartmentId === selectedDepartment?.value);

        }
        if ((isCategorySelected || field === "category"))  {
            if(selectedOption){

                filteredItemsMain = filteredItemsMain.filter((item: any) =>
                    item.CategoryId && item.CategoryId.some((categoryId: any) => categoryId === selectedOption?.value || categoryId === selectedCategory?.value)
                );

            }

           

        }
        if ((isSubCategorySelected || field === "subcategory")) {

            if(selectedOption){
                filteredItemsMain = filteredItemsMain.filter((item: any) =>
                    item.SubCategoryId && item.SubCategoryId.some((categoryId: any) => categoryId === selectedOption?.value || categoryId === selectedSubCategory?.value)
                );
            }

           

        }
        if ((isLocationSelected || field === "location")) {
           
            if(selectedOption)
            filteredItemsMain = filteredItemsMain.filter((item: any) => item.LocationId === selectedOption?.value || item.LocationId === selectedLocation?.value);


        }
        if((isTypeSelected || field === "reportcode")){
           
            if(selectedOption)
            filteredItemsMain = filteredItemsMain.filter((item: any) => item.ID === selectedOption?.value || item.ID === selectedReportCode?.value);

        }
        if((isTypeSelected || field === "ncobservation")){

            if(selectedOption)
            filteredItemsMain = filteredItemsMain.filter((item: any) => item.ID === selectedOption?.value || item.ID === selectedNCObservation.value);

        }

        // filteredItems = NClistArray.filter((item: any) => item.Status === selectedOption.value);

        //// **********************  /////////////

        const uniqueDepartments = filteredItemsMain.map((item: any) => ({ Title: item.Department?.Title }));
        // setUniqNCDept(uniqueDepartments);
        setUniqNCDept([...uniqueDepartments]);
        const groupedData: { [key: string]: { name: string; total: number; open: number; closed: number } } = {};

        filteredItemsMain.forEach(item => {
            const status = item.Status;
            const categories = item.Category || [];

            categories.forEach((cat: any) => {
                const category = cat.Title;

                if (!groupedData[category]) {
                    groupedData[category] = { name: category, total: 0, open: 0, closed: 0 };
                }

                groupedData[category].total += 1;

                if (openStatuses.includes(status)) {
                    groupedData[category].open += 1;
                } else if (closedStatuses.includes(status)) {
                    groupedData[category].closed += 1;
                }
            });
        });

        const finalChartData = Object.values(groupedData);
        setBarChartArr([...finalChartData]);




        //Active/Open NC type
        const pendingItems = filteredItemsMain.filter((item: any) => (item.Status === "Pending" || item.Status === "Save as Draft" || item.Status === "Rework") && item.NCType === "NC"); // active NC
        setPendingNCArray(pendingItems.length);

        //Closed NC type
        const ClosedItems = filteredItemsMain.filter((item: any) => (item.Status === "Approved" || item.Status === "Rejected") && item.NCType === "NC");
        setClosedNCArray(ClosedItems.length);

        //Active/Open Observation type
        const pendingItems1 = filteredItemsMain.filter((item: any) => (item.Status === "Pending" || item.Status === "Save as Draft" || item.Status === "Rework") && item.NCType === "Observation");
        setPendingObservationArray(pendingItems1.length);
        //Closed Observation type
        const ClosedItems1 = filteredItemsMain.filter((item: any) => (item.Status === "Approved" || item.Status === "Rejected") && item.NCType === "Observation");
        setClosedObservationArray(ClosedItems1.length);

        //// **********************  /////////////


        // switch (field) {
        //     case 'status': setSelectedStatus(selectedOption);

        //      filteredItems = NClistArray.filter((item: any) => item.Status === selectedOption.value);

        //         const uniqueDepartments = filteredItems.map((item: any) => ({ Title: item.Department?.Title }));
        //         // setUniqNCDept(uniqueDepartments);
        //         setUniqNCDept([...uniqueDepartments]);
        //         const groupedData: { [key: string]: { name: string; total: number; open: number; closed: number } } = {};

        //         filteredItems.forEach(item => {
        //             const status = item.Status;
        //             const categories = item.Category || [];

        //             categories.forEach((cat : any) => {
        //               const category = cat.Title;

        //               if (!groupedData[category]) {
        //                 groupedData[category] = { name: category, total: 0, open: 0, closed: 0 };
        //               }

        //               groupedData[category].total += 1;

        //               if (openStatuses.includes(status)) {
        //                 groupedData[category].open += 1;
        //               } else if (closedStatuses.includes(status)) {
        //                 groupedData[category].closed += 1;
        //               }
        //             });
        //           });

        //           const finalChartData = Object.values(groupedData);
        //           setBarChartArr([...finalChartData]);

        //         // //Active/Open NC type
        //         // const pendingItems = filteredItems.filter((item: any) => item.NCType === "NC"); // active NC
        //         // setPendingNCArray(pendingItems.length);

        //         // //Closed NC type
        //         // const ClosedItems = filteredItems.filter((item: any) => item.NCType === "NC");
        //         // setClosedNCArray(ClosedItems.length);


        //         // //Active/Open Observation type
        //         // const pendingItems1 = filteredItems.filter((item: any) => item.NCType === "Observation");
        //         // setPendingObservationArray(pendingItems1.length);
        //         // //Closed Observation type
        //         // const ClosedItems1 = filteredItems.filter((item: any) => item.NCType === "Observation");
        //         // setClosedObservationArray(ClosedItems1.length);
        //         break;


        //     case 'type': setSelectedType(selectedOption);

        //         //Active/Open NC type
        //         // const pendingItems = NClistArray.filter((item: any) => (item.Status === "Pending" || item.Status === "Save as Draft" || item.Status === "Rework") && item.NCType === "NC"); // active NC
        //         // setPendingNCArray(pendingItems.length);

        //         // //Closed NC type
        //         // const ClosedItems = NClistArray.filter((item: any) => (item.Status === "Approved" || item.Status === "Rejected") && item.NCType === "NC");
        //         // setClosedNCArray(ClosedItems.length);

        //         filteredItems = NClistArray.filter((item: any) => item.NCType === selectedOption.value);
        //         const groupedData1: { [key: string]: { name: string; total: number; open: number; closed: number } } = {};


        //         const uniqueDepartments1 = filteredItems.map((item: any) => ({ Title: item.Department?.Title }));
        //         // setUniqNCDept(uniqueDepartments);
        //         setUniqNCDept([...uniqueDepartments1]);

        //          filteredItems.forEach(item => {
        //                 const status = item.Status;
        //                 const categories = item.Category || [];

        //                 categories.forEach((cat : any) => {
        //                   const category = cat.Title;

        //                   if (!groupedData1[category]) {
        //                     groupedData1[category] = { name: category, total: 0, open: 0, closed: 0 };
        //                   }

        //                   groupedData1[category].total += 1;

        //                   if (openStatuses.includes(status)) {
        //                     groupedData1[category].open += 1;
        //                   } else if (closedStatuses.includes(status)) {
        //                     groupedData1[category].closed += 1;
        //                   }
        //                 });
        //               });

        //               const finalChartData1 = Object.values(groupedData1);
        //               setBarChartArr([...finalChartData1]);

        //         break;


        //         case 'department': setSelectedDepartment(selectedOption);

        //         filteredItems = NClistArray.filter((item: any) => item.DepartmentId === selectedOption.value);
        //         const groupedData2: { [key: string]: { name: string; total: number; open: number; closed: number } } = {};

        //         const uniqueDepartments2 = filteredItems.map((item: any) => ({ Title: item.Department?.Title }));
        //         // setUniqNCDept(uniqueDepartments);
        //         setUniqNCDept([...uniqueDepartments2]);

        //         filteredItems.forEach(item => {
        //             const status = item.Status;
        //             const categories = item.Category || [];

        //             categories.forEach((cat : any) => {
        //               const category = cat.Title;

        //               if (!groupedData2[category]) {
        //                 groupedData2[category] = { name: category, total: 0, open: 0, closed: 0 };
        //               }

        //               groupedData2[category].total += 1;

        //               if (openStatuses.includes(status)) {
        //                 groupedData2[category].open += 1;
        //               } else if (closedStatuses.includes(status)) {
        //                 groupedData2[category].closed += 1;
        //               }
        //             });
        //           });

        //           const finalChartData2 = Object.values(groupedData2);
        //           setBarChartArr([...finalChartData2]);

        //         break;

        //         case 'category': setSelectedCategory(selectedOption);
        //         filteredItems = NClistArray.filter((item: any) => 
        //             item.CategoryId && item.CategoryId.some((categoryId: any) => categoryId === selectedOption.value)
        //         );
        //         const groupedData3: { [key: string]: { name: string; total: number; open: number; closed: number } } = {};

        //         const uniqueDepartments3 = filteredItems.map((item: any) => ({ Title: item.Department?.Title }));
        //         // setUniqNCDept(uniqueDepartments);
        //         setUniqNCDept([...uniqueDepartments3]);

        //         filteredItems.forEach(item => {
        //             const status = item.Status;
        //             const categories = item.Category || [];

        //             categories.forEach((cat : any) => {
        //               const category = cat.Title;

        //               if (!groupedData3[category]) {
        //                 groupedData3[category] = { name: category, total: 0, open: 0, closed: 0 };
        //               }

        //               groupedData3[category].total += 1;

        //               if (openStatuses.includes(status)) {
        //                 groupedData3[category].open += 1;
        //               } else if (closedStatuses.includes(status)) {
        //                 groupedData3[category].closed += 1;
        //               }
        //             });
        //           });

        //           const finalChartData3 = Object.values(groupedData3);
        //           setBarChartArr([...finalChartData3]);
        //         break;

        //         case 'subcategory': setSelectedSubCategory(selectedOption);

        //         filteredItems = NClistArray.filter((item: any) => 
        //             item.SubCategoryId && item.SubCategoryId.some((categoryId: any) => categoryId === selectedOption.value)
        //         );               

        //         const groupedData4: { [key: string]: { name: string; total: number; open: number; closed: number } } = {};

        //         const uniqueDepartments4 = filteredItems.map((item: any) => ({ Title: item.Department?.Title }));
        //         // setUniqNCDept(uniqueDepartments);
        //         setUniqNCDept([...uniqueDepartments4]);

        //         filteredItems.forEach(item => {
        //             const status = item.Status;
        //             const categories = item.Category || [];

        //             categories.forEach((cat : any) => {
        //               const category = cat.Title;

        //               if (!groupedData4[category]) {
        //                 groupedData4[category] = { name: category, total: 0, open: 0, closed: 0 };
        //               }

        //               groupedData4[category].total += 1;

        //               if (openStatuses.includes(status)) {
        //                 groupedData4[category].open += 1;
        //               } else if (closedStatuses.includes(status)) {
        //                 groupedData4[category].closed += 1;
        //               }
        //             });
        //           });

        //           const finalChartData4 = Object.values(groupedData4);
        //           setBarChartArr([...finalChartData4]);
        //         break;


        //         case 'location': setSelectedLocation(selectedOption);

        //         filteredItems = NClistArray.filter((item: any) => item.LocationId === selectedOption.value);
        //         const groupedData5: { [key: string]: { name: string; total: number; open: number; closed: number } } = {};

        //         const uniqueDepartments5 = filteredItems.map((item: any) => ({ Title: item.Department?.Title }));
        //         // setUniqNCDept(uniqueDepartments);
        //         setUniqNCDept([...uniqueDepartments5]);

        //         filteredItems.forEach(item => {
        //             const status = item.Status;
        //             const categories = item.Category || [];

        //             categories.forEach((cat : any) => {
        //               const category = cat.Title;

        //               if (!groupedData5[category]) {
        //                 groupedData5[category] = { name: category, total: 0, open: 0, closed: 0 };
        //               }

        //               groupedData5[category].total += 1;

        //               if (openStatuses.includes(status)) {
        //                 groupedData5[category].open += 1;
        //               } else if (closedStatuses.includes(status)) {
        //                 groupedData5[category].closed += 1;
        //               }
        //             });
        //           });

        //           const finalChartData5 = Object.values(groupedData5);
        //           setBarChartArr([...finalChartData5]);
        //         break;



        //         case 'reportcode': setSelectedLocation(selectedOption);
        //         break;

        //         case 'ncobservation': setSelectedLocation(selectedOption);
        //         break;


        //     default: break;

        // }

    };


    return (
        <>

            <div className="col-lg-3">
                <CustomBreadcrumb Breadcrumb={Breadcrumb} />
            </div>
            {/*  */}

            {/* <div className="row" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                <div className="col-md-3">
                    <label htmlFor="dropdown1">Dropdown 1</label>
                    <Select
                        id="dropdown1"
                        value={[
                            { value: 'option1', label: 'Option 1' },
                            { value: 'option2', label: 'Option 2' },
                            { value: 'option3', label: 'Option 3' },
                        ]}
                        placeholder="Select an option"
                    />
                </div>
                <div className="col-md-3">
                    <label htmlFor="dropdown2">Dropdown 2</label>
                    <Select
                        id="dropdown2"
                        value={[
                            { value: 'optionA', label: 'Option A' },
                            { value: 'optionB', label: 'Option B' },
                            { value: 'optionC', label: 'Option C' },
                        ]}
                        placeholder="Select an option"
                    />
                </div>
                <div className="col-md-3">
                    <label htmlFor="dropdown3">Dropdown 3</label>
                    <Select
                        id="dropdown3"
                        value={[
                            { value: 'item1', label: 'Item 1' },
                            { value: 'item2', label: 'Item 2' },
                            { value: 'item3', label: 'Item 3' },
                        ]}
                        placeholder="Select an option"
                    />
                </div>
                <div className="col-md-3">
                    <label htmlFor="dropdown4">Dropdown 4</label>
                    <Select
                        id="dropdown4"
                        value={[
                            { value: 'choice1', label: 'Choice 1' },
                            { value: 'choice2', label: 'Choice 2' },
                            { value: 'choice3', label: 'Choice 3' },
                        ]}
                        placeholder="Select an option"
                    />
                </div>
                <div className="col-md-3">
                    <label htmlFor="dropdown5">Dropdown 5</label>
                    <Select
                        id="dropdown5"
                        value={[
                            { value: 'value1', label: 'Value 1' },
                            { value: 'value2', label: 'Value 2' },
                            { value: 'value3', label: 'Value 3' },
                        ]}
                        placeholder="Select an option"
                    />
                </div>
            </div> */}

            {/* Added Dropdown Filters Section */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="header-title mb-3">Filters</h4>
                            <div className="row">
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Status</label>
                                    <Select
                                        options={statusOptions}
                                        value={selectedStatus}
                                        name="status"
                                        //onChange={setSelectedStatus}
                                        placeholder="Select Status"
                                        onChange={(selectedOptions: any) => handleFilterChange(selectedOptions, 'status')}
                                        // styles={customStyles}
                                        isClearable
                                    />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Type</label>
                                    <Select
                                        options={typeOptions}
                                        value={selectedType}
                                        name="type"
                                        // onChange={setSelectedType}
                                        onChange={(selectedOptions: any) => handleFilterChange(selectedOptions, 'type')}
                                        placeholder="Select Type"
                                        // styles={customStyles}
                                        isClearable
                                    />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Department</label>
                                    <Select
                                        options={Department}
                                        value={selectedDepartment}
                                        name="department"
                                        // onChange={setSelectedDepartment}
                                        onChange={(selectedOptions: any) => handleFilterChange(selectedOptions, 'department')}
                                        placeholder="Select Department"
                                        // styles={customStyles}
                                        isClearable
                                    />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Category</label>
                                    <Select
                                        options={Category}
                                        value={selectedCategory}
                                        name="category"
                                        // onChange={setSelectedCategory}
                                        onChange={(selectedOptions: any) => handleFilterChange(selectedOptions, 'category')}
                                        placeholder="Select Category"
                                        // styles={customStyles}
                                        isClearable
                                    />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">SubCategory</label>
                                    <Select
                                        options={SubCategoryOptions}
                                        value={selectedSubCategory}

                                        // onChange={setSelectedSubCategory}
                                        name="subcategory"
                                        onChange={(selectedOptions: any) => handleFilterChange(selectedOptions, 'subcategory')}
                                        placeholder="Select SubCategory"
                                        // styles={customStyles}
                                        isClearable
                                    />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Location</label>
                                    <Select
                                        options={Location}
                                        value={selectedLocation}
                                        // onChange={setSelectedLocation}
                                        name="location"
                                        onChange={(selectedOptions: any) => handleFilterChange(selectedOptions, 'location')}
                                        placeholder="Select Location"
                                        // styles={customStyles}
                                        isClearable
                                    />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Report Code</label>
                                    <Select
                                        options={reportCodeOptions}
                                        value={selectedReportCode}
                                        name="reportcode"
                                        onChange={(selectedOptions: any) => handleFilterChange(selectedOptions, 'reportcode')}

                                        // onChange={setSelectedReportCode}
                                        placeholder="Select Report Code"
                                        // styles={customStyles}
                                        isClearable
                                    />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">NC Observation</label>
                                    <Select
                                        options={ncObservationOptions}
                                        value={selectedNCObservation}
                                        name="ncobservation"
                                        onChange={(selectedOptions: any) => handleFilterChange(selectedOptions, 'ncobservation')}

                                        // onChange={setSelectedNCObservation}
                                        placeholder="Select NC Observation"
                                        // styles={customStyles}
                                        isClearable
                                    />
                                </div>
                                {/* <div className="col-12 text-end">
                                    <button
                                        className="btn btn-primary me-2"
                                        onClick={handleFilterSubmit}
                                    >
                                        Apply Filters
                                    </button>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => {
                                            setSelectedStatus(null);
                                            setSelectedType(null);
                                            setSelectedDepartment(null);
                                            setSelectedCategory(null);
                                            setSelectedSubcategory(null);
                                            setSelectedLocation(null);
                                            setSelectedReportCode(null);
                                            setSelectedNCObservation(null);
                                        }}
                                    >
                                        Clear Filters
                                    </button>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>


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
                                        <h3 className="mt-1"><span>{TotalNCType}</span></h3>
                                        <p style={{ textAlign: 'right' }} className="text-muted text-right mb-1 text-truncate">
                                            Total NC
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
                                        <h3 className="mt-1"><span>{PendingNCArray}</span></h3>
                                        <p style={{ textAlign: 'right' }} className="text-muted text-right mb-1 text-truncate">
                                            Active NC
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
                                        <h3 className="mt-1"><span>{TotalObservationType}</span></h3>
                                        <p style={{ textAlign: 'right' }} className="text-muted mb-1 text-truncate">
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
                                    <div className="avatar-lg rounded-circle bg-soft-pink border-pink border">
                                        <i className="fe-users font-22 avatar-title text-pink"></i>
                                    </div>
                                </div>
                                <div className="col-8">
                                    <div className="text-end">
                                        <h3 className="mt-1"><span>{PendingObservationArray}</span></h3>
                                        <p style={{ textAlign: 'right' }} className="text-muted text-right mb-1 text-truncate">
                                            Active Observations
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
                    <div style={{ height: '450px' }} className="card">
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
                            <h4 className="header-title mt-2 mb-0">Department Wise NC/Observation</h4>

                            <div id="cardCollpase1" className="collapse show">
                                <div className="text-center pt-3">
                                    <div className="row mt-2">
                                        {UniqNCDept.length > 0 && <DepartmentPieChart UniqNCDept={UniqNCDept} />}



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
                    <div style={{ height: '450px' }} className="card">
                        <div className="card-body">
                            <div className="card-widgets">
                                <a href="javascript: void(0);" data-bs-toggle="reload"><i className="mdi mdi-refresh"></i></a>
                                <a data-bs-toggle="collapse" href="#cardCollpase3" role="button" aria-expanded="false" aria-controls="cardCollpase3"><i className="mdi mdi-minus"></i></a>
                                <a href="javascript: void(0);" data-bs-toggle="remove"><i className="mdi mdi-close"></i></a>
                            </div>
                            <h4 className="header-title mt-2 mb-3">NC / Observation Category</h4>

                            <div id="cardCollpase3" className="collapse show">
                                <div className="text-center pt-3">
                                    <div className="row mt-2">
                                        <div className="col-xl-4">
                                            <h3 data-plugin="counterup">{NClistArray.length}</h3>
                                            <p className="text-muted font-13 mb-0 text-truncate">Total</p>
                                        </div>
                                        <div className="col-4">
                                            <h3 data-plugin="counterup">{(PendingNCArray + PendingObservationArray)}</h3>
                                            <p className="text-muted font-13 mb-0 text-truncate">Open</p>
                                        </div>
                                        <div className="col-4">
                                            <h3 data-plugin="counterup">{(ClosedNCArray + ClosedObservationArray)}</h3>
                                            <p className="text-muted font-13 mb-0 text-truncate">Close</p>
                                        </div>
                                    </div>
                                    <ChartComponent NCArray={BarChartArr} />

                                    {/* <div dir="ltr">
                                        <div id="statistics-chart" data-colors="#747171" style={{ height: '230px' }} className="morris-chart mt-3"></div>
                                    </div> */}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            

            <div className="col-xl-4 col-md-6">
                <div style={{ height: '450px' }} className="card">
                    <div className="card-body">
                        <div className="card-widgets">
                            <a href="javascript: void(0);" data-bs-toggle="reload"><i className="mdi mdi-refresh"></i></a>
                            <a data-bs-toggle="collapse" href="#cardCollpase2" role="button" aria-expanded="false" aria-controls="cardCollpase2"><i className="mdi mdi-minus"></i></a>
                            <a href="javascript: void(0);" data-bs-toggle="remove"><i className="mdi mdi-close"></i></a>
                        </div>
                        <h4 className="header-title mb-0">NC / Observation Status</h4>

                        <div id="cardCollpase2" className="collapse show">
                            <div className="new">


                                <div className="widget-chart text-center" dir="ltr">
                                    <CircularProgressBar value={(PendingNCArray + PendingObservationArray) === 0
                                        ? 0
                                        : parseFloat((((PendingNCArray + PendingObservationArray) / NClistArray.length) * 100).toFixed(2))} />

                                    {/* <div id="total-revenue" className="mt-4" data-colors="#d03f36"></div> */}





                                    <div className="row mt-3">
                                        <div className="col-4">
                                            <p className="text-muted font-15 mb-1 text-truncate">Total</p>
                                            <h4>100%</h4>
                                        </div>
                                        <div className="col-4">
                                            <p className="text-muted font-15 mb-1 text-truncate">  Open</p>
                                            {/* <h4>68%</h4> */}
                                            <h4>{(PendingNCArray + PendingObservationArray) === 0
                                                ? "0%"
                                                : `${(((PendingNCArray + PendingObservationArray) / NClistArray.length) * 100).toFixed(2)}%`}</h4>
                                        </div>
                                        <div className="col-4">
                                            <p className="text-muted font-15 mb-1 text-truncate">Close</p>
                                            {/* <h4>32%</h4> */}
                                            <h4>{(ClosedNCArray + ClosedObservationArray) === 0
                                                ? "0%"
                                                : `${(((ClosedNCArray + ClosedObservationArray) / NClistArray.length) * 100).toFixed(2)}%`}</h4>
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
                                    {/* <table className="mtable table-centered table-nowrap table-borderless mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th style={{ minWidth: '50px', maxWidth: '50px' }}>S.No</th>
                                                <th style={{ minWidth: '110px', maxWidth: '110px' }}>Department</th>
                                                <th style={{ minWidth: '110px', maxWidth: '110px' }}>Location</th>
                                                <th style={{ minWidth: '120px', maxWidth: '120px' }}>Date</th>
                                                <th style={{ minWidth: '110px', maxWidth: '110px' }}>Category</th>
                                                <th style={{ minWidth: '110px', maxWidth: '110px' }}>Sub Category</th>
                                                <th style={{ minWidth: '110px', maxWidth: '110px' }}>Criteria</th>
                                                
                                                <th style={{ minWidth: '100px', maxWidth: '100px' }}>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {NClistArray.map((num, index) => (
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
                                                    
                                                    <td style={{ minWidth: '100px', maxWidth: '100px' }}>
                                                        <span className="badge bg-soft-info text-info p-1">{num.Status}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table> */}


                                    <table className="mtable table-centered table-nowrap table-borderless">
                                        <thead>
                                            <tr>
                                                <th style={{ minWidth: '50px', maxWidth: '50px' }} onClick={() => requestSort('S.No')}>
                                                    S.No.
                                                    {sortConfig?.key === 'S.No' && (
                                                        <span className="sortIcon">
                                                            {/* {sortConfig.direction === 'ascending'
                                                                ? <ArrowSortUpLinesRegular />
                                                                : <ArrowSortDownLinesRegular />} */}
                                                            <FontAwesomeIcon icon={faSort} />
                                                        </span>
                                                    )}
                                                </th>
                                                {columns.map((col) => (
                                                    <th key={col.key} onClick={() => requestSort(col.key)}>
                                                        {col.displayName}
                                                        {sortConfig?.key === col.key && (
                                                            <span className="sortIcon">
                                                                {/* {sortConfig.direction === 'ascending'
                                                                    ? <ArrowSortUpLinesRegular />
                                                                    : <ArrowSortDownLinesRegular />} */}
                                                                <FontAwesomeIcon icon={faSort} />
                                                            </span>
                                                        )}
                                                    </th>
                                                ))}
                                            </tr>
                                            <tr className="filterRow">
                                                <th style={{ minWidth: '50px', maxWidth: '50px' }} className="filterCell">
                                                    <input
                                                        type="text"
                                                        className="filterInput"
                                                        placeholder="Filter..."
                                                        value={columnFilters['S.No'] || ''}
                                                        onChange={(e) => handleColumnFilterChange('S.No', e.target.value)}
                                                    />
                                                </th>
                                                {columns.map((col) => (
                                                    <th key={col.key} className="filterCell">
                                                        <input
                                                            type="text"
                                                            className="filterCell form-control"
                                                            placeholder={`Filter...`}
                                                            value={columnFilters[col.key] || ''}
                                                            onChange={(e) => handleColumnFilterChange(col.key, e.target.value)}
                                                        />
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentRows.length > 0 ? (
                                                currentRows.map((item, itemIndex) => (
                                                    <tr key={itemIndex} className={itemIndex % 2 === 0 ? "rowEven" : ''}>
                                                        <td style={{ minWidth: '50px', maxWidth: '50px' }}>{indexOfFirstRow + itemIndex + 1}</td>
                                                        {columns.map((col) => (
                                                            <td key={col.key} >
                                                                {getNestedValue(item, col.key)}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={columns.length + 1} style={{ textAlign: 'center', padding: '20px' }}>
                                                        No records found matching your filters
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>





                                </div>

                                {sortedAndFilteredItems.length > rowsPerPage && (
                                    <div className="pagination">
                                        <button
                                            className="pageButton"
                                            onClick={() => paginate(1)}
                                            disabled={currentPage === 1}
                                        >
                                            «
                                        </button>
                                        <button
                                            className="pageButton"
                                            onClick={() => paginate(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            ‹
                                        </button>

                                        {getPageNumbers().map((pageNumber, index) => (
                                            pageNumber === '...' ? (
                                                <span key={`ellipsis-${index}`} className="ellipsis">...</span>
                                            ) : (
                                                <button
                                                    key={pageNumber}
                                                    className={`pageButton ${currentPage === pageNumber ? "activePage" : ''}`}
                                                    onClick={() => paginate(pageNumber as number)}
                                                >
                                                    {pageNumber}
                                                </button>
                                            )
                                        ))}

                                        <button
                                            className="pageButton"
                                            onClick={() => paginate(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                        >
                                            ›
                                        </button>
                                        <button
                                            className="pageButton"
                                            onClick={() => paginate(totalPages)}
                                            disabled={currentPage === totalPages}
                                        >
                                            »
                                        </button>
                                    </div>
                                )}
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
