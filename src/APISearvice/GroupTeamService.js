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
      console.log("--------group", res);

      // Filter items based on GroupType and InviteMembers
      arr = res.filter(item => 
        // Include public groups or private groups where the current user is in the InviteMembers array
        item.GroupType === "All" || 
        (item.GroupType === "Selected Members" && item.InviteMemebers && item.InviteMemebers.some(member => member.Id === currentUser))
      );
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
    const userList = await sp.web.lists.getByTitle("User Information List").items.select("ID", "Title", "EMail", "Department", "JobTitle", "Picture","MobilePhone").filter("EMail ne null")();
    console.log(userList, 'userList');

    arr = userList
   
  } catch (error) {
    console.error("Error fetching users:", error);
  }
  return arr;
};
