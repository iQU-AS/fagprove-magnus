import { Button, Dialog, Input, NumberInput } from "@chakra-ui/react";
import { useState } from "react";

interface AddNewItemDialogProps {
  isDialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  handleSaveNewItem: (newItemName: string, newItemPrice: number) => void;
}

export function AddNewItemDialog({
  isDialogOpen,
  setDialogOpen,
  handleSaveNewItem,
}: AddNewItemDialogProps) {
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState<number>(0);

  return (
    <Dialog.Root
      open={isDialogOpen}
      onOpenChange={({ open }) => {
        setDialogOpen(open);
        if (!open) {
          setNewItemName("");
          setNewItemPrice(0);
        }
      }}
    >
      <Dialog.Trigger asChild>
        <span style={{ display: "none" }} />
      </Dialog.Trigger>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-item-title"
          aria-describedby="add-item-desc"
          bg="neutral.100"
        >
          <Dialog.CloseTrigger aria-label="Close add new item dialog" />
          <Dialog.Header>
            <Dialog.Title id="add-item-title">Add New Item</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body id="add-item-desc">
            <Input
              aria-label="New item name"
              placeholder="Enter new item name"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              mb={4}
            />
            <NumberInput.Root
              defaultValue="0"
              onValueChange={(e) => {
                setNewItemPrice(e.valueAsNumber);
              }}
              aria-label="New item price"
              formatOptions={{
                style: "currency",
                currency: "NOK",
                currencyDisplay: "code",
                currencySign: "accounting",
              }}
            >
              <NumberInput.Control />
              <NumberInput.Input aria-label="Item price input field" />
            </NumberInput.Root>
          </Dialog.Body>
          <Dialog.Footer>
            <Button
              w={"10rem"}
              onClick={() => setDialogOpen(false)}
              bg={"secondary.400"}
              aria-label="Cancel adding new item"
            >
              Cancel
            </Button>
            <Button
              w={"10rem"}
              bg={"primary.600"}
              onClick={() => {
                handleSaveNewItem(newItemName, newItemPrice);
                setNewItemName("");
                setNewItemPrice(0);
              }}
              ml={3}
              aria-label="Save new item"
            >
              Save
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
