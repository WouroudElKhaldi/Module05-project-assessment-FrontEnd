import { Box, Button, Typography } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import Table from "../../Components/Table/Table";
import DeleteOrderModal from "../../Components/OrderModal/DeleteOrder";
import OrderModal from "../../Components/OrderModal/OrderModal";
import useApi from '../../Hooks/UseApi'
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DashOrder = () => {
  const [selectedRowData, setSelectedRowData] = useState({});
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [orderData, setOrderData] = useState()
  const { loading, error } = useApi()
  const navigate = useNavigate()
  useEffect(() => {
    console.log('khdashda')
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:2024/order');
        console.log('API Response:', response.data);
        setOrderData(response.data);
      } catch (error) {
        console.error('API Error:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box
      sx={{ flexGrow: 1, display: "flex", flexDirection: "column", ml: "2rem" }}
    >
      <Typography
        variant="h4"
        sx={{
          textAlign: "left",
          mt: "2rem",
          fontWeight: "bold",
        }}
      >
        Manage Orders
      </Typography>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" fontFamily="Helvetica Neue">
            Loading...
          </Typography>
        </div>
      ) : error ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" color="error">
            Error loading data
          </Typography>
        </div>
      ) : (
        <>
          <span style={{display : 'flex' , marginTop: '1rem'}}>
            <Button
              variant="contained"
              onClick={() => navigate('/')}
              sx={{
                bgcolor: "#C86823",
                transition: "background-color 0.3s ease, color 0.3s ease",
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#A0471D",
                  color: "white",
                },
              }}
            >
              Return to Home
            </Button>
          </span>

          {orderData && (
            <Table
              data={orderData && orderData}
              isEdit={true}
              setSelectedRowData={setSelectedRowData}
              handleOpenDelete={() => setOpenDelete(true)}
              handleEditOpen={() => setOpenEdit(true)}
              ForWhat={"orders"}
            />

          )}
          <DeleteOrderModal
            open={openDelete}
            handleClose={() => setOpenDelete(false)}
            selectedRowData={selectedRowData && selectedRowData}
          />
          <OrderModal
            open={openEdit}
            handleClose={() => setOpenEdit(false)}
            selectedRowData={selectedRowData}
          />
        </>
      )}
    </Box>
  );
};

export default DashOrder;
