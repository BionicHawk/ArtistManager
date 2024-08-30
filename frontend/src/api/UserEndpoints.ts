import {dto} from "../../wailsjs/go/models";
import UserController from "../../wailsjs/go/controllers/UserController";
import Result from "./container/Result";

export default class UserEndpoints {
    
    private readonly EmailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    private readonly PasswordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;

    /**
     * This function creates a new Admin `User` into the database
     * @param userRegister The data needed to create a new Admin User
     * @returns A container which will held an error if present
     */
    public CreateAdmin(userRegister: dto.UserRegister): Result<void, ErrorCreateUserResult> {
        let result = new Result<void, ErrorCreateUserResult>();

        if (userRegister.email.match(this.EmailRegex) === null) {
            result.errorOf(ErrorCreateUserResult.INVALID_EMAIL);
            return result;
        }

        if (userRegister.password.match(this.PasswordRegex) === null) {
            result.errorOf(ErrorCreateUserResult.INVALID_PASSWORD);
            return result; 
        }

        UserController.CreateAdmin(userRegister)
            .then(petitionResult => {
                if (!petitionResult) {
                    result.errorOf(ErrorCreateUserResult.USER_FOUND);
                }
            })

        return result;
    }
    
    /**
     * This function creates a new `User` into the database
     * @param userRegister the data needed to create the user
     * @returns A container which will held an error if present
     */
    public CreateUser(userRegister: dto.UserRegister): Result<void,ErrorCreateUserResult> {
        const result = new Result<void, ErrorCreateUserResult>();

        if (userRegister.email.match(this.EmailRegex) === null) {
            result.errorOf(ErrorCreateUserResult.INVALID_EMAIL);
            return result;
        }

        if (userRegister.password.match(this.PasswordRegex) === null) {
            result.errorOf(ErrorCreateUserResult.INVALID_PASSWORD);
            return result;
        }

        UserController.CreateUser(userRegister)
            .then(petitionResult => {
                if (!petitionResult) {
                    result.errorOf(ErrorCreateUserResult.USER_FOUND);
                }
            });

        return result;
    }
    
    public Login(email: string, password: string): dto.UserDtoOut | null {
        let user: dto.UserDtoOut | null = null;
        
        UserController.Login(email, password)
            .then(userResult => {
                if (userResult !== null) {
                    user = userResult;
                }
            });

        return user;
    }

    /**
     * This function will change the password of the referenced user
     * @param userId is the user id that will reference the actual user
     * @param oldPassword the current user's password. This will guarantee that the user is about
     * to change the password is the owner of the account
     * @param newPassword the new user password
     * @returns a container that will held an error if present
     */
    public ChangePassword(userId: number, oldPassword: string, newPassword: string): Result<void, ErrorChangePassword> {
        const result = new Result<void, ErrorChangePassword>();

        if (newPassword.match(this.PasswordRegex) === null) {
            result.errorOf(ErrorChangePassword.INVALID_PASSWORD);
            return result;
        }

        UserController.ChangePassword(userId, oldPassword, newPassword)
            .then(petitionResult => {
                switch (petitionResult) {
                    case "USER_NOT_FOUND":
                        result.errorOf(ErrorChangePassword.USER_NOT_FOUND);
                        break;
                    case "OLD_PASSWORD_INVALID":
                        result.errorOf(ErrorChangePassword.OLD_PASSWORD_INVALID);
                        break;
                    case "OK":
                        result.of()
                        break;
                }
            });

        return result;
    }

    /**
     * Will get a user by its id
     * @param userId The user id
     * @returns The user if exists or `null` otherwise
     */
    public GetUser(userId: number): dto.UserDtoOut | null {
        let gotUser: dto.UserDtoOut | null = null;
        
        UserController.GetUser(userId)
            .then(user => {
                if (user !== null) {
                    gotUser = user;
                }
            })

        return gotUser;
    }

}

export class EndpointError <ErrObject> {
    public Err: ErrObject;
    public Message: string;

    constructor(Err: ErrObject, Message: string) {
        this.Err = Err;
        this.Message = Message;
    }
}

export enum ErrorChangePassword {
    USER_NOT_FOUND,
    INVALID_PASSWORD,
    OLD_PASSWORD_INVALID
}

export enum ErrorCreateUserResult {
    USER_FOUND,
    INVALID_EMAIL,
    INVALID_PASSWORD
}