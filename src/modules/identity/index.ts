// Public API of the identity module. Other modules may import ONLY from here.
export { createIdentityModule } from "./identity.module";
export { UserRegistered } from "./identity.events";
export type { IdentityApi, UserSummary, UpdateUserData } from "./identity.api";
