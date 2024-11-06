import { forEach } from "lodash";
import Swal from "sweetalert2";
import { DateTime } from "luxon";
export const getDiscussionForum = async (_sp) => {
    let arr = []
    let str = "Announcements";
    let currentUser;
    await _sp.web.currentUser()
    .then(user => {
      currentUser = user.Id; // Get the current user's ID
    })
    .catch(error => {
      console.error("Error fetching current user: ", error);
      return [];
    });

  if (!currentUser) return arr; // Return empty array if user fetch failed

    await _sp.web.lists.getByTitle("ARGDiscussionForum")
    .items.select("*,DiscussionForumCategory/Id,DiscussionForumCategory/CategoryName,Author/ID,Author/Title,InviteMemebers/Id,InviteMemebers/Title,InviteMemebers/EMail,GroupType")
    .expand("DiscussionForumCategory,Author,InviteMemebers").orderBy("Created",false).getAll()
        .then((res) => {
            console.log("--discussion", res);

            arr = res.filter(item => 
                // Include public groups or private groups where the current user is in the InviteMembers array
                item.GroupType === "Public" || 
                (item.GroupType === "Private" && item.InviteMemebers && item.InviteMemebers.some(member => member.Id === currentUser))
              );
        })
        .catch((error) => {
            console.log("Error fetching data: ", error);
        });
    return arr;
}

export const GetCategory = async (_sp) => {
    let arr = []
    await _sp.web.lists.getByTitle("ARGDiscussionForumCategory").items.orderBy("Created",false).getAll().then((res) => {
        console.log("---category", res);
        arr = res;
    }).catch((error) => {
        console.log("Error fetching data: ", error);
    })
    return arr;
}
export const updateItem = async (itemData, _sp, id) => {
    let resultArr = []
    try {
        const newItem = await _sp.web.lists.getByTitle('ARGDiscussionForum').items.getById(id).update(itemData);
        Swal.fire('Item update successfully', '', 'success');
        resultArr = newItem
        // Perform any necessary actions after successful addition
    } catch (error) {
        console.log('Error adding item:', error);
        Swal.fire(' Cancelled', '', 'error')
        // Handle errors appropriately
        resultArr = null
    }
    return resultArr;
};
export const addItem = async (itemData, _sp) => {
    debugger
    let resultArr = []
    try {
        const newItem = await _sp.web.lists.getByTitle('ARGDiscussionForum').items.add(itemData);
        debugger
        console.log('Item added successfully:', newItem);

        resultArr = newItem
        // Perform any necessary actions after successful addition
    } catch (error) {
        console.log('Error adding item:', error);
        Swal.fire(' Cancelled', '', 'error')
        // Handle errors appropriately
        resultArr = null
    }
    return resultArr;
};

export const getDiscussionForumByID = async (_sp, id) => {
    debugger
    let arr = []
    let arrs = []
    let bannerimg = []
    await _sp.web.lists.getByTitle("ARGDiscussionForum").items.getById(id).select("*","DiscussionForumCategory/ID","DiscussionForumCategory/CategoryName","Entity/ID","Entity/Entity","InviteMemebers/Id","InviteMemebers/Title","InviteMemebers/EMail","GroupType").expand("Entity","DiscussionForumCategory","InviteMemebers")()
        .then((res) => {
            console.log(res, ' let arrs=[]');
            // const bannerimgobject = res.AnnouncementandNewsBannerImage != "{}" && JSON.parse(res.AnnouncementandNewsBannerImage)
            // console.log(bannerimgobject[0], 'bannerimgobject');

            bannerimg.push(bannerimgobject);
            const parsedValues = {
                Title: res.Title != undefined ? res.Title : "",
                description: res.Description != undefined ? res.Description : "",
                //   overview: res.Overview != undefined ? res.Overview : "",
                //   IsActive: res.IsActive,
                ID: res.ID,
                // BannerImage: bannerimg,
                //   TypeMaster: res?.AnnouncementandNewsTypeMaster?.ID != undefined ? res.AnnouncementandNewsTypeMaster?.ID : "",
                DiscussionForumCategory: res.Category?.ID != undefined ? res.Category?.ID : "",
                Entity: res.Entity?.ID != undefined ? res.Entity?.ID : "",
                FeaturedAnnouncement: res.FeaturedAnnouncement,
                DiscussionForumGalleryJSON: res.DiscussionForumGalleryJSON != null ? JSON.parse(res.DiscussionForumGalleryJSON) : "",
                DiscussionForumDocsJSON: res.DiscussionForumDocsJSON != null ? JSON.parse(res.DiscussionForumDocsJSON) : "",
                DiscussionForumGalleryId: res.DiscussionForumGalleryId,
                DiscussionForumDocsId: res.DiscussionForumDocsId,
                inviteMembers:res?.InviteMemebers?.Title
                // other fields as needed
            };

            arr.push(parsedValues)
        })
        .catch((error) => {
            console.log("Error fetching data: ", error);
        });
    console.log(arr, 'arr');
    return arr;
}
export const getDiscussionForumDetailsById = async (_sp, idNum) => {
    let arr = []
    let arr1 = []

    await _sp.web.lists.getByTitle("ARGDiscussionForum").items.getById(idNum).select("*,DiscussionForumCategory/ID,DiscussionForumCategory/CategoryName,Entity/ID,Entity/Entity,InviteMemebers/Id,InviteMemebers/Title,InviteMemebers/EMail,GroupType").expand("Entity,DiscussionForumCategory,InviteMemebers")()
        .then((res) => {
            // arr=res;
            console.log(res,'hhhjhjh');
            
            arr1.push(res)
            arr = arr1
        }).catch((error) => {
            console.log("Error fetching data: ", error);
        });
    return arr;
}
export const getDiscussion = async (_sp) => {
    let arr = []
    await _sp.web.lists.getByTitle("ARGDiscussionForum").items.select("*,DiscussionForumCategory/Id,DiscussionForumCategory/CategoryName").expand("DiscussionForumCategory").top(3)()
        .then((res) => {
            // arr=res;

            arr = res
        }).catch((error) => {
            console.log("Error fetching data: ", error);
        });
    return arr;
}
export const getDiscussionMe = async (_sp) => {
    let arr = []
    let currentUser;
    await _sp.web.currentUser()
    .then(user => {
      currentUser = user.Id; // Get the current user's ID
    })
    .catch(error => {
      console.error("Error fetching current user: ", error);
      return [];
    });
    await _sp.web.lists.getByTitle("ARGDiscussionForum").items.select("*,DiscussionForumCategory/Id,DiscussionForumCategory/CategoryName")
    .expand("DiscussionForumCategory").filter(`Author eq ${currentUser}`).top(3)()
        .then((res) => {
            // arr=res;

            arr = res
        }).catch((error) => {
            console.log("Error fetching data: ", error);
        });
    return arr;
}
export const getDiscussionMeAll = async (_sp) => {
    let arr = []
    let currentUser;
    await _sp.web.currentUser()
    .then(user => {
      currentUser = user.Id; // Get the current user's ID
    })
    .catch(error => {
      console.error("Error fetching current user: ", error);
      return [];
    });
    await _sp.web.lists.getByTitle("ARGDiscussionForum").items.select("*,DiscussionForumCategory/Id,DiscussionForumCategory/CategoryName")
    .expand("DiscussionForumCategory").filter(`Author eq ${currentUser}`)()
        .then((res) => {
            // arr=res;

            arr = res
        }).catch((error) => {
            console.log("Error fetching data: ", error);
        });
    return arr;
}
export const getDiscussionFilterAll = async (_sp, filterOption) => {
    let arr = [];
    let filterQuery = "";

    // Get current date and times for filtering
    const today = DateTime.now().startOf('day');
    const yesterday = today.minus({ days: 1 });
    const lastWeek = today.minus({ weeks: 1 });
    const lastMonth = today.minus({ months: 1 });

    // Build the filter query based on the selected option
    switch (filterOption) {
        case "Today":
            filterQuery = `Created ge datetime'${today.toISO()}'`;
            break;
        case "Yesterday":
            filterQuery = `Created ge datetime'${yesterday.toISO()}' and Created lt datetime'${today.toISO()}'`;
            break;
        case "Last Week":
            filterQuery = `Created ge datetime'${lastWeek.toISO()}' and Created lt datetime'${today.toISO()}'`;
            break;
        case "Last Month":
            filterQuery = `Created ge datetime'${lastMonth.toISO()}' and Created lt datetime'${today.toISO()}'`;
            break;
        default:
            filterQuery = ""; // No filter
    }

    await _sp.web.lists.getByTitle("ARGDiscussionForum")
        .items
        .select("*,DiscussionForumCategory/Id,DiscussionForumCategory/CategoryName")
        .expand("DiscussionForumCategory")
        .filter(filterQuery)
        ()
        .then((res) => {
            arr = res;
        }).catch((error) => {
            console.log("Error fetching data: ", error);
        });

    return arr;
};
export const getDiscussionFilter = async (_sp, filterOption) => {
    let arr = [];
    let filterQuery = "";

    // Get current date and times for filtering
    const today = DateTime.now().startOf('day');
    const yesterday = today.minus({ days: 1 });
    const lastWeek = today.minus({ weeks: 1 });
    const lastMonth = today.minus({ months: 1 });

    // Build the filter query based on the selected option
    switch (filterOption) {
        case "Today":
            filterQuery = `Created ge datetime'${today.toISO()}'`;
            break;
        case "Yesterday":
            filterQuery = `Created ge datetime'${yesterday.toISO()}' and Created lt datetime'${today.toISO()}'`;
            break;
        case "Last Week":
            filterQuery = `Created ge datetime'${lastWeek.toISO()}' and Created lt datetime'${today.toISO()}'`;
            break;
        case "Last Month":
            filterQuery = `Created ge datetime'${lastMonth.toISO()}' and Created lt datetime'${today.toISO()}'`;
            break;
        default:
            filterQuery = ""; // No filter
    }

    await _sp.web.lists.getByTitle("ARGDiscussionForum")
        .items
        .select("*,DiscussionForumCategory/Id,DiscussionForumCategory/CategoryName")
        .expand("DiscussionForumCategory")
        .filter(filterQuery)
        .top(3)()
        .then((res) => {
            arr = res;
        }).catch((error) => {
            console.log("Error fetching data: ", error);
        });

    return arr;
};
export const getDiscussionComments = async (sp, Id) => {
    let arr = [];
    let arrLength = 0
    let arrUsers = []
    await sp.web.lists.getByTitle("ARGDiscussionComments").items.select("*,Author/Id,Author/Title,Author/EMail").expand("Author").filter(`DiscussionForumId eq ${Id}`)().then(res => {
        debugger
        let arrs;

        arrLength = res.length
        res.forEach(ele => {
                let arrUser = ele.Author.EMail
                arrUsers.push(arrUser)
        }
        )
        const uniqueArray = arrUsers.filter((item, index) => arrUsers.indexOf(item) === index);

        console.log(uniqueArray);

        let mainArray =
        {
            arrLength: res.length,
            arrUser: uniqueArray
        }
        arr = mainArray
    }
    )
    return arr;
}
export const getChoiceFieldOption = async (_sp,listName,fieldName) => {
    let arr =[]
    const field2 =  await _sp.web.lists.getByTitle(listName).fields.getByInternalNameOrTitle(fieldName)()
    console.log(field2,'field2');
   
    arr= field2["Choices"]
 
    return arr;
}