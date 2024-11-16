import Swal from "sweetalert2";
export const fetchBlogdata = async (_sp) => {
  let arr = []

  await _sp.web.lists.getByTitle("ARGBlogs")
    .items.select("*,Author/ID,Author/Title").expand("Author").orderBy("Created", false).getAll().then((res) => {
      console.log(res);

      //res.filter(x=>x.Category?.Category==str)
      arr = res;
    })
    .catch((error) => {
      console.log("Error fetching data: ", error);
    });
  return arr;
}

export const fetchBookmarkBlogdata = async (_sp) => {
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
 
  await _sp.web.lists.getByTitle("ARGSavedBlogs")
    .items.select("*,BlogId/ID,BlogId/Title,BlogSavedBy/ID,BlogSavedBy/Title,BlogSavedBy/EMail").expand("BlogId,BlogSavedBy")
    .filter(`BlogSavedBy/EMail eq '${currentUser}'`)
    .orderBy("Created", false).getAll().then(async (resnew) => {
      console.log("resnew", resnew);
      if (resnew.length > 0) {
        debugger
        for (let i = 0; i < resnew.length; i++) {
          await _sp.web.lists.getByTitle("ARGBlogs")
            .items.select("*,Author/ID,Author/Title").expand("Author")
            .filter(`ID eq ${resnew[i].BlogIdId}`)
            .orderBy("Created", false).getAll().then((res) => {
              console.log("bookmarkarr", res, resnew[i].BlogIdId);
              bookmarkarr.push(res[0])
              //res.filter(x=>x.Category?.Category==str)
 
            })
            .catch((error) => {
              console.log("Error fetching data: ", error);
            });
        }
      }
    })
  console.log("bookmarkarrbookmarkarr", bookmarkarr);
  arr = bookmarkarr;
  return arr;
}
export const fetchPinstatus = async (_sp) => {
  let bookmarkarrnew = [];
  let arr = []
  const initialPinStatus = {};
  const currentUser = await _sp.web.currentUser();
  await _sp.web.lists.getByTitle("ARGBlogs")
    .items.select("*,Author/ID,Author/Title,BookmarkedBy/ID,BookmarkedBy/Title,BookmarkedBy/EMail").expand("Author,BookmarkedBy").orderBy("Created", false).getAll().then(async (res) => {
      console.log(res);
      for (let i = 0; i < res.length; i++) {
        //const initialPinStatus = {};
 
        const pinRecords = await _sp.web.lists.getByTitle("ARGSavedBlogs").items
          .select("*,BlogId/ID,BlogId/Title,BlogSavedBy/ID,BlogSavedBy/Title,BlogSavedBy/EMail")
          .expand("BlogId,BlogSavedBy")
          .filter(`BlogSavedById eq ${currentUser.Id} and BlogIdId eq ${res[i].ID}`)
          .getAll();
 
        initialPinStatus[res[i].ID] = pinRecords.length > 0;
        //bookmarkarrnew.push(initialPinStatus)
        //setPinStatus((prev) => ({ ...prev, initialPinStatus: false }));
        console.log("initialPinStatus", initialPinStatus,);
 
        //          // });
      }
   
      console.log("bookmarkarrnew", initialPinStatus);
      arr = initialPinStatus;
    })
    .catch((error) => {
      console.log("Error fetching data: ", error);
    });
  return arr;
}
export const fetchBookmarkID = async (_sp) => {
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

  await _sp.web.lists.getByTitle("ARGSavedBlogs")
    .items.select("*,BlogId/ID,BlogId/Title,BlogSavedBy/ID,BlogSavedBy/Title,BlogSavedBy/EMail").expand("BlogId,BlogSavedBy")
    .filter(`BlogSavedBy/EMail eq '${currentUser}'`)
    .orderBy("Created", false).getAll().then(async (resnew) => {
      console.log("resnew", resnew);
      arr = resnew;
    })
  console.log("resnewwwwww", arr);
  return arr;
}

export const getBlog = async (_sp) => {
  let arr = []
  let str = "Announcements"
  await _sp.web.lists.getByTitle("ARGBlogs").items.select("*,Author/ID,Author/Title").expand("Author").orderBy("Created",false).getAll()
    .then((res) => {
      console.log("--discussion", res);
 
 
      //res.filter(x=>x.Category?.Category==str)
      arr = res;
    })
    .catch((error) => {
      console.log("Error fetching data: ", error);
    });
  return arr;
}
 
export const GetCategory = async (_sp) => {
  let arr = []
  await _sp.web.lists.getByTitle("ARGDiscussionForumCategory").items.orderBy("Created",false).getAll().then((res) => {
    console.log("---category", res);
    arr = res;
  }).catch((error) => {
    console.log("Error fetching data: ", error);
  })
  return arr;
}
export const GetBlogCategory = async (_sp) => {
  let arr = []
  await _sp.web.lists.getByTitle("ARGBlogCategory").items.orderBy("Created",false).getAll().then((res) => {
    console.log("---category", res);
    arr = res;
  }).catch((error) => {
    console.log("Error fetching data: ", error);
  })
  return arr;
}
export const updateItem = async (itemData, sp, id) => {
  let resultArr = []
  try {
    const newItem = await sp.web.lists.getByTitle('ARGBlogs').items.getById(id).update(itemData);
    Swal.fire('Item update successfully', '', 'success');
    resultArr = newItem
    // Perform any necessary actions after successful addition
  } catch (error) {
    console.log('Error adding item:', error);
    Swal.fire(' Cancelled', '', 'error')
    // Handle errors appropriately
    resultArr = null
  }
  return resultArr;
};
 
export const addItem = async (itemData, _sp) => {
  debugger
  let resultArr = []
  try {
    const newItem = await _sp.web.lists.getByTitle('ARGBlogs').items.add(itemData);
    debugger
    console.log('Item added successfully:', newItem);
 
    resultArr = newItem
    // Perform any necessary actions after successful addition
  } catch (error) {
    console.log('Error adding item:', error);
    Swal.fire(' Cancelled', '', 'error')
    // Handle errors appropriately
    resultArr = null
  }
  return resultArr;
};
 
export const getBlogByID = async (_sp, id) => {
  debugger
  let arr = []
  let arrs = []
  let bannerimg = []
  await _sp.web.lists.getByTitle("ARGBlogs").items.getById(id).select("*,DiscussionForumCategory/ID,Category/Category,Entity/ID,Entity/Entity").expand("Category,Entity,DiscussionForumTypeMaster")()
    .then((res) => {
      console.log(res, ' let arrs=[]');
      // const bannerimgobject = res.AnnouncementandNewsBannerImage != "{}" && JSON.parse(res.AnnouncementandNewsBannerImage)
      // console.log(bannerimgobject[0], 'bannerimgobject');
 
      bannerimg.push(bannerimgobject);
      const parsedValues = {
        Title: res.Title != undefined ? res.Title : "",
        description: res.Description != undefined ? res.Description : "",
        //   overview: res.Overview != undefined ? res.Overview : "",
        //   IsActive: res.IsActive,
        ID: res.ID,
        // BannerImage: bannerimg,
        //   TypeMaster: res?.AnnouncementandNewsTypeMaster?.ID != undefined ? res.AnnouncementandNewsTypeMaster?.ID : "",
        DiscussionForumCategory: res.Category?.ID != undefined ? res.Category?.ID : "",
        Entity: res.Entity?.ID != undefined ? res.Entity?.ID : "",
        FeaturedAnnouncement: res.FeaturedAnnouncement,
        BlogGalleryJSON: res.BlogGalleryJSON != null ? JSON.parse(res.BlogGalleryJSON) : "",
        BlogDocsJSON: res.BlogDocsJSON != null ? JSON.parse(res.BlogDocsJSON) : "",
        BlogGalleryId: res.BlogGalleryId,
        BlogDocsId: res.BlogDocsId
        // other fields as needed
      };
 
      arr.push(parsedValues)
    })
    .catch((error) => {
      console.log("Error fetching data: ", error);
    });
  console.log(arr, 'arr');
  return arr;
}
export const getAllBlogsnonselected = async (_sp,Idnum) => {
  debugger
  let arr = []
  let str = "Announcements"
  await _sp.web.lists.getByTitle("ARGBlogs").items
  .select("*").expand("")
  .filter(`ID ne ${Idnum}`)
  .top(3)
  .orderBy("Created",true)
  .getAll()
    .then((res) => {
      let resnew= res.slice(0, 3);
      console.log("getallBlogs excluding",res,resnew);

      //res.filter(x=>x.Category?.Category==str)
      arr = resnew;
    })
    .catch((error) => {
      console.log("Error fetching data: ", error);
    });
  return arr;
}
export const getBlogDetailsById = async (_sp, idNum) => {
  let arr = []
  let arr1 = []
 
  await _sp.web.lists.getByTitle("ARGBlogs").items.getById(idNum)()
    .then((res) => {
      // arr=res;
      arr1.push(res)
      arr = arr1
    }).catch((error) => {
      console.log("Error fetching data: ", error);
    });
  return arr;
}
 
// export const uploadFile = async (file, sp, docLib, siteUrl) => {
//   var arr ={};
//   sp.web.lists.getByTitle(docLib).rootFolder.files.addChunked(file.name, file, data => {
//     console.log(`progress`, data);
//   }, true).then(async result => {
//     console.log(result, 'result')
//   })
//   //  const siteUrl=  await getUrl(sp)
//   const img = {
//     "type": "thumbnail",
//     "fileName": file.name,
//     "serverUrl": siteUrl,
//     "fieldName": "BlogBannerImage",
//     "serverRelativeUrl": '/Shared%20Documents/' + file.name
//   };
//   arr=img
//   return arr;
// };
export const uploadFileBlog = async (file, sp, docLib, siteUrl) => {
  let arr = {};
  debugger
  const uploadResult = await sp.web.lists.getByTitle(docLib).rootFolder.files.addChunked(file.name, file, data => {
    console.log(`progress`, data);
  }, true);

  const fileUrl = uploadResult.data.ServerRelativeUrl;

  const imgMetadata = {
    "__metadata": { "type": "SP.FieldUrlValue" },
    "Description": file.name,
    "Url": `${siteUrl}${fileUrl}`
  };

  // await sp.web.lists.getByTitle(docLib).items.getById(uploadResult.data.UniqueId).update({
  //   "AnnouncementandNewsBannerImage": imgMetadata
  // });
  arr = {
    "type": "thumbnail",
    "fileName": file.name,
    "serverUrl": siteUrl,
    "fieldName": "BlogBannerImage",
    "serverRelativeUrl": fileUrl
  };
  return arr;
};
export const fetchBlogdatatop = async (_sp) => {
  let arr = []
 
  await _sp.web.lists.getByTitle("ARGBlogs").items.select("*,Author/ID,Author/Title,BlogCategory/Id,BlogCategory/CategoryName").expand("Author,BlogCategory").top(4)().then((res) => {
    console.log(res);
 
    //res.filter(x=>x.Category?.Category==str)
    arr = res;
  })
    .catch((error) => {
      console.log("Error fetching data: ", error);
    });
  return arr;
}
export const uploadFileBanner = async (file, sp, docLib, siteUrl) => {
  let arr = {};
debugger
  const uploadResult = await sp.web.lists.getByTitle(docLib).rootFolder.files.addChunked(file.name, file, data => {
    console.log(`progress`, data);
  }, true);
 
  const fileUrl = uploadResult.data.ServerRelativeUrl;
 
  const imgMetadata = {
    "__metadata": { "type": "SP.FieldUrlValue" },
    "Description": file.name,
    "Url": `${siteUrl}${fileUrl}`
  };
 
  // await sp.web.lists.getByTitle(docLib).items.getById(uploadResult.data.UniqueId).update({
  //   "AnnouncementandNewsBannerImage": imgMetadata
  // });
  arr = {
    "type": "thumbnail",
    "fileName": file.name,
    "serverUrl": siteUrl,
    "fieldName": "BlogBannerImage",
    "serverRelativeUrl": fileUrl
  };
  return arr;
};

export const getProjectDetailsById = async (_sp, idNum) => {
  let arr = []
  let arr1 = []
 
  await _sp.web.lists.getByTitle("ARGProject").items.getById(idNum).select("*, ProjectStatus , TeamMembers/Id,TeamMembers/EMail,TeamMembers/Title, Author/ID,Author/Title,Author/EMail").expand("TeamMembers ,Author")()
  
    .then((res) => {
      console.log("check the data for project id--->>",res)
      // arr=res;
      arr1.push(res)
      arr = arr1
    }).catch((error) => {
      console.log("Error fetching data: ", error);
    });
  return arr;
}