import { redisClient } from "../redis";

export const addFriend = async (
    socket: any,
    friendName: string,
    cb: ({}) => void
  ) => {
    if (friendName === socket.user.username) {
      cb({ done: false, errorMsg: "Cannot add self!" });
      return;
    }
    const friend = await redisClient.hgetall(`userid:${friendName}`);
    const currentFriendList = await redisClient.lrange(
      `friends:${socket.user.username}`,
      0,
      -1
    );
    if (!friend) {
      cb({ done: false, errorMsg: "User doesn't exist!" });
      return;
    }
    if (currentFriendList && currentFriendList.indexOf(friendName) !== -1) {
      cb({ done: false, errorMsg: "Friend already added!" });
      return;
    }
  
    await redisClient.lpush(
      `friends:${socket.user.username}`,
      [friendName, friend.userid].join(".")
    );
  
    const newFriend = {
      username: friendName,
      userid: friend.userid,
      connected: friend.connected,
    };
    cb({ done: true, newFriend });
  };