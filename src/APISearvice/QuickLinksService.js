import Swal from 'sweetalert2';
export const getQuickLinkList = async (_sp,isSuperAdmin) => {
    let arr = []
    const currentUser = await _sp.web.currentUser();
 
//   if (isSuperAdmin == "Yes") {
    await _sp.web.lists.getByTitle("QuickLinks").items.select("*").orderBy("Created",false).getAll()
        .then((res) => {
            
            arr = res;
        })
        .catch((error) => {
            console.log("Error fetching data: ", error);
        });
    //   }
    //   else{
    //     await _sp.web.lists.getByTitle("ARGDelegateList")
    //     .items
    //     .select("*,Author/ID,Author/Title,Author/EMail,DelegateName/ID,DelegateName/Title,DelegateName/EMail,ActingFor/ID,ActingFor/Title,ActingFor/EMail").expand("Author,DelegateName,ActingFor")
    //     .filter(`AuthorId eq '${currentUser.Id}'`)
    //     .orderBy("Created",false).getAll()
    //     .then((res) => {
    //         // console.log(res);
    //         arr = res;
    //     })
    //     .catch((error) => {
    //         console.log("Error fetching data: ", error);
    //     });
    //   }
    return arr;
}


export const DeleteQuickLink = async (_sp, id) => {
    let resultArr = []
    try {
        const newItem = await _sp.web.lists.getByTitle('QuickLinks').items.select("*").getById(id).delete();
        // console.log('Item added successfully:', newItem);
        resultArr = newItem
        // Perform any necessary actions after successful addition
    } catch (error) {
        // console.log('Error adding item:', error);
        // Handle errors appropriately
        resultArr = null
    }
    return resultArr;
}

export const addItem = async (itemData, _sp) => {

  let resultArr = []
  try {
    const newItem = await _sp.web.lists.getByTitle('QuickLinks').items.add(itemData);

    // console.log('Item added successfully:', newItem);

    resultArr = newItem
    // Perform any necessary actions after successful addition
  } catch (error) {
    // console.log('Error adding item:', error);
    Swal.fire(' Cancelled', '', 'error')
    // Handle errors appropriately
    resultArr = null
  }
  return resultArr;
};

export const getItemByID = async (_sp, id) => {
  
  let arr = []
  let arrs = []
  let bannerimg = []
  await _sp.web.lists.getByTitle("QuickLinks").items.getById(id)
  .select("*")()
    .then((res) => {
      console.log(res, ' let arrs=[]');
      const bannerimgobject = res.QuickLinkImage != "{}" && JSON.parse(res.QuickLinkImage)
      console.log(bannerimgobject[0], 'bannerimgobject');

      bannerimg.push(bannerimgobject);
      const parsedValues = {
        ID:res?.ID,
        Title: res.Title != undefined ? res.Title : "",
        URL: res.URL != undefined ? res.URL : "",
        RedirectToNewTab: res.RedirectToNewTab != undefined ? res.RedirectToNewTab : "",
       
        QuickLinkImage: bannerimg,
       
        // other fields as needed
      };

      arr.push(parsedValues)

      // arr.push(res)
    })
    .catch((error) => {
      console.log("Error fetching data: ", error);
    });
//   console.log(arr, 'arr');
  return arr;
}


export const updateItem = async (itemData, _sp, id) => {
    let resultArr = []
    try {
      const newItem = await _sp.web.lists.getByTitle('QuickLinks').items.getById(id).update(itemData);
    //   console.log('Item added successfully:', newItem);
      resultArr = newItem
      // Perform any necessary actions after successful addition
    } catch (error) {
      console.log('Error adding item:', error);
      // Handle errors appropriately
      resultArr = null
    }
    return resultArr;
  };

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
      "name": file.name,
      "size":file.size,
      "serverUrl": siteUrl,
      "fileUrl":file.fileUrl,
      "fieldName": "BlogBannerImage",
      "serverRelativeUrl": fileUrl
    };
    return arr;
  };