import express from "express";
import { CanUserReview, DeleteProductImages, UploadProductImages, createProductReview, deleteProduct, deleteReview, getAdminProducts, getProductDetails, getProductReviews, getProducts, newProduct, updateProductDetails } from "../controllers/productController.js";
const router = express.Router();
import { isAuthenticatedUser, AuthorizeRoles } from "../middlewares/auth.js";


router.route("/products").get(getProducts);
router.route("/products/:id").get(getProductDetails);

// admin routes
router.route("/admin/products")
.post(isAuthenticatedUser,AuthorizeRoles("admin"),newProduct)
.get(isAuthenticatedUser,AuthorizeRoles("admin"),getAdminProducts)
router.route("/admin/products/:id").put(isAuthenticatedUser,AuthorizeRoles("admin"),updateProductDetails);
router.route("/admin/products/:id").delete(isAuthenticatedUser,AuthorizeRoles("admin"),deleteProduct);

// upload product images route and delete images route
router.route("/admin/products/:id/upload_images").put(isAuthenticatedUser,AuthorizeRoles("admin"),UploadProductImages);
router.route("/admin/products/:id/delete_image").put(isAuthenticatedUser,AuthorizeRoles("admin"),DeleteProductImages);


// reviews routes
router.route("/reviews")
.put(isAuthenticatedUser,createProductReview)
.get(isAuthenticatedUser,getProductReviews)

router.route("/admin/reviews")
.delete(isAuthenticatedUser,AuthorizeRoles("admin"),deleteReview);

router.route("/can_review")
.get(isAuthenticatedUser,CanUserReview);

export default router;


