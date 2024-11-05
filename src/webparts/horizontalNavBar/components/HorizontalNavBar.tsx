// HorizontalNavbar.tsx
import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faExpand, faBell, faSun, faMoon, faGear } from '@fortawesome/free-solid-svg-icons';
import "../../horizontalNavBar/components/horizontalNavbar.scss";
import { Bell, ChevronDown, Maximize, Menu, Moon, Search, Settings, User } from 'react-feather';
import UserContext from '../../../GlobalContext/context';
import { SPFI } from '@pnp/sp';
import { getSP } from '../loc/pnpjsConfig';
import { useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { getCurrentUserName, getCurrentUserProfileEmail } from '../../../APISearvice/CustomService';
import "../../../CustomCss/mainCustom.scss"

const HorizontalNavbar = ({ _context, siteUrl }: any) => {

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
  const [currentUser, setCurrentUser] = React.useState("")
  const [currentUserEmail, setCurrentUserEmail] = React.useState("")

  // Helper function to generate unique IDs
  const generateId = () => Math.floor(Math.random() * 100000);
  const [issearchOpen, setIsSearchOpen] = React.useState(false);
  const { useFullscreen, toggleHide, toggleFullscreen }: any = React.useContext(UserContext);
  const headerRef = useRef(null); // Reference to the header
  const [isSticky, setIsSticky] = useState(false);
  const scrollContainerRef = useRef(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
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

    // const settingsData = setSettingArray(await getSettingAPI(sp))
    // console.log(settingsData, 'settingsData');
  };
  console.log(currentUser, siteUrl, 'currentUser');

  const searchAllLists = async (query: string) => {
    try {
        const listFieldsMapping: { [key: string]: string } = {
            "ARGAnnouncementAndNews": "Title",
            "ARGBlogs": "Title",
            "ARGDiscussionForum": "Topic",
            "ARGGroupandTeam": "GroupName",
            "ARGProject": "ProjectName",
            "ARGSocialFeed": "ContentPost",
            "ARGEventMaster": "EventName",
            "ARGMediaGallery": "Title"
        };

        const lists = await _context.web.lists();
        console.log("Lists retrieved:", lists);

        // Log all the keys in listFieldsMapping for comparison
        console.log("Field Mapping Keys:", Object.keys(listFieldsMapping));

        let searchResults: any[] = [];

        for (const list of lists) {
            const listTitle = list.Title.trim(); // Normalize by trimming
            console.log("Checking list title:", listTitle);

            // Use the original case for matching
            const fieldName = listFieldsMapping[listTitle];

            // Log the resolved fieldName
            if (fieldName) {
                console.log(`Field name for "${listTitle}" is "${fieldName}"`);
                const items = await _context.web.lists.getByTitle(listTitle).items
                    .top(100)
                    .select(fieldName)
                    ();

                // Perform client-side filtering
                const filteredItems = items.filter((item: any) =>
                    item[fieldName] && item[fieldName].toLowerCase().includes(query.toLowerCase())
                );

                searchResults = [...searchResults, ...filteredItems];
            } 
        }

        console.log("Search results:", searchResults);
        return searchResults;
    } catch (error) {
        console.error("Error searching lists:", error);
        return [];
    }
};

  const searchKeyPress = async (e: any) => {
    debugger;
    if (e.target.value !== "") {
      e.preventDefault();
      const searchResults = await searchAllLists(e.target.value);
      console.log(searchResults),'searchResults';
      
      setResults(searchResults);
    }

  }
  const handleSearch = async () => {
    const searchResults = await searchAllLists(query);
    setResults(searchResults);
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
              placeholder="Search..."
            />
          </div>
          <div className="dropdown">
            <Search className='searchcssmobile' size='80' onClick={toggleSearchDropdown} />

            <div id="myDropdown" className={`dropdown-content ${issearchOpen ? 'show' : ''}`}>

              <input
                type="text"
                value={query} className='searchcss searchcssmobile'
                onChange={(e) => searchKeyPress(e)}
                placeholder="Search..."
              />
              <ul>
                {results.length>0&& results.map((item, index) => (
                  <li key={index}>{item.Title}</li>
                ))}
              </ul>
            </div>
          </div>
          <Maximize className='bx bx-bell desktoView' size='22' onClick={toggleFullscreen} />
          <Bell className='bx bx-bell desktoView' size='22' />
          <Moon size='22' className={isDarkMode ? 'bx bx-moon desktoView' : 'bx bx-sun desktoView'} onClick={handleThemeToggle} />
          <Bell className='bx bx-bell searchcssmobile' size='80' />
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
