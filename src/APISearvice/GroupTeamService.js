import Swal from "sweetalert2";

// export const getGroupTeam = async (_sp) => {
//   let arr = [];
//   let str = "Announcements";
//   await _sp.web.lists
//     .getByTitle("ARGGroupandTeam")
//     .items.select("*,Author/Title,Author/ID,GroupName,GroupType,InviteMemebers/Id") // Include GroupName and GroupType
//     .expand("Author,InviteMemebers").orderBy("Created",false)
//     .getAll()
//     .then((res) => {
//       console.log("--------group", res);

//       //res.filter(x=>x.Category?.Category==str)
//       arr = res;
//     })
//     .catch((error) => {
//       console.error("Error fetching data: ", error);
//     });
//   return arr;
// };
export const fetchNotFollowedGroupdata = async (_sp) => {
  let arr = []
  let bookmarkarr = [];
  let currentUser;
  await _sp.web.currentUser()
    .then(user => {
      console.log("user", user);
      currentUser = user.Email; // Get the current user's Email
    })
    .catch(error => {
      console.error("Error fetching current user: ", error);
      return [];
    });

  await _sp.web.lists.getByTitle("ARGGroupandTeamFollow")
    .items.select("*,GroupID/ID,GroupID/Title,FollowedBy/ID,FollowedBy/Title,FollowedBy/EMail").expand("GroupID,FollowedBy")
    .filter(`FollowedBy/EMail eq '${currentUser}'`)
    .orderBy("Created", false).getAll().then(async (resnew) => {
      console.log("resnew", resnew);
      if (resnew.length > 0) {
        
        let filterquery = [];
        for (let i = 0; i < resnew.length; i++) {
          filterquery.push(`ID ne ${resnew[i].GroupIDId}`)
        }
        let finalquery = filterquery.map((x) => x).join(' and ');
        console.log("finalqueryfinalquery", finalquery);
        await _sp.web.lists
          .getByTitle("ARGGroupandTeam")
          .items.select("*,Author/Title,Author/ID,GroupName,GroupType,InviteMemebers/Id")
          .filter(`${finalquery}`)
          .expand("Author,InviteMemebers")
          .orderBy("Created", false)
          .getAll()
          .then((res) => {
            console.log("notfolloweddata ALL", res);
            arr = res
            // Filter items based on GroupType and InviteMembers
            // arr = res.filter(item =>
            // // Include public groups or private groups where the current user is in the InviteMembers array
            // //item.ID != 5 && item.ID != 18
            // // &&
            // (item.GroupType === "All" ||
            //   (item.GroupType === "Selected Members" && item.InviteMemebers && item.InviteMemebers.some(member => member.Id === currentUser)))

            // );

            //bookmarkarr = arr
          })
          .catch((error) => {
            console.log("Error fetching data: ", error);
          });

      }
    })
  console.log("bookmarkarrbookmarkarr", arr);
  //arr = bookmarkarr;
  return arr;
}
export const additemtoFollowedGroup = async (_sp, itemData) => {
  console.log("_sp-->>>>", _sp);
  // console.log("itemData-->>>>", itemData)
  let resultArr = [];
  try {
    const newItem = await _sp.web.lists
      .getByTitle("ARGGroupandTeamFollow")
      .items.add(itemData);
    console.log("Item added successfully:", newItem);
    resultArr = newItem;
  } catch (error) {
    console.error("Error adding item--->>>>>", error);
    Swal.fire(" Cancelled", "", "error");
    resultArr = null;
  }
  return resultArr;
};
// export const getGroupTeam = async (_sp) => {
//   let arr = [];
//   let currentUser;

//   // Fetch the current user
//   await _sp.web.currentUser()
//     .then(user => {
//       currentUser = user.Id; // Get the current user's ID
//     })
//     .catch(error => {
//       console.error("Error fetching current user: ", error);
//       return [];
//     });

//   if (!currentUser) return arr; // Return empty array if user fetch failed

//   await _sp.web.lists
//     .getByTitle("ARGGroupandTeam")
//     .items.select("*,Author/Title,Author/ID,GroupName,GroupType,InviteMemebers/Id")
//     .expand("Author,InviteMemebers")
//     .orderBy("Created", false)
//     .getAll()
//     .then((res) => {
//       console.log("--------group", res);
//       // Add logic to truncate GroupName if its length is more than 50 characters
//       arr = res.map(item => ({
//         ...item,
//         TruncatedGroupName: item.GroupName.length > 50 
//           ? `${item.GroupName.slice(0, 50)}...` 
//           : item.GroupName,
//       }));
//     })
//     .catch((error) => {
//       console.error("Error fetching data: ", error);
//     });

//   return arr;
// };

export const getGroupTeam = async (_sp) => {
  let arr = [];
  let currentUser;

  // Fetch the current user
  await _sp.web.currentUser()
    .then(user => {
      currentUser = user.Id; // Get the current user's ID
    })
    .catch(error => {
      console.error("Error fetching current user: ", error);
      return [];
    });

  if (!currentUser) return arr; // Return empty array if user fetch failed

  await _sp.web.lists
    .getByTitle("ARGGroupandTeam")
    .items.select("*,Author/Title,Author/ID,GroupName,GroupType,InviteMemebers/Id")
    .expand("Author,InviteMemebers")
    .orderBy("Created", false)
    .getAll()
    .then((res) => {
      // alert("res", JSON.parse(JSON.stringify(res)))
      debugger
      console.log("--------group", res);

    // Add logic to filter based on GroupType and check if current user is in InviteMemebers
    arr = res
    .filter(item => {
      console.log("item.GroupType", item.GroupType)
      if (item.GroupType === "Selected Members") {
        alert(item.GroupType)
        // Check if current user is in InviteMemebers
        return item?.InviteMemebers?.some(invitee => invitee.Id === currentUser || item.Author.ID === currentUser);
      }
      return true; // Include other groups
    })
    .map(item => ({
      ...item,
      TruncatedGroupName: item.GroupName.length > 50 
        ? `${item.GroupName.slice(0, 50)}...` 
        : item.GroupName,
    }));
})
.catch((error) => {
  console.error("Error fetching data: ", error);
});


  return arr;
};

export const updateItem = async (itemData, _sp, id) => {
  let resultArr = [];
  debugger
  try {
    const newItem = await _sp.web.lists
      .getByTitle("ARGGroupandTeam")
      .items.getById(id)
      .update(itemData);
    Swal.fire("Item update successfully", "", "success");
    resultArr = newItem;
    console.log("itemData------>>>>", itemData)
    // Perform any necessary actions after successful addition
  } catch (error) {
    console.error("Error adding item:", error);
    Swal.fire(" Cancelled", "", "error");
    // Handle errors appropriately
    resultArr = null;
  }
  return resultArr;
};
export const addItem = async (_sp, itemData) => {
  console.log("_sp-->>>>", _sp);
  // console.log("itemData-->>>>", itemData)
  let resultArr = [];
  try {
    const newItem = await _sp.web.lists
      .getByTitle("ARGGroupandTeam")
      .items.add(itemData);
    // const newItem= await _sp.web.lists
    //   .getByTitle("ARGGroupandTeam").items.getAll()
    //   console.log("newItem-->>>",newItem)
    console.log("Item added successfully:", newItem);

    resultArr = newItem;
    // Perform any necessary actions after successful addition
  } catch (error) {
    console.error("Error adding item--->>>>>", error);
    Swal.fire(" Cancelled", "", "error");
    // Handle errors appropriately
    resultArr = null;
  }
  return resultArr;
};
export const updateGroupFollowItem = async (itemData, _sp, id) => {
  let resultArr = [];
  debugger
  try {
    const newItem = await _sp.web.lists
      .getByTitle("ARGGroupandTeam")
      .items.getById(id)
      .update(itemData);
    Swal.fire("Congratulations! You are IN: Join the conversation with Group Members", "", "success");
    //window.location.reload();
    resultArr = newItem;
    console.log("itemData------>>>>", itemData)
    // Perform any necessary actions after successful addition
  } catch (error) {
    console.error("Error adding item:", error);
    Swal.fire(" Cancelled", "", "error");
    // Handle errors appropriately
    resultArr = null;
  }
  return resultArr;
};

export const updateGroupUnFollowItem = async (itemData, _sp, id) => {
  let resultArr = [];
  debugger
  try {
    const newItem = await _sp.web.lists
      .getByTitle("ARGGroupandTeam")
      .items.getById(id)
      .update(itemData);
    Swal.fire("You are no longer able to post anything on this group", "", "success");
    //window.location.reload();
    resultArr = newItem;
    console.log("itemData------>>>>", itemData)
    // Perform any necessary actions after successful addition
  } catch (error) {
    console.error("Error adding item:", error);
    Swal.fire(" Cancelled", "", "error");
    // Handle errors appropriately
    resultArr = null;
  }
  return resultArr;
};

export const getGroupTeamByID = async (_sp, id) => {
  debugger;
  let arr = [];
  let arrs = [];
  let bannerimg = [];
  await _sp.web.lists
    .getByTitle("ARGGroupandTeam")
    .items.getById(id)
    .select("*,Entity/ID,Entity/Entity")
    .expand("Entity,GroupType")()
    .then((res) => {
      console.log(res, " let arrs=[]");
      const bannerimgobject =
        res.AnnouncementandNewsBannerImage != "{}" &&
        JSON.parse(res.AnnouncementandNewsBannerImage);
      console.log(bannerimgobject[0], "bannerimgobject");

      bannerimg.push(bannerimgobject);
      const parsedValues = {
        GroupName: res.GroupName != undefined ? res.Title : "",
        GroupDescription:
          res.GroupDescription != undefined ? res.GroupDescription : "",
        overview: res.Overview != undefined ? res.Overview : "",
        IsActive: res.IsActive,
        ID: res.ID,
        BannerImage: bannerimg,
        TypeMaster: res?.GroupType?.ID != undefined ? res.GroupType?.ID : "",
        // Category: res.Category?.ID != undefined ? res.Category?.ID : "",
        Entity: res.Entity?.ID != undefined ? res.Entity?.ID : "",
        // FeaturedAnnouncement: res.FeaturedAnnouncement,
        GroupTeamGalleryJSON:
          res.GroupTeamGalleryJSON != null
            ? JSON.parse(res.GroupTeamGalleryJSON)
            : "",
        GroupTeamsDocsJSON:
          res.GroupTeamsDocsJSON != null
            ? JSON.parse(res.GroupTeamsDocsJSON)
            : "",
        GroupTeamGalleryId: res.GroupTeamGalleryId,
        GroupTeamsDocsId: res.GroupTeamsDocsId,
        // other fields as needed
      };

      arr.push(parsedValues);
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
    });
  console.log(arr, "arr");
  return arr;
};

export const getGroupTeamDetailsById = async (_sp, idNum) => {
  let arr = [];
  let arr1 = [];
  await _sp.web.lists
    .getByTitle("ARGGroupandTeam")
    .items.getById(idNum).select("*,InviteMemebers/Id,InviteMemebers/Title,InviteMemebers/EMail,GroupType").expand("InviteMemebers")()
    .then((res) => {
      // arr=res;
      console.log("res------",res)
      arr1.push(res);
      arr = arr1;
    })
    .catch((error) => {
      console.log("Error fetching data: ", error);
    });
  return arr;
};

export const getType = async (_sp) => {
  let arr = [];
  await _sp.web.lists
    .getByTitle("ARGGroupandTeam")
    .items.select("ID,TypeMaster")()
    .then((res) => {
      console.log(res);
      const newArray = res.map(({ ID, TypeMaster }) => ({
        id: ID,
        name: TypeMaster,
      }));
      console.log("newArray---->>>", newArray);

      arr = newArray;
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
    });
  return arr;
};


export const fetchUserInformationList = async (sp) => {
  let arr =[]
  try {
    let currentUser;

    // Fetch the current user
    await sp.web.currentUser()
      .then(user => {
        currentUser = user.Id; // Get the current user's ID
      })
      .catch(error => {
        console.error("Error fetching current user: ", error);
        return [];
      });
    const userList = await sp.web.lists.getByTitle("User Information List").items.select("ID", "Title", "EMail", "Department", "JobTitle", "Picture","MobilePhone").filter(`EMail ne null and ID ne ${currentUser}`)();
    console.log(userList, 'userList');

    arr = userList
   
  } catch (error) {
    console.error("Error fetching users:", error);
  }
  return arr;
};
