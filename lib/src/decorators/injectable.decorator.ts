import { apiGlobal } from "../api-global";

export function Injectable() {
    return (target: any) => {
        apiGlobal.injectables.push({
            target: target
        });
    };
}

export function Inject() {
    return (target: any, key: string) => {
        target[key] = { injectable: true };
    };
}