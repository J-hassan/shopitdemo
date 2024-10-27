import React, { useEffect, useState } from 'react';
import MetaData from "../layout/MetaData"
import Loader from '../layout/Loader';
import { useDeleteAdminOrderMutation, useOrderDetailsQuery, useUpdateAdminOrderMutation } from '../../redux/api/orderApi';
import toast from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AdminLayout from '../layout/AdminLayout'

const ProcessOrder = () => {
    const params = useParams()
    const { data, isLoading, error } = useOrderDetailsQuery(params?.id);

    const [updateAdminOrder,{isLoading : updateLoading , error : updateError , isSuccess : updateSuccess}] = useUpdateAdminOrderMutation();

    const order = data?.order || {};

    const  [status,setStatus] = useState("");

    const { orderItems, orderStatus, paymentMethod, paymentInfo, totalAmount, shippingInfo } = order;

    const { user } = useSelector((state) => state.auth);

    
    useEffect(() => {
        if (error) {
            toast.error(error?.data?.message || "An Error Occurred");
        }
        if(updateError){
            toast.error(updateError?.data?.message || "An Error Occurred");
        }
        if(updateSuccess){
            toast.success("Order Process Updated Successfully")
        }
    }, [error,updateError,updateSuccess])

    if (isLoading) return <Loader />

    const OrderStatusHandler = (id) => {
        const data = {orderStatus:status}
        updateAdminOrder({id, body : data });
    }

    return (
        <AdminLayout>
            <MetaData title={"Process Order"} />
            <div className="row d-flex justify-content-around">
                <div className="col-12 col-lg-8 order-details">
                    <h3 className="mt-5 mb-4">Order Details</h3>

                    <table className="table table-striped table-bordered">
                        <tbody>
                            <tr>
                                <th scope="row">ID</th>
                                <td>{order?._id}</td>
                            </tr>
                            <tr>
                                <th scope="row">Status</th>
                                <td className="greenColor">
                                    <b>{orderStatus}</b>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <h3 className="mt-5 mb-4">Shipping Info</h3>
                    <table className="table table-striped table-bordered">
                        <tbody>
                            <tr>
                                <th scope="row">Name</th>
                                <td>{user?.name}</td>
                            </tr>
                            <tr>
                                <th scope="row">Phone No</th>
                                <td>{shippingInfo?.phoneNo}</td>
                            </tr>
                            <tr>
                                <th scope="row">Address</th>
                                <td>{shippingInfo?.address} , {shippingInfo?.city}, {shippingInfo?.zipCode}, {shippingInfo?.country}</td>
                            </tr>
                        </tbody>
                    </table>

                    <h3 className="mt-5 mb-4">Payment Info</h3>
                    <table className="table table-striped table-bordered">
                        <tbody>
                            <tr>
                                <th scope="row">Status</th>
                                <td className="greenColor">
                                    <b>{paymentInfo?.status}</b>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">Method</th>
                                <td>{paymentMethod}</td>
                            </tr>
                            <tr>
                                <th scope="row">Stripe ID</th>
                                <td>{paymentMethod === "Card" ? paymentInfo.id : "Nill"}</td>
                            </tr>
                            <tr>
                                <th scope="row">Amount</th>
                                <td>{totalAmount}</td>
                            </tr>
                        </tbody>
                    </table>

                    <h3 className="mt-5 my-4">Order Items:</h3>

                    <hr />

                    {orderItems?.map((item) => {
                        return <>
                            <div className="cart-item my-1">
                                <div className="row my-5">
                                    <div className="col-4 col-lg-2">
                                        <img
                                            src={item?.image}
                                            alt=""
                                            height="45"
                                            width="65"
                                        />
                                    </div>
                                    <div className="col-5 col-lg-4">
                                        <Link to={`/products/${item?.product}`}>{item?.name}</Link>
                                    </div>
                                    <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                                        <p>${item?.price}</p>
                                    </div>
                                    <div className="col-4 col-lg-4 mt-4 mt-lg-0">
                                        <p>{item?.quantity} Piece(s)</p>
                                    </div>
                                </div>
                            </div>
                            <hr />
                        </>
                    })}


                </div>

                <div className="col-12 col-lg-3 mt-5">
                    <h4 className="my-4">Status</h4>

                    <div className="mb-3">
                        <select className="form-select" name="status" value={status} onChange={(e)=>setStatus(e.target.value)}>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                        </select>
                    </div>

                    <button className="btn btn-primary w-100" onClick={()=>OrderStatusHandler(order?._id)} disabled={updateLoading}>Update Status</button>

                    <h4 className="mt-5 mb-3">Order Invoice</h4>
                    <Link to={`/invoice/orders/${order?._id}`} className="btn btn-success w-100">
                        <i className="fa fa-print"></i> Generate Invoice
                    </Link>
                </div>
            </div>
        </AdminLayout>
    )
}

export default ProcessOrder