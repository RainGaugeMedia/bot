import { Bot } from './bot.class';
import { mapStore } from './map-store/map-store.const';

mapStore.addMap(`++++++++++++++++++++++...\n+@..................$....\n++++++++++++++++++++++...`);
mapStore.addMap(`++++++++++++++++++++++++++++++++++++++++++
+@.......................................+
+++++++++++++++++++.++++++++++++++++++++++
                  +.+
                  +.+
                  +.+
                  +.+
                  +.+
                  +.++++++++++++++++++++++
                  +.....................$+
                  ++++++++++++++++++++++++`);

const bot: Bot = new Bot(mapStore.getMap(0));

// MOVE TO TARGET
console.log('Starting position: ' + bot.getCurrentPosition());
console.log('Moving to target...');
for (let i = 0; i < 25 - 1; i++) {
  bot.moveForward();
  if (bot.isAtTarget()) break;
}
console.log('Target acquired: ' + bot.getCurrentPosition()); // HERE IS THE TARGET

// MOVE INTO WALL
console.log('Turning once...');
bot.turnRight();
console.log('New position: ' + bot.getCurrentPosition()); // STILL AT THE TARGET
console.log('Moving forward...');
bot.moveForward();
console.log('Wall hit, restart: ' + bot.getCurrentPosition()); // NOW START OVER

console.log('\n\nChanging to `t` map.');
bot.useMap(mapStore.getMap(1));
console.log('Starting position: ' + bot.getCurrentPosition());
console.log('Moving to position 19...');
for (let i = 0; i < 19 - 1; i++) {
  bot.moveForward();
}
console.log('Turning once: ');
bot.turnRight();
console.log('Moving down by 8...');
for (let i = 0; i < 9 - 1; i++) {
  bot.moveForward();
}
console.log('Turning thrice to return to right facing...');
bot.turnRight();
bot.turnRight();
bot.turnRight();
console.log('Moving right by 21...');
for (let i = 0; i < 22 - 1; i++) {
  bot.moveForward();
  if (bot.isAtTarget()) break;
}
console.log('Target acquired: ' + bot.getCurrentPosition()); // HERE IS THE TARGET
console.log('Perhaps another step?');
bot.moveForward();
console.log('Game over, restart: ' + bot.getCurrentPosition()); // NOW START OVER
