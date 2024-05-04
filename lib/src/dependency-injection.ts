import express from 'express';
import { Reflection } from './reflection';
import { apiGlobal } from './api-global';

export class DependencyInjection {
  static inject(
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

      this.inject(instance[injectableName], context);
    });
  }
}
