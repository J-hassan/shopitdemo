import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setUser, setIsAuthenticated, setLoading } from "../features/userSlice";



export const userApi = createApi({
    reducerPath: "userApi",
    tagTypes: ["User", "AdminUser"],
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:4000/api/v1",
        credentials: "include"
    }),
    endpoints: (builder) => ({
        getMe: builder.query({
            query: () => `/me`,
            transformResponse: (result) => result.user,
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setUser(data))
                    dispatch(setIsAuthenticated(true))
                    dispatch(setLoading(false))
                } catch (error) {
                    dispatch(setLoading(false))
                    console.log(error)
                }
            },
            providesTags: ["User"]
        }),

        updateProfile: builder.mutation({
            query(body) {
                return {
                    url: "/me/update",
                    method: "PUT",
                    body,
                }
            },
            invalidatesTags: ["User"]
        }),

        uploadAvatar: builder.mutation({
            query(body) {
                return {
                    url: "/me/upload_avatar",
                    method: "PUT",
                    body,
                }
            },
            invalidatesTags: ["User"]
        }),

        updatePassword: builder.mutation({
            query(body) {
                return {
                    url: "/password/update",
                    method: "PUT",
                    body,
                }
            }
        }),

        forgotPassword: builder.mutation({
            query(body) {
                return {
                    url: "/password/forgot",
                    method: "POST",
                    body,
                }
            }
        }),

        resetPassword: builder.mutation({
            query({ token, body }) {
                return {
                    url: `/password/reset/${token}`,
                    method: "PUT",
                    body,
                }
            }
        }),

        getAdminUsers: builder.query({
            query: () => `/admin/users`,
            providesTags: ["AdminUser"]
        }),

        getUserDetails: builder.query({
            query: (id) => `/admin/users/${id}`,
            invalidatesTags: ["AdminUser"]
        }),

        updateUser: builder.mutation({
            query({ id, body }) {
                return {
                    url: `/admin/users/${id}`,
                    method: "PUT",
                    body,
                }
            },
            invalidatesTags: ["AdminUser"]
        }),


        deleteUser: builder.mutation({
            query(id) {
                return {
                    url: `/admin/users/${id}`,
                    method: "DELETE",
                }
            },
            invalidatesTags: ["AdminUser"]
        }),

    })
})

export const { useGetMeQuery, useUpdateProfileMutation, useUploadAvatarMutation, useUpdatePasswordMutation, useForgotPasswordMutation, useResetPasswordMutation, useGetAdminUsersQuery, useGetUserDetailsQuery, useUpdateUserMutation , useDeleteUserMutation } = userApi;



