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
  export const addItem = async (itemData, _sp) => {
    debugger
    let resultArr = []
    try {
      const newItem = await _sp.web.lists.getByTitle('ARGBusinessApps').items.add(itemData);
      debugger
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
  export const getCategory = async (_sp, id) => {
    let arr = []
    await _sp.web.lists.getByTitle("BusinessAppsCategory").items.select("ID,CategoryName").expand("").filter(`(Active eq 1) and(AnnouncementandNewsTypeMaster/ID eq ${id})`)()
      .then((res) => {
        console.log(res);
        const newArray = res.map(({ ID, CategoryName }) => ({ id: ID, name: CategoryName }));
        console.log(newArray, 'newArray');
  
        arr = newArray;
      })
      .catch((error) => {
        console.log("Error fetching data: ", error);
      });
    return arr;
  }
  export const fetchAutomationCategory = async (_sp) => {
    let arr = []
   
       await _sp.web.lists.getByTitle("BusinessAppsCategory").items.getAll().then((res) => {
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
   
       await _sp.web.lists.getByTitle("ARGBusinessApps").items.select("*,Category/Id,Category/CategoryName").expand("Category").getAll().then((res) => {
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
    //Add Business Apps
    export const updateItem = async (itemData, _sp, id) => {
      let resultArr = []
      try {
        const newItem = await _sp.web.lists.getByTitle('ARGBusinessApps').items.getById(id).update(itemData);
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
  
    export const uploadFileToLibrary = async (file, sp, docLib) => {
      debugger
      let arrFIleData = [];
      let fileSize=0
      try {
        const result = await sp.web.lists.getByTitle(docLib).rootFolder.files.addChunked(file.name, file,
    
          // const result = await sp.web.lists.getByTitle(docLib).rootFolder.files.addChunked(
          // file.name,
          // file,
          (progress, data) => {
            console.log(progress, data);
            fileSize=progress.fileSize
          },
          true
        );
    
        const item = await sp.web.getFileByServerRelativePath(result.data.ServerRelativeUrl).getItem("*","ID", "AuthorId", "Modified")
        console.log(item.Id, 'itemitem');
        let arr = {
          ID: item.Id,
          Createdby: item.AuthorId,
          Modified: item.Modified,
          fileUrl: result.data.ServerRelativeUrl,
          fileSize:fileSize,
          fileType:file.type,
          fileName:file.name,
        }
        arrFIleData.push(arr)
        console.log(arrFIleData);
    
        return arrFIleData;
      } catch (error) {
        console.log("Error uploading file:", error);
        return null; // Or handle error differently
      }
    };
    export const uploadFile = async (file, sp, docLib, siteUrl) => {
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
        "fieldName": "Image",
        "serverRelativeUrl": fileUrl
      };
      return arr;
    };
    export const getBusinessAppsByID = async (_sp, id) => {
      debugger
      let arr = []
      let arrs = []
      await _sp.web.lists.getByTitle("ARGMediaGallery").items.getById(id).select("*,EntityMaster/Id,EntityMaster/Entity,MediaGalleryCategory/Id,MediaGalleryCategory/CategoryName").expand("EntityMaster,MediaGalleryCategory")()
          .then((res) => {
              console.log(res, ' let arrs=[]');
                   const parsedValues= {
                    Title: res.Title,
                    ID:res.ID,
                    entity: res.EntityMaster?.Id,
                    Image: res.Image,
                    MediaGalleriesId:res?.MediaGalleriesId,
                    MediaGalleryJSON:res?.MediaGalleryJSON,
                    Category:res?.MediaGalleryCategory?.Id
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
    export const getUrl = async (sp,siteUrl) => {
      let srt = siteUrl;
    let dynamicPart = "/sites/";
    let UrlArr=[];
    try {
        let index = srt.lastIndexOf(dynamicPart); // Find the last occurrence of "/sites/"
    
        if (index !== -1) {
            let endIndex = srt.indexOf("/", index + dynamicPart.length) !== -1
                ? srt.indexOf("/", index + dynamicPart.length)
                : srt.length;
    
            let updatedStr = srt.slice(0, index) + srt.slice(endIndex);
            console.log(updatedStr,'updatedStr'); 
            const url = await sp.web.currentUser.getContextInfo();
            console.log(url, 'res');
          
           let UrlArr1=
            {
              DomainUrl:updatedStr,
              WebFullUrl:url.WebFullUrl
          
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
    export const ARGBusinessAppCategory =async (sp)=>
      {
        debugger
        let arr = []
        let arrs = []
        await sp.web.lists.getByTitle("BusinessAppsCategory").items.orderBy("Created",false).getAll().then((res) => {
                console.log(res, 'Resss');
              
                 arrs = res
                  console.log(arrs, 'arr');
            })
            .catch((error) => {
                console.log("Error fetching data: ", error);
            });
        console.log(arrs, 'arr');
        return arrs;
      }
  
    //End
    //Business apps Master
    export const getBusinessApps = async (_sp) => {
      let arr = []
         let str ="Announcements"
      await _sp.web.lists.getByTitle("ARGBusinessApps")
      .items.select("*,EntityMaster/ID,EntityMaster/Entity,Category/ID,Category/CategoryName").expand("EntityMaster,Category").orderBy("Created",false).getAll()
        .then((res) => {
          console.log(res);
       
          //res.filter(x=>x.Category?.Category==str)
          arr = res;
        })
        .catch((error) => {
          console.log("Error fetching data: ", error);
        });
      return arr;
    }
    export const DeleteBusinessAppsAPI = async (_sp, id) => {
      let resultArr = []
      try {
        const newItem = await _sp.web.lists.getByTitle('ARGBusinessApps').items.getById(id).delete();
        console.log('Item deleted successfully:', newItem);
        resultArr = newItem
        // Perform any necessary actions after successful addition
      } catch (error) {
        console.log('Error adding item:', error);
        // Handle errors appropriately
        resultArr = null
      }
      return resultArr;
    }
    //End
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