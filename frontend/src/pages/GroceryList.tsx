import { Box, Button, Center, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiService } from "../api/ApiService";
import {
  GroceryItemType,
  GroceryListType,
  ProductType,
  UserType,
} from "../api/Types";
import { AddNewItemDialog } from "../components/grocerylist/AddNewItemDialog";
import { GroceryListCheckboxCard } from "../components/grocerylist/GroceryListCheckboxCard";
import { GroceryListSelectBox } from "../components/grocerylist/GroceryListSelectBox";
import { SharingLinkDialog } from "../components/grocerylist/SharingLinkDialog";
import { LoadingSpinner } from "../components/utils/Spinner";

export function GroceryList() {
  const { list_id } = useParams<{ list_id: string }>();
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteLink, setInviteLink] = useState<string>();
  const [items, setItems] = useState<GroceryItemType[]>([]);
  const [availableProducts, setAvailableProducts] = useState<ProductType[]>([]);
  const [list, setList] = useState<GroceryListType>();
  const [user, setUser] = useState<UserType>();
  const navigate = useNavigate();

  useEffect(() => {
    apiService.grocery_item
      .get_items_in_list(Number(list_id))
      .then((data) => setItems(data));

    apiService.grocery_list
      .get_single(Number(list_id))
      .then((data) => setList(data))
      .catch(() => navigate("/"));

    apiService.user.get_user().then((data) => setUser(data));
  }, []);

  useEffect(() => {
    apiService.product
      .get_products()
      .then((data) => setAvailableProducts(data));
  }, []);

  const addItem = (product: ProductType) => {
    apiService.grocery_item
      .add_item_to_list(Number(list_id), {
        product: product.id,
        quantity: "1",
        bought: false,
        list: Number(list_id),
      })
      .then((newItem) => setItems((prevItems) => [...prevItems, newItem]));
  };

  const handleSaveNewItem = (newItemName: string, newItemPrice: number) => {
    apiService.product
      .create_product({ name: newItemName, price: String(newItemPrice) })
      .then((newProduct) => {
        setAvailableProducts((prev) => [...prev, newProduct]);
        addItem(newProduct);
      });

    setIsAddItemDialogOpen(false);
  };

  const finishShopping = () => {
    apiService.grocery_list.finish_shopping(
      Number(list_id),
      items.filter((item) => item.bought).map((item) => item.id)
    );
    setItems(items.filter((item) => !item.bought));
  };

  const totalCost = items.reduce(
    (acc, item) =>
      acc +
      item.quantity *
        (availableProducts.find((p) => p.id === item.product)?.price || 0),
    0
  );

  const delete_list = () => {
    apiService.grocery_list.delete_list(Number(list_id)).then(() => {
      navigate("/");
    });
  };

  const share_list = () => {
    apiService.grocery_list.invite_to_list(Number(list_id)).then((res) => {
      const href = window.location.href;
      const secondLastSlash = href.lastIndexOf("/", href.lastIndexOf("/") - 1);
      const baseUrl = href.substring(0, secondLastSlash);
      setInviteLink(`${baseUrl}/join-list/${res.data.invite_token}`);
    });
    setIsInviteDialogOpen(true);
  };

  const leave_list = () => {
    apiService.grocery_list.leave_list(Number(list_id)).then(() => {
      navigate("/");
    });
  };

  if (!list || !user) return <LoadingSpinner />;

  return (
    <Center w={"100%"} h={"100%"} aria-label="Visning av dagligvareliste" p={8}>
      <VStack
        w={{ base: "100%", md: "100%", lg: "50%" }}
        h={"100%"}
        overflow={"auto"}
      >
        <Center
          aria-label="Navigasjonsknapper"
          flexDirection={{ base: "column", md: "row" }}
          gap={2}
          w={"100%"}
        >
          <Button
            w={{ base: "100%", md: "10rem" }}
            onClick={() => navigate("/")}
            aria-label="Gå tilbake til hjemmesiden"
            bg={"primary.700"}
            _hover={{
              bg: "primary.800",
            }}
            color={"neutral.50"}
          >
            Tilbake
          </Button>
          {list?.owner.id === user?.id ? (
            <>
              <Button
                w={{ base: "100%", md: "10rem" }}
                onClick={share_list}
                aria-label="Del denne handlelisten"
                bg={"primary.700"}
                _hover={{
                  bg: "primary.800",
                }}
                color={"neutral.50"}
              >
                Del liste
              </Button>
              <Button
                w={{ base: "100%", md: "10rem" }}
                onClick={delete_list}
                aria-label="Slett denne handlelisten"
                bg={"primary.700"}
                _hover={{
                  bg: "primary.800",
                }}
                color={"neutral.50"}
              >
                Slett liste
              </Button>
            </>
          ) : (
            <Button
              w={{ base: "100%", md: "10rem" }}
              onClick={leave_list}
              aria-label="Forlat denne handlelisten"
              bg={"primary.700"}
              _hover={{
                bg: "primary.800",
              }}
              color={"neutral.50"}
            >
              Forlat listen
            </Button>
          )}
        </Center>

        <GroceryListSelectBox
          setDialogOpen={setIsAddItemDialogOpen}
          addItem={addItem}
          setAvailableItems={setAvailableProducts}
          availableItems={availableProducts}
        />

        <VStack
          overflow={"auto"}
          h={"100%"}
          w={"100%"}
          aria-label="Liste over dagligvarevarer"
        >
          {items.map((item) => {
            const product = availableProducts.find(
              (p) => p.id === item.product
            );
            return product ? (
              <Box w={"100%"} key={item.id}>
                <GroceryListCheckboxCard
                  item={item}
                  items={items}
                  setItems={setItems}
                  product={product}
                />
              </Box>
            ) : null;
          })}
        </VStack>

        <VStack aria-label="Oppsummeringsdelen">
          <Text
            fontWeight="bold"
            aria-label={`Total kostnad er ${totalCost.toFixed(2)} NOK`}
          >
            Total kostnad: {totalCost.toFixed(2)} NOK
          </Text>
          <Button
            w={{ base: "7rem", md: "10rem" }}
            onClick={finishShopping}
            aria-label="Fjern kjøpte varer fra listen"
            bg={"primary.700"}
            _hover={{
              bg: "primary.800",
            }}
            color={"neutral.50"}
          >
            Fullfør shopping
          </Button>
        </VStack>

        <AddNewItemDialog
          isDialogOpen={isAddItemDialogOpen}
          setDialogOpen={setIsAddItemDialogOpen}
          handleSaveNewItem={handleSaveNewItem}
        />

        {inviteLink && (
          <SharingLinkDialog
            inviteLink={inviteLink}
            isInviteDialogOpen={isInviteDialogOpen}
            setIsInviteDialogOpen={setIsInviteDialogOpen}
          />
        )}
      </VStack>
    </Center>
  );
}
