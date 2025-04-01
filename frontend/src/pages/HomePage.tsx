"use client";

import { Box, Center } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { apiService } from "../api/ApiService";
import { GroceryListType } from "../api/Types";
import { GroceryLists } from "../components/homepage/GroceryLists";
import { LoadingSpinner } from "../components/utils/Spinner";

export function HomePage() {
  const [lists, setLists] = useState<GroceryListType[]>([]);

  useEffect(() => {
    apiService.grocery_list
      .get_lists()
      .then((res) => setLists(res))
      .catch((err) => console.error("Feil under henting av dagligvarer:", err));
  }, []);

  const handleCreateList = (name: string) => {
    apiService.grocery_list
      .create_list({ name: name })
      .then((res) => {
        setLists([...lists, res]);
      })
      .catch((err) =>
        console.error("Feil ved opprettelse av handleliste:", err)
      );
  };

  if (!lists) return <LoadingSpinner />;

  return (
    <Center
      w={"100%"}
      h={"100%"}
      p={8}
      flexDirection={"column"}
      gap={8}
      bg={"neutral.100"}
    >
      <Box w={{ base: "100%", sm: "100%", md: "50%" }} h={"100%"}>
        <GroceryLists lists={lists} handleCreateList={handleCreateList} />
      </Box>
    </Center>
  );
}
