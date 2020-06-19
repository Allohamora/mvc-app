import * as express from "express";
import { createController } from "./createController";

const router = express.Router();

router.get("/", (req, res) => {
    res.render("home", {
        title: "Home"
    })
})

export const homeController = createController(router, "/");