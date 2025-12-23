export interface Post {
  path: string
  type?: string
  title: string
  place?: string
  date: string
  lang?: string
  desc?: string
  platform?: string
  duration?: string
  recording?: string
  radio?: boolean
  video?: boolean
  inperson?: boolean
  redirect?: string
}

export interface GameHistory {
  name: string
  date: string
  image?: string
  id: string
}

export interface LaunchpadItem {
  id: string,
  name: string,
  date: string
  image?: string,
  link?: string
}
