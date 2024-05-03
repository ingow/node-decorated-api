import express from 'express';
import { Reflection } from './reflection';
import { apiGlobal } from './api-global';

export class Api {
  private static app = express();

  static add(clazz: (new () => any)[]) {
    clazz.forEach((c) => {
      new c();
    });
  }

  static start(options: ApiOptions = {}) {
    this.registerMiddlewares();
    this.registerControllers();

    const port = options.port || 3000;
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }

  private static registerMiddlewares() {
    Object.keys(apiGlobal.middleware).forEach((className) => {
      const middleware = apiGlobal.middleware[className];
      const middlewareInstance = new middleware.clazz();
      this.instantiateInjectables(middlewareInstance);
      this.app.use(middleware.path, (req, res, next) => {
        this.instantiateInjectables(middlewareInstance, { req, res });
        middlewareInstance.intercept(req, res, next);
      });
    });
  }

  private static registerControllers() {
    Object.keys(apiGlobal.controllers).forEach((className) => {
      const controller = apiGlobal.controllers[className];
      const proto = controller.clazz.prototype;
      const methods = Reflection.getClassMethods(proto);

      methods.forEach((method) => {
        const endpoint = (proto as any)[method].endpoint;
        if (!endpoint) {
          return;
        }

        (this.app as any)[endpoint.method](
          controller.path + endpoint.path,
          asyncRoute(async (req: any, res: any, next: any) => {
            const controllerInstance = new controller.clazz();
            this.instantiateInjectables(controllerInstance, { req, res });

            try {
              await controllerInstance[method](req, res, next);
            } catch (err) {
              console.error(err);
              next(err);
              throw err;
            }
          }),
        );
      });
    });
  }

  private static instantiateInjectables(
    instance: any,
    context?: { req: express.Request; res: express.Response },
  ) {
    const injectables = Reflection.getInjectables(instance.__proto__);

    injectables.forEach((injectableName: string) => {
      const clazzName =
        injectableName.charAt(0).toUpperCase() + injectableName.slice(1);

      if (clazzName === 'HttpContext') {
        instance[injectableName] = context;
        return;
      }

      const injectable = apiGlobal.injectables[clazzName];

      instance[injectableName] = new injectable.clazz();

      this.instantiateInjectables(instance[injectableName], context);
    });
  }
}

const asyncRoute =
  (route: any) =>
  (req: any, res: any, next = console.error) =>
    Promise.resolve(route(req, res, next)).catch(next);

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
