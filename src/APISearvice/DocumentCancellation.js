import Swal from 'sweetalert2';
export const getAllDocumentCode = async (_sp) => {
  let arr = [];

  await _sp.web.lists.getByTitle("ChangeRequestList").items
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

export const addItem2 = async (itemData, _sp) => {
 
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

export const updateItem2 = async (itemData, _sp, id) => {
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

export const getItemByID = async (_sp, id) => {
 
  let arr = []
  let arrs = []
  let bannerimg = []
  await _sp.web.lists.getByTitle("ChangeRequestDocumentCancellationList").items.getById(id)
  .select("*,Location/ID,Custodian/ID,DocumentType/ID,AmendmentType/ID,Classification/ID,ChangeRequestType/ID,Author/ID,Author/Title").expand("DocumentType,Custodian,Classification,AmendmentType,Location,ChangeRequestType,Author")()
    .then((res) => {
      console.log(res, ' let arrs=[]');
      // const bannerimgobject = res.AnnouncementandNewsBannerImage != "{}" && JSON.parse(res.AnnouncementandNewsBannerImage)
      // console.log(bannerimgobject[0], 'bannerimgobject');

      // bannerimg.push(bannerimgobject);
      // const parsedValues = {
      //   Title: res.Title != undefined ? res.Title : "",
      //   description: res.Description != undefined ? res.Description : "",
      //   overview: res.Overview != undefined ? res.Overview : "",
      //   IsActive: res.IsActive,
      //   ID: res.ID,
      //   BannerImage: bannerimg,
      //   TypeMaster: res?.AnnouncementandNewsTypeMaster?.ID != undefined ? res.AnnouncementandNewsTypeMaster?.ID : "",
      //   Category: res.Category?.ID != undefined ? res.Category?.ID : "",
      //   Entity: res.Entity?.ID != undefined ? res.Entity?.ID : "",
      //   FeaturedAnnouncement: res.FeaturedAnnouncement,
      //   AnnouncementAndNewsGallaryJSON: res.AnnouncementAndNewsGallaryJSON != null ? JSON.parse(res.AnnouncementAndNewsGallaryJSON) : "",
      //   AnnouncementAndNewsDocsJSON: res.AnnouncementAndNewsDocsJSON != null ? JSON.parse(res.AnnouncementAndNewsDocsJSON) : "",
      //   AnnouncementAndNewsGallaryId: res.AnnouncementAndNewsGallaryId,
      //   AnnouncementsAndNewsDocsId: res.AnnouncementsAndNewsDocsId,
      //   Status:res.Status,
      //   EntityName:res.Entity!= undefined ? res.Entity?.Entity : "",
      //   // other fields as needed
      // };

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
  arr = await sp.web.lists.getByTitle("ChangeRequestReasonList").items.select("*,ChangeRequestID/ID").expand("ChangeRequestID").filter(`ChangeRequestID/ID eq ${ChangeRequestID}`).getAll();
  // .then((res) => {
  //   arr = res
  //   console.log(arr, 'arr');
  // })
  return arr
}
