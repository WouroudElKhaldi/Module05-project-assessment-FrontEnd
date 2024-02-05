import React, { useContext, useEffect, useState } from "react";
import StyleProducts from "./Products.module.css";
import Icon from "@mui/icons-material/CategoryOutlined";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import Stack from "@mui/material/Stack";
import { Link, useParams } from "react-router-dom";
import { Reveal } from "../../RevealAnimation";
import Loading from "../Loading/Loading.js";
import { Button } from "@mui/material";
import { CartContext } from "../../Context/CartContext";
import useApi from '../../Hooks/UseApi'

const Products = () => {
  const {loading , error , apiCall} = useApi()
  const { increaseCartItem, setCartItems } = useContext(CartContext);
  const { categoryId } = useParams();
  const [productsData , setProductsData] = useState()
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategories, setSelectedCategories] = useState(
    categoryId ? [`${categoryId}`] : []
  );
  const [checkboxes, setCheckboxes] = useState({});
  const [sidePanelWidth, setSidePanelWidth] = useState(400);

  useEffect(()=>{
    const fetchData = async () =>{
      try {
        const response = await axios.get(`http://localhost:2024/products`)
        setProductsData(response.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  },[])

  const handleSearchInputChange = (event, newValue) => {
    if (typeof newValue === "object" && newValue !== null) {
      setSearchInput(newValue.name || "");
    } else {
      setSearchInput(newValue || "");
    }
  };

  const updateSideBar = () => {
    if (window.innerWidth > 959) {
      setSidePanelWidth(400);
    } else if (window.innerWidth < 750) {
      setSidePanelWidth(400);
    } else {
      setSidePanelWidth(0);
    }
  };

  useEffect(() => {
    updateSideBar();
    window.addEventListener("resize", updateSideBar);
    return () => {
      window.removeEventListener("resize", updateSideBar);
    };
  }, []);

  if ( loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loading/>

      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loading/>
      </div>
    );
  }

  const openNav = () => {
    setSidePanelWidth(400);
  };

  const closeNav = () => {
    setSidePanelWidth(0);
  };


  // Add To Cart Section
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

  const prices = [{value: '0-20' }, {value : '20-40'},{ value : '40-70'}, {value : '70-100'} ,{value : '100-200'}]

  return (
    <>
      <div className={StyleProducts.big}>
        <div
          id="mySidepanel"
          className={StyleProducts.sidepanel}
          style={{
            width: sidePanelWidth + "px",
            height: "100%",
          }}
        >
          <div>
            <section className={StyleProducts.sideBarTitle}>
              <Icon></Icon>
              <h1>Filter</h1>
            </section>
            <Reveal>
              <section className={StyleProducts.searchArticle}>
                <article>

                  <Stack
                    className={StyleProducts.stack}
                    sx={{ padding: "10px 0px" }}
                  >
                    <Autocomplete
                      freeSolo
                      id="free-solo-2-demo"
                      disableClearable
                      options={productsData && productsData.map((product) => ({
                        name: product.name,
                      }))}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => (
                        <TextField
                          className={`${StyleProducts.searchInput}`}
                          {...params}
                          label="Search input"
                          InputProps={{
                            ...params.InputProps,
                            type: "search",
                          }}
                        />
                      )}
                      onChange={handleSearchInputChange}
                    />
                  </Stack>
                </article>
              </section>
            </Reveal>

            <Reveal>
              <section className={StyleProducts.categoryArticle}>
                <article>
                  <h3>Prices</h3>
                  <div className={StyleProducts.checkBoxContainer}>
                    {prices.map((price , index) => (
                      <div
                        key={index}
                        className={StyleProducts.checkBoxLine}
                      >
                        <input
                          type="checkbox"
                          id={price.vlaue}
                          name={price.vlaue}
                          value={price.value}
                          className={StyleProducts.customCheckbox}
                          onChange={(e) =>
                            console.log('hello')
                            // handleCheckboxChange(e, price.value)
                          }
                        />
                        <label htmlFor={price.name}>{price.value}</label>
                      </div>
                    ))}
                  </div>
                </article>
              </section>
            </Reveal>
          </div>
        </div>

        {sidePanelWidth === 400 ? (
          <span className={StyleProducts.openbtn} onClick={closeNav}>
            <ArrowBackIosIcon
              style={{
                color: "#c86823",
                borderRight: "1px solid rgb(110, 110, 110)",
              }}
            ></ArrowBackIosIcon>
          </span>
        ) : (
          <button className={StyleProducts.openbtn} onClick={openNav}>
            <ArrowForwardIosIcon
              style={{ color: "#c86823" }}
            ></ArrowForwardIosIcon>
          </button>
        )}

        <div className={StyleProducts.content}>
          <div className={StyleProducts.cartContainer}>
            {productsData && productsData.map((product) => (
              <Reveal key={product._id}>
                <div className={StyleProducts.oneCart}>
                  <Link
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      transition: "background-color 0.5s, opacity 0.3s",
                      display: "flex",
                      flexDirection: "column",
                    }}
                    to={`/ProductDetails/${productsData && product._id}`}
                    key={productsData && product._id}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#f8f8f8";
                      e.currentTarget.style.opacity = 0.8;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "white";
                      e.currentTarget.style.opacity = 0.8;
                    }}
                  >
                    <img
                      src={`http://localhost:2024/images/${product.image}`}
                      className={StyleProducts.imgCart}
                      alt={productsData && product.name}
                    />
                    <div>
                      <section className={StyleProducts.infoCart}>
                        <strong
                          style={{
                            fontSize: "20px",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                          }}
                        >
                          { productsData && product.name}
                        </strong>
                        <p style={{ fontSize: "20px" }}>${product.price}</p>
                      </section>
                    </div>
                  </Link>
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
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;
