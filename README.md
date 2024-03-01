## PR Finder

This repo aims to have a simple cli tool to help you find PRs you need to review and cut through some of the noise of github etc.
Also only cool hackers use the CLI instead of a web interface.

## What do you need?

Well this uses zx so you need that and you need node as well.

You can use any of these to get going:

```
brew install zx

devbox global add

npm install -g zx
```

Then run `npm install` in this folder.

You also need a `.env file. Should look like this:

```
REPOS=org/repo-1,org/repo-2
USERS=clintonmedbery,otheruser
```

Then run:
```
chmod +x ./fetchPRs.mjs
./fetchPRs.mjs
```

Please note you might need to 