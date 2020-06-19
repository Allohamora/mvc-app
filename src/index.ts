import { App } from "./App";
import { linkController } from "./controllers/link";
import { homeController } from "./controllers/home";

const routes = [ 
    homeController,
    linkController
];

const app = new App(routes);

app.launch();