import { prop, getModelForClass } from "@typegoose/typegoose";
import config from "../../Config";
import "..";
export class Guild {
  @prop({ type: String })
  _id: string;

  @prop({ type: String })
  prefix: string;
  constructor(id: string) {
    this._id = id;
    this.prefix = config.prefix;
  }
}
const GuildModel = getModelForClass(Guild);
export default GuildModel;
