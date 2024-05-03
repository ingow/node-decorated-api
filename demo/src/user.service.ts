import { HttpContext, Inject, Injectable } from 'node-decorated-api';

@Injectable()
export class UserService {
  @Inject()
  private httpContext!: HttpContext;

  public getUser(): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve((this.httpContext.req as any).userId);
      }, 1000);
    });
  }

  public getUserWithError() {
    throw new Error('Error');
  }
}
