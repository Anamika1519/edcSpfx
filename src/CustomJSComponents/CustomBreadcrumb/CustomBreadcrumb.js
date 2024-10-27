import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import "bootstrap/dist/css/bootstrap.min.css";
import "../CustomBreadcrumb/CustomBreadcrumb.scss"
const CustomBreadcrumb = ({Breadcrumb}) => {
    return (
        <div className=''>
            <h4 className="page-title fw-bold mb-0 font-20">{Breadcrumb[1].ChildComponent}</h4>
            <ol className="breadcrumb m-0">
                <li className="breadcrumb-item"><a href={Breadcrumb[0].MainComponentURl}>{Breadcrumb[0].MainComponent}</a></li>
                <li className="breadcrumb-item pt-arr">
                    <FontAwesomeIcon
                        className="arrow-left"
                        icon={faChevronRight} size='xs' style={{color:'#6c757d'}}/>
                </li>
                <li className="breadcrumb-item active"><a href={Breadcrumb[1].ChildComponentURl}>{Breadcrumb[1].ChildComponent}</a></li>
            </ol>
        </div>
    )
}

export default CustomBreadcrumb