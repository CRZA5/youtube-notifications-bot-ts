export interface YoutubeResponse {
  feed: Feed;
}

export interface Feed {
  $: FeedClass;
  link: LinkElement[];
  id: string[];
  "yt:channelId": string[];
  title: string[];
  author: Author[];
  published: Date[];
  entry: Entry[];
}

export interface FeedClass {
  "xmlns:yt": string;
  "xmlns:media": string;
  xmlns: string;
}

export interface Author {
  name: string[];
  uri: string[];
}

export interface Entry {
  id: string[];
  "yt:videoId": string[];
  "yt:channelId": string[];
  title: string[];
  link: LinkElement[];
  author: Author[];
  published: string[];
  updated: string[];
  "media:group": MediaGroup[];
}

export interface LinkElement {
  $: Link;
}

export interface Link {
  rel: Rel;
  href: string;
}

export enum Rel {
  Alternate = "alternate",
  Self = "self",
}

export interface MediaGroup {
  "media:title": string[];
  "media:content": Media[];
  "media:thumbnail": Media[];
  "media:description": string[];
  "media:community": MediaCommunity[];
}

export interface MediaCommunity {
  "media:starRating": MediaStarRatingElement[];
  "media:statistics": MediaStatisticElement[];
}

export interface MediaStarRatingElement {
  $: MediaStarRating;
}

export interface MediaStarRating {
  count: string;
  average: string;
  min: string;
  max: string;
}

export interface MediaStatisticElement {
  $: MediaStatistic;
}

export interface MediaStatistic {
  views: string;
}

export interface Media {
  $: MediaContent;
}

export interface MediaContent {
  url: string;
  type?: Type;
  width: string;
  height: string;
}

export enum Type {
  ApplicationXShockwaveFlash = "application/x-shockwave-flash",
}
