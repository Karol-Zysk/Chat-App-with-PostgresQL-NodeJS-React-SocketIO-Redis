import { redisClient } from "../redis";

export const authorizeUser = (socket: any, next: any) => {
  if (!socket.request.session || !socket.request.session.user) {
    console.log("Bad request!");
    next(new Error("Not authorized"));
  } else {
    next();
  }
};

export const initializeUser = async (socket: any) => {
  socket.user = { ...socket.request.session.user };
  await redisClient.hset(
    `userid:${socket.user.username}`,
    "userid",
    socket.user.userid
  );
  const friendList = await redisClient.lrange(
    `friends:${socket.user.username}`,
    0,
    -1
  );
  console.log(`${socket.user.username} friends:`, friendList);
  socket.emit("friends", friendList);
};

export const addFriend = async (
  socket: any,
  friendName: string,
  cb: ({}) => void
) => {
  if (friendName === socket.user.username) {
    cb({ done: false, errorMsg: "Cannot add self!" });
    return;
  }
  const friendUserID = await redisClient.hget(`userid:${friendName}`, "userid");
  const currentFriendList = await redisClient.lrange(
    `friends:${socket.user.username}`,
    0,
    -1
  );
  if (!friendUserID) {
    cb({ done: false, errorMsg: "User doesn't exist!" });
    return;
  }
  if (currentFriendList && currentFriendList.indexOf(friendName) !== -1) {
    cb({ done: false, errorMsg: "Friend already added!" });
    return;
  }

  await redisClient.lpush(`friends:${socket.user.username}`, friendName);
  cb({ done: true });
};
