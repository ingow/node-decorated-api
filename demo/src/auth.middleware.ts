import { Middleware, Request, Response } from 'node-decorated-api';

@Middleware('/')
export class AuthMiddleware {
  intercept(req: Request, res: Response, next: Function) {
    (req as any).userId = 123;
    next();
  }
}
