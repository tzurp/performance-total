export class Plogger {

   info(message: string) {
      console.info(message);
   }

   error(message: string) {
      console.error(`performance-total error: ${message}`);
   }
}