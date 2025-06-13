# MediDex
MediDex is multiplatform application that aims to streamline the medical information of over-the-counter medicines in Aotearoa New Zealand, by presenting information from Medsafe, a reliable and regulated source, in an accessible, user-friendly and convenient way to all Kiwis.

## Project Management Tool
https://github.com/orgs/uoa-compsci399-2025-s1/projects/39

## 📱 Technologies Used

### 🖥️ Frontend
- **Framework:** React Native (JavaScript) `v0.79.2`
- **React Version:** React `v19.0.0`
- **Development Framework:** Expo `v53.0.9`

#### React Native Libraries
- React Navigation `v7.1.9`
- React Native Async Storage `v2.1.2`
- React Native Assets Slider `v11.0.8`

#### Expo Libraries
- Expo Module Scripts `v4.1.7`
- Expo Status Bar `v2.2.3`
- Expo Haptics `v14.1.4`
- Expo Network `v5.0.6`

### 🖧 Backend
- **Language:** Python `v3.12.2`
- **Web Framework:** Flask `v3.1.1`
- **Database Access:** Python (using SQL veries via psycopg2)

#### Python libraries:
- Flask `3.1.1`
- flask-restx `1.3.0`
- SQLAlchemy `2.0.41`
- pytest `8.3.5`
- flask-cors `6.0.0`
- Selenium `4.33.0`
- gunicorn `23.0.0`
- psycopg2-binary `2.9.10`
- python-dotenv `1.1.0`

### 🛠️ Tools & Infrastructure

- **Database:** PostgreSQL `v16.1` (hosted on Neon)
- **Containerization:** Docker `v25.0.3`
- **Server Deployment:** Render

> ⚠️ **Note:**  
> Since our server is hosted on Render’s free plan, it may take up to **1 minute to start** if it has been idle. During this time, you might notice pages in the app loading slowly until the server is fully active.

## To get the application side (Expo) to run:

### For Android
To quickly download the app and run it, here is an APK file which is only available on android systems:

[Download APK](https://expo.dev/artifacts/eas/7SXbidhbrfpkxPzPjk4x7.apk)

### For iOS (also compatible with Android)

The following steps are to be done on a laptop or desktop computer after successfully cloning this repository.

1. Install Node.js (LTS version):
   
   https://nodejs.org/en
   

2. Install dependencies (in PowerShell/VSCode terminal) while in the project directory

   ```
   npm install
   ```


> ⚠️ **Note:**  
> If you encounter this error:  
> `npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled on this system.`  
>  
> Run the following command in your terminal to allow script execution for your user:  
> `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`

3. Start the frontend React Native app 

   ```
    npx expo start
   ```


4. Install Expo Go from the App Store/Play Store, then (making sure your PC and phone are both using the same network)

Scan the QR code with the camera app(iOS) or in the Expo Go app(Android) and scan some stuff! Ensure that the supported SDK version in the settings is 53.

> ⚠️ **Note:**  
> You will need an account with Expo, and after scanning the QR code, it may ask you to log in via the terminal.

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.


## Future Plan
For future releases, we would like to be able to retrieve all the Consumer Medicine Information of over the counter medicines from [Medsafe](https://www.medsafe.govt.nz/index.asp), as well as get their in store barcodes. For this current version, only a small subset of medicines was used to demonstrate the app's functionality. An automated system would likely need to be created or a collaboration with Medsafe to ensure an accurate extraction of the Consumer Medicine Information sheets.

Additionally, if MediDex were to continue as a native mobile app, we had ideas for implementing an offline mode. This would allow users to use the app without having to be connected to the internet. Alternatively, MediDex could also shift into becoming a full web app, removing the barrier of having to download the application, increasing its accessibility to all users.


## Acknowledgements
- https://flask.palletsprojects.com/en/stable/
- https://reactnative.dev/docs/getting-started
- https://docs.expo.dev/
- https://render.com/
- https://neon.com/
- https://www.postgresql.org/docs/
- https://docs.docker.com/
