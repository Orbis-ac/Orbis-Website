import {Controller, Get} from "@nestjs/common";
import {AllowAnonymous, OptionalAuth, Roles, Session, UserSession,} from "@thallesp/nestjs-better-auth";

@Controller("users")
export class UserController {

    @Get("public")
    @AllowAnonymous() // Allow anonymous access (no authentication required)
    async publicRoute() {
        return {message: "This route is public"};
    }

    @Get("optional")
    @OptionalAuth() // Authentication is optional for this route
    async optionalRoute(@Session() session: UserSession) {
        return {authenticated: !!session, session};
    }

    @Get("admin")
    @Roles(["admin"]) // Only authenticated users with the 'admin' role can access this route. Uses the access control plugin from better-auth.
    adminRoute() {
        return "Only admins can see this";
    }
}