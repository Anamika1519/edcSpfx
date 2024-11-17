export const fetchEventdata = async (_sp) => {
    let arr = []
   
       await _sp.web.lists.getByTitle("ARGEventMaster")
       .items.select("*,Attendees/Id,Attendees/Title,Attendees/EMail")
       .expand("Attendees")
       .filter("Status eq 'Approved'")
       .orderBy("Created",false)       
       ().then((res) => {
        console.log(res);
     
    
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
   
        
        const filteredEvents = res.filter(event => {
            const eventDate = new Date(event.EventDate);
            return eventDate >= today;
        });
   
        console.log(filteredEvents , "filteredEvents");
          
           arr = filteredEvents;
         })
         .catch((error) => {
           console.log("Error fetching data: ", error);
         });
    return arr;
  }