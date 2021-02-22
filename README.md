# Agora React Native Multi Channel Demo

Quickstart for multiple channel video calls on [React Native SDK](https://facebook.github.io/react-native/) using Agora.io SDK.
Use this guide to quickly connect to multiple channels for video call.

## Prerequisites

* >= react native 0.60.00
* iOS SDK 10.0+
* Android 6.0+
* A valid Agora account [Sign up](https://dashboard.agora.io/en/) for free.

Open the specified ports in [Firewall Requirements](https://docs.agora.io/en/Agora%20Platform/firewall?platform=All%20Platforms) if your network has a firewall.

## Running this example project

### Structure

```
.
├── android
├── components
│ └── Permission.ts
│ └── Style.ts
├── ios
├── App.tsx
├── index.js
.
```

### Generate an App ID

In the next step, you need to use the App ID of your project. Follow these steps to [Create an Agora project](https://docs.agora.io/en/Agora%20Platform/manage_projects?platform=All%20Platformshttps://docs.agora.io/en/Agora%20Platform/manage_projects?platform=All%20Platforms#create-a-new-project) in Console and get an [App ID](https://docs.agora.io/en/Agora%20Platform/terms?platform=All%20Platforms#a-nameappidaapp-id).

1. Go to [Console](https://dashboard.agora.io/) and click the [Project Management](https://dashboard.agora.io/projects) icon on the left navigation panel. 
2. Click **Create** and follow the on-screen instructions to set the project name, choose an authentication mechanism (for this project select App ID without a certificate), and Click **Submit**. 
3. On the **Project Management** page, find the **App ID** of your project. 

Check the end of document if you want to use App ID with the certificate.

### Steps to run our example

* Download and extract the zip file.
* Run `npm install` or use `yarn` to install the app dependencies in the unzipped directory.
* Navigate to `./App.tsx` and enter your App ID that we generated on line 46 as `appId: 'YourAppId',`
* [iOS] Open a terminal and execute `cd ios && pod install`.
* Connect your device and run `npx react-native run-android` or `npx react-native run-ios` to start the app.

The app uses `channel-1` and `channel-2` as the channel names.

## Sources
* Agora [API doc](https://docs.agora.io/en/)
* [Issues feedback](https://github.com/AgoraIO-Community/Agora-RN-Quickstart/issues)
* [React Native](https://facebook.github.io/react-native/docs/getting-started.html)

## License
MIT
