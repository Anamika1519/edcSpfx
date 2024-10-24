import React from 'react'
import "./Leaderboard.scss"
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Bootstrap JS + Popper.js

const Leaderboard = () => {
  const leaderboard = [
    { position: 1, name: "Atul Sharma", department: "IT Department", imgSrc: "assets/images/users/user-2.jpg", points: "10k" },
    { position: 2, name: "Rohit Sharma", department: "IT Department", imgSrc: "assets/images/users/user-3.jpg", points: "10k" },
    { position: 3, name: "Nitin Gupta", department: "IT Department", imgSrc: "assets/images/users/user-4.jpg", points: "10k" },
  ];

  return (
    
    <div className="col-xl-7 col-lg-7">
      <div className="card">
        <div className="card-body pb-0 gheight">
          <h4 className="header-title font-16 text-dark fw-bold mb-0">
            Leaderboard
            <a style={{ float: "right" }} className="font-11 fw-normal btn btn-primary rounded-pill waves-effect waves-light" href="#">
              View All
            </a>
          </h4>
          <div className="row mt-2">
            {leaderboard.map((user, index) => (
              <div key={index} className="d-flex border-bottom heit8 align-items-start w-100 justify-content-between pe-0 mb-1 border-radius">
                <div className="col-sm-1">
                  <div className="product-price-tag positiont text-primary rounded-circle newc" title="Position">{user.position < 10 ? `0${user.position}` : user.position}</div>
                </div>
                <div className="col-sm-1 ps-2">
                  <img className="rounded-circle" src={require('../../../Assets/ExtraImage/userimg.png')} width="50" alt={user.name} />
                </div>
                <div className="col-sm-3">
                  <div className="w-100 ps-3 pt-0">
                    <h5 style={{ marginTop: "10px" }} className="inbox-item-text fw-bold font-14 mb-0 text-dark">{user.name}</h5>
                    <span style={{ color: "#6b6b6b" }} className="font-12">{user.department}</span>
                  </div>
                </div>
                <div className="col-sm-4">
                  <a style={{ marginTop: "3px" }} href="javascript:void(0);" className="btn btn-sm btn-link text-muted ps-0 pe-0">
                    <img src="assets/images/noun-achievement-6772537.png" title="Badges" alt="badge" className="me-0" />
                    <img src="assets/images/noun-achievement-6772537.png" title="Badges" alt="badge" className="me-0" />
                    <img src="assets/images/noun-achievement-6772537.png" title="Badges" alt="badge" className="me-0" />
                  </a>
                </div>
                <div className="col-sm-2">
                  <span style={{ padding: "5px", borderRadius: "4px", background: "#cce7dc", fontWeight: "600", color: "#008751" }} className="posnew font-12 float-end mt-2">
                    Points Earned {user.points}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard