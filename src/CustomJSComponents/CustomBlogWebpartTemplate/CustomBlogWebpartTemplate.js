import React, { useEffect, useState,useRef } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import "./CustomBlogWebpartTemplate.scss";
import "../../CustomCss/mainCustom.scss";
import "../../Assets/Figtree/Figtree-VariableFont_wght.ttf";
import { Share2 } from 'feather-icons-react';
import { Bookmark } from 'feather-icons-react';
import { Calendar } from 'feather-icons-react';
import moment from 'moment';
import {getCurrentUserProfileEmail} from "../../APISearvice/CustomService";
import {fetchBlogdata,fetchBookmarkBlogdata} from "../../APISearvice/BlogService"
const CustomBlogWebpartTemplate = ({ _sp, SiteUrl }) => {
    const [copySuccess, setCopySuccess] = useState('');
    const [show, setShow] = useState(false)
    const [NewsData, setNews] = useState([])
    const [showDropdownId, setShowDropdownId] = useState(null);
    const [currentEmail, setEmail] = useState('');
    const [blogData, setBlogData] = useState('');
    const menuRef = useRef(null);
    const [isMenuOpenshare, setIsMenuOpenshare] = useState(false);
    const [activeTab, setActiveTab] = useState("all");
    const [filteredBlogItems, setFilteredBlogItems] = useState('');
    const [Bookmarkblogs, setBookmarkblogs] = useState('');
    useEffect(() => {
        if (activeTab === "all") {
            setFilteredBlogItems(blogData);
        } else {
            // Find the selected category based on activeTab
            const selectedCategory = FilterOptions.find(
                (category) => category.Name.toLowerCase() === activeTab.toLowerCase()
            );
            { console.log("filteredMediaItemsselectedCategory", filteredBlogItems, activeTab, selectedCategory,currentEmail, blogData) }
            if (selectedCategory) {
                // Filter items based on the selected category's ID
                if(selectedCategory.Name == "Bookmarked"){
                    // const filteredItems = blogData.filter(
                    //     (item) =>item.BookmarkedBy && item.BookmarkedBy.EMail === currentEmail
                    // );
                    console.log("currentEmailcurrentEmail",Bookmarkblogs)
                    setFilteredBlogItems(Bookmarkblogs);
                } else {
                    const filteredItems = blogData.filter(
                        (item) => item.Status === selectedCategory.Name
                    );
                    setFilteredBlogItems(filteredItems);
                }
               
            } else {
                // If no category matches, show no items
                setFilteredBlogItems([]);
            }
           
        }
        { console.log("filteredMediaItemsafter", filteredBlogItems) }
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpenshare(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [_sp, SiteUrl, activeTab, blogData])

    useEffect(() => {
        ApIcall();
    }, []);
    const FilterOptions = [{ id: 1, Name: "Published", name: "Published" }, { id: 2, Name: "Save as Draft", name: "Your Drafts" }, { id: 3, Name: "Bookmarked", name: "Bookmarked" }]
  
    const ApIcall = async () => {
        setEmail(await getCurrentUserProfileEmail(_sp));
        setBlogData(await fetchBlogdata(_sp));
        setActiveTab("Published");
        setBookmarkblogs(await fetchBookmarkBlogdata(_sp));
        // console.log("check data of blogs---",blogData)
        // const dataofblog = await fetchBlogdata(sp);
        // console.log("check the data of blog",dataofblog)
        // setBlogData(dataofblog);
 
    }
    const handleTabClick = (tab, Id) => {
        setActiveTab(tab.toLowerCase());
    };
    const truncateText = (text, maxLength) => {
        if(text!=null)
        {
            return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
 
        }
    };
 
    const gotoBlogsDetails = (valurArr) => {
        localStorage.setItem("NewsId", valurArr.Id)
        localStorage.setItem("NewsArr", JSON.stringify(valurArr))
        setTimeout(() => {
            window.location.href = `${SiteUrl}/SitePages/BlogDetails.aspx?${valurArr.Id}`;
        }, 1000);
    }
 
    const copyToClipboard = (Id) => {
        const link = `${siteUrl}/SitePages/BlogDetails.aspx?${Id}`;
        navigator.clipboard.writeText(link)
          .then(() => {
            setCopySuccess('Link copied!');
            setTimeout(() => setCopySuccess(''), 2000); // Clear message after 2 seconds
          })
          .catch(err => {
            setCopySuccess('Failed to copy link');
          });
      };
 
 
 
    const toggleDropdown = (itemId) => {
        if (showDropdownId === itemId) {
            setShowDropdownId(null); // Close the dropdown if already open
        } else {
            setShowDropdownId(itemId); // Open the dropdown for the clicked item
        }
    };
 
    const sendanEmail =()=>
    {
        window.open("https://outlook.office.com/mail/inbox");
 
    }
    return (
        <><div className="row mt-4" style={{ paddingLeft: '0.5rem' }}>
            {blogData.length > 0 ?
                blogData.filter(x => x.Status == "Published").slice(0, 1).map(item => {
                    const AnnouncementandNewsBannerImage = item.BlogBannerImage == undefined || item.BlogBannerImage == null ? ""
                        : JSON.parse(item.BlogBannerImage);
                    return (
                        <>
                        <div className="col-lg-5" onClick={() => gotoBlogsDetails(item)}>
                            <div className="imagemani mt- mb-3 me-2">
                                <img src={AnnouncementandNewsBannerImage?.serverUrl + AnnouncementandNewsBannerImage?.serverRelativeUrl}
                                    className="d-flex align-self-center me-3 w-100" lt="Generic placeholder image" style={{ objectFit: 'cover' }} />
                            </div>
                        </div>
                            <div className="col-lg-7">
                                <div className="row" style={{ paddingLeft: '0.5rem' }}>
                                    <div className="col-sm-4 text-left">
                                        <span style={{ padding: '5px', borderRadius: '4px', fontWeight: '500', color: '#009157', background:'rgba(0, 135, 81, 0.20)' }} className=" font-14 float-start mt-2">
                                            Latest Blog</span>
 
                                    </div>
                                    <div className="col-lg-12">
                                        <h4 style={{ lineHeight: '34px' }} className="page-title fw-700 mb-1  pe-5 font-28 titleHeading">
                                            {truncateText(item.Title, 120)}</h4>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <p className="mb-2 mt-1 d-block customhead">
                                                <span style={{ fontWeight: '400' }} className="pe-2 text-nowrap color-new font-12 mb-0 d-inline-block">
                                                    <Calendar size={12} color="#6b6b6b" strokeWidth={1} className="pl-2" style={{ fontWeight: '400' }} />
                                                    {moment(item.Created).format("DD-MMM-YYYY HH:mm")} &nbsp;  &nbsp;  &nbsp;|
                                                </span>
                                                <span style={{ fontWeight: '400' }} className="text-nowrap mb-0 color-new font-12 d-inline-block">
                                                    Author: <span style={{ color: '#009157', fontWeight: '600' }}>{item.Author.Title} &nbsp;  &nbsp;  &nbsp;|&nbsp;  &nbsp;  &nbsp;
                                                    </span>
 
                                                </span></p>
 
                                            <div style={{ clear: 'both'}}>
                                                <p className="d-block customdescription">{truncateText(item.Overview, 300)}</p>
                                            </div>
                                        </div>
                                        <a onClick={() => gotoBlogsDetails(item)} style={{ textDecoration: 'none' }}>
                                                <div style={{ height: '40px', lineHeight: '24px' }} className="btnCustomcss btn-primary">Read more..</div> </a>
                                    </div>
                                </div>
 
                            </div></>)
                }) : null}
        </div>
        <div className="row mt-2">
                <div className="col-12">
                    <div className="card mb-0 cardcsss">
                        <div className="card-body">
                            <div className="d-flex flex-wrap align-items-center justify-content-center">
                                <ul
                                    className="navs nav-pillss navtab-bgs"
                                    role="tablist"
                                    style={{
                                        gap: "5px",
                                        display: "flex",
                                        listStyle: "none",
                                        marginBottom: "unset",
                                    }}
                                >
                                    {console.log("FilterOptions", FilterOptions)}
                                    {FilterOptions.length > 0 && FilterOptions.map((res) => (
                                        <li className="nav-itemcss">
                                            <a
                                                className={`nav-linkss ${activeTab.toLowerCase() ===
                                                    (res.Name.toLowerCase()
                                                        ? res.Name.toLowerCase()
                                                        : "")
                                                    ? "active"
                                                    : ""
                                                    }`}

                                                //aria-selected={activeTab === "cardView"}
                                                role="tab"
                                                onClick={() => handleTabClick(res.Name.toLowerCase(), res.ID)}
                                            >
                                                {res.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="tab-content mt-2">
                <div className="tab-pane show active" id="home1" role="tabpanel">
                    {filteredBlogItems.length > 0 ?
                        filteredBlogItems.map(item => {
                            const AnnouncementandNewsBannerImage = item.BlogBannerImage == undefined || item.BlogBannerImage == null ? "" : JSON.parse(item.BlogBannerImage);
 
 
                            return (
                                <div className="card mb-2 annuncementcard">
                                    <div className="card-body">
                                        <div className="row align-items-start">
                                            <div className="col-sm-2">
                                                <a onClick={() => gotoBlogsDetails(item)}>   <div className="imagehright">
                                                    {/* <img className="d-flex align-self-center me-3 w-100" src={g1} alt="Generic placeholder image" /> */}
                                                    <img src={AnnouncementandNewsBannerImage?.serverUrl + AnnouncementandNewsBannerImage?.serverRelativeUrl}
                                                        className="d-flex align-self-center me-3 w-100" lt="Generic placeholder image" style={{ height: '100%' }} />
                                                </div>
                                                </a>
                                            </div>
                                            <div className="col-sm-9 padd-12">
                                                <div className="row">
                                                    <div className="col-sm-4 date-color">
                                                        <span className="font-12 date-color float-start mt-0 mb-2 ng-binding" style={{ color: '#6b6b6b', fontSize: '12px', paddingRight: '0.2rem' }}>
                                                            <Calendar size={12} color="#6b6b6b" strokeWidth={2} style={{ fontWeight: '400' }} /></span>
 
                                                        <span className="font-12 date-color float-start mt-0 mb-2 ng-binding" style={{ color: '#6b6b6b', fontSize: '12px' }}>{moment(item.Created).format("DD-MMM-YYYY HH:mm")}
                                                            {/* 12-Mar-2024 18:37 */}
                                                        </span>
                                                    </div>
                                                </div>
                                                <a > <div className="w-100">
                                                    <h4 className="mt-0 mb-1 font-16 fw-bold ng-binding" style={{ color: '#343a40', fontSize: '16px' }}> {truncateText(item.Title, 90)}
                                                    </h4>
                                                    <p style={{ color: '#6b6b6b', fontSize: '14px', height: '2.5rem' }} className="mb-2 font-14 ng-binding">
                                                        {truncateText(item.Overview, 200)}</p>
                                                    <div className="readmore" onClick={() => gotoBlogsDetails(item)} style={{ cursor: 'pointer' }}>Read more..</div>
                                                </div>
                                                </a>
                                            </div>
                                            <div className="col-sm-1">
                                                <div className="d-flex" style={{ justifyContent: 'end', marginRight:'3px', cursor: 'pointer' }}>
                                                    <div className="" style={{ position: 'relative' }}>
                                                        <div  className="" onClick={() => toggleDropdown(item.Id)} key={item.Id}>
                                                            <Share2 size={20} color="#6c757d" strokeWidth={2} style={{ fontWeight: '400' }} />
                                                        </div>
                                                        {showDropdownId === item.Id && (
                                                            <div className="dropdown-menu dropcss" isMenuOpenshareref={menuRef}>
                                                                <a className="dropdown-item dropcssItem" onClick={sendanEmail}>Share by email</a>
                                                                <a className="dropdown-item dropcssItem" onClick={() => copyToClipboard(item.Id)}>
                                                                    Copy Link
                                                                </a>
                                                                <a>{copySuccess && <span className="text-success">{copySuccess}</span>}</a>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {/* <Bookmark size={20} color="#6c757d" strokeWidth={2} style={{ fontWeight: '400' }} /> */}
                                                </div>
                                            </div>
 
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        ) : null}
 
                </div>
            </div></>
 
    )
}
 
export default CustomBlogWebpartTemplate