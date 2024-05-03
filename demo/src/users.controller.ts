import { Get, Inject, Request, Response, Controller } from 'node-decorated-api';
import { UserService } from './user.service';

@Controller('/users')
export class UsersController {

    @Inject()
    private userService!: UserService;

    @Get('/')
    getUsers(req: Request, res: Response) {
        const userId = this.userService.getUser();
        res.json({
            id: userId
        }); 
    }
}
