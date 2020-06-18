import * as express from "express";
import { createController } from "./createController";


const router = express.Router();
export const linkController = createController(router, "/test");

router.get("/", (req, res) => {

    res.render("home", {
        title: "Home",
        layout: "index",
    });
    
});