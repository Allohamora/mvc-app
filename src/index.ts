import * as dotenv from "dotenv";
// init .env
dotenv.config();

import { App } from "./App";
import { linkController } from "./controllers/link";
import { baseController } from "./controllers/base";
import { userController } from "./controllers/user";

const routes = [ 
    baseController,
    userController,
    linkController,
];

const app = new App(routes);

app.launch();