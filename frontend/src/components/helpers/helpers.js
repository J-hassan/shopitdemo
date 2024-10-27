export const getPriceQueryParams = (searchParams, key, value) => {

    const hasValueInParams = searchParams.has(key);

    if (value && hasValueInParams) {
        searchParams.set(key, value);
    } else if (value) {
        searchParams.append(key, value);
    } else if (hasValueInParams) {
        searchParams.delete(key);
    }

    return searchParams;

};


export const calculateItemsCost = (cartItems) => {

    const itemsPrice = cartItems?.reduce((acc, item) => acc + item?.quantity * item?.price, 0);

    const shippingPrice = itemsPrice > 200 ? 0 : 25;

    const taxPrice = Number((0.15 * itemsPrice));

    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    return {
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
    }

}