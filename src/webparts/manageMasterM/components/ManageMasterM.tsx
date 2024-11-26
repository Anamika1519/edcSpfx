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
import "../components/ManageMasterM.scss";
import CustomBreadcrumb from '../../../CustomJSComponents/CustomBreadcrumb/CustomBreadcrumb';
import "../../horizontalNavBar/components/horizontalNavbar.scss";
import "../../../Assets/Figtree/Figtree-VariableFont_wght.ttf";
import { getSettingAPI, getSettingAPImanagemaster } from "../../../APISearvice/settingsService";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';
import HorizontalNavbar from '../../horizontalNavBar/components/HorizontalNavBar';
import styles from "../components/ManageMasterM.module.scss";
import { IManageMasterMProps } from './IManageMasterMProps';
const endsWith = (str: string, ending: string) => {
  console.log("strrrr",str,ending)
  return str.slice(-ending.length) === ending;
}

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
  const [IsUserAlllowed, setIsUserAlllowed] = React.useState(false);
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
  const IsUserAllowedAccess = async () => {
    // Get groups for the current user
    const userGroups = await sp.web.currentUser.groups();
    let grptitle: String[] = [];
    for (var i = 0; i < userGroups.length; i++) {
      grptitle.push(userGroups[i].Title.toLowerCase());
    }

    let sidebarnavitems = await sp.web.lists.getByTitle("ARGSidebarNavigation").items.select("Title,Url,Icon,ParentId,ID,EnableAudienceTargeting,Audience/Title").expand("Audience").orderBy("Order0", true).getAll();

    let securednavitems = sidebarnavitems.filter((nav: any) => {
      return (nav.EnableAudienceTargeting && nav.Audience && nav.Audience.some((nv1: any) => { return grptitle.includes(nv1.Title.toLowerCase()); }))
    }
    )
    console.log("sidebarnavitems", sidebarnavitems, securednavitems)
    let access = securednavitems.some((navitm:any)=> (navitm.Url)?endsWith(navitm.Url.toLowerCase(),location.pathname.toLowerCase()):false);
    console.log("acess", access);
    //return securednavitems.some((navitm:any)=> (navitm.Url)?endsWith(navitm.Url.toLowerCase(),location.pathname.toLowerCase()):false)
    return securednavitems.length > 0;
  }
  React.useEffect(() => {
    ApiCall()
    console.log('This function is called only once', useHide);
    IsUserAllowedAccess().then(bAllowed => {

        console.log("%c Access allowed","color:green,font-size:14px",bAllowed);
      setIsUserAlllowed(bAllowed);

    })
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
    const settingsData = setsettingArray(await getSettingAPImanagemaster(sp))
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
        <HorizontalNavbar _context={sp} siteUrl={SiteUrl} />
        <div className="content" style={{ marginLeft: `${!useHide ? '240px' : '80px'}` }}>
          <div className="container-fluid  paddb">
            <div className="row pt-0" style={{ paddingLeft: '0.5rem' }}>
              <div className="col-lg-3">
                <CustomBreadcrumb Breadcrumb={Breadcrumb} />
              </div>
              <div className="row manage-master mt-3">
                {console.log("IsUserAlllowed",IsUserAlllowed,settingArray)}
                {
                  IsUserAlllowed ?
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
                    }) : (<div>Access Denied</div>)
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

const ManageMasterM: React.FC<IManageMasterMProps> = (props) => {
  return (
    <Provider>
      <MastersettingContext props={props} />
    </Provider>
  );
};

export default ManageMasterM;