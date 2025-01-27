import Swal from 'sweetalert2';
export const getAllEventMaster = async (_sp,isSuperAdmin) => {
  let arr = []
  let str = "Announcements"
  const currentUser = await _sp.web.currentUser(); 
  if(isSuperAdmin == "yes"){
  await _sp.web.lists.getByTitle("ARGEventMaster").items.select("*,Entity/ID,Entity/Entity").expand("Entity").orderBy("Created",false).getAll()
    .then((res) => {
      console.log(res);

      //res.filter(x=>x.Category?.Category==str)
      arr = res;
    })
    .catch((error) => {
      console.log("Error fetching data: ", error);
    });
  }else{
    await _sp.web.lists.getByTitle("ARGEventMaster").items
    .select("*,Entity/ID,Entity/Entity,Author/ID").expand("Entity,Author")
    .filter(`AuthorId eq '${currentUser.Id}'`)
    .orderBy("Created",false).getAll()
    .then((res) => {
      console.log(res);

      //res.filter(x=>x.Category?.Category==str)
      arr = res;
    })
    .catch((error) => {
      console.log("Error fetching data: ", error);
    });
  }
  return arr;
}
export const getAllEventMasternonselected = async (_sp,Idnum) => {
  debugger
  let arr = []
  let str = "Announcements"
  await _sp.web.lists.getByTitle("ARGEventMaster").items.select("*,Entity/ID,Entity/Entity").expand("Entity").filter(`ID ne ${Idnum}`)
  .top(3).orderBy("EventDate",true).getAll()
    .then((res) => {
      

      let resnew= res.slice(0, 3);
      console.log("getAllEventMasternonselected",res, resnew);
      //res.filter(x=>x.Category?.Category==str)
      arr = resnew;
    })
    .catch((error) => {
      console.log("Error fetching data: ", error);
    });
  return arr;
}
// export const uploadFileToLibrary = async (file, sp, docLib) => {
//   debugger
//   let arrFIleData = [];
//   let fileSize=0
//   try {
//     const result = await sp.web.lists.getByTitle(docLib).rootFolder.files.addChunked(file.name, file,

//       // const result = await sp.web.lists.getByTitle(docLib).rootFolder.files.addChunked(
//       // file.name,
//       // file,
//       (progress, data) => {
//         console.log(progress, data);
//         fileSize=progress.fileSize
//       },
//       true
//     );
// debugger
//     const item = await sp.web.getFileByServerRelativePath(result.data.ServerRelativeUrl).getItem("*","ID", "AuthorId", "Modified")
//     console.log(item.Id, 'itemitem');
//     let arr = {
//       ID: item.Id,
//       Createdby: item.AuthorId,
//       Modified: item.Modified,
//       fileUrl: result.data.ServerRelativeUrl,
//       fileSize:fileSize,
//       fileType:file.type,
//       fileName:file.name,
//     }
//     arrFIleData.push(arr)
//     console.log(arrFIleData);

//     return arrFIleData;
//   } catch (error) {
//     console.log("Error uploading file:", error);
//     return null; // Or handle error differently
//   }
// };

export const uploadFileToLibrary = async (file, sp, docLib) => {
  let arrFIleData = [];
  let fileSize = 0;

  try {
    // Upload the file using addChunked
    const result = await sp.web.lists.getByTitle(docLib).rootFolder.files.addChunked(
      file.name,
      file,
      (progress, data) => {
        console.log(progress, data);
        fileSize = progress.fileSize;
      },
      true // overwrite existing file if it exists
    );

    // Fetch the file using getFileByServerRelativeUrl (instead of getFileByServerRelativePath)
    const fileItem = await sp.web.getFileByServerRelativeUrl(result.data.ServerRelativeUrl).getItem("ID", "AuthorId", "Modified");
    console.log(fileItem, 'fileItem');

    let fileData = {
      ID: fileItem.Id,
      Createdby: fileItem.AuthorId,
      Modified: fileItem.Modified,
      fileUrl: result.data.ServerRelativeUrl,
      fileSize: fileSize,
      fileType: file.type,
      fileName: file.name,
    };

    arrFIleData.push(fileData);
    console.log(arrFIleData);

    return arrFIleData;

  } catch (error) {
    console.log("Error uploading file:", error);
    return null; // Handle error
  }
};


export const uploadFile = async (file, sp, docLib, siteUrl) => {
  let arr = {};
  
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
    "fieldName": "AnnouncementandNewsBannerImage",
    "serverRelativeUrl": fileUrl
  };
  return arr;
};

export const getUrl = async (sp, siteUrl) => {
  let srt = siteUrl;
  let dynamicPart = "/sites/";
  let UrlArr = [];
  try {
    let index = srt.lastIndexOf(dynamicPart); // Find the last occurrence of "/sites/"

    if (index !== -1) {
      let endIndex = srt.indexOf("/", index + dynamicPart.length) !== -1
        ? srt.indexOf("/", index + dynamicPart.length)
        : srt.length;

      let updatedStr = srt.slice(0, index) + srt.slice(endIndex);
      console.log(updatedStr, 'updatedStr');
      const url = await sp.web.currentUser.getContextInfo();
      console.log(url, 'res');

      let UrlArr1 =
      {
        DomainUrl: updatedStr,
        WebFullUrl: url.WebFullUrl

      }
      UrlArr.push(UrlArr1)
    } else {
      console.log("Pattern not found. No replacement was made.");
    }
  } catch (error) {
    console.log("An error occurred:", error.message);
  }

  return UrlArr
}
const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (file) {
    try {
      const folderUrl = `/sites/edcspfx/${docLib}`; // Replace with your folder URL
      const fileName = file.name;

      const fileBlob = new Blob([file], { type: file.type });

      await sp.web.getFolderByServerRelativeUrl(folderUrl)
        .files.add(fileName, fileBlob)
        .then((fileAdded) => {
          console.log('File uploaded successfully:', fileAdded);
        });
    } catch (error) {
      console.log('Error uploading file:', error);
    }
  }
};

export const AddAnncouncementanNews = async (_sp) => {
  let arr = []
  await _sp.web.lists.getByTitle("ARGEventMaster").items.add
    .then((res) => {
      console.log(res);
      arr = res;
    })
    .catch((error) => {
      console.log("Error fetching data: ", error);
    });
  return arr;
}
export const addItem = async (itemData, _sp) => {
  let resultArr = []
  try {
    const newItem = await _sp.web.lists.getByTitle('ARGEventMaster').items.add(itemData);
    console.log('Item added successfully:', newItem);
    // Swal.fire('Item added successfully', '', 'success');

    resultArr = newItem
    // Perform any necessary actions after successful addition
  } catch (error) {
    console.log('Error adding item:', error);
    // Handle errors appropriately
    resultArr = null
    Swal.fire(' Cancelled', '', 'error')
  }
  return resultArr;
};
export const updateItem = async (itemData, _sp, id) => {
  let resultArr = []
  try {
    const newItem = await _sp.web.lists.getByTitle('ARGEventMaster').items.getById(id).update(itemData);
    console.log('Item added successfully:', newItem);
    resultArr = newItem
    // Perform any necessary actions after successful addition
  } catch (error) {
    console.log('Error adding item:', error);
    // Handle errors appropriately
    resultArr = null
  }
  return resultArr;
};
export const DeleteEntityMasterAPI = async (_sp, id) => {
  let resultArr = []
  try {
    const newItem = await _sp.web.lists.getByTitle('ARGEventMaster').items.getById(id).delete();
    console.log('Item added successfully:', newItem);
    resultArr = newItem
    // Perform any necessary actions after successful addition
  } catch (error) {
    console.log('Error adding item:', error);
    // Handle errors appropriately
    resultArr = null
  }
  return resultArr;
}
export const getEventByID = async (_sp, id) => {
  
  let arr = []
  let arrs = []
  let bannerimg = []
  await _sp.web.lists.getByTitle("ARGEventMaster").items.getById(id).select("*,Entity/Id,Entity/Entity").expand("Entity")()
    .then((res) => {
      console.log(res, ' let arrs=[]');
      const bannerimgobject = res.image != "{}"&& res.image !=null && JSON.parse(res.image)
      console.log(bannerimgobject[0], 'bannerimgobject');
      if (bannerimgobject != null) {

        bannerimg.push(bannerimgobject);

      }
      
      const parsedValues = {
        EventName: res.EventName,
        ID: res.ID,
        BannerImage: bannerimg,
        Overview: res.Overview,
        EventAgenda: res.EventAgenda,
        EntityId: res?.Entity?.Id,
        Status: res?.Status,
        RegistrationDueDate: res.RegistrationDueDate,
        EventDate: res.EventDate,
        EventGalleryId: res.EventGalleryId != null ? res.EventGalleryId : "",
        EventThumbnailId: res.EventThumbnailId != null ? res.EventThumbnailId : "",
        EventGalleryJson: res.EventGalleryJson != null ? JSON.parse(res.EventGalleryJson) : "",
        EventThumbnailJson: res.EventThumbnailJson != null ? JSON.parse(res.EventThumbnailJson) : "",
        EventThumbnailJson: res.EventThumbnailJson != null ? JSON.parse(res.EventThumbnailJson) : "",
        // other fields as needed
      };

      arr.push(parsedValues)
      arrs = arr
      console.log(arrs, 'arr');
    })
    .catch((error) => {
      console.log("Error fetching data: ", error);
    });
  console.log(arrs, 'arr');
  return arrs;
}
export const getARGEventMasterDetailsById = async (_sp, idNum) => {
  let arr = []
  let arr1 = []

  await _sp.web.lists.getByTitle("ARGEventMaster").items.getById(idNum).select("*,Attendees/Id,Attendees/Title").expand("Attendees")()
    .then(async(res) => {
      // for (var i = 0; i < res.length; i++) {
      for (var j = 0; j < res.Attendees.length; j++) {
        var user = await _sp.web.getUserById(res.Attendees[j].Id)();
        var profile = await _sp.profiles.getPropertiesFor(`i:0#.f|membership|${user.Email}`);
        res.Attendees[j].EMail = user.Email;

        res.Attendees[j].SPSPicturePlaceholderState = profile.UserProfileProperties?profile.UserProfileProperties[profile.UserProfileProperties.findIndex(obj=>obj.Key === "SPS-PicturePlaceholderState")].Value:"1";

      }
    // }
      // arr=res;
      console.log(res, 'resresres');

      arr1.push(res)
      arr = arr1
    }).catch((error) => {
      console.log("Error fetching data: ", error);
    });
  return arr;
}
export const uploadFileBanner = async (file, sp, docLib, siteUrl) => {
  let arr = {};
  
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
    "fieldName": "image",
    "serverRelativeUrl": fileUrl
  };
  return arr;
};
