# 🦷 BrightSmile Dental Care

A modern, fully responsive dental clinic website built with React, Tailwind CSS and Framer Motion — designed as a real-world, deployable template for dental practices.

**🔗 Live Demo:** [medi-care-healthcare-website.vercel.app](https://medi-care-healthcare-website.vercel.app/)

---

## ✨ Features

- **Animated hero section** with a decorative tooth-pattern background and floating trust badges
- **Interactive Before/After slider** — drag to compare treatment results
- **"Book in 3 Steps" process section** for clear appointment flow
- **Dentist directory** with search, specialty filters and sort (rating, fee, experience)
- **Services showcase** covering whitening, braces, root canal, implants, kids dentistry and more
- **FAQ accordion** answering common patient questions
- **Appointment booking form** with instant confirmation state
- **Real Google Maps embed** for clinic location
- **Sticky WhatsApp chat button** for instant patient contact
- **Payment & insurance strip** (Cash, Easypaisa, JazzCash, Card, Insurance)
- **Per-page SEO** — dynamic document titles & meta descriptions
- Fully responsive — optimized for mobile, tablet and desktop

## 🛠️ Tech Stack

- **React** (Vite)
- **Tailwind CSS** — utility-first styling
- **Framer Motion** — animations and transitions
- **React Router** — client-side routing
- **Lucide React** — icon set
- **React Hot Toast** — notifications

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   └── WhatsAppButton.jsx
├── pages/
│   ├── Home.jsx
│   ├── Services.jsx
│   ├── Doctors.jsx
│   └── Contact.jsx
├── hooks/
│   └── useDocumentTitle.js
└── App.jsx

public/
├── hero.jpg
└── yellow.jpg
```

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/mehreencodes/MediCare-Healthcare-Website.git

# Navigate into the project
cd MediCare-Healthcare-Website

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be running at `http://localhost:5173`.

## ⚙️ Configuration

Before deploying for a real clinic, update the following:

- **WhatsApp number** — `src/components/WhatsAppButton.jsx`
- **Phone numbers** — `Navbar.jsx`, `Footer.jsx`, `Contact.jsx`, `Home.jsx`
- **Clinic address & map location** — `src/pages/Contact.jsx`
- **Social media links** — `src/components/Footer.jsx`
- **Hero & before/after images** — `public/` folder

## 📄 License

This project is available for personal and commercial use. Feel free to customize it for your own dental practice or client projects.

---

Built with ❤️ for modern dental practices.
