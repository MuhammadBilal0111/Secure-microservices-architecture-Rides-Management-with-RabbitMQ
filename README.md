
# Secure Microservices Architecture – Rides Management with RabbitMQ

This project demonstrates a **secure, scalable microservices architecture** for a ride-booking system built using **Node.js**, with inter-service communication handled via **RabbitMQ**. Each service (User, Captain, Ride) is isolated, follows REST principles, and is secured against common threats like **DoS attacks, CSRF, and fake/spam users**.

## 🔐 Key Security Features

- **Rate Limiting** – Protects login and registration endpoints from **DoS and brute-force attacks**
- **CSRF Protection** – Ensures requests are verified and originated from trusted clients
- **Fake/Spam User Prevention** – Registration is rate-limited to avoid spam account creation
- **Service Isolation & Gateway Protection** – All routes pass through an API Gateway that handles security, logging, and request forwarding

## 📦 Technologies Used

- **Node.js & Express** – Backend framework for each service
- **RabbitMQ** – For asynchronous, event-driven communication between services
- **MongoDB** – Database for storing user, captain, and ride data
- **API Gateway** – Acts as a single entry point with security middleware

## 📁 Microservices

- **User Service** – Handles authentication, registration, and ride requests
- **Captain Service** – Handles captain availability and ride acceptance
- **Ride Service** – Manages ride creation and assignment

