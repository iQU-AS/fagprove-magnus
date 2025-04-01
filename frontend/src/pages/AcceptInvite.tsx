import { Button, Center, Heading } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { apiService } from "../api/ApiService";

export function AcceptInvite() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const Accept = () => {
    if (token) {
      apiService.grocery_list.accept_invite(token).then(() => {
        navigate("/");
      });
    }
  };

  return (
    <Center h={"100%"} w={"100%"} flexDirection={"column"} gap={4}>
      <Heading>Godta invitasjon</Heading>
      <Button
        w={"10rem"}
        onClick={Accept}
        bg={"primary.700"}
        _hover={{
          bg: "primary.800",
        }}
        color={"neutral.50"}
      >
        Akseptere
      </Button>
    </Center>
  );
}
