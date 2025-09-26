const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

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

// Generate HTML for signup email
function generateSignupEmailHTML(data) {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">New Team Registration - Around the Clock Run</h2>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h3 style="color: #1e293b; margin-bottom: 15px;">Team Information</h3>
                <p><strong>Team Name:</strong> ${data.teamName}</p>
                <p><strong>Team Captain:</strong> ${data.teamCaptain}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Phone:</strong> ${data.phone}</p>
                <p><strong>Team Size:</strong> ${data.teamSize} runners</p>
                <p><strong>Accommodation:</strong> ${data.accommodation || 'Not specified'}</p>
            </div>
            
            ${data.teamMembers ? `
            <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h3 style="color: #1e293b; margin-bottom: 15px;">Team Members</h3>
                <p style="white-space: pre-line;">${data.teamMembers}</p>
            </div>
            ` : ''}
            
            ${data.experience ? `
            <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h3 style="color: #1e293b; margin-bottom: 15px;">Running Experience</h3>
                <p style="white-space: pre-line;">${data.experience}</p>
            </div>
            ` : ''}
            
            ${data.fundraising ? `
            <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h3 style="color: #1e293b; margin-bottom: 15px;">Fundraising Plans</h3>
                <p style="white-space: pre-line;">${data.fundraising}</p>
            </div>
            ` : ''}
            
            ${data.additionalInfo ? `
            <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h3 style="color: #1e293b; margin-bottom: 15px;">Additional Information</h3>
                <p style="white-space: pre-line;">${data.additionalInfo}</p>
            </div>
            ` : ''}
            
            <div style="background: #e0f2fe; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; color: #0369a1;"><strong>Next Steps:</strong> Please review this registration and contact the team to confirm participation and provide further details about the event.</p>
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
};
