import Swal from 'sweetalert2';
export const getDynamicBanner = async (_sp,isSuperAdmin) => {
    let arr = []
    const currentUser = await _sp.web.currentUser();
 
  if (isSuperAdmin == "Yes") {
    await _sp.web.lists.getByTitle("DynamicBanners").items.select("*,Author/ID,Entity/Entity,Entity/ID").expand("Author,Entity").orderBy("Created",false).getAll()
        .then((res) => {
            console.log(res);
            arr = res;
        })
        .catch((error) => {
            console.log("Error fetching data: ", error);
        });
      }else{
        await _sp.web.lists.getByTitle("DynamicBanners")
        .items
        .select("*,Author/ID,Entity/Entity,Entity/ID").expand("Author,Entity")
        .filter(`AuthorId eq '${currentUser.Id}'`)
        .orderBy("Created",false).getAll()
        .then((res) => {
            console.log(res);
            arr = res;
        })
        .catch((error) => {
            console.log("Error fetching data: ", error);
        });
      }
    return arr;
}
export const DeleteBannerAPI = async (_sp, id) => {
    let resultArr = []
    try {
        const newItem = await _sp.web.lists.getByTitle('DynamicBanners').items.getById(id).delete();
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

export const getBannerByID = async (_sp, id) => {
    
    let arr = []
    let arrs = []
    await _sp.web.lists.getByTitle("DynamicBanners").items.getById(id).select("EntityId","ID","Title","URL","IsImage","BannerImage","Description","BannerImageJSON")()
        .then((res) => {
            console.log(res, ' let arrs=[]');
                 const parsedValues= {
                  title: res.Title,
                  description: res.Description,
                  BannerImage: res.BannerImage,
                  URL: res.URL,
                  IsImage:res.IsImage==true?"on":"off",
                  IsVedio:res.IsImage==true?"on":"off",
                  ID:res.ID,
                  Status:res.Status,
                  EntityId:res.EntityId
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

export const addItem = async (itemData, _sp) => {
    
    let resultArr = []
    try {
        const newItem = await _sp.web.lists.getByTitle('DynamicBanners').items.add(itemData);
        
        console.log('Item added successfully:', newItem);
        Swal.fire('Submitted successfully.', '', 'success');

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
export const updateItem = async (itemData,_sp,id) => {
    let resultArr=[]
    try {
      const newItem = await _sp.web.lists.getByTitle('DynamicBanners').items.getById(id).update(itemData);
      Swal.fire('Submitted successfully.', '', 'success');
      resultArr=newItem
      // Perform any necessary actions after successful addition
    } catch (error) {
      console.log('Error adding item:', error);
      Swal.fire(' Cancelled', '', 'error')
      // Handle errors appropriately
      resultArr =null
    }
  return resultArr;
  };
 
export const uploadFile = async (file, sp, docLib, siteUrl) => {
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
      "fileName": file.name,
      "serverUrl": siteUrl,
      "fieldName": "BannerImage",
      "serverRelativeUrl": fileUrl
    };
    return arr;
  };
  export const getUrl = async (sp) => {
    
    const url = await sp.web.currentUser.getContextInfo();
    console.log(url.WebFullUrl, 'WebFullUrl');
    return url.WebFullUrl
  }