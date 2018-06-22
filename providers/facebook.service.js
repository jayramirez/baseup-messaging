const request = require('request');

const baseupServ = require('./baseup.service');
const facebookConst = require('../settings/facebook.constants');

module.exports = {
   sendDone: sendDone,
   sendLogin: sendLogin,
   callSendAPI: callSendAPI,
   sendTypingOn: sendTypingOn,
   sendPartners: sendPartners,
   sendTypingOff: sendTypingOff,
   sendNoFeature: sendNoFeature,
   sendReadReceipt: sendReadReceipt,
   sendWelcomeMessage: sendWelcomeMessage,
   sendMainQuickReply: sendMainQuickReply
};

function sendWelcomeMessage(recipientId, fullname) {
   // sendTypingOn(recipientId);
   const messageData = {
      recipient: {
         id: recipientId
      },
      message: {
         text: `Welcome ${fullname}! Thank You for linking me to your Base Up Account. For your concerns, choose a button below:`,
         quick_replies: [{
               content_type: 'text',
               title: 'FAQs',
               payload: 'FAQ'
            },
            {
               content_type: 'text',
               title: 'Check Partners',
               payload: 'CHECK_PARTNERS'
            },
            {
               content_type: 'text',
               title: 'Other Concerns',
               payload: 'OTHER_CONCERNS'
            }
         ]
      }
   };

   callSendAPI(messageData);
   setTimeout(() => {
      sendTypingOff(recipientId);
      sendReadReceipt(recipientId);
   }, 2000);
}

function sendLogin(recipientId) {
   // sendTypingOn(recipientId);
   getCustomerName(recipientId).then(fullName => {
      const messageData = {
         recipient: {
            id: recipientId
         },
         message: {
            attachment: {
               type: 'template',
               payload: {
                  template_type: 'button',
                  text: `Hi. ${fullName}, please login to your Base Up Account to continue the subscription. If you don't have a Base Up account, you can just Login with Facebook through our app.`,
                  buttons: [{
                     type: 'account_link',
                     url: 'https://staging.baseup.me/messenger-login'
                  }]
               }
            }
         }
      };

      callSendAPI(messageData);
      setTimeout(() => {
         sendTypingOff(recipientId);
         sendReadReceipt(recipientId);
      }, 2000);
   });
}

function sendPartners(recipientId) {
   // sendTypingOn(recipientId);
   getCustomerName(recipientId).then(fullName => {
      const messageData = {
         recipient: {
            id: recipientId
         },
         message: {
            attachment: {
               type: 'template',
               payload: {
                  template_type: 'generic',
                  elements: [{
                     title: 'Felipe and Sons!',
                     subtitle: 'Barberdashery',
                     image_url: 'https://staging.baseup.me/assets/img/home/partners_messenger/felipe.png',
                     default_action: {
                        type: 'web_url',
                        url: 'http://felipeandsons.com/',
                        messenger_extensions: false,
                        webview_height_ratio: 'full',
                     },
                     buttons: [{
                        type: 'web_url',
                        url: 'http://felipeandsons.com/',
                        title: 'View Website'
                     }]
                  }, {
                     title: 'TUF',
                     image_url: 'https://staging.baseup.me/assets/img/home/partners_messenger/tuf.png',
                     default_action: {
                        type: 'web_url',
                        url: 'http://tufbarbershop.ph/',
                        messenger_extensions: false,
                        webview_height_ratio: 'full',
                     },
                     buttons: [{
                        type: 'web_url',
                        url: 'http://tufbarbershop.ph/',
                        title: 'View Website'
                     }]
                  }]
               }
            }
         }
      };

      callSendAPI(messageData);
      setTimeout(() => {
         sendTypingOff(recipientId);
         sendReadReceipt(recipientId);
      }, 2000);
   });
}

function sendNoFeature(recipientId) {
   // sendTypingOn(recipientId);
   getCustomerName(recipientId).then(fullName => {
      const messageData = {
         recipient: {
            id: recipientId
         },
         message: {
            text: `${fullName}, This feature is not yet available right now. But it will be available soon! What else can i do for you?`,
            quick_replies: [{
                  content_type: 'text',
                  title: 'FAQs',
                  payload: 'FAQ'
               },
               {
                  content_type: 'text',
                  title: 'Check Partners',
                  payload: 'CHECK_PARTNERS'
               }, {
                  content_type: 'text',
                  title: 'I\'\m good for now!',
                  payload: 'DONE'
               }
            ]
         }
      };

      callSendAPI(messageData);
      setTimeout(() => {
         sendTypingOff(recipientId);
         sendReadReceipt(recipientId);
      }, 2000);
   });
}

function sendDone(recipientId) {
   // sendTypingOn(recipientId);
   getCustomerName(recipientId).then(fullName => {
      const messageData = {
         recipient: {
            id: recipientId
         },
         message: {
            text: `Always happy to serve you. Hope you have a great day ${fullName}`
         }
      };

      callSendAPI(messageData);
      setTimeout(() => {
         sendTypingOff(recipientId);
         sendReadReceipt(recipientId);
      }, 2000);
   });
}

function sendMainQuickReply(recipientId) {
   // sendTypingOn(recipientId);
   getCustomerName(recipientId).then(fullName => {
      const messageData = {
         recipient: {
            id: recipientId
         },
         message: {
            text: `Hi. ${fullName} I'm BotBot, BaseUp 's automated assistant. I'm here to help. For your concerns, choose a button below:`,
            quick_replies: [{
                  content_type: 'text',
                  title: 'FAQs',
                  payload: 'FAQ'
               },
               {
                  content_type: 'text',
                  title: 'Check Partners',
                  payload: 'CHECK_PARTNERS'
               }
            ]
         }
      };

      callSendAPI(messageData);
      setTimeout(() => {
         sendTypingOff(recipientId);
         sendReadReceipt(recipientId);
      }, 2000);
   });
}

function getCustomerName(recipientId) {
   return new Promise((resolve, reject) => {
      request({
         uri: 'https://graph.facebook.com/v2.9/' + recipientId,
         qs: {
            access_token: facebookConst.PAGE_ACCESS_TOKEN,
            fields: 'first_name,last_name'
         },
         method: 'GET',
      }, (error, response, body) => {
         if (!error && response.statusCode == 200) {
            const firstName = JSON.parse(body).first_name;
            const lastName = JSON.parse(body).last_name;
            const fullName = (firstName + ' ' + lastName);
            resolve(fullName);
         } else {
            console.error('Failed calling Send API', response.statusCode, response.statusMessage, body.error);
         }
      });
   });
}

function notifyHumanOperators(recipientId) {
   request({
      uri: 'https://graph.facebook.com/v2.9/' + recipientId,
      qs: {
         access_token: facebookConst.PAGE_ACCESS_TOKEN,
         fields: 'first_name,last_name'
      },
      method: 'GET',
   }, (error, response, body) => {
      if (!error && response.statusCode == 200) {
         const firstName = JSON.parse(body).first_name;
         const lastName = JSON.parse(body).last_name;
         const fullName = (firstName + ' ' + lastName);
         // firebase.database().ref('agents').once('value', (snapshot) => {
         //    snapshot.forEach((childSnapshot) => {
         //       const currentKey = childSnapshot.key;
         //       sendTextMessage(currentKey, fullName + ' ' + USER_NOTIFICATION_TO_AGENT);
         //    });
         // });
      } else {
         console.error('Failed calling Send API', response.statusCode, response.statusMessage, body.error);
      }
   });
}

function sendReadReceipt(recipientId) {
   const messageData = {
      recipient: {
         id: recipientId
      },
      sender_action: 'mark_seen'
   };

   callSendAPI(messageData);
}

function sendTypingOn(recipientId) {
   const messageData = {
      recipient: {
         id: recipientId
      },
      sender_action: 'typing_on'
   };

   callSendAPI(messageData);
}

function sendTypingOff(recipientId) {
   const messageData = {
      recipient: {
         id: recipientId
      },
      sender_action: 'typing_off'
   };

   callSendAPI(messageData);
}

function callSendAPI(messageData) {
   request({
      uri: 'https://graph.facebook.com/v2.9/me/messages',
      qs: {
         access_token: facebookConst.PAGE_ACCESS_TOKEN
      },
      method: 'POST',
      json: messageData

   }, (error, response, body) => {
      if (!error && response.statusCode == 200) {
         const recipientId = body.recipient_id;
         const messageId = body.message_id;

         // if (messageId) {
         //    console.log('Successfully sent message with id %s to recipient %s',
         //       messageId, recipientId);
         // } else {
         //    console.log('Successfully called Send API for recipient %s',
         //       recipientId);
         // }
      } else {
         console.error('Failed calling Send API', response.statusCode, response.statusMessage, body.error);
      }
   });
}