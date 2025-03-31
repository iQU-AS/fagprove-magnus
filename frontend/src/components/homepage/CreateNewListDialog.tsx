import { Button, Dialog, Input } from "@chakra-ui/react";
import { useState } from "react";

interface CreateNewListDialogProps {
  handleCreateList: (name: string) => void;
}

export function CreateNewListDialog({
  handleCreateList,
}: CreateNewListDialogProps) {
  const [newListName, setNewListName] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Dialog.Trigger>
        <Button
          w={"10rem"}
          aria-label="Open create new list dialog"
          bg={"primary.500"}
          _hover={{
            bg: "primary.600",
          }}
          shadow={"md"}
        >
          Create List
        </Button>
      </Dialog.Trigger>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-list-title"
          aria-describedby="create-list-desc"
        >
          <Dialog.CloseTrigger aria-label="Close create list dialog" />
          <Dialog.Header>
            <Dialog.Title id="create-list-title">Create New List</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body id="create-list-desc">
            <Input
              aria-label="New list name"
              placeholder="List Name"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  handleCreateList(newListName);
                  setOpen(false);
                }
              }}
            />
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.ActionTrigger asChild>
              <Button
                w={"10rem"}
                variant="ghost"
                aria-label="Cancel"
                bg={"secondary.400"}
                _hover={{
                  bg: "secondary.500",
                }}
                color={"neutral.50"}
              >
                Cancel
              </Button>
            </Dialog.ActionTrigger>
            <Button
              w={"10rem"}
              ml={3}
              onClick={() => {
                handleCreateList(newListName);
                setOpen(false);
              }}
              aria-label="Save new list"
              bg={"primary.500"}
              _hover={{
                bg: "primary.600",
              }}
              color={"neutral.50"}
            >
              Save
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
