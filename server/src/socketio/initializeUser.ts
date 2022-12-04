import { redisClient } from "../redis";
import { parseFriendList } from "./parseFriendList";

export const initializeUser = async (socket: any) => {
  socket.user = { ...socket.request.session.user };

  await redisClient.hset(
    `userid:${socket.user.username}`,
    "userid",
    socket.user.userid,
    "connected",
    true
  );
  const friendList = await redisClient.lrange(
    `friends:${socket.user.username}`,
    0,
    -1
  );
  const parsedFriendList = await parseFriendList(friendList);
  const friendRooms = parsedFriendList.map((friend) => friend.userid);

  if (friendRooms.length > 0)
    socket.to(friendRooms).emit("connected", true, socket.user.username);

  console.log(`${socket.user.username} friends:`, parsedFriendList);
  socket.emit("friends", parsedFriendList);
};
