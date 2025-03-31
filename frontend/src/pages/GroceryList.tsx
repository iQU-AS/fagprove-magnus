import { Box, Button, Center, HStack, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiService } from "../api/ApiService";
import {
  GroceryItemType,
  GroceryListType,
  ProductType,
  UserType,
} from "../api/Types";
import { AddNewItemDialog } from "../components/homepage/AddNewItemDialog";
import { GroceryListCheckboxCard } from "../components/homepage/GroceryListCheckboxCard";
import { GroceryListSelectBox } from "../components/homepage/GroceryListSelectBox";
import { SharingLinkDialog } from "../components/homepage/SharingLinkDialog";
import { LoadingSpinner } from "../components/utils.tsx/Spinner";

export function GroceryList() {
  const { list_id } = useParams<{ list_id: string }>();
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteLink, setInviteLink] = useState<string>();
  const [items, setItems] = useState<GroceryItemType[]>([]);
  const [availableProducts, setAvailableProducts] = useState<ProductType[]>([]);
  const [list, setList] = useState<GroceryListType>();
  const [user, setUser] = useState<UserType>();

  useEffect(() => {
    apiService.grocery_item
      .get_items_in_list(Number(list_id))
      .then((data) => setItems(data))
      .catch((err) => console.error("Error fetching grocery items:", err));

    apiService.grocery_list
      .get_single(Number(list_id))
      .then((data) => setList(data))
      .catch((err) => console.error("Error fetching grocery list:", err));

    apiService.user
      .get_user()
      .then((data) => setUser(data))
      .catch((err) => console.error("Error fetching user:", err));
  }, []);

  useEffect(() => {
    apiService.product
      .get_products()
      .then((data) => setAvailableProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const addItem = (product: ProductType) => {
    apiService.grocery_item
      .add_item_to_list(Number(list_id), {
        product: product.id,
        quantity: "1",
        bought: false,
        list: Number(list_id),
      })
      .then((newItem) => setItems((prevItems) => [...prevItems, newItem]))
      .catch((err) => console.error("Error adding item:", err));
  };

  const handleSaveNewItem = (newItemName: string, newItemPrice: number) => {
    apiService.product
      .create_product({ name: newItemName, price: String(newItemPrice) })
      .then((newProduct) => {
        setAvailableProducts((prev) => [...prev, newProduct]);
        addItem(newProduct);
      })
      .catch((err) => console.error("Error adding product:", err));

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
    apiService.grocery_list.delete_list(Number(list_id));
    window.location.href = "/";
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
    apiService.grocery_list.leave_list(Number(list_id));
  };

  if (!list || !user) return <LoadingSpinner />;

  return (
    <Center w={"100%"} h={"100%"} aria-label="Grocery list view" p={8}>
      <VStack w={"50%"} h={"100%"} overflow={"auto"}>
        <HStack aria-label="Navigation buttons">
          <Button
            w={"10rem"}
            onClick={() => (window.location.href = "/")}
            aria-label="Go back to homepage"
            bg={"primary.500"}
            _hover={{
              bg: "primary.600",
            }}
          >
            Back
          </Button>
          {list?.owner.id === user?.id ? (
            <>
              <Button
                w={"10rem"}
                onClick={share_list}
                aria-label="Share this grocery list"
                bg={"primary.500"}
                _hover={{
                  bg: "primary.600",
                }}
              >
                Share list
              </Button>
              <Button
                w={"10rem"}
                onClick={delete_list}
                aria-label="Delete this grocery list"
                bg={"primary.500"}
                _hover={{
                  bg: "primary.600",
                }}
              >
                Delete list
              </Button>
            </>
          ) : (
            <Button
              w={"10rem"}
              onClick={leave_list}
              aria-label="Leave this grocery list"
              bg={"primary.500"}
              _hover={{
                bg: "primary.600",
              }}
            >
              Leave list
            </Button>
          )}
        </HStack>

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
          aria-label="List of grocery items"
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

        <VStack aria-label="Summary section">
          <Text
            fontWeight="bold"
            aria-label={`Total cost is ${totalCost.toFixed(2)} NOK`}
          >
            Total Cost: {totalCost.toFixed(2)} NOK
          </Text>
          <Button
            w={"10rem"}
            onClick={finishShopping}
            aria-label="Remove bought items from list"
            bg={"primary.500"}
            _hover={{
              bg: "primary.600",
            }}
          >
            Finish Shopping
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
