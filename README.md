# Around the Clock Run - 24 Hour Relay Fundraiser

A website for the Around the Clock Run, a 24-hour team relay run fundraiser supporting the Nederlandse Cystic Fibrosis Stichting (NCFS).

## 🏃‍♂️ About the Event

This is a 24-hour team relay run around a 400m athletics track to raise money for NCFS. Teams of 4-6 runners take turns running while the rest of the team camps next to the track. The event includes prizes for the highest fundraising teams and teams with the most distance covered.

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Resend API key (for email functionality)

### Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp env.example .env
   ```
   
4. Edit the `.env` file with your configuration:
   - Get a Resend API key from [resend.com](https://resend.com/api-keys)
   - Set your `RESEND_API_KEY`
   - Update email addresses as needed

### Running the Application

#### Development Mode
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

The website will be available at `http://localhost:3000`

## 📧 Email Integration

The website uses Resend for email functionality:

- **Team Registration**: When teams sign up, emails are sent to both the organizer and the team captain
- **Contact Form**: Contact form submissions are sent to the organizer with auto-replies to the sender

### Setting up Resend

1. Sign up at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Add it to your `.env` file
4. Configure your domain (optional, for custom "from" addresses)

## 🎨 Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean, professional design with smooth animations
- **Team Registration**: Comprehensive signup form with validation
- **Contact Form**: Easy way for visitors to get in touch
- **FAQ Section**: Interactive accordion with common questions
- **Email Integration**: Automated emails using Resend
- **Smooth Scrolling**: Enhanced navigation experience

## 📱 Pages & Sections

- **Hero Section**: Eye-catching introduction with key stats
- **About**: Event description and NCFS information
- **Event Details**: Rules, guidelines, and important information
- **Team Registration**: Comprehensive signup form
- **FAQ**: Frequently asked questions
- **Contact**: Contact form and organizer information

## 🛠️ Customization

### Styling
- Edit `styles.css` to customize colors, fonts, and layout
- The design uses CSS custom properties for easy theming
- Responsive breakpoints are defined for mobile optimization

### Content
- Update `index.html` to modify text content
- Change contact information, event details, and FAQ content
- Customize the hero section and call-to-action buttons

### Email Templates
- Modify email templates in `server.js`
- Customize the confirmation and auto-reply emails
- Update sender information and branding

## 🚀 Deployment

### Option 1: Simple Hosting
1. Upload all files to your web hosting service
2. Set up a Node.js environment
3. Configure environment variables
4. Start the server

### Option 2: Vercel/Netlify
1. Connect your repository to Vercel or Netlify
2. Set environment variables in the dashboard
3. Deploy automatically on git push

### Option 3: Docker
Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 📞 Support

For questions about the website or event:
- Email: info@aroundtheclockrun.nl
- Check the FAQ section on the website

## 🤝 Contributing

This is a charity event website. If you'd like to contribute improvements:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is created for the Around the Clock Run charity event. All rights reserved.

---

**Supporting NCFS - Nederlandse Cystic Fibrosis Stichting** 💙

*Every step counts in the fight against Cystic Fibrosis*
