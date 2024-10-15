const WEB_ROUTER = {
    HOME: {
        ROOT: '/',
        PATH: '/'
    },

    AUTH: {
        ROOT: '/auth',
        LOGIN: {
            ROOT: '/auth/login',
            PATH: 'login'
        },
        PROFILE: {
            ROOT: '/auth/profile',
            PATH: 'profile'
        }
    },

    SETTING: {
        ROOT: '/setting',
        PATH: 'setting'
    },

    LIST_ACCOUNT: {
        ROOT: '/accounts',
        PATH: 'accounts'
    },

    LIST_PROJECT: {
        ROOT: '/projects',
        PATH: 'projects'
    },

    LIST_TEST_FIELD: {
        ROOT: '/test/field/:apiId',
        PATH: '/test/field'
    },

    LIST_TEST_API: {
        ROOT: '/test/api',
        CREATE: {
            ROOT: '/test/api/create',
            PATH: 'create'
        },
        UPDATE: {
            ROOT: 'test/api/update/:id',
            PATH: 'update'
        }
    },

    LIST_VALIDATE_CONSTRAIN: {
        ROOT: '/validate-constrain',
        PATH: '/validate-constrain'
    }
};

export { WEB_ROUTER };
