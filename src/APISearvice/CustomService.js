import { forEach } from 'lodash';
import Swal from 'sweetalert2';
export const getEntity = async (_sp) => {
    let arr =[]
   await _sp.web.lists.getByTitle("ARGEntityMaster").items.select("ID,Entity").filter("Active eq 1")()
    .then((res) => {
        console.log(res);
        const newArray = res.map(({ ID, Entity }) => ({ id:ID, name:Entity }));
        console.log(newArray,'newArray');

        arr= newArray;
    })
    .catch((error) => {
        console.log("Error fetching data: ", error);
    });
    return arr;
}
export const getCategory = async (_sp,id) => {
    let arr =[]
   await _sp.web.lists.getByTitle("ARGAnnouncementsandNewsCategory").items.select("ID,Category,AnnouncementandNewsTypeMaster/TypeMaster,AnnouncementandNewsTypeMaster/ID").expand("AnnouncementandNewsTypeMaster").filter(`(Active eq 1) and(AnnouncementandNewsTypeMaster/ID eq ${id})`)()
    .then((res) => {
        console.log(res);
        const newArray = res.map(({ ID, Category }) => ({ id:ID, name:Category }));
        console.log(newArray,'newArray');

        arr= newArray;
    })
    .catch((error) => {
        console.log("Error fetching data: ", error);
    });
    return arr;
}
export const getType = async (_sp) => {
    let arr =[]
   await _sp.web.lists.getByTitle("AnnouncementandNewTypeMaster").items.select("ID,TypeMaster")()
    .then((res) => {
        console.log(res);
        const newArray = res.map(({ ID, TypeMaster }) => ({ id:ID, name:TypeMaster }));
        console.log(newArray,'newArray');

        arr= newArray;
    })
    .catch((error) => {
        console.log("Error fetching data: ", error);
    });
    return arr;
}


export const getChoiceFieldOption = async (_sp,listName,fieldName) => {
    let arr =[]
    const field2 =  await _sp.web.lists.getByTitle(listName).fields.getByInternalNameOrTitle(fieldName)()
    console.log(field2,'field2');
   
    arr= field2["Choices"]
 
    return arr;
}

export const getCurrentUser = async (_sp,siteUrl) => {
    let arr =[]
   await _sp.web.currentUser()
    .then(async (res) => {
        console.log(res);
       
        arr= res;
         const  ProfilePic=  `${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${res.Email}`
       //await getUserProfilePicture(res.Id,_sp)
    })
    .catch((error) => {
        console.log("Error fetching data: ", error);
    });
    return arr;
}


export const getCurrentUserProfile = async (_sp,siteUrl) => {
    const ProfilePic =[]
   await _sp.web.currentUser()
    .then(async (res) => {
        console.log(res);
       
     //   arr= res;
         ProfilePic=  `${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${res.Email}`
       //await getUserProfilePicture(res.Id,_sp)
    })
    .catch((error) => {
        console.log("Error fetching data: ", error);
    });
    return ProfilePic;
}

export const getCurrentUserName = async (_sp) => {
    let arr =""
   await _sp.web.currentUser()
    .then((res) => {
        console.log(res);
    
        arr= res["Title"];
        
    })
    .catch((error) => {
        console.log("Error fetching data: ", error);
    });
    return arr;
}
export const getCurrentUserNameId = async (_sp) => {
    let arr =0;
   await _sp.web.currentUser()
    .then((res) => {
        console.log(res);
    
        arr= res["Id"];
        
    })
    .catch((error) => {
        console.log("Error fetching data: ", error);
    });
    return arr;
}
export async function getUserProfilePicture(authorId,sp) {
    try {
      // Get user information by ID
      const user = await sp.web.getUserById(authorId)();
  
      if (user) {
        // The 'Picture' field holds the profile picture URL
        const profilePictureUrl = `${user.PictureUrl}`;
        console.log(profilePictureUrl,'profilePictureUrl');
        
        return profilePictureUrl;
      }
      return null;
    } catch (error) {
      console.log("Error fetching profile picture:", error);
      return null;
    }
  }

  export const getCurrentUserProfileEmail = async (sp) => {
    const Email =""
   await sp.web.currentUser()
    .then(async (res) => {
        console.log(res);
       
     //   arr= res;
         Email=  res.Email;
       //await getUserProfilePicture(res.Id,_sp)
    })
    .catch((error) => {
        console.log("Error fetching data: ", error);
    });
    return Email;
}
export const getCurrentUserProfileEmailForPeople = async (sp) => {
    const UserID =""
   await sp.web.currentUser()
    .then(async (res) => {
        console.log(res);
       
     //   arr= res;
        // Email=  res.Email;
         const UserID = await sp.web.ensureUser(res.Email);
       
       //await getUserProfilePicture(res.Id,_sp)
    })
    .catch((error) => {
        console.log("Error fetching data: ", error);
    });
    return user.data.Id; 
}
async function getFollowersList(currentUserEmail) {
    try {
      const followers = await sp.web.lists.getByTitle("UserConnections").items
        .filter(`Followed/Email eq '${currentUserEmail}'`)
        .expand('Follower') // Expand to get full user info
        .get();
      return followers;
    } catch (error) {
      console.error("Error retrieving followers list:", error);
    }
  }
  async function getFollowingList(currentUserEmail) {
    try {
      const following = await sp.web.lists.getByTitle("UserConnections").items
        .filter(`Follower/Email eq '${currentUserEmail}'`)
        .expand('Followed') // Expand to get full user info
        .get();
      return following;
    } catch (error) {
      console.error("Error retrieving following list:", error);
    }
  }
  const followUser = async (itemId) => {
    e.preventDefault()
    try {
      const currentUser = await sp.web.currentUser();
      await sp.web.lists.getByTitle("Follows").items.add({
        FollowerId: currentUser.Id,
        FollowedItemId: itemId,
      });
      setIsFollowing(true);
    } catch (error) {
      console.error("Error following:", error);
    }
  };

  const unfollowUser = async (itemId) => {
    e.preventDefault()
    try {
      const currentUser = await sp.web.currentUser();
      const followRecords = await sp.web.lists.getByTitle("Follows").items
        .filter(`FollowerId eq ${currentUser.Id} and FollowedItemId eq ${itemId}`)
        ();

    } catch (error) {
      console.error("Error unfollowing:", error);
    }
  };
 export const getFollow=async (sp)=>
    {
      let arr=[]
        try {
          const currentUser = await sp.web.currentUser();
          const followRecords = await sp.web.lists.getByTitle("ARGFollows").items
            .select("Followed/Title","Followed/ID","Followed/EMail","ID").expand("Followed")
            .filter(`FollowedId eq ${currentUser.Id}`)();
            console.log(followRecords,'followedRecords');
            arr=followRecords
          // Update the counts based on follow status
        } catch (error) {
          console.error("Error checking follow status:", error);
        }
      return arr;
    }
  export  const getFollowing =async (sp)=>
    {
      let arr=[]
      try {
        const currentUser = await sp.web.currentUser();
        const followRecords = await sp.web.lists.getByTitle("ARGFollows").items
        .select("Follower/Title","Follower/ID","Follower/EMail","ID").expand("Follower")
        .filter(`FollowerId eq ${currentUser.Id}`)()
         
          console.log(followRecords,'followRecords');
          
          arr=followRecords
        // Update the counts based on follow status
      } catch (error) {
        console.error("Error checking follow status:", error);
      }
      return arr;
    }
    export const addActivityLeaderboard = async (sp, Action) => {
      debugger;
      const trimmedAction = Action.trim();
      
      // Retrieve all items, and filter on the client side
      await sp.web.lists
        .getByTitle("ARGLeaderboardConfigure")
        .items.select("Actions", "Points")() // Adjust fields as needed
        .then(async (res) => {
          if(res.length>0)
          {
            const matchingItem = res.find(item => item.Actions.trim() === trimmedAction);
    
            if (matchingItem) {
              await sp.web.lists
                .getByTitle("ARGLeaderboard")
                .items.add({
                  Action: trimmedAction,
                  Points: matchingItem.Points,
                })
                .then((res) => {
                  console.log(res, 'ews');
                });
            }
          }
          // Filter results by trimming Actions field values
          
        });
    };
    // export const getLeader = async (sp) => {
    //   let arr = [];
    
    //   // Fetching the leaderboard data
    //   await sp.web.lists
    //     .getByTitle("ARGLeaderboard")
    //     .items.select("*,Author/ID,Author/Title,Author/EMail")
    //     .expand("Author")
    //     .getAll()
    //     .then((res) => {
    //       console.log(res, "Fetched data");
    
    //       // Storing the fetched data in the array
    //       arr = res;
    //     });
    
    //   // Grouping and summing points by AuthorId
    //   const sumPointsByUser = () => {
    //     const userPoints = {};
    
    //     // Loop through each item in the fetched results
    //     arr.forEach((item) => {
    //       const authorId = item.Author.ID; // Author ID
    //       const points = item.Points; // Points for the action
    
    //       // Sum points for each AuthorId
    //       if (userPoints[authorId]) {
    //         userPoints[authorId] += points;
    //       } else {
    //         userPoints[authorId] = points;
    //       }
    //     });
    
    //     // Convert the object to an array of users with total points
    //     return Object.keys(userPoints).map((authorId) => ({
    //       AuthorId: authorId,
    //       TotalPoints: userPoints[authorId],
    //     }));
    //   };
    
    //   // Return the result
    //   return sumPointsByUser();
    // };
    export const getLeader = async (sp) => {
      let arr = [];
    
      // Fetching the leaderboard data
      await sp.web.lists
        .getByTitle("ARGLeaderboard")
        .items.select("*,Author/ID,Author/Title,Author/EMail,Author/Department")
        .expand("Author")
        .getAll()
        .then((res) => {
          console.log(res, "Fetched data");
    
          // Storing the fetched data in the array
          arr = res;
        });
    
      // Grouping and summing points by AuthorId
      const sumPointsByUser = async () => {
        const userPoints = {};
        const followRecords = await sp.web.lists.getByTitle("ARGLeaderboardRattingLevel").items
        .getAll()
         
          console.log(followRecords,'ARGLeaderboardRattingLevel');
        
        // Loop through each item in the fetched results
        arr.forEach((item) => {
          const authorId = item.Author.ID; // Author ID
          const points = item.Points; // Points for the action
          const authorTitle = item.Author.Title; // Author Title
          const authorEMail = item.Author.EMail; // Author Email
          const authorDepartment = item.Author.Department; // Author Email

    
          // Sum points for each AuthorId
          if (userPoints[authorId]) {
            userPoints[authorId].TotalPoints += points;
          } else {
            userPoints[authorId] = {
              TotalPoints: points,
              AuthorTitle: authorTitle,
              AuthorEMail: authorEMail,
              AuthorDepartment:authorDepartment
            };
          }
        });
    
        for(let i =0;i<followRecords.length;i++)
          {
            
          
        // Convert the object to an array of users with total points and other details
        return Object.keys(userPoints).map((authorId) => ({
          AuthorId: authorId,
          TotalPoints: userPoints[authorId].TotalPoints,
          AuthorTitle: userPoints[authorId].AuthorTitle,
          AuthorEMail: userPoints[authorId].AuthorEMail,
          AuthorDepartment:userPoints[authorId].AuthorDepartment,
          AutherRatting:userPoints[authorId].TotalPoints 
        }));
      }
      };
    
      // Return the result
      return sumPointsByUser();
    };
  
    

    export  const GetLeaderboardRattingLevel =async (sp)=>
      {
        let arr=[]
        try {
          const currentUser = await sp.web.currentUser();
          const followRecords = await sp.web.lists.getByTitle("ARGLeaderboardRattingLevel").items
          .getAll()
           
            console.log(ARGLeaderboardRattingLevel,'ARGLeaderboardRattingLevel');
            
            arr=followRecords
          // Update the counts based on follow status
        } catch (error) {
          console.error("Error checking follow status:", error);
        }
        return arr;
      }



      export const getLeaderTop = async (sp) => {
        let arr = [];
        let RATINGSTHRESHOLDS = []
        // Fetching the leaderboard data from SharePoint
        await sp.web.lists
          .getByTitle("ARGLeaderboard")
          .items.select("*,Author/ID,Author/Title,Author/EMail,Author/Department")
          .expand("Author")
          .getAll()
          .then((res) => {
            console.log(res, "Fetched data");
      
            // Storing the fetched data in the array
            arr = res;
          });
       const followRecords = await sp.web.lists.getByTitle("ARGLeaderboardRattingLevel").items.select("Ratting,Points")
          .getAll()
           
            console.log(followRecords,'ARGLeaderboardRattingLevel');
           
        // Dynamic threshold settings for ratting
        followRecords.forEach(element => {
        let arr1 = 
            { minPoints: element.Points, rating: element.Ratting }
            RATINGSTHRESHOLDS.push(arr1) 
          
        });
       
      
        // Grouping and summing points by AuthorId
        const sumPointsByUser = () => {
          const userPoints = {};
      
          // Loop through each item in the fetched results
          arr.forEach((item) => {
            const authorId = item.Author.ID; // Author ID
            const points = item.Points; // Points for the action
            const authorTitle = item.Author.Title; // Author Title
            const authorEMail = item.Author.EMail; // Author Email
            const authorDepartment = item.Author.Department; // Author Email

      
            // Sum points for each AuthorId
            if (userPoints[authorId]) {
              userPoints[authorId].TotalPoints += points;
            } else {
              userPoints[authorId] = {
                TotalPoints: points,
                AuthorTitle: authorTitle,
                AuthorEMail: authorEMail,
                AuthorDepartment: authorDepartment,

              };
            }
          });
      
          // Adding the Ratting field dynamically based on thresholds
          return Object.keys(userPoints).map((authorId) => {
            const totalPoints = userPoints[authorId].TotalPoints;
            
            // Determine ratting based on total points dynamically
            let ratting = 0;
            for (let i = 0; i < RATINGSTHRESHOLDS.length; i++) {
              if (totalPoints >= RATINGSTHRESHOLDS[i].minPoints) {
                ratting = RATINGSTHRESHOLDS[i].rating;
                break;
              }
            }
      
            // Return the data with Ratting
            return {
              AuthorId: authorId,
              TotalPoints: totalPoints,
              AuthorTitle: userPoints[authorId].AuthorTitle,
              AuthorEMail: userPoints[authorId].AuthorEMail,
              AuthorDepartment:userPoints[authorId].AuthorDepartment,
              Ratting: ratting, // Add ratting based on total points
            };
          });
        };
      
        // Return the result with total points and ratting
        return sumPointsByUser();
      };

      export const addNotification = async (itemData, _sp) => {
        debugger
        let resultArr = []
        try {
          const newItem = await _sp.web.lists.getByTitle('ARGNotificationHistory').items.add(itemData);
          debugger
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
      export const UpdateNotification = async (itemId, _sp) => {
        debugger
        let resultArr = []
        try {
          const newItem = await _sp.web.lists.getByTitle('ARGNotificationHistory').items.getByTitle(itemId).update({
            ReadStatus:true
          });
          debugger
          console.log('update added successfully:', newItem);
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
     export const getARGNotificationHistory =async (sp)=>
      {
        debugger
        let resultArr = []
        const currentUser = await sp.web.currentUser();
        try {
          const newItem = await sp.web.lists.getByTitle('ARGNotificationHistory').items.select("*,NotifiedUser/Id,NotifiedUser/Title,ActionUser/Id,ActionUser/Title").expand("NotifiedUser,ActionUser").filter(`NotifiedUserId eq ${currentUser.Id}`).getAll();
          debugger
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
      }