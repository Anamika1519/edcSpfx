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
import "../components/Managemaster.scss";
import CustomBreadcrumb from '../../../CustomJSComponents/CustomBreadcrumb/CustomBreadcrumb';
import "../../horizontalNavBar/components/horizontalNavbar.scss";
import "../../../Assets/Figtree/Figtree-VariableFont_wght.ttf";
import { getSettingAPI, getSettingAPImanagemaster } from "../../../APISearvice/settingsService";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';
import HorizontalNavbar from '../../horizontalNavBar/components/HorizontalNavBar';
//import styles from "../components/MasterManage.module.scss"
import { IMasterManageProps } from './IMasterManageProps';
import { useEffect, useState } from 'react';
import { Tenant_URL } from '../../../Shared/Constants';
const endsWith = (str: string, ending: string) => {
  console.log("strrrr", str, ending)
  return str.slice(-ending.length) === ending;
}
let siteID: any;
let response: any;
let mycurrentpageurl:any
export const MastersettingContext = ({ props }: any) => {
  const sp: SPFI = getSP();
  console.log(sp, 'sp');
  const [showIframe, setShowIframe] = useState(false);
  const [iframeUrl, setIframeUrl] = useState('');
  const handleCardClick = (url: any) => {
    setIframeUrl(url);
    setShowIframe(true);
    mycurrentpageurl= url;

    // hideElementsInIframe()

  };

  // this was old code working fine but there was issue after adding user in iframe it was rendering entire webpart
  // useEffect(() => {
  //   if (showIframe && iframeUrl) {
  //     const iframe = document.querySelector('iframe');
  //     if (iframe) {
  //       const handleLoad = () => {
  //         const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
  //         const sideNavBox = iframeDocument.getElementById('sideNavBox');
  //         const s4TitleRow = iframeDocument.getElementById('s4-titlerow');
  //         const mainribbon = iframeDocument.getElementById('suiteBarDelta');

  //         if (sideNavBox) {
  //           // sideNavBox.style.display = 'none';
  //           sideNavBox.remove()
  //         }
  //         if (mainribbon) {
  //           // sideNavBox.style.display = 'none';
  //           mainribbon.remove()
  //         }
  //         if (s4TitleRow) {
  //           // s4TitleRow.style.display = 'none';
  //           s4TitleRow.remove()
  //         }
  //       };

  //       iframe.addEventListener('load', handleLoad);

  //       // Cleanup the event listener
  //       return () => {
  //         iframe.removeEventListener('load', handleLoad);
  //       };
  //     }
  //   }
  // }, [showIframe, iframeUrl]);
  
  
  useEffect(() => {
    if (showIframe && iframeUrl) {
      const iframe = document.querySelector('iframe');
  
      if (iframe) {
        const handleLoad = () => {
          const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
  
          // ✅ Remove side panels
          const sideNavBox = iframeDocument.getElementById('sideNavBox');
          const s4TitleRow = iframeDocument.getElementById('s4-titlerow');
          const mainribbon = iframeDocument.getElementById('suiteBarDelta');
  
          sideNavBox?.remove();
          mainribbon?.remove();
          s4TitleRow?.remove();
  
          // ✅ Start polling for inner dialog iframe
          // const pollForDialogIframe = setInterval(() => {
          //   try {
          //     const dialogIframe = iframe.contentWindow.document.querySelector('iframe[style*="z-index"]') as HTMLIFrameElement;
              
          //     if (dialogIframe) {
          //       console.log(dialogIframe.getElementsByClassName , "✅ Dialog iframe found");
          //       console.log("✅ Dialog iframe found");
            
          //       const dialogDoc = dialogIframe.contentDocument || dialogIframe.contentWindow.document;
          //       const shareButton = dialogDoc?.getElementById("ctl00_PlaceHolderMain_btnShare");
  
          //       if (shareButton) {
          //         alert("Share button clicked in dialog iframe");
          //         console.log("✅ Share button found!");
  
          //         shareButton.addEventListener('click', () => {
          //           console.log("⏳ Share clicked! Reloading page in 3 sec...");
          //           setTimeout(() => {
          //             window.location.reload();
          //           }, 3000);
          //         });
  
          //         clearInterval(pollForDialogIframe);
          //       }
          //     }
          //   } catch (err) {
          //     console.warn("⚠️ Error accessing dialog iframe", err);
          //   }
          // }, 1000);
  const monitorShareButton = () => {
    const outerIframe = document.getElementById("iframe") as HTMLIFrameElement;
  
    if (!outerIframe) return;
  
    const tryAttachShareListener = () => {
      try {
        const outerDoc = outerIframe.contentDocument || outerIframe.contentWindow.document;
  
        const dlgFrameContainer = outerDoc.querySelector(".ms-dlgFrameContainer");
  
        if (!dlgFrameContainer) {
          console.log("❌ Dialog not yet loaded.");
          return;
        }
  
        const innerIframe = dlgFrameContainer.querySelector("iframe") as HTMLIFrameElement;
  
        if (!innerIframe) {
          console.log("❌ Inner iframe not found.");
          return;
        }
  
        innerIframe.onload = () => {
          try {
            const innerDoc = innerIframe.contentDocument || innerIframe.contentWindow.document;
  
            const shareButton = innerDoc.querySelector("input[type='button'][value='Share'], button[value='Share'], button[title*='Share']");
  
            if (!shareButton) {
              console.log("❌ Share button not found.");
              return;
            }
  
            shareButton.addEventListener("click", () => {
              console.log("✅ Share button clicked. Reloading page...");
              // window.location.reload(); // or any callback
              // setShowIframe(false);
              setTimeout(() => {
               setIframeUrl('about:blank');
              },1500);
               // or setIframeUrl('');
                setTimeout(() => {
                setIframeUrl(mycurrentpageurl);
              }, 1500);
  
            });
  
            console.log("✅ Share button listener attached.");
          } catch (err) {
            console.error("❌ Error accessing inner iframe:", err);
          }
        };
      } catch (err) {
        console.error("❌ Error in outer iframe handling:", err);
      }
    };
  
    const observeDialogForShareClick = () => {
    const checkAndBind = () => {
      const dlgContainer = document.querySelector('.ms-dlgFrameContainer iframe') as HTMLIFrameElement;
      if (dlgContainer && dlgContainer.contentWindow) {
        try {
          const shareIframeDoc = dlgContainer.contentDocument || dlgContainer.contentWindow.document;
  
          const tryFindButton = () => {
            const buttons = shareIframeDoc.querySelectorAll('input[type="button"], button');
            buttons.forEach((btn: any) => {
              if (btn.value?.toLowerCase().includes("share") || btn.innerText?.toLowerCase().includes("share")) {
                btn.addEventListener('click', () => {
                  console.log("✅ Share button clicked!");
                  setTimeout(() => {
                    // location.reload();
                     setIframeUrl('about:blank'); // or setIframeUrl('');
              setTimeout(() => {
                setIframeUrl(mycurrentpageurl);
              }, 1500);
                    // or window.location.reload()
                  }, 2500); // Give SharePoint time to complete the operation
                });
              }
            });
          };
  
          // Wait a bit before checking the iframe contents to ensure it's fully loaded
          setTimeout(tryFindButton, 1000);
        } catch (err) {
          console.warn("Can't access inner iframe due to cross-origin:", err);
        }
      } else {
        console.log("⏳ Waiting for dialog iframe...");
        setTimeout(checkAndBind, 500);
      }
    };
  
    checkAndBind();
  };
  
  
    // Retry checking every second for dialog popup
    const intervalId = setInterval(() => {
      const dlgFrame = outerIframe.contentDocument?.querySelector(".ms-dlgFrameContainer iframe");
      if (dlgFrame) {
        clearInterval(intervalId);
        tryAttachShareListener();
      }
    }, 1000);
  };
  
  // Call this after page is loaded and iframe is ready
  monitorShareButton();
  
  
        };
  
        iframe.addEventListener('load', handleLoad);
  
        return () => {
          iframe.removeEventListener('load', handleLoad);
        };
      }
    }
  }, [showIframe, iframeUrl]);
  const handleBackClick = () => {
    setShowIframe(false);
  };
  function hideElementsInIframe() {

    const iframe = document.querySelector('iframe');
    iframe.addEventListener('load', () => {

      const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
      const sideNavBox = iframeDocument.getElementById('sideNavBox');
      const s4TitleRow = iframeDocument.getElementById('s4-titlerow');
      const s4TitleRow2 = iframeDocument.getElementById('s4-ribbonrow');

      if (sideNavBox) {
        sideNavBox.remove()
        // sideNavBox.style.display = 'none';
      }
      if (s4TitleRow) {
        // s4TitleRow.style.display = 'none';
        s4TitleRow.remove()
      }
      if (s4TitleRow2) {
        // s4TitleRow.style.display = 'none';
        s4TitleRow.remove()
      }
    });
  }
  const isSpecialGroup = (linkUrl: any) => {
    const specialGroups = ['Super Admin Group', 'Content Contributor Group', 'Intranet Member Group' , 'Strategy and Sustainable Growth Group' , 'Organizational Excellence Specialist Group'];
    // const specialGroups = ['Super Admin Group', 'Content Contributor Group', 'Intranet Member Group'];
    return specialGroups.some(group => linkUrl.includes(group));
  };
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

    let sidebarnavitems = await sp.web.lists.getByTitle("ARGSidebarNavigation").items.select("Title,Url,Icon,ParentId,ID,EnableAudienceTargeting,Audience/Title").expand("Audience").filter("IsActive eq 1").orderBy("Order0", true).getAll();

    let securednavitems = sidebarnavitems.filter((nav: any) => {
      return (nav.EnableAudienceTargeting && nav.Audience && nav.Audience.some((nv1: any) => { return grptitle?.includes(nv1.Title.toLowerCase()); }))
    }
    )
    console.log("sidebarnavitems", sidebarnavitems, securednavitems)
    let access = securednavitems.some((navitm: any) => (navitm.Url) ? endsWith(navitm.Url.toLowerCase(), location.pathname.toLowerCase()) : false);
    console.log("acess", access);
    //return securednavitems.some((navitm:any)=> (navitm.Url)?endsWith(navitm.Url.toLowerCase(),location.pathname.toLowerCase()):false)
    return securednavitems.length > 0;
  }
  React.useEffect(() => {
    ApiCall()
    console.log('This function is called only once', useHide);
    IsUserAllowedAccess().then(bAllowed => {

      console.log("%c Access allowed", "color:green,font-size:14px", bAllowed);
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
    let listTitle = 'Settings'
    let CurrentsiteID = props.context.pageContext.site.id;
    siteID = CurrentsiteID;
    response = await sp.web.lists.getByTitle(listTitle).select('Id')();
    console.log("resp", response, siteID, CurrentsiteID);
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

  // Function to check the URL and show an alert
  function checkUrlForMembershipGroupId() {
    const currentUrl = window.location.href;
    const pattern = /_layouts\/15\/people\.aspx\?MembershipGroupId=32/;

    if (pattern.test(currentUrl)) {
      //alert("Match found: MembershipGroupId=32");
    }
  }

  // Call the function
  checkUrlForMembershipGroupId();

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
                {/* {console.log("IsUserAlllowed",IsUserAlllowed,settingArray)}
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
                } */}

                {!showIframe ? (
                  IsUserAlllowed ? (
                    // settingArray.map((item) => {
                    //   const ImageUrl = item.ImageIcon == undefined || item.ImageIcon == null ? "" : JSON.parse(item.ImageIcon);
                    settingArray.map((item: any) => {
                      debugger
                      const ImageUrl = item.ImageIcon == undefined || item.ImageIcon == null ? "" : JSON.parse(item.ImageIcon);
                      const imageData = item.ImageIcon == undefined || item.ImageIcon == null ? "" : JSON.parse(item.ImageIcon);
                      let siteId = siteID;
                      let listID = response && response.Id;
                      let img1 = imageData && imageData.fileName ? `${SiteUrl}/_api/v2.1/sites('${siteId}')/lists('${listID}')/items('${item.ID}')/attachments('${imageData.fileName}')/thumbnails/0/c400x400/content` : ""
                      let img = imageData && imageData.serverRelativeUrl != undefined ? `${Tenant_URL}${imageData.serverRelativeUrl}` : img1
                      const imageUrl = imageData
                        //? `${siteUrl}/SiteAssets/Lists/ea596702-57db-4833-8023-5dcd2bba46e3/${imageData.fileName}`
                        //? `${imageData.serverUrl}${imageData.serverRelativeUrl}`
                        ? img
                        : require("../assets/news.png");
                      console.log("imageurl", imageData && imageData.serverRelativeUrl,imageUrl)
                      return (
                        <div className="col-sm-3 col-md-3 mt-2" key={item.Title}>
                          {isSpecialGroup(item?.Title) ? (
                            <div
                              className="card-master box1"
                              onClick={() => handleCardClick(item?.LinkUrl)}
                            >
                              <div className="icon">
                                {console.log(imageUrl, "final image", item.Title, "new url",`${SiteUrl}/SiteAssets/Lists/${listID}/${imageData.fileName}`)}
                                <img src={imageUrl} alt="Icon" />
                              </div>
                              <p className="text-dark">{item.Title}</p>
                            </div>
                          ) : (
                            <a href={item?.LinkUrl}>
                              <div className="card-master box1">
                                <div className="icon">
                                    <img src={imageUrl} alt="Icon" />
                                </div>
                                <p className="text-dark">{item.Title}</p>
                              </div>
                            </a>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div>Access Denied</div>
                  )
                ) : (
                  <div>
                    <button
                      style={{ margin: '10px' }}
                      className="btn btn-secondary"
                      onClick={handleBackClick}
                    >
                      Back
                    </button>
                    <iframe
                      id='iframe'
                      src={iframeUrl}
                      style={{ width: '100%', height: '600px', border: 'none' }}
                      title="Content"
                    ></iframe>
                  </div>
                )}
                <div id="iframeContainer" style={{ marginTop: '20px' }}></div>


                {/* {
  IsUserAlllowed ? (
    settingArray.map((item: any) => {
      const ImageUrl = item.ImageIcon == undefined || item.ImageIcon == null ? "" : JSON.parse(item.ImageIcon);
      return (
        <div className="col-sm-3 col-md-3 mt-2">
          <div
            className="card-master box1"
            onClick={() => {
              const iframe = document.createElement("iframe");
              iframe.src = item?.LinkUrl;
              iframe.style.width = "100%";
              iframe.style.height = "600px"; // Adjust height as needed
              iframe.style.border = "none";

              const container = document.getElementById("iframeContainer");
              container.innerHTML = ""; // Clear previous content
              container.appendChild(iframe);
            }}
          >
            <div className="icon">
              <img src={ImageUrl?.serverUrl + ImageUrl?.serverRelativeUrl} alt="Icon" />
            </div>
            <p className="text-dark">{item.Title}</p>
          </div>
        </div>
      );
    })
  ) : (
    <div>Access Denied</div>
  )
}


<div id="iframeContainer" style={{ marginTop: '20px' }}></div> */}

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

const MasterManage: React.FC<IMasterManageProps> = (props) => {
  return (
    <Provider>
      <MastersettingContext props={props} />
    </Provider>
  );
};

export default MasterManage;