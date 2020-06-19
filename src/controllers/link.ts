import { createController } from "./createController";
import * as jwt from "jsonwebtoken";
import * as hasha from "hasha";
import { Link } from "../models/link";

const { SECRET, PORT } = process.env;

export const linkController = createController("/");
const { router } = linkController;

router.post("/create", async (req, res) => {
    const title = "Home";
    try {

        const { url } = req.body;
        const { token } = req.cookies;
    
        let author: any = "";
    
        if( token ) {
            const data: any = jwt.verify(token, SECRET);
            author = data.login;
        } else {
            author = "anonymous";
        }
    
        const errors = [];
    
        if( !url ) {
            errors.push("no url");
    
            return res.render("home", {
                errors,
                title
            });
        }
    
        const regexp = /^https?:\/\//;
        if( !regexp.test(url) ) {
            errors.push("incorrect url");
    
            return res.render("home", {
                errors,
                title
            });
        }

        const finded = await Link.findOne({ url }).exec();

        if( finded ) {
            res.render("home", {
                success: `link: http://localhost:${PORT}/${finded.id}`,
                title
            });
        } else {
            const id = hasha(url).slice(0, 6);
    
            const link = new Link({ author, url, id, clicks: 0 });
            await link.save();
        
            res.render("home", {
                success: `link: http://localhost:${PORT}/${id}`,
                title
            });
        }

    } catch(e) {
        return res.render("home", {
            errors: ["error on server, try later!"],
            title
        })
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;

    const finded = await Link.findOne({ id }).exec();
    
    if( finded ) {
        finded.clicks += 1;
        await finded.save();

        return res.redirect(finded.url);
    }

    res.redirect("/404");
})