import { THEMES } from "store/enums/app";

const ApplicationConfiguration = {
    bypassAuth: true,
    useAuth: false,
    APIKeys: {
        tinyMCE: 'your key here'
    },
    theme: THEMES.LIGHT,
};

export default ApplicationConfiguration;
