import Swal from 'sweetalert2';
export const getKnowledgeCenter = async (_sp, isSuperAdmin) => {
    let arr = []
    const currentUser = await _sp.web.currentUser();
    
    //if (isSuperAdmin == "yes") {
      await _sp.web.lists.getByTitle("ARGKnowledgeCenter")
        .items.select("*,Author/EMail,Author/Title,Author/ID").expand("Author")
        .orderBy("Created", false).getAll()
        .then((res) => {
          console.log(res);
  
          //res.filter(x=>x.Category?.Category==str)
          arr = res;
        })
        .catch((error) => {
          console.log("Error fetching data: ", error);
        });
    // } else {
    //   await _sp.web.lists.getByTitle("ARGKnowledgeCenter")
    //     .items.select("*,Author/EMail,Author/Title,Author/ID").expand("Author")
    //     //.filter(`AuthorId eq '${currentUser.Id}'`)
    //     .orderBy("Created", false).getAll()
    //     .then((res) => {
    //       console.log(res);
  
    //       //res.filter(x=>x.Category?.Category==str)
    //       arr = res;
    //     })
    //     .catch((error) => {
    //       console.log("Error fetching data: ", error);
    //     });
    // }
    return arr;
  }
  export const addItemKnowledge = async (itemData, _sp) => {
    let resultArr = []
    try {
      const newItem = await _sp.web.lists.getByTitle('ARGKnowledgeCenter').items.add(itemData);
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
  export const updateItemKnowledge = async (itemData, _sp, id) => {
    let resultArr = []
    try {
      const newItem = await _sp.web.lists.getByTitle('ARGKnowledgeCenter').items.getById(id).update(itemData);
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
  export const DeleteKnowledgecenterAPI = async (_sp, id) => {
    let resultArr = []
    try {
      const newItem = await _sp.web.lists.getByTitle('ARGKnowledgeCenter').items.getById(id).delete();
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
  export const ARGKnowledgeCenterCategory = async (sp) => {
    debugger
    let arr = []
    let arrs = []
    await sp.web.lists.getByTitle("ARGKnowledgeCenterCategory").items.orderBy("Created", false).getAll().then((res) => {
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
  export const fetchARGKnowledgeCenterdata = async (_sp) => {
    let arr = []
  
    await _sp.web.lists.getByTitle("ARGKnowledgeCenter").items.select("*,MediaGalleryCategory/Id,MediaGalleryCategory/CategoryName")
      .expand("MediaGalleryCategory")
      //.filter("Status eq 'Approved'")
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