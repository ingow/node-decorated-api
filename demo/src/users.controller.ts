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

    @Get('/error')
    async getUsersWithError(req: Request, res: Response) {
        this.userService.getUserWithError();
        res.json({
            ok: true
        });
    }
}
