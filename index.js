import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();  // Load environment variables

const port = 4000;
const app = express();
const hostname = "127.0.0.1";
const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY;
app.use(express.urlencoded({extended: false}));
app.use(express.json());

async function jokeGenerator() {
    const response = await axios.get("https://icanhazdadjoke.com/", {
        headers: {
            'Accept' : 'application/json'
        }
    });
    return response.data.joke;
}

async function imageGenerator() {
    const response = await axios.get("https://api.unsplash.com/photos/random", {
        params: { client_id: unsplashAccessKey },
    });
    return response.data.urls.regular;
}

app.get("/api/jokes/random", async (req, res) => {
    try {
        const joke = await jokeGenerator();
        res.json({joke});
    } catch(error) {
        console.log("Error fetching random joke: " + error);
        res.status(500).json({error: "Failed to fetch random image or random joke!"});
    }
});

app.get("/api/images/random", async (req, res) => {
    try {
        const image = await imageGenerator();
        res.json({image});  // You can refine this to send specific parts of the image data
    } catch(error) {
        console.log("Error fetching random image: " + error);
        res.status(500).json({error: "Failed to fetch random image or random joke!"});
    }
});

app.get("/api/joke-image/random", async (req, res) => {
    try {
        const joke = await jokeGenerator();
        const image = await imageGenerator();
        res.json({joke, image});
    }
    catch(error) {
        console.log("Error fetching random image or random joke: " + error);
        res.status(500).json({error: "Failed to fetch random image or random joke!"});
    }
})

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
