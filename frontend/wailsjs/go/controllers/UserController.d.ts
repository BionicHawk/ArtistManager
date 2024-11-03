// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT
import {dto} from '../models';

export function ChangeEmail(arg1:string,arg2:string):Promise<string>;

export function ChangePassword(arg1:number,arg2:string,arg3:string):Promise<string>;

export function ChangeProfilePic(arg1:number,arg2:Array<number>):Promise<boolean>;

export function CreateAdmin(arg1:dto.UserRegister):Promise<boolean>;

export function CreateUser(arg1:dto.UserRegister):Promise<boolean>;

export function GetAllUsers():Promise<Array<dto.UserDtoOut>>;

export function GetUser(arg1:number):Promise<dto.UserDtoOut>;

export function Login(arg1:string,arg2:string):Promise<dto.UserDtoOut>;

export function SearchByName(arg1:string):Promise<Array<dto.UserDtoOut>>;
