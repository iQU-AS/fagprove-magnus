import { Box, ChakraProvider, Heading, Text } from "@chakra-ui/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import PrivateRoute from "./components/login/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import { AcceptInvite } from "./pages/AcceptInvite";
import { GroceryList } from "./pages/GroceryList";
import { HomePage } from "./pages/HomePage";
import Login from "./pages/Login";
import { system } from "./theme/Theme";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider value={system}>
      <AuthProvider>
        <Box
          justifyContent={"center"}
          w={"100vw"}
          h={"100vh"}
          flexDirection={"column"}
          gap={8}
        >
          <Heading
            as={"h1"}
            size={"3xl"}
            textAlign={"center"}
            alignContent={"center"}
            h={"7%"}
            bg={"primary.500"}
            color={"neutral.50"}
          >
            Handleliste
          </Heading>
          <Text
            color={"neutral.50"}
            aria-label="Log out"
            position={"absolute"}
            top={4}
            right={4}
            style={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={() => {
              localStorage.removeItem("access_token");
              localStorage.removeItem("refresh_token");
              window.location.href = "/login";
            }}
          >
            Log out
          </Text>

          <Box h={"93%"} w={"100%"}>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<PrivateRoute />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/list/:list_id" element={<GroceryList />} />
                  <Route path="/join-list/:token" element={<AcceptInvite />} />
                </Route>
              </Routes>
            </Router>
          </Box>
        </Box>
      </AuthProvider>
    </ChakraProvider>
  </StrictMode>
);
