import * as express from "express";
import { Controller } from "../App";

export const createController = (path: string ): Controller => ({ router: express.Router(), path });