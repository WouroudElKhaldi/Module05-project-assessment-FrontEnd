import React, { useContext, useEffect, useState } from "react";
import StyleSingleProduct from "./ProductDetails.module.css";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Reveal } from "../../RevealAnimation";
import Loading from "../Loading/Loading.js";
import { Button } from "@mui/material";
import { CartContext } from "../../Context/CartContext.js";

function ProductDetails() {
  const [count, setCount] = useState(1);
  const { increaseCartItem, setCartItems } = useContext(CartContext);

  // const [totalPrice, setTotalPrice] = useState();
  const [product, setProduct] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  function handleIncrease() {
    setCount((prev) => prev + 1);
  }
  function handleDecrease() {
    setCount((prev) => prev - 1);
  }
  async function getProduct() {
    try {
      const response = await axios.post(
        `http://localhost:2024/products/id`,
        { id: id }
      );
      if (response) {
        setProduct(response.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }
  useEffect(() => {
    getProduct();
  }, [id]);

  const addToCart = (product) => {
    const currentItems = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = currentItems.find((item) => item.id === product._id);

    if (!existingItem) {
      const newItem = {
        id: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        slug: product.slug,
        image: `http://localhost:2024/images/${product.image}`,
        totalPrice: product.price,
      };

      currentItems.push(newItem);
      localStorage.setItem("cart", JSON.stringify(currentItems));
      setCartItems((prevCartItems) => [...prevCartItems, newItem]);
      increaseCartItem();
    } else {
      return;
    }
  };


  const isProductInCart = (productId) => {
    const currentItems = JSON.parse(localStorage.getItem("cart")) || [];
    return currentItems.some((item) => item.id === productId);
  };



  return isLoading ? (
    <h1
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Loading />
    </h1>
  ) : (
    <>
      <Reveal>
        <div className={StyleSingleProduct.container}>
          <article className={StyleSingleProduct.imageArticle}>
            <img
              src={`http://localhost:2024/images/${product && product.image}`}
              alt="lalezar"
              className={StyleSingleProduct.imageProduct}
            />
          </article>

          <article className={StyleSingleProduct.contentArticle}>
            <div className={StyleSingleProduct.nameContainer}>
              <h1>{product && product.name}</h1>
              <p>$1.85</p>
            </div>
            <section className={StyleSingleProduct.quantityContainer}>
              <span>Quantity : </span>
              <section className={StyleSingleProduct.quantityControl}>
                <div
                  className={`${StyleSingleProduct.decrease} ${count === 0 ? StyleSingleProduct.disabled : ""
                    }`}
                  onClick={count > 0 ? handleDecrease : null}
                >
                  -
                </div>
                <div className={StyleSingleProduct.currentQuantity}>
                  {count}
                </div>
                <div
                  className={StyleSingleProduct.increase}
                  onClick={handleIncrease}
                >
                  +
                </div>
              </section>
            </section>
            <div className={StyleSingleProduct.descriptionContainer}>
              <span>Description: </span>
              <p>{product && product.description}</p>
            </div>
            {product.stock === true ? (
              <div className={StyleSingleProduct.ingredientsContainer}>
                <span>Stock : </span>
                <p>Available</p>
              </div>
            ) : (
              ""
            )}
            <span style={{ marginTop: "2rem" }}>
              <Button
                fullWidth
                variant="contained"
                disabled={isProductInCart(product._id)}
                onClick={() => addToCart(product)}
                sx={{
                  bgcolor: "#C86823",
                  transition: "background-color 0.3s ease, color 0.3s ease",
                  "&:hover": {
                    bgcolor: "#A0471D",
                    color: "white",
                  },
                  textTransform: "none",
                  fontSize: "1.1rem",
                }}
              >
                {isProductInCart(product._id) ? (
                  "Already in Cart"
                ) : (
                  <>
                    <AddShoppingCartIcon />
                    Add to cart
                  </>
                )}{" "}
              </Button>
            </span>
          </article>
        </div>
      </Reveal>
    </>
  );
}

export default ProductDetails;
