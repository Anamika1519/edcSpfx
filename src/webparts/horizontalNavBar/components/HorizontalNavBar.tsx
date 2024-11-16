// HorizontalNavbar.tsx
import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faExpand, faBell, faSun, faMoon, faGear } from '@fortawesome/free-solid-svg-icons';
import "../../horizontalNavBar/components/horizontalNavbar.scss";
import { Bell, ChevronDown, Maximize, Menu, Moon, Search, Settings, User, X } from 'react-feather';
import UserContext from '../../../GlobalContext/context';
import { SPFI } from '@pnp/sp';
import { getSP } from '../loc/pnpjsConfig';
import { useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { addActivityLeaderboard, getARGNotificationHistory, getCurrentUserName, getCurrentUserProfileEmail, UpdateNotification } from '../../../APISearvice/CustomService';
import "../../../CustomCss/mainCustom.scss"
import moment from 'moment';
import NotificationList from '../../../CustomJSComponents/CustomForm/NotificationList';
interface ListFieldsMapping {
  ARGAnnouncementAndNews: string;
  ARGBlogs: string;
  ARGDiscussionForum: string;
  ARGGroupandTeam: string;
  ARGProject: string;
  ARGSocialFeed: string;
  ARGEventMaster: string;
  ARGMediaGallery: string;
}

type ListTitle = keyof ListFieldsMapping;

interface SearchResult {
  ListTitle: ListTitle;
  [key: string]: any;
}
const HorizontalNavbar = ({ _context, siteUrl }: any) => {
  const listFieldsMapping: { [key: string]: { fields: string[], pageName: string } } = {
    ARGAnnouncementAndNews: { fields: ["Title", "Overview", "Description", "Id", "AnnouncementandNewsTypeMaster/Id", "AnnouncementandNewsTypeMaster/TypeMaster"], pageName: "AnnouncementDetails" },
    ARGBlogs: { fields: ["Title", "Overview", "Description", "Id"], pageName: "BlogDetails" },
    ARGDiscussionForum: { fields: ["Topic", "Overview", "Description", "Id"], pageName: "DiscussionForumDetail" },
    ARGGroupandTeam: { fields: ["GroupName", "Overview", "Id"], pageName: "GroupandTeamDetails" },
    ARGProject: { fields: ["ProjectName", "ProjectOverview", "Id"], pageName: "ProjectDetails" },
    ARGSocialFeed: { fields: ["Contentpost", "Id"], pageName: "SocialFeed" },
    ARGEventMaster: { fields: ["EventName", "Overview", "EventAgenda", "Id"], pageName: "EventDetailsCalendar" },
    ARGMediaGallery: { fields: ["Title", "Id"], pageName: "Mediadetails" }
  };
  console.log(siteUrl, 'siteUrl');

  const { useHide }: any = React.useContext(UserContext);
  const elementRef = React.useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const { setHide }: any = React.useContext(UserContext);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [settingArray, setSettingArray] = useState([]);
  const [commentText, setCommentText] = useState<string>('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyText, setReplyText] = useState<string>('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isOpenBell, setIsOpenBell] = React.useState(false);

  const [currentUser, setCurrentUser] = React.useState("")
  const [currentUserEmail, setCurrentUserEmail] = React.useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  // Helper function to generate unique IDs
  const generateId = () => Math.floor(Math.random() * 100000);
  const [issearchOpen, setIsSearchOpen] = React.useState(false);
  const { useFullscreen, toggleHide, toggleFullscreen }: any = React.useContext(UserContext);
  const headerRef = useRef(null); // Reference to the header
  const [isSticky, setIsSticky] = useState(false);
  const scrollContainerRef = useRef(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [NotificationArray, setNotificationArray] = useState([]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const toggleDropdownBell = () => {
    setIsOpenBell(!isOpenBell);
  };
  const handleScroll = () => {
    if (headerRef.current) {
      const sticky = headerRef.current.offsetTop;
      if (window.scrollY > sticky) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    }
  };

  React.useEffect(() => {
    ApiCall();

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
    }

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
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
        window.addEventListener("scroll", handleScroll);
      }
    };
  }, [useHide]);
  const toggleSearchDropdown = () => {
    setIsSearchOpen(!issearchOpen);
  };
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  const handleSidebarToggle = (bol: boolean) => {
    debugger
    setIsSidebarOpen(prevState => !prevState);
    setHide(!bol);
    document.querySelector(".sidebar")?.classList.toggle("close");
  };
  const handleThemeToggle = () => {
    setIsDarkMode((prevState: any) => !prevState);
    document.querySelector("body")?.classList.toggle("dark");
  };
  // const imgLogo = require("../assets/useimg.png");


  const ApiCall = async () => {
    setCurrentUser(await getCurrentUserName(_context))
    setCurrentUserEmail(await getCurrentUserProfileEmail(_context))

    setNotificationArray(await getARGNotificationHistory(_context))
    // console.log(settingsData, 'settingsData');
  };
  console.log(currentUser, siteUrl, 'currentUser');


  const searchAllLists = async (query: string): Promise<any[]> => {
    try {
      const lists = await _context.web.lists();
      let results: any[] = [];

      for (const list of lists) {
        const listTitle = list.Title.trim();
        const listMapping = listFieldsMapping[listTitle];

        if (listMapping) {
          const { fields, pageName } = listMapping;

          // Start building the query
          let queryBuilder = _context.web.lists.getByTitle(listTitle).items.top(100).select(...fields);

          // Conditionally expand for the specific list
          if (listTitle === "ARGAnnouncementAndNews") {
            queryBuilder = queryBuilder.expand("AnnouncementandNewsTypeMaster");
          }

          // Execute the query
          const items = await queryBuilder();

          // Filter items based on the search query
          const filteredItems = items.filter((item: any) =>
            fields.some(field =>
              typeof item[field] === 'string' && item[field].toLowerCase().includes(query.toLowerCase()) ||
              // Check for the expanded lookup field only for the specific list
              (listTitle === "ARGAnnouncementAndNews" &&
                item.AnnouncementandNewsTypeMaster &&
                item.AnnouncementandNewsTypeMaster.TypeMaster &&
                item.AnnouncementandNewsTypeMaster.TypeMaster.toLowerCase().includes(query.toLowerCase()))
            )
          );

          // Add ListTitle and PageName properties to the filtered items
          filteredItems.forEach((item: any) => {
            item.ListTitle = listTitle;
            item.PageName = pageName; // Add the PageName for each item
          });

          // Combine results
          results = [...results, ...filteredItems];
        }
      }



      return results;
    } catch (error) {
      console.error("Error searching lists:", error);
      return [];
    }
  };

  const searchKeyPress = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const queryText = e.target.value;
    setQuery(queryText);

    if (queryText && queryText.length > 2) {
      const searchResults = await searchAllLists(queryText);
      console.log(searchResults);

      setSearchResults(searchResults);
    }
  };
  const handleSearchClick = async (result: any) => {

    await addActivityLeaderboard(_context, "Search Results Click");
    debugger
    setTimeout(() => {
      window.location.href =
        result?.AnnouncementandNewsTypeMaster?.TypeMaster == "News"
          ?
          `${siteUrl}/SitePages/Newsdetails.aspx?${result.Id}`
          : `${siteUrl}/SitePages/${result.pageName}.aspx?${result.Id}`
    }, 2000);

  };
  const handleNotificationClick = async (result: any) => {

    await UpdateNotification(result.Id, _context);
    debugger
    setTimeout(() => {
      window.location.href =
        `${siteUrl}/SitePages/${result.DeatilPage}.aspx?${result.Id}`
    }, 2000);

  };
  return (
    // <nav className="navbar container-fluid" style={{ zIndex: '99' }}>
    //   <div className="logo_item">
    //     <div className="bottom_content">
    //       <div className="bottom expand_sidebar">
    //         <FontAwesomeIcon className={`bx bx`} icon={faBars} size='xs' />
    //       </div>
    //     </div>
    //   </div>

    //   <div className="navbar_content">
    //     <div className="search_bar">
    //       <input type="text" placeholder="Search.." className='searchcss' />
    //     </div>
    //     <FontAwesomeIcon className='bx bx-bell' icon={faExpand} onClick={toggleFullscreen} size='lg' />
    //     <FontAwesomeIcon className='bx bx-bell' icon={faBell} />
    //     <FontAwesomeIcon className={isDarkMode ? 'bx bx-moon' : 'bx bx-sun'} onClick={handleThemeToggle} icon={isDarkMode ? faMoon : faSun} size='lg' />
    //     <div className="dropdown">
    //       <img src={imgLogo} alt="Profile" className="profile dropbtn" onClick={toggleDropdown} />
    //       <div id="myDropdown" className={`dropdown-content ${isOpen ? 'show' : ''}`}>
    //         <a href="#home">Home</a>
    //         <a href="#about">About</a>
    //         <a href="#contact">Contact</a>
    //       </div>
    //     </div>
    //     <FontAwesomeIcon className='bx bx-user' icon={faGear} size='lg' />
    //   </div>
    // </nav>
    <div style={{ zIndex: '99' }} ref={headerRef}
      className={isSticky ? "sticky " : "navbar"}
      id="myHeader">
      <div className='navcss' style={{ marginLeft: `${!useHide ? '240px' : '80px'}` }} >
        <div className="" onClick={() => handleSidebarToggle(useHide)}>
          <div className={` ${useHide ? 'sidebar-closedBar' : 'sidebar-openBa'}`} onClick={() => handleSidebarToggle(useHide)}>
            <div className="" onClick={() => handleSidebarToggle(useHide)}>
              <Menu size={22} className='desktoView' />
              <Menu size={80} className='searchcssmobile' />
            </div>
          </div>
        </div>
        <div className={`navbar_content ${useHide ? 'searchcssmobile sidebar-closedBar' : 'searchcssmobile sidebar-openBa'}`} >
          <div className="search_bar">

            <input
              type="text"
              value={query} className='searchcss desktoView'
              onChange={(e) => searchKeyPress(e)}
              onClick={toggleSearchDropdown}
              placeholder="Search..."
            />
          </div>
          <div className="dropdown">
            <Search className='searchcssmobile' size='80' onClick={toggleSearchDropdown} />

            <div id="myDropdown" className={`dropdown-content ${issearchOpen ? 'show' : ''}`}>

              <input
                type="text"
                value={query}
                className='searchcss searchcssmobile'
                onChange={(e) => searchKeyPress(e)}
                placeholder="Search..."
              />
              <div className={searchResults.length > 0 ? 'search-results' : ''}>

                <div className={searchResults.length > 0 ? 'scrollbar' : ''} id={searchResults.length > 0 ? 'style-6' : ''}>
                  {searchResults.length > 0 && <span style={{ padding: '0.85rem' }}>Found {searchResults.length} results</span>}
                  {searchResults.length > 0 ? (
                    searchResults.map((result, index) => (
                      <div key={index} className="search-result-item">

                        <a onClick={() => handleSearchClick(result)} style={{ padding: '0.85rem' }}>
                          <h4 className='eclipcsss' style={{ fontSize: '0.9rem' }}>{result.Title || result.ProjectName || result.EventName || result.Contentpost}</h4>
                          {/* {result.Description && <p dangerouslySetInnerHTML={{ __html: result.Description }}></p>} */}
                          {result.Overview && <p className='eclipcsss' style={{ fontSize: '0.7rem' }}>{result.Overview}</p>}
                          {result.EventAgenda && <p className='eclipcsss' style={{ fontSize: '0.7rem' }}>{result.EventAgenda}</p>}
                        </a>
                      </div>
                    ))
                  ) : (
                    null
                  )}
                  <div className="force-overflow"></div>
                </div>
              </div>

            </div>
          </div>
          <Maximize className='bx bx-bell desktoView' size='22' onClick={toggleFullscreen} />
          <div className="dropdown notification-lists">

            <a className="nav-link dropdown-toggle waves-effect waves-light arrow-none" data-bs-toggle="dropdown"
              role="button" aria-haspopup="false" aria-expanded="false">
              <Bell className='bx bx-bell desktoView dropcssBell' size='22' onClick={toggleDropdownBell} style={{ position: 'relative' }} />
              <span className="badge bg-danger noti-icon-badge">{NotificationArray.length}</span>
            </a>

            <div id="myDropdownBell" className={`dropdown-content  ${isOpenBell ? 'show desktoView' : ''}`} style={{ width: '320px' }}>

              
              <NotificationList NotificationArray={NotificationArray} handleNotificationClick={handleNotificationClick} />

            </div>
          </div>
          <Moon size='22' className={isDarkMode ? 'bx bx-moon desktoView' : 'bx bx-sun desktoView'} onClick={handleThemeToggle} />
          <div className="dropdown searchcssmobile ">
            <Bell className='bx bx-bell searchcssmobile dropcssBell' size='80' onClick={toggleDropdownBell} />
            {/* <div id="myDropdownBell" className={`dropdown-content searchcssmobile ${isOpenBell ? 'show' : ''}`}>

              
              <NotificationList NotificationArray={NotificationArray} handleNotificationClick={handleNotificationClick}/>

            </div> */}
          </div>
          <div className="dropdown">
            <div className='d-flex' onClick={toggleDropdown} style={{ gap: '2px', cursor: 'pointer' }}>
              <div >

                <img src={`${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${currentUserEmail}`}
                  className="rounded-circlecss img-thumbnail desktoView 
                                  avatar-xl"
                  alt="profile-image"
                  style={{ cursor: "pointer" }} />
                <img src={`${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${currentUserEmail}`}
                  className="rounded-circlecss img-thumbnail searchcssmobile 
                                  avatar-xl"
                  alt="profile-image"
                  style={{ cursor: "pointer" }} />

              </div>
              <div className='dropcssUser desktoView'>
                <div>{currentUser}</div>
                <div><ChevronDown size={12} /></div>
              </div>
            </div>
            <div id="myDropdown" className={`dropdown-content ${isOpen ? 'show' : ''}`}>
              <a href="#home">Home</a>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
          <Settings className='bx bx-user desktoView' size='22' />
          <Settings className='bx bx-user searchcssmobile' size='80' />
        </div>
      </div>
    </div>
  );
};

export default HorizontalNavbar;
