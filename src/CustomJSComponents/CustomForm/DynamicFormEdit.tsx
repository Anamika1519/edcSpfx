// import * as React from 'react';
// import "bootstrap/dist/css/bootstrap.min.css";
// import 'react-quill/dist/quill.snow.css';
// import ReactQuill from 'react-quill';
// import { uploadFileToLibrary } from '../../APISearvice/AnnouncementsService';
// import "../../CustomCss/mainCustom.scss";
// import "./CustomForm.scss";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faDeleteLeft, faPaperclip, faRemove } from '@fortawesome/free-solid-svg-icons';
// import { Modal } from 'react-bootstrap';
// import SweetAlert from 'react-bootstrap-sweetalert';
// import  { fireAlert } from "../SweetAlert2Components/SweetAlert2";
// import Swal from 'sweetalert2';

// interface FormField {
//     type: string;
//     name: string;
//     label: string;
//     docLib?: string;
//     placeholder?: string;
//     options?: any[];
//     required: boolean;
//   }

//   interface DynamicFormProps {
//     formSchemas: FormField[];
//     initialValues: { [key: string]: any };
//     onChange: (name: string, value: any) => void;
//     onSubmit: (values: { [key: string]: any }, bannerImages: any[], galleryImages: any[], documents: any[]) => void;
//     onCancel: () => void;
//     sp:any;
//     Spurl:any
//   }

//   const DynamicFormEdit: React.FC<DynamicFormProps> = ({ formSchemas, initialValues, onChange, onSubmit, onCancel,sp,Spurl }) => {
//     const [values, setValues] = React.useState<{ [key: string]: any }>(initialValues);
//     const [bannerImages, setBannerImages] = React.useState<File[]>([]);
//     const [galleryImages, setGalleryImages] = React.useState<File[]>([]);
//     const [documents, setDocuments] = React.useState<File[]>([]);

//     React.useEffect(() => {
//       setValues(initialValues);
//     }, [initialValues]);

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//         const { name, value, type, checked, files } :any= e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

//         if (type === 'file') {
//           if (name === 'bannerimg') setBannerImages(files ? Array.from(files) : []);
//           else if (name === 'Gallery') setGalleryImages(files ? Array.from(files) : []);
//           else if (name === 'docs') setDocuments(files ? Array.from(files) : []);
//         } else if (type === 'checkbox') {
//           setValues(prevValues => ({
//             ...prevValues,
//             [name]: checked
//           }));
//           onChange(name, checked);
//         } else {
//           setValues(prevValues => ({
//             ...prevValues,
//             [name]: value
//           }));
//           onChange(name, value);
//         }
//       };
//     const handleSubmit = (e: React.FormEvent) => {
//       e.preventDefault();
//       onSubmit(values, bannerImages, galleryImages, documents);
//     };

//     return (
//       <form onSubmit={handleSubmit}>
//         {formSchemas.map((field, index) => {
//           const { type, name, label, placeholder, options, required } = field;

//           return (
//             <div key={index} className="form-group">
//               <label htmlFor={name}>{label}</label>
//               {type === 'text' && (
//                 <input
//                   type="text"
//                   id={name}
//                   name={name}
//                   placeholder={placeholder}
//                   value={values[name] || ''}
//                   onChange={handleInputChange}
//                   className="form-control"
//                   required={required}
//                 />
//               )}
//               {type === 'textarea' && (
//                 <textarea
//                   id={name}
//                   name={name}
//                   placeholder={placeholder}
//                   value={values[name] || ''}
//                   onChange={handleInputChange}
//                   className="form-control"
//                   required={required}
//                 />
//               )}
//               {type === 'select' && options && (
//                 <select
//                   id={name}
//                   name={name}
//                   value={values[name] || ''}
//                   onChange={handleInputChange}
//                   className="form-control"
//                   required={required}
//                 >
//                   {options.map((option, index) => (
//                     <option key={index} value={option.id}>{option.name}</option>
//                   ))}
//                 </select>
//               )}
//               {type === 'file' && (
//                 <input
//                   type="file"
//                   id={name}
//                   name={name}
//                   onChange={handleInputChange}
//                   className="form-control"
//                   required={required}
//                   multiple
//                 />
//               )}
//               {type === 'checkbox' && (
//                 <input
//                   type="checkbox"
//                   id={name}
//                   name={name}
//                   checked={values[name] || false}
//                   onChange={handleInputChange}
//                   className="form-check-input"
//                 />
//               )}
//               {type === 'richtext' && (
//                 <textarea
//                   id={name}
//                   name={name}
//                   placeholder={placeholder}
//                   value={values[name] || ''}
//                   onChange={handleInputChange}
//                   className="form-control richtext-editor"
//                   required={required}
//                 />
//               )}
//             </div>
//           );
//         })}
//         <button type="submit" className="btn btn-primary">Submit</button>
//         <button type="button" onClick={onCancel} className="btn btn-secondary">Cancel</button>
//       </form>
//     );
//   };

//   export default DynamicFormEdit;

//last use code
// import * as React from 'react';
// import "bootstrap/dist/css/bootstrap.min.css";
// import 'react-quill/dist/quill.snow.css';
// import ReactQuill from 'react-quill';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faDeleteLeft, faPaperclip, faRemove, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
// import { Modal } from 'react-bootstrap';
// import SweetAlert from 'react-bootstrap-sweetalert';
// import Swal from 'sweetalert2';
// import "../CustomForm/CustomForm.scss";
// import "../../Assets/Figtree/Figtree-VariableFont_wght.ttf";

// interface FormField {
//     type: string;
//     name: string;
//     label: string;
//     docLib?: string;
//     placeholder?: string;
//     options?: any[];
//     required: boolean;
// }

// interface DynamicFormProps {
//     formSchemas: FormField[];
//     initialValues: { [key: string]: any };
//     onChange: (name: string, value: any) => void;
//     onSubmit: (values: { [key: string]: any }, bannerImages: any[], galleryImages: any[], documents: any[]) => void;
//     onCancel: () => void;
//     sp: any;
//     Spurl: any;
// }

// const DynamicFormEdit: React.FC<DynamicFormProps> = ({ formSchemas, initialValues, onChange, onSubmit, onCancel, sp, Spurl }) => {
//     console.log(initialValues);
    
    
//     const [values, setValues] = React.useState<{ [key: string]: any }>(initialValues);
//     const [schemas, setSchemas] = React.useState<FormField[]>(formSchemas);
//     const [bannerImages, setBannerImages] = React.useState<File[]>([]);
//     const [galleryImages, setGalleryImages] = React.useState<File[]>([]);
//     const [documents, setDocuments] = React.useState<File[]>([]);
//     const formats = [
//         "header", "height", "bold", "italic",
//         "underline", "strike", "blockquote",
//         "list", "color", "bullet", "indent",
//         "link", "image", "align", "size",
//     ];

//     const modules = {
//         toolbar: [
//             [{ size: ["small", false, "large", "huge"] }],
//             ["bold", "italic", "underline", "strike", "blockquote"],
//             [{ list: "ordered" }, { list: "bullet" }],
//             ["link", "image"],
//             [
//                 { list: "ordered" },
//                 { list: "bullet" },
//                 { indent: "-1" },
//                 { indent: "+1" }
//             ],
//             [{ "color": ["#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466", 'custom-color'] }],
//         ]
//     };
//     // Parsing the data array and setting initial values
//     const parseData = (data: any) => {
//         console.log(data,'datadafafaf')
//         const parsedValues: { [key: string]: any } = {
//             Title: data.Title,
//             Description: data.Description,
//             Overview: data.Overview,
//             IsActive: data.IsActive,
//             // other fields as needed
//         };
//         return parsedValues;
//     };

//     React.useEffect(() => {
        
//         // const data = {
//         //     Title: "Al Rostamani Pegel awarded Corporate Social Responsibility (CSR) Label 2015 by Dubai Chamber of Commerce and Industry",
//         //     Description: "<div>Al Rostamani Pegel awarded Corporate Social Responsibility...</div>",
//         //     Overview: "Al Rostamani Pegel awarded Corporate Social Responsibility (CSR) Label 2015 by Dubai Chamber of Commerce and Industry",
//         //     IsActive: true,
//         //     AnnouncementandNewsBannerImage: {
//         //         fileName: "blog1.png",
//         //         serverRelativeUrl: "/sites/AlRostmani/SiteAssets/Lists/a6432673-c28a-4d23-b736-7cc02ca46a53/blog1.png",
//         //         id: "15c3f514-0d0f-48b5-b937-a4f7ada9bd70",
//         //         serverUrl: "https://officeindia.sharepoint.com",
//         //     },
//         //     AnnouncementsAndNewsDocsId: [30, 31],
//         //     AnnouncementAndNewsGallaryId: [1, 3, 4, 2],
//         // };
//         if(initialValues.length>0)
//         {
//             setValues(parseData(initialValues));
//         }
      
//     }, []);

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//         const { name, value, type, checked, files }: any = e.target;

//         if (type === 'file') {
//             if (name === 'bannerimg') setBannerImages(files ? Array.from(files) : []);
//             else if (name === 'Gallery') setGalleryImages(files ? Array.from(files) : []);
//             else if (name === 'docs') setDocuments(files ? Array.from(files) : []);
//         } else if (type === 'checkbox') {
//             setValues(prevValues => ({
//                 ...prevValues,
//                 [name]: checked
//             }));
//             onChange(name, checked);
//         } else {
//             setValues(prevValues => ({
//                 ...prevValues,
//                 [name]: value
//             }));
//             onChange(name, value);
//         }
//     };

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         onSubmit(values, bannerImages, galleryImages, documents);
//     };

//     const handleAddField = () => {
//         const newField: FormField = {
//             type: 'text',
//             name: `newField${schemas.length}`,
//             label: `New Field ${schemas.length + 1}`,
//             required: false
//         };
//         setSchemas([...schemas, newField]);
//     };

//     const handleRemoveField = (name: string) => {
//         setSchemas(schemas.filter(field => field.name !== name));
//         const updatedValues = { ...values };
//         delete updatedValues[name];
//         setValues(updatedValues);
//         onChange(name, undefined);
//     };

//     return (
//         <div className="card cardcss mt-3">
//         <div className="card-body">
//             <div className="row mt-2">
//             <form className='row' onSubmit={handleSubmit}>
//                 {schemas.map((field, index) => {
//                     const { type, name, label, placeholder, options, required } = field;

//                     return (
//                         <>

//                             {type === 'text' && (
//                                 <div className="col-md-4 mb-3" key={index}>
//                                     <label className="form-label" htmlFor={field.name}>{field.label}</label>
//                                     <input
//                                         type="text"
//                                         id={name}
//                                         name={name}
//                                         placeholder={placeholder}
//                                         value={values[name] || ''}
//                                         onChange={handleInputChange}
//                                         className="form-control inputcss"
//                                         required={required} />
//                                 </div>
//                             )}

//                             {type === 'textarea' && (
//                                 <div className="col-md-4 mb-3" key={index}>
//                                     <label className="form-label" htmlFor={field.name}>{field.label}</label>
//                                     <textarea
//                                         id={name}
//                                         name={name}
//                                         placeholder={placeholder}
//                                         value={values[name] || ''}
//                                         onChange={handleInputChange}
//                                         className="form-control"
//                                         required={required} />
//                                 </div>
//                             )}

//                             {type === 'select' && options && (
//                                 <div className="col-md-4 mb-3" key={index}>
//                                     <label className="form-label" htmlFor={field.name}>{field.label}</label>
//                                     <select
//                                         id={name}
//                                         name={name}
//                                         value={values[name] || ''}
//                                         onChange={handleInputChange}
//                                         className="form-select inputcss"
//                                         required={required}
//                                     >
//                                         {options.map((option, index) => (
//                                             <option key={index} value={option.id}>{option.name}</option>
//                                         ))}
//                                     </select>
//                                 </div>
//                             )}

//                             {type === 'file' && (
//                                 <div className="col-md-4 mb-3" key={index}>
//                                     <label className="form-label" htmlFor={field.name}>{field.label}</label>
//                                     <input
//                                         type="file"
//                                         id={name}
//                                         name={name}
//                                         onChange={handleInputChange}
//                                         className="form-control inputcss"
//                                         required={required}
//                                         multiple />
//                                 </div>
//                             )}

//                             {type === 'checkbox' && (
//                                 <div className="col-md-4 mb-3" key={index}>
//                                     <label className="form-label" htmlFor={field.name}>{field.label}</label>
//                                     <br/>
//                                     <input
//                                         type="checkbox"
//                                         id={name}
//                                         name={name}
//                                         checked={values[name] || false}
//                                         onChange={handleInputChange}
//                                         className="form-check-input" />
//                                 </div>
//                             )}



//                             {type === 'richtext' && (
//                                 <div className="col-md-4 mb-3" key={index}>
//                                     <label className="form-label" htmlFor={field.name}>{field.label}</label>
//                                     <div style={{ display: "grid", justifyContent: "start" }}>
//                                         <ReactQuill
//                                             id={name}
//                                             value={values[name] || ''}
//                                             onChange={(content) => setValues({ ...values, [name]: content })}
//                                             placeholder={placeholder}
//                                             theme="snow"
//                                             style={{ width: '100%', fontSize: '6px' }}
//                                             modules={modules}
//                                             formats={formats} />
//                                     </div>
//                                 </div>
//                             )}
//                        </>
//                 )})}
//                 <div className="text-center butncss">
//                                 <button type="submit" className="btn btn-success waves-effect waves-light m-1" style={{ fontSize: '0.875rem' }}>
//                                     <div className='d-flex' style={{ justifyContent: 'space-around', width: '70px' }}>
//                                         <img src={require('../../Assets/ExtraImage/checkcircle.svg')} style={{ width: '1rem' }} alt="Check" /> Submit
//                                     </div>
//                                 </button>
//                                 <button type="button" className="btn btn-light waves-effect waves-light m-1" style={{ fontSize: '0.875rem' }} onClick={onCancel}>
//                                     <img src={require('../../Assets/ExtraImage/xIcon.svg')} style={{ width: '1rem' }}
//                                         className='me-1' alt="x" />
//                                     Cancel
//                                 </button>
//                             </div>
//             </form>
//         </div>
//         </div>
//         </div>
//     );
// };

// export default DynamicFormEdit;
// interface FormField {
//     type: string;
//     name: string;
//     label: string;
//     docLib?: string;
//     placeholder?: string;
//     options?: any[];
//     required: boolean;
// }

// interface DynamicFormProps {
//     formSchemas: FormField[];
//     initialValues: { [key: string]: any };
//     onChange: (name: string, value: any) => void;
//     onSubmit: (values: { [key: string]: any }, bannerImages: any[], galleryImages: any[], documents: any[]) => void;
//     onCancel: () => void;
//     sp: any;
//     Spurl: any;
// }

// const DynamicFormEdit: React.FC<DynamicFormProps> = ({ formSchemas, initialValues, onChange, onSubmit, onCancel, sp, Spurl }) => {
//     console.log(initialValues,'initialValues');
    
//     const [values, setValues] = React.useState<{ [key: string]: any }>(initialValues);
//     const [schemas, setSchemas] = React.useState<FormField[]>(formSchemas);
//     const [bannerImages, setBannerImages] = React.useState<File[]>([]);
//     const [galleryImages, setGalleryImages] = React.useState<File[]>([]);
//     const [documents, setDocuments] = React.useState<File[]>([]);

//     React.useEffect(() => {
//         setValues(initialValues);
//     }, [initialValues]);

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//         const { name, value, type, checked, files }: any = e.target;

//         if (type === 'file') {
//             if (name === 'bannerimg') setBannerImages(files ? Array.from(files) : []);
//             else if (name === 'Gallery') setGalleryImages(files ? Array.from(files) : []);
//             else if (name === 'docs') setDocuments(files ? Array.from(files) : []);
//         } else if (type === 'checkbox') {
//             setValues(prevValues => ({
//                 ...prevValues,
//                 [name]: checked
//             }));
//             onChange(name, checked);
//         } else {
//             setValues(prevValues => ({
//                 ...prevValues,
//                 [name]: value
//             }));
//             onChange(name, value);
//         }
//     };

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         onSubmit(values, bannerImages, galleryImages, documents);
//     };

//     const handleAddField = () => {
//         const newField: FormField = {
//             type: 'text',
//             name: `newField${schemas.length}`,
//             label: `New Field ${schemas.length + 1}`,
//             required: false
//         };
//         setSchemas([...schemas, newField]);
//     };

//     const handleRemoveField = (name: string) => {
//         setSchemas(schemas.filter(field => field.name !== name));
//         const updatedValues = { ...values };
//         delete updatedValues[name];
//         setValues(updatedValues);
//         onChange(name, undefined);  // Notify parent of field removal
//     };

//     return (
//         <div>
//             <button type="button" className="btn btn-success mb-3" onClick={handleAddField}>
//                 <FontAwesomeIcon icon={faPlus} /> Add Field
//             </button>
//             <form onSubmit={handleSubmit}>
//                 {schemas.map((field, index) => {
//                     const { type, name, label, placeholder, options, required } = field;

//                     return (
//                         <div key={index} className="form-group">
//                             <label htmlFor={name}>{label}</label>
//                             <div className="d-flex">
//                                 {type === 'text' && (
//                                     <input
//                                         type="text"
//                                         id={name}
//                                         name={name}
//                                         placeholder={placeholder}
//                                         value={values[name] || ''}
//                                         onChange={handleInputChange}
//                                         className="form-control"
//                                         required={required}
//                                     />
//                                 )}
//                                 {type === 'textarea' && (
//                                     <textarea
//                                         id={name}
//                                         name={name}
//                                         placeholder={placeholder}
//                                         value={values[name] || ''}
//                                         onChange={handleInputChange}
//                                         className="form-control"
//                                         required={required}
//                                     />
//                                 )}
//                                 {type === 'select' && options && (
//                                     <select
//                                         id={name}
//                                         name={name}
//                                         value={values[name] || ''}
//                                         onChange={handleInputChange}
//                                         className="form-control"
//                                         required={required}
//                                     >
//                                         {options.map((option, index) => (
//                                             <option key={index} value={option.id}>{option.name}</option>
//                                         ))}
//                                     </select>
//                                 )}
//                                 {type === 'file' && (
//                                     <input
//                                         type="file"
//                                         id={name}
//                                         name={name}
//                                         onChange={handleInputChange}
//                                         className="form-control"
//                                         required={required}
//                                         multiple
//                                     />
//                                 )}
//                                 {type === 'checkbox' && (
//                                     <input
//                                         type="checkbox"
//                                         id={name}
//                                         name={name}
//                                         checked={values[name] || false}
//                                         onChange={handleInputChange}
//                                         className="form-check-input"
//                                     />
//                                 )}
//                                 {type === 'richtext' && (
//                                     <ReactQuill
//                                         id={name}
//                                         value={values[name] || ''}
//                                         onChange={(content) => handleInputChange}
//                                         className="form-control richtext-editor"
//                                         placeholder={placeholder}
//                                         theme="snow"
//                                     />
//                                 )}
//                                 <button type="button" className="btn btn-danger ml-2" onClick={() => handleRemoveField(name)}>
//                                     <FontAwesomeIcon icon={faTrash} />
//                                 </button>
//                             </div>
//                         </div>
//                     );
//                 })}
//                 <button type="submit" className="btn btn-primary">Submit</button>
//                 <button type="button" onClick={onCancel} className="btn btn-secondary">Cancel</button>
//             </form>
//         </div>
//     );
// };

// export default DynamicFormEdit;
import * as React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDeleteLeft, faPaperclip, faRemove, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Modal } from 'react-bootstrap';
import SweetAlert from 'react-bootstrap-sweetalert';
import Swal from 'sweetalert2';
import "../CustomForm/CustomForm.scss";
import "../../Assets/Figtree/Figtree-VariableFont_wght.ttf";

interface FormField {
    type: string;
    name: string;
    label: string;
    docLib?: string;
    placeholder?: string;
    options?: any[];
    required: boolean;
}

interface DynamicFormProps {
    formSchemas: FormField[];
    initialValues: { [key: string]: any };
    onChange: (name: string, value: any) => void;
    onSubmit: (values: { [key: string]: any }, bannerImages: any[], galleryImages: any[], documents: any[]) => void;
    onCancel: () => void;
    sp: any;
    Spurl: any;
}

const DynamicFormEdit: React.FC<DynamicFormProps> = ({ formSchemas, initialValues, onChange, onSubmit, onCancel, sp, Spurl }) => {
    const [values, setValues] = React.useState<{ [key: string]: any }>(initialValues);
    const [schemas, setSchemas] = React.useState<FormField[]>(formSchemas);
    const [bannerImages, setBannerImages] = React.useState<File[]>([]);
    const [galleryImages, setGalleryImages] = React.useState<File[]>([]);
    const [documents, setDocuments] = React.useState<File[]>([]);

    // Formats and modules for ReactQuill
    const formats = [
        "header", "height", "bold", "italic",
        "underline", "strike", "blockquote",
        "list", "color", "bullet", "indent",
        "link", "image", "align", "size",
    ];

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
                { indent: "+1" }
            ],
            [{ "color": ["#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466", 'custom-color'] }],
        ]
    };

    // Parsing the data array and setting initial values
    const parseData = (data: any) => {
        return {
            ...data,
            Title: data.Title || '',
            description: data.description || '',
            overview: data.overview || '',
            IsActive: data.IsActive || false,
            // other fields as needed
        };
    };

    // Ensure the initial values are correctly set when the component mounts or the initialValues change
    React.useEffect(() => {
        setValues(parseData(initialValues));
    }, [initialValues]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type, checked, files }: any = e.target;

        if (type === 'file') {
            if (name === 'bannerimg') setBannerImages(files ? Array.from(files) : []);
            else if (name === 'Gallery') setGalleryImages(files ? Array.from(files) : []);
            else if (name === 'docs') setDocuments(files ? Array.from(files) : []);
        } else if (type === 'checkbox') {
            setValues(prevValues => ({
                ...prevValues,
                [name]: checked
            }));
            onChange(name, checked);
        } else {
            setValues(prevValues => ({
                ...prevValues,
                [name]: value
            }));
            onChange(name, value);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(values, bannerImages, galleryImages, documents);
    };

    return (
        <div className="card cardcss mt-3">
            <div className="card-body">
                <div className="row mt-2">
                    <form className='row' onSubmit={handleSubmit}>
                        {formSchemas.map((field, index) => {
                            const { type, name, label, placeholder, options, required } = field;

                            return (
                                <React.Fragment key={index}>
                                    {type === 'text' && (
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label" htmlFor={field.name}>{field.label}</label>
                                            <input
                                                type="text"
                                                id={field.name}
                                                name={field.name}
                                                placeholder={placeholder}
                                                value={values[name] || ''}
                                                onChange={handleInputChange}
                                                className="form-control inputcss"
                                                required={required}
                                            />
                                        </div>
                                    )}

                                    {type === 'textarea' && (
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label" htmlFor={field.name}>{field.label}</label>
                                            <textarea
                                                id={field.name}
                                                name={field.name}
                                                placeholder={placeholder}
                                                value={values[name] || ''}
                                                onChange={handleInputChange}
                                                className="form-control"
                                                required={required}
                                            />
                                        </div>
                                    )}

                                    {type === 'select' && options && (
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label" htmlFor={field.name}>{field.label}</label>
                                            <select
                                                id={field.name}
                                                name={field.name}
                                                value={values[name] || ''}
                                                onChange={handleInputChange}
                                                className="form-select inputcss"
                                                required={required}
                                            >
                                                {options.map((option, idx) => (
                                                    <option key={idx} value={option.id}>{option.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    {type === 'file' && (
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label" htmlFor={field.name}>{field.label}</label>
                                            <input
                                                type="file"
                                                id={field.name}
                                                name={field.name}
                                                onChange={handleInputChange}
                                                className="form-control inputcss"
                                                required={required}
                                                multiple
                                            />
                                        </div>
                                    )}

                                    {type === 'checkbox' && (
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label" htmlFor={field.name}>{field.label}</label>
                                            <br />
                                            <input
                                                type="checkbox"
                                                id={field.name}
                                                name={field.name}
                                                checked={values[name] || false}
                                                onChange={handleInputChange}
                                                className="form-check-input"
                                            />
                                        </div>
                                    )}

                                    {type === 'richtext' && (
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label" htmlFor={field.name}>{field.label}</label>
                                            <div style={{ display: "grid", justifyContent: "start" }}>
                                                <ReactQuill
                                                    id={field.name}
                                                    value={values[name] || ''}
                                                    onChange={(content) => setValues({ ...values, [name]: content })}
                                                    placeholder={placeholder}
                                                    theme="snow"
                                                    style={{ width: '100%' }}
                                                    modules={modules}
                                                    formats={formats}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </React.Fragment>
                            );
                        })}
                        <div className="text-center butncss">
                            <button type="submit" className="btn btn-success waves-effect waves-light m-1" style={{ fontSize: '0.875rem' }}>
                                <div className='d-flex' style={{ justifyContent: 'space-around', width: '70px' }}>
                                    <img src={require('../../Assets/ExtraImage/checkcircle.svg')} style={{ width: '1rem' }} alt="Check" /> Submit
                                </div>
                            </button>
                            <button type="button" className="btn btn-light waves-effect waves-light m-1" style={{ fontSize: '0.875rem' }} onClick={onCancel}>
                                <img src={require('../../Assets/ExtraImage/xIcon.svg')} style={{ width: '1rem' }}
                                    className='me-1' alt="x" />
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DynamicFormEdit;
