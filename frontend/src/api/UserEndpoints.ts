import {dto} from "../../wailsjs/go/models";
import * as UserController from "../../wailsjs/go/controllers/UserController";
import Result from "./container/Result";

export default class UserEndpoints {
    
    private readonly EmailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    private readonly PasswordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;

    /**
     * This function creates a new Admin `User` into the database
     * @param userRegister The data needed to create a new Admin User
     * @returns A `CreateUserResult` which will let you handle Ok and Error responses
     */
    public CreateAdmin(userRegister: dto.UserRegister): CreateUserResult {
        let result = CreateUserResult.OK;

        if (userRegister.email.match(this.EmailRegex) === null) {
            return CreateUserResult.INVALID_EMAIL;
        }

        if (userRegister.password.match(this.PasswordRegex) === null) {
            return CreateUserResult.INVALID_PASSWORD;
        }

        UserController.CreateAdmin(userRegister)
            .then(petitionResult => {
                if (!petitionResult) {
                    result = CreateUserResult.USER_FOUND
                }
            })

        return result;
    }
    
    /**
     * This function creates a new `User` into the database
     * @param userRegister the data needed to create the user
     * @returns A `CreateUserResult` value, which you can use to handle Ok and Error results
     */
    public CreateUser(userRegister: dto.UserRegister): CreateUserResult {
        let result = CreateUserResult.OK;

        if (userRegister.email.match(this.EmailRegex) === null) {
            return CreateUserResult.INVALID_EMAIL;
        }

        if (userRegister.password.match(this.PasswordRegex) === null) {
            return CreateUserResult.INVALID_PASSWORD;
        }

        UserController.CreateUser(userRegister)
            .then(petitionResult => {
                if (!petitionResult) {
                    result = CreateUserResult.USER_FOUND;
                }
            });

        return result;
    }
    
    /**
     * Will authenticate the user
     * @param email 
     * @param password 
     * @returns The user info if success or null if else
     */
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
     * @returns a `ChangePasswordResult` enumerator that can help you handle Ok and error results
     */
    public ChangePassword(userId: number, oldPassword: string, newPassword: string): ChangePasswordResult {
        let result = ChangePasswordResult.OK;

        if (newPassword.match(this.PasswordRegex) === null) {
            return ChangePasswordResult.INVALID_PASSWORD;
        }

        UserController.ChangePassword(userId, oldPassword, newPassword)
            .then(petitionResult => {
                switch (petitionResult) {
                    case "USER_NOT_FOUND":
                        result = ChangePasswordResult.USER_NOT_FOUND;
                        break;
                    case "OLD_PASSWORD_INVALID":
                        result = ChangePasswordResult.OLD_PASSWORD_INVALID
                        break;
                    case "SAME_PASSWORD_INVALID":
                        result = ChangePasswordResult.SAME_PASSWORD_INVALID;
                        break;
                    case "OK":
                        result = ChangePasswordResult.OK
                        break;
                }
            });

        return result;
    }
    
    /**
     * This function will attempt to change the email by referencing the user by its current email
     * @param oldEmail the current user email
     * @param newEmail the email to set on the user
     * @returns a `ChangeEmailResult` enumerator which will help you handle Ok and Error results
     */
    public ChangeEmail(oldEmail: string, newEmail: string): ChangeEmailResult {
        let result = ChangeEmailResult.OK;

        UserController.ChangeEmail(oldEmail, newEmail)
            .then(petitionResult => {
                switch (petitionResult) {
                    case "OK":
                        result = ChangeEmailResult.OK;
                        break;
                    case "SAME_EMAIL":
                        result = ChangeEmailResult.SAME_EMAIL;
                        break;
                    case "EMAIL_USED":
                        result = ChangeEmailResult.EMAIL_USED;
                        break;
                    case "USER_NOT_FOUND":
                        result = ChangeEmailResult.USER_NOT_FOUND;
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

    public SearchByName(nameTerm: string): Array<dto.UserDtoOut> {
        let users: Array<dto.UserDtoOut> = []

        UserController.SearchByName(nameTerm)
            .then(results => {
                users = [...users, ...results]
            })

        return users;
    }

}

export enum ChangePasswordResult {
    OK,
    USER_NOT_FOUND,
    INVALID_PASSWORD,
    SAME_PASSWORD_INVALID,
    OLD_PASSWORD_INVALID
}

export enum CreateUserResult {
    OK,
    USER_FOUND,
    INVALID_EMAIL,
    INVALID_PASSWORD
}

export enum ChangeEmailResult {
    OK,
    USER_NOT_FOUND,
    SAME_EMAIL,
    EMAIL_USED, 
}