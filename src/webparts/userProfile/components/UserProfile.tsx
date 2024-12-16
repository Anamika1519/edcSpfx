import React, { useEffect, useState } from "react";
import CustomBreadcrumb from "../../../CustomJSComponents/CustomBreadcrumb/CustomBreadcrumb";
import VerticalSideBar from "../../verticalSideBar/components/VerticalSideBar";
import HorizontalNavbar from "../../horizontalNavBar/components/HorizontalNavBar";
import { SPFI } from "@pnp/sp/presets/all";
import { IAddannouncementProps } from "../../addannouncement/components/IAddannouncementProps";
import Provider from "../../../GlobalContext/provider";
import UserContext from "../../../GlobalContext/context";
import { getSP } from "../loc/pnpjsConfig";
 
interface IUserProfile {
  profileImage: string;
  name: string;
  username: string;
  about: string;
  fullName: string;
  mobile: string;
  email: string;
  location: string;
  education: string;
  certification: string;
  skills: string[];
  socialLinks: { url: string; color: string; icon: string }[];
}
 
 
const UserProfileContext = ({ props }: any) => {
  const sp: SPFI = getSP();
  const elementRef = React.useRef<HTMLDivElement>(null);
  const { useHide }: any = React.useContext(UserContext);
  const siteUrl = props.siteUrl;
 
  const [userData, setUserData] = useState(null);
 
  console.log("check the data of userdata--->>>>>>", userData);
 
  const currentStatus = JSON.parse(sessionStorage.getItem("currentStatus"));
 
  useEffect(() => {
    isUserfollow();
  }, [sp]);
 
  const isUserfollow =  ()=>{
 
    const ids = window.location.search;
    const originalString = ids;
    const idNum = originalString.substring(1);
    (Number(idNum))
 
 
    const selectedUserID = idNum;
    if (selectedUserID) {
      const userID = parseInt(selectedUserID, 10);
 
      sp.web.lists
        .getByTitle("User Information List")
        .items.getById(userID)
        .select(
          "ID",
          "Title",
          "EMail",
          "Department",
          "JobTitle",
          "MobilePhone",
          "Picture"
        )()
        .then((data) => {
          // Map the data to your required structure
          setUserData({
            profileImage: data.Picture,
            name: data.Title,
            username: data.JobTitle,
            about: data.Department, // For example, use Department as "About"
            fullName: data.Title,
            mobile: data.MobilePhone,
            email: data.EMail,
            // location: data.Location,
            // education: data.Education,
            // certification: data.Certification,
            // skills: data.Skills.split(','),
            // socialLinks: JSON.parse(data.SocialLinks || '[]')
          });
        })
        .catch(console.error);
    }
    sp.web.lists.getByTitle("").items.filter(`FollowedUserID eq ${selectedUserID}`).getAll()
  }
 
  if (!userData) {
    return <div>Loading...</div>;
  }
  // const currentStatus=()=>{
  //   return
  // }
 
  const Breadcrumb = [
    {
      MainComponent: "Home",
      MainComponentURl: `${siteUrl}/SitePages/Dashboard.aspx`,
    },
    {
      ChildComponent: "Corporate Directory",
      ChildComponentURl: `${siteUrl}/SitePages/CorporateDirectory.aspx`,
    },
  ];
 
  return (
    <div>
      <div>
        <div id="wrapper" ref={elementRef}>
          <div className="app-menu" id="myHeader">
            <VerticalSideBar _context={sp} />
          </div>
          <div className="content-page">
            <HorizontalNavbar _context={sp} siteUrl={siteUrl} />
            <div
              className="content"
              style={{
                marginLeft: `${!useHide ? "240px" : "80px"}`,
                marginTop: "0rem",
              }}
            >
              <div className="container-fluid  paddb">
                <div className="row">
                  <div className="col-lg-5">
                    <CustomBreadcrumb Breadcrumb={Breadcrumb} />
                  </div>
                </div>
                <div className="row pt-2">
                  <div>
                    {userData ? (
                      // console.log("check the data of userdata--->>>>>>",userData)
                      <div className="col-lg-4 mt-3 col-xl-4">
                        <div className="card text-center">
                          <div className="card-body">
                            <img
                              src={
                                userData.profileImage != null
                                  ? `${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${userData.email}`
                                  : require("../assets/users.jpg")
                              }
                              // className="rounded-circlecss"
                              alt="profile-image"
                              style={{ cursor: "pointer", borderRadius: "50%" }}
                            />
                            <h4 className="mb-0 fw-bold font-16 text-dark">
                              {userData.username}
                            </h4>
                            <p className="text-muted font-14">
                              @{userData.about}
                            </p>
 
                            <button
                              style={{
                                backgroundColor: "#198754",
                                marginRight: "3px", color:'#fff'
                              }}
                              type="button"
                              className=" waves-effect waves-light font-14"
                            >
                              {/* <i className="fe-user"></i> Follow */}
                              {currentStatus ? "Unfollow" : "Follow"}
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger font-14 waves-effect waves-light"
                            >
                              <i className="fe-send"></i> Message
                            </button>
 
                            <div className="text-start mt-3">
                              <h4 className="font-13 text-uppercase">
                                About Me :
                              </h4>
                              <p className="text-muted font-13 mb-3">
                                {userData.about}
                              </p>
                              <p className="text-muted mb-2 font-13">
                                <strong>Full Name :</strong>{" "}
                                <span className="ms-2">
                                  {userData.fullName}
                                </span>
                              </p>
                              <p className="text-muted mb-2 font-13">
                                <strong>Mobile :</strong>
                                <span className="ms-2">{userData.mobile}</span>
                              </p>
                              <p className="text-muted mb-2 font-13">
                                <strong>Email :</strong>{" "}
                                <span className="ms-2">{userData.email}</span>
                              </p>
                              <p className="text-muted mb-2 font-13">
                                <strong>Location :</strong>{" "}
                                <span className="ms-2">
                                  {userData.location}
                                </span>
                              </p>
                              <p className="text-muted mb-2 font-13">
                                <strong>Education :</strong>{" "}
                                <span className="ms-2">
                                  {userData.education}
                                </span>
                              </p>
                              <p className="text-muted mb-2 font-13">
                                <strong>Certification :</strong>{" "}
                                <span className="ms-2">
                                  {userData.certification}
                                </span>
                              </p>
                              {/* <p className="text-muted mb-1 font-13"><strong>Skills :</strong> <span className="ms-2">{userData.skills.join(', ')}</span></p> */}
                            </div>
 
                            {/* <ul className="social-list list-inline mt-3 mb-0">
                            {userData.socialLinks.map((link: { url: string; color: any; icon: any; }, index: React.Key) => (
                              <li key={index} className="list-inline-item">
                                <a href={link.url} className={`social-list-item border-${link.color} text-${link.color}`}>
                                  <i className={`mdi mdi-${link.icon}`}></i>
                                </a>
                              </li>
                            ))}
                          </ul> */}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p>No user data available.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const UserProfile: React.FC<IAddannouncementProps> = (props) => {
  return (
    <Provider>
      <UserProfileContext props={props} />
    </Provider>
  );
};
export default UserProfile;