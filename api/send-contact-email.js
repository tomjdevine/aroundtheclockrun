const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

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

// Generate HTML for contact email
function generateContactEmailHTML(data) {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">New Contact Form Submission</h2>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <p><strong>Name:</strong> ${data.name}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Subject:</strong> ${data.subject}</p>
            </div>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h3 style="color: #1e293b; margin-bottom: 15px;">Message</h3>
                <p style="white-space: pre-line;">${data.message}</p>
            </div>
        </div>
    `;
}

module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

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
};
