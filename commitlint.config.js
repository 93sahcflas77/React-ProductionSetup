export default {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'header-max-length': [2, 'always', 150],
        'header-min-length': [2, 'always', 5],
        'type-enum': [2, 'always', ['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test']],
        'scope-empty': [0],
        'subject-case': [0],
        'subject-full-stop': [2, 'never', '.'],
    },
}
