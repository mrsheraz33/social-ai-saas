# Social Media Automation & AI Content Platform (MERN SaaS)

An enterprise-grade, full-stack AI SaaS application designed to streamline social media management. The platform enables users to connect multiple social accounts, generate AI-driven text and high-quality image assets, and schedule multi-channel posts through a unified interface.

Live Demo: https://social-ai-saas-red.vercel.app

---

## Core Features

- **Multi-Platform Account Management:** Seamlessly link and manage LinkedIn, Twitter/X, and YouTube accounts via Zernio API integration.
- **AI-Powered Text Generation:** Leverage Google Gemini models to craft tailored, high-converting social media posts and strategy outlines.
- **AI Image Generation:** Dynamically produce high-resolution post visuals using Hugging Face (FLUX model) and Cloudinary optimization.
- **Automated Content Scheduler:** Background job execution via Node-Cron to schedule and automatically publish posts at designated times.
- **Analytics & Management Dashboard:** Interactive interface to track active integrations, post queues, and account status.
- **Secure Authentication:** JWT-based user authentication with encrypted password handling (Bcrypt).

---

## Tech Stack

### Frontend
- **Framework:** React.js (TypeScript, Vite)
- **Styling:** Tailwind CSS
- **State & HTTP:** Axios
- **UI Components:** Lucide Icons

### Backend & Database
- **Runtime & Framework:** Node.js, Express.js
- **Database:** MongoDB Atlas with Mongoose ORM
- **Task Scheduling:** Node-Cron
- **Security:** JSON Web Tokens (JWT), Bcrypt.js, CORS

### Integrations & Services
- **Text AI:** Google Gemini API
- **Visual AI:** Hugging Face Inference API (FLUX)
- **Social Automation:** Zernio API
- **Media Storage:** Cloudinary
- **Deployment:** Vercel (Frontend), Render (Backend)

---

## System Architecture & Workflow

1. **Authentication:** User authenticates via JWT; sessions are maintained securely.
2. **Account Linking:** Users authenticate social handles, which are linked through Zernio SDK/API.
3. **AI Generation:**
   - **Post Copy:** Users input prompts -> Google Gemini API generates structured text.
   - **Visuals:** Prompt text triggers Hugging Face FLUX model to generate images, which are immediately processed and cached on Cloudinary.
4. **Scheduling & Execution:** Posts scheduled by users are queued in MongoDB. Node-Cron periodically checks and triggers the Zernio API to publish live content.

---

## Environment Variables

Create a `.env` file in the `server/` root directory with the following variables:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173

# AI & Media Services
GEMINI_API_KEY=your_gemini_api_key
HF_TOKEN=your_huggingface_api_token
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Social Automation
ZERNIO_API_KEY=your_zernio_api_key

```markdown
## 👨‍💻 Author

[![GitHub](https://img.shields.io/badge/GitHub-mrsheraz33-181717?style=for-the-badge&logo=github)](https://github.com/mrsheraz33)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Muhammad%20Sheraz-0077B5?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/muhammad-sheraz-858612385/)

**Muhammad Sheraz**  
Full Stack AI Engineer