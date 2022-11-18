import { Grid, GridItem, Tabs } from "@chakra-ui/react";
import { createContext, SetStateAction, useState } from "react";
import Chat from "./Chat";
import Sidebar from "./Sidebar";

export interface IFriend {
  id: string;
  connected: any;
  username: string | undefined;
}

export interface Iprops {
  friendList: [] | never[] | IFriend[];
  setFriendList?:
    | React.Dispatch<React.SetStateAction<never[]>>
    | React.Dispatch<
        SetStateAction<{ id: string; username: string; connected: boolean }[]>
      >;
}
//@ts-ignore
export const FriendContext = createContext<Iprops>([]);

const Home = () => {
  const [friendList, setFriendList] = useState([
    { id: "123", username: "John", connected: false },
  ]);

  return (
    <FriendContext.Provider value={{ friendList, setFriendList }}>
      <Grid templateColumns="repeat(10, 1fr)" h="100vh" as={Tabs}>
        <GridItem colSpan={3} borderRight="1px solid gray">
          <Sidebar />
        </GridItem>
        <GridItem colSpan={7}>
          <Chat />
        </GridItem>
      </Grid>
    </FriendContext.Provider>
  );
};

export default Home;
