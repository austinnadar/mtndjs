module.exports = {
    "env": {
        "browser": true
    },
    "rules": {
        "block-scoped-var": "warn",
        "comma-dangle": ["error", "never"],
        "consistent-this": ["error", "me"],
        "curly": "warn",
        "dot-notation": "warn",
        "max-statements": ["warn", 20, { "ignoreTopLevelFunctions": true }],
        "no-cond-assign": "error",
        "no-console": "error",
        "no-control-regex": "error",
        "no-debugger": "error",
        "no-dupe-args": "error",
        "no-dupe-keys": "error",
        "no-duplicate-case": "error",
        "no-empty": "error",
        "no-ex-assign": "error",
        "no-extra-semi": "error",
        "no-fallthrough": "error",
        "no-global-assign": "error",
        "no-lonely-if": "warn",
        "no-multi-spaces": "warn",
        "no-redeclare": "error",
        "no-self-assign": "error",
        "no-sparse-arrays": "error",
        "no-undef": "error",
        "no-unexpected-multiline": "error",
        "no-unreachable": "error",
        "no-unsafe-finally": "warn",
        "no-unsafe-negation": "error",
        "no-unused-labels": "error",
        "no-unused-vars": "warn",
        "one-var": "error",
        "one-var-declaration-per-line": "error",
        "use-isnan": "error",
        "valid-typeof": "warn",
        "block-scoped-var": "off",
        "no-console": "off",
        "no-multi-spaces": "off",
        "no-mixed-spaces-and-tabs": "off",
        "vars-on-top": "warn"

    },
    "globals": {
        "require": false,
        "module": false
    }
};