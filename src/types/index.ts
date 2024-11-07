
//AI对话类型
export interface messageType {
    role: string,
    content: string
    time: string
}

//AI类型
export interface AIType {
    airoleID: number;
    roleInfos: string;
    roleNickName: string;
    roleDefinitionStatement: string;
    runStatus: number;
}

//用户类型
export interface UserType {
    userID: number;
    nickname: string;
    avatarURL: string,
}