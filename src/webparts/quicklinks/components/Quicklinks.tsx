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
  const { useHide }: any = React.useContext(UserContext);
   const elementRef = React.useRef<HTMLDivElement>(null);
   const SiteUrl = props.siteUrl;
   const sp: SPFI = getSP();
    const [QuickLinkArray, setQuickLinkArray] = React.useState([]);
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
      ApiCall()
      // console.log('This function is called only once', useHide);
      // IsUserAllowedAccess().then(bAllowed => {
  
      //   //  console.log("%c Access allowed","color:green,font-size:14px",bAllowed);
      //   setIsUserAlllowed(bAllowed);
  
      // })
    }, []);

    const ApiCall = async () => {
       
        let listTitle = 'QuickLinks'
        const userProfile = await sp.profiles.myProperties();
        const currentUserDept = userProfile.UserProfileProperties ? userProfile.UserProfileProperties[userProfile.UserProfileProperties.findIndex((obj:any) => obj.Key === "Department")].Value : "";
        let entity ="Global";
        // let CurrentsiteID = props.context.pageContext.site.id;
        // siteID = CurrentsiteID;
        // response = await sp.web.lists.getByTitle(listTitle).select('Id')();
        // console.log("resp",response,siteID,CurrentsiteID);
        // const settingsData = setsettingArray(await getSettingAPI(sp))
        // console.log(settingsData, 'settingsData');

        // setQuickLinkArray(await sp.web.lists.getByTitle(listTitle).items.getAll());
        const settingsData = await sp.web.lists.getByTitle(listTitle).items.select('Id', 'Title', 'URL', 'RedirectToNewTab', 'QuickLinkImage', 'Entity/Entity').expand('Entity').filter(`(Entity/Entity eq '${entity}' or Entity/Entity eq '${currentUserDept}') and IsActive eq 1`).getAll();
        setQuickLinkArray(settingsData);
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
              <div className="row manage-master mt-3">
                {QuickLinkArray.map((item: any) => {
                  const ImageUrl = item.QuickLinkImage == undefined || item.QuickLinkImage == null ? "" : JSON.parse(item.QuickLinkImage);
                  // let img1 = imageData && imageData.fileName ? `${SiteUrl}/_api/v2.1/sites('${siteId}')/lists('${listID}')/items('${item.ID}')/attachments('${imageData.fileName}')/thumbnails/0/c400x400/content` : ""

                  const imageUrl = ImageUrl?.serverRelativeUrl  
                        
                        ? `${Tenant_URL}/${ImageUrl.serverRelativeUrl}`
                        : require("../assets/news.png");
                  return (<div className="col-sm-3 col-md-3 mt-2 newwidth6" key={item?.Id}>
                    <a href={item?.URL} target={item?.RedirectToNewTab ? "_blank" : "_self"}>
                      <div className="aaplnbg">
                      <div className="aaplnbg">
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
                })}
              </div>
              
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

const Quicklinks :React.FC<IQuicklinksProps> = (props) => {
  return (
    <Provider>
    <MastersettingContext props={props} />
  </Provider>
  )
}

export default Quicklinks
