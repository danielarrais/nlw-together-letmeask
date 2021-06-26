import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { auth, firebase } from "../services/firebase";
import AuthContextType from "../types/AuthContextType";
import UserType from "../types/UserType";

export const AuthContext = createContext({} as AuthContextType);

type PropsType = {
    children: ReactNode
}

export default function AuthContextProvider(props: PropsType) {

    const [user, setUser] = useState<UserType>();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) updateUserState(user);
        });

        return () => unsubscribe();
    }, []);

    async function signInWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();

        const result = await auth.signInWithPopup(provider);

        updateUserState(result.user);
    }

    function updateUserState(user: firebase.User | null) {
        if (!user) return;

        const { displayName, photoURL, uid } = user;

        if (!displayName || !photoURL) {
            throw new Error('Missing information from Google Acount.');
        }

        setUser({
            id: uid,
            name: displayName,
            avatar: photoURL
        })
    }

    return (
        <AuthContext.Provider value={{ user, signInWithGoogle }}>
            {props.children}
        </AuthContext.Provider>
    );
}