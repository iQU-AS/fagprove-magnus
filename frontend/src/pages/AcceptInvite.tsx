import { Button, Center, Heading } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { apiService } from "../api/ApiService";

export function AcceptInvite() {
  const { token } = useParams<{ token: string }>();
  const Accept = () => {
    if (token) {
      apiService.grocery_list.accept_invite(token).then(() => {
        window.location.href = "/";
      });
    }
  };

  return (
    <Center h={"100%"} w={"100%"} flexDirection={"column"} gap={4}>
      <Heading>Accept Invite</Heading>
      <Button w={"10rem"} onClick={Accept}>
        Accept
      </Button>
    </Center>
  );
}
