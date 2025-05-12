import * as React from 'react';
import styles from './ReportNavigation.module.scss';
import type { IReportNavigationProps } from './IReportNavigationProps';
import { escape } from '@microsoft/sp-lodash-subset';
import Provider from '../../../GlobalContext/provider';
import UserContext from '../../../GlobalContext/context';
import { getSP } from '../loc/pnpjsConfig';
import { SPFI } from '@pnp/sp';
import VerticalSideBar from '../../verticalSideBar/components/VerticalSideBar';
import HorizontalNavbar from '../../horizontalNavBar/components/HorizontalNavBar';
import CustomBreadcrumb from '../../../CustomJSComponents/CustomBreadcrumb/CustomBreadcrumb';
import { Tenant_URL } from '../../../Shared/Constants';
import "../components/ReportNavigation.scss";
import { Image, Clipboard, Airplay, Calendar, Bell, Users, Rss, Activity, Sun, Moon, Cpu, Codepen, Command, BookOpen, List, Folder, Database, Globe, FileText, Link2, File } from 'react-feather';
import NCReport from './NCReport';
const endsWith = (str: string, ending: string) => {
  return str.slice(-ending.length) === ending;
}
let siteID: any;
let response: any;


export const ReportNavigationContext = ({ props }: any) => {
  const { useHide }: any = React.useContext(UserContext);
  const elementRef = React.useRef<HTMLDivElement>(null);
  const [activeComponent, setActiveComponent] = React.useState<string>('');
  const SiteUrl = props.siteUrl;
  const sp: SPFI = getSP();
  const [ReportNavArray, setReportNavArray] = React.useState([]);
  const [IsUserAlllowed, setIsUserAlllowed] = React.useState(false);
  const [showImg, setshowImg] = React.useState(false);
  const Breadcrumb = [
    {
      "MainComponent": "Home",
      "MainComponentURl": `${SiteUrl}/SitePages/Dashboard.aspx`
    },
    {
      "ChildComponent": "Report Navigation",
      "ChildComponentURl": `${SiteUrl}/SitePages/ReportNavigation.aspx`

    }
  ]
  React.useEffect(() => {
    // Immediately hide sidebar and navbar
    const hideElements = () => {
     document.querySelectorAll("#O365_ShyHeader, #SuiteNavWrapper, #spCommandBar, #RecommendedItems, #CommentsWrapper, #spLeftNav, #spSiteHeader, #spCommandBar, #sp-appBar, .s_f_a15aba7f, .co_t_acbc1db2, .w_b_4ade22aa").forEach((el) => {
       // (el as HTMLElement).style.display = "none";
       el.remove();
     });
   };

   hideElements(); // Run once when component loads



   // Optional: Observer to prevent SharePoint scripts from re-showing
   const observer = new MutationObserver(hideElements);
   observer.observe(document.body, { childList: true, subtree: true });

  

   ApiCall();
   return () => observer.disconnect(); // Cleanup on unmount
   
 }, []);
  // React.useEffect(() => {
  //   ApiCall()
  //   // console.log('This function is called only once', useHide);
  //   // IsUserAllowedAccess().then(bAllowed => {

  //   //   //  console.log("%c Access allowed","color:green,font-size:14px",bAllowed);
  //   //   setIsUserAlllowed(bAllowed);

  //   // })
  // }, []);

  // const IsUserAllowedAccess = async () => {
  //   // Get groups for the current user
  //   let listTitle = 'ReportNavigation';
  //   const userGroups = await sp.web.currentUser.groups();
  //   let grptitle: String[] = [];
  //   for (var i = 0; i < userGroups.length; i++) {
  //     grptitle.push(userGroups[i].Title.toLowerCase());
  //   }

  //   let sidebarnavitems = await sp.web.lists.getByTitle(listTitle).items.select("Title,Url,Icon,ParentId,ID,EnableAudienceTargeting,Audience/Title").expand("Audience").filter("IsActive eq 1").orderBy("Order0", true).getAll();

  //   let securednavitems = sidebarnavitems.filter((nav: any) => {
  //     return (!nav.EnableAudienceTargeting || (nav.EnableAudienceTargeting && nav.Audience && nav.Audience.some((nv1: any) => { return grptitle?.includes(nv1.Title.toLowerCase()); })))
  //   }
  //   )

  //   return securednavitems.some((navitm: any) => (navitm.Url) ? endsWith(navitm.Url.toLowerCase(), location.pathname.toLowerCase()) : false)

  // }



  const ApiCall = async () => {
    // debugger


    let listTitle = 'ReportNavigation'
    let CurrentsiteID = props.context.pageContext.site.id;
    siteID = CurrentsiteID;
    response = await sp.web.lists.getByTitle(listTitle).select('Id')();
    console.log("resp", response, siteID, CurrentsiteID);
    const settingsData = setReportNavArray(await getSettingAPI(sp))
    console.log(settingsData, 'settingsData');
    // setshowImg(settingsData.length == 0 ? true : false);
  }

  const getSettingAPI = async (_sp: any) => {
    const userGroups = await sp.web.currentUser.groups();
    const currentUserId = await _sp.web.currentUser();
    // console.log("userGroups", userGroups);
    let grptitle: String[] = [];
    for (var i = 0; i < userGroups.length; i++) {
      grptitle.push(userGroups[i].Title.toLowerCase());
    }
    let arr: any[] = []
    await _sp.web.lists.getByTitle("ReportNavigation").items.select("Title,ID,Icon,Url, EnableAudienceTargeting,Audience/Title,Audience/Id").expand("Audience").filter("IsActive eq 1").orderBy("Order", true)()
      .then((res: any) => {
        console.log("Responce of data for get setting:", res);
        // arr = res;

        arr = res.filter((nav: any) => {

          return (!nav.EnableAudienceTargeting || (nav.EnableAudienceTargeting && nav.Audience && nav.Audience.some((nv1: any) => { return grptitle.includes(nv1.Title.toLowerCase()) || nv1.Id === currentUserId.Id; })))
        }
        )
      })
      .catch((error: any) => {
        console.log("Error fetching data: ", error);
      });
    setshowImg(arr.length == 0 ? true : false);
    return arr;
  }

  // const ApiCall = async () => {

  //   let listTitle = 'ReportNavigation'
  //   const userProfile = await sp.profiles.myProperties();
  //   const currentUserDept = userProfile.UserProfileProperties ? userProfile.UserProfileProperties[userProfile.UserProfileProperties.findIndex((obj: any) => obj.Key === "Department")].Value : "";
  //   // let entity = "Global";
  //   // let CurrentsiteID = props.context.pageContext.site.id;
  //   // siteID = CurrentsiteID;
  //   // response = await sp.web.lists.getByTitle(listTitle).select('Id')();
  //   // console.log("resp",response,siteID,CurrentsiteID);
  //   // const settingsData = setsettingArray(await getSettingAPI(sp))
  //   // console.log(settingsData, 'settingsData');

  //   // setQuickLinkArray(await sp.web.lists.getByTitle(listTitle).items.getAll());
  //   let sidebarnavitems = await sp.web.lists.getByTitle(listTitle).items.select("Title,Url,Icon,ParentId,ID,EnableAudienceTargeting,Audience/Title").expand("Audience").filter("IsActive eq 1").orderBy("Order0", true).getAll();

  //   // const settingsData = await sp.web.lists.getByTitle(listTitle).items.select('Id', 'Title', 'URL', 'RedirectToNewTab', 'QuickLinkImage', 'Entity/Entity').expand('Entity').filter(`(Entity/Entity eq '${entity}' or Entity/Entity eq '${currentUserDept}') and IsActive eq 1`).getAll();
  //   setReportNavArray(sidebarnavitems);

  //   setshowImg(sidebarnavitems.length == 0 ? true : false);
  //   console.log(sidebarnavitems, 'settingsData');
  // }
  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      home: Airplay,
      calendar: Calendar,
      file: File,
      image: Image,
      clipboard: Clipboard,
      bell: Bell,
      userGroup: Users,
      wifi: Rss,
      waveSquare: Activity,
      sun: Sun,
      moon: Moon,
      approval: Activity,
      gear: Cpu,
      codepen: Codepen,
      command: Command,
      BookOpen: BookOpen,
      knowledgecenter: BookOpen,
      myrequest: List,
      dossier: Folder,
      news: Database,
      globe: Globe,
      filetext: FileText,
      link: Link2,
    };
    return iconMap[iconName] || null; // Return null if icon is not found
  };

  const renderNavItems = (items: any, parentId: number | null = null) => {
    return items
      .map((item: any) => {
        const IconComponent = getIcon(item.Icon); // Get the icon component dynamically
        return (

          <div className="col-sm-3 col-md-3 mt-2 newwidth6" key={item?.Id} onClick={(event)=>{ setActiveComponent(item?.Title)}}>
            {/* <a href={item?.Url}> */}
              <div className="aaplnbg">
                <div className="">
                  {/* <img src={imageUrl} /> */}
                  {IconComponent && <IconComponent size={18} />}
                </div>
                <div className="text-dark appltext font-14 mb-1">
                  {/* <p className="text-dark appltext font-14 mb-1"> */}
                  {item?.Title}
                  {/* </p> */}
                </div>
                {/* <p className="font-12 mb-2 text-primary">{item.Entity?.Entity}</p> */}
              </div>
            {/* </a> */}
          </div>

          // :
          // <div>
          //   {activeComponent === 'Create Devision' && (
          //     <div>
          //       <button onClick={() => handleReturnToMain('')}> Create Devision back </button>
          //       <NCReport props={props} />
          //     </div>
          //   )}

          // </div>
          // }

        )
      }

      );
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
        {/* <div className="content" style={{ marginLeft: `${!useHide ? '240px' : '80px'}` }}> */}
        <div className="content" >

          <div style={{ paddingTop: '12px' }} className="container-fluid  paddb">
            <div className="row pt-0" style={{ paddingLeft: '0.5rem' }}>
              
              {activeComponent === "" ?
              <>
              <div className="col-lg-3">
              <CustomBreadcrumb Breadcrumb={Breadcrumb} />
            </div>
                {/* // <div> */}
                  {ReportNavArray.length == 0 && showImg ?

                    // <div>
                    //   <img style={{ width: '100%' }} src={require("../assets/Group.png")} />
                    // </div>
                    <div className="align-items-center newiconsvg text-center mt-14">

                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>

                      <p className="font-14 text-muted text-center">No Reports Available </p>

                    </div>


                    :
                    <div className="row manage-master mt-0">
                

                      {renderNavItems(ReportNavArray)}

                    </div>
                  }

                </>

                :
                <div>

                  {activeComponent === 'Non conformity Report' && (
                    <>
                      {/* <button onClick={() => handleReturnToMain('')}> Create Entity back </button> */}
                      <NCReport props={props}/>
                    </>

                  )}
                </div>
              }


            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

const ReportNavigation: React.FC<IReportNavigationProps> = (props) => {
  return (
    <Provider>
      <ReportNavigationContext props={props} />
    </Provider>
  )
}



export default ReportNavigation

