import { createApi , fetchBaseQuery } from "@reduxjs/toolkit/query/react";



export const productApi = createApi({
    reducerPath : "productApi",
    baseQuery : fetchBaseQuery({
        baseUrl : "http://localhost:4000/api/v1",
        credentials :"include"
    }),
    tagTypes : ["Product","Admin","Review"],
    endpoints : (builder) => ({
        getProducts: builder.query({
            query: (params) => ({
                url: "/products",
                params: {
                    page : params?.page,
                    keyword : params?.keyword,
                    category : params?.category,
                    "price[gte]": params?.min,
                    "price[lte]":params?.max,
                    "rating[gte]":params?.rating,
                },
                invalidatesTags : ['Product','Admin']
            }),
        }),
        getProductDetails: builder.query({
            query: (id) => `/products/${id}`,
            providesTags : ["Product"]
        }),

        submitReview : builder.mutation({
            query(body){
                return {
                    url : "/reviews",
                    method : "PUT",
                    body,
                }
            },
            invalidatesTags : ["Product"]
        }),

        canReview : builder.query({
            query : (id) => `/can_review?productId=${id}`,
        }),

        getAdminProducts : builder.query({
            query : () => `/admin/products`,
            providesTags : ["Admin"]
        }),

        
        createAdminProduct : builder.mutation({
            query(body){
                return {
                    url : "/admin/products",
                    method : "POST",
                    body,
                }
            },
            invalidatesTags : ["Admin"]
        }),
        
        updateProduct : builder.mutation({
            query({id,body}){
                return {
                    url : `/admin/products/${id}`,
                    method : "PUT",
                    body,
                }
            },
            invalidatesTags : ["Admin","Product"]
        }),

        uploadProductImages : builder.mutation({
            query({id,body}){
                return {
                    url : `/admin/products/${id}/upload_images`,
                    method : "PUT",
                    body,
                }
            },
            invalidatesTags : ["Admin","Product"]
        }),

        deleteProductImages : builder.mutation({
            query({id,body}){
                return {
                    url : `/admin/products/${id}/delete_image`,
                    method : "PUT",
                    body,
                }
            },
            invalidatesTags : ["Admin","Product"]
        }),

      
        deleteProduct: builder.mutation({
            query(id) {
                return {
                    url: `/admin/products/${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["Admin", "Product"]
        }),
        
        
        getProductReviews : builder.query({
            query : (productId) => `/reviews?id=${productId}`,
            providesTags: ["Review"]
        }),

        deleteProductReview: builder.mutation({
            query({productId,id}) {
                return {
                    url: `/admin/reviews?productId=${productId}&id=${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["Review"]
        }),
        
    })
})

export const { useGetProductsQuery , useGetProductDetailsQuery , useSubmitReviewMutation , useCanReviewQuery , useGetAdminProductsQuery , useCreateAdminProductMutation , useUpdateProductMutation, useUploadProductImagesMutation , useDeleteProductImagesMutation , useDeleteProductMutation , useLazyGetProductReviewsQuery , useDeleteProductReviewMutation} = productApi;




