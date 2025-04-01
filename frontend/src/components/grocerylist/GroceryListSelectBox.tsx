import {
  createListCollection,
  HStack,
  IconButton,
  Portal,
  Select,
} from "@chakra-ui/react";
import { useState } from "react";
import { LuTrash2 } from "react-icons/lu";
import { apiService } from "../../api/ApiService";
import { ProductType } from "../../api/Types";

interface GroceryListSelectBoxProps {
  setDialogOpen: (open: boolean) => void;
  addItem: (product: ProductType) => void;
  setAvailableItems: (items: ProductType[]) => void;
  availableItems: ProductType[];
}

export function GroceryListSelectBox({
  setDialogOpen,
  addItem,
  setAvailableItems,
  availableItems,
}: GroceryListSelectBoxProps) {
  const [selectedItem, setSelectedItem] = useState<string[]>([]);

  const availableCollection = createListCollection({
    items: availableItems.map((item) => ({
      label: item.name,
      value: item.id,
      price: item.price,
    })),
  });

  return (
    <Select.Root
      value={selectedItem}
      onValueChange={(details) => {
        const selectedValue = details.value[0];

        if (selectedValue === "add-new") {
          setDialogOpen(true);
        } else {
          const selectedProduct = availableItems.find(
            (item) => String(item.id) === String(selectedValue)
          );

          if (selectedProduct) {
            addItem(selectedProduct);
          }
          setSelectedItem([]);
        }
      }}
      collection={availableCollection}
      aria-label="Velg en dagligvarevare"
    >
      <Select.HiddenSelect />
      <Select.Label id="grocery-select-label">Velg vare</Select.Label>
      <HStack w="100%">
        <Select.Control w="100%">
          <Select.Trigger
            borderColor="neutral.200"
            aria-haspopup="listbox"
            aria-labelledby="grocery-select-label"
          >
            <Select.ValueText placeholder="Select item" />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
        <Portal>
          <Select.Positioner>
            <Select.Content bg="neutral.50">
              {availableCollection.items.map((product) => (
                <Select.Item
                  item={product}
                  key={product.value}
                  aria-label={`Select ${
                    product.label
                  } priset til ${product.price.toFixed(2)} NOK`}
                >
                  <HStack justifyContent="space-between" w="100%">
                    {product.label} - {product.price.toFixed(2)} NOK
                    <IconButton
                      aria-label={`Slett ${product.label}`}
                      size="xs"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        apiService.product
                          .delete_product(String(product.value))
                          .then(() => {
                            setAvailableItems(
                              availableItems.filter(
                                (p) => p.id !== product.value
                              )
                            );
                          });
                      }}
                      color="secondary.700"
                    >
                      <LuTrash2 />
                    </IconButton>
                  </HStack>
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
              <Select.Item
                item="add-new"
                key="add-new"
                aria-label="Legg til et nytt vare"
              >
                -- Legg til nytt vare --
                <Select.ItemIndicator />
              </Select.Item>
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </HStack>
    </Select.Root>
  );
}
