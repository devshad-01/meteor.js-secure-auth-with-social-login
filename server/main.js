import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';




Meteor.startup(async () => {
  // Configure Accounts
  Accounts.config({
    sendVerificationEmail: true,
    forbidClientAccountCreation: false,
    loginExpirationInDays: 30,
  });

  // Configure email verification
  Accounts.emailTemplates.siteName = 'Your App Name';
  Accounts.emailTemplates.from = 'Your App <noreply@yourapp.com>';

  // Add validation for new users
  Accounts.validateNewUser((user) => {
    // Ensure user has an email
    if (!user.emails || user.emails.length === 0) {
      throw new Meteor.Error(403, 'User must have an email');
    }

    // Validate email format
    const email = user.emails[0].address;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Meteor.Error(403, 'Invalid email format');
    }

    return true;
  });

  // Rate limit login attempts
  DDPRateLimiter.addRule({
    name: 'login',
    type: 'method',
    connectionId() { return true; }
  }, 5, 60000); // 5 attempts per minute

  // Rate limit account creation
  DDPRateLimiter.addRule({
    name: 'createUser',
    type: 'method',
    connectionId() { return true; }
  }, 3, 60000); // 3 attempts per minute

  // Publish user data (only the current user's data)
  Meteor.publish("userData", function () {
    if (this.userId) {
      return Meteor.users.find({_id: this.userId}, {
        fields: {
          username: 1,
          emails: 1,
          createdAt: 1,
          profile: 1
        }
      });
    } else {
      this.ready();
    }
  });
});
