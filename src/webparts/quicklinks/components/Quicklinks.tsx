import * as React from 'react';

import type { IQuicklinksProps } from './IQuicklinksProps';
import { escape } from '@microsoft/sp-lodash-subset';
import Provider from '../../../GlobalContext/provider';
import VerticalSideBar from '../../verticalSideBar/components/VerticalSideBar';
import HorizontalNavbar from '../../horizontalNavBar/components/HorizontalNavBar';
import CustomBreadcrumb from '../../../CustomJSComponents/CustomBreadcrumb/CustomBreadcrumb';
import UserContext from '../../../GlobalContext/context';
import { getSP } from '../loc/pnpjsConfig';
import { SPFI } from '@pnp/sp';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../CustomCss/mainCustom.scss";
import "../components/quicklinks.scss";
import "../../verticalSideBar/components/VerticalSidebar.scss"
import "../../horizontalNavBar/components/horizontalNavbar.scss";
import { Tenant_URL } from '../../../Shared/Constants';

export const MastersettingContext = ({ props }: any) => {
//   const style = document.createElement("style");
//   style.innerHTML = `
//   #O365_ShellHeader, #SuiteNavWrapper, #spCommandBar,
//   #RecommendedItems, #CommentsWrapper, #spLeftNav,
//   #spSiteHeader, #sp-appBar, [data-automation-id="pageHeader"],
//   [data-automation-id="comments-section"],
//   .s_f_a15aba7f, .co_t_acbc1db2, .w_b_4ade22aa {
//     display: none !important;
//     visibility: hidden !important;
//   }
// `;
//   document.head.appendChild(style);

  const { useHide }: any = React.useContext(UserContext);
  const elementRef = React.useRef<HTMLDivElement>(null);
  const SiteUrl = props.siteUrl;
  const sp: SPFI = getSP();
  const [QuickLinkArray, setQuickLinkArray] = React.useState([]);
  const [showImg, setshowImg] = React.useState(false);
  const Breadcrumb = [
    {
      "MainComponent": "Home",
      "MainComponentURl": `${SiteUrl}/SitePages/Dashboard.aspx`
    },
    {
      "ChildComponent": "Quick Links",
      "ChildComponentURl": `${SiteUrl}/SitePages/QuickLinks.aspx`
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

  // React.useLayoutEffect(() => {

  //   // Example: hide the side badges using CSS or DOM manipulation
  //   const badges = document.querySelectorAll('[data-automation-id="pageHeader"]');
  //   badges.forEach(badge => {
  //     (badge as HTMLElement).style.display = 'none';
  //   });

  //   // You can also hide other known elements using their classes or IDs
  //   const comments = document.querySelector('[data-automation-id="comments-section"]');
  //   if (comments) {
  //     (comments as HTMLElement).style.display = 'none';
  //   }

  //   const elementsToHide = [
  //     "O365_ShyHeader",
  //     "SuiteNavWrapper",
  //     "spCommandBar",
  //     "RecommendedItems",
  //     "CommentsWrapper",
  //     "spLeftNav",
  //     "spSiteHeader",
  //     "spCommandBar",
  //     "sp-appBar",
  //   ];

  //   elementsToHide.forEach(id => {
  //     const element = document.getElementById(id);
  //     if (element) {
  //       element.style.display = 'none !important';
  //     }
  //   });


  //   const classesToHide = [
  //     "s_f_a15aba7f",
  //     "co_t_acbc1db2",
  //     "w_b_4ade22aa"
  //   ];

  //   classesToHide.forEach(className => {
  //     const elements = document.getElementsByClassName(className);
  //     Array.from(elements).forEach(element => {
  //       (element as HTMLElement).style.display = 'none';
  //     });
  //   });

  // }, []);

  const ApiCall = async () => {

    let listTitle = 'QuickLinks'
    const userProfile = await sp.profiles.myProperties();
    const currentUserDept = userProfile.UserProfileProperties ? userProfile.UserProfileProperties[userProfile.UserProfileProperties.findIndex((obj: any) => obj.Key === "Department")].Value : "";
    let entity = "Global";
    // let CurrentsiteID = props.context.pageContext.site.id;
    // siteID = CurrentsiteID;
    // response = await sp.web.lists.getByTitle(listTitle).select('Id')();
    // console.log("resp",response,siteID,CurrentsiteID);
    // const settingsData = setsettingArray(await getSettingAPI(sp))
    // console.log(settingsData, 'settingsData');

    // setQuickLinkArray(await sp.web.lists.getByTitle(listTitle).items.getAll());
    const settingsData = await sp.web.lists.getByTitle(listTitle).items.select('Id', 'Title', 'URL', 'RedirectToNewTab', 'QuickLinkImage', 'Entity/Entity').expand('Entity').filter(`(Entity/Entity eq '${entity}' or Entity/Entity eq '${currentUserDept}') and IsActive eq 1`).getAll();
    setQuickLinkArray(settingsData);

    setshowImg(settingsData.length == 0 ? true : false);
    console.log(settingsData, 'settingsData');
  }

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
          <div style={{ paddingTop: '12px' }} className="container-fluid  paddb">
            <div className="row pt-0" style={{ paddingLeft: '0.5rem' }}>
              <div className="col-lg-3">
                <CustomBreadcrumb Breadcrumb={Breadcrumb} />
              </div>
              {QuickLinkArray.length == 0 && showImg ?

                <div>
                  <img style={{ width: '100%' }} src={require("../assets/Group.png")} />
                </div>


                :
                <div className="row manage-master mt-0">



                  {QuickLinkArray &&
                    QuickLinkArray.map((item: any) => {
                      const ImageUrl = item.QuickLinkImage == undefined || item.QuickLinkImage == null ? "" : JSON.parse(item.QuickLinkImage);
                      // let img1 = imageData && imageData.fileName ? `${SiteUrl}/_api/v2.1/sites('${siteId}')/lists('${listID}')/items('${item.ID}')/attachments('${imageData.fileName}')/thumbnails/0/c400x400/content` : ""

                      const imageUrl = ImageUrl?.serverRelativeUrl

                        ? `${Tenant_URL}/${ImageUrl.serverRelativeUrl}`
                        : require("../assets/news.png");
                      return (<div className="col-sm-3 col-md-3 mt-2 newwidth6" key={item?.Id}>
                        <a href={item?.URL} target={item?.RedirectToNewTab ? "_blank" : "_self"}>
                          <div className="aaplnbg">
                            <div className="">
                              <img src={imageUrl} />
                            </div>
                            <div className="text-dark appltext font-14 mb-1">
                              {/* <p className="text-dark appltext font-14 mb-1"> */}
                              {item?.Title}
                              {/* </p> */}
                            </div>
                            <p className="font-12 mb-2 text-primary">{item.Entity?.Entity}</p>
                          </div>
                        </a>
                      </div>
                      )
                    })

                  }









                </div>
              }

            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

const Quicklinks: React.FC<IQuicklinksProps> = (props) => {
  return (
    <Provider>
      <MastersettingContext props={props} />
    </Provider>
  )
}

export default Quicklinks
