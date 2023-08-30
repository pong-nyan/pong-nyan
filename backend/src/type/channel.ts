
export type Channel = ChannelInfo & {
    id: string,
    host: string,
    manager: string[],
    userList: string[]
}

export type ChannelInfo = {
    title: string,
    password: string,
    private: boolean,
    maxUser: number,
}

export type UserInfo = {
    intraId: number,
    nickname: string,
    online: boolean,
    roomList: string[]
}
