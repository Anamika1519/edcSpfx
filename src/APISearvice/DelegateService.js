import Swal from 'sweetalert2';
export const getDelegateList = async (_sp,isSuperAdmin) => {
    let arr = []
    const currentUser = await _sp.web.currentUser();
 
  if (isSuperAdmin == "Yes") {
    await _sp.web.lists.getByTitle("ARGDelegateList").items.select("*,DelegateName/ID,DelegateName/Title,DelegateName/EMail,ActingFor/ID,ActingFor/Title,ActingFor/EMail").expand("ActingFor,DelegateName").orderBy("Created",false).getAll()
        .then((res) => {
            // console.log(res);
            arr = res;
        })
        .catch((error) => {
            console.log("Error fetching data: ", error);
        });
      }else{
        await _sp.web.lists.getByTitle("ARGDelegateList")
        .items
        .select("*,Author/ID,Author/Title,Author/EMail,DelegateName/ID,DelegateName/Title,DelegateName/EMail,ActingFor/ID,ActingFor/Title,ActingFor/EMail").expand("Author,DelegateName,ActingFor")
        .filter(`AuthorId eq '${currentUser.Id}'`)
        .orderBy("Created",false).getAll()
        .then((res) => {
            // console.log(res);
            arr = res;
        })
        .catch((error) => {
            console.log("Error fetching data: ", error);
        });
      }
    return arr;
}
export const DeleteDelegateAPI = async (_sp, id) => {
    let resultArr = []
    try {
        const newItem = await _sp.web.lists.getByTitle('ARGDelegateList').items.select("*,DelegateName/ID,DelegateName/Title,DelegateName/EMail,ActingFor/ID,ActingFor/Title,ActingFor/EMail").expand("ActingFor,DelegateName").getById(id).delete();
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
    const newItem = await _sp.web.lists.getByTitle('ARGDelegateList').items.add(itemData);

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


export const getDelegateByID = async (_sp, id) => {
  
  let arr = []
  let arrs = []
  let bannerimg = []
  await _sp.web.lists.getByTitle("ARGDelegateList").items.getById(id)
  .select("*,DelegateName/ID,DelegateName/Title,DelegateName/EMail,ActingFor/ID,ActingFor/Title,ActingFor/EMail").expand("ActingFor,DelegateName")()
    .then((res) => {
    //   console.log(res, ' let arrs=[]');
    //   const bannerimgobject = res.AnnouncementandNewsBannerImage != "{}" && JSON.parse(res.AnnouncementandNewsBannerImage)
    //   console.log(bannerimgobject[0], 'bannerimgobject');

    //   bannerimg.push(bannerimgobject);
      const parsedValues = {
        ID:res.ID,
        StartDate: res.StartDate != undefined ? res.StartDate : "",
        EndDate: res.EndDate != undefined ? res.EndDate : "",
        Status: res.Status != undefined ? res.Status : "",
       
        DelegateName: res.DelegateName != undefined ? res.DelegateName : "",
        ActingFor: res.ActingFor != undefined ? res.ActingFor : "",
       
        
        // other fields as needed
      };

      arr.push(parsedValues)
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
      const newItem = await _sp.web.lists.getByTitle('ARGDelegateList').items.getById(id).update(itemData);
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