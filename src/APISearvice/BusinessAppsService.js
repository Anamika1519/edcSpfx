export const fetchAutomationDepartment = async (_sp) => {
    let arr = []
   
       await _sp.web.lists.getByTitle("ARGAutomationDepartment").items.getAll().then((res) => {
        console.log(res);
     
        //res.filter(x=>x.Category?.Category==str)
        arr = res;
      })
      .catch((error) => {
        console.log("Error fetching data: ", error);
      });
    return arr;
  }
  export const fetchARGAutomationdata = async (_sp) => {
    let arr = []
   
       await _sp.web.lists.getByTitle("ARGBusinessApps").items.select("*,ARGAutomationDepartment/Id,ARGAutomationDepartment/DepartmentName").expand("ARGAutomationDepartment").getAll().then((res) => {
        console.log("response-->>>",res);
     
        //res.filter(x=>x.Category?.Category==str)
        arr = res;
      })
      .catch((error) => {
        console.log("Error fetching data: ", error);
      });
    return arr;
  }

  export const getMyApprovalsdata = async (_sp,listName) => {
    let arr = []
    let currentUser;
    await _sp.web.currentUser()
      .then(user => {
        console.log("user",user);
        currentUser = user.Email; // Get the current user's Email
      })
      .catch(error => {
        console.error("Error fetching current user: ", error);
        return [];
      });
  
    if (!currentUser) return arr; // Return empty array if user fetch failed
  
    await _sp.web.lists.getByTitle(listName).items
      .select("*,Author/ID,Author/Title,Author/EMail,AssignedTo/ID,AssignedTo/Title,AssignedTo/EMail").expand("Author,AssignedTo")
      .filter(`AssignedTo/EMail eq '${currentUser}'`)
      .orderBy("Created", false).getAll()
      .then((res) => {
        console.log(`--MyApproval${listName}`, res);
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
  
  export const getApprovalListsData = async (_sp) => {
    let arr = []
    
    await _sp.web.lists.getByTitle("AllApprovalLists").items.orderBy("Created", false).getAll()
      .then((res) => {
        console.log("AllApprovallists",res);
        let AllApprovalArr = [];
        debugger
        for (let i = 0; i < res.length; i++) {
          getMyApprovalsdata(_sp,res[i].Title).then((resData)=>{
            for (let j = 0; j < resData.length; j++) { 
              AllApprovalArr.push(resData[j])
            }
           
          })
        }
        console.log("AllApprovalArr",AllApprovalArr);
        arr = AllApprovalArr;
      })
      .catch((error) => {
        console.log("Error fetching data: ", error);
      });
    return arr;
  }
  
  export const getMyRequestsdata = async (_sp,listName) => {
    let arr = []
    let currentUser;
    await _sp.web.currentUser()
      .then(user => {
        console.log("user",user);
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
  
  export const getRequestListsData = async (_sp) => {
    let arr = []
    
    await _sp.web.lists.getByTitle("AllRequestLists").items.orderBy("Created", false).getAll()
      .then((res) => {
        console.log("AllRequestLists",res);
        let AllRequestArr = [];
        debugger
        for (let i = 0; i < res.length; i++) {
          getMyRequestsdata(_sp,res[i].Title).then((resData)=>{
            for (let j = 0; j < resData.length; j++) { 
              AllRequestArr.push(resData[j])
            }
           
          })
        }
        console.log("AllRequestArr",AllRequestArr);
        arr = AllRequestArr;
      })
      .catch((error) => {
        console.log("Error fetching data: ", error);
      });
    return arr;
  }