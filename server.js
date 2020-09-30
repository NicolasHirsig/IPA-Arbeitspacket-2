require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { StreamChat } = require('stream-chat');
const { query } = require('express');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// initialize Stream Chat SDK

const serverSideClient = new StreamChat(
    process.env.STREAM_API_KEY,
    process.env.STREAM_APP_SECRET
);

// route join expects username in request body
app.post('/join', async (req, res) => {
    const username = req.body.username;
    const token = serverSideClient.createToken(username);
    try {
        await serverSideClient.updateUser(
            {
                id: username,
                name: username
            },
            token
        );
    } catch (err) {
        console.log(err);
    }

    const moderator = { id: 'moderator' };
    const channel = serverSideClient.channel('team', 'talkshop', {
        name: 'Talk Shop',
        created_by: moderator,
    });

    const channels = await serverSideClient.queryChannels({ name: "Talk Shop" });
    // if channel doesnt exist, create it and add user as Moderator. If it does, add user as member
    if (!channels.length) {
        try {
            await channel.create();
            await channel.addModerators([username]);
            console.log("---------Moderator '" + username + "' joined the room '" + channel.data.name + "'");
        } catch (err) {
            console.log(err);
        }
    } else {
        try {
            await channel.addMembers([username]);
        } catch (err) {
            console.log(err);
        }
    }

    console.log(Object.keys(channel.state.members));

    return res
        .status(200)    // the Success-response :D
        .json({ channel: "Talk Shop", token, api_key: process.env.STREAM_API_KEY });
});

app.post('/delete', async (req, res) => {

    // delete all channels that dont have users in them
    await channel.state.delete();

    return res
        .status(200)    // the Success-response :D
        .json({ token, api_key: process.env.STREAM_API_KEY });
});

const server = app.listen(process.env.PORT || 5500, () => {
    const { port } = server.address();
    console.log(`Server running on PORT ${port}`);
});