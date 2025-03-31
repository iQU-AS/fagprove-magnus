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
import AuthContext from "../context/AuthContext";

const AuthForm = () => {
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

  const handleSubmit = async () => {
    setError("");
    setEmailError(false);
    setPasswordError(false);
    setConfirmPasswordError(false);

    if (isLogin) {
      try {
        await login(email, password);
      } catch {
        setError("Login failed. Please check your email and password.");
        setEmailError(true);
        setPasswordError(true);
      }
    } else {
      if (password !== confirmPassword) {
        setConfirmPasswordError(true);
        setError("Passwords do not match.");
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
          setError("Signup failed. Please try again.");
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
    <Center w="100%" h="100%">
      <VStack
        aria-label={isLogin ? "Login form" : "Sign-up form"}
        as="form"
        pb={"8rem"}
      >
        <Heading>{isLogin ? "Login" : "Create Account"}</Heading>
        {!isLogin && (
          <>
            <Input
              aria-label="First Name"
              type="text"
              placeholder="First Name"
              value={firstName}
              onKeyUp={handleKeyPress}
              onChange={(e) => setFirstName(e.target.value)}
              borderColor="gray.200"
            />
            <Input
              aria-label="Last Name"
              type="text"
              placeholder="Last Name"
              value={lastName}
              onKeyUp={handleKeyPress}
              onChange={(e) => setLastName(e.target.value)}
              borderColor="gray.200"
            />
          </>
        )}
        <Input
          aria-label="Email"
          type="text"
          placeholder="Email"
          value={email}
          onKeyUp={handleKeyPress}
          onChange={(e) => setEmail(e.target.value)}
          borderColor={emailError ? "red.500" : "gray.200"}
        />
        <Input
          aria-label="Password"
          type="password"
          placeholder="Password"
          value={password}
          onKeyUp={handleKeyPress}
          onChange={(e) => setPassword(e.target.value)}
          borderColor={passwordError ? "red.500" : "gray.200"}
        />
        {!isLogin && (
          <Input
            aria-label="Confirm Password"
            type="password"
            placeholder="Confirm Password"
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
          aria-label={isLogin ? "Submit login form" : "Submit sign-up form"}
          bg={"primary.500"}
          _hover={{
            bg: "primary.600",
          }}
          color={"neutral.50"}
        >
          {isLogin ? "Login" : "Create Account"}
        </Button>
        <HStack>
          <Text>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
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
              isLogin ? "Switch to sign-up form" : "Switch to login form"
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
            {isLogin ? " Sign up" : " Login"}
          </Text>
        </HStack>
      </VStack>
    </Center>
  );
};

export default AuthForm;
