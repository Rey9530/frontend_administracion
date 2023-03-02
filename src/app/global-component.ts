export const GlobalComponent = {
    // Api Calling
    API_URL : 'http://localhost:4000/api/',
    headerToken : {'accessToken': localStorage.getItem('token') ?? "", 'Content-Type': 'application/json'},

    
    // Products Api
    product:'apps/product',
    productDelete:'apps/product/',

    // Orders Api
    order:'apps/order',
    orderId:'apps/order/',

    // Customers Api
    customer:'apps/customer',
}