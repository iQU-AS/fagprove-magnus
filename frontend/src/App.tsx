import { Box, ChakraProvider, Heading } from "@chakra-ui/react";
import { system } from "@chakra-ui/react/preset";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider value={system}>
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
          h={"5%"}
        >
          Handleliste
        </Heading>

        <Box h={"95%"} w={"100%"}>
          <Router>
            <Routes>
              <Route path="/" element={<>Hello World!</>} />
            </Routes>
          </Router>
        </Box>
      </Box>
    </ChakraProvider>
  </StrictMode>
);
