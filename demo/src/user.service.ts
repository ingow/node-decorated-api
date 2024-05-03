import { HttpContext, Inject, Injectable } from 'node-decorated-api';

@Injectable()
export class UserService {

    @Inject()
    private httpContext!: HttpContext;

    public getUser() {
        return (this.httpContext.req as any)!.userId;
    }
}