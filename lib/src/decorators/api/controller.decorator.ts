import { apiGlobal } from "../../api-global";

export function Controller(path: string) {
    return (target: any) => {
        target.path = path;
        apiGlobal.controllers[target.name] = {
            path: path,
            clazz: target
        };
    };
}
