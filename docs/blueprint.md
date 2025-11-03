# **App Name**: AgriVision Pro

## Core Features:

- Real-time Sensor Data Display: Display live readings from soil moisture, temperature, humidity, and other sensors. Data updates in real-time via Firestore listeners.
- AI Crop Health Monitoring: Upload or capture images to analyze crop health using AI, providing a label, confidence score, bounding boxes, and recommended actions. Leverages a Cloud Function tool for AI inference when images are uploaded to Storage.
- Remote Pump Control: Enable operators to remotely toggle the pump ON/OFF with safety checks, confirmation modals, and audit logs. Cloud Function ensures secure operation and records actions in Firestore.
- Three-Phase Power Monitoring: Detect and display the status of the 3-phase power system, highlighting any phase loss or faults in real time.
- Historical Sensor Trend Visualization: Visualize sensor data trends over time (24h, 7d, 30d) with interactive charts, enabling users to identify patterns and anomalies.
- Alerting and Notifications: Trigger real-time alerts for critical events (low moisture, phase loss) via in-app notifications and push notifications using Firebase Cloud Messaging.
- Role-Based Access Control: Implement secure user authentication with Firebase Auth and role-based access control (Admin, Farm Manager, Viewer) enforced by Firebase Security Rules.

## Style Guidelines:

- Primary color: Soft green (#A7D1AB) to evoke a sense of health and growth in line with agricultural themes.
- Background color: Light green (#E6F2E8) - A desaturated version of the primary color creating a calming and clean backdrop.
- Accent color: Amber (#D6AD60) to highlight warnings or important alerts, analogous to the primary color but with different brightness and saturation.
- Body and headline font: 'Inter' - a grotesque sans-serif font, will be used for both headlines and body text.
- Use high-contrast icons for key actions and status indicators. Icons should be simple, clear, and easily recognizable.
- Responsive layout with collapsible sidebar, card-based design, and clear separation of data. Optimize for both desktop and mobile viewing.
- Subtle animations for loading states, data updates, and pump controls. Avoid distracting or unnecessary animations.