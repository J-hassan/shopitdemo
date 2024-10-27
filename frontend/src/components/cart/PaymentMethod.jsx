import React, { useEffect, useState } from 'react'
import { calculateItemsCost } from '../helpers/helpers';
import { useSelector } from 'react-redux';
import { useCreateNewOrderMutation, useStripeCheckoutSessionMutation } from "../../redux/api/orderApi";
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import MetaData from '../layout/MetaData'



const PaymentMethod = () => {

  const [method, setMethod] = useState("");

  const navigate = useNavigate();

  const { cartItems, shippingInfo } = useSelector((state) => state.cart)

  const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calculateItemsCost(cartItems);

  const [createNewOrder, { isSuccess, error }] = useCreateNewOrderMutation()

  const [stripeCheckoutSession, { data: checkoutData, isLoading, error: checkoutError }] = useStripeCheckoutSessionMutation();


  useEffect(() => {
    if (checkoutData) {
      window.location.href = checkoutData?.url
    }
    if (checkoutError) {
      toast.error(checkoutError?.data?.message || "An Error Occurred")
    }

  }, [checkoutData,checkoutError])


  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message || "An Error Occurred")
    }
    if (isSuccess) {
      toast.success("Order Placed Successfully")
      navigate("/me/orders?order_success=true")
    }
  }, [error, isSuccess])


  const submitHandler = (e) => {
    e.preventDefault();

    if (method === "COD") {
      // create COD order
      const OrderData = {
        shippingInfo,
        orderItems: cartItems,
        paymentMethod: "COD",
        paymentInfo: {
          status: "Not Paid"
        },
        itemsPrice,
        taxAmount: taxPrice,
        shippingAmount: shippingPrice,
        totalAmount: totalPrice,
      }

      createNewOrder(OrderData);

    }

    if (method === "Card") {
      // stripe checkout
      const OrderData = {
        shippingInfo,
        orderItems: cartItems,
        itemsPrice,
        taxAmount: taxPrice,
        shippingAmount: shippingPrice,
        totalAmount: totalPrice,
      }

      stripeCheckoutSession(OrderData);
    }
  }

  return (
    <>
      <MetaData title={"Payment Method"} />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form
            className="shadow rounded bg-body"
            onSubmit={submitHandler}
          >
            <h2 className="mb-4">Select Payment Method</h2>

            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="payment_mode"
                id="codradio"
                value="COD"
                onChange={() => setMethod("COD")}
              />
              <label className="form-check-label" for="codradio">
                Cash on Delivery
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="payment_mode"
                id="cardradio"
                value="Card"
                onChange={() => setMethod("Card")}
              />
              <label className="form-check-label" for="cardradio">
                Card - VISA, MasterCard
              </label>
            </div>

            <button id="shipping_btn" type="submit" className="btn py-2 w-100" disabled={isLoading}>
              {isLoading ? <span className='spinner-border spinner-border-sm'></span> : " CONTINUE"}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default PaymentMethod