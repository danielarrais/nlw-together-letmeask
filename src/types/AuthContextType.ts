import UserType from "./UserType";

type AuthContextType = {
    user: UserType | undefined,
    signInWithGoogle: () => Promise<void>
}

export default AuthContextType;