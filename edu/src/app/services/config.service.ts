export const LocalStorageKeys = {
    currentUser: 'user',
    roomList: 'rooms',
    loginSessionExpiration: 'expiration',
    roomOptions: 'roomOptions',
    Token: 'token'
};

export const ENV = {  
  production: true,
  backend_url: 'https://speedyrtc.xdylive.cn/api/1.0'  
};

export class User {
    id: number;
    username:  string;
    password:  string;
    firstname: string;
    lastname:  string;
    role:      string;
    email:     string;
}