import React, { useEffect, useRef, useState } from 'react';
import AdminLayout from '../layout/AdminLayout';
import { useDeleteProductImagesMutation, useGetProductDetailsQuery, useUploadProductImagesMutation } from '../../redux/api/productsApi';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import MetaData from "../layout/MetaData"
import Loader from '../layout/Loader';

const UploadProductImages = () => {
    const fileInputRef = useRef(null);
    const params = useParams();
    const navigate = useNavigate();

    const [uploadProductImages, { isLoading, isSuccess, error }] = useUploadProductImagesMutation(params?.id);

    const [deleteProductImages, { isLoading: deleteLoading, error: deleteError, isSuccess: deleteSuccess }] = useDeleteProductImagesMutation(params?.id);

    const [images, setImages] = useState([]);
    const [prevImages, setPrevImages] = useState([]);
    const [uploadedImages, setUploadedImages] = useState([]);


    const { data } = useGetProductDetailsQuery(params?.id);
    console.log(data?.product?.images)



    useEffect(() => {
        if (error) {
            toast.error(error?.data?.message || "An Error Occurred");
        }

        if (deleteError) {
            toast.error(deleteError?.data?.message || "An Error Occurred");
        }

        if (data?.product) {
            setUploadedImages(data?.product?.images)
        }
        if (isSuccess) {
            toast.success("Product Images Uploaded");
            navigate("/admin/products")
        }
        if (deleteSuccess) {
            toast.success("Product Image Deleted");
        }
    }, [error, isSuccess, navigate, data, deleteError, deleteSuccess])

    if (isLoading) return <Loader />

    const onChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files) return;

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setPrevImages((oldArray) => ([...oldArray, reader.result]));
                    setImages((oldArray) => ([...oldArray, reader.result]));;
                }
            };
            reader.readAsDataURL(file);
        });


    };

    const NewImageDeleteHandler = (image) => {
        const filteredNewImages = prevImages?.filter((img) =>
            img !== image
        )

        setPrevImages(filteredNewImages);
        setImages(filteredNewImages);
    }

    const HandleResetFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    const DeleteImage = (imgId) => {
        deleteProductImages({ id: params?.id, body: { imgId } })
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        if(fileInputRef.current.value === ""){
            return toast.error("Please select a file!")
        }
        uploadProductImages({ id: data?.product?._id, body: { images } });
    };

    return (
        <AdminLayout>
            <MetaData title={"Upload Product Images"} />
            <div className="row wrapper">
                <div className="col-10 col-lg-8 mt-5 mt-lg-0">
                    <form
                        className="shadow rounded bg-body"
                        onSubmit={handleSubmit}
                        encType="multipart/form-data"
                    >
                        <h2 className="mb-4">Upload Product Images</h2>

                        <div className="mb-3">
                            <label htmlFor="customFile" className="form-label">
                                Choose Images
                            </label>

                            <div className="custom-file">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    name="product_images"
                                    className="form-control"
                                    id="customFile"
                                    multiple
                                    onChange={onChange}
                                    onClick={HandleResetFileInput}
                                />
                            </div>

                            {/* New Images */}
                            <div className="new-images my-4">
                                <p className="text-warning">New Images:</p>
                                <div className="row mt-4">

                                    {prevImages && (
                                        prevImages?.map((img) => (
                                            <div className="col-md-3 mt-2">
                                                <div className="card">
                                                    <img
                                                        src={img}
                                                        alt="Card"
                                                        className="card-img-top p-2"
                                                        style={{ width: '100%', height: '80px' }}
                                                    />
                                                    <button
                                                        style={{ backgroundColor: '#dc3545', borderColor: '#dc3545' }}
                                                        type="button"
                                                        className="btn btn-block btn-danger cross-button mt-1 py-0"
                                                        onClick={() => NewImageDeleteHandler(img)}
                                                    >
                                                        <i className="fa fa-times"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}


                                </div>
                            </div>
                            {/* End New Images */}

                            {uploadedImages && <div className="uploaded-images my-4">
                                <p className="text-success">Product Uploaded Images:</p>
                                <div className="row mt-1">
                                    {uploadedImages?.map((img) => (
                                        <div className="col-md-3 mt-2">
                                            <div className="card">
                                                <img
                                                    src={img?.url}
                                                    alt="Card"
                                                    className="card-img-top p-2"
                                                    style={{ width: '100%', height: '80px' }}
                                                />
                                                <button
                                                    style={{ backgroundColor: '#dc3545', borderColor: '#dc3545' }}
                                                    className="btn btn-block btn-danger cross-button mt-1 py-0"
                                                    disabled={isLoading || deleteLoading}
                                                    type="button"
                                                    onClick={() => DeleteImage(img?.public_id)}
                                                >
                                                    <i className="fa fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>}
                        </div>

                        <button id="register_button" type="submit" className="btn w-100 py-2" disabled={isLoading || deleteLoading}>
                            {(isLoading) ? <span className='spinner-border spinner-border-sm'></span> : "Upload"}
                        </button>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};

export default UploadProductImages;
