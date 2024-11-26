import React, { useEffect, useState, useRef } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import "./CustomBlogWebpartTemplate.scss";
import "../../CustomCss/mainCustom.scss";
import "../../Assets/Figtree/Figtree-VariableFont_wght.ttf";
import { Share2 } from 'feather-icons-react';
import { Bookmark } from 'feather-icons-react';
import { Calendar } from 'feather-icons-react';
import moment from 'moment';
import { getCurrentUserProfileEmail } from "../../APISearvice/CustomService";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { uploadFile, uploadFileToLibrary } from "../../APISearvice/BlogService";
import { getCurrentUserProfileEmail, getEntity } from "../../APISearvice/CustomService";
import {
    fetchBlogdata, fetchBookmarkBlogdata, getBlogsByID, getBlogByID, GetBlogCategory, GetCategory,
    fetchPinstatus, updateItem, uploadFileBanner, DeleteBusinessAppsAPI
} from "../../APISearvice/BlogService"

const CustomBlogWebpartTemplate = ({ _sp, SiteUrl }) => {
    const [itemsToShow, setItemsToShow] = useState(5);
    const [copySuccess, setCopySuccess] = useState('');
    const [show, setShow] = useState(false)
    const [NewsData, setNews] = useState([])
    const [showDropdownId, setShowDropdownId] = useState(null);
    const [currentEmail, setEmail] = useState('');
    const [blogData, setBlogData] = useState('');
    const menuRef = useRef(null);
    const [isMenuOpenshare, setIsMenuOpenshare] = useState(false);
    const [activeTab, setActiveTab] = useState("all");
    const [filteredBlogItems, setFilteredBlogItems] = useState('');
    const [Bookmarkblogs, setBookmarkblogs] = useState('');
    const [Bookmarkstatus, setBookmarkstatus] = useState('');
    const [EnityData, setEnityData] = React.useState([]);
    const [ImagepostArr, setImagepostArr] = React.useState([]);
    const [ImagepostArr1, setImagepostArr1] = React.useState([]);
    const [BnnerImagepostArr, setBannerImagepostArr] = React.useState([]);
    const [ImagepostArr1Edit, setImagepostArr1Edit] = React.useState([]);
    const [BnnerImagepostArrEdit, setBannerImagepostArrEdit] = React.useState([]);
    const [ImagepostIdsArr, setImagepostIdsArr] = React.useState([]);
    const [DocumentpostIdsArr, setDocumentpostIdsArr] = React.useState([]);
    const [DocumentpostArr1, setDocumentpostArr1] = React.useState([]);
    const [DocumentpostArr, setDocumentpostArr] = React.useState([]);
    const [richTextValues, setRichTextValues] = React.useState({});
    const [CategoryData, setCategoryData] = React.useState([]);
    const [EditFormData, setEditFormData] = useState([]);
    const [editID, setEditID] = React.useState(null);
    const [editForm, setEditForm] = React.useState(false);
    const [IsBannerAdded, setBannerAdded] = React.useState(false);
    const [IsGalImageAdded, setGalImageAdded] = React.useState(false);
    const [formData, setFormData] = React.useState({
        topic: "",
        category: "",
        entity: "",
        Type: "",
        bannerImage: null,
        // announcementGallery: null,
        // announcementThumbnail: null,
        description: "",
        overview: "",
        FeaturedAnnouncement: false,
    });
    const modules = {
        toolbar: [
            [{ size: ["small", false, "large", "huge"] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" },
            ],
            [
                {
                    color: [
                        "#000000",
                        "#e60000",
                        "#ff9900",
                        "#ffff00",
                        "#008a00",
                        "#0066cc",
                        "#9933ff",
                        "#ffffff",
                        "#facccc",
                        "#ffebcc",
                        "#ffffcc",
                        "#cce8cc",
                        "#cce0f5",
                        "#ebd6ff",
                        "#bbbbbb",
                        "#f06666",
                        "#ffc266",
                        "#ffff66",
                        "#66b966",
                        "#66a3e0",
                        "#c285ff",
                        "#888888",
                        "#a10000",
                        "#b26b00",
                        "#b2b200",
                        "#006100",
                        "#0047b2",
                        "#6b24b2",
                        "#444444",
                        "#5c0000",
                        "#663d00",
                        "#666600",
                        "#003700",
                        "#002966",
                        "#3d1466",
                        "custom-color",
                    ],
                },
            ],
        ],
    };
    const formats = [
        "header",
        "height",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "color",
        "bullet",
        "indent",
        "link",
        "image",
        "align",
        "size",
    ];
    useEffect(() => {
        console.log("activeeee", activeTab);
        if (activeTab.toLowerCase() === "all") {
            setFilteredBlogItems(blogData);
        } else {
            // Find the selected category based on activeTab
            const selectedCategory = FilterOptions.find(
                (category) => category.Name.toLowerCase() === activeTab.toLowerCase()
            );
            { console.log("filteredMediaItemsselectedCategory", filteredBlogItems, activeTab, selectedCategory, currentEmail, blogData) }
            if (selectedCategory) {
                // Filter items based on the selected category's ID
                if (selectedCategory.Name == "Bookmarked") {
                    // const filteredItems = blogData.filter(
                    //     (item) =>item.BookmarkedBy && item.BookmarkedBy.EMail === currentEmail
                    // );
                    console.log("currentEmailcurrentEmail", Bookmarkblogs)
                    setFilteredBlogItems(Bookmarkblogs);
                } else {
                    if (selectedCategory.Name == "Save as Draft") {
                        const filteredItems = blogData.filter(
                            (item) => item.Status === selectedCategory.Name && item.Author.EMail == currentEmail
                        );
                        setFilteredBlogItems(filteredItems);
                    } else {
                        const filteredItems = blogData.filter(
                            (item) => item.Status === selectedCategory.Name
                        );
                        setFilteredBlogItems(filteredItems);
                    }

                }

            } else {
                // If no category matches, show no items
                setFilteredBlogItems([]);
            }

        }
        { console.log("filteredMediaItemsafter", filteredBlogItems) }
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpenshare(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [_sp, SiteUrl, activeTab, blogData])

    useEffect(() => {
        ApIcall();
    }, []);
    const FilterOptions = [{ id: 1, Name: "All", name: "All" }, { id: 2, Name: "Published", name: "Published" },
    { id: 3, Name: "Save as Draft", name: "Your Drafts" }, { id: 4, Name: "Bookmarked", name: "Bookmarked" }]

    const ApIcall = async () => {
        setEmail(await getCurrentUserProfileEmail(_sp));
        setBlogData(await fetchBlogdata(_sp));

        setBookmarkstatus(await fetchPinstatus(_sp));
        setCategoryData(await GetCategory(_sp));
        //setBlogCategoryData(await GetBlogCategory(_sp));


        setActiveTab("All");
        setBookmarkblogs(await fetchBookmarkBlogdata(_sp));
        setActiveTab("All");
        setEnityData(await getEntity(_sp)) //Entity
        // console.log("check data of blogs---",blogData)
        // const dataofblog = await fetchBlogdata(sp);
        // console.log("check the data of blog",dataofblog)
        // setBlogData(dataofblog);

    }
    const handleTabClick = (tab, Id) => {
        setActiveTab(tab.toLowerCase());
    };
    const truncateText = (text, maxLength) => {
        if (text != null) {
            return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;

        }
    };

    const gotoBlogsDetails = (valurArr) => {
        localStorage.setItem("NewsId", valurArr.Id)
        localStorage.setItem("NewsArr", JSON.stringify(valurArr))
        setTimeout(() => {
            window.location.href = `${SiteUrl}/SitePages/BlogDetails.aspx?${valurArr.Id}`;
        }, 1000);
    }

    const copyToClipboard = (Id) => {
        const link = `${SiteUrl}/SitePages/BlogDetails.aspx?${Id}`;
        navigator.clipboard.writeText(link)
            .then(() => {
                setCopySuccess('Link copied!');
                setTimeout(() => setCopySuccess(''), 2000); // Clear message after 2 seconds
            })
            .catch(err => {
                setCopySuccess('Failed to copy link');
            });
    };
    // Edit blogs
    const getDescription = (des) => {
        // You can fetch this from an API, or return dynamic content.
        return des;
    };
    const EditBlogs = async (id) => {

        let selectedData = await getBlogsByID(_sp, Number(id));
        setEditFormData(selectedData);
        setEditID(id);
        setEditForm(true)
        console.log(id, "----id", selectedData);
        //setCategoryData(await getCategory(_sp, Number(selectedData[0].Category)));
        setFormData((prevData) => ({
            ...prevData,

            //Status: selectedData[0].Status,
            //BlogBannerImage: selectedData[0].BlogBannerImage && parse.JSON(selectedData[0].BlogBannerImage),
            topic: selectedData[0].Title,
            //category: selectedData[0].Category,
            entity: selectedData[0].Entity,

            description: selectedData[0].Description,
            overview: selectedData[0].Overview,

        }));
        const initialContent = getDescription(selectedData[0].description);
        let banneimagearr = []
        setRichTextValues((prevValues) => ({
            ...prevValues,
            description: initialContent,
        }));
        setImagepostIdsArr(selectedData[0]?.BlogGalleryId)
        setDocumentpostIdsArr(selectedData[0]?.BlogsDocsId)
        setImagepostArr1(selectedData[0].BlogGalleryJSON)
        setImagepostArr(selectedData[0].BlogGalleryJSON)
        setDocumentpostArr1(selectedData[0].BlogDocsJSON)
        if (selectedData[0].BannerImage.length > 0) {
            banneimagearr = selectedData[0].BannerImage
            console.log(banneimagearr, 'banneimagearr');
            setBannerImagepostArr(banneimagearr);
            setBannerImagepostArrEdit(banneimagearr);
            setImagepostArr1Edit(selectedData[0].BlogGalleryJSON)
            //setFormData(arr)
        }
        console.log("editformdata", EditFormData, selectedData)
        //window.location.href = `${SiteUrl}/SitePages/DiscussionForumDetail.aspx?${id}`;
    };

    const onFileChange = async (
        event,
        libraryName,
        docLib
    ) => {
        debugger;
        console.log("libraryName-->>>>", libraryName)
        event.preventDefault();
        let uloadDocsFiles = [];
        let uloadDocsFiles1 = [];

        let uloadImageFiles = [];
        let uloadImageFiles1 = [];

        let uloadBannerImageFiles = [];

        if (event.target.files && event.target.files.length > 0) {
            const files = Array.from(event.target.files);
            if (libraryName === "Gallery") {
                setGalImageAdded(true);
            }
            if (libraryName === "bannerimg") {
                setBannerAdded(true);
            }
            // if (libraryName === "Docs") {
            //     const docFiles = files.filter(
            //         (file) =>
            //             file.type === "application/pdf" ||
            //             file.type === "application/msword" ||
            //             file.type === "application/xsls" ||
            //             file.type === "text/csv" ||
            //             file.type === "text/csv" ||
            //             file.type ===
            //             "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
            //             file.type ===
            //             "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
            //             file.type === "text/"
            //     );

            //     if (docFiles.length > 0) {
            //         const arr = {
            //             files: docFiles,
            //             libraryName: libraryName,
            //             docLib: docLib,
            //         };
            //         uloadDocsFiles.push(arr);
            //         setDocumentpostArr(uloadDocsFiles);
            //         if (DocumentpostArr1.length > 0) {
            //             //  uloadDocsFiles1.push(DocumentpostArr1)
            //             docFiles.forEach((ele) => {
            //                 let arr1 = {
            //                     ID: 0,
            //                     Createdby: "",
            //                     Modified: "",
            //                     fileUrl: "",
            //                     fileSize: ele.size,
            //                     fileType: ele.type,
            //                     fileName: ele.name,
            //                 };
            //                 DocumentpostArr1.push(arr1);
            //             });

            //             setDocumentpostArr1(DocumentpostArr1);
            //         } else {
            //             docFiles.forEach((ele) => {
            //                 let arr1 = {
            //                     ID: 0,
            //                     Createdby: "",
            //                     Modified: "",
            //                     fileUrl: "",
            //                     fileSize: ele.size,
            //                     fileType: ele.type,
            //                     fileName: ele.name,
            //                 };
            //                 uloadDocsFiles1.push(arr1);
            //             });

            //             setDocumentpostArr1(uloadDocsFiles1);
            //         }
            //     } else {
            //         Swal.fire("only document can be upload");
            //     }
            // }
            if (libraryName === "Gallery" || libraryName === "bannerimg") {
                const imageVideoFiles = files.filter(
                    (file) =>
                        file.type.startsWith("image/") || file.type.startsWith("video/")
                );

                if (imageVideoFiles.length > 0) {
                    const arr = {
                        files: imageVideoFiles,
                        libraryName: libraryName,
                        docLib: docLib,
                    };
                    console.log("arr-->>>", arr)
                    if (libraryName === "Gallery") {
                        uloadImageFiles.push(arr);
                        setImagepostArr(uloadImageFiles);
                        if (ImagepostArr1.length > 0) {
                            imageVideoFiles.forEach((ele) => {
                                console.log("ele in if-->>>>", ele)
                                let arr1 = {
                                    ID: 0,
                                    Createdby: "",
                                    Modified: "",
                                    fileUrl: "",
                                    fileSize: ele.size,
                                    fileType: ele.type,
                                    fileName: ele.name,
                                };
                                ImagepostArr1.push(arr1);
                            });
                            setImagepostArr1(ImagepostArr1);
                        } else {
                            imageVideoFiles.forEach((ele) => {
                                console.log("ele in else-->>>>", ele)
                                let arr1 = {
                                    ID: 0,
                                    Createdby: "",
                                    Modified: "",
                                    fileUrl: "",
                                    fileSize: ele.size,
                                    fileType: ele.type,
                                    fileName: ele.name,
                                };
                                uloadImageFiles1.push(arr1);
                            });
                            setImagepostArr1(uloadImageFiles1);
                        }
                    } else if (libraryName === "bannerimg") {
                        uloadBannerImageFiles.push(arr);
                        console.log("uloadBannerImageFiles-->>", uloadBannerImageFiles)
                        setBannerImagepostArr(uloadBannerImageFiles);
                    }
                } else {
                    Swal.fire("only image & video can be upload");
                }
            }
        }
    };

    const validateForm = () => {
        const { topic, Type, category, entity, overview, FeaturedAnnouncement } =
            formData;
        const { description } = richTextValues;
        let valid = true;

        if (!topic) {
            Swal.fire("Error", "Topic is required!", "error");
            valid = false;
        } else if (!entity) {
            Swal.fire("Error", "Entity is required!", "error");
            valid = false;
        }
        else if (BnnerImagepostArr.length == 0 && BnnerImagepostArrEdit.length == 0) {
            Swal.fire('Error', 'Banner image is required!', 'error');
            valid = false;
        }
        else if (ImagepostArr.length == 0 && ImagepostArr1Edit.length == 0) {
            Swal.fire('Error', 'Gallery image is required!', 'error');
            valid = false;
        }
        //else if (!overview) {
        //   Swal.fire('Error', 'Overview is required!', 'error');
        //   valid = false;
        // } else if (!description) {
        //   Swal.fire('Error', 'Description is required!', 'error');
        //   valid = false;
        // } else if (!FeaturedAnnouncement) {
        //   Swal.fire('Error', 'Featured Announcement is required!', 'error');
        //   valid = false;
        // }

        return valid;
    };
    const validateFormDraft = () => {
        const { topic, Type, category, entity, overview, FeaturedAnnouncement } =
            formData;
        const { description } = richTextValues;
        let valid = true;

        if (!topic) {
            Swal.fire("Error", "Topic is required!", "error");
            valid = false;
        } else if (!entity) {
            Swal.fire("Error", "Entity is required!", "error");
            valid = false;
        }
        else if (BnnerImagepostArr.length == 0 && BnnerImagepostArrEdit.length == 0) {
            Swal.fire('Error', 'Banner image is required!', 'error');
            valid = false;
        }
        // else if (ImagepostArr.length == 0 && ImagepostArr1Edit.length == 0) {
        //     Swal.fire('Error', 'Gallery image is required!', 'error');
        //     valid = false;
        // }
        //else if (!overview) {
        //   Swal.fire('Error', 'Overview is required!', 'error');
        //   valid = false;
        // } else if (!description) {
        //   Swal.fire('Error', 'Description is required!', 'error');
        //   valid = false;
        // } else if (!FeaturedAnnouncement) {
        //   Swal.fire('Error', 'Featured Announcement is required!', 'error');
        //   valid = false;
        // }

        return valid;
    };
    const handleFormSubmit = async () => {
        if (validateForm()) {
            if (editForm) {
                Swal.fire({
                    title: "Are you sure you want to publish this blog?",
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText: "Yes",
                    cancelButtonText: "No",
                    icon: "warning",
                }).then(async (result) => {
                    console.log(result);
                    if (result.isConfirmed) {
                        //console.log("Form Submitted:", formValues, bannerImages, galleryImages, documents);
                        debugger;
                        let bannerImageArray = {};
                        let galleryIds = [];
                        let documentIds = [];
                        let galleryArray = [];
                        let documentArray = [];

                        // formData.FeaturedAnnouncement === "on"?  true :false;
                        console.log("BnnerImagepostArr submit edit", BnnerImagepostArr)
                        // Upload Banner Images
                        if (
                            BnnerImagepostArr.length > 0 &&
                            BnnerImagepostArr[0]?.files?.length > 0 && IsBannerAdded
                        ) {
                            debugger
                            for (const file of BnnerImagepostArr[0].files) {
                                debugger
                                //  const uploadedBanner = await uploadFile(file, _sp, "Documents", Url);
                                bannerImageArray = await uploadFileBanner(
                                    file,
                                    _sp,
                                    "Documents",
                                    "https://alrostamanigroupae.sharepoint.com"
                                );
                            }
                        } else {
                            bannerImageArray = null;
                        }
                        debugger;
                        console.log("bannerImageArraybannerImageArray on submit", bannerImageArray,
                            BnnerImagepostArrEdit,
                            BnnerImagepostArrEdit.length
                        )

                        if (bannerImageArray != null || BnnerImagepostArrEdit != null) {
                            // Create Post
                            const postPayload = IsBannerAdded ?
                                {
                                    Title: formData.topic,
                                    Overview: formData.overview,
                                    Description: richTextValues.description,
                                    EntityId: formData.entity && Number(formData.entity),
                                    Status: "Published",
                                    BlogBannerImage: bannerImageArray && JSON.stringify(bannerImageArray)
                                    // DiscussionForumCategoryId: Number(formData.category),
                                }
                                :
                                {
                                    Title: formData.topic,
                                    Overview: formData.overview,
                                    Description: richTextValues.description,
                                    EntityId: formData.entity && Number(formData.entity),
                                    Status: "Published",
                                    //BlogBannerImage: bannerImageArray && JSON.stringify(bannerImageArray)
                                    // DiscussionForumCategoryId: Number(formData.category),
                                };
                            console.log("postPayload-->>>>>", postPayload);

                            const postResult = await updateItem(postPayload, _sp, editID);
                            const postId = postResult?.data?.ID;
                            debugger;
                         
                            console.log("ImagepostArrImagepostArrsubmit", ImagepostArr, IsGalImageAdded)
                            // if (IsGalImageAdded) {
                           
                            //     if (ImagepostArr.length > 0) {
                            //         for (const file of ImagepostArr[0]?.files) {
                            //             const uploadedGalleryImage = await uploadFileToLibrary(
                            //                 file,
                            //                 _sp,
                            //                 "BlogGallery"
                            //             );

                            //             galleryIds = galleryIds.concat(
                            //                 uploadedGalleryImage.map((item) => item.ID)
                            //             );
                            //             galleryArray.push(uploadedGalleryImage);
                            //         }
                            //     }
                            //     // Upload Documents
                            //     console.log("DocumentpostArr submit", galleryIds, ImagepostIdsArr, galleryArray)
                              
                            // }
                            if (ImagepostArr.length > 0 && IsGalImageAdded) {
                                for (const file of ImagepostArr[0]?.files) {
                                    const uploadedGalleryImage = await uploadFileToLibrary(
                                        file,
                                        _sp,
                                        "BlogGallery"
                                    );

                                    galleryIds = galleryIds.concat(
                                        uploadedGalleryImage.map((item) => item.ID)
                                    );
                                    galleryArray.push(uploadedGalleryImage);
                                    console.log("uploadedGalleryImage draft", uploadedGalleryImage, galleryIds)
                                }
                            }

                            console.log("IsGalImageAdded draft", IsGalImageAdded)
                            if (IsGalImageAdded) {
                                const updatePayload = {
                                    ...(galleryIds.length > 0 && {
                                        BlogsGalleryId: galleryIds,
                                        BlogGalleryJSON: JSON.stringify(
                                            flatArray(galleryArray)
                                        ),
                                    }),

                                };

                                if (Object.keys(updatePayload).length > 0) {
                                    const updateResult = await updateItem(updatePayload, _sp, editID);
                                    console.log("Update Result:", updateResult);
                                }
                            }
                            // if (IsGalImageAdded) {
                            //     const updatePayload = {
                            //         ...(galleryIds.length > 0 && {
                            //             BlogGalleryId: galleryIds,

                            //             BlogGalleryJSON: JSON.stringify(
                            //                 flatArray(galleryArray)
                            //             ),
                            //         })
                            //     };

                            //     if (Object.keys(updatePayload).length > 0) {
                            //         const updateResult = await updateItem(
                            //             updatePayload,
                            //             _sp,
                            //             editID
                            //         );
                            //         console.log("Update Result:", updateResult);
                            //     }
                            // }
                        }
                       
                        Swal.fire("Item updated successfully", "", "success");
                        setTimeout(async () => {
                            setBlogData(await fetchBlogdata(_sp));
                            dismissModal();
                            window.location.href = `${SiteUrl}/SitePages/Blogs.aspx`;
                        }, 2000);
                        setTimeout(() => {

                        }, 2000);
                    }
                });
            }
        }
    };
    const flatArray = (arr) => {
        return arr.reduce((acc, val) => acc.concat(val), []);
    };
    const handleFormSaveasDraft = async () => {
        if (validateFormDraft()) {
            Swal.fire({
                title: "Do you want to save this blog?",
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: "Yes",
                cancelButtonText: "No",
                icon: "warning",
            }).then(async (result) => {
                //console.log("Form Submitted:", formValues, bannerImages, galleryImages, documents);
                if (result.isConfirmed) {
                    debugger;
                    let bannerImageArray = {};
                    let galleryIds = [];
                    let documentIds = [];
                    let galleryArray = [];
                    let documentArray = [];

                    // formData.FeaturedAnnouncement === "on"?  true :false;

                    // Upload Banner Images
                    console.log("BnnerImagepostArrBnnerImagepostArr draft", BnnerImagepostArr)
                    if (
                        BnnerImagepostArr.length > 0 &&
                        BnnerImagepostArr[0]?.files?.length > 0 && IsBannerAdded
                    ) {
                        for (const file of BnnerImagepostArr[0].files) {
                            //  const uploadedBanner = await uploadFile(file, _sp, "Documents", Url);
                            bannerImageArray = await uploadFileBanner(
                                file,
                                _sp,
                                "Documents",
                                "https://alrostamanigroupae.sharepoint.com"
                            );
                        }
                    }
                    debugger;
                    // Create Post
                    console.log("BnnerImagepostArrBnnerImagepostArr draft", bannerImageArray)
                    const postPayload = IsBannerAdded ?
                        {
                            Title: formData.topic,
                            Overview: formData.overview,
                            Description: richTextValues.description,
                            EntityId: formData.entity && Number(formData.entity),
                            Status: "Save as Draft",
                            BlogBannerImage: bannerImageArray && JSON.stringify(bannerImageArray)
                        }
                        :
                        {
                            Title: formData.topic,
                            Overview: formData.overview,
                            Description: richTextValues.description,
                            EntityId: formData.entity && Number(formData.entity),
                            Status: "Save as Draft",
                        };
                    console.log("postPayload 3-->>>>>", postPayload);

                    const postResult = await updateItem(postPayload, _sp, editID);
                    const postId = postResult?.data?.ID;
                    debugger;
                    console.log("postID", postId, postResult)
                    console.log("ImagepostArrImagepostArr draft", ImagepostArr, IsGalImageAdded)
                    if (ImagepostArr.length > 0 && IsGalImageAdded) {
                        for (const file of ImagepostArr[0]?.files) {
                            const uploadedGalleryImage = await uploadFileToLibrary(
                                file,
                                _sp,
                                "BlogGallery"
                            );

                            galleryIds = galleryIds.concat(
                                uploadedGalleryImage.map((item) => item.ID)
                            );
                            galleryArray.push(uploadedGalleryImage);
                            console.log("uploadedGalleryImage draft", uploadedGalleryImage, galleryIds)
                        }
                    }

                    console.log("IsGalImageAdded draft", IsGalImageAdded)
                    if (IsGalImageAdded) {
                        const updatePayload = {
                            ...(galleryIds.length > 0 && {
                                BlogsGalleryId: galleryIds,
                                BlogGalleryJSON: JSON.stringify(
                                    flatArray(galleryArray)
                                ),
                            }),

                        };

                        if (Object.keys(updatePayload).length > 0) {
                            const updateResult = await updateItem(updatePayload, _sp, editID);
                            console.log("Update Result:", updateResult);
                        }
                    }
                    Swal.fire("Item updated successfully", "", "success");
                    setTimeout(async () => {
                        setBlogData(await fetchBlogdata(_sp));
                        dismissModal()
                        window.location.href = `${SiteUrl}/SitePages/Blogs.aspx`;

                    }, 2000);
                }
            });
        }

    };
    const dismissModal = () => {
        const modalElement = document.getElementById('discussionModalEdit');

        // Remove Bootstrap classes and attributes manually
        modalElement.classList.remove('show');
        modalElement.style.display = 'none';
        modalElement.setAttribute('aria-hidden', 'true');
        modalElement.removeAttribute('aria-modal');
        modalElement.removeAttribute('role');

        // Optionally, remove the backdrop if it was added manually
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
            modalBackdrop.remove();
        }
    };
    const onChange = async (name, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        // if (name == "Type") {
        //   setCategoryData(await getCategory(_sp, Number(value))); // Category
        // }
    };


    // Edit Blogs End
    const DeleteBlog = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                const DeleteRes = DeleteBusinessAppsAPI(_sp, id)
              
                ApIcall();
                Swal.fire({
                    title: "Deleted!",
                    text: "Item has been deleted.",
                    icon: "success"
                }).then(async res => {
                    setBlogData(await fetchBlogdata(_sp));
                }
                ).catch(async err => {
                    setBlogData(await fetchBlogdata(_sp));
                }
                )

            }
        })
    }

    //new code end

    const toggleDropdown = (itemId) => {
        if (showDropdownId === itemId) {
            setShowDropdownId(null); // Close the dropdown if already open
        } else {
            setShowDropdownId(itemId); // Open the dropdown for the clicked item
        }
    };
    const togglePin = async (e, item) => {

        debugger

        e.preventDefault();

        //setLoadingUsers((prev) => ({ ...prev, [item.ID]: true })); // Set loading state for the specific user


        try {

            const currentUser = await _sp.web.currentUser();

            const saveRecords = await _sp.web.lists.getByTitle("ARGSavedBlogs").items
                .select("*,BlogId/Id")
                .expand("BlogId")
                .filter(`BlogSavedById eq ${currentUser.Id} and BlogId/Id eq ${item}`)();


            if (saveRecords.length > 0) {

                // Unpin logic

                await _sp.web.lists.getByTitle("ARGSavedBlogs").items.getById(saveRecords[0].Id).delete();

                setBookmarkstatus((prev) => ({ ...prev, [item.ID]: false })); // Update [pin] status

            } else {

                // pin logic

                await _sp.web.lists.getByTitle("ARGSavedBlogs").items.add({

                    BlogSavedById: currentUser.Id,

                    BlogIdId: item

                }).then(async (ress) => {

                    console.log(ress);
                });

                setBookmarkstatus((prev) => ({ ...prev, [item.ID]: true })); // Update pin status

            }

        } catch (error) {

            //setLoadingUsers((prev) => ({ ...prev, [item.ID]: false })); // End loading state for the specific user


            console.error("Error toggling pin status:", error);

            alert("Failed to toggle pin status. Please try again.");

        } finally {
            ApIcall();
            //  fetchUserInformationList()

            //   setLoadingUsers((prev) => ({ ...prev, [item.ID]: false })); // End loading state for the specific user



        }

    };
    const sendanEmail = (item) => {
        // window.open("https://outlook.office.com/mail/inbox");

        const subject = "Blog link-" + item.Title;
        const body = 'Here is the link to the Blog:' + `${SiteUrl}/SitePages/BlogDetails.aspx?${item.Id}`;

        const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        // Open the link to launch the default mail client (like Outlook)
        window.location.href = mailtoLink;
    };
    const loadMore = () => {
        event.preventDefault()
        event.stopImmediatePropagation()
        setItemsToShow(itemsToShow + 5); // Increase the number by 8
    };
    return (
        <><div className="row mt-3">
            {blogData.length > 0 ?
                blogData.filter(x => x.Status == "Published").slice(0, 1).map(item => {
                    const AnnouncementandNewsBannerImage = item.BlogBannerImage == undefined || item.BlogBannerImage == null ? ""
                        : JSON.parse(item.BlogBannerImage);
                    return (
                        <>
                            <div className="col-lg-5" onClick={() => gotoBlogsDetails(item)}>
                                <div className="imagemani mt- mb-3 me-2">
                                    <img src={AnnouncementandNewsBannerImage?.serverUrl + AnnouncementandNewsBannerImage?.serverRelativeUrl}
                                        className="d-flex align-self-center me-3 w-100" lt="Generic placeholder image" style={{ objectFit: 'cover' }} />
                                </div>
                            </div>
                            <div className="col-lg-7">
                                <div className="row" style={{ paddingLeft: '0.5rem' }}>
                                    <div className="col-sm-4 text-left">
                                        <span style={{ padding: '5px', borderRadius: '4px', fontWeight: '500', color: '#009157', background: 'rgba(0, 135, 81, 0.20)' }} className=" font-14 float-start mt-2">
                                            Latest Blog</span>

                                    </div>
                                    <div className="col-lg-12">
                                        <h4 style={{ lineHeight: '34px' }} className="page-title fw-700 mb-1  pe-5 font-28 titleHeading">
                                            {truncateText(item.Title, 120)}</h4>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <p className="mb-2 mt-1 text-dark d-block customhead">
                                                <span style={{ fontWeight: '400' }} className="pe-2 text-nowrap color-new font-12 mb-0 d-inline-block">
                                                    <Calendar size={12}  strokeWidth={1} className="pl-2" style={{ fontWeight: '400' }} />
                                                    {moment(item.Created).format("DD-MMM-YYYY")} &nbsp;  &nbsp;  &nbsp;|
                                                </span>
                                                <span style={{ fontWeight: '400' }} className="text-nowrap mb-0 color-new font-12 d-inline-block">
                                                    Author: <span style={{ color: '#009157', fontWeight: '600' }}>{item.Author.Title} &nbsp;  &nbsp;  &nbsp;
                                                    </span>

                                                </span></p>

                                            <div style={{ clear: 'both' }}>
                                                <p style={{fontSize:'15px', lineHeight:'22px'}} className="d-block text-dark customdescription">{truncateText(item.Overview, 300)}</p>
                                            </div>
                                        </div>
                                        <a onClick={() => gotoBlogsDetails(item)} style={{ textDecoration: 'none' }}>
                                            <div style={{ height: '40px', lineHeight: '24px' }} className="btnCustomcss btn-primary">Read more..</div> </a>
                                    </div>
                                </div>

                            </div></>)
                }) : null}
        </div>
            <div className="row mt-2">
                <div className="col-12">
                    <div className="card mb-0 cardcsss">
                        <div className="card-body">
                            <div className="d-flex flex-wrap align-items-center justify-content-center">
                                <ul
                                    className="navs nav-pillss navtab-bgs"
                                    role="tablist"
                                    style={{
                                        gap: "5px",
                                        display: "flex",
                                        listStyle: "none",
                                        marginBottom: "unset",
                                    }}
                                >
                                    {console.log("FilterOptions", FilterOptions)}
                                    {FilterOptions.length > 0 && FilterOptions.map((res) => (
                                        <li className="nav-itemcss">
                                            <a
                                                className={`nav-linkss ${activeTab.toLowerCase() ===
                                                    (res.Name.toLowerCase()
                                                        ? res.Name.toLowerCase()
                                                        : "")
                                                    ? "active"
                                                    : ""
                                                    }`}

                                                //aria-selected={activeTab === "cardView"}
                                                role="tab"
                                                onClick={() => handleTabClick(res.Name.toLowerCase(), res.ID)}
                                            >
                                                {res.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="tab-content mt-2">
                <div className="tab-pane show active" id="home1" role="tabpanel">
                    {filteredBlogItems.length > 0 ?
                        // filteredBlogItems.slice(0, itemsToShow).map(item => {
                        filteredBlogItems.map(item => {
                            const AnnouncementandNewsBannerImage = item.BlogBannerImage == undefined || item.BlogBannerImage == null ? ""
                                : JSON.parse(item.BlogBannerImage);
                            // console.log("AnnouncementandNewsBannerImage", AnnouncementandNewsBannerImage, item);
                            const imageData = item.BlogBannerImage ? JSON.parse(item.BlogBannerImage) : null;
                            let siteIdAl = '338f2337-8cbb-4cd1-bed1-593e9336cd0e,e2837b3f-b207-41eb-940b-71c74da3d214';
                            let listIDAl = '33ff70ea-7112-4dfb-a0fe-477786aee9e3';

                            let siteId = SiteUrl.toLowerCase().includes('alrostmani') ? siteIdAl : '02993535-33e8-44d1-9edf-0d484e642ea1,d9374a3d-ae79-4d2a-8d36-d48f86e3201e';
                            let listID = SiteUrl.toLowerCase().includes('alrostmani') ? listIDAl : '1e0eead0-ed78-4b4d-92dc-4cd058deac82';

                            let img1 = imageData && imageData.fileName ? `${SiteUrl}/_api/v2.1/sites('${siteId}')/lists('${listID}')/items('${item.ID}')/attachments('${imageData.fileName}')/thumbnails/0/c400x400/content?prefer=noredirect%2Cclosestavailablesize` : ""
                            let img = imageData && imageData.serverRelativeUrl ? `https://alrostamanigroupae.sharepoint.com${imageData.serverRelativeUrl}` : img1
                            const imageUrl = imageData
                                ? img
                                : require("../../webparts/businessApps/assets/userimg.png");
                            { console.log("imageData", imageData, imageUrl, item, SiteUrl, img) }

                            return (
                                <div className="card mb-2 annuncementcard">
                                    <div className="card-body">
                                        <div className="row align-items-start">
                                            <div className="col-sm-2">
                                                <a onClick={() => gotoBlogsDetails(item)}>   <div className="imagehright">
                                                    {/* <img className="d-flex align-self-center me-3 w-100" src={g1} alt="Generic placeholder image" /> */}
                                                    <img src={imageUrl}
                                                        className="d-flex align-self-center me-3 w-100" lt="Generic placeholder image" style={{ height: '100%' }} />
                                                </div>
                                                </a>
                                            </div>
                                            <div className="col-sm-9 padd-12">
                                                <div className="row">
                                                    <div className="col-sm-4 date-color">
                                                        <span className="font-12 date-color float-start mt-0 mb-2 ng-binding" style={{ color: '#6b6b6b', fontSize: '12px', paddingRight: '0.2rem' }}>
                                                            <Calendar size={12} color="#6b6b6b" strokeWidth={2} style={{ fontWeight: '400' }} /></span>

                                                        <span className="font-12 date-color float-start mt-0 mb-2 ng-binding" style={{ color: '#6b6b6b', fontSize: '12px' }}>{moment(item.Created).format("DD-MMM-YYYY")}
                                                            {/* 12-Mar-2024 18:37 */}
                                                        </span>
                                                    </div>
                                                </div>
                                                <a > <div className="w-100">
                                                    <h4 className="mt-0 mb-1 font-16 fw-bold ng-binding" style={{ color: '#343a40', fontSize: '16px' }}> {truncateText(item.Title, 90)}
                                                    </h4>
                                                    <p style={{ color: '#6b6b6b', fontSize: '15px', lineHeight:'20px', height: '4rem' }} className="mb-2 ng-binding">
                                                        {truncateText(item.Overview, 200)}</p>
                                                    <div className="readmore" onClick={() => gotoBlogsDetails(item)} style={{ cursor: 'pointer' }}>Read more..</div>
                                                </div>
                                                </a>
                                            </div>
                                            <div className="col-sm-1">
                                                <div className="d-flex" style={{ justifyContent: 'end', gap: '10px', marginRight: '3px', cursor: 'pointer' }}>
                                                    <div className="col-lg-12">
                                                        {item.Status == "Save as Draft" &&
                                                            <><div style={{gap:'10px'}} className="d-flex flex-wrap align-items-center justify-content-end mt-0">
                                                                {/* Button to trigger modal */}
                                                                <FontAwesomeIcon
                                                                    icon={faEdit}
                                                                    data-bs-toggle="modal"
                                                                    data-bs-target="#discussionModalEdit"
                                                                    className="text-dark1 waves-effect waves-light"
                                                                    onClick={() => EditBlogs(item.ID)} />


                                                            

                                                                    <a
                                                                       
                                                                        onClick={() => DeleteBlog(item.ID)}
                                                                    >
                                                                        <FontAwesomeIcon  className="text-dark1 waves-effect waves-light" icon={faTrashAlt} />
                                                                    </a>

                                                                </div></>
                                                        }
                                                        {/* Bootstrap Modal */}
                                                        {console.log("formdata", formData)}
                                                        <div
                                                            className="modal fade bd-example-modal-lg"
                                                            id="discussionModalEdit"
                                                            tabIndex={-1}
                                                            aria-labelledby="exampleModalLabel"
                                                            aria-hidden="true"
                                                            data-target=".bd-example-modal-lg"
                                                        >
                                                            <div style={{ minWidth: '80%' }} className="modal-dialog modal-lg ">
                                                                <div className="modal-content">
                                                                    <div className="modal-header d-block">
                                                                        <h5 className="modal-title" id="exampleModalLabel">
                                                                            Edit Blog
                                                                        </h5>
                                                                        <button style={{ right: '20px', top: '20px' }}
                                                                            type="button"
                                                                            className="btn-close"
                                                                            data-bs-dismiss="modal"
                                                                            aria-label="Close"
                                                                        ></button>
                                                                    </div>
                                                                    <div className="modal-body">
                                                                        <form className="row">
                                                                            <div className="col-lg-3">
                                                                                <div className="mb-3">
                                                                                    <label htmlFor="topic" className="form-label">
                                                                                        Topic <span className="text-danger">*</span>
                                                                                    </label>
                                                                                    <input
                                                                                        type="text"
                                                                                        id="topic"
                                                                                        name="topic"
                                                                                        placeholder="Enter Topic"
                                                                                        className="form-control inputcss"
                                                                                        value={formData.topic}
                                                                                        onChange={(e) =>
                                                                                            onChange(e.target.name, e.target.value)
                                                                                        }
                                                                                    />
                                                                                </div>
                                                                            </div>

                                                                            <div className="col-lg-3">
                                                                                <div className="mb-3">
                                                                                    <label
                                                                                        htmlFor="entity"
                                                                                        className="form-label"
                                                                                    >
                                                                                        Entity{" "}
                                                                                        <span className="text-danger">*</span>
                                                                                    </label>
                                                                                    <select
                                                                                        className="form-select inputcss"
                                                                                        id="entity"
                                                                                        name="entity"
                                                                                        value={formData.entity}
                                                                                        onChange={(e) =>
                                                                                            onChange(e.target.name, e.target.value)
                                                                                        }
                                                                                    >
                                                                                        <option value="">Select</option>
                                                                                        {EnityData.map((item, index) => (
                                                                                            <option key={index} value={item.id}>
                                                                                                {item.name}
                                                                                            </option>
                                                                                        ))}
                                                                                    </select>
                                                                                </div>
                                                                            </div>

                                                                            <div className="col-lg-3">
                                                                                <div className="mb-3">
                                                                                    <div className="d-flex justify-content-between">
                                                                                        <div>
                                                                                            <label
                                                                                                htmlFor="bannerImage"
                                                                                                className="form-label"
                                                                                            >
                                                                                                Banner Image{" "}
                                                                                                <span className="text-danger">*</span>
                                                                                            </label>
                                                                                        </div>
                                                                                        <div>
                                                                                            <div>
                                                                                                {
                                                                                                    BnnerImagepostArr[0] != false &&
                                                                                                        BnnerImagepostArr.length > 0 &&
                                                                                                        BnnerImagepostArr != undefined
                                                                                                        ? BnnerImagepostArr.length == 1 && (
                                                                                                            <a style={{ fontSize: "0.875rem" }}>
                                                                                                                <FontAwesomeIcon
                                                                                                                    icon={faPaperclip}
                                                                                                                />
                                                                                                                1 file Attached
                                                                                                            </a>
                                                                                                        )
                                                                                                        : ""
                                                                                                    // || BnnerImagepostArr.length > 0 && BnnerImagepostArr[0].files.length > 1 &&
                                                                                                    // (<a onClick={() => setShowModalFunc(true, "bannerimg")} style={{ fontSize: '0.875rem' }}>
                                                                                                    //   <FontAwesomeIcon icon={faPaperclip} /> {BnnerImagepostArr[0].files.length} files Attached
                                                                                                    // </a>)
                                                                                                }
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <input
                                                                                        type="file"
                                                                                        id="bannerImage"
                                                                                        name="bannerImage"
                                                                                        className="form-control inputcss"
                                                                                        onChange={(e) =>
                                                                                            onFileChange(e, "bannerimg", "Document")
                                                                                        }
                                                                                    />
                                                                                </div>
                                                                            </div>

                                                                            <div className="col-lg-3">
                                                                                <div className="mb-3">
                                                                                    <div className="d-flex justify-content-between">
                                                                                        <div>
                                                                                            <label
                                                                                                htmlFor="discussionGallery"
                                                                                                className="form-label"
                                                                                            >
                                                                                                Blog Gallery{" "}
                                                                                                <span className="text-danger">*</span>
                                                                                            </label>
                                                                                        </div>
                                                                                        <div>
                                                                                            {(ImagepostArr1.length > 0 &&
                                                                                                ImagepostArr1.length == 1 && (
                                                                                                    <a
                                                                                                        onClick={() =>
                                                                                                            setShowModalFunc(true, "Gallery")
                                                                                                        }
                                                                                                        style={{ fontSize: "0.875rem" }}
                                                                                                    >
                                                                                                        <FontAwesomeIcon
                                                                                                            icon={faPaperclip}
                                                                                                        />{" "}
                                                                                                        {ImagepostArr1.length} file Attached
                                                                                                    </a>
                                                                                                )) ||
                                                                                                (ImagepostArr1.length > 0 &&
                                                                                                    ImagepostArr1.length > 1 && (
                                                                                                        <a
                                                                                                            onClick={() =>
                                                                                                                setShowModalFunc(
                                                                                                                    true,
                                                                                                                    "Gallery"
                                                                                                                )
                                                                                                            }
                                                                                                            style={{ fontSize: "0.875rem" }}
                                                                                                        >
                                                                                                            <FontAwesomeIcon
                                                                                                                icon={faPaperclip}
                                                                                                            />{" "}
                                                                                                            {ImagepostArr1.length} files
                                                                                                            Attached
                                                                                                        </a>
                                                                                                    ))}
                                                                                        </div>
                                                                                    </div>
                                                                                    <input
                                                                                        type="file"
                                                                                        id="discussionforumGallery"
                                                                                        name="discussionforumGallery"
                                                                                        className="form-control inputcss"
                                                                                        multiple
                                                                                        onChange={(e) =>
                                                                                            onFileChange(
                                                                                                e,
                                                                                                "Gallery",
                                                                                                "DiscussionForumGallery"
                                                                                            )
                                                                                        }
                                                                                    />
                                                                                </div>
                                                                            </div>

                                                                            <div className="col-lg-12">
                                                                                <div className="mb-3">
                                                                                    <label
                                                                                        htmlFor="overview"
                                                                                        className="form-label"
                                                                                    >
                                                                                        Overview{" "}
                                                                                        <span className="text-danger">*</span>
                                                                                    </label>
                                                                                    <textarea
                                                                                        className="form-control inputcss"
                                                                                        id="overview"
                                                                                        placeholder="Enter Overview"
                                                                                        name="overview"
                                                                                        //style={{ height: "auto" }}
                                                                                        style={{ minHeight: "80px", maxHeight: "80px" }}
                                                                                        value={formData.overview}
                                                                                        onChange={(e) =>
                                                                                            onChange(e.target.name, e.target.value)
                                                                                        }
                                                                                    ></textarea>
                                                                                </div>
                                                                            </div>

                                                                            <div className="col-lg-12">
                                                                                <div className="mb-3">
                                                                                    <label
                                                                                        htmlFor="description"
                                                                                        className="form-label"
                                                                                    >
                                                                                        Description{" "}
                                                                                        <span className="text-danger">*</span>
                                                                                    </label>
                                                                                    <div
                                                                                        style={{
                                                                                            display: "contents",
                                                                                            justifyContent: "start",
                                                                                            width: "100px",
                                                                                        }}
                                                                                    >
                                                                                        <ReactQuill
                                                                                            theme="snow"
                                                                                            modules={modules}
                                                                                            formats={formats}
                                                                                            placeholder={"Write your content ..."}
                                                                                            value={richTextValues.description}
                                                                                            onChange={(content) => {
                                                                                                setRichTextValues((prevValues) => ({
                                                                                                    ...prevValues,
                                                                                                    ["description"]: content,
                                                                                                }));
                                                                                            }}
                                                                                            style={{
                                                                                                width: "100%",
                                                                                                fontSize: "6px",
                                                                                                // height: "100px",
                                                                                            }}
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                            {/* <div className="col-lg-4">
                                                                                <div className="mb-3">
                                                                                    <div className="d-flex justify-content-between">
                                                                                        <div>
                                                                                            <label
                                                                                                htmlFor="discussionThumbnail"
                                                                                                className="form-label"
                                                                                            >
                                                                                                Discussion Document
                                                                                                <span className="text-danger">*</span>
                                                                                            </label>
                                                                                        </div>
                                                                                        <div>
                                                                                            {(DocumentpostArr1.length > 0 &&
                                                                                                DocumentpostArr1.length == 1 && (
                                                                                                    <a
                                                                                                        onClick={() =>
                                                                                                            setShowModalFunc(true, "docs")
                                                                                                        }
                                                                                                        style={{ fontSize: "0.875rem" }}
                                                                                                    >
                                                                                                        <FontAwesomeIcon
                                                                                                            icon={faPaperclip}
                                                                                                        />{" "}
                                                                                                        {DocumentpostArr1.length} file
                                                                                                        Attached
                                                                                                    </a>
                                                                                                )) ||
                                                                                                (DocumentpostArr1.length > 0 &&
                                                                                                    DocumentpostArr1.length > 1 && (
                                                                                                        <a
                                                                                                            onClick={() =>
                                                                                                                setShowModalFunc(true, "docs")
                                                                                                            }
                                                                                                            style={{ fontSize: "0.875rem" }}
                                                                                                        >
                                                                                                            <FontAwesomeIcon
                                                                                                                icon={faPaperclip}
                                                                                                            />{" "}
                                                                                                            {DocumentpostArr1.length} files
                                                                                                            Attached
                                                                                                        </a>
                                                                                                    ))}
                                                                                        </div>
                                                                                    </div>
                                                                                    <input
                                                                                        type="file"
                                                                                        id="discussionforumThumbnail"
                                                                                        name="discussionforumThumbnail"
                                                                                        className="form-control inputcss"
                                                                                        multiple
                                                                                        onChange={(e) =>
                                                                                            onFileChange(
                                                                                                e,
                                                                                                "Docs",
                                                                                                "DiscussionForumDocs"
                                                                                            )
                                                                                        }
                                                                                    />
                                                                                </div>
                                                                            </div> */}


                                                                            <div className="text-center butncss">
                                                                                <div
                                                                                    className="btn btn-success waves-effect waves-light m-1"
                                                                                    style={{ fontSize: "0.875rem" }}
                                                                                    onClick={handleFormSaveasDraft}
                                                                                >
                                                                                    <div
                                                                                        className="d-flex"
                                                                                        style={{
                                                                                            justifyContent: "space-around",
                                                                                            width: "120px",
                                                                                        }}
                                                                                    >
                                                                                        <img
                                                                                            src={require("../../Assets/ExtraImage/checkcircle.svg")}
                                                                                            style={{ width: "1rem" }}
                                                                                            alt="Check"
                                                                                        />{" "}
                                                                                        Save as Draft
                                                                                    </div>
                                                                                </div>
                                                                                <div
                                                                                    className="btn btn-success waves-effect waves-light m-1"
                                                                                    style={{ fontSize: "0.875rem" }}
                                                                                    onClick={handleFormSubmit}
                                                                                >
                                                                                    <div
                                                                                        className="d-flex"
                                                                                        style={{
                                                                                            justifyContent: "space-around",
                                                                                            width: "70px",
                                                                                        }}
                                                                                    >
                                                                                        <img
                                                                                            src={require("../../Assets/ExtraImage/checkcircle.svg")}
                                                                                            style={{ width: "1rem" }}
                                                                                            alt="Check"
                                                                                        />{" "}
                                                                                        Publish
                                                                                    </div>
                                                                                </div>
                                                                                <button
                                                                                    type="button"
                                                                                    className="btn btn-light waves-effect waves-light m-1"
                                                                                    data-bs-dismiss="modal"
                                                                                    aria-label="Close"
                                                                                >
                                                                                    <img
                                                                                        src={require("../../Assets/ExtraImage/xIcon.svg")}
                                                                                        style={{ width: "1rem" }}
                                                                                        className="me-1"
                                                                                        alt="x"
                                                                                    />
                                                                                    Cancel
                                                                                </button>
                                                                            </div>
                                                                        </form>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="" style={{ position: 'relative' }}>
                                                        <div className="" onClick={() => toggleDropdown(item.Id)} key={item.Id}>
                                                            <Share2 size={22} color="#6c757d" strokeWidth={2} style={{ fontWeight: '400' }} />
                                                        </div>
                                                        {showDropdownId === item.Id && (
                                                            <div className="dropdown-menu dropcss" isMenuOpenshareref={menuRef}>
                                                                <a className="dropdown-item dropcssItem" onClick={() => sendanEmail(item)}>Share by email</a>
                                                                <a className="dropdown-item dropcssItem" onClick={() => copyToClipboard(item.Id)}>
                                                                    Copy Link
                                                                </a>
                                                                <a>{copySuccess && <span className="text-success">{copySuccess}</span>}</a>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <img color="#6c757d" width={"20px"} style={{ cursor: "pointer", height: '22px', fontWeight: '400' }}

                                                        //src={require("../../CustomAsset/unbookmark.png")}
                                                        src={Bookmarkstatus[item.ID] ? require("../../CustomAsset/bookmark.png") : require("../../CustomAsset/unbookmark.png")}

                                                        className="alignrightpin"
                                                        alt="pin"
                                                        onClick={(e) => togglePin(e, item.Id)}
                                                    />
                                                    {/* <Bookmark size={20} color="#6c757d" strokeWidth={2} style={{ fontWeight: '400' }} /> */}
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        ) : null}

                </div>
                {/* {itemsToShow < blogData.length && (
                    <div className="col-12 text-center mt-3 mb-3">
                        <button type='button' onClick={loadMore} className="btn btn-primary">
                            Load More
                        </button>
                    </div>
                )} */}
            </div></>

    )
}

export default CustomBlogWebpartTemplate