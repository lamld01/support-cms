import { useEffect, useState } from "react";
import { signIn } from "@/config/service";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux'; // Import useDispatch
import { setToken } from '@/config/slice/token/slice'; // Import actions
import { useNavigate } from "react-router-dom";
import { RootState } from "@/app/store";
import { WEB_ROUTER } from "@/utils/web_router";

const Login = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = useSelector((state: RootState) => state.token);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {        
        if (token.accessToken) {
            navigate(WEB_ROUTER.HOME.ROOT);
        }
    }, [navigate, token]);

    const handleSignIn = async (event: any) => {
        event.preventDefault(); // Prevent default form submission
        try {
            const response = await signIn(username, password);
            dispatch(setToken(response.data));
            navigate(-1)
        } catch (error: any) {
            toast.error(t(`message.${error.message}`)); // Show error toast
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 md:p-6 lg:p-8 shadow-xl">
            <h4 className="text-center mb-4 text-2xl">{t("text.login.signIn")}</h4>
            <p className="text-center mb-8">{t("text.login.wellcomeToDevTools")}</p>
            <form className="flex flex-col gap-6" onSubmit={handleSignIn}>
                <div className="flex flex-col gap-2">
                    <label>{t("text.login.username")}</label>
                    <input
                        name="username"
                        type="text"
                        placeholder="username"
                        className="input input-bordered"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} // Update state
                        required
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label>{t("text.login.password")}</label>
                    <input
                        name="password"
                        type="password"
                        placeholder="********"
                        className="input input-bordered"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // Update state
                        required
                    />
                </div>
                <label className="flex items-center">
                    <input type="checkbox" className="checkbox checkbox-primary" />
                    <span className="ml-2">
                        {t("text.login.rememberMe")}{" "}
                    </span>
                </label>
                <button type="submit" className="btn btn-primary mt-6 w-full">{t("text.login.signIn")}</button>
            </form>
        </div>
    );
};

export default Login;
