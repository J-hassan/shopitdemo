import React, { useEffect, useState } from 'react';
import Loader from "../layout/Loader";
import { toast } from "react-hot-toast";
import MetaData from "../layout/MetaData"
import AdminLayout from "../layout/AdminLayout"
import { useCreateAdminProductMutation } from '../../redux/api/productsApi';
import { PRODUCT_CATEGORIES } from '../../constants/categories';
import { useNavigate } from 'react-router-dom';


const NewAdminProduct = () => {


    const [createAdminProduct, { isLoading, error, isSuccess }] = useCreateAdminProductMutation();

    const navigate = useNavigate();

    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        seller: ""
    })

    const [category,setCategory] = useState("");

    const { name, description, price, stock, seller } = product;

    useEffect(() => {
        if (error) {
            toast.error(error?.data?.message || "An Error Occurred");
        }
        if (isSuccess) {
            toast.success("New Product Created");
            navigate("/admin/products")
        }
    }, [error, isSuccess,navigate])


    if (isLoading) return <Loader />;

    const submitHandler = (e) => {
        e.preventDefault();
    
        // Check if the category is empty, and set it to "Laptops" if it is
        const finalCategory = category === "" ? "Laptops" : category;
    
        // Prepare the product data with the final category
        const productData = { ...product, category: finalCategory };
    
        // Create the product with the final product data
        createAdminProduct(productData);
    };
    

    const onChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    }

    return (
        <AdminLayout>
            <MetaData title={"Create New Product"} />
            <div className="row wrapper">
                <div className="col-10 col-lg-10 mt-5 mt-lg-0">
                    <form className="shadow rounded bg-body" onSubmit={submitHandler}>
                        <h2 className="mb-4">New Product</h2>
                        <div className="mb-3">
                            <label htmlFor="name_field" className="form-label"> Name </label>
                            <input
                                type="text"
                                id="name_field"
                                className="form-control"
                                name='name'
                                value={name}
                                onChange={onChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="description_field" className="form-label">
                                Description
                            </label>
                            <textarea
                                className="form-control"
                                id="description_field"
                                rows="8"
                                name='description'
                                value={description}
                                onChange={onChange}
                            ></textarea>
                        </div>

                        <div className="row">
                            <div className="mb-3 col">
                                <label htmlFor="price_field" className="form-label"> Price </label>
                                <input
                                    type="text"
                                    id="price_field"
                                    className="form-control"
                                    name='price'
                                    value={price}
                                    onChange={onChange}
                                />
                            </div>

                            <div className="mb-3 col">
                                <label htmlFor="stock_field" className="form-label"> Stock </label>
                                <input
                                    type="number"
                                    id="stock_field"
                                    className="form-control"
                                    name='stock'
                                    value={stock}
                                    onChange={onChange}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="mb-3 col">
                                <label htmlFor="category_field" className="form-label"> Category </label>
                                <select className="form-select" id="category_field" name='category' value={category}
                                    onChange={(e)=>setCategory(e.target.value)}>

                                    {PRODUCT_CATEGORIES?.map((cat) => (
                                         <option key={cat} value={cat}>{cat}</option>
                                    ))}

                                </select>
                            </div>
                            <div className="mb-3 col">
                                <label htmlFor="seller_field" className="form-label"> Seller Name </label>
                                <input
                                    type="text"
                                    id="seller_field"
                                    className="form-control"
                                    name='seller'
                                    value={seller}
                                    onChange={onChange}
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn w-100 py-2" disabled={isLoading}>
                            {isLoading ? <span className='spinner-border spinner-border-sm'></span> : " CREATE"}
                        </button>
                    </form>
                </div>
            </div>
        </AdminLayout>
    )
}

export default NewAdminProduct