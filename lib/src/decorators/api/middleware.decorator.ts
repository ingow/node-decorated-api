import { apiGlobal } from '../../api-global';

export function Middleware(path: string) {
  return (target: any) => {
    target.path = path;
    apiGlobal.middleware[target.name] = {
      path: path,
      clazz: target,
    };
  };
}
