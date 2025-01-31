export const fetchMediaGallerycategory = async (_sp) => {
  let arr = []
 
     await _sp.web.lists.getByTitle("ARGMediaGalleryCategory").items.getAll().then((res) => {
      console.log(res);
   
      //res.filter(x=>x.Category?.Category==str)
      arr = res;
    })
    .catch((error) => {
      console.log("Error fetching data: ", error);
    });
  return arr;
}
export const fetchKnowledgeCentercategory = async (_sp) => {
  let arr = []

  await _sp.web.lists.getByTitle("ARGKnowledgeCenterCategory").items.getAll().then((res) => {
    console.log(res);

    //res.filter(x=>x.Category?.Category==str)
    arr = res;
  })
    .catch((error) => {
      console.log("Error fetching data: ", error);
    });
  return arr;
}
export const fetchMediaGallerydata = async (_sp) => {
  const userProfile = await _sp.profiles.myProperties();
// console.log("***userProfile", userProfile);
const currentUserDept = userProfile.UserProfileProperties ? userProfile.UserProfileProperties[userProfile.UserProfileProperties.findIndex(obj => obj.Key === "Department")].Value : "";
let entity ="Global";
    let arr = []
   
       await _sp.web.lists.getByTitle("QuickLinks").items.select("*,Entity/Entity,Entity/ID")
       .expand("Entity").filter(`(Entity/Entity eq '${entity}' or Entity/Entity eq '${currentUserDept}') and IsActive eq 1`).top(10)
       //.filter("Status eq 'Approved'")
       .orderBy("Modified", false)
       ().then((res) => {
        console.log("response-->>>",res);
     
        //res.filter(x=>x.Category?.Category==str)
        arr = res;
      })
      .catch((error) => {
        console.log("Error fetching data: ", error);
      });
    return arr;
  }

  export const fetchMediaGalleryInsideData = async (_sp, Id) => {
    let arr = [];
  
    // Fetch data from the SharePoint list
    await _sp.web.lists
      .getByTitle("ARGMediaGallery")
      .items
      .select("*,MediaGalleryCategory/Id,MediaGalleryCategory/CategoryName")
      .expand("MediaGalleryCategory")
      .filter(`Id eq ${Id}`).orderBy("Created",false) // Filter based on the main Id
      .getAll()
      .then((res) => {
        if (res.length > 0) {
          const item = res[0]; // Assuming the result contains one item
          console.log("Main Item:", item);
  
          // Parse the MediaGalleryJSON field
          const mediaGalleryJSON = JSON.parse(item.MediaGalleryJSON);
  
          // Now, filter or process the parsed data (for example, filter by file type or other criteria)
          // const filteredData = mediaGalleryJSON.filter(media => media.fileType === "image/png"); // Example filter
  
          console.log("Filtered MediaGalleryJSON Data:", mediaGalleryJSON);
          arr = mediaGalleryJSON; // Store the filtered data
        }
      })
      .catch((error) => {
        console.log("Error fetching data: ", error);
      });
  
    return arr;
  };
  
  export const fetchARGKnowledgeCenterdata = async (_sp) => {
    let arr = []
  
    await _sp.web.lists.getByTitle("ARGKnowledgeCenter").items.select("*,MediaGalleryCategory/Id,MediaGalleryCategory/CategoryName")
      .expand("MediaGalleryCategory")
      .filter("Status eq 'Approved'")
      .orderBy("Modified", false)
      ().then((res) => {
        console.log("response-->>>", res);
  
        //res.filter(x=>x.Category?.Category==str)
        arr = res;
      })
      .catch((error) => {
        console.log("Error fetching data: ", error);
      });
    return arr;
  }
  
  export const fetchARGKnowledgeCenterInsideData = async (_sp, Id) => {
    let arr = [];
  
    // Fetch data from the SharePoint list
    await _sp.web.lists
      .getByTitle("ARGKnowledgeCenter")
      .items
      .select("*,MediaGalleryCategory/Id,MediaGalleryCategory/CategoryName")
      .expand("MediaGalleryCategory")
      .filter(`Id eq ${Id}`).orderBy("Created", false) // Filter based on the main Id
      .getAll()
      .then((res) => {
        if (res.length > 0) {
          const item = res[0]; // Assuming the result contains one item
          console.log("Main Item:", item);
  
          // Parse the MediaGalleryJSON field
          const mediaGalleryJSON = JSON.parse(item.MediaGalleryJSON);
  
          // Now, filter or process the parsed data (for example, filter by file type or other criteria)
          // const filteredData = mediaGalleryJSON.filter(media => media.fileType === "image/png"); // Example filter
  
          console.log("Filtered MediaGalleryJSON Data:", mediaGalleryJSON);
          arr = mediaGalleryJSON; // Store the filtered data
        }
      })
      .catch((error) => {
        console.log("Error fetching data: ", error);
      });
  
    return arr;
  };
  
  export const fetchDynamicdata = async (_sp) => {
    let arr = [];
    const userProfile = await _sp.profiles.myProperties();
// console.log("***userProfile", userProfile);
const currentUserDept = userProfile.UserProfileProperties ? userProfile.UserProfileProperties[userProfile.UserProfileProperties.findIndex(obj => obj.Key === "Department")].Value : "";
let entity ="Global";
   
    await _sp.web.lists.getByTitle("DynamicBanners").items.select("*,Entity/Entity,Entity/ID").expand("Entity").filter(`(Entity/Entity eq '${entity}' or Entity/Entity eq '${currentUserDept}')`).orderBy('Created', false).top(5).getAll().then((res) => {
      console.log(res);
   
      //res.filter(x=>x.Category?.Category==str)
      arr = res.slice(0,5);
      })
      .catch((error) => {
        console.log("Error fetching data: ", error);
      });
    return arr;
  }
