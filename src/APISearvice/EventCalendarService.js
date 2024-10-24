export const fetchEventdata = async (_sp) => {
    let arr = []
   
       await _sp.web.lists.getByTitle("ARGEventMaster").items.select("*,Attendees/Id,Attendees/Title,Attendees/EMail").expand("Attendees").getAll().then((res) => {
        console.log(res);
     
        //res.filter(x=>x.Category?.Category==str)
        arr = res;
      })
      .catch((error) => {
        console.log("Error fetching data: ", error);
      });
    return arr;
  }