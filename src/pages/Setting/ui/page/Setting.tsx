import { setTheme } from "@/config/slice/setting/settingSlice";
import { FC, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';

// List of themes
const themes: string[] = [
    "light", "dark", "cupcake", "bumblebee", "emerald", "corporate",
    "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden",
    "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black",
    "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade",
    "night", "coffee", "winter", "dim", "nord", "sunset"
];

const Settings: FC = () => {
    const dispatch = useDispatch();
    const themeFromStore = useSelector((state: any) => state?.settings?.theme);
    const [selectedTheme, setSelectedTheme] = useState<string>(themeFromStore || "light");

    // Handle theme change
    const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newTheme = event.target.value;
        setSelectedTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        dispatch(setTheme(newTheme)); // Dispatch to Redux
    };

    return (
        <section className="min-h-screen bg-base-200">
            <div className="container mx-auto p-6">
                <h1 className="text-4xl font-bold mb-6">Settings</h1>
                <div className="form-control w-full max-w-xs">
                    <label className="label">
                        <span className="label-text">Select Theme</span>
                    </label>
                    <select
                        className="select select-primary w-full max-w-xs"
                        value={selectedTheme}
                        onChange={handleThemeChange}
                    >
                        {themes.map((theme) => (
                            <option key={theme} value={theme} className="capitalize">
                                {theme}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </section>
    );
};

export default Settings;
