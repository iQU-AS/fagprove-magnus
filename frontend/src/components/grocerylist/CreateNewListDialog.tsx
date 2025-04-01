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
          aria-label="Åpne dialogboksen for å opprette ny liste"
          bg={"primary.700"}
          _hover={{
            bg: "primary.800",
          }}
          color={"neutral.50"}
          shadow={"md"}
        >
          Opprett liste
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
          <Dialog.CloseTrigger aria-label="Lukk dialogboksen for opprettelse av liste" />
          <Dialog.Header>
            <Dialog.Title id="create-list-title">Opprett ny liste</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body id="create-list-desc">
            <Input
              aria-label="Nytt "
              placeholder="Listenavn"
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
                aria-label="Avbryt"
                bg={"secondary.700"}
                _hover={{
                  bg: "secondary.800",
                }}
                color={"neutral.50"}
              >
                Avbryt
              </Button>
            </Dialog.ActionTrigger>
            <Button
              w={"10rem"}
              ml={3}
              onClick={() => {
                handleCreateList(newListName);
                setOpen(false);
              }}
              aria-label="Lagre ny liste"
              bg={"primary.700"}
              _hover={{
                bg: "primary.800",
              }}
              color={"neutral.50"}
            >
              Lagre
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
