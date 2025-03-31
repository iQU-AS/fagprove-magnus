"use client";

import { Card, Center, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MdOutlineLocalGroceryStore } from "react-icons/md";
import { apiService } from "../api/ApiService";
import { GroceryListType } from "../api/Types";
import { CreateNewListDialog } from "../components/homepage/CreateNewListDialog";
import { LoadingSpinner } from "../components/utils.tsx/Spinner";

export function HomePage() {
  const [lists, setLists] = useState<GroceryListType[]>([]);

  useEffect(() => {
    apiService.grocery_list
      .get_lists()
      .then((res) => setLists(res))
      .catch((err) => console.error("Error fetching grocery items:", err));
  }, []);

  const handleCreateList = (name: string) => {
    apiService.grocery_list
      .create_list({ name: name })
      .then((res) => {
        setLists([...lists, res]);
      })
      .catch((err) => console.error("Error creating grocery list:", err));
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
      <VStack
        w={{ base: "100%", md: "100%", lg: "50%" }}
        h={"100%"}
        overflow={"auto"}
        aria-label="List of grocery lists"
        borderWidth={0}
        p={4}
        borderRadius={8}
        shadow={"sm"}
      >
        {lists.length === 0 && (
          <Text fontSize={"xl"}>You don't have any grocery lists yet.</Text>
        )}
        {lists.map((list) => (
          <Card.Root
            key={list.id}
            w={"100%"}
            borderWidth={2}
            onClick={() => (window.location.href = `/list/${list.id}`)}
            p={4}
            role="button"
            aria-label={`Open grocery list ${list.name}`}
            tabIndex={0}
            style={{ cursor: "pointer" }}
            bg={"neutral.100"}
            _hover={{
              bg: "neutral.200",
            }}
            shadow={"sm"}
          >
            <HStack>
              <MdOutlineLocalGroceryStore
                size={100}
                aria-hidden="true"
                focusable="false"
              />
              <VStack>
                <Card.Header>
                  <Heading as={"h2"}>{list.name}</Heading>
                </Card.Header>
                <Card.Body>
                  {list.members.length > 0 && (
                    <>
                      <Text>
                        {"Owner: "}
                        {`${list.owner.first_name} ${list.owner.last_name}`}
                      </Text>
                      <Text>
                        {"Members: "}
                        {list.members
                          .map(
                            (member) =>
                              `${member.first_name} ${member.last_name}`
                          )
                          .join(", ")}
                      </Text>
                    </>
                  )}
                </Card.Body>
              </VStack>
            </HStack>
          </Card.Root>
        ))}
        <CreateNewListDialog handleCreateList={handleCreateList} />
      </VStack>
    </Center>
  );
}
