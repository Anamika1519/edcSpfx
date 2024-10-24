import Swal from "sweetalert2";
 
export const fetchBlogdata = async (_sp) => {
  let arr = []
 
  await _sp.web.lists.getByTitle("ARGBlogs").items.select("*,Author/ID,Author/Title").expand("Author").getAll().then((res) => {
    console.log(res);
 
    //res.filter(x=>x.Category?.Category==str)
    arr = res;
  })
    .catch((error) => {
      console.log("Error fetching data: ", error);
    });
  return arr;
}
export const getBlog = async (_sp) => {
  let arr = []
  let str = "Announcements"
  await _sp.web.lists.getByTitle("ARGBlogs").items.select("*,Author/ID,Author/Title").expand("Author").getAll()
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
  await _sp.web.lists.getByTitle("ARGDiscussionForumCategory").items.getAll().then((res) => {
    console.log("---category", res);
    arr = res;
  }).catch((error) => {
    console.log("Error fetching data: ", error);
  })
  return arr;
}
export const GetBlogCategory = async (_sp) => {
  let arr = []
  await _sp.web.lists.getByTitle("ARGBlogCategory").items.getAll().then((res) => {
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
 
  await _sp.web.lists.getByTitle("ARGBlogs").items.select("*,Author/ID,Author/Title,BlogCategory/Id,BlogCategory/categoryName").expand("Author,BlogCategory").top(4)().then((res) => {
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