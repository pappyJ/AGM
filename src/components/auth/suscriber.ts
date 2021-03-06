// import Email from '../../libraries/shared/utils/Email';
// import { Logger } from 'winston';

// declare let _logger: Logger;

// /**
//  *
//  * @description subScribes for user Feature
//  */

// const authEvents = (eventEmitter: any) => {
//     eventEmitter.on(
//         'Send Welcome Verification Mail',
//         async ({ user, result }: { [unit: string]: any }) => {
//             try {
//                 new Email({
//                     email: user.email,
//                     firstName: user.firstName,
//                 });
//             } catch (error) {
//                 _logger.error(`Error While Sending Mail => ${error}`);

//                 return result.success;
//             }

//             _logger.info(
//                 `✅✅✅ ➡ Welcome Mail Successfully Sent To = ${user.email}`
//             );

//             result.success = true;
//         }
//     );

//     return eventEmitter;
// };

// module.exports = authEvents;
