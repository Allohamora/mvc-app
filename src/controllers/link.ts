import * as express from "express";
import { createController } from "./createController";

const router = express.Router();

router.post("/create", (req, res) => {

    const { url } = req.body;

    if( !url ) return res.send({ error: "no url!" });
    
    const regexp = /^https?:\/\//;
    if( !regexp.test(url) ) res.send({ error: "incorect url!" });

    res.send({ 
        success: "link created!",
        link: ""
    });
    
});

router.get("/:id", (req, res) => {
    res.send("123");
})

export const linkController = createController(router, "/");