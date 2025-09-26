const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');
const path = require('path');
require('dotenv').config();

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (CSS, JS, images, etc.)
app.use(express.static('.', {
    setHeaders: (res, path) => {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        } else if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
    }
}));

// Serve CSS and JS files explicitly
app.get('/styles.css', (req, res) => {
    res.setHeader('Content-Type', 'text/css');
    res.sendFile(path.join(__dirname, 'styles.css'));
});

app.get('/script.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile(path.join(__dirname, 'script.js'));
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Catch-all handler for any other routes (SPA routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint for signup form
app.post('/api/send-signup-email', async (req, res) => {
    try {
        const { to, subject, html, teamData } = req.body;
        
        // Send email to organizer
        const organizerEmail = await resend.emails.send({
            from: 'Around the Clock Run <noreply@aroundtheclockrun.nl>',
            to: [to],
            subject: subject,
            html: html
        });
        
        // Send confirmation email to team captain
        const confirmationEmail = await resend.emails.send({
            from: 'Around the Clock Run <noreply@aroundtheclockrun.nl>',
            to: [teamData.email],
            subject: 'Registration Confirmation - Around the Clock Run',
            html: generateConfirmationEmailHTML(teamData)
        });
        
        res.json({ 
            success: true, 
            message: 'Registration submitted successfully!',
            organizerEmailId: organizerEmail.data?.id,
            confirmationEmailId: confirmationEmail.data?.id
        });
    } catch (error) {
        console.error('Error sending signup email:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send registration email' 
        });
    }
});

// API endpoint for contact form
app.post('/api/send-contact-email', async (req, res) => {
    try {
        const { to, subject, html, contactData } = req.body;
        
        // Send email to organizer
        const organizerEmail = await resend.emails.send({
            from: 'Around the Clock Run <noreply@aroundtheclockrun.nl>',
            to: [to],
            subject: subject,
            html: html
        });
        
        // Send auto-reply to contact form submitter
        const autoReplyEmail = await resend.emails.send({
            from: 'Around the Clock Run <noreply@aroundtheclockrun.nl>',
            to: [contactData.email],
            subject: 'Thank you for contacting Around the Clock Run',
            html: generateAutoReplyEmailHTML(contactData)
        });
        
        res.json({ 
            success: true, 
            message: 'Message sent successfully!',
            organizerEmailId: organizerEmail.data?.id,
            autoReplyEmailId: autoReplyEmail.data?.id
        });
    } catch (error) {
        console.error('Error sending contact email:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send contact email' 
        });
    }
});

// Generate confirmation email HTML for team registration
function generateConfirmationEmailHTML(teamData) {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc;">
            <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #2563eb; margin-bottom: 10px;">🏃‍♂️ Around the Clock Run</h1>
                    <h2 style="color: #1e293b; font-size: 1.5rem; margin-bottom: 20px;">Registration Confirmed!</h2>
                </div>
                
                <div style="background: #e0f2fe; padding: 20px; border-radius: 10px; margin-bottom: 25px;">
                    <h3 style="color: #0369a1; margin-bottom: 15px;">🎉 Welcome to the Team!</h3>
                    <p style="color: #0369a1; margin: 0; line-height: 1.6;">
                        Thank you for registering <strong>${teamData.teamName}</strong> for the Around the Clock Run! 
                        We're excited to have you join us for this incredible 24-hour relay challenge supporting NCFS.
                    </p>
                </div>
                
                <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin-bottom: 25px;">
                    <h3 style="color: #1e293b; margin-bottom: 15px;">📋 Registration Details</h3>
                    <p><strong>Team Name:</strong> ${teamData.teamName}</p>
                    <p><strong>Team Captain:</strong> ${teamData.teamCaptain}</p>
                    <p><strong>Team Size:</strong> ${teamData.teamSize} runners</p>
                    <p><strong>Email:</strong> ${teamData.email}</p>
                </div>
                
                <div style="background: #f0fdf4; padding: 20px; border-radius: 10px; margin-bottom: 25px;">
                    <h3 style="color: #166534; margin-bottom: 15px;">📅 What's Next?</h3>
                    <ul style="color: #166534; margin: 0; padding-left: 20px;">
                        <li>We'll contact you soon with event details and final schedule</li>
                        <li>Start planning your team's fundraising strategy</li>
                        <li>Prepare your camping gear and running equipment</li>
                        <li>Stay tuned for updates and training tips</li>
                    </ul>
                </div>
                
                <div style="background: #fef3c7; padding: 20px; border-radius: 10px; margin-bottom: 25px;">
                    <h3 style="color: #92400e; margin-bottom: 15px;">💝 Fundraising for NCFS</h3>
                    <p style="color: #92400e; margin: 0; line-height: 1.6;">
                        Remember, this event is all about raising funds for the Nederlandse Cystic Fibrosis Stichting (NCFS). 
                        Every euro raised makes a real difference in supporting families affected by Cystic Fibrosis.
                    </p>
                </div>
                
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
                    <p style="color: #64748b; margin: 0;">
                        Questions? Contact us at <a href="mailto:info@aroundtheclockrun.nl" style="color: #2563eb;">info@aroundtheclockrun.nl</a>
                    </p>
                    <p style="color: #64748b; margin: 10px 0 0 0; font-size: 0.9rem;">
                        Thank you for supporting NCFS! 🏃‍♂️💙
                    </p>
                </div>
            </div>
        </div>
    `;
}

// Generate auto-reply email HTML for contact form
function generateAutoReplyEmailHTML(contactData) {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc;">
            <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #2563eb; margin-bottom: 10px;">🏃‍♂️ Around the Clock Run</h1>
                    <h2 style="color: #1e293b; font-size: 1.5rem; margin-bottom: 20px;">Thank You for Your Message!</h2>
                </div>
                
                <div style="background: #e0f2fe; padding: 20px; border-radius: 10px; margin-bottom: 25px;">
                    <h3 style="color: #0369a1; margin-bottom: 15px;">📧 Message Received</h3>
                    <p style="color: #0369a1; margin: 0; line-height: 1.6;">
                        Hi ${contactData.name},<br><br>
                        Thank you for reaching out to us! We've received your message about "${contactData.subject}" 
                        and will get back to you as soon as possible.
                    </p>
                </div>
                
                <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin-bottom: 25px;">
                    <h3 style="color: #1e293b; margin-bottom: 15px;">⏰ Response Time</h3>
                    <p style="color: #64748b; margin: 0; line-height: 1.6;">
                        We typically respond to inquiries within 24-48 hours. If your question is urgent, 
                        please don't hesitate to call us directly.
                    </p>
                </div>
                
                <div style="background: #f0fdf4; padding: 20px; border-radius: 10px; margin-bottom: 25px;">
                    <h3 style="color: #166534; margin-bottom: 15px;">🏃‍♂️ Ready to Join the Run?</h3>
                    <p style="color: #166534; margin: 0; line-height: 1.6;">
                        If you're interested in participating in the Around the Clock Run, 
                        you can sign up your team directly on our website!
                    </p>
                </div>
                
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
                    <p style="color: #64748b; margin: 0;">
                        Best regards,<br>
                        The Around the Clock Run Team
                    </p>
                    <p style="color: #64748b; margin: 10px 0 0 0; font-size: 0.9rem;">
                        Supporting NCFS - Nederlandse Cystic Fibrosis Stichting 💙
                    </p>
                </div>
            </div>
        </div>
    `;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Around the Clock Run API is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🏃‍♂️ Around the Clock Run server running on port ${PORT}`);
    console.log(`📧 Resend API configured: ${process.env.RESEND_API_KEY ? 'Yes' : 'No (Please set RESEND_API_KEY)'}`);
});
