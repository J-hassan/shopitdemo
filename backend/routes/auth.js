import express from "express";
const router = express.Router();
import { loginUser, registerUser, logoutUser, forgotPassword, resetPassword, getUserProfile, updatePassword, updateProfile, getAllUsers, getUserDetails, uploadAvatar, updateUser, deleteUser } from "../controllers/authController.js";
import { AuthorizeRoles, isAuthenticatedUser } from "../middlewares/auth.js";

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);


// user routes
router.route("/me").get(isAuthenticatedUser,getUserProfile);
router.route("/me/update").put(isAuthenticatedUser,updateProfile);
router.route("/password/update").put(isAuthenticatedUser,updatePassword);
router.route("/me/upload_avatar").put(isAuthenticatedUser,uploadAvatar);


router.route("/admin/users").get(isAuthenticatedUser,AuthorizeRoles("admin"),getAllUsers);
router.route("/admin/users/:id")
.get(isAuthenticatedUser,AuthorizeRoles("admin"),getUserDetails)
.put(isAuthenticatedUser,AuthorizeRoles("admin"),updateUser)
.delete(isAuthenticatedUser,AuthorizeRoles("admin"),deleteUser)


export default router;