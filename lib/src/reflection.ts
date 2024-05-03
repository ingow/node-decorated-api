export class Reflection {
    static getClassMethods(clazz: any) {
        return Object.getOwnPropertyNames(clazz).filter(item => typeof clazz[item] === 'function');
    }

    static getInjectables(clazz: any) {
        return Object.getOwnPropertyNames(clazz).filter(item => clazz[item].injectable);
    }
}