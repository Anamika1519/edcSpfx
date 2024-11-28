import React from "react";
import { getSP } from "../loc/pnpjsConfig";
import moment from 'moment';
import { SPFI } from "@pnp/sp";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../CustomCss/mainCustom.scss";
import "../../verticalSideBar/components/VerticalSidebar.scss";
import VerticalSideBar from "../../verticalSideBar/components/VerticalSideBar";
import UserContext from "../../../GlobalContext/context";
import Provider from "../../../GlobalContext/provider";
import { useMediaQuery } from "react-responsive";
import context from "../../../GlobalContext/context";
import CustomCarousel from "../../../CustomJSComponents/carousel/CustomCarousel";
import "../../../Assets/Figtree/Figtree-VariableFont_wght.ttf";
import FeatherIcon from "feather-icons-react";
import { decryptId } from "../../../APISearvice/CryptoService";
import "./Mediagallerydetails.scss"
import {
  fetchMediaGallerydata,
  fetchMediaGalleryInsideData,
} from "../../../APISearvice/MediaDetailsServies";
import HorizontalNavbar from "../../horizontalNavBar/components/HorizontalNavBar";
import Modal from 'react-bootstrap/Modal';
import Carousel from 'react-bootstrap/Carousel';
import CustomBreadcrumb from "../../../CustomJSComponents/CustomBreadcrumb/CustomBreadcrumb";
import { IMediagallerydetailsProps } from "./IMediagallerydetailsProps";

const HelloWorldContext = ({props}:any) => {
  const sp: SPFI = getSP();
  const { useHide }: any = React.useContext(UserContext);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const { setHide }: any = context;
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [mediaData, setMediaData] = React.useState<any[]>([]);
  const [title, setTitle] = React.useState(''); // For the title
  const [category, setCategory] = React.useState(''); // For category
  const [createdDate, setCreatedDate] = React.useState(''); // For date
  const [showModal, setShowModal] = React.useState(false); // Modal state
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0); // Current image for carousel
  
  React.useEffect(() => {
    console.log("This function is called only once", useHide);

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
        toggle.addEventListener("click", () => {
          nav.classList.toggle("show");
          toggle.classList.toggle("bx-x");
          bodypd.classList.toggle("body-pd");
          headerpd.classList.toggle("body-pd");
        });
      }
    };

    showNavbar("header-toggle", "nav-bar", "body-pd", "header");

    const linkColor = document.querySelectorAll(".nav_link");

    function colorLink(this: HTMLElement) {
      if (linkColor) {
        linkColor.forEach((l) => l.classList.remove("active"));
        this.classList.add("active");
      }
    }

    linkColor.forEach((l) => l.addEventListener("click", colorLink));
  }, [useHide]);

  React.useEffect(() => {
    // if (sessionStorage.getItem("mediaId") != undefined) {
    //   const iD = sessionStorage.getItem("mediaId");
    //   let iDs = decryptId(iD);
    //   callAPI();
    // }
    callAPI();
  }, [props]);

  const callAPI = async () => {
    const ids = window.location.search;
    const originalString = ids;
    const idNum = originalString.substring(1);
    console.log("idddd", idNum, originalString, ids);
    debugger
    const getMediaGalleryData = await fetchMediaGalleryInsideData(sp, Number(idNum));

    setMediaData(getMediaGalleryData);
  
    const catdata = await fetchMediaGallerydata(sp);
    const selectedData = catdata.find(item => item.ID === Number(idNum));
    if (selectedData) {
      setTitle(selectedData.Title);
      console.log(selectedData.MediaGalleryCategory?.CategoryName);
      
      setCategory(selectedData.MediaGalleryCategory?.CategoryName || '');
      setCreatedDate(new Date(selectedData.Created).toLocaleDateString());
    }
  };

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setShowModal(true);
  };
  const siteUrl = props.siteUrl;
  const Breadcrumb = [
    {
      "MainComponent": "Home",
      "MainComponentURl": `${siteUrl}/SitePages/Dashboard.aspx`
    },
    {
      "ChildComponent": "Media Gallery",
      "ChildComponentURl": `${siteUrl}/SitePages/Mediadetails.aspx`
    }
  ]
  return (
    <div id="wrapper">
      <div className="app-menu pt-4">
        <VerticalSideBar _context={sp} />
      </div>
      <div className="content-page">
          <HorizontalNavbar  _context={sp} siteUrl={siteUrl}/>
        <div className="content mt-0" style={{marginLeft: `${!useHide ? '240px' : '80px'}`,marginTop:'1.8rem'}}>
          <div className="container-fluid paddb">
            <div className="row" >
            <div className="col-lg-3">
                  <CustomBreadcrumb Breadcrumb={Breadcrumb} />
                </div>
            </div>
            <div className="row mt-2">
              <div className="col-lg-12">
                <h4 className="page-title fw-700 mb-1  pe-5 font-28" style={{color:"black"}}>{title}</h4>
                <p className="font-14"> <span className="pe-2 text-nowrap mb-0 d-inline-block">{moment(createdDate).format("DD-MMM-YYYY")}</span> | <span className="text-nowrap mb-0 d-inline-block" style={{fontWeight: '600',
    color: '#009157'}}>{category}</span></p>
              </div>
            </div>

            <div className="row filterable-content internalmedia mt-1 mb-1">
               { mediaData!=null&& mediaData.length>0&&mediaData.map((item: any, index: number) => (
                <div className="col-sm-6 col-xl-3 filter-item all web illustrator" key={index}>
                  <div className="gal-box mb-3" onClick={() => handleImageClick(index)}>
                    <a  className="image-popup">
                      <img
                        src={item?.fileUrl ? item?.fileUrl : require("../../../Assets/ExtraImage/NoDataFound.png")}
                        alt="media"
                        style={{ maxWidth: "100%", height: "100%",width: "100%", borderRadius:"13px", objectFit:"cover"}}   
                      />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Image Carousel */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered className="mediagallery">

     
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          <Carousel activeIndex={currentImageIndex} onSelect={(selectedIndex) => setCurrentImageIndex(selectedIndex)}>
            {mediaData!=null&& mediaData.length>0&&mediaData.map((item: any, index: number) => (
              <Carousel.Item key={index}>
                <img
                  className="d-block w-100"
                  src={item?.fileUrl ? item?.fileUrl : require("../../../Assets/ExtraImage/NoDataFound.png")}
                  alt={`Slide ${index}`}
                  style={{ height: 'auto', objectFit: 'contain' }}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </Modal.Body>
       
      </Modal>
    </div>
  );
};


const Mediagallerydetails : React.FC<IMediagallerydetailsProps> = (props) => (
  
  <Provider>
    <HelloWorldContext props={props}/>
  </Provider>

)

export default Mediagallerydetails;
