require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { StreamChat } = require("stream-chat");
const { query } = require("express");
const { keys } = require("localforage");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// initialize Stream Chat SDK

const serverSideClient = new StreamChat(
  process.env.STREAM_API_KEY,
  process.env.STREAM_APP_SECRET
);

async function getChannel(id) {
  const channel = await serverSideClient.queryChannels({ id: id });
  return channel[0];
}

// creates channel
app.post("/create", async (req, res) => {
  const username = req.body.username;
  const roomnumber = req.body.roomnumber;
  const token = serverSideClient.createToken(username);
  const moderator = { id: "moderator" };

  const channel = serverSideClient.channel("team", roomnumber, {
    name: "Talk Shop",
    created_by: moderator,
  });

  try {
    await serverSideClient.updateUser(
      {
        id: username,
        name: username,
        role: "admin",
      },
      token
    );
  } catch (err) {
    console.log(err);
  }

  const channels = await serverSideClient.queryChannels({ id: roomnumber });
  if (!channels.length) {
    try {
      await channel.create();
      await channel.addModerators([username]);
    } catch (err) {
      console.log(err);
    }
  } else {
    return res.status(202).json();
  }
  return res
    .status(200)
    .json({ channel: "Talk Shop", token, api_key: process.env.STREAM_API_KEY });
});

// joins a channel
app.post("/join", async (req, res) => {
  const username = req.body.username;
  const roomnumber = req.body.roomnumber;
  const token = serverSideClient.createToken(username);
  const moderator = { id: "moderator" };

  const channel = serverSideClient.channel("team", roomnumber, {
    name: "Talk Shop",
    created_by: moderator,
  });

  try {
    await serverSideClient.updateUser(
      {
        id: username,
        name: username,
      },
      token
    );
  } catch (err) {
    console.log(err);
  }

  const channels = await serverSideClient.queryChannels({ id: roomnumber });
  if (channels.length) {
    for (channeluser in channels[0].state.members) {
      console.log("yeah that happened right? 222")
      if (channeluser == username) {
        console.log("yeah that happened right?")
        return res.status(203).json();
      }
    }
    try {
      await channel.addMembers([username]);
    } catch (err) {
      console.log(err);
    }
  } else {
    return res.status(202).json();
  }
  return res
    .status(200) // success!
    .json({ channel: "Talk Shop", token, api_key: process.env.STREAM_API_KEY });
});

// deletes a channel
app.post("/delete", async (req, res) => {
  try {
    const channel = await getChannel(req.body.roomnumber);
    await channel.delete();
  } catch (err) {
    console.log(err);
  }

  return res.status(200).json({ api_key: process.env.STREAM_API_KEY });
});

// deletes all channels
app.post("/deleteChannels", async (req, res) => {
  try {
    const channels = await serverSideClient.queryChannels({});
    for (const c of channels) {
      console.log(c.cid);
      c.delete();
    }
  } catch (err) {
    console.log(err);
  }
  return res.status(200).json({});
});

const server = app.listen(process.env.PORT || 5500, () => {
  const { port } = server.address();

  console.log(`Server running on PORT ${port}`);
});
