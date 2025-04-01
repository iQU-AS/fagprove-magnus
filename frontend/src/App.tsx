import { Box, Center, ChakraProvider, Heading } from "@chakra-ui/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { LogoutButton } from "./components/utils/LogoutButton";
import PrivateRoute from "./components/utils/PrivateRoute";
import { Toaster } from "./components/utils/ToastMachine";
import { AuthProvider } from "./context/AuthContext";
import { AcceptInvite } from "./pages/AcceptInvite";
import { GroceryList } from "./pages/GroceryList";
import { HomePage } from "./pages/HomePage";
import { Login } from "./pages/Login";
import { system } from "./theme/Theme";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider value={system}>
      <Router>
        <AuthProvider>
          <Box
            justifyContent={"center"}
            w={"100vw"}
            h={"100vh"}
            flexDirection={"column"}
            gap={8}
          >
            <Box h={"93%"} w={"100%"}>
              <Center h={"7%"} bg={"primary.700"}>
                <Heading as={"h1"} size={"3xl"} color={"neutral.50"}>
                  Handleliste
                </Heading>
              </Center>
              <Center position={"absolute"} top={0} right={4} h={"7%"}>
                <LogoutButton />
              </Center>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<PrivateRoute />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/list/:list_id" element={<GroceryList />} />
                  <Route path="/join-list/:token" element={<AcceptInvite />} />
                </Route>
              </Routes>
              <Toaster />
            </Box>
          </Box>
        </AuthProvider>
      </Router>
    </ChakraProvider>
  </StrictMode>
);
