import { getModelForClass, prop } from "@typegoose/typegoose";
import { SnowflakeUtil } from "discord.js";
import "..";
export class Youtube {
  @prop({ type: String })
  _id: string;
  @prop({ type: Date })
  published: Date;
  @prop({ type: String })
  ytchannelid: string;
  @prop({ type: String })
  messagechannelid: string;
  @prop({ type: String })
  templateid: string;
  @prop({ type: String })
  videos: string[];
  constructor(
    ytchannelid: string,
    messagechannelid: string,
    templateid: string,
    videos: string[]
  ) {
    this._id = SnowflakeUtil.generate();
    this.published = new Date();
    this.ytchannelid = ytchannelid;
    this.messagechannelid = messagechannelid;
    this.templateid = templateid;
    this.videos = videos;
  }
}
const YoutubeModel = getModelForClass(Youtube);
export default YoutubeModel;
