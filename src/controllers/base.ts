import { createController } from "./createController";

export const baseController = createController("/");
const { router } = baseController;

router.get("/", (req, res) => {
    res.render("home", {
        title: "Home"
    })
});

router.get("/404", (req, res) => {
    res.send("404 error!");
})