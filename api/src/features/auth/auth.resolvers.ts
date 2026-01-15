import { loginSchema, signupSchema } from "./auth.validationSchema.ts";
import { loginHandler, logoutHandler, signupHandler } from "./auth.handlers.ts";
import { withAuth, withValidation } from "../../lib/decorators.ts";

export const authResolvers = {
  Mutation: {
    login: withValidation(loginSchema)(loginHandler),
    signup: withValidation(signupSchema)(signupHandler),
    logout: withAuth()(logoutHandler),
  },
};
