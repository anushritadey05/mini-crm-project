# 📊 Mini CRM - Client Lead Management System

A full-stack web application for managing client leads, tracking their status, and converting them into customers. Built with React, Node.js, Express, and MongoDB.

## 🎯 Features

✅ **User Authentication**
- Secure admin login and registration
- JWT token-based authentication
- Password hashing with bcryptjs

✅ **Lead Management**
- Create, read, update, and delete leads
- View lead details and history
- Add follow-up notes
- Track lead source and status
- Deal value tracking

✅ **Lead Tracking**
- Status pipeline: New → Contacted → Qualified → Negotiating → Converted/Lost
- Follow-up date scheduling
- Activity timeline
- Multiple lead sources (website, email, phone, referral, social media)

✅ **Dashboard Analytics**
- Real-time statistics
- Lead count by status
- Search and filter leads
- Responsive design

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Context API** - State management
- **CSS3** - Styling

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager
- Git

## 🚀 Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/mini-crm-project.git
cd mini-crm-project