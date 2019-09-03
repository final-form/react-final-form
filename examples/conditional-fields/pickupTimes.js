// This is not the best way to do this. Don't think to hard about this.
const now = new Date();
let hours = now.getHours();
const times = [];
if (now.getMinutes() < 30) {
  times.push(`${++hours}:30`);
} else {
  hours++;
}
while (times.length < 6) {
  times.push(`${hours}:00`);
  times.push(`${hours}:30`);
  hours = (hours + 1) % 24;
}
export default times;
