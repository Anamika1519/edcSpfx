import Swal from 'sweetalert2';
export const getLevel = async (sp) => {
  let arr = []
  await sp.web.lists.getByTitle("ARGLevelMaster").items.select("Level,Id").getAll().then((res) => {
    arr = res
    console.log(arr, 'arr');

  })
  return arr
}
export const getLevelId = async (levelName) => {
  try {
    const items = await sp.web.lists.getByTitle("ARGLevelMaster").items
      .select("Id", "Level")
      .filter(`Level eq '${levelName}'`)(); // Fetch the ID based on the level name

    return items.length > 0 ? items[0].Id : null; // Return the ID if found
  } catch (error) {
    console.error("Error fetching level ID:", error);
    return null;
  }
};

export const AddDataonConfuguration = async (sp, itemData) => {
  let arr = []
  await sp.web.lists.getByTitle("ARGApprovalConfiguration").items.add(itemData).then((res) => {
    arr = res
    console.log(arr, 'arr');
  })
  return arr
}

export const GetARGApprovalConfiguration = async (sp) => {
  let arr = []
  let sampleDataArray = []
  await sp.web.lists.getByTitle("ARGApprovalConfiguration").items.select("*,Users/Id,Users/Title,Users/EMail").expand("Users").getAll().then((res) => {
    arr = res
    console.log(arr, 'arr');
    for (let i = 0; i < arr.length; i++) {
      let ars = {
        entity: arr[i].EntityId,
        levels: arr[i].Users,
        rework: arr[i].Rework0
      }
      sampleDataArray.push(ars)
    }

  })
  return sampleDataArray
}
export const getApprovalConfiguration = async (sp, EntityId) => {
  debugger
  let arr = []
  let sampleDataArray = []
  arr = await sp.web.lists.getByTitle("ARGApprovalConfiguration").items.select("*,Users/ID,Users/Title,Users/EMail,Level/Id,Level/Level").expand("Users,Level").filter(`EntityId eq ${EntityId}`).getAll();
  // .then((res) => {
  //   arr = res
  //   console.log(arr, 'arr');
  // })
  return arr
}
export const AddContentLevelMaster = async (sp, itemData) => {
  let arr = []
  await sp.web.lists.getByTitle("ARGContentLevelMaster").items.add(itemData).then((res) => {
    arr = res
    console.log(arr, 'arr');
  })
  return arr
}
export const AddContentMaster = async (sp, itemData) => {
  let arr = []
  await sp.web.lists.getByTitle("ARGContentMaster").items.add(itemData).then((res) => {
    arr = res
    console.log(arr, 'arr');
  })
  return arr
}


export const UpdateContentMaster = async (sp, contentmasteritemid, itemData) => {
  let arr;
  await sp.web.lists.getByTitle("ARGContentMaster").items.getById(contentmasteritemid).update(itemData).then((res) => {
    arr = res
    console.log(arr, 'arr');
  })
  return arr
}

//My request

export const getRequestListsData = async (_sp, status) => {

  let arr = []

  let Status = status == "Pending" ? "Submitted" : status;
  await _sp.web.lists.getByTitle("AllRequestLists").items.orderBy("Created", false).getAll()

    .then((res) => {

      console.log("AllRequestLists", res);

      let AllRequestArr = [];


      for (let i = 0; i < res.length; i++) {

        getMyRequestsdata(_sp, res[i].Title, Status).then((resData) => {

          for (let j = 0; j < resData.length; j++) {

            AllRequestArr.push(resData[j])

          }


        })

      }
      AllRequestArr = AllRequestArr.sort((a, b) => {
        return a.Created === new Date(b.Created) ? 0 : new Date(a.Created) ? -1 : 1;
      });
      console.log("AllRequestArr", AllRequestArr);

      arr = AllRequestArr;

    })

    .catch((error) => {

      console.log("Error fetching data: ", error);

    });

  return arr;

}
export const getMyRequestsdata = async (_sp, listName, status) => {

  let arr = []

  let currentUser;

  await _sp.web.currentUser()

    .then(user => {

      console.log("usertesttt", user, listName, status);

      currentUser = user.Id; // Get the current user's Email

    })

    .catch(error => {

      console.error("Error fetching current user: ", error);

      return [];

    });


  if (!currentUser) return arr; // Return empty array if user fetch failed


  await _sp.web.lists.getByTitle(listName).items

    .select("*,Author/ID,Author/Title,Author/EMail").expand("Author")

    .filter(`AuthorId eq ${currentUser} and Status eq '${status}'`)

    .orderBy("Created", false).getAll()

    .then((res) => {

      console.log(`--MyRequest${listName}`, res);

      arr = res

      // arr = res.filter(item => 

      //     // Include public groups or private groups where the current user is in the InviteMembers array

      //     item.GroupType === "Public" || 

      //     (item.GroupType === "Private" && item.InviteMemebers && item.InviteMemebers.some(member => member.Id === currentUser))

      //   );

    })

    .catch((error) => {

      console.log("Error fetching data: ", error);

    });

  return arr;

}
// Intranet My Request
export const getRequestListsDataIntranet = async (_sp, status) => {
  let arr = []
  await _sp.web.lists.getByTitle("AllRequestLists").items.orderBy("Created", false).getAll()
    .then((res) => {
      console.log("AllRequestLists i ntranett", res);
      let AllRequestArr = [];
      for (let i = 0; i < res.length; i++) {
        getMyRequestsdataIntranet(_sp, res[i].Title, status).then((resData) => {
          for (let j = 0; j < resData.length; j++) {
            AllRequestArr.push(resData[j])
          }
        })
      }
      console.log("AllRequestArr intra", AllRequestArr);
      arr = AllRequestArr;
    })
    .catch((error) => {
      console.log("Error fetching data: ", error);
    });
  return arr;
}
export const getMyRequestsdataIntranet = async (_sp, listName, status) => {
  let arr = []
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
  if (!currentUser) return arr; // Return empty array if user fetch failed
  await _sp.web.lists.getByTitle(listName).items
    .select("*,Author/ID,Author/Title,Author/EMail").expand("Author")
    .filter(`Author/EMail eq '${currentUser}' and Status eq '${status}'`)
    .orderBy("Created", false).getAll()
    .then((res) => {
      console.log(`--MyRequestintra${listName}`, res);
      arr = res
    })
    .catch((error) => {
      console.log("Error fetching data: ", error);
    });
  return arr;
}
//Intranet My Request end
// export const getMyRequest = async (sp,status)=>
// {
//   const currentUser = await sp.web.currentUser();
//   let arr = []
//   await sp.web.lists.getByTitle("ARGMyRequest").items.select("*,Requester/Id,Requester/Title,Approver/Id,Approver/Title")
//     .expand("Approver,Requester").filter(`RequesterId eq ${currentUser.Id} and Status eq '${status}'`)
//   .orderBy("Created",false)
//   .getAll().then((res) => {

//     arr = res
//     console.log(arr, 'arr');
//   })
//   return arr
// }
export const getMyRequest = async (sp, status) => {
  const currentUser = await sp.web.currentUser();
  let arr = []
  await sp.web.lists.getByTitle("ARGContentMaster").items.select("*,Author/Id,Author/Title")
    .expand("Author").filter(`AuthorId eq ${currentUser.Id} and Status eq '${status}'`)
    .orderBy("Created", false)
    .getAll().then((res) => {

      arr = res
      console.log(arr, 'arr');
    })
  return arr
}
// export const getMyApproval = async (sp, status) => {

//   const currentUser = await sp.web.currentUser();

//   let arr = []

//   await sp.web.lists.getByTitle("ARGMyRequest").items.select("*,Requester/Id,Requester/Title,Approver/Id,Approver/Title").expand("Approver,Requester")

//     .filter(`ApproverId eq ${currentUser.Id} and Status eq '${status}'`)

//     .orderBy("Created", false)

//     .getAll().then((res) => {

//       arr = res

//       console.log(arr, 'arr');

//     })

//   return arr

// }
// export const gteDMSApproval = async(sp)=>{
//   alert("DMS")
//   const currentUser = await sp.web.currentUser();
//   console.log(currentUser , "currentUser")
//   let arr = []
//   const FilesItems = await sp.web.lists
//   .getByTitle("MasterSiteURL")
//   .items.select("Title", "SiteID", "FileMasterList", "Active")
//   .filter(`Active eq 'Yes'`)();

//   console.log(FilesItems , "FilesItems")
//   FilesItems.forEach(async (fileItem, index) => {
//     if (fileItem.FileMasterList !== null) {
//       // if (siteIdToUpdate && fileItem.SiteID !== siteIdToUpdate) {
//       //   return;
//       // }

//       console.log("fileItem.FileMasterList",fileItem.FileMasterList);

//       const filesData = await sp.web.lists
//             .getByTitle(`${fileItem.FileMasterList}`)
//             .items.select("ID" , "FileName", "FileUID", "FileSize", "FileVersion" ,"Status" , "SiteID","CurrentFolderPath","DocumentLibraryName","SiteName","FilePreviewURL","IsDeleted","MyRequest").filter(
//               `CurrentUser eq '${currentUser.Email}' and MyRequest eq 1 and Status eq 'Pending'`
//             ).orderBy("Modified", false).getAll().then((res) => {
//               arr = res
//             });
//       console.log("My reaquest Called");

//       // console.log("enter in the myRequest------")
//       console.log(fileItem.FileMasterList,"- FilesData",filesData)
//     // route to different-2 sideBar
//      console.log(arr , "DMS My request Data")
//      return arr

//     }
//   });

// }
// export const gteDMSApproval = async (sp) => {
//   // alert("DMS");
//   const currentUser = await sp.web.currentUser();
//   console.log(currentUser, "currentUser");
//   let arr = [];

//   const FilesItems = await sp.web.lists
//     .getByTitle("MasterSiteURL")
//     .items.select("Title", "SiteID", "FileMasterList", "Active")
//     .filter(`Active eq 'Yes'`)();

//   console.log(FilesItems, "FilesItems");

//   // Use for...of loop for proper async/await handling
//   for (const fileItem of FilesItems) {
//     if (fileItem.FileMasterList !== null) {
//       console.log("fileItem.FileMasterList", fileItem.FileMasterList);
//       //  alert(currentUser.Email)
//       const filesData = await sp.web.lists
//         .getByTitle(fileItem.FileMasterList)
//         .items.select("ID", "FileName", "FileUID", "FileSize", "FileVersion", "Status", "SiteID", "CurrentFolderPath", "DocumentLibraryName", "SiteName", "FilePreviewURL", "IsDeleted", "MyRequest" , "*")
//         .filter(`CurrentUser eq '${currentUser.Email}' and MyRequest eq 1 and Status eq 'Pending'`)
//         .orderBy("Modified", false)
//         .getAll();

//       arr = [...arr, ...filesData]; // Collect data in the array
//       console.log(arr, "DMS My request Data");
//     }
//   }

//   return arr; // Return the collected data
// }
export const getMyApproval = async (sp, status, actingfor) => {
  try {
    // alert(`Actingfor is ${actingfor}`);
    let arr = [];
    
    if (!actingfor) {
      // alert(`Actingfor is null ${actingfor}`);
      const currentUser = await sp.web.currentUser();
      
      arr = await sp.web.lists.getByTitle("ARGMyRequest").items.select("*,Requester/Id,Requester/Title,Approver/Id,Approver/Title", "Approver/EMail")
        .expand("Approver,Requester")
        .filter(`ApproverId eq ${currentUser.Id} and Status eq '${status}'`)
        .orderBy("Created", false)
        .getAll();
        
      console.log(arr, 'arr of intranet if actingfor is null');
    } else {
      // alert(`Actingfor is not null ${actingfor}`);
      const user = await sp.web.siteUsers.getByEmail(actingfor)();
      // alert(user.Id);
      
      if (user.Id) {
        arr = await sp.web.lists.getByTitle("ARGMyRequest").items.select("*,Requester/Id,Requester/Title,Approver/Id,Approver/Title" ,"Approver/EMail")
          .expand("Approver,Requester")
          .filter(`ApproverId eq ${user.Id} and Status eq '${status}'`)
          .orderBy("Created", false)
          .getAll();
        
        console.log(arr, 'arr of intranet if actingfor is not null');
      } else {
        console.log("User not found in Approval");
      }
    }
    
    return arr;
  } catch (error) {
    console.error("Error fetching list items:", error);
    return [];
  }
};
export const gteDMSApproval = async (sp, value) => {
  try {
    const currentUser = await sp.web.currentUser();
    console.log(currentUser, "currentUser");
    let arr = [];

    const FilesItems = await sp.web.lists
      .getByTitle("MasterSiteURL")
      .items.select("Title", "SiteID", "FileMasterList", "Active")
      .filter(`Active eq 'Yes'`)();

    console.log(FilesItems, "FilesItems");

    for (const fileItem of FilesItems) {
      if (fileItem.FileMasterList) {
        console.log("fileItem.FileMasterList", fileItem.FileMasterList);
        const filesData = await sp.web.lists
          .getByTitle(fileItem.FileMasterList)
          .items.select("ID", "FileName", "FileUID", "FileSize", "FileVersion", "Status", "SiteID", "CurrentFolderPath", "DocumentLibraryName", "SiteName", "FilePreviewURL", "IsDeleted", "MyRequest", "*")
          .filter(`CurrentUser eq '${currentUser.Email}' and MyRequest eq 1 and Status eq '${value}'`)
          .orderBy("Created", false)
          .getAll();

        arr = [...arr, ...filesData];
        console.log(arr, "DMS My request Data");
      }
    }

    return arr; // Return the collected data
  } catch (error) {
    console.error("Error in gteDMSApproval function", error);
    return []; // Return an empty array on error
  }
};


export const getDataByID = async (_sp, id, ContentName) => {
  debugger
  let arr = []
  let arrs = []
  let bannerimg = []
  if (ContentName != null && ContentName != undefined)
  //  alert(ContentName )
  {
    await _sp.web.lists.getByTitle(ContentName).items.getById(id)
      ()
      .then((res) => {
        console.log(res, ' let arrs=[]');
        arrs.push(res)
        arr = arrs
      })
      .catch((error) => {
        console.log("Error fetching data: ", error);
      });
    console.log(arr, 'arr');
  }

  return arr;
}
export const updateItemApproval = async (itemData, _sp, id) => {
  let resultArr = []
  try {
    const newItem = await _sp.web.lists.getByTitle('ARGMyRequest').items.getById(id).update(itemData);
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


export const updateItemApproval2 = async (itemData, _sp, id) => {
  let resultArr = []
  try {
    const newItem = await _sp.web.lists.getByTitle('ProcessApprovalList').items.getById(id).update(itemData);
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

export const getMyRequestBlog = async (sp, item) => {

  const currentUser = await sp.web.currentUser();

  let arr = []

  await sp.web.lists.getByTitle("ARGMyRequest").items.select("*,Requester/Id,Requester/Title,Approver/Id,Approver/Title").expand("Approver,Requester")

    .filter(`Status eq 'Pending' and ContentId eq ${item.ID} and EntityId eq ${item.EntityId} and ProcessName eq 'Blog' and ApproverId eq ${currentUser.Id} and ApprovalTask eq 'Approval'`)

    .orderBy("Created", false)

    .getAll().then((res) => {

      arr = res

      console.log(arr, 'arr');

    })

  return arr

}

export const getMyRequestBlogPending = async (sp, item) => {

  const currentUser = await sp.web.currentUser();

  let arr = []

  await sp.web.lists.getByTitle("ARGMyRequest").items.select("*,Requester/Id,Requester/Title,Approver/Id,Approver/Title").expand("Approver,Requester")

    .filter(`Status eq 'Pending' and ContentId eq ${item.ID} and EntityId eq ${item.Entity} and ProcessName eq 'Blog' and ApproverId eq ${currentUser.Id} and ApprovalTask eq 'Assignment'`)

    .orderBy("Created", false)

    .getAll().then((res) => {

      arr = res

      console.log(arr, 'arr');

    })

  return arr

}

export const getAllDMSTasks = async (sp, itemStatus) => {
  const currentUser = await sp.web.currentUser();
  let arr = []

  await sp.web.lists.getByTitle("ProcessApprovalList").items.select("*,AssignedTo/Id,AssignedTo/Title,RequesterName/Id,RequesterName/Title").expand("RequesterName,AssignedTo")

    .filter(`(Status eq 'Pending' or Status eq 'Save as draft') and AssignedToId eq ${currentUser.Id} and ApprovalType eq 'Assignment'`)

    .orderBy("Created", false)

    .getAll().then((res) => {

      arr = res

      console.log(arr, 'arr');

    })

  return arr
}
// export const getAllDMSApprovals = async (sp, itemStatus,actingfor) => {
//   const currentUser = await sp.web.currentUser();
//   let arr = []

//   // await sp.web.lists.getByTitle("DMSFileApprovallist").items.select("*,AssignedTo/Id,AssignedTo/Title,RequesterName/Id,RequesterName/Title").expand("RequesterName,AssignedTo")

//   //   .filter(`AssignedToId eq ${currentUser.Id} and ApprovalType eq 'Approval' and Status eq '${itemStatus}'`)

//   //   .orderBy("Created", false)

//   //   .getAll().then((res) => {
//     await sp.web.lists.getByTitle("DMSFileApprovallist").items.select("*,RequestedBy,RequesterName/Id,RequesterName/Title").expand("RequesterName,AssignedTo")

//     .filter(`AssignedToId eq ${currentUser.Id} and ApprovalType eq 'Approval' and Status eq '${itemStatus}'`)

//     .orderBy("Created", false)

//     .getAll().then((res) => {
     
//       let arrnew = [];
//       arr = res
//       let siteurl =`https://edcadae.sharepoint.com/sites/ededms/SitePages/ChangeRequest.aspx`;
//       console.log("resresresresr", res,siteurl)
//       for (let i = 0; i < res.length; i++) {
//         arrnew.push({
//           ListItemId:res[i].ListItemId,
//           Id:res[i].Id,
//           RequestId: res[i].RequestId,
//           FileName: res[i].Title,
//           ProcessName: res[i].ProcessName,
//           RequestedBy: res[i].InitiatorName?.Title,
//           Created: res[i].Created,
//           Status: res[i].Status,
//           IsDocChange:"CRDC",
//           RedirectionLink: siteurl + "/" + res[i].Status == "Rework" ? "edit" : "approve" + "/" + res[i].ListItemId + "/" + res[i].ID
//         })
//       }
//       console.log(arr, 'arr arrnew', arrnew);
//       arr = arrnew
//     })

//   return arr



// }

const getUserTitleByEmail = async (sp,userEmail) => {
  try {
    const user = await sp.web.siteUsers.getByEmail(userEmail)();
    return user.Title;
  } catch (error) {
    console.error("Error fetching user title:", error);
    return null;
  }
};

export const getAllDMSApprovals = async (sp,value, actingfor) => {
  // alert(`Status value is ${value} is acting for ${actingfor} in DMS`)

  try {
    // Retrieve current user email
    const currentUser = await sp.web.currentUser();
    // const currentUserEmail = currentUserEmailRef.current;
    const currentUserEmail = currentUser.Email;

    // Fetch the ARGDelegateList items where the current user is in the ActingFor column
    const today = new Date().toISOString(); // Get today's date in YYYY-MM-DD format


    let arr = [];
    let approvalData= [];
    if (!actingfor) {
      const items = await sp.web.lists.getByTitle('DMSFileApprovalTaskList').items.select(
        "Log", "CurrentUser", "Remark"
        , "LogHistory"
        , "FileUID/FileUID"
        , "FileUID/SiteName"
        , "FileUID/DocumentLibraryName"
        , "FileUID/FileName"
        , "FileUID/RequestNo"
        , "FileUID/Processname"
        //  ,"FileUID/FilePreviewUrl"
        , "FileUID/Status"
        , "FileUID/FolderPath"
        , "FileUID/RequestedBy"
        , "FileUID/Created"
        , "FileUID/ApproveAction"
        , "MasterApproval/ApprovalType"
        , "MasterApproval/Level"
        , "MasterApproval/DocumentLibraryName"

      )
        .expand("FileUID", "MasterApproval")
        .filter(`CurrentUser eq '${currentUserEmail}' and FileUID/Status eq '${value}'`).orderBy("Created", false).getAll();
      console.log(items, "DMSFileApprovalTaskList");
      // items.map((item) => {
      //   if (item.CurrentUser !== currentUserEmail) {
      //     arr.push(item)
         
      //   }

      // }); // changes by riya
      const updatedItems = await Promise.all(items.map(async (item) => {
        const requestedbyuserTitle = await getUserTitleByEmail(sp,item?.FileUID?.RequestedBy);
        return { ...item, RequestedByTitle: requestedbyuserTitle };
      }));
      approvalData = updatedItems;

      return arr = approvalData;

      // setMylistdata(updatedItems);
    }
    if (actingfor !== "" && actingfor !== undefined) {
      const items = await sp.web.lists.getByTitle('DMSFileApprovalTaskList').items.select(
        "Log", "CurrentUser", "Remark"
        , "LogHistory"
        , "FileUID/FileUID"
        , "FileUID/SiteName"
        , "FileUID/DocumentLibraryName"
        , "FileUID/FileName"
        , "FileUID/RequestNo"
        , "FileUID/Processname"
        //  ,"FileUID/FilePreviewUrl"
        , "FileUID/Status"
        , "FileUID/FolderPath"
        , "FileUID/RequestedBy"
        , "FileUID/Created"
        , "FileUID/ApproveAction"
        , "MasterApproval/ApprovalType"
        , "MasterApproval/Level"
        , "MasterApproval/DocumentLibraryName"

      )
        .expand("FileUID", "MasterApproval")
        .filter(`CurrentUser eq '${actingfor}' and FileUID/Status eq '${value}'`).orderBy("Created", false).getAll();
      console.log(items, "DMSFileApprovalTaskList");
      // items.map((item) => {
      //   if (item.CurrentUser !== currentUserEmail) {
      //     arr.push(item)
      //     // alert(`Delegate user ${item.CurrentUser} is acting for ${item.FileUID.FileName}`)
      //   }

      // }); //Commented by riya
      const updatedItems = await Promise.all(items.map(async (item) => {
        const requestedbyuserTitle = await getUserTitleByEmail(sp,item?.FileUID?.RequestedBy);
        return { ...item, RequestedByTitle: requestedbyuserTitle };
      }));
      approvalData = updatedItems;
      // setMylistdata(updatedItems);
      return arr = approvalData;
    }

    // const updatedItems2 = await Promise.all(items2.map(async (item) => {
    //   const requestedbyuserTitle = await getUserTitleByEmail(item?.FileUID?.RequestedBy);
    //   return { ...item, RequestedByTitle: requestedbyuserTitle };
    // }));
    // commented by riya
    // if (!actingfor) {
    //   const Item2 = await sp.web.lists.getByTitle('DMSFolderDeligationApprovalTask').items.select(
    //     "*",
    //     "Folderdetail"
    //     , "Folderdetail/SiteTitle"
    //     , "Folderdetail/DocumentLibraryName"
    //     , "Folderdetail/CurrentUser"
    //     , "Folderdetail/FolderPath"
    //     , "Folderdetail/FolderName"
    //     , "Folderdetail/ParentFolderId"
    //     , "Folderdetail/Department"
    //     , "Folderdetail/Devision"
    //     , "Folderdetail/RequestNo"
    //     , "FolderMeta"
    //     , "FolderMeta/SiteName"
    //     , "FolderMeta/DocumentLibraryName"
    //     , "FolderMeta/ColumnName",
    //     "Folderdetail/Processname",
    //     "Folderdetail/Status",
    //     "Approver"
    //   ).expand("Folderdetail", "FolderMeta")
    //     .filter(`Approver eq '${currentUserEmail}' and Folderdetail/Status eq '${value}'`)();
    //   console.log("Item2 get from dmsfolderdeligationapprovaltasklist", Item2)
    //   const normalizeItem2 = async (item) => ({
    //     Log: item?.Log || '', // Replace with appropriate mappings
    //     CurrentUser: item?.Folderdetail?.CurrentUser || '',
    //     Remark: item?.Remark || '',
    //     LogHistory: item?.LogHistory || '',
    //     // ProcessName:  item?.Folderdetail?.Processname,
    //     RequestedByTitle: await getUserTitleByEmail(item?.Folderdetail?.CurrentUser),
    //     FileUID: {
    //       FileUID: item?.FolderMeta?.FileUID || item?.Folderdetail?.RequestNo,
    //       SiteName: item?.FolderMeta?.SiteName || '',
    //       DocumentLibraryName: item?.FolderMeta?.DocumentLibraryName || '',
    //       // FileName: item?.FolderMeta?.FolderName || '',
    //       FileName: item?.Folderdetail?.FolderName === null ? item?.Folderdetail?.DocumentLibraryName : item?.Folderdetail?.FolderName,
    //       RequestNo: item?.Folderdetail?.RequestNo || '',
    //       Status: item?.Folderdetail?.Status || '',
    //       FolderPath: item?.Folderdetail?.FolderPath || '',
    //       // RequestedBy: item?.RequestedBy || item?.Folderdetail?.CurrentUser || '',
    //       // RequestedByTitle:await getUserTitleByEmail(item?.Folderdetail?.CurrentUser),
    //       Created: item?.Created || '',
    //       ApproveAction: item?.ApproveAction || '',
    //       Processname: item?.Folderdetail?.Processname
    //     },
    //     MasterApproval: {
    //       ApprovalType: item?.ApprovalType || '',
    //       Level: item?.Level || '',
    //       DocumentLibraryName: item?.DocumentLibraryName || ''
    //     }
    //   });
    //   // const normalizeItem3 = Item2.map(normalizeItem2);
    //   const normalizeItem3 = await Promise.all(Item2.map(normalizeItem2));
    //   console.log("normalizeItem3", normalizeItem3);
    //   console.log(approvalData, "approvalData 666");
    //   const CombinedItems = [...approvalData, ...normalizeItem3];
    //   console.log(CombinedItems, "CombinedItems")
    //   // setMylistdata(CombinedItems);
    //   // setMylistdata(updatedItems);


    //   return arr = CombinedItems
    //   // return arr = approvalData;
    // }
    // if (actingfor !== "" && actingfor !== undefined) {
    //   const Item2 = await sp.web.lists.getByTitle('DMSFolderDeligationApprovalTask').items.select(
    //     "*",
    //     "Folderdetail"
    //     , "Folderdetail/SiteTitle"
    //     , "Folderdetail/DocumentLibraryName"
    //     , "Folderdetail/CurrentUser"
    //     , "Folderdetail/FolderPath"
    //     , "Folderdetail/FolderName"
    //     , "Folderdetail/ParentFolderId"
    //     , "Folderdetail/Department"
    //     , "Folderdetail/Devision"
    //     , "Folderdetail/RequestNo"
    //     , "FolderMeta"
    //     , "FolderMeta/SiteName"
    //     , "FolderMeta/DocumentLibraryName"
    //     , "FolderMeta/ColumnName",
    //     "Folderdetail/Processname",
    //     "Folderdetail/Status",
    //     "Approver"
    //   ).expand("Folderdetail", "FolderMeta")
    //     .filter(`Approver eq '${actingfor}' and Folderdetail/Status eq '${value}'`)();
    //   console.log("Item2 get from dmsfolderdeligationapprovaltasklist", Item2)
    //   const normalizeItem2 = async (item) => ({
    //     Log: item?.Log || '', // Replace with appropriate mappings
    //     CurrentUser: item?.Folderdetail?.CurrentUser || '',
    //     Remark: item?.Remark || '',
    //     LogHistory: item?.LogHistory || '',
    //     // ProcessName:  item?.Folderdetail?.Processname,
    //     RequestedByTitle: await getUserTitleByEmail(item?.Folderdetail?.CurrentUser),
    //     FileUID: {
    //       FileUID: item?.FolderMeta?.FileUID || item?.Folderdetail?.RequestNo,
    //       SiteName: item?.FolderMeta?.SiteName || '',
    //       DocumentLibraryName: item?.FolderMeta?.DocumentLibraryName || '',
    //       // FileName: item?.FolderMeta?.FolderName || '',
    //       FileName: item?.Folderdetail?.FolderName === null ? item?.Folderdetail?.DocumentLibraryName : item?.Folderdetail?.FolderName,
    //       RequestNo: item?.Folderdetail?.RequestNo || '',
    //       Status: item?.Folderdetail?.Status || '',
    //       FolderPath: item?.Folderdetail?.FolderPath || '',
    //       // RequestedBy: item?.RequestedBy || item?.Folderdetail?.CurrentUser || '',
    //       // RequestedByTitle:await getUserTitleByEmail(item?.Folderdetail?.CurrentUser),
    //       Created: item?.Created || '',
    //       ApproveAction: item?.ApproveAction || '',
    //       Processname: item?.Folderdetail?.Processname
    //     },
    //     MasterApproval: {
    //       ApprovalType: item?.ApprovalType || '',
    //       Level: item?.Level || '',
    //       DocumentLibraryName: item?.DocumentLibraryName || ''
    //     }
    //   });
    //   // const normalizeItem3 = Item2.map(normalizeItem2);
    //   const normalizeItem3 = await Promise.all(Item2.map(normalizeItem2));
    //   console.log("normalizeItem3", normalizeItem3);
    //   console.log(approvalData, "approvalData 666");
    //   const CombinedItems = [...approvalData, ...normalizeItem3];
    //   console.log(CombinedItems, "CombinedItems")
    //   // setMylistdata(CombinedItems);
    //   // setMylistdata(updatedItems);


    //   return arr = CombinedItems
     
    // }
    // commented by riya
  } catch (error) {
    console.error("Error fetching list items:", error);
  }

  return arr
};