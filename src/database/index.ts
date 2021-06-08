import { mongoose } from "@typegoose/typegoose";
import logger from "../utils/Logger";
const Logger = new logger("DATABASE");
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/youtube";

if (
  mongoose.connection.readyState === mongoose.connection.states.uninitialized ||
  mongoose.connection.readyState === mongoose.connection.states.disconnected
) {
  mongoose.connect(
    MONGO_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    },
    (err) => {
      if (err) {
        Logger.error(`Failed to connect to DB:`);
        Logger.error(err.toString());
      } else {
        Logger.info("Connected to DB!");
      }
    }
  );
}
