import { createController } from "./createController";
import { User } from "../models/user";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { Link } from "../models/link";

const { SECRET } = process.env;

export const userController = createController("/user");
const { router } = userController;

router.get("/", async (req, res) => {
    const { token } = req.cookies;

    if( !token ) return res.render("user");

    const data: any = jwt.verify(token, SECRET);

    const finded = await Link.find({ author: data.login });
    const list = finded.map( ({ id, clicks }) => ({ id, clicks }) );

    res.render("user", {
        login: data.login,
        list
    })
})

router.get("/logout", async (req, res) => {
    res.clearCookie("token");

    res.redirect("/user");
})

router.get("/login", async (req, res) => {
    res.render("login");
})

router.post("/login", async (req, res) => {
    try{
        const { login, password } = req.body;

        const errors = []
    
        if( !login ) errors.push("invalid password");
        if( !password ) errors.push("invalid password");
        
        if( errors.length ) return res.render("login", { errors });
    
        const finded = await User.findOne({ login }).exec();
    
        if( !finded ) {
            errors.push("user not found!");
            return res.render("login", { errors });
        }
    
        res.cookie("token", jwt.sign({ login }, SECRET, { expiresIn: "1h" }), { maxAge: 60 * 60 * 1000 })
    
        return res.redirect("/");
    } catch(e) {
        res.render("login", {
            errors: ["error on server, try later!"],
        });
    }
})

router.get("/register", async(req, res) => {
    res.render("register");
});

router.post("/register", async(req, res) => {
    try{
        const { login, password } = req.body;

        const errors = []
    
        if( !login ) errors.push("invalid password");
        if( !password ) errors.push("invalid password");
    
        if( errors.length ) return res.render("register", { errors });
    
        const finded = await User.findOne({ login }).exec();
    
        if( finded ) {
            errors.push("user already register!");
            return res.render("register", { errors });
        }
    
        const user = new User({ login, password:  await bcrypt.hash(password, 4) });
        await user.save();
        
        return res.render("register", { success: `user ${login} create!` });
    } catch(e) {
        res.render("register", {
            errors: ["error on server, try later!"],
        })
    }
})