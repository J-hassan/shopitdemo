import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import AdminLayout from "../layout/AdminLayout";
import { useDeleteProductReviewMutation, useLazyGetProductReviewsQuery } from '../../redux/api/productsApi';
import { MDBDataTable } from "mdbreact";


const ProductReviews = () => {

    // const navigate = useNavigate();
    const [productId, setProductId] = useState("");

    const [getProductReviews, { data,isLoading, error }] = useLazyGetProductReviewsQuery();

    const [deleteProductReview, {isLoading : deleteLoading, error : deleteError, isSuccess }] = useDeleteProductReviewMutation();


    useEffect(() => {

        if (error) {
            toast.error(error?.data?.message || "An error occurred");
        }
        
        if (deleteError) {
            toast.error(deleteError?.data?.message || "An error occurred");
        }
        if(isSuccess){
            toast.success("Product Review Deleted Successfully")
        }

    }, [error,deleteError,isSuccess])

    const deleteReviewHandler = (id) => {
        deleteProductReview({productId,id})
    }

    const setReviews = () => {
        // Create the orders object here
        const reviews = {
            columns: [
                {
                    label: "ID",
                    field: "id",
                    sort: "asc"
                },
                {
                    label: "Rating",
                    field: "rating",
                    sort: "asc"
                },
                {
                    label: "Comment",
                    field: "comment",
                    sort: "asc"
                },
                {
                    label : "User",
                    field : "user",
                    sort : "asc"
                },
                {
                    label: "Actions",
                    field: "actions",
                    sort: "asc"
                }
            ],
            rows: [],
        };

        data?.reviews?.forEach((review) => {
            reviews.rows.push({
                id: review?._id,
                rating : review.rating,
                comment: `${review?.comment.substring(0, 20)}...`,
                user: review?.user?.name,
                actions: (
                    <>
                        <button className='btn btn-outline-danger ms-2' disabled={deleteLoading} onClick={()=>deleteReviewHandler(review?._id)}>
                            <i className='fa fa-trash'></i>
                        </button>
                    </>
                )
            })
        })

        return reviews;
    };



    const submitHandler = (e) => {
        e.preventDefault();
        getProductReviews(productId);
    }


    return (
        <AdminLayout>
            <div className="row justify-content-center my-5">
                <div className="col-6">
                    <form onSubmit={submitHandler}>
                        <div className="mb-3">
                            <label htmlFor="productId_field" className="form-label">
                                Enter Product ID
                            </label>
                            <input
                                type="text"
                                id="productId_field"
                                className="form-control"
                                value={productId}
                                onChange={(e) => setProductId(e.target.value)}
                            />
                        </div>

                        <button
                            id="search_button"
                            type="submit"
                            className="btn btn-primary w-100 py-2"
                            disabled={isLoading}
                        >
                            SEARCH
                        </button>
                    </form>
                </div>
            </div>

            <h5 className="mt-3 text-center">Product name: <b></b></h5>

            <MDBDataTable
                data={setReviews()}
                className='px-3'
                bordered
                striped
                hover
            />

        </AdminLayout>
    )
}

export default ProductReviews;