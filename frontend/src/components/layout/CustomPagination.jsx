import React, { useEffect, useState } from 'react';
import Pagination from "react-js-pagination";
import { useNavigate, useSearchParams } from "react-router-dom";

const CustomPagination = ({ resPerPage, filteredProductsCount, currentPage }) => {
    const [searchParams] = useSearchParams();
    const [CrrPage, setCrrPage] = useState(currentPage);
    const navigate = useNavigate();

    useEffect(() => {
        setCrrPage(currentPage);
    }, [currentPage]);

    const setCrrPageNo = (pageNumber) => {
        setCrrPage(pageNumber);

        searchParams.set("page", pageNumber);
        const path = window.location.pathname + "?" + searchParams.toString();
        navigate(path);
    };

    return (
        <div className='d-flex justify-content-center my-5'>
            {filteredProductsCount > resPerPage &&
                <Pagination
                    activePage={CrrPage}
                    itemsCountPerPage={resPerPage}
                    totalItemsCount={filteredProductsCount}
                    onChange={setCrrPageNo}
                    firstPageText={"First"}
                    lastPageText={"Last"}
                    nextPageText={"Next"}
                    prevPageText={"Prev"}
                    itemClass='page-item'
                    linkClass='page-link'
                />
            }
        </div>
    );
};

export default CustomPagination;
