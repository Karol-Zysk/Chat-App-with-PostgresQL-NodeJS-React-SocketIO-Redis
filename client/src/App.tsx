import { Box, Flex } from "@chakra-ui/react";
import UserContext from "./components/AccountContext";
import ToggleColorMode from "./components/ToggleColorMode";
import Views from "./components/Views";

function App() {
  return (
    <UserContext>
      <Box paddingX="16" paddingY="10">
        <Views />
        <ToggleColorMode />
      </Box>
    </UserContext>
  );
}

export default App;
