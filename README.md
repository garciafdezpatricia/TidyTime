# TidyTime
TidyTime is a decentralized web-based application corresponding to the End of Degree Project for my Software Engineering Bachelor 👩🏽‍💻. 

The idea behind the development of this system is to produce a task, event and time optimization management app 💆🏽, capable of integrating with Google Calendar and GitHub (luckily, more applications will be added in the future 🔮).

## Requirements
Not much 🕺🏼! To use the application, the user must solely be in disposition of a Solid POD (sorry about interoperability 😔, but right now only Inrupt accounts are supported).
Additionally, it would be necessary to enable third-party cookies in your preferred browser for the application to work properly. Why 🙇‍♀️? because the free plan of the deployment platform utilized is currently providing the server and client sides with different domains (not all could be perfect 👀).

## Accessing the app
This app can be accessed in [TidyTime](https://tidytime-wh88.onrender.com/). Please, take into account that the deployment platform puts the application to a sleep mode in periods of inactivity, so it is normal if at first the application takes its time.

## Running the app locally
This project has been developed using node. If you prefer to run the app locally:
1. Clone this repository.
2. Create the environment files of the client and server side. Their contents are specified at the end of this section.
3. At the root directory, get into the client folder `cd client` and install dependencies with `npm ci`.
4. From the client directory, get into the server folder `cd ../server` and install dependencies with `npm ci`.
5. Once everything is set, get back to the client folder `cd ../client`. Depending on the mode you want:<br>
   5.1 You can deploy the application in developer mode by `npm run dev`. This last command will concurrently run the server and client side.<br>
   5.2 You can start the application with `npm run build` followed by `npm run start`.<br>

```
// client .env
NEXT_PUBLIC_FRONT_URL='http://localhost<port of your choice| 3000>'
NEXT_PUBLIC_BACK_URL='http://localhost<port of your choice| 8080>'
```
For the server environment file, you may need a GitHub, Google and Inrupt ClientID and ClientSecret.
```
// server .env
FRONT_URL='http://localhost<port of your choice| 3000>'
BACK_URL='http://localhost<port of your choice| 3000>'

CRYPTO_ALGORITHM=<...>
CRYPTO_SECRET_KEY=<...>

GITHUB_CLIENT_ID=<...>
GITHUB_CLIENT_SECRET=<...>

INRUPT_CLIENT_ID=<...>
INRUPT_CLIENT_SECRET=<...>

GOOGLE_OAUTH_CLIENT_ID=<...>
GOOGLE_OAUTH_CLIENT_SECRET=<...>
GOOGLE_OAUTH_REDIRECT_URI=<...>
```
How to fill this file?
### Inrupt application registration
To obtain a clientID and clientSecret for the Inrupt properties, just go to [Application Registration](https://login.inrupt.com/registration.html). Then use the credentials obtained to fill the respective properties.

If you want to use the Google and GitHub integrated functionalities, follow the next sections. Else, you can skip them.
### GitHub OAuth App
1. Log into your GitHub account.
2. Go to Settings > Developer Settings > OAuth Apps > New OAuth App.
3. Fill the required information and use the provided credentials to set a value for the environment file GitHub properties.

### Google App
If you want to registrate an app in Google, go to [Google Console](https://console.cloud.google.com) and follow the instructions to create a new Project. Once you have your credentials, use them to set a value for the environment file Google Properties.
If you encounter any issue within this process, feel free to open an issue in this repository to ask for help.

## Encounter any issues?
If you encounter any issue while using or deploying the app, feel free to add an issue to this repository explaining your problem 🙏!

## Team
This app has been developed by Patricia García Fernández 🙂.
