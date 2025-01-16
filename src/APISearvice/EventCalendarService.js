export const fetchEventdata = async (_sp) => {
  let arr = []
  const today = new Date();
      today.setHours(0, 0, 0, 0); 
     await _sp.web.lists.getByTitle("ARGEventMaster")
     .items.select("*,Attendees/Id,Attendees/Title,Attendees/EMail")
     .expand("Attendees")
     .filter(`Status eq 'Approved'`)
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