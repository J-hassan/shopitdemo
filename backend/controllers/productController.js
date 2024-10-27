import Product from "../models/product.js";
import Order from "../models/order.js";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import APIFilters from "../utils/apiFilters.js";
import { delete_file, upload_file } from "../utils/cloudinary.js"


// create new product => /api/v1/products
export const getProducts = catchAsyncErrors(async (req, res) => {

    let resPerPage = 4;

    const apiFilters = new APIFilters(Product, req.query).search().filters();

    let products = await apiFilters.query;
    let filteredProductsCount = products.length;

    apiFilters.pagination(resPerPage);
    products = await apiFilters.query.clone();

    res.status(200).json({
        resPerPage,
        filteredProductsCount,
        products,
    })

});


// create new product => /api/v1/admin/products
export const newProduct = catchAsyncErrors(async (req, res) => {

    req.body.user = req.user._id;

    const product = await Product.create(req.body);

    res.status(200).json({
        product,
    })

});

// get product => /api/v1/products/:id
export const getProductDetails = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req?.params?.id).populate('reviews.user');

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }

    res.status(200).json({
        product,
    })

});


// update product => /api/v1/products/:id
export const updateProductDetails = catchAsyncErrors(async (req, res) => {

    let product = await Product.findById(req?.params?.id);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }

    product = await Product.findByIdAndUpdate(req?.params?.id, req.body, { new: true });

    res.status(200).json({
        product,
    })

});

// Upload product images => /api/v1/products/:id/upload_images
export const UploadProductImages = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req?.params?.id)

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }

    const uploader = async (image) => upload_file(image, "shopit/products");

    const urls = await Promise.all((req?.body?.images).map(uploader));

    product?.images?.push(...urls);

    product.user = req?.user?._id;

    await product?.save()

    res.status(200).json({
        product,
    })

});


// delete product images => /api/v1/products/:id/delete_image
export const DeleteProductImages = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req?.params?.id)

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }

    const isDeleted = await delete_file(req?.body?.imgId);

    if (isDeleted) {
        product.images = product?.images.filter(
            image => image.public_id !== req?.body?.imgId
        )
        await product?.save()
    }


    res.status(200).json({
        product,
    })

});


// delete product => /api/v1/products/:id
export const deleteProduct = catchAsyncErrors(async (req, res, next) => {

    let product = await Product.findById(req?.params?.id);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }

    // Delete images associated with the product
    try {
        for (let i = 0; i < product?.images?.length; i++) {
            await delete_file(product.images[i].public_id); 
        }
    } catch (error) {
        console.error("Image Deletion Error:", error.message); // Log the error
        return next(new ErrorHandler(`Error deleting images: ${error.message}`, 500)); // Send specific error message
    }

    // Delete the product itself
    await product.deleteOne();

    // Respond with success message
    res.status(200).json({
        message: "Product Deleted Successfully",
    });

});




// Create/Update review => /api/v1/reviews
export const createProductReview = catchAsyncErrors(async (req, res, next) => {

    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        rating: Number(rating),
        comment
    };

    let product = await Product.findById(productId);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }

    const isReviewed = product?.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
    )

    if (isReviewed) {

        product.reviews.forEach((review) => {
            if (review.user.toString() === req.user._id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        })

    } else {

        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;

    }

    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
    })

});




// Get All Reviews of a Product => /api/v1/reviews?id={product_id}
export const getProductReviews = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.query.id).populate("reviews.user");

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }

    res.status(200).json({
        reviews: product.reviews,
    })

})


// Delete Review - ADMIN => /api/v1/admin/reviews?productId={id_of_product}&id={review_id}
export const deleteReview = catchAsyncErrors(async (req, res, next) => {

    let product = await Product.findById(req.query.productId);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }


    const reviews = product?.reviews.filter((review) => {
        return review._id.toString() !== req.query.id.toString()
    });

    const numOfReviews = reviews.length;

    const rating =
        numOfReviews === 0
            ? 0
            : product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;


    product = await Product.findByIdAndUpdate(req.query.productId, { reviews, numOfReviews, rating }, { new: true })

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        product,
    })

});


// can user review => /api/v1/can_review
export const CanUserReview = catchAsyncErrors(async (req, res, next) => {

    const orders = await Order.find({
        user: req?.user?._id,
        "orderItems.product": req.query.productId,
    })

    if (orders.length === 0) {
        return res.status(200).json({ canReview: false })
    }

    res.status(200).json({
        canReview: true,
    })

})



// get admin products - ADMIN => /api/v1/admin/products
export const getAdminProducts = catchAsyncErrors(async (req, res, next) => {

    const products = await Product.find();

    if (!products) {
        return next(new ErrorHandler("Products Not Found", 404));
    }

    res.status(200).json({
        products,
    })

});