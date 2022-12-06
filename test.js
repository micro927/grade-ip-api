import { createHash } from 'crypto'

const deliverIdNew = createHash('md5')
    .update(`deliver ssssssssssssssssssssssssssssssssssssssss`)
    .digest('hex');
console.log(deliverIdNew);
d40889a8b1ee74589feecbc349db733a