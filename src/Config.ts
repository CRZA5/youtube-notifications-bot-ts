import { PresenceData } from "discord.js";

export interface Config {
  prefix: string;
  presence: PresenceData;
}
const prefix = process.env.NODE_ENV === "development" ? "!" : "y!";
const config: Config = {
  prefix,
  presence: {
    activity: {
      name: `Youtube`,
      type: "WATCHING",
    },
    status: "online",
  },
};

export default config;
