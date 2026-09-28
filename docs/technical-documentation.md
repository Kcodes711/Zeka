# Zeka Technical Documentation

## 1. Introduction

Zeka is a mobile task marketplace that connects people who need small jobs done with people who are willing to complete those tasks for payment. The project is designed for the Lusaka market, with a focus on simple everyday services such as cleaning, gardening, shopping, delivery, queue standing, document collection and other basic errands.

The main goal of the system is to create a simple digital platform where task owners can post a request and task providers can browse, bid, and complete the work. The app is designed to reduce the difficulty of finding work, while also making it easier for people to quickly find help for local tasks.

This document is based on the original project proposal and the implementation that has already been built in the current project. It describes the system requirements, architecture, functionalities, technical design, and the current MVP status.

---

## 2. Project Background and Problem

In Zambia, many people are looking for short-term earning opportunities, especially young people who need flexible work. At the same time, many people need help with simple jobs but do not know where to find trustworthy and available people.

Today, much of this work is shared through social media, WhatsApp groups, personal networks and informal communication. This process is often slow, unreliable and difficult to manage. There is no clear central platform where people can post tasks and task providers can easily respond.

Zeka aims to solve this problem by giving users a central place to:

- post tasks,
- search for available work,
- communicate task requirements,
- compare offers,
- select a suitable provider,
- track task progress,
- rate and review each other after completion.

This makes the system useful for both parties: the person needing help and the person looking for income.

---

## 3. Project Objectives

### 3.1 Main Objective

The main objective of the project is to develop a mobile task marketplace that connects people who need small jobs completed with people who are willing to perform those tasks for payment.

### 3.2 Specific Objectives

The project aims to:

1. Develop a mobile platform where users can register and create profiles.
2. Allow users to post tasks they need completed.
3. Allow task providers to browse and search for available tasks.
4. Allow users to submit offers or bids for tasks.
5. Allow task owners to select a suitable task provider.
6. Provide a way to track the progress of a task.
7. Allow users to rate and review each other after completion.
8. Create a simple and practical platform for small income opportunities.
9. Develop an MVP that can be tested with a small group of users.

---

## 4. Scope of the Project

### 4.1 Proposed Scope

The first version of Zeka focuses on simple local tasks in Lusaka such as:

- document collection,
- queue standing,
- small deliveries,
- shopping and pickup tasks,
- car washing,
- cleaning,
- gardening,
- basic plumbing,
- moving small items,
- other basic errands.

### 4.2 Out of Scope

The initial MVP does not include:

- highly specialised professional work,
- medical or legal services,
- advanced payment systems,
- AI-based matchmaking,
- international expansion,
- complex enterprise operations.

These can be added in future versions.

---

## 5. System Requirements

### 5.1 Functional Requirements

The system should support the followings features.

#### 5.1.1 User Registration and Login

Users should be able to:

- create an account,
- sign in to their account,
- update their profile,
- view their ratings,
- act as both a task requester and a task provider.

#### 5.1.2 Task Posting

A task owner should be able to:

- create a new task,
- add a task title,
- provide a description,
- select a category from a predefined list,
- enter the location,
- set a budget,
- set a preferred completion time,
- publish the task.

The supported categories for the MVP include small errands, cleaning, gardening, delivery, document collection, queue standing, moving furniture, basic plumbing, car washing, home help, general labour and other local service types. This helps keep the platform focused on realistic and practical jobs.

#### 5.1.3 Task Browsing

Task providers should be able to:

- view open tasks,
- search for tasks,
- filter tasks by category or keyword,
- view task details,
- see budget, location and time information.

The worker dashboard also includes a category filter so users can narrow the list to the kinds of tasks they are able to complete.

#### 5.1.4 Bidding

A task provider should be able to submit an offer for a task. The offer can include:

- proposed price,
- short message,
- expected completion time.

The task owner can compare offers and select one.

In the current MVP, this flow has been implemented in a simplified form. Workers can open a task, enter a bid amount and a short message, and the poster can review all active offers and accept one. This gives the app a working marketplace negotiation step while keeping the MVP focused and lightweight.

#### 5.1.5 Task Assignment

After selection, the task is assigned to the chosen user. The task status should change through the process:

Open → Assigned → In Progress → Completed

#### 5.1.6 Ratings and Reviews

After task completion, both users should be able to rate and review each other. This helps build trust in the platform and improves future decision-making.

#### 5.1.7 Notifications

The system should notify users when events happen such as:

- new bids,
- bid acceptance,
- task assignment,
- task completion,
- new reviews.

### 5.2 Non-Functional Requirements

The application should also meet quality expectations.

- Usability: simple and clear for people with basic digital skills.
- Performance: pages and actions should work quickly.
- Security: user information should be protected.
- Reliability: task and user data should be stored properly.
- Scalability: design should allow future growth.

---

## 6. Current Product Implementation Status

The project has already been implemented as a mobile MVP in React Native using Expo. This current build is not yet connected to a real backend or database, but it contains the major UI flows and logic needed to demonstrate the concept and validate the user journey.

The current app includes the following implemented features:

- role selection screen,
- worker dashboard,
- poster dashboard,
- task creation and edit flow,
- category-based task posting,
- task detail views,
- task browsing and category filtering,
- bid submission flow for workers,
- offer review and acceptance flow for posters,
- active jobs tracking,
- task completion and return actions,
- local persistence using AsyncStorage.

This means the system is currently functioning as a frontend prototype for the problem described in the proposal, with the core marketplace interaction already represented in the app.

---

## 7. User Roles and User Flow

### 7.1 Poster Role

The poster is the user who needs a task completed. The poster can:

- choose to post a task,
- define task title and description,
- set location and budget,
- monitor open, in-progress and completed tasks,
- edit or delete a task,
- review task status and progress.

### 7.2 Worker Role

The worker is the user who wants to find and complete opportunities. The worker can:

- browse available tasks,
- use search to find relevant work,
- filter tasks by category,
- view task details,
- submit a bid with price and message,
- manage active jobs,
- mark a task complete when finished,
- return a task if needed.

### 7.3 Basic User Journey

The current app supports a simplified flow:

1. user opens the app,
2. user selects role,
3. poster creates a task or worker browses tasks,
4. task is shown in the relevant dashboard,
5. worker submits a bid with a proposed amount and message,
6. poster reviews bids and accepts a suitable offer,
7. task is moved to active jobs,
8. task is completed or returned,
9. task is stored locally and remains available on the device.

This flow is consistent with the original proposal and reflects the pricing negotiation model that is core to the product concept.

---

## 8. Functional Design Based on Proposal

The proposal describes a two-sided marketplace, and the current implementation reflects that model in a simplified way.

### 8.1 Task Creation

A poster can create a task with:

- category,
- title,
- description,
- location,
- suggested budget,
- deadline.

The category is selected from a predefined list so that the app remains aligned with the service types supported by the project. The current MVP categories include small errands, cleaning, gardening, delivery, document collection, queue standing, moving furniture, basic plumbing, car washing, home help and general labour.

### 8.2 Availability and Search

The worker dashboard allows users to see open tasks, search by title, and filter by category. This works as a simplified version of the proposal requirement for browsing and filtering tasks based on task type and worker skill fit.

### 8.3 Assignment and Status Flow

The product logic uses statuses such as:

- Open,
- In progress,
- Completed.

The worker also has an Active or Completed state to track assigned tasks. This reflects the intended task lifecycle in the proposal.

### 8.4 Bidding and Offer Logic

The original proposal says users should be able to submit offers and task owners should select suitable workers. The current MVP includes a simplified but working bidding flow: workers can place bids, and posters can review and accept one offer. This is the implemented marketplace negotiation layer for the app. The remaining proposal elements that are still not in the app are considered future improvements rather than missing features within the current MVP scope.

---

## 9. Completed MVP versus Future Improvements

The project should be viewed as an MVP with a clear distinction between what is already built and what is still part of the future roadmap.

### 9.1 Completed in the Current MVP

- role-based app flow,
- poster task posting and editing,
- category-based task creation,
- search and category filtering,
- worker bid creation,
- offer review and acceptance by poster,
- task assignment via accepted offer,
- active and completed job tracking,
- local persistence using AsyncStorage,
- TypeScript validation of the current app structure.

### 9.2 Future Improvements

The following items are still future improvements based on the original proposal and the production-level requirements of the platform:

- real user registration and authentication,
- real user profile management,
- backend database integration,
- multi-user synchronization,
- secure API and authorization,
- notifications and real-time updates,
- payment or escrow handling,
- ratings and review persistence,
- moderation and trust systems,
- full production testing and QA,
- presentation and demo packaging for a final stakeholder pitch.

This distinction ensures the product is documented accurately: the current build is a working functional MVP, while the remaining proposal items are planned for future product development.

---

## 10. System Architecture

The current system follows a simple frontend-first architecture.

### 10.1 Client Layer

The mobile application is built with:

- Expo,
- React Native,
- TypeScript,
- Expo Router,
- React Native components.

The app uses screen-based routing and mobile-friendly UI components to manage the different user journeys.

### 10.2 Business Logic Layer

The logic is centrally organized under the src/lib folder. This includes:

- navigation logic,
- task state management,
- formatting helpers.

### 10.3 Persistence Layer

The app uses AsyncStorage to store tasks locally. This allows the application to keep task data on the device even after the app is closed or re-opened.

### 10.4 Main Project Structure

The project currently follows this structure:

- src/app – screens and routing
- src/lib – shared logic and data access
- src/constants – colors and theme constants
- src/components – reusable UI building blocks

This structure supports maintainability and makes the current MVP easy to extend for future backend integration.

---

## 11. Core Data Model

The main data object in the app is a task object. It contains the following information:

- id: unique task identifier,
- title: short task title,
- description: task details,
- location: task area or service location,
- budget: suggested amount in Kwacha,
- deadline: optional date or task time,
- status: current task state,
- workerStatus: worker-specific state,
- offerCount: count of offers or tracking signal,
- createdAt: task creation time.

This model is closely aligned with the proposal’s objective of posting tasks with location, budget and completion time.

---

## 12. Technology Stack

The system currently uses the following technologies:

- React Native
- Expo
- Expo Router
- TypeScript
- AsyncStorage
- React Native Safe Area Context
- FlatList and TouchableOpacity

This stack is appropriate for rapid mobile MVP development and fits the project stage well. It supports quick prototyping without the complexity of building a full backend from the beginning.

---

## 13. Screen and Navigation Design

The current app contains the following screens:

- / – role selection and landing screen,
- /worker-home – available tasks,
- /poster-home – poster dashboard,
- /create-task – create or edit task,
- /task-details-worker – task details for workers,
- /task-details-client – task details for posters,
- /active-jobs-worker – active and completed jobs,
- /login – mocked authentication flow.

Navigation is done using Expo Router and direct route transitions. This approach keeps the app simple and easy to understand for an MVP.

---

## 14. State Management Approach

The app uses a combination of component-level state and a central task store.

### 14.1 Local UI State

The app uses local state for things like:

- selected tab,
- search input,
- form fields,
- loading indicators,
- confirmation dialogs.

### 14.2 Shared Task State

The task-store module manages all task data and updates in a centralized way. It is responsible for:

- reading data from storage,
- adding tasks,
- updating tasks,
- deleting tasks,
- changing task status,
- notifying screens of changes.

This centralized design is helpful for the MVP, because all screens rely on the same data structure.

---

## 15. Security, Trust and Risk Considerations

The proposal identifies trust as an important issue because users may deal with people they do not know. The current implementation does not yet include production-level security or verification systems.

Major gaps include:

- no real user authentication,
- no backend database,
- no secure API access,
- no user identity verification,
- no escrow or payments,
- no ratings and reviews system beyond the concept stage,
- no moderation or reporting features.

These items are treated as future improvements for the product roadmap. They are not considered failures of the current MVP, because the project is intentionally front-end-first and designed for validation before backend integration.

---

## 16. Testing and Validation

The current implementation is mainly validated through manual testing of the key flows. Important checks include:

- task creation,
- task update,
- task deletion,
- worker browse flow,
- bid submission,
- offer acceptance,
- task completion,
- navigation between screens,
- local persistence after reopening the app.

The project currently has TypeScript validation in place and a working front-end flow, but it does not yet include a formal automated QA suite or production-scale system testing. This is a future improvement area.

---

## 17. Deployment Environment

The app runs in an Expo environment and is suitable for:

- Android emulator,
- iOS simulator,
- Expo Go,
- web preview in development mode.

This means the project is ready for rapid testing and demo usage during the MVP phase.

---

## 18. Gaps Between Proposal and Current Build

The proposal describes a more complete platform with user profiles, bids, task selection, ratings, reviews and notifications. The current app has implemented a good part of the user-facing experience and the core marketplace flow, but there are still some gaps that are intentionally treated as future improvements.

### 18.1 Already Implemented

- mobile-first task marketplace interface,
- role selection,
- task posting,
- task listing,
- search,
- category filtering,
- task details,
- worker bidding flow,
- poster offer review and acceptance,
- task completion and status changes,
- local task storage.

### 18.2 Future Improvements

- real authentication,
- real database,
- background API,
- multi-user synchronization,
- user profiles and ratings persistence,
- payment and escrow,
- push notifications,
- admin/moderation tools,
- large-scale testing and deployment staging.

This means the current app is best seen as a functioning MVP prototype of the proposal, with future product improvements planned beyond the current build.

---

## 19. Recommended Future Development Plan

To move from the current MVP to the final platform described in the proposal, the following work should be done in sequence.

### 18.1 Backend and Database

A production-ready backend should be added using Supabase or another backend service. The database should store:

- users,
- profiles,
- tasks,
- bids,
- statuses,
- reviews,
- notifications.

### 18.2 Authentication and Security

The mock login flow should be replaced with real OTP or secure user authentication. This will help protect user accounts and ensure proper access control.

### 18.3 Real Bidding Logic

The task owner should be able to receive offers from workers, compare them, and choose a provider based on price, rating and availability.

### 18.4 Ratings and Trust Systems

A rating system should be added to improve trust between task owners and task providers. This is one of the most important parts of the original proposal.

### 18.5 Notifications and Real-Time Updates

The app should notify users when tasks are updated, when a worker bids, when a task is assigned, and when status changes happen.

### 18.6 Payment and Transaction Handling

Future versions should consider payment processing or escrow to make large or sensitive tasks more secure.

---

## 20. Project Evaluation

Zeka is a strong concept with practical value for local communities in Lusaka. It addresses a real problem: many people need help with small jobs, while others are looking for short-term work opportunities. The app provides a useful and simple solution for matching these groups.

The current implementation is a valid MVP and clearly shows the main user journeys. The user experience is simple and direct, which is very important for this type of platform. But the project is still in the early stage, and much of the full proposal has not yet been built into the system.

The current build is therefore best described as a functional prototype and an MVP foundation for the final product described in the project proposal.

---

## 20. Conclusion

Zeka is a mobile marketplace for local tasks in Lusaka that connects people who need common everyday help with people who want flexible income. Based on the proposal, the system is designed to support task posting, browsing, bidding, assignment, tracking, and ratings. The current application successfully implements a simplified version of this flow in a mobile interface using Expo and React Native.

The current version is technically sound as an MVP prototype, but it still requires backend integration, real authentication, database storage, and more complete marketplace logic before it can be considered a production-ready platform. The project has a strong base, and the current build is a good starting point for future development and scaling.

---

## 21. Final Assessment

This project is relevant, original, and practical. The idea is easy to understand, and the mobile app already demonstrates that the concept can be translated into a user-friendly product. The main challenge now is not the idea itself, but the full technical implementation of the wider system described in the proposal.

In other words, the project is conceptually strong and has a working MVP, but it still needs more backend power, proper data models, and production-ready trust features before it can fully meet the original project goals.
