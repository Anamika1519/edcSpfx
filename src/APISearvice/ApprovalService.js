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
export const getMyRequest = async (sp)=>
{
  const currentUser = await sp.web.currentUser();
  let arr = []
  await sp.web.lists.getByTitle("ARGMyRequest").items.select("*,Requester/Id,Requester/Title,Approver/Id,Approver/Title").expand("Approver,Requester").filter(`RequesterId eq ${currentUser.Id}`).getAll().then((res) => {
    arr = res
    console.log(arr, 'arr');
  })
  return arr
}
// export const getMyApproval = async (sp)=>
//   {
//     const currentUser = await sp.web.currentUser();
//     let arr = []
//     await sp.web.lists.getByTitle("ARGMyRequest").items.select("*,Requester/Id,Requester/Title,Approver/Id,Approver/Title").expand("Approver,Requester").filter(`ApproverId eq ${currentUser.Id}`).getAll().then((res) => {
//       arr = res
//       console.log(arr, 'arr');
//     })
//     return arr
//   }
export const getMyApproval = async (sp,listName) => {
  const currentUser = await sp.web.currentUser();
  let arr = [];
  let AllApprovalArr = [];
  await sp.web.lists.getByTitle("AllApprovalLists").items.orderBy("Created", false).getAll()
    .then(async (res) => {
      console.log("AllApprovallists", res);
      
      for (let i = 0; i < res.length; i++) {
        await sp.web.lists.getByTitle(`${res[i].Title}`).items
        //.select("*,Requester/Id,Requester/Title,Approver/Id,Approver/Title")
        //.expand("Approver,Requester")
        .select("*,Author/ID,Author/Title,Author/EMail,AssignedTo/ID,AssignedTo/Title,AssignedTo/EMail,Approver/ID,Approver/Title,Approver/EMail")
        .expand("Author,AssignedTo,Approver")
        .filter(`ApproverId eq ${currentUser.Id} or AssignedToId eq ${currentUser.Id}`)
        .getAll().then((resData) => {
          for (let j = 0; j < resData.length; j++) {
            AllApprovalArr.push(resData[j])
          }
          //arr = res
          //console.log(arr, 'arr');
        })
      }
    //})
    console.log("AllApprovalArr", AllApprovalArr);
    arr = AllApprovalArr;
  })
  .catch((error) => {
    console.log("Error fetching data: ", error);
  });

  return arr
}
export const getApprovalListsData = async (_sp) => {
  let arr = []

  await _sp.web.lists.getByTitle("AllApprovalLists").items.orderBy("Created", false).getAll()
    .then((res) => {
      console.log("AllApprovallists", res);
      let AllApprovalArr = [];
      
      for (let i = 0; i < res.length; i++) {
        getMyApproval(_sp, res[i].Title).then((resData) => {
          for (let j = 0; j < resData.length; j++) {
            AllApprovalArr.push(resData[j])
          }

        })
      }
      console.log("AllApprovalArr", AllApprovalArr);
      arr = AllApprovalArr;
    })
    .catch((error) => {
      console.log("Error fetching data: ", error);
    });
  return arr;
}
export const getMyApprovalsdata = async (_sp, listName) => {
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
    .select("*,Author/ID,Author/Title,Author/EMail,AssignedTo/ID,AssignedTo/Title,AssignedTo/EMail,Approver/ID,Approver/Title,Approver/EMail")
    .expand("Author,AssignedTo,Approver")
    .filter(`AssignedTo/EMail eq '${currentUser}' or Approver/EMail eq '${currentUser}'`)
    .orderBy("Created", false).getAll()
    .then((res) => {
      console.log(`--MyApproval${listName}`, res);
      arr = res
    })
    .catch((error) => {
      console.log("Error fetching data: ", error);
    });
  return arr;
}
export const getDataByID = async (_sp,id,ContentName) => {
  
  let arr = []
  let arrs = []
  let bannerimg = []
  if(ContentName!=null&&ContentName!=undefined)
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

