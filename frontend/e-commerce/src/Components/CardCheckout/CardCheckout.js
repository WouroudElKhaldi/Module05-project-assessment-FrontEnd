import React, { useContext, useState } from "react";
import styles from "./CardCheckout.module.css";
import Button from "@mui/material/Button";
import axiosInstance from "../../Utils/AxiosInstance";
import { AuthContext } from "../../Context/AuthContext";
import { Box, FormControl, InputLabel, TextField } from "@mui/material";
import useApi from "../../Hooks/UseApi";
import NoteModal from "../Note/Note";
import { CartContext } from "../../Context/CartContext";

export default function CardCheckout({ totalPrice, cartItems }) {
  const { setCartItemCount, setCartItems } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { apiCall, error } = useApi();

  const [selectedPrice, setSelectedPrice] = useState(null);
  const [openNote, setOpenNote] = useState(false);


  const SendOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      setOpenNote(true);
      return;
    } else {
      try {
        await apiCall({
          method: "post",
          url: "/order",
          data: {
            userId: user.id,
            productDetails: cartItems,
          },
        });

        if (error) {
          console.log(error)
        } else {
          localStorage.removeItem("cart");
          setCartItems([]);
          setCartItemCount(null)
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Box
      className={styles.cardPage}
      sx={{
        "& .MuiOutlinedInput-notchedOutline ": {
          border: "1.5px solid  gray !important",
          borderRadius: "4px",
        },
        "& .Mui-focused > .MuiOutlinedInput-notchedOutline ": {
          border: "2px solid #C86823 !important",
          borderRadius: "4px",
        },
        "& .Mui-selected > .MuiOutlinedInput-notchedOutline ": {
          border: "2px solid #C86823 !important",
          borderRadius: "4px",
        },
        "& .Mui-focused.MuiFormLabel-root ": {
          color: "#C86823 !important",
        },
        ".MuiFormLabel-root": {
          fontSize: "1.1rem",
        },
      }}
    >
      <div className={styles.cardWrapper}>
        <p className={styles.titleCard}>Checkout your Order</p>
        <form className={styles.form} onSubmit={(e) => SendOrder(e)}>
          <div className={styles.price}>
            <p>Price</p>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className={styles.totalPrice}>
            <p>Total Price</p>
            <div>${(totalPrice + selectedPrice).toFixed(2)}</div>
          </div>
          <div className={styles.buttonContainer}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                bgcolor: "#C86823",
                textTransform: "none",
                transition: "background-color 0.3s ease, color 0.3s ease",
                "&:hover": {
                  bgcolor: "#A0471D",
                  color: "white",
                },
              }}
            >
              Checkout
            </Button>
          </div>
        </form>
      </div>
      <NoteModal openNote={openNote} handleClose={() => setOpenNote(false)} />
    </Box>
  );
}
