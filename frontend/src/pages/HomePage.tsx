"use client";

import { Center, Tabs } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { apiService } from "../api/ApiService";
import { GroceryListType } from "../api/Types";
import { BoughtItems } from "../components/homepage/BoughtItems";
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
      <Tabs.Root
        defaultValue="handlelister"
        w={{ base: "100%", md: "100%", lg: "50%" }}
        h={"100%"}
        fitted
        colorPalette={"green"}
        lazyMount
      >
        <Tabs.List>
          <Tabs.Trigger value="handlelister">Handleliste</Tabs.Trigger>
          <Tabs.Trigger value="historikk">Historikk</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="handlelister" h={"calc(100% - 40px)"}>
          <GroceryLists lists={lists} handleCreateList={handleCreateList} />
        </Tabs.Content>
        <Tabs.Content value="historikk" h={"calc(100% - 40px)"}>
          <BoughtItems />
        </Tabs.Content>
      </Tabs.Root>
    </Center>
  );
}
