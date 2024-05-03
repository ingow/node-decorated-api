import express from 'express';
import { Reflection } from './reflection';
import { apiGlobal } from './api-global';

export class Api {
    private static app = express();

    static add(clazz: (new () => any)[]) {
        clazz.forEach(c => {
            new c();
        });
    }

    static start(options: ApiOptions = {}) {
        this.registerMiddlewares();
        this.registerRoutes();

        const port = options.port || 3000;
        this.app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }

    private static registerMiddlewares() {
        apiGlobal.middleware.forEach(middleware => {
            const middlewareInstance = new middleware.target();
            this.processInjectables(middlewareInstance);
            this.app.use(middleware.path, (req, res, next) => {
                this.processInjectables(middlewareInstance, { req, res });
                middlewareInstance.intercept(req, res, next);
            });
        });
    }

    private static registerRoutes() {
        apiGlobal.routes.forEach(route => {
            const controller = route.target;
            const proto = controller.prototype;
            const methods = Reflection.getClassMethods(proto);

            methods.forEach(method => {
                const endpoint = (proto as any)[method].endpoint;
                if (!endpoint) {
                    return;
                }

                (this.app as any)[endpoint.method]((controller as any).path + endpoint.path, (req: any, res: any) => {
                    const controllerInstance = new controller();
                    this.processInjectables(controllerInstance, { req, res });
                    controllerInstance[method](req, res);
                });
            });
        });
    }

    private static processInjectables(instance: any, context?: { req: express.Request, res: express.Response }) {
        const injectables = Reflection.getInjectables(instance.__proto__);

        injectables.forEach((injectableName: string) => {
            const clazzName = injectableName.charAt(0).toUpperCase() + injectableName.slice(1);

            const injectable = apiGlobal.injectables.find(i => i.target.name === clazzName);

            if (clazzName === 'HttpContext') {
                instance[injectableName] = context;
                return;
            }
            
            instance[injectableName] = new injectable.target();

            this.processInjectables(instance[injectableName], context)
        });
    }
}

export interface ApiOptions {
    port?: number;
}

export class HttpContext {
    req!: Request;
    res!: Response;
}

export interface Request extends express.Request {}
export interface Response extends express.Response {}
export interface NextFunction extends express.NextFunction {}