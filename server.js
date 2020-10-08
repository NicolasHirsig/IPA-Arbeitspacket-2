require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { StreamChat } = require('stream-chat');
const { query } = require('express');
const { keys } = require('localforage');

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

// route create expects username in request body
app.post('/create', async (req, res) => {
    const username = req.body.username;
    const roomnumber = req.body.roomnumber;
    const token = serverSideClient.createToken(username);
    const moderator = { id: 'moderator' };

    const channel = serverSideClient.channel('team', roomnumber, {
        name: 'Talk Shop',
        created_by: moderator,
    });

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

    const channels = await serverSideClient.queryChannels({ id: roomnumber });
    console.log(">------------------- " + roomnumber + " -----------------------------")
    if (!channels.length) {
        try {
            await channel.create();
            await channel.addModerators([username]);
            console.log("+ Moderator '" + username + "' created the room '" + channel.data.name + "'");
        } catch (err) {
            console.log(err);
        }
    } else {
        console.log(username)
        // special case to delete rooms
        if (username == "aadmin") {
            try {
                await channel.addModerators([username]);
                console.log("+ ADMIN JOINED");
            } catch (err) {
                console.log(err);
            }
        }
        else {
            return res
                .status(202)
                .json({ error: "room already exists." });
        }
    }

    console.log("= users currently in room [ " + Object.keys(channel.state.members) + "," + username + " ]");
    console.log("-----------------------------------------------------<")

    return res
        .status(200) // success!
        .json({ channel: "Talk Shop", token, api_key: process.env.STREAM_API_KEY });
});

app.post('/join', async (req, res) => {
    const username = req.body.username;
    const roomnumber = req.body.roomnumber;
    const token = serverSideClient.createToken(username);
    const moderator = { id: 'moderator' };

    const channel = serverSideClient.channel('team', roomnumber, {
        name: 'Talk Shop',
        created_by: moderator,
    });

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

    const channels = await serverSideClient.queryChannels({ id: roomnumber });
    console.log(">------------------- " + roomnumber + " -----------------------------")
    if (channels.length) {
        try {
            await channel.addMembers([username]);
            console.log("+ User '" + username + "' joined the room '" + channel._data.name + "'");
        } catch (err) {
            console.log(err);
        }
    } else {
        return res
            .status(202)
            .json({ error: "room not found." });
    }

    console.log("= users currently in room [ " + Object.keys(channel.state.members) + "," + username + " ]");
    console.log("-----------------------------------------------------<")

    return res
        .status(200) // success!
        .json({ channel: "Talk Shop", token, api_key: process.env.STREAM_API_KEY });
});



app.post('/remove', async (req, res) => {
    const username = req.body.username;
    const token = serverSideClient.createToken(username);
    const moderator = { id: 'moderator' };
    const channel = await getChannel("talkshop");

    const user = channel.queryMembers({ id: 'thick' });

    console.log(user)

    // channel.removeMembers(['user[0]']) or directly like channel.removeMembers([username])

    return res
        .status(200)
        .json({ token, api_key: process.env.STREAM_API_KEY });
});

app.post('/delete', async (req, res) => {
    const username = req.body.username;
    const roomnumber = req.body.roomnumber;
    const token = serverSideClient.createToken(username);
    const channel = await getChannel(roomnumber);

    await channel.delete();

    console.log("Moderator " + username + " deleted channel " + channel._data.name);

    return res
        .status(200)
        .json({ token, api_key: process.env.STREAM_API_KEY });
});

const server = app.listen(process.env.PORT || 5500, () => {
    const { port } = server.address();

    console.log(`Server running on PORT ${port}`);
});