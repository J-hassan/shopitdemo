import React, { useEffect } from 'react';
import { MDBDataTable } from "mdbreact";
import Loader from "../layout/Loader";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import MetaData from "../layout/MetaData"
import AdminLayout from "../layout/AdminLayout"
import { useDeleteUserMutation, useGetAdminUsersQuery } from '../../redux/api/userApi';

const ListUsers = () => {

    const { data, isLoading, error } = useGetAdminUsersQuery();

    const navigate = useNavigate()

    const [deleteUser,{isLoading : deleteLoading , error : deleteError , isSuccess : deleteSuccess}] = useDeleteUserMutation();

    useEffect(() => {
        if (error) {
            toast.error(error?.data?.message || "An Error Occurred");
        }
        if(deleteError){
            toast.error(deleteError?.data?.message || "An Error Occurred");
        }
        if (deleteSuccess) {
            toast.success("User Deleted Successfully");
        }
    }, [error])


    if (isLoading) return <Loader />;

    const deleteUserHandler = (id)=>{
        deleteUser(id);
        navigate("/admin/users")
    }

    const setUsers = () => {
        const users = {
            columns: [
                {
                    label : "ID",
                    field : "id",
                    sort : "asc"
                },
                {
                    label : "Name",
                    field : "name",
                    sort : "asc"
                },
                {
                    label : "Email",
                    field : "email",
                    sort : "asc"
                },
                {
                    label : "Role",
                    field : "role",
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

        data?.users?.forEach((user)=>{
            users.rows.push({
                id : `${user?._id.substring(0,10)}...`,
                name : `${user?.name.substring(0,10)}...`,
                email : `${user?.email.substring(0,15)}...`,
                role : user?.role,
                actions : (
                    <>
                    <Link to={`/admin/users/${user?._id}`} className="btn btn-primary">
                        <i className='fa fa-pencil'></i>
                    </Link>
                    <button to={`/admin/users/${user?._id}`} className='btn btn-success ms-2' onClick={() => deleteUserHandler(user?._id)} disabled={deleteLoading}>
                        <i className='fa fa-trash'></i>
                    </button>
                    </>
                )
            })
        })

        return users; 
    };

    return (
        <>
            <AdminLayout>
                <MetaData title={"All Users"} />
                <h1 className='my-5'>{data?.users?.length} Users</h1>
                <MDBDataTable
                    data={setUsers()}
                    className='px-3'
                    bordered
                    striped
                    hover
                />
            </AdminLayout>
        </>
    );
};

export default ListUsers;
