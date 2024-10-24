import React from 'react'
import Provider from '../../../GlobalContext/provider';
import CustomNewsWebpartTemplate from '../../../CustomJSComponents/CustomNewsWebpartTemplate/CustomNewsWebpartTemplate';
import CustomBreadcrumb from '../../../CustomJSComponents/CustomBreadcrumb/CustomBreadcrumb';
import HorizontalNavbar from '../../horizontalNavBar/components/HorizontalNavBar';
import VerticalSideBar from '../../verticalSideBar/components/VerticalSideBar';
import { getNews } from '../../../APISearvice/NewsService';
import { useMediaQuery } from 'react-responsive';
import context from '../../../GlobalContext/context';
import UserContext from '../../../GlobalContext/context';
import { getSP } from '../loc/pnpjsConfig';
import { SPFI } from '@pnp/sp/presets/all';
import "../../../Assets/Figtree/Figtree-VariableFont_wght.ttf";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../CustomCss/mainCustom.scss";
import "../../verticalSideBar/components/VerticalSidebar.scss"
import { INewsProps } from './INewsProps';
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
  const SiteUrl = props.siteUrl
  const Breadcrumb = [
    {
      "MainComponent": "Home",
      "MainComponentURl": `${SiteUrl}/SitePages/Dashboard.aspx`
    },
    {
      "ChildComponent": "News",
      "ChildComponentURl": `${SiteUrl}/SitePages/News.aspx`
    }
  ]
  React.useEffect(() => {
    //getAPIFromService()

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

  const getAPIFromService = () => {
    const allAnncouncement = getNews(sp);
    console.log(allAnncouncement, 'allAnncouncement');

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
      <div className="content mt-5" style={{marginLeft: `${!useHide ? '240px' : '80px'}`}}>
          <div className="container-fluid  paddb">
            <div className="row" style={{ paddingLeft: '0.5rem' }}>
              <div className="col-lg-3">
                <CustomBreadcrumb Breadcrumb={Breadcrumb} />
              </div>
            </div>
           
            <CustomNewsWebpartTemplate _sp={sp} SiteUrl={SiteUrl} />
          </div>
        </div>
      </div>
    </div>
  );
};
const News : React.FC<INewsProps> = (props) => {
  return (
    <Provider>
      <HelloWorldContext props={props}/>
    </Provider>
  );
};

export default News;
