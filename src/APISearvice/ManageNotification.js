import Swal from 'sweetalert2';
export const getAllModuleListMaster = async (_sp) => {
  let arr = []
  // let str = "Announcements"
  await _sp.web.lists.getByTitle("ARGModuleList").items.select("*").orderBy("Created",false).filter(`IsActive eq 1`).getAll()
    .then((res) => {
      // console.log("ARGModuleList:",res);

      //res.filter(x=>x.Category?.Category==str)
      arr = res;
    })
    .catch((error) => {
      console.log("Error fetching data: ", error);
    });
  return arr;
}

export const getAllNotificationConfigMaster = async (_sp, currentUser) => {
  let arr1 = []
  // let str = "Announcements"
  await _sp.web.lists.getByTitle("UserNotificationConfigurationList").items.select("*,UserName/Id,UserName/Title,UserName/EMail,Modules/ModuleName,Modules/ID").expand("UserName,Modules").orderBy("Created",false).filter(`UserName/Id eq `+currentUser).getAll()
    .then((res) => {
      // console.log("ARGModuleList:",res);

      //res.filter(x=>x.Category?.Category==str)
      arr1= res;
    })
    .catch((error) => {
      console.log("Error fetching data: ", error);
    });
  return arr1;
}

export const addItem = async (itemData, _sp) => {
  let resultArr = []
  try {
    const newItem = await _sp.web.lists.getByTitle('UserNotificationConfigurationList').items.add(itemData);
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
    const newItem = await _sp.web.lists.getByTitle('UserNotificationConfigurationList').items.getById(id).update(itemData);
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