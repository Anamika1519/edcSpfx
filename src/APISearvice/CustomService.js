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
    export const addActivityLeaderboard = async(sp,Action)=>
    {
       await sp.web.lists.getByTitle("ARGLeaderboardConfigure").items.filter(`Actions eq '${Action}'`)().then(async (res)=>
      {
        if(res.length>0)
        {
          await sp.web.lists.getByTitle("ARGLeaderboard").items.add(
            {
              Action:Action,
              Points:res[0].Points
            }
          ).then((res)=>
          {
             console.log(res,'ews');
          })
        }
      })
     
    }
    export const getLeader = async(sp)=>
      {
        let arr =[]
            await sp.web.lists.getByTitle("ARGLeaderboard").items.select("*,Author/ID,Author/Title,Author/EMail").expand("Author").getAll(
            ).then((res)=>
            {
               console.log(res,'ews');
               arr=res
            })
          
            return arr
       
      }
      export const getLeaderTop = async(sp)=>
        {
         let arr =[]
              await sp.web.lists.getByTitle("ARGLeaderboard").items.select("*,Author/ID,Author/Title,Author/EMail").expand("Author").top(4)(
              ).then((res)=>
              {
                 console.log(res,'getLeaderTop');
                 arr=res
              })
            
          return arr
         
        }
      