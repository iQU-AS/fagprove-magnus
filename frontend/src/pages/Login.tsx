import {
  Button,
  Center,
  Heading,
  HStack,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export function Login() {
  const { login, register } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/";

  const handleSubmit = async () => {
    setError("");
    setEmailError(false);
    setPasswordError(false);
    setConfirmPasswordError(false);

    if (isLogin) {
      try {
        await login(email, password);
        (from);
        if (from === "/login") {
          navigate("/", { replace: true });
          return;
        }
        navigate(from, { replace: true });
      } catch {
        setError("Innlogging mislyktes. Vennligst sjekk e-post og passord.");
        setEmailError(true);
        setPasswordError(true);
      }
    } else {
      if (password !== confirmPassword) {
        setConfirmPasswordError(true);
        setError("Passord stemmer ikke.");
        return;
      }

      try {
        await register(email, password, firstName, lastName);
      } catch (err) {
        const error = err as AxiosError;

        if (
          error.response?.status === 400 &&
          error.response.data &&
          typeof error.response.data === "object" &&
          "email" in error.response.data
        ) {
          const data = error.response.data as { email: string[] };
          setError(data.email[0]);
          setEmailError(true);
        } else {
          setError("Registreringen mislyktes. Vennligst prøv igjen.");
        }
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <Center w="100%" h="100%" bg={"neutral.100"}>
      <VStack
        aria-label={isLogin ? "Påloggingsskjema" : "Påmeldingsskjema"}
        as="form"
        pb={"8rem"}
      >
        <Heading>{isLogin ? "Logg inn" : "Opprett konto"}</Heading>
        {!isLogin && (
          <>
            <Input
              aria-label="Fornavn"
              type="text"
              placeholder="Fornavn"
              value={firstName}
              onKeyUp={handleKeyPress}
              onChange={(e) => setFirstName(e.target.value)}
              borderColor="gray.200"
            />
            <Input
              aria-label="Etternavn"
              type="text"
              placeholder="Etternavn"
              value={lastName}
              onKeyUp={handleKeyPress}
              onChange={(e) => setLastName(e.target.value)}
              borderColor="gray.200"
            />
          </>
        )}
        <Input
          aria-label="E-post"
          type="text"
          placeholder="E-post"
          value={email}
          onKeyUp={handleKeyPress}
          onChange={(e) => setEmail(e.target.value)}
          borderColor={emailError ? "red.500" : "gray.200"}
        />
        <Input
          aria-label="Passord"
          type="password"
          placeholder="Passord"
          value={password}
          onKeyUp={handleKeyPress}
          onChange={(e) => setPassword(e.target.value)}
          borderColor={passwordError ? "red.500" : "gray.200"}
        />
        {!isLogin && (
          <Input
            aria-label="Bekreft passord"
            type="password"
            placeholder="Bekreft passord"
            value={confirmPassword}
            onKeyUp={handleKeyPress}
            onChange={(e) => setConfirmPassword(e.target.value)}
            borderColor={confirmPasswordError ? "red.500" : "gray.200"}
          />
        )}
        {error && (
          <Text color="red.500" role="alert">
            {error}
          </Text>
        )}
        <Button
          w={"10rem"}
          onClick={handleSubmit}
          aria-label={
            isLogin ? "Send inn påloggingsskjema" : "Send inn påmeldingsskjema"
          }
          bg={"primary.700"}
          _hover={{
            bg: "primary.800",
          }}
          color={"neutral.50"}
        >
          {isLogin ? "Logg inn" : "Opprett konto"}
        </Button>
        <HStack>
          <Text>
            {isLogin ? "Har du ikke en konto?" : "Har du allerede en konto?"}
          </Text>
          <Text
            onClick={() => {
              setError("");
              setEmailError(false);
              setPasswordError(false);
              setConfirmPasswordError(false);
              setIsLogin(!isLogin);
            }}
            cursor="pointer"
            textDecoration="underline"
            role="button"
            aria-label={
              isLogin
                ? "Bytt til påmeldingsskjema"
                : "Bytt til påloggingsskjema"
            }
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setError("");
                setEmailError(false);
                setPasswordError(false);
                setConfirmPasswordError(false);
                setIsLogin(!isLogin);
              }
            }}
          >
            {isLogin ? " Registrer deg" : " Logg inn"}
          </Text>
        </HStack>
      </VStack>
    </Center>
  );
}
