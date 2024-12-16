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
  let sampleDataArray=[]
  await sp.web.lists.getByTitle("ARGApprovalConfiguration").items.select("*,Users/Id,Users/Title,Users/EMail").expand("Users").getAll().then((res) => {
    arr = res
    console.log(arr, 'arr');
    for(let i=0;i<arr.length;i++)
    {
      let ars={
        entity:arr[i].EntityId,
        levels:arr[i].Users,
        rework:arr[i].Rework0
      }
      sampleDataArray.push(ars)
    }
   
  })
  return sampleDataArray
}
export const getApprovalConfiguration = async (sp,EntityId) => {
  debugger
  let arr = []
  let sampleDataArray=[]
  arr= await sp.web.lists.getByTitle("ARGApprovalConfiguration").items.select("*,Users/ID,Users/Title,Users/EMail,Level/Id,Level/Level").expand("Users,Level").filter(`EntityId eq ${EntityId}`).getAll();
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


export const UpdateContentMaster = async (sp,contentmasteritemid, itemData) => {
  let arr;
  await sp.web.lists.getByTitle("ARGContentMaster").items.getById(contentmasteritemid).update(itemData).then((res) => {
    arr = res
    console.log(arr, 'arr');
  })
  return arr
}

//My request

export const getRequestListsData = async (_sp) => {

  let arr = []


  await _sp.web.lists.getByTitle("AllRequestLists").items.orderBy("Created", false).getAll()

    .then((res) => {

      console.log("AllRequestLists", res);

      let AllRequestArr = [];


      for (let i = 0; i < res.length; i++) {

        getMyRequestsdata(_sp, res[i].Title).then((resData) => {

          for (let j = 0; j < resData.length; j++) {

            AllRequestArr.push(resData[j])

          }


        })

      }

      console.log("AllRequestArr", AllRequestArr);

      arr = AllRequestArr;

    })

    .catch((error) => {

      console.log("Error fetching data: ", error);

    });

  return arr;

}

export const getMyRequestsdata = async (_sp, listName) => {

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

    .filter(`Author/EMail eq '${currentUser}'`)

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
export const getMyRequest = async (sp)=>
{
  const currentUser = await sp.web.currentUser();
  let arr = []
  await sp.web.lists.getByTitle("ARGMyRequest").items.select("*,Requester/Id,Requester/Title,Approver/Id,Approver/Title")
  .expand("Approver,Requester").filter(`RequesterId eq ${currentUser.Id}`)
  .orderBy("Created",false)
  .getAll().then((res) => {

    arr = res
    console.log(arr, 'arr');
  })
  return arr
}
export const getMyApproval = async (sp,status)=>

  {

    const currentUser = await sp.web.currentUser();

    let arr = []

    await sp.web.lists.getByTitle("ARGMyRequest").items.select("*,Requester/Id,Requester/Title,Approver/Id,Approver/Title").expand("Approver,Requester")

    .filter(`ApproverId eq ${currentUser.Id} and Status eq '${status}'`)

    .orderBy("Created",false)

    .getAll().then((res) => {

      arr = res

      console.log(arr, 'arr');

    })

    return arr

  }
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
  export const gteDMSApproval = async (sp) => {
    // alert("DMS");
    const currentUser = await sp.web.currentUser();
    console.log(currentUser, "currentUser");
    let arr = [];
  
    const FilesItems = await sp.web.lists
      .getByTitle("MasterSiteURL")
      .items.select("Title", "SiteID", "FileMasterList", "Active")
      .filter(`Active eq 'Yes'`)();
  
    console.log(FilesItems, "FilesItems");
  
    // Use for...of loop for proper async/await handling
    for (const fileItem of FilesItems) {
      if (fileItem.FileMasterList !== null) {
        console.log("fileItem.FileMasterList", fileItem.FileMasterList);
        //  alert(currentUser.Email)
        const filesData = await sp.web.lists
          .getByTitle(fileItem.FileMasterList)
          .items.select("ID", "FileName", "FileUID", "FileSize", "FileVersion", "Status", "SiteID", "CurrentFolderPath", "DocumentLibraryName", "SiteName", "FilePreviewURL", "IsDeleted", "MyRequest" , "*")
          .filter(`CurrentUser eq '${currentUser.Email}' and MyRequest eq 1 and Status eq 'Pending'`)
          .orderBy("Modified", false)
          .getAll();
  
        arr = [...arr, ...filesData]; // Collect data in the array
        console.log(arr, "DMS My request Data");
      }
    }
  
    return arr; // Return the collected data
  }
  
export const getDataByID = async (_sp,id,ContentName) => {
  debugger
  let arr = []
  let arrs = []
  let bannerimg = []
  if(ContentName!=null&&ContentName!=undefined)
    //  alert(ContentName )
  {
    await _sp.web.lists.getByTitle(ContentName).items.getById(id)
    ()
      .then((res) => {
        console.log(res, ' let arrs=[]');
     arrs.push(res)
      arr=arrs
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

