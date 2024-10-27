import * as React from 'react';
import { getSP } from '../loc/pnpjsConfig';
import { SPFI } from '@pnp/sp';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../CustomCss/mainCustom.scss";
import "../../verticalSideBar/components/VerticalSidebar.scss"
import VerticalSideBar from '../../verticalSideBar/components/VerticalSideBar';
import UserContext from '../../../GlobalContext/context';
import Provider from '../../../GlobalContext/provider';
import { useMediaQuery } from 'react-responsive';
import context from '../../../GlobalContext/context';
import { getAnncouncement, getAnncouncementNewsCategory } from "../../../APISearvice/AnnouncementsService";
import CustomBreadcrumb from '../../../CustomJSComponents/CustomBreadcrumb/CustomBreadcrumb';
import "../../../Assets/Figtree/Figtree-VariableFont_wght.ttf";
import HorizontalNavbar from '../../horizontalNavBar/components/HorizontalNavBar';
import { IArgannouncementProps } from './IArgannouncementProps';
import CustomWebpartTemplate from "../../../CustomJSComponents/CustomWebpartTemplate/CustomWebpartTemplate"
import { getCurrentUserProfileEmail } from '../../../APISearvice/CustomService';

const HelloWorldContext = ({props}:any) => {
  const sp: SPFI = getSP();
  console.log(sp, 'sp');
  // const { useHide }: any = React.useContext(UserContext);
  // const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const { useHide }: any = React.useContext(UserContext);
  console.log('This function is called only once', useHide);
  const elementRef = React.useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const { setHide }: any = context;
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [AllCategory, setAllCategory] = React.useState([])
  const SiteUrl = props.siteUrl;

  const Breadcrumb = [
    {
      "MainComponent": "Home",
      "MainComponentURl": `${SiteUrl}/SitePages/Dashboard.aspx`
    },
    {
      "ChildComponent": "Announcements",
      "ChildComponentURl": `${SiteUrl}/SitePages/Announcements.aspx`
    }
  ]
  React.useEffect(() => {
    getAPIFromService()

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
  // Media query to check if the screen width is less than 768px
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const handleSidebarToggle = (bol: boolean) => {
    setIsSidebarOpen((prevState: any) => !prevState);
    setHide(!bol);
    document.querySelector(".sidebar")?.classList.toggle("close");
  };

  const getAPIFromService = async () => {
    // setEmail(await getCurrentUserProfileEmail(sp))
    const allAnncouncementCategory = await getAnncouncementNewsCategory(sp);
    console.log(allAnncouncementCategory, 'allAnncouncement');
    setAllCategory(allAnncouncementCategory)

  }


  return (
    <div id="wrapper" ref={elementRef}>
    <div 
      className="app-menu"
      id="myHeader">
      <VerticalSideBar _context={sp} />
    </div>
    <div className="content-page">
      <HorizontalNavbar />
      <div className="content" style={{marginLeft: `${!useHide ? '240px' : '80px'}`, marginTop:'0rem'}}>
          <div className="container-fluid  paddb">
            <div className="row">
              <div className="col-lg-3">
                <CustomBreadcrumb Breadcrumb={Breadcrumb} />
              </div>
              <div className="col-lg-9">
                <div className="d-flex flex-wrap align-items-center justify-content-end mt-3 mb-3">
                  {/* <div style={{ width: '310px' }}>
                    <label style={{ float: 'left', textAlign: 'right', width: '150px' }} className="me-2 mt-1" >Select Category</label>
                    <select style={{ float: 'left', width: '130px' }} className="form-select me-1">
                      {
                       AllCategory.length>0? AllCategory.map((item:any)=>
                        {
                          <option>{item.Category}</option>
                        }):""
                      }
                      
                    </select>
                  </div> */}
                  {/* <label className="me-2">From</label>
                  <div className="me-3">
                    <input type="date" className="form-control my-1 my-md-0" id="inputPassword2" placeholder="Search..." />
                  </div>

                  <label className="me-2">To</label>
                  <div className="me-2">
                    <input type="date" className="form-control my-1 my-md-0" id="inputPassword2" placeholder="Search..." />
                  </div> */}
                </div>
              </div>
            </div>
           
            <CustomWebpartTemplate _sp={sp} SiteUrl={SiteUrl}/>
          </div>
        </div>
      </div>
    </div>
  );
};
const Argannouncement : React.FC<IArgannouncementProps> = (props) => {
  return (
    <Provider>
      <HelloWorldContext props={props}/>
    </Provider>
  );
};
export default Argannouncement;
