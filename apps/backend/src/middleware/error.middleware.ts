// global handler 
import { Request, Response, NextFunction } from "express";
export class AppError extends Error {
    constructor(public statusCode: number, message: string) {
      super(message);
      Object.setPrototypeOf(this, new.target.prototype);
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export const globalErrorHandler = (err: any, req:Request, res:Response, next: NextFunction) => {
    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const message = err.message || 'Something went wrong';
  
    res.status(statusCode).json({
      success: false,
      message,
    });
  };