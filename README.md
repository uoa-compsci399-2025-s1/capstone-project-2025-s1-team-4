## Get started

## To allow the flask server to run:
**Windows**
```shell
$ cd <project directory>
$ py -3 -m venv venv
$ venv\Scripts\activate
$ pip install -r requirements.txt
```

**MacOS**
```shell
$ cd <project directory>
$ python3 -m venv venv
$ source venv/bin/activate
$ pip install -r requirements.txt
```

If new dependencies are required, please add them to the requirements.txt file.

## To get the application side (Expo) to run:
### Quick configuration before starting the app
Create a **config.ts** file where you will initialize the url where the API's will be called. This should be your computers IP address:port number. Write it like so:

export const API_BASE_URL = "http://IPADDRESS:PORT";

1. Install node.js (LTS version):
   
   https://nodejs.org/en
   

2. Install dependencies (in powershell/VSCode terminal)

   ```
   npm install expo@latest
   npm install expo-module-scripts
   npx expo install expo-status-bar
   ```

3. Start the app

   ```
    npx expo start
   ```

5. Install Expo Go on Android, then (making sure your PC and phone are both using the same network) scan the QR code in Expo Go and scan some stuff!

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.
