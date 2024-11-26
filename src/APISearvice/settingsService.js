
export const getSettingAPI = async (_sp) => {
    let arr =[]
   await _sp.web.lists.getByTitle("Settings").items.select("Title,ID,ImageIcon,LinkUrl, EnableAudienceTargeting,Audience/Title,Category").expand("Audience").filter("IsActive eq 'Yes' and Category eq 'Manage Content'").orderBy("Order", true)()
    .then((res) => {
        console.log("Responce of data for get setting:",res);
        arr= res;
    })
    .catch((error) => {
        console.log("Error fetching data: ", error);
    });
    return arr;
}
export const getSettingAPImanagemaster = async (_sp) => {
    let arr =[]
   await _sp.web.lists.getByTitle("Settings").items.select("Title,ID,ImageIcon,LinkUrl, EnableAudienceTargeting,Audience/Title, Category").expand("Audience").filter("IsActive eq 'Yes' and Category eq 'Manage Master'").orderBy("Order", true)()
    .then((res) => {
        console.log("Responce of data for get master:",res);
        arr= res;
    })
    .catch((error) => {
        console.log("Error fetching data: ", error);
    });
    return arr;
}