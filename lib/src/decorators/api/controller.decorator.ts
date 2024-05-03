import { apiGlobal } from "../../api-global";

export function Controller(path: string) {
    return (target: any) => {
        target.path = path;
        apiGlobal.routes.push({
            path: path,
            target: target
        });
    };
}
