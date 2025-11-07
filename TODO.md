# TODO: Convert Firebase-based Backend to MongoDB

## Step 1: Install Dependencies
- [x] Add `@nestjs/mongoose` and `mongoose` to `package.json` dependencies.
- [x] Run `npm install` to install the new packages.

## Step 2: Create Mongoose Schemas
- [x] Create `src/schemas/user.schema.ts` for User entity.
- [x] Create `src/schemas/nurse.schema.ts` for Nurse entity.
- [x] Create `src/schemas/authorized.schema.ts` for Authorized entity.
- [x] Create `src/schemas/appointment.schema.ts` for Appointment entity.

## Step 3: Adapt Interfaces
- [x] Move and adapt interfaces from `src/firebase/user.interface.ts` to `src/interfaces/user.interface.ts`, ensuring compatibility with Mongoose schemas.

## Step 4: Create MongoService
- [x] Create `src/mongo/mongo.service.ts` to replace `FirebaseService`, implementing all methods (create, read, update, delete, login, etc.) using Mongoose models.

## Step 5: Create MongoModule
- [x] Create `src/mongo/mongo.module.ts` to provide the MongoService and configure Mongoose models.

## Step 6: Update AppController
- [x] Change injection in `src/app.controller.ts` from `FirebaseService` to `MongoService`.
- [x] Update method calls to match the new service interface.

## Step 7: Update AppModule
- [x] Replace `FirebaseModule` import with `MongooseModule` in `src/app.module.ts`.
- [x] Configure MongooseModule for MongoDB connection (using environment variables).

## Step 8: Remove Firebase Code
- [x] Delete `src/firebase/` directory.
- [x] Delete `firebase-key.json` file.

## Step 9: Followup Steps
- [ ] Set up MongoDB connection via environment variables in `.env`.
- [ ] Test endpoints to ensure data operations work with MongoDB.
- [ ] Verify caching and other features remain intact.
