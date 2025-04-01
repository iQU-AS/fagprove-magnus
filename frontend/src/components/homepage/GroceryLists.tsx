import { Card, HStack, Heading, Text, VStack } from "@chakra-ui/react";
import { MdOutlineLocalGroceryStore } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { GroceryListType } from "../../api/Types";
import { CreateNewListDialog } from "../grocerylist/CreateNewListDialog";

interface GroceryListsProps {
  lists: GroceryListType[];
  handleCreateList: (name: string) => void;
}

export function GroceryLists({ lists, handleCreateList }: GroceryListsProps) {
  const navigate = useNavigate();

  return (
    <VStack
      w={"100%"}
      h={"100%"}
      overflow={"auto"}
      aria-label="Liste over handlelister"
      borderWidth={0}
      p={4}
      borderRadius={8}
      shadow={"sm"}
    >
      {lists.length === 0 && (
        <Text fontSize={"xl"}>Du har ingen handlelister ennå.</Text>
      )}
      {lists.map((list) => (
        <Card.Root
          key={list.id}
          w={"100%"}
          borderWidth={2}
          role="button"
          onClick={() => navigate(`/list/${list.id}`)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              navigate(`/list/${list.id}`);
            }
          }}
          p={4}
          aria-label={`Åpne handleliste ${list.name}`}
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
                      {"Eier: "}
                      {`${list.owner.first_name} ${list.owner.last_name}`}
                    </Text>
                    <Text>
                      {"Medlemmer: "}
                      {list.members
                        .map(
                          (member) => `${member.first_name} ${member.last_name}`
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
  );
}
