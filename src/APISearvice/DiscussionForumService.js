import { forEach } from "lodash";
import Swal from "sweetalert2";

export const getDiscussionForum = async (_sp) => {
    let arr = []
    let str = "Announcements"
    await _sp.web.lists.getByTitle("ARGDiscussionForum").items.select("*,DiscussionForumCategory/Id,DiscussionForumCategory/CategoryName,Author/ID,Author/Title").expand("DiscussionForumCategory,Author").getAll()
        .then((res) => {
            console.log("--discussion", res);


            //res.filter(x=>x.Category?.Category==str)
            arr = res;
        })
        .catch((error) => {
            console.log("Error fetching data: ", error);
        });
    return arr;
}

export const GetCategory = async (_sp) => {
    let arr = []
    await _sp.web.lists.getByTitle("ARGDiscussionForumCategory").items.getAll().then((res) => {
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
    await _sp.web.lists.getByTitle("ARGDiscussionForum").items.getById(id).select("*,DiscussionForumCategory/ID,Category/Category,Entity/ID,Entity/Entity").expand("Category,Entity,DiscussionForumTypeMaster")()
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
                DiscussionForumDocsId: res.DiscussionForumDocsId
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

    await _sp.web.lists.getByTitle("ARGDiscussionForum").items.getById(idNum)()
        .then((res) => {
            // arr=res;
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