import { Button } from "@chakra-ui/button";
import { ChatIcon } from "@chakra-ui/icons";
import {
  Circle,
  Divider,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/layout";
import { Tab, TabList } from "@chakra-ui/tabs";
import { useContext } from "react";
import { FriendContext, IFriend, Iprops } from "./Home";

const Sidebar = () => {
  const { friendList }: Iprops = useContext(FriendContext);
  return (
    <VStack py="1.4rem">
      <HStack justify="space-evenly" w="100%">
        <Heading size="md">Add Friend</Heading>
        <Button>
          <ChatIcon />
        </Button>
      </HStack>
      <Divider />
      <VStack w="full" display="flex" as={TabList}>
        {friendList.map((friend: IFriend) => (
          <HStack
            key={friend.id}
            paddingX="5"
            w="full"
            justifyContent="space-between"
            as={Tab}
          >
            <Text fontSize="2xl">{friend.username}</Text>
            <Circle
              bg={friend.connected ? "green.900" : "gray.500"}
              //@ts-ignore
              w="15px"
              h="15px"
            />
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
};

export default Sidebar;
