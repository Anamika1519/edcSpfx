import * as React from 'react'
import { useMediaQuery } from 'react-responsive';
import context from '../../../GlobalContext/context';
import UserContext from '../../../GlobalContext/context';
import { getSP } from '../loc/pnpjsConfig';
import { SPFI } from '@pnp/sp';
import VerticalSideBar from '../../verticalSideBar/components/VerticalSideBar';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../CustomCss/mainCustom.scss";
import "../../verticalSideBar/components/VerticalSidebar.scss"
import Provider from '../../../GlobalContext/provider';
import "../components/Mastersettings.scss";
import CustomBreadcrumb from '../../../CustomJSComponents/CustomBreadcrumb/CustomBreadcrumb';
import "../../horizontalNavBar/components/horizontalNavbar.scss";
import "../../../Assets/Figtree/Figtree-VariableFont_wght.ttf";
import { getSettingAPI } from "../../../APISearvice/settingsService";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';
import HorizontalNavbar from '../../horizontalNavBar/components/HorizontalNavBar';
import styles from "../components/Mastersettings.module.scss"
import { IMastersettingsProps } from './IMastersettingsProps';
export const MastersettingContext = ({ props }: any) => {
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
  const [settingArray, setsettingArray] = React.useState([]);
  const SiteUrl = props.siteUrl;
  const Breadcrumb = [
    {
      "MainComponent": "Home",
      "MainComponentURl": ""
    },
    {
      "ChildComponent": "Settings",
      "ChildComponentURl": `${SiteUrl}/SitePages/Settings.aspx`
    }
  ]

  React.useEffect(() => {
    ApiCall()
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

  const ApiCall = async () => {
    const settingsData = setsettingArray(await getSettingAPI(sp))
    console.log(settingsData, 'settingsData');
  }

  // Bannerthing
  const [showModal, setShowModal] = React.useState(false);
  const [showBannerModal, setShowBannerTable] = React.useState(false);
  const [BnnerImagepostArr, setBannerImagepostArr] = React.useState([]);
  const [formData, setFormData] = React.useState({
    title: '',
    bannerImg: []
  })
  const setShowModalFunc = (bol: boolean, name: string) => {
    debugger
    if (name == "bannerimg") {
      setShowModal(bol)
      setShowBannerTable(true)
    }
  }
  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>, libraryName: string, docLib: string) => {
    debugger;
    event.preventDefault();
    let uloadDocsFiles: any[] = [];
    let uloadImageFiles: any[] = [];
    let uloadBannerImageFiles: any[] = [];

    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files);


      const imageVideoFiles = files.filter(file =>
        file.type.startsWith('image/') ||
        file.type.startsWith('video/')
      );

      if (imageVideoFiles.length > 0) {
        const arr = {
          files: imageVideoFiles,
          libraryName: libraryName,
          docLib: docLib
        };

        uloadBannerImageFiles.push(arr);
        setBannerImagepostArr(uloadBannerImageFiles);
      }

    }

  };
  const onChange = (name: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  return (

 <div id="wrapper" ref={elementRef}>
      <div
        className='app-menu'
        id="myHeader">
        <VerticalSideBar _context={sp} />
      </div>
      <div className="content-page">
        <HorizontalNavbar />
        <div className="content mt-2" style={{marginLeft: `${!useHide ? '240px' : '80px'}`}}>
          <div className="container-fluid  paddb">
            <div className="row pt-0" style={{ paddingLeft: '0.5rem' }}>
              <div className="col-lg-3">
                <CustomBreadcrumb Breadcrumb={Breadcrumb} />
              </div>
              <div className="row manage-master mt-3">
                {
                  settingArray.map((item: any) => {
                    const ImageUrl = item.ImageIcon == undefined || item.ImageIcon == null ? "" : JSON.parse(item.ImageIcon);
                    return (<div className="col-sm-3 col-md-3 mt-2">
                      <a href={item?.LinkUrl}>
                        <div className="card-master box1">
                          <div className="icon">
                            <img src={ImageUrl?.serverUrl + ImageUrl?.serverRelativeUrl} />
                          </div>
                          <p className="text-dark">{item.Title}</p>
                        </div>
                      </a>
                    </div>)
                  })
                }
              </div>
              {/* <>

                <TableData/>
                </> */}
            </div>

          </div>
        </div>
      </div>
    </div>

  
  )
}

const Mastersettings : React.FC<IMastersettingsProps> = (props) => {
  return (
    <Provider>
      <MastersettingContext props={props}/>
    </Provider>
  );
};

export default Mastersettings;