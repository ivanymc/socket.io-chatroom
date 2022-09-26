import Message from '../models/Message.js';


const saveMsg = (req, res) => {
  const msg = new Message(req.body);
  msg.save()
    .then( result => res.send("hello"))
    .catch( err => console.log(err));
};

const displayAllMsg = (req, res) => {
  Message.find().sort( { createdAt: 0 } )
    .then( result => res.send(result))
    .catch( err => console.log(err));
};
 


export {
  saveMsg,
  displayAllMsg
}