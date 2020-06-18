import { App } from "./App";
import { linkController } from "./controllers/link";

const routes = [ linkController ];
const app = new App(routes);

app.launch();