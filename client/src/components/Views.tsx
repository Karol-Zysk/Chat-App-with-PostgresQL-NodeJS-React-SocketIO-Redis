import { Box, Text } from "@chakra-ui/layout";
import { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { AccountContext } from "./AccountContext";
import Login from "./Login/Login";
import SignUp from "./Login/SignUp";
import Home from "./Home/Home";
import PrivateRoutes from "./PrivateRoutes";

const Views = () => {
  const { user } = useContext(AccountContext);
  return user?.loggedIn === null ? (
    <Text>Loading...</Text>
  ) : (
    <Box border="2px" borderColor="gray.200">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/home" element={<Home />} />
        </Route>
        <Route path="*" element={<Login />} />
      </Routes>
    </Box>
  );
};

export default Views;
