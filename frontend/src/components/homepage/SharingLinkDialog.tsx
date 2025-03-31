import { Button, CloseButton, Dialog, Portal, Text } from "@chakra-ui/react";

interface SharingLinkDialogProps {
  inviteLink: string;
  isInviteDialogOpen: boolean;
  setIsInviteDialogOpen: (e: boolean) => void;
}

export function SharingLinkDialog({
  inviteLink,
  isInviteDialogOpen,
  setIsInviteDialogOpen,
}: SharingLinkDialogProps) {
  return (
    <Dialog.Root
      lazyMount
      open={isInviteDialogOpen}
      onOpenChange={(e) => setIsInviteDialogOpen(e.open)}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-dialog-title"
            aria-describedby="share-dialog-desc"
          >
            <Dialog.Header>
              <Dialog.Title id="share-dialog-title">Sharing link</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Text id="share-dialog-desc">{inviteLink}</Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button
                  w={"10rem"}
                  variant="outline"
                  aria-label="Close sharing link dialog"
                  bg={"primary.500"}
                  _hover={{
                    bg: "primary.600",
                  }}
                  color={"neutral.50"}
                >
                  Ok
                </Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" aria-label="Close dialog" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
