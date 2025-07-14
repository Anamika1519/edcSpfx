export const fetchEventdata = async (_sp) => {
  let arr = [];
  const userProfile = await _sp.profiles.myProperties();
  // console.log("***userProfile", userProfile);
  const currentUserDept = userProfile.UserProfileProperties ? userProfile.UserProfileProperties[userProfile.UserProfileProperties.findIndex(obj => obj.Key === "Department")].Value : "";
  let entity = "Global";
  const today = new Date();
      today.setHours(0, 0, 0, 0); 
     await _sp.web.lists.getByTitle("ARGEventMaster")
     .items.select("*,Attendees/Id,Attendees/Title,Attendees/EMail,Entity/Entity,Entity/ADDepartmentName,Entity/ID")
     .expand("Attendees,Entity")
     .filter(`(Entity/ADDepartmentName eq '${entity}' or Entity/ADDepartmentName eq '${currentUserDept}') and Status eq 'Approved'`)
     .orderBy("EventDate",true)      
     ().then((res) => {
      console.log(res);
   
  
     
 
      
      const filteredEvents = res.filter(event => {
          const eventDate = new Date(event.EventDate);
          return eventDate >= today ;
      });
 
      console.log(filteredEvents , "filteredEvents");
        
         arr = filteredEvents;
       })
       .catch((error) => {
         console.log("Error fetching data: ", error);
       });
  return arr;
}