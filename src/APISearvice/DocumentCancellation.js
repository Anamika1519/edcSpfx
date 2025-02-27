import Swal from 'sweetalert2';
export const getAllDocumentCode = async (_sp) => {
  let arr = [];
  let sts = "Approved";

  await _sp.web.lists.getByTitle("ChangeRequestList").items.filter(`Status eq '${sts}'`)
    .select("*,Location/ID,Custodian/ID,DocumentType/ID,AmendmentType/ID,Classification/ID,ChangeRequestType/ID,Author/ID,Author/Title")
    .expand("DocumentType,Custodian,Classification,AmendmentType,Location,ChangeRequestType,Author")
    .orderBy("Modified", false)() // Order by Modified descending to get latest first
    .then((res) => {
      console.log(res);

      // Filter only latest entry for each unique DocumentCode
      const latestDocuments = res.reduce((acc, item) => {
        if (!acc[item.DocumentCode]) {
          acc[item.DocumentCode] = item;
        }
        return acc;
      }, {});

      arr = Object.values(latestDocuments);
    })
    .catch((error) => {
      console.log("Error fetching data: ", error);
    });
  return arr;
};
export const getAllRequestType = async (_sp) => {
  let arr = [];

  await _sp.web.lists.getByTitle("RequestTypeMaster").items
    .select("*,Author/ID,Author/Title")
    .expand("Author")
    .orderBy("Modified", false)() // Order by Modified descending to get latest first
    .then((res) => {
      console.log(res);

      // Filter only latest entry for each unique DocumentCode
      const latestDocuments = res.reduce((acc, item) => {
        if (!acc[item.RequestType]) {
          acc[item.RequestType] = item;
        }
        return acc;
      }, {});

      arr = Object.values(latestDocuments);
    })
    .catch((error) => {
      console.log("Error fetching data: ", error);
    });
  return arr;
};
export const getAllAmendmentType = async (_sp) => {
  let arr = [];

  await _sp.web.lists.getByTitle("AmendmentTypeMaster").items
    .select("*,Author/ID,Author/Title")
    .expand("Author")
    .orderBy("Modified", false)() // Order by Modified descending to get latest first
    .then((res) => {
      console.log(res);

      // Filter only latest entry for each unique DocumentCode
      const latestDocuments = res.reduce((acc, item) => {
        if (!acc[item.AmendmentType]) {
          acc[item.AmendmentType] = item;
        }
        return acc;
      }, {});

      arr = Object.values(latestDocuments);
    })
    .catch((error) => {
      console.log("Error fetching data: ", error);
    });
  return arr;
};
export const getAllClassificationMaster = async (_sp) => {
  let arr = [];

  await _sp.web.lists.getByTitle("ClassificationMaster").items
    .select("*,Author/ID,Author/Title")
    .expand("Author")
    .orderBy("Modified", false)() // Order by Modified descending to get latest first
    .then((res) => {
      console.log(res);

      // Filter only latest entry for each unique DocumentCode
      const latestDocuments = res.reduce((acc, item) => {
        if (!acc[item.Classification]) {
          acc[item.Classification] = item;
        }
        return acc;
      }, {});

      arr = Object.values(latestDocuments);
    })
    .catch((error) => {
      console.log("Error fetching data: ", error);
    });
  return arr;
};

export const addItem = async (itemData, _sp) => {
 
  let resultArr = []
  try {
    const newItem = await _sp.web.lists.getByTitle('ChangeRequestDocumentCancellationList').items.add(itemData);
 
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
export const addItemChangeRequestList = async (itemData, _sp) => {

  let resultArr = []
  try {
    const newItem = await _sp.web.lists.getByTitle('ChangeRequestList').items.add(itemData);

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
export const addItem2 = async (itemData, _sp) => {
 
  let resultArr = []
  try {
    const newItem = await _sp.web.lists.getByTitle('ChangeRequestReasonDocumentCancellationList').items.add(itemData);
 
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
    const newItem = await _sp.web.lists.getByTitle('ChangeRequestDocumentCancellationList').items.getById(id).update(itemData);
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
export const addItemChangeRequestReasonlist = async (itemData, _sp) => {
 
  let resultArr = []
  try {
    const newItem = await _sp.web.lists.getByTitle('ChangeRequestReasonList').items.add(itemData);
 
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

export const updateItemchangeRequestReasonlist = async (itemData, _sp, id) => {
  let resultArr = []
  try {
    const newItem = await _sp.web.lists.getByTitle('ChangeRequestReasonList').items.getById(id).update(itemData);
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
export const updateItemChangeRequestList = async (itemData, _sp, id) => {
  let resultArr = []
  try {
    const newItem = await _sp.web.lists.getByTitle('ChangeRequestList').items.getById(id).update(itemData);
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
export const updateItem2 = async (itemData, _sp, id) => {
  let resultArr = []
  try {
    const newItem = await _sp.web.lists.getByTitle('ChangeRequestReasonDocumentCancellationList').items.getById(id).update(itemData);
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
export const updateItemChangeRequestReasonList = async (itemData, _sp, id) => {
  let resultArr = []
  try {
    const newItem = await _sp.web.lists.getByTitle('ChangeRequestReasonList').items.getById(id).update(itemData);
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
export const updateApprovalItem = async (itemData, _sp, id) => {
  let resultArr = []
  try {
    const newItem = await _sp.web.lists.getByTitle('ProcessApprovalList').items.getById(id).update(itemData);
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

export const getItemByID = async (_sp, id) => {
 
  let arr = []
  let arrs = []
  let bannerimg = []
  await _sp.web.lists.getByTitle("ChangeRequestDocumentCancellationList").items.getById(id)
  .select("*,Location/ID,Custodian/ID,DocumentType/ID,AmendmentType/ID,Classification/ID,ChangeRequestType/ID,Author/ID,Author/Title").expand("DocumentType,Custodian,Classification,AmendmentType,Location,ChangeRequestType,Author")()
    .then((res) => {
      console.log(res, ' let arrs=[]');      

       arr.push(res)
      // arr = res;
    })
    .catch((error) => {
      console.log("Error fetching data: ", error);
    });
  console.log(arr, 'arr');
  return arr;
}
export const getItemByIDCR = async (_sp, id) => {

  let arr = []
  let arrs = []
  let bannerimg = []

  await _sp.web.lists.getByTitle("ChangeRequestList").items.getById(id)
    .select("*,Location/ID,Custodian/ID,DocumentType/ID,AmendmentType/ID,Classification/ID,ChangeRequestType/ID,Author/ID,Author/Title").expand("DocumentType,Custodian,Classification,AmendmentType,Location,ChangeRequestType,Author")()
    .then((res) => {
      console.log(res, ' let arrs=[]');

      arr.push(res)
      // arr = res;
    })
    .catch((error) => {
      console.log("Error fetching data: ", error);
    });
  console.log(arr, 'arr');
  return arr;
}
export const getItemByID2 = async (sp, ChangeRequestID) => {
  debugger
  let arr = []
  let sampleDataArray = []
  arr = await sp.web.lists.getByTitle("ChangeRequestReasonDocumentCancellationList").items.select("*,ChangeRequestDCID/ID").expand("ChangeRequestDCID").filter(`ChangeRequestDCID/ID eq ${ChangeRequestID}`).getAll();
  // .then((res) => {
  //   arr = res
  //   console.log(arr, 'arr');
  // })
  return arr
}
export const getItemByIDChangeRequest = async (sp, ChangeRequestID) => {
  debugger
  let arr = []
  let sampleDataArray = []
  arr = await sp.web.lists.getByTitle("ChangeRequestReasonList").items.select("*,ChangeRequestID/ID").expand("ChangeRequestID").filter(`ChangeRequestID/ID eq ${ChangeRequestID}`).getAll();
  // .then((res) => {
  //   arr = res
  //   console.log(arr, 'arr');
  // })
  return arr
}
export const GetQueryString = (string) =>
  new URLSearchParams(window.location.search).get(string);

export const getApprovalByID = async (_sp, id,processName) => {
 
  let arr = []
  let arrs = []
  let bannerimg = []
  const currentUser = await _sp.web.currentUser();
  await _sp.web.lists.getByTitle("ProcessApprovalList").items.getById(id)
  .select("*,Author/ID,Author/Title,RequesterName/Id,RequesterName/Title,AssignedTo/Id,AssignedTo/Title").expand("Author,RequesterName,AssignedTo")()
    .then((res) => {
      console.log(res, ' let arrs=[]');
      if(res && res.AssignedTo.Id == currentUser.Id && res.ProcessName === processName ){
        arr = res;
      }
      // .filter(`AssignedTo/Id eq ${currentUser.Id} and ProcessName eq ${processName}`)

      //  arr.push(res)
   
    })
    .catch((error) => {
      console.log("Error fetching data: ", error);
    });
  console.log(arr, 'arr');
  return arr;
}
export const getApprovalByID2 = async (_sp, id,processName) => {
 
  let arr;
  let arrs = []
  let bannerimg = []
  const currentUser = await _sp.web.currentUser();
  await _sp.web.lists.getByTitle("ProcessApprovalList").items.getById(id)
  .select("*,Author/ID,Author/Title,RequesterName/Id,RequesterName/Title,AssignedTo/Id,AssignedTo/Title").expand("Author,RequesterName,AssignedTo")()
    .then((res) => {
      console.log(res, ' let arrs=[]');
      if(res && res.AssignedTo.Id == currentUser.Id && res.ProcessName === processName && (res.Status == "Pending" || res?.Status === "Save as draft") && res.Level === 0 && res.CurrentUserRole !=="OES" ){
        arr = false;
      }
      else{
        arr = true;
      }
      // .filter(`AssignedTo/Id eq ${currentUser.Id} and ProcessName eq ${processName}`)

      //  arr.push(res)
   
    })
    .catch((error) => {
      console.log("Error fetching data: ", error);
    });
  console.log(arr, 'arr');
  return arr;
}

export const getDataRoles = async (_sp) => {
 
  let arr = []
  let arrs = []
  let bannerimg = []
  await _sp.web.lists.getByTitle("ApproverRoleMaster").items
  .select("*")()
    .then((res) => {
      console.log(res, ' let arrs=[]');
     

      //  arr.push(res)
      arr = res;
    })
    .catch((error) => {
      console.log("Error fetching data: ", error);
    });
  console.log(arr, 'arr');
  return arr;
}

export const addApprovalItem = async (itemData, _sp) => {
 
  let resultArr = []
  try {
    const newItem = await _sp.web.lists.getByTitle('ProcessApprovalList').items.add(itemData);
 
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

export const addAllProcessItem = async (itemData, _sp) => {
 
  let resultArr = []
  try {
    const newItem = await _sp.web.lists.getByTitle('AllProcessApprovalLevelList').items.add(itemData);
 
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

export const UpdateAllProcessItem = async (itemData, _sp,id) => {
 
  let resultArr = []
  try {

    const newItem = await _sp.web.lists.getByTitle('AllProcessApprovalLevelList').items.getById(id).update(itemData);
    // console.log('Item  successfully:', newItem);
    resultArr = newItem
   
  } catch (error) {
    console.log('Error adding item:', error);
    // Handle errors appropriately
    resultArr = null
    Swal.fire(' Cancelled', '', 'error')
  }
  return resultArr;
};

export const getAllProcessData = async (_sp, MainId,processName,docCode) => {
 
  let arr;
 
  // const currentUser = await _sp.web.currentUser();
  await _sp.web.lists.getByTitle("AllProcessApprovalLevelList").items
  .select("*,Author/ID,Author/Title,Approvers/Id,Approvers/Title,ApproverRole/Id").expand("Author,Approvers,ApproverRole").filter(`MainListID eq '${MainId}' and ProcessName eq '${processName}' and RequestId eq '${docCode}'`)()
    .then((res) => {
    //   res.map((item) => ({
       
    // }));
    arr = res;
   
    })
    .catch((error) => {
      console.log("Error fetching data: ", error);
    });
  console.log(arr, 'arr');
  return arr;
}


export const getRequesterID = async (_sp) => {
 
  var reqId;
  await _sp.web.lists.getByTitle("RequesterRoleMaster").items
  .select("*").filter("Role eq 'Initiator' and IsActive eq 'Yes'")()
    .then((res) => {
      console.log(res, ' let arrs=[]');
     

      //  arr =(res[0].Id)
      // arr = res;
      reqId=res[0].Id
    })
    .catch((error) => {
      console.log("Error fetching data: ", error);
    });
  console.log(reqId, 'arr');
  return reqId;
}

export const getRequestTypeID = async (_sp) => {
 
  var reqId;
  await _sp.web.lists.getByTitle("RequestTypeMaster").items
  .select("*").filter("RequestType eq 'Document Cancellations' and IsActive eq 'Yes'")()
    .then((res) => {
      console.log(res, ' let arrs=[]');
     

      //  arr =(res[0].Id)
      // arr = res;
      reqId=res[0].Id
    })
    .catch((error) => {
      console.log("Error fetching data: ", error);
    });
  console.log(reqId, 'arr');
  return reqId;
}

export const getFormNameID = async (_sp,formname) => {
 
  var reqId;
  await _sp.web.lists.getByTitle("FormNameMaster").items
  .select("*").filter("FormName eq '"+formname+"'").top(1)()
    .then((res) => {
      console.log(res, ' let arrs=[]');
     

      //  arr =(res[0].Id)
      // arr = res;
      reqId=res[0].Id
    })
    .catch((error) => {
      console.log("Error fetching data: ", error);
    });
  console.log(reqId, 'arr');
  return reqId;
}
export const getListNameID = async (_sp,formname) => {
 
  var reqId;
  await _sp.web.lists.getByTitle("ListNameMaster").items
  .select("*").filter("ListName eq '"+formname+"'").top(1)()
    .then((res) => {
      console.log(res, ' let arrs=[]');
     

      //  arr =(res[0].Id)
      // arr = res;
      reqId=res[0].Id
    })
    .catch((error) => {
      console.log("Error fetching data: ", error);
    });
  console.log(reqId, 'arr');
  return reqId;
}

export const getDocumentLinkByID = async (_sp,itemId) => {
 
  var reqId;
  await _sp.web.lists.getByTitle("ChangeRequestDocs").items.getById(itemId)
  .select("*,FileRef, FileLeafRef")()
    .then((res) => {
      console.log(res, ' let arrs=[]');
     

      //  arr =(res[0].Id)
      // arr = res;
      reqId=res
    })
    .catch((error) => {
      console.log("Error fetching data: ", error);
    });
  console.log(reqId, 'arr');
  return reqId;
}