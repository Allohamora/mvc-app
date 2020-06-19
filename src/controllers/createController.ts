import { Controller } from "../App";
import * as express from "express";

export const createController = (path: string ): Controller => ({ router: express.Router(), path });