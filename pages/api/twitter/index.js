import nc from "next-connect";
import cors from "cors";

const handler = nc()
    .use(cors())
    .post(async (req, res) => {

        const responseTwitter = await fetch(`https://api.twitter.com/1.1/users/lookup.json?user_id=${req.body.userId}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + process.env.TWITTER_BEARER,
            },
        });

        const content = await responseTwitter.json();
        const username = content[0].screen_name;

        // return username with status 200
        res.status(200).json({
            username: username,
        });

    })

export default handler;