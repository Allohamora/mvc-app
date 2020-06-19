import * as mongoose from "mongoose";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as hbsExpress from "express-handlebars";
import * as path from "path";
import * as cookieParser from "cookie-parser";
import { errorResponse } from "./helpers/responseHelper";

const { MONGO_URI, PORT } = process.env;

export interface Controller { 
    router: express.Router,
    path: string,
}
export type Controllers = Controller[]; 

export class App {

    private app = express();

    constructor( controllers: Controllers ) {
        this.setViewEngine();
        this.setStaticServer();
        this.registerMiddlewares();
        this.registerRouters(controllers);
    }

    private setViewEngine() {

        const viewsDir = path.join(__dirname, "/views");

        const hbs = hbsExpress({ 
            defaultLayout: 'index',
            layoutsDir: path.join(viewsDir, "/layouts"),
            partialsDir: path.join(viewsDir, "/partials"),

            extname: 'hbs',
        });

        this.app.set("views", viewsDir);

        // first param === extName
        this.app.engine("hbs", hbs );
        this.app.set("view engine", "hbs");
    }   

    private setStaticServer() {
        this.app.use( express.static( path.join(__dirname, "/static") ) );
    }

    private registerMiddlewares() {
        this.app.use( cookieParser() )
        this.app.use( bodyParser.json() );
        this.app.use( bodyParser.urlencoded({ extended: false }) );
    }

    private registerRouters(controllers: Controllers) {
        controllers.forEach( ({ router, path }) => this.app.use(path, router) );

        this.app.use( "*" ,(req, res) => errorResponse(res, 404)("404") );
    }

    private async connectToMongodb() {
        return mongoose.connect( MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        } );
    }

    public async launch() {
        await this.connectToMongodb();
        this.app.listen(PORT, () => console.log(`Server started on ${PORT} port`));
    }
}