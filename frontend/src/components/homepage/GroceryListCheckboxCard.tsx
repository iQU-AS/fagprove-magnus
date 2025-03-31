import {
  CheckboxCard,
  HStack,
  IconButton,
  NumberInput,
  VStack,
} from "@chakra-ui/react";
import { LuMinus, LuPlus } from "react-icons/lu";
import { apiService } from "../../api/ApiService";
import { GroceryItemType, ProductType } from "../../api/Types";

interface GroceryListCheckboxCardProps {
  item: GroceryItemType;
  items: GroceryItemType[];
  setItems: (items: GroceryItemType[]) => void;
  product: ProductType;
}

export function GroceryListCheckboxCard({
  item,
  items,
  setItems,
  product,
}: GroceryListCheckboxCardProps) {
  return (
    <CheckboxCard.Root
      w="100%"
      onCheckedChange={(checked) => {
        const newItems = items.map((it) =>
          it.id === item.id ? { ...it, bought: checked.checked === true } : it
        );
        setItems(newItems);
      }}
      key={item.id}
      aria-label={`Item ${product.name}, quantity ${
        item.quantity
      }, total price ${
        item.quantity * parseFloat(product.price.toFixed(2))
      } NOK`}
      colorPalette={"green"}
    >
      <CheckboxCard.HiddenInput />
      <CheckboxCard.Control>
        <CheckboxCard.Content>
          <VStack w="100%" align="start">
            <HStack w="30%">
              <CheckboxCard.Label
                aria-label={`Select ${item.quantity} ${
                  item.quantity > 1 ? "units of" : "unit of"
                } ${product.name}, costing ${
                  item.quantity * parseFloat(product.price.toFixed(2))
                } NOK`}
              >
                {item.quantity > 1 && `${item.quantity}x`} {product.name} -{" "}
                {item.quantity * parseFloat(product.price.toFixed(2))} NOK
              </CheckboxCard.Label>
              <NumberInput.Root
                defaultValue={String(item.quantity)}
                unstyled
                onValueChange={(details) => {
                  const value = details.valueAsNumber;
                  if (value === 0) {
                    setItems(items.filter((it) => it.id !== item.id));
                    apiService.grocery_item.delete_item_in_list(
                      item.list,
                      item.id
                    );
                  } else {
                    apiService.grocery_item
                      .edit_item_in_list(item.list, item.id, {
                        quantity: value.toString(),
                        product: item.product,
                        list: item.list,
                        bought: item.bought,
                      })
                      .then((newItem) => {
                        const newItems = items.map((it) =>
                          it.id === item.id ? newItem : it
                        );
                        setItems(newItems);
                      });
                  }
                }}
                aria-label={`Change quantity of ${product.name}`}
              >
                <HStack gap="2">
                  <NumberInput.DecrementTrigger asChild>
                    <IconButton
                      variant="outline"
                      size="xs"
                      color={"secondary.500"}
                      borderColor={"secondary.500"}
                      aria-label={`Decrease quantity of ${product.name}`}
                    >
                      <LuMinus />
                    </IconButton>
                  </NumberInput.DecrementTrigger>
                  <NumberInput.IncrementTrigger asChild>
                    <IconButton
                      color={"primary.500"}
                      borderColor={"primary.500"}
                      variant="outline"
                      size="xs"
                      aria-label={`Increase quantity of ${product.name}`}
                    >
                      <LuPlus />
                    </IconButton>
                  </NumberInput.IncrementTrigger>
                </HStack>
              </NumberInput.Root>
            </HStack>
            <CheckboxCard.Description>
              {`Requested by ${item.requested_by.first_name} ${item.requested_by.last_name}`}
            </CheckboxCard.Description>
          </VStack>
        </CheckboxCard.Content>
        <CheckboxCard.Indicator />
      </CheckboxCard.Control>
    </CheckboxCard.Root>
  );
}
