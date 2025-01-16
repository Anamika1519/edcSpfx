import Swal from "sweetalert2";


export const fetchprojectdata = async (_sp) => {
  debugger
  let arr = []
//,TeamMembers/EMail
  await _sp.web.lists.getByTitle("ARGProject").items.select("*,TeamMembers/ID,TeamMembers/Title,Author/ID,Author/Title,Author/EMail,Author/SPSPicturePlaceholderState").expand("TeamMembers , Author").getAll().then(async (res) => {
    console.log("checking the data of project---->>>", res);
    for (var i = 0; i < res.length; i++) {
     const ARGProjectComment= await _sp.web.lists.getByTitle("ARGProjectComments").items.filter(`ARGProjectId eq ${res[i].Id}`)();
     console.log(ARGProjectComment,'ARGProjectComment');
     
      res[i].CommentsCount = ARGProjectComment.length
      
      for (var j = 0; j < res[i].TeamMembers.length; j++) {
        var user = await _sp.web.getUserById(res[i].TeamMembers[j].ID)();
        var profile = await _sp.profiles.getPropertiesFor(`i:0#.f|membership|${user.Email}`);
        res[i].TeamMembers[j].EMail = user.Email;

        res[i].TeamMembers[j].SPSPicturePlaceholderState = profile.UserProfilePropertie?profile.UserProfileProperties[profile.UserProfileProperties.findIndex(obj=>obj.Key === "SPS-PicturePlaceholderState")].Value:"1";

      }
    }
    for (var i = 0; i < res.length; i++) {

      try {
        const ARGProjectFolders = await _sp.web.getFolderByServerRelativePath(res[i].ProjectFileManager).files();
        console.log(ARGProjectFolders,'ARGProjectFolders');
        
        res[i].FileCount = ARGProjectFolders.length
      } catch (error) {
        
      }
       
     }
    //res.filter(x=>x.Category?.Category==str)
    arr = res;
  })
    .catch((error) => {
      console.error("Error fetching data: ", error);
    });
  return arr;
}
let arggroups =[]
export const fetchprojectdataTop = async (_sp) => {
  let arr = []
   console.log("first sexcute this and ")
   let userID= ''
   await _sp.web.currentUser().then((res) => {console.log(res);userID = res["Id"];})

  await _sp.web.lists.getByTitle("ARGProject").items.select("*,TeamMembers/ID,TeamMembers/EMail,TeamMembers/Title , AuthorId , ProjectStatus").expand("TeamMembers").filter(`(AuthorId eq '${userID}' or TeamMembers/ID eq '${userID}') and ProjectStatus eq 'Ongoing'`).orderBy("Modified", false).top(3)().then(async(res) => {
    console.log("checking the data of project---->>>", res);
  
    //res.filter(x=>x.Category?.Category==str)
    for (var i = 0; i < res.length; i++) {
      const ARGProjectComment= await _sp.web.lists.getByTitle("ARGProjectComments").items.filter(`ARGProjectId eq ${res[i].Id}`)();
      console.log(ARGProjectComment,'ARGProjectComment');
      
       res[i].CommentsCount = ARGProjectComment.length
     }
     for (var i = 0; i < res.length; i++) {

      try {
        const ARGProjectFolders = await _sp.web.getFolderByServerRelativePath(res[i].ProjectFileManager).files();
        console.log(ARGProjectFolders,'ARGProjectFolders');
        
        res[i].FileCount = ARGProjectFolders.length
      } catch (error) {
        
      }
       
     }
    arr = res;
     arggroups = res
     
  })
    .catch((error) => {
      console.error("Error fetching data: ", error);
    });
  return arr;
  fertchprojectcomments
}
export const fertchprojectcomments = async (_sp) => {
  let arr = [];
  arggroups.forEach(async (item) => {
      console.log(" here is my items ", item);
      const ARGProjectComment= await _sp.web.lists.getByTitle("ARGProjectComments").items.filter(`ARGProjectId eq ${item.Id}`)();
      console.log(ARGProjectComment,'ARGProjectComment');
      
      ARGProjectComment.CommentsCount = ARGProjectComment.length
     
  })
  await _sp.web.lists.getByTitle("ARGProject").items.select("*,TeamMembers/ID,TeamMembers/EMail,TeamMembers/Title").expand("TeamMembers").orderBy("Modified", false).top(3)().then((res) => {
    console.log("checking the data of project---->>>", res);

    //res.filter(x=>x.Category?.Category==str)
    arr = res;
  })
    .catch((error) => {
      console.error("Error fetching data: ", error);
    });
  return arr;
}
export const uploadFileToLibrary = async (file, sp, docLib) => {
  debugger
  let arrFIleData = [];
  let fileSize = 0
  try {
    const result = await sp.web.lists.getByTitle(docLib).rootFolder.files.addChunked(file.name, file,

      // const result = await sp.web.lists.getByTitle(docLib).rootFolder.files.addChunked(
      // file.name,
      // file,
      (progress, data) => {
        console.log(progress, data);
        fileSize = progress.fileSize
      },
      true
    );

    const item = await sp.web.getFileByServerRelativePath(result.data.ServerRelativeUrl).getItem("*", "ID", "AuthorId", "Modified")
    console.log(item.Id, 'itemitem');
    let arr = {
      ID: item.Id,
      Createdby: item.AuthorId,
      Modified: item.Modified,
      fileUrl: result.data.ServerRelativeUrl,
      fileSize: fileSize,
      fileType: file.type,
      fileName: file.name,
    }
    arrFIleData.push(arr)
    console.log(arrFIleData);

    return arrFIleData;
  } catch (error) {
    console.log("Error uploading file:", error);
    return null; // Or handle error differently
  }
};


// export const XYZ = async (_sp) => {
//   let arr = []

//      await _sp.web.lists.getByTitle("MediaGallery").items.select("*,file/Type,fil").getAll().then((res) => {
//       console.log("heloo chking",res);

//       //res.filter(x=>x.Category?.Category==str)
//       arr = res;
//     })
//     .catch((error) => {
//       console.error("Error fetching data: ", error);
//     });
//   return arr;
// }

export const XYZ = async (_sp) => {
  let arr = [];

  try {
    const res = await _sp.web.lists.getByTitle("MediaGallery")
      .items
      .select("*, FileRef, FileLeafRef, File/ServerRelativeUrl,FileType")
      .expand("File")
      .getAll();

    console.log("Retrieved items:", res);

    arr = res.map(item => ({
      ...item,
      imageUrl: item.File ? item.File.ServerRelativeUrl : null // Ensure we get the image URL if it exists
    }));
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return arr;
};

//   export const Choicedata = async (_sp) => {
//     let arr = []

//          await _sp.web.lists.getByTitle("ARGProject").items
//             .select("ProjectPrivacy", "ProjectPriority")
//             .filter("ProjectPrivacy ne null")(); // Await the call to get items

//         return arr; // Return the fetched data

// };


// export const Choicedata = async (_sp) => {
//     let arr = [];

//     await _sp.web.lists.getByTitle("ARGProject").items
//       .select("ProjectPrivacy", "ProjectPriority")
//       .filter("ID ne null")()
//       .then((res) => {
//         console.log(res);
//         arr = res; // Assign the fetched data to arr
//       })
//       .catch((error) => {
//         console.error("Error fetching data: ", error);
//       });

//     return arr; // Return the fetched data
//   };


export const Choicedata = async (_sp) => {
  let arr = []
  const field2 = await _sp.web.lists.getByTitle("ARGProject").fields.getByInternalNameOrTitle("ProjectPriority")()
  console.log("check field-->>", field2);

  arr = field2["Choices"]

  return arr;
}
// export const Choicedataone = async (_sp) => {
//   let arr =[]
//   const field2 =  await _sp.web.lists.getByTitle("ARGProject").fields.getByInternalNameOrTitle("ProjectPrivacy")()
//   console.log("check field-->>",field2);

//   arr= field2["Choices"]

//   return arr;
// }
// export const Choicedata = async (_sp) => {
//   let arr = [];

//   // Fetch choices for the ProjectPriority field
//   const projectPriorityField = await _sp.web.lists.getByTitle("ARGProject").fields.getByInternalNameOrTitle("ProjectPriority")();
//   const projectPriorityChoices = projectPriorityField["Choices"];
//   console.log("projectPriorityChoices1-->>>",projectPriorityChoices)

//   // Fetch choices for the ProjectPrivacy field
//   const projectPrivacyField = await _sp.web.lists.getByTitle("ARGProject").fields.getByInternalNameOrTitle("ProjectPrivacy")();
//   const projectPrivacyChoices = projectPrivacyField["Choices"];
//   console.log("projectPrivacyChoices field1-->>",projectPrivacyChoices);

//   // Combine both choices (if necessary) or return separately
//   arr = [ projectPriorityChoices];

//   return arr;
// };



export const updateItem = async (itemData, sp, id) => {
  let resultArr = []
  debugger
  try {
    const newItem = await sp.web.lists.getByTitle("ARGProject").items.getById(id).update(itemData);
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
    const newItem = await _sp.web.lists.getByTitle("ARGProject").items.add(itemData);
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
export const DeleteProjectAPI = async (_sp, id) => {
  let resultArr = []
  try {
    const newItem = await _sp.web.lists.getByTitle('ARGProject').items.getById(id).delete();
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