export const apiGlobal = {
  injectables: {} as { [key: string]: ApiGlobalInjectable },
  controllers: {} as { [key: string]: ApiGlobalController },
  middleware: {} as { [key: string]: ApiGlobalMiddleware },
};

export interface ApiGlobalInjectable {
  clazz: new () => any;
}
export interface ApiGlobalController {
  path: string;
  clazz: new () => any;
}
export interface ApiGlobalMiddleware {
  path: string;
  clazz: new () => any;
}
