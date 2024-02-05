import { useContext, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import Outlet from "../Routes/Outlet.js";
import ProductDetails from "../Pages/ProductDetails/ProductDetails";
import Cart from "../Pages/Cart/Cart";
import DashOrder from "../Pages/DashOrders/DashOrders";
// import DashProducts from "../Pages/DashProducts/DashProducts.js";
import Login from "../Pages/Login/Login";
import SignUp from "../Pages/SignUp/SignUp";
import NotFound from "../Pages/NotFound/NotFound";
import Unauthorized from "../Pages/Unauthorized/Unauthorized";
import Products from "../Pages/Products/Products.js";

const PrivatRoute = ({
  isAllowed,
  element,
}) => {
  const { user, checkUser } = useContext(AuthContext);

  if (checkUser || !user) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "3rem",
        }}
      >
        Loading...
      </div>
    );
  }

  if (!checkUser && !user) {
    return <Navigate to="/Unauthorized" />;
  }

  if (!isAllowed) {
    return <Navigate to="/Unauthorized" />;
  }

  return element;

};


const AppRouter = () => {
  const { user, checkUser } = useContext(AuthContext)
  return (
    <Routes>
      <Route path="/" element={<Outlet />}>
        <Route path="/" element={<Products />} />
        <Route path="/ProductDetails/:id" element={<ProductDetails />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/Login" exact element={<Login />} />
        <Route path="/SignUp" exact element={<SignUp />} />
      </Route>
      <Route path="/Unauthorized" exact element={<Unauthorized />} />

      <Route
        path="/dashboard/order"
        exact
        element={
          <PrivatRoute
            element={<DashOrder />}
            isAllowed={user && user.role === "Admin" ? true : false}
          />
        }
      />

      <Route path="/*" exact element={<NotFound />} />

    </Routes>

  )
}

export default AppRouter;