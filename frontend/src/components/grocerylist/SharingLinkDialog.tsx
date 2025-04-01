import {
  Button,
  Clipboard,
  CloseButton,
  Dialog,
  Link,
  Portal,
  Text,
} from "@chakra-ui/react";

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
            w={{ base: "90%", md: "30rem" }}
          >
            <Dialog.Header>
              <Dialog.Title id="share-dialog-title">Delingslenke</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Text mb={4}>
                Del lenken med dem du vil invitere til handlelisten. Lenken er
                gyldig i 24 timer.
              </Text>
              <Clipboard.Root value={inviteLink}>
                <Clipboard.Trigger asChild>
                  <Link as="span" color="blue.fg" textStyle="sm">
                    <Clipboard.Indicator />
                    <Clipboard.ValueText />
                  </Link>
                </Clipboard.Trigger>
              </Clipboard.Root>
            </Dialog.Body>
            <Dialog.Footer justifyContent={"center"}>
              <Dialog.ActionTrigger asChild>
                <Button
                  w={{ base: "7rem", md: "10rem" }}
                  variant="outline"
                  aria-label="Lukk delingslenkedialogen"
                  bg={"primary.700"}
                  _hover={{
                    bg: "primary.800",
                  }}
                  color={"neutral.50"}
                >
                  Ok
                </Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" aria-label="Lukk dialog" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
