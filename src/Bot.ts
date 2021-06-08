import { DocumentType } from "@typegoose/typegoose";
import {
  Client,
  Collection,
  Message,
  MessageEmbed,
  TextChannel,
} from "discord.js";
import config from "./Config";
import GuildModel, { Guild } from "./database/models/Guild";
import YouTubeModel, { Youtube } from "./database/models/Youtube";
import Logger from "./utils/Logger";
import fetch from "node-fetch";
import { parseStringPromise } from "xml2js";
import { YoutubeResponse } from "./interfaces";
export default class Bot extends Client {
  private logger = new Logger("Bot");
  private db = {
    guild: GuildModel,
    youtube: YouTubeModel,
  };
  private intervals: Collection<string, NodeJS.Timeout> = new Collection<
    string,
    NodeJS.Timeout
  >();
  private config = config;
  constructor() {
    super({
      presence: config.presence,
    });
    this.on("ready", this.onReady);
    this.on("message", this.onMessage);
    this.login(process.env.TOKEN);
  }
  private async getPrefix(message: Message): Promise<string> {
    if (message.guild) {
      const guildData = await this.db.guild.findById(message?.guild?.id);
      if (guildData) {
        return guildData.prefix;
      } else {
        return (await this.db.guild.create(new Guild(message?.guild?.id)))
          .prefix;
      }
    } else {
      return this.config.prefix;
    }
  }
  private onReady() {
    this.logger.info(`Logged in as ${this?.user?.tag}`);
    this.logger.info(`Starting Cursor`);
    const cursor = this.db.youtube.find().cursor();
    cursor.on("data", (data: DocumentType<Youtube>) => {
      this.Service(data._id);
    });
    cursor.on("error", (err) => {
      this.logger.error(err);
    });
    cursor.on("end", () => {
      this.logger.info("Cursor finished");
    });
  }
  private Service(id: string) {
    const interval = setInterval(async () => {
      const data = await this.db.youtube.findById(id);
      let links: string[] = [];
      if (data) {
        const response = await fetch(
          `https://www.youtube.com/feeds/videos.xml?channel_id=${data.ytchannelid}`
        );
        if (response.ok) {
          try {
            const xml = await response.text();
            const parsed = <YoutubeResponse>await parseStringPromise(xml);
            const feeds = parsed.feed.entry.filter(
              (x) => !data.videos.includes(x?.link[0].$.href)
            );
            if (feeds.length > 0) {
              feeds.forEach(async (y) => {
                const channel = this.channels.cache.get(data.messagechannelid);
                if (channel && channel instanceof TextChannel) {
                  links.push(y.link[0].$.href);
                  await channel.send(
                    data.templateid.replace("{URL}", y.link[0].$.href)
                  );
                }
              });
            }
          } catch (error: any) {
            this.logger.error(error);
          } finally {
            links.forEach((x) => {
              data.videos.push(x);
            });
            data.markModified("videos");
            await data.save();
          }
        }
      } else if (this?.intervals?.get(id) !== undefined) {
        clearInterval(this.intervals.get(id) as NodeJS.Timeout);
        this.intervals.delete(id);
      }
    }, 20000);
    this.intervals.set(id, interval);
  }
  private async CheckChannel(id: string) {
    const response = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${id}`
    );
    if (response.ok) {
      const xml = await response.text();
      const parsed = <YoutubeResponse>await parseStringPromise(xml);
      return parsed.feed.entry.map((x) => x.link[0].$.href);
    } else {
      return false;
    }
  }
  private async onMessage(message: Message) {
    const prefix = await this.getPrefix(message);
    if (
      !message.content.startsWith(prefix) ||
      message.author.bot ||
      !message.guild ||
      !message.member
    ) {
      return;
    }
    const args = message.content.slice(prefix.length).trim().split(" ");
    const command = args?.shift()?.toLowerCase();
    let guildData = await this.db.guild.findById(message?.guild?.id);
    if (!guildData) {
      guildData = await this.db.guild.create(new Guild(message?.guild?.id));
    }
    switch (command) {
      case "prefix":
        if (
          message.member.hasPermission("MANAGE_GUILD", {
            checkAdmin: true,
            checkOwner: true,
          })
        ) {
          if (args[0] != null) {
            guildData.prefix = args[0];
            await guildData.save();
            await message.reply(
              `Prefix for ${message.guild.name} has been set to ${guildData.prefix}`
            );
          }
        }
        break;
      case "addyt":
        if (
          message.member.hasPermission("MANAGE_WEBHOOKS", {
            checkAdmin: true,
            checkOwner: true,
          })
        ) {
          if (args.length > 2 && message.mentions.channels.size > 0) {
            const channelid = args[1];
            const validchannel = await this.CheckChannel(channelid);
            const channel = message.mentions.channels.first();
            if (validchannel && channel) {
              args.shift();
              args.shift();
              const yt = await this.db.youtube.create(
                new Youtube(channelid, channel.id, args.join(), validchannel)
              );
              this.Service(yt.id);
              message.reply("Done!");
            } else {
              message.reply(`Invalid Channel id`);
            }
          } else {
            await message.reply(`Illegal Arguments`);
          }
        }
        break;
      case "removeyt":
        if (
          message.member.hasPermission("MANAGE_WEBHOOKS", {
            checkAdmin: true,
            checkOwner: true,
          })
        ) {
          if (args.length == 2 && message.mentions.channels.size > 0) {
            const channelid = args[1];
            const channel = message.mentions.channels.first();
            if (!channel) return;
            await this.db.youtube.deleteOne({
              ytchannelid: channelid,
              messagechannelid: channel.id,
            });
            message.reply("Done!");
          } else {
            message.reply("Illegal Arguments");
          }
        }
        break;
      case "help":
        const embed = new MessageEmbed();
        embed.setTitle(`Commands`);
        embed.setColor("#ffc0cb");
        embed.description = ``;
        if (
          message.member.hasPermission("MANAGE_GUILD", {
            checkAdmin: true,
            checkOwner: true,
          })
        ) {
          embed.description += ` **${prefix}prefix** - Change prefix of the bot\n`;
        }
        if (
          message.member.hasPermission("MANAGE_WEBHOOKS", {
            checkAdmin: true,
            checkOwner: true,
          })
        ) {
          embed.description += ` **${prefix}addyt \`#channel <Youtubechannelid> A new Video {URL}\`** - Add a youtube channel notification\n`;
          embed.description += ` **${prefix}removeyt \`#channel <Youtubechannelid>\`** - Remove a youtube channel notification\n`;
        }
        await message.reply(embed);
        break;
      default:
        break;
    }
  }
}
