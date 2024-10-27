import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";



export const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:4000/api/v1",
        credentials: "include"
    }),
    tagTypes: ["Order","AdminOrder"],
    endpoints: (builder) => ({
        createNewOrder: builder.mutation({
            query(body) {
                return {
                    url: "/orders/new",
                    method: "POST",
                    body
                }
            }
        }),

        myOrders: builder.query({
            query: () => "/me/orders",
            invalidatesTags: ["Order"]
        }),

        orderDetails: builder.query({
            query: (id) => `/orders/${id}`,
            providesTags: ["Order"]
        }),

        stripeCheckoutSession: builder.mutation({
            query(body) {
                return {
                    url: "/payment/checkout_session",
                    method: "POST",
                    body
                }
            },
        }),

        getAdminOrders: builder.query({
            query: () => "/admin/orders",
            providesTags: ["AdminOrder"]
        }),

        updateAdminOrder: builder.mutation({
            query({ id, body }) {
                return {
                    url: `/admin/orders/${id}`,
                    method: "PUT",
                    body
                }
            },
            invalidatesTags: ["Order"]
        }),

        deleteAdminOrder: builder.mutation({
            query(id) {
                return {
                    url: `/admin/orders/${id}`,
                    method: "DELETE"
                }
            },
            invalidatesTags: ["AdminOrder"]
        }),

    })
})

export const { useCreateNewOrderMutation, useStripeCheckoutSessionMutation, useMyOrdersQuery, useOrderDetailsQuery, useGetAdminOrdersQuery, useUpdateAdminOrderMutation, useDeleteAdminOrderMutation } = orderApi;




