import * as express from "express";

interface responseFunction {
    ( message: string, code: number, body: object ): void;
    ( message: string, body: object ): void;
    ( message: string ): void;
}

interface response {
    ( res: express.Response, isError: boolean, statusCode: number ): responseFunction
}

interface responseBody {
    success?: responseMain,
    error?: responseMain,
    body?: {}
}

interface responseMain {
    message?: string,
    code?: number
}

export const response: response = ( 
    
    res: express.Response, 
    isError: boolean, 
    statusCode: number

): responseFunction => {

    const resBody: responseBody = {};
    // const main contains ref to object in memory.
    const main: responseMain = {};

    // because vars in js contains ref to object we can add this ref to resBody, and when we modify this object
    // all effect will be reflected to resBody.error || resBody.success
    if( isError ) {
        resBody.error = main;
    } else {
        resBody.success = main;
    }

    res.status(statusCode);

    return ( message: string, code?: number | object, body?: object ) => {
        main.message = message;

        // need for overloads
        if( typeof code === "object" ) {
            resBody.body = code;
        } else {
            resBody.body = body;
        }

        res.send( resBody );
    }
}

export const successResponse = ( res: express.Response, statusCode: number = 200 ) => response(res, false, statusCode);

export const errorResponse = ( res: express.Response, statusCode: number = 400 ) => response(res, true, statusCode);