
export type Channel = ChannelInfo & {
    id: string,
    owner: string,
    administrator: string[],
    userList: string[]
}

export type ChannelInfo = {
    title: string,
    password: string,
    private: boolean,
    maxUser: number,
    inviteOnly: boolean,
}

export type UserInfo = {
    intraId: number,
    nickname: string,
    online: boolean,
    roomList: string[]
}
