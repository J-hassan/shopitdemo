import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Order from "../models/order.js";
import Product from "../models/product.js";
import ErrorHandler from "../utils/errorHandler.js";



// Create new order ==> /api/v1/orders/new
export const newOrder = catchAsyncErrors(async (req,res,next)=>{

    const { 

        orderItems,
        shippingInfo,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentMethod,
        paymentInfo,
    } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentMethod,
        paymentInfo,
        user : req.user._id
    });

    res.status(200).json({
        order,
    })

})


// Get order details ==> /api/v1/orders/:id
export const getOrderDetails = catchAsyncErrors(async (req,res,next)=>{

    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("No Order Found with this ID",404));
    }

    res.status(200).json({
        order,
    })

})


// Get currest user orders ==> /api/v1/me/orders
export const myOrders = catchAsyncErrors(async (req,res,next)=>{

    const order = await Order.find({user : req.user._id}).populate("user","name email");

    if(!order){
        return next(new ErrorHandler("No Orders Found",404));
    }

    res.status(200).json({
        order,
    })

})



// Get All orders - ADMIN ==> /api/v1/admin/orders
export const allOrders = catchAsyncErrors(async (req,res,next)=>{

    const orders = await Order.find();

    if(!orders){
        return next(new ErrorHandler("No Orders Found",404));
    }

    res.status(200).json({
        orders,
    })

});



// Update Order - ADMIN ==> /api/v1/admin/orders/:id
export const UpdateOrder = catchAsyncErrors(async (req,res,next)=>{

    const order = await Order.findById(req?.params?.id);

    if(!order){
        return next(new ErrorHandler("No Order Found with this ID",404));
    }

    if(order?.orderStatus === "Delivered"){
        return next(new ErrorHandler("You have already delivered this order",400));
    }

    const productNotFound = false;

   for(const item of order?.orderItems){

        const product = await Product.findById(item.product.toString());

        if(!product){
            productNotFound = true;
            break;
        }

        product.stock = product.stock - item.quantity;

        await product.save({validateBeforeSave : false});

    }

    if(productNotFound){
        return next(new ErrorHandler("No Product Found with one or more ID",404));
    }


    order.orderStatus = req.body.orderStatus;
    order.deliveredAt = Date.now();

    order.save();


    res.status(200).json({
        success : true,
    })

});



// Delete Order - ADMIN ==> /api/v1/admin/orders/:id
export const deleteOrder = catchAsyncErrors(async (req,res,next)=>{

    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("No Order Found with this ID",404));
    }

    await order.deleteOne();

    res.status(200).json({
        success : true,
    })

})