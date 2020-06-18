import { Controller } from "../App";
import * as express from "express";

export const createController = (router: express.Router, path: string ): Controller => ({ router, path });