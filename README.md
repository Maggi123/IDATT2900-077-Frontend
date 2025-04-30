# IDATT2900-077 Frontend "MyHealthWallet"
## Prerequisites

- Set up the [Android Emulator](https://docs.expo.dev/workflow/android-studio-emulator/).
- Set up the [backend](https://github.com/Maggi123/IDATT2900-077-Backend).

## Dependencies

- Node.js v. 18.18.x
- Yarn

## Get started

1. Install dependencies

   ```bash
   yarn install
   ```

2. Start the app in an Android Emulator

   ```bash
    yarn android
   ```

## Registering and login
The app requires logging in with an external account, and offers integration with Google and BankID through Signicat.
When the app is started for the first time, the user is asked to register with an account.
Choose Signicat, and register with one of the test accounts you can find [here](https://developer.signicat.com/identity-methods/nbid/demo-nbid/).
Every subsequent login to the app requires logging in with the same account that was used to register with.