export namespace dto {
	
	export class ProjectCreate {
	    name: string;
	    description?: string;
	
	    static createFrom(source: any = {}) {
	        return new ProjectCreate(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.description = source["description"];
	    }
	}
	export class TaskDtoOut {
	    id: number;
	    activityName: string;
	    description?: string;
	    status: string;
	    // Go type: time
	    createdAt: any;
	    // Go type: time
	    endedAt?: any;
	
	    static createFrom(source: any = {}) {
	        return new TaskDtoOut(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.activityName = source["activityName"];
	        this.description = source["description"];
	        this.status = source["status"];
	        this.createdAt = this.convertValues(source["createdAt"], null);
	        this.endedAt = this.convertValues(source["endedAt"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ProjectDtoOut {
	    id: number;
	    name: string;
	    description?: string;
	    tasks: TaskDtoOut[];
	    // Go type: time
	    createdAt: any;
	    // Go type: time
	    endedAt?: any;
	
	    static createFrom(source: any = {}) {
	        return new ProjectDtoOut(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.description = source["description"];
	        this.tasks = this.convertValues(source["tasks"], TaskDtoOut);
	        this.createdAt = this.convertValues(source["createdAt"], null);
	        this.endedAt = this.convertValues(source["endedAt"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class TaskCreate {
	    activityName: string;
	    description?: string;
	
	    static createFrom(source: any = {}) {
	        return new TaskCreate(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.activityName = source["activityName"];
	        this.description = source["description"];
	    }
	}
	
	export class UserDtoOut {
	    id: number;
	    name: string;
	    profilePic?: number[];
	    email: string;
	    projects: ProjectDtoOut[];
	    role: string;
	    // Go type: time
	    createdAt: any;
	
	    static createFrom(source: any = {}) {
	        return new UserDtoOut(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.profilePic = source["profilePic"];
	        this.email = source["email"];
	        this.projects = this.convertValues(source["projects"], ProjectDtoOut);
	        this.role = source["role"];
	        this.createdAt = this.convertValues(source["createdAt"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class UserRegister {
	    name: string;
	    email: string;
	    password: string;
	
	    static createFrom(source: any = {}) {
	        return new UserRegister(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.email = source["email"];
	        this.password = source["password"];
	    }
	}

}

export namespace models {
	
	export class Task {
	    id: number;
	    activityName: string;
	    description?: string;
	    status: string;
	    // Go type: time
	    createdAt: any;
	    // Go type: sql
	    endedAt: any;
	    projectId: number;
	
	    static createFrom(source: any = {}) {
	        return new Task(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.activityName = source["activityName"];
	        this.description = source["description"];
	        this.status = source["status"];
	        this.createdAt = this.convertValues(source["createdAt"], null);
	        this.endedAt = this.convertValues(source["endedAt"], null);
	        this.projectId = source["projectId"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Project {
	    id: number;
	    name: string;
	    // Go type: sql
	    description: any;
	    tasks: Task[];
	    numberOfTasks: number;
	    advancement: number;
	    // Go type: time
	    createdAt: any;
	    // Go type: sql
	    endedAt: any;
	    userId: number;
	
	    static createFrom(source: any = {}) {
	        return new Project(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.description = this.convertValues(source["description"], null);
	        this.tasks = this.convertValues(source["tasks"], Task);
	        this.numberOfTasks = source["numberOfTasks"];
	        this.advancement = source["advancement"];
	        this.createdAt = this.convertValues(source["createdAt"], null);
	        this.endedAt = this.convertValues(source["endedAt"], null);
	        this.userId = source["userId"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace os {
	
	export class File {
	
	
	    static createFrom(source: any = {}) {
	        return new File(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	
	    }
	}

}

