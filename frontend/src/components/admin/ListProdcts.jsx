import React, { useEffect } from 'react';
import { MDBDataTable } from "mdbreact";
import Loader from "../layout/Loader";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import MetaData from "../layout/MetaData"
import { useDeleteProductMutation, useGetAdminProductsQuery } from '../../redux/api/productsApi';
import AdminLayout from "../layout/AdminLayout"

const ListProducts = () => {

    const { data, isLoading, error } = useGetAdminProductsQuery();

    const [deleteProduct,{isLoading: deleteLoading , isSuccess : deleteSuccess}] = useDeleteProductMutation();

    useEffect(() => {
        if (error) {
            toast.error(error?.data?.message || "An Error Occurred");
        }
        if (deleteSuccess) {
            toast.success("Product Deleted Successfully");
        }
    }, [error,deleteSuccess])


    if (isLoading) return <Loader />;


    const deleteProductHandler = (id) => {
        deleteProduct(id);
    }

    const setProducts = () => {
        // Create the orders object here
        const products = {
            columns: [
                {
                    label: "ID",
                    field: "id",
                    sort: "asc"
                },
                {
                    label: "Name",
                    field: "name",
                    sort: "asc"
                },
                {
                    label: "Stock",
                    field: "stock",
                    sort: "asc"
                },
                {
                    label: "Actions",
                    field: "actions",
                    sort: "asc"
                }
            ],
            rows: [],
        };

        data?.products?.forEach((product) => {
            products.rows.push({
                id: product?._id,
                name: `${product?.name.substring(0,20)}...`,
                stock: product?.stock,
                actions: (
                    <>
                        <Link to={`/admin/products/${product?._id}`} className="btn btn-outline-primary">
                            <i className='fa fa-pencil'></i>
                        </Link>
                        <Link to={`/admin/products/${product?._id}/upload_images`} className='btn btn-success ms-2'>
                            <i className='fa fa-image'></i>
                        </Link>
                        <button className='btn btn-outline-danger ms-2' disabled={deleteLoading} onClick={()=>deleteProductHandler(product?._id)}>
                            <i className='fa fa-trash'></i>
                        </button>
                    </>
                )
            })
        })

        return products;
    };

    return (
        <>
            <AdminLayout>
                <MetaData title={"All Products"} />
                <h1 className='my-5'>{data?.products?.length} Products</h1>
                <MDBDataTable
                    data={setProducts()}
                    className='px-3'
                    bordered
                    striped
                    hover
                />
            </AdminLayout>
        </>
    );
};

export default ListProducts;
