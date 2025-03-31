import { Center, Spinner } from "@chakra-ui/react";

export function LoadingSpinner() {
  return (
    <Center h={"100vh"}>
      <Spinner w={"10rem"} h={"10em"} />
    </Center>
  );
}
