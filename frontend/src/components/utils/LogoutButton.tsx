import { Text } from "@chakra-ui/react";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";

export function LogoutButton() {
  const { logout } = useContext(AuthContext);

  return (
    <Text
      color={"neutral.50"}
      aria-label="Logg ut"
      style={{ cursor: "pointer", textDecoration: "underline" }}
      onClick={logout}
    >
      Logg ut
    </Text>
  );
}
