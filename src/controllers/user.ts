import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { createController } from "./createController";
import { User } from "../models/user";
import { Link } from "../models/link";

const { SECRET } = process.env;

export const userController = createController("/user");
const loginTitle = "Login";
const registerTitle = "Register"
const { router } = userController;

router.get("/", async (req, res) => {
    const title = "User"
    const { token } = req.cookies;

    if( !token ) return res.render("user", { title });

    const data: any = jwt.verify(token, SECRET);

    const finded = await Link.find({ author: data.login });
    const list = finded.map( ({ id, clicks }) => ({ id, clicks }) );

    res.render("user", {
        login: data.login,
        title,
        list
    })
})

router.get("/logout", async (req, res) => {
    res.clearCookie("token");

    res.redirect("/user");
})

router.get("/login", async (req, res) => {
    res.render("login", { title: loginTitle});
})

router.post("/login", async (req, res) => {
    const title = loginTitle;

    try{
        const { login, password } = req.body;

        const errors = [];
    
        if( !login ) errors.push("invalid password");
        if( !password ) errors.push("invalid password");
        
        if( errors.length ) return res.render("login", { errors, title });
    
        const finded = await User.findOne({ login }).exec();
        const isValidPassword = await bcrypt.compare(password, finded.password);

        if( !isValidPassword ) {
            errors.push("invalid password");
            return res.render("login", {errors, title});
        }
    
        if( !finded ) {
            errors.push("user not found!");
            return res.render("login", { errors, title });
        }
    
        res.cookie("token", jwt.sign({ login }, SECRET, { expiresIn: "1h" }), { maxAge: 60 * 60 * 1000 })
    
        return res.redirect("/");
    } catch(e) {
        res.render("login", {
            errors: ["error on server, try later!"],
            title
        });
    }
})

router.get("/register", async(req, res) => {
    res.render("register", { title: "Register" });
});

router.post("/register", async(req, res) => {
    const title = registerTitle;
    try{
        const { login, password } = req.body;

        const errors = []
    
        if( !login ) errors.push("invalid password");
        if( !password ) errors.push("invalid password");
    
        if( errors.length ) return res.render("register", { errors, title });
    
        const finded = await User.findOne({ login }).exec();
    
        if( finded ) {
            errors.push(`user ${login} already registered!`);
            return res.render("register", { errors, title });
        }
    
        const user = new User({ login, password:  await bcrypt.hash(password, 4) });
        await user.save();
        
        return res.render("register", { success: `user ${login} created!`, title });
    } catch(e) {
        res.render("register", {
            errors: ["error on server, try later!"],
            title
        })
    }
})