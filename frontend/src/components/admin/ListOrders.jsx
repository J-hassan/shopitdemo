import React, { useEffect } from 'react';
import { MDBDataTable } from "mdbreact";
import Loader from "../layout/Loader";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import MetaData from "../layout/MetaData"
import AdminLayout from "../layout/AdminLayout"
import { useDeleteAdminOrderMutation, useGetAdminOrdersQuery } from '../../redux/api/orderApi';

const ListOrders = () => {

    const { data, isLoading, error } = useGetAdminOrdersQuery();

    const navigate = useNavigate()

    const [deleteAdminOrder,{isLoading : deleteLoading , error : deleteError , isSuccess : deleteSuccess}] = useDeleteAdminOrderMutation();

    useEffect(() => {
        if (error) {
            toast.error(error?.data?.message || "An Error Occurred");
        }
        if(deleteError){
            toast.error(deleteError?.data?.message || "An Error Occurred");
        }
        if (deleteSuccess) {
            toast.success("Order Deleted Successfully");
        }
    }, [error,deleteSuccess,deleteError])


    if (isLoading) return <Loader />;

    const deleteOrderHandler = (id)=>{
        deleteAdminOrder(id);
        navigate("/admin/orders")
    }

    const setOrders = () => {
        // Create the orders object here
        const orders = {
            columns: [
                {
                    label : "ID",
                    field : "id",
                    sort : "asc"
                },
                {
                    label : "Payment Status",
                    field : "status",
                    sort : "asc"
                },
                {
                    label : "Order Status",
                    field : "orderStatus",
                    sort : "asc"
                },
                {
                    label : "Actions",
                    field : "actions",
                    sort : "asc"
                }
            ],
            rows: [],
        };

        data?.orders?.forEach((order)=>{
            orders.rows.push({
                id : order?._id,
                status : order?.paymentInfo.status,
                orderStatus : order?.orderStatus,
                actions : (
                    <>
                    <Link to={`/admin/orders/${order?._id}`} className="btn btn-primary">
                        <i className='fa fa-pencil'></i>
                    </Link>
                    <button to={`/admin/orders/${order?._id}`} className='btn btn-success ms-2' onClick={()=> deleteOrderHandler(order?._id)}>
                        <i className='fa fa-trash'></i>
                    </button>
                    </>
                )
            })
        })

        return orders; 
    };

    return (
        <>
            <AdminLayout>
                <MetaData title={"All Products"} />
                <h1 className='my-5'>{data?.orders?.length} Orders</h1>
                <MDBDataTable
                    data={setOrders()}
                    className='px-3'
                    bordered
                    striped
                    hover
                />
            </AdminLayout>
        </>
    );
};

export default ListOrders;
