const emailTemplates = {
  // Student Registration Confirmation
  studentRegistration: (studentName, matricNumber, department, email, loginUrl) => {
    return {
      subject: 'SUG Election Registration Confirmation - University of Medical and Applied Sciences',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1a237e 0%, #0d47a1 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: #ffffff; margin: 0;">SUG Electoral Commission</h1>
            <p style="color: #ff6f00; margin: 5px 0 0 0;">University of Medical and Applied Sciences, Igbo-Eno</p>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1a237e; margin-top: 0;">Dear ${studentName},</h2>
            
            <p>Your registration for the SUG Electronic Voting System has been confirmed.</p>
            
            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #0d47a1; margin-top: 0;">Your Details:</h3>
              <ul style="color: #333; line-height: 1.6;">
                <li><strong>Matriculation Number:</strong> ${matricNumber}</li>
                <li><strong>Department:</strong> ${department}</li>
                <li><strong>Email:</strong> ${email}</li>
              </ul>
            </div>
            
            <p>Please login to the system to complete your profile and prepare for voting.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${loginUrl}" style="background: #ff6f00; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Login to Voting System
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              Best regards,<br>
              <strong>SUG Electoral Commission</strong><br>
              University of Medical and Applied Sciences, Igbo-Eno
            </p>
          </div>
          
          <div style="text-align: center; color: #888; font-size: 12px; margin-top: 20px;">
            <p>© 2026 SUG Electoral Commission - University of Medical and Applied Sciences, Igbo-Eno</p>
          </div>
        </div>
      `
    };
  },

  // Candidate Registration Confirmation
  candidateRegistration: (candidateName, position, matricNumber, department) => {
    return {
      subject: 'SUG Candidate Registration Confirmation - University of Medical and Applied Sciences',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1a237e 0%, #0d47a1 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: #ffffff; margin: 0;">SUG Electoral Commission</h1>
            <p style="color: #ff6f00; margin: 5px 0 0 0;">University of Medical and Applied Sciences, Igbo-Eno</p>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1a237e; margin-top: 0;">Dear ${candidateName},</h2>
            
            <p>Your candidacy registration for the SUG Elections has been received and is pending approval.</p>
            
            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #0d47a1; margin-top: 0;">Candidacy Details:</h3>
              <ul style="color: #333; line-height: 1.6;">
                <li><strong>Position:</strong> ${position}</li>
                <li><strong>Matriculation Number:</strong> ${matricNumber}</li>
                <li><strong>Department:</strong> ${department}</li>
              </ul>
            </div>
            
            <p>Your registration will be reviewed by the SUG Electoral Commission. You will be notified once your candidacy is approved.</p>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              Best regards,<br>
              <strong>SUG Electoral Commission</strong><br>
              University of Medical and Applied Sciences, Igbo-Eno
            </p>
          </div>
          
          <div style="text-align: center; color: #888; font-size: 12px; margin-top: 20px;">
            <p>© 2026 SUG Electoral Commission - University of Medical and Applied Sciences, Igbo-Eno</p>
          </div>
        </div>
      `
    };
  },

  // Vote Confirmation
  voteConfirmation: (studentName, candidateName, position) => {
    return {
      subject: 'Vote Confirmation - SUG Elections 2026',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1a237e 0%, #0d47a1 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: #ffffff; margin: 0;">SUG Electoral Commission</h1>
            <p style="color: #ff6f00; margin: 5px 0 0 0;">University of Medical and Applied Sciences, Igbo-Eno</p>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1a237e; margin-top: 0;">Dear ${studentName},</h2>
            
            <p>Your vote has been successfully cast in the SUG Elections 2026.</p>
            
            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #0d47a1; margin-top: 0;">Vote Details:</h3>
              <ul style="color: #333; line-height: 1.6;">
                <li><strong>Candidate:</strong> ${candidateName}</li>
                <li><strong>Position:</strong> ${position}</li>
                <li><strong>Timestamp:</strong> ${new Date().toLocaleString()}</li>
              </ul>
            </div>
            
            <p>This confirmation serves as your receipt. Your vote has been securely recorded and will be counted in the official results.</p>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              Best regards,<br>
              <strong>SUG Electoral Commission</strong><br>
              University of Medical and Applied Sciences, Igbo-Eno
            </p>
          </div>
          
          <div style="text-align: center; color: #888; font-size: 12px; margin-top: 20px;">
            <p>© 2026 SUG Electoral Commission - University of Medical and Applied Sciences, Igbo-Eno</p>
          </div>
        </div>
      `
    };
  },

  // SMS Template for verification code
  smsVerification: (verificationCode, votingUrl) => {
    return `SUG Election: Your verification code is ${verificationCode}. Visit ${votingUrl} to vote. Valid for 15 minutes. - SUG Electoral Commission, UMAS`;
  },

  // SMS Template for vote confirmation
  smsVoteConfirmation: (candidateName, position) => {
    return `SUG Election: Your vote for ${candidateName} (${position}) has been successfully recorded. Thank you for participating. - SUG Electoral Commission, UMAS`;
  }
};

module.exports = emailTemplates;