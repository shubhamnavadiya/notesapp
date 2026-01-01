# React Native Notes App (Supabase)

This is a technical assignment submission for a React Native + Supabase Notes App.

**Features Implemented:**
- **Authentication**: Email/Password Sign Up, Login, Persistent Session (SecureStore).
- **Notes CRUD**: Create, Read, Update, Delete notes.
- **Privacy**: RLS (Row Level Security) ensures users can only see/edit their own notes.
- **Search**: (Option B) Client-side filtering by note title.
- **State Management**: Redux Toolkit for global state (Auth, Notes).
- **UI/UX**: Modern UI with NativeWind (TailwindCSS), Glassmorphism, and Gradients.
- **Validation**: Inline form validation for better user experience.
- **Keyboard Handling**: `react-native-keyboard-aware-scroll-view` for seamless inputs.

## Prerequisites

- Node.js & npm/yarn
- Expo CLI
- A Supabase Project

## Project Setup

1. **Clone the repository** (or download source).
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment**:
   - Create a `.env` file in the root directory.
   - Add your Supabase credentials (see `.env.example` or below):
     ```
     EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
     EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```
4. **Run the App**:
   ```bash
   npx expo start -c
   ```
   - Press `a` for Android Emulator (must be running).
   - Or scan QR code with Expo Go.

## Authentication Setup (Crucial)

To ensure the signup flow works immediately without email verification (for testing purposes), you **MUST** disable email confirmations in Supabase:

1. Go to your Supabase Dashboard.
2. Navigate to **Authentication** > **Providers** > **Email**.
3. **Disable** "Confirm email".
4. Value should be: `Confirm email` -> **OFF**.

*If this is not disabled, new users will not be able to log in immediately after signup.*

## Supabase Schema

You **MUST** run the following SQL in your Supabase SQL Editor to set up the database:

```sql
-- Create Notes table
create table public.notes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text,
  content text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.notes enable row level security;

-- Create Policy: Users can only see their own notes
create policy "Users can view their own notes."
  on public.notes for select
  using ( auth.uid() = user_id );

-- Create Policy: Users can insert their own notes
create policy "Users can insert their own notes."
  on public.notes for insert
  with check ( auth.uid() = user_id );

-- Create Policy: Users can update their own notes
create policy "Users can update their own notes."
  on public.notes for update
  using ( auth.uid() = user_id );

-- Create Policy: Users can delete their own notes
create policy "Users can delete their own notes."
  on public.notes for delete
  using ( auth.uid() = user_id );
```

## How to Build APK

To generate an APK (if not using EAS Build cloud service):

1. **Prebuild** (if generic android project is needed):
   ```bash
   npx expo prebuild
   ```
2. **Build**:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```
3. The APK will be in `android/app/build/outputs/apk/release/app-release.apk`.

*Note: This project is an Expo Managed workflow by default. To get a bare APK without EAS, you need to eject/prebuild.*

## Assumptions & Trade-offs

- **Search**: Implemented Option B (Client-side search). For large datasets, server-side search (`ilike`) would be better, but for a simple notes app, client-side is faster and sufficient.
- **UI library**: Used `NativeWind` (TailwindCSS) + `Boxicons` (Vector Icons) for a modern, custom design instead of a heavy UI kit.
- **State Management**: Used **Redux Toolkit** to handle Auth session and Notes data globally. This ensures robust state synchronization across screens.
- **Form Handling**: Implemented custom inline validation state for immediate user feedback.
- **Offline Handling**: While **Option B (Search)** was chosen as the primary feature, the app implements graceful error handling. A dedicated error screen with a "Try Again" action is displayed when notes cannot be fetched (e.g., offline), ensuring the app remains stable and user-friendly.
- **Authentication**: Email verification is disabled to allow instant access for testing/demo purposes, though production apps should typically enable it.


