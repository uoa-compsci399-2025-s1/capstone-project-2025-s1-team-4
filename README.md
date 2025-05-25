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


## To get the application side (Expo) to run:

### On Android
To quickly download the app and run it, here is an APK file which is only available on android systems:

INSERT LINK HERE

### On other platforms (also compatible with Android)

1. Install node.js (LTS version):
   
   https://nodejs.org/en
   

2. Install dependencies (in powershell/VSCode terminal) while in project directory

   ```
   npm install
   ```

3. Start the frontend React Native app 

   ```
    npx expo start
   ```

4. Install Expo Go on Android, then (making sure your PC and phone are both using the same network) scan the QR code in Expo Go and scan some stuff! Ensure that the supported SDK version in the settings is 53.

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.
