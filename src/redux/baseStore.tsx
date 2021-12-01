export interface UserState {
    accessToken: string | null | undefined;
    loginStatus: boolean | null;
} 
export default interface ReduxInitialStoreState {
    users: UserState; 
}