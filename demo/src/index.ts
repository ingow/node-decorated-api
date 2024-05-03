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