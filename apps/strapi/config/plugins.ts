import { emailConfig } from "./plugins/email"
import { smartPopulateConfig } from "./plugins/smart-populate"
import { tipTapEditorConfig } from "./plugins/tiptap"
import { uploadConfig } from "./plugins/upload"

export default ({ env }) => {
  return {
    "config-sync": {
      enabled: true,
    },

    "users-permissions": {
      config: {
        jwt: {
          expiresIn: "30d", // this value is synced with Better Auth session maxAge
        },
        // Rate limiting for auth/registration endpoints (login, register,
        // forgot/reset password) to mitigate brute-force and abuse.
        // https://docs.strapi.io/cms/features/users-permissions#rate-limiting-configuration
        ratelimit: {
          enabled: true,
          interval: 60000, // 1 minute window
          max: 5, // max 5 requests per window, per user/path/IP
        },
      },
    },

    upload: uploadConfig(env),

    email: emailConfig(env),

    "tiptap-editor": tipTapEditorConfig(),

    "smart-populate": smartPopulateConfig(),
  }
}
