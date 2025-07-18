import { useState, useEffect } from "react";

const DEFAULT_CONFIG = {
    onboardingRead: false,
    initialConfigDone: false,
    accountType: "",
    viewMode: "list",
    sortBy: "default",
};

export function useAppConfig() {
    const [config, setConfig] = useState(() => {
        const stored = localStorage.getItem("tarkovHideoutAppConfig");
        return stored ? JSON.parse(stored) : DEFAULT_CONFIG;
    });

    useEffect(() => {
        localStorage.setItem("tarkovHideoutAppConfig", JSON.stringify(config));
    }, [config]);

    const updateConfig = (changes) => setConfig(prev => ({ ...prev, ...changes }));

    const resetConfig = () => setConfig(DEFAULT_CONFIG);

    return { config, updateConfig, resetConfig };
}