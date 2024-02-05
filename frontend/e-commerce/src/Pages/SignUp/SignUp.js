import React, { useEffect, useContext, useState } from "react";
import Styles from "./Signup.module.css";
import { TextField, IconButton } from "@mui/material";
import Button from "@mui/material/Button";
import { NavLink } from "react-router-dom";
import OAuth from "../../Components/OAuth/OAuth.js";
import useApi from "../../Hooks/UseApi";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { InputAdornment } from "@mui/material";

function SignUp() {
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [phoneNumber, setPhoneNumber] = useState();
    const [email, setEmail] = useState();
    const [emailError, setEmailError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState(false);
    const { fetchUserData } = useContext(AuthContext);
    const { apiCall } = useApi();
    const navigate = useNavigate();

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!firstName || !lastName || !email || !password || !phoneNumber) {
            console.log('all fields are required')
            setLoading(false);
            return;
        }
        // Validate email and password
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const isValidPassword =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,16}$/.test(password);

        if (!isValidEmail) {
            setEmailError(" Please enter a valid email address");
            setLoading(false);
            console.log('invalid email')
        }

        try {
            const response = await apiCall({
                url: "user/signup",
                method: "post",
                data: { firstName, lastName, email, password, phoneNumber },
            });

            if (response) {
                await fetchUserData();
                console.log("sign up");
                setLoading(false);
                setSuccess(true);
                navigate("/");
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
            // showToast('Error logging in');
        }
    };

    return (
        <main className={Styles.mainContainer}>
            <section className={Styles.pageContainer}>
                <div className={Styles.div}>
                    <h1 className={Styles.title}>Register your account</h1>
                    <div className={Styles.linkPhrase}>
                        <p className={Styles.p}>Already have one?</p>
                        <NavLink to="/Login" className={Styles.linkLogin}>
                            login
                        </NavLink>
                    </div>
                </div>

                <div>
                    <form className={Styles.formContainer}>
                        <div className={Styles.inputContainer}>
                            <TextField
                                required
                                fullWidth
                                id="outlined-basic"
                                label="First Name"
                                variant="outlined"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                sx={{
                                    "& .Mui-focused > .MuiOutlinedInput-notchedOutline ": {
                                        border: "2px solid #C86823 !important",
                                        borderRadius: "4px",
                                    },
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        border: "1px solid #C86823 ",
                                    },
                                    "& .MuiInputLabel-root.Mui-focused ": {
                                        color: "#C86823 ",
                                    },
                                }}
                            />
                            <TextField
                                required
                                fullWidth
                                id="outlined-basic"
                                label=" Last Name"
                                variant="outlined"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                sx={{
                                    "& .Mui-focused > .MuiOutlinedInput-notchedOutline ": {
                                        border: "2px solid #C86823 !important",
                                        borderRadius: "4px",
                                    },
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        border: "1px solid #C86823 ",
                                    },
                                    "& .MuiInputLabel-root.Mui-focused ": {
                                        color: "#C86823 ",
                                    },
                                }}
                            />
                            <TextField
                                required
                                fullWidth
                                id="outlined-basic"
                                label="Email"
                                variant="outlined"
                                helperText={!emailError ? "" : emailError}
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setEmailError(null); // Clear previous error when typing
                                }}
                                onBlur={() => {
                                    // Validate email on blur
                                    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                                        email
                                    );
                                    if (!isValidEmail) {
                                        setEmailError("Please enter a valid email address");
                                    }
                                }}
                                sx={{
                                    "& .Mui-focused > .MuiOutlinedInput-notchedOutline ": {
                                        border: "2px solid #C86823 !important",
                                        borderRadius: "4px",
                                    },
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        border: "1px solid #C86823 ",
                                    },
                                    "& .MuiInputLabel-root.Mui-focused ": {
                                        color: "#C86823 ",
                                    },
                                }}
                            />
                            <TextField
                                required
                                fullWidth
                                id="outlined-basic"
                                label="Password"
                                helperText={!passwordError ? "" : passwordError}
                                variant="outlined"
                                value={password}
                                type={showPassword ? "text" : "password"}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setPasswordError(null); // Clear previous error when typing
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                                style={{ color: "#C86823" }}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                sx={{
                                    "& .Mui-focused > .MuiOutlinedInput-notchedOutline ": {
                                        border: "2px solid #C86823 !important",
                                        borderRadius: "4px",
                                    },
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        border: "1px solid #C86823 ",
                                    },
                                    "& .MuiInputLabel-root.Mui-focused ": {
                                        color: "#C86823 ",
                                    },
                                }}
                            />
                            <TextField
                                fullWidth
                                id="outlined-basic"
                                label="Phone Number"
                                variant="outlined"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                sx={{
                                    "& .Mui-focused > .MuiOutlinedInput-notchedOutline ": {
                                        border: "2px solid #C86823 !important",
                                        borderRadius: "4px",
                                    },
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        border: "1px solid #C86823 ",
                                    },
                                    "& .MuiInputLabel-root.Mui-focused ": {
                                        color: "#C86823 ",
                                    },
                                }}
                            />
                        </div>
                        <div className={Styles.buttonContainer}>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={submitHandler}
                                sx={{
                                    bgcolor: "#C86823",
                                    transition: "background-color 0.3s ease, color 0.3s ease",
                                    "&:hover": {
                                        bgcolor: "#A0471D",
                                        color: "white",
                                    },
                                    textTransform: 'none'
                                }}
                            >
                                {loading ? "Signing up..." : "Sign Up"}
                            </Button>
                            <p className={Styles.orPhrase}>Or</p>
                            <OAuth isLogin={false} />
                        </div>
                    </form>
                </div>
            </section>
        </main>
    );
}

export default SignUp;
