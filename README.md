# node-decorated-api
Express wrapper to create Node APIs using decorators/annotations (if you come from Java) and a very simple DI to allow easy access to Express' `req` and `res` inside any service.

I just started working on this, I do not recomend using this in production yet.

# Usage

Any class marked with @Injectable can easily access express' `req` and `res` by injecting (`@Inject`) the HttpContext like in the example below.

When you use `@Inject` it's important that the attribute name is the same as the class name, but starting with a lowercase: `httpContext: HttpContext`.
```
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
}
```

Controller/endpoints implementation:
```
import { Get, Inject, Request, Response, Controller } from 'node-decorated-api';
import { UserService } from './user.service';

@Controller('/users')
export class UsersController {

    @Inject()
    private userService!: UserService;

    @Get('/')
    async getUsers(req: Request, res: Response) {
        const userId = await this.userService.getUser();
        res.json({
            id: userId
        }); 
    }
}
```

Example of a Middleware:
```
import { Middleware, Request, Response } from 'node-decorated-api';

@Middleware('/')
export class AuthMiddleware {
    intercept(req: Request, res: Response, next: Function) {
        (req as any).userId = 123;
        next();
    }
}
```

And starting the server and initializing everything:
```
import { Api } from 'node-decorated-api';
import { AuthMiddleware } from './auth.middleware';
import { UserService } from './user.service';
import { UsersController } from './users.controller';

//Add all classes that will be part of the API
Api.add([
    AuthMiddleware, 
    
    UsersController,
    UserService,
]);

Api.start();
```

# Running the demo

Go to demo/ and:
1. `npm install`
2. `npm run start`

We use the `tsconfig.json` `paths` to point to the dev code when running the demo.

# TODO

1. Generate OpenAPI/swagger json
2. Make `@Inject` work with any attribute name
3. Auto load Classes so we don't need to use `Api.add`