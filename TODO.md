# Firebase Integration TODO

- [x] Add firebase-admin to package.json dependencies
- [x] Run npm install to install firebase-admin
- [x] Create .env file with Firebase service account environment variables
- [x] Create src/firebase/firebase.service.ts for Firebase Admin SDK initialization
- [x] Create src/firebase/firebase.module.ts to encapsulate the Firebase service
- [x] Update src/app.module.ts to import FirebaseModule
- [x] Test Firestore connectivity (optional: add a simple test endpoint)
- [x] Run npm install to install @nestjs/config
- [x] Copy Firebase service account key to backend/firebase-key.json
- [x] Create .env file with GOOGLE_APPLICATION_CREDENTIALS=./firebase-key.json
- [x] Create src/firebase/firebase.service.ts for Firebase Admin SDK initialization with Realtime Database
- [x] Create src/firebase/firebase.module.ts to encapsulate the Firebase service
- [x] Update src/app.module.ts to import ConfigModule and FirebaseModule
- [x] Add a simple test endpoint in app.controller.ts to verify Realtime Database connectivity
- [x] Update TODO.md to mark completed tasks

# User Schema and Redis Integration TODO

- [x] Define User schema with name, mobile number, password fields
- [x] Create src/firebase/user.interface.ts with User and CreateUserDto interfaces
- [x] Add user-specific methods to FirebaseService (createUser, getUser, getAllUsers, updateUser, deleteUser)
- [x] Add user endpoints to app.controller.ts (POST /user, GET /users, GET /users/:id, PATCH /users/:id, DELETE /users/:id)
- [x] Add Redis dependencies to package.json (@nestjs/cache-manager, cache-manager-redis-store, redis)
- [x] Create src/redis/redis.module.ts for Redis cache configuration
- [x] Create src/redis/redis.interceptor.ts for caching GET requests
- [x] Update src/app.module.ts to import RedisModule
- [x] Apply RedisInterceptor to AppController for caching
- [x] Update TODO.md to mark Redis integration tasks as completed
