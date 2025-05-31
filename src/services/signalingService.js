// // src/services/signalingService.js
// import io from 'socket.io-client';

// const socket = io('http://localhost:3001');

// const signalingService = {
//   connect: () => {
//     console.log('Connecting to signaling server...');
//     return socket;
//   },
  
//   init: (onOffer, onAnswer, onIceCandidate) => {
//     console.log('Initializing signal handlers...');
//     socket.on('offer', onOffer);
//     socket.on('answer', onAnswer);
//     socket.on('ice-candidate', onIceCandidate);
//   },
  
//   sendOffer: ({ offer, roomId }) => {
//     console.log('Sending offer for room:', roomId);
//     socket.emit('offer', { offer, roomId });
//   },
  
//   sendAnswer: ({ answer, roomId }) => {
//     console.log('Sending answer for room:', roomId);
//     socket.emit('answer', { answer, roomId });
//   },
  
//   sendIceCandidate: ({ candidate, roomId }) => {
//     console.log('Sending ICE candidate for room:', roomId);
//     socket.emit('ice-candidate', { candidate, roomId });
//   },

//   joinRoom: (roomId) => {
//     console.log('Joining room:', roomId);
//     socket.emit('join-room', roomId);
//   },

//   disconnect: () => {
//     console.log('Disconnecting socket...');
//     if (socket && socket.connected) {
//       socket.disconnect();
//     }
//   }
// };

// export default signalingService;

// src/services/signalingService.js
import io from 'socket.io-client';

let socket = null;

const signalingService = {
  connect: () => {
    if (!socket) {
      socket = io('http://localhost:3001');
      console.log('New socket connection created');
    }
    return socket;
  },

  init: (onOffer, onAnswer, onIceCandidate) => {
    if (socket) {
      socket.on('offer', onOffer);
      socket.on('answer', onAnswer);
      socket.on('ice-candidate', onIceCandidate);
    }
  },

  sendOffer: ({ offer, roomId }) => {
    if (socket) {
      console.log('Sending offer for room:', roomId);
      socket.emit('offer', { offer, roomId });
    }
  },

  sendAnswer: ({ answer, roomId }) => {
    if (socket) {
      console.log('Sending answer for room:', roomId);
      socket.emit('answer', { answer, roomId });
    }
  },

  sendIceCandidate: ({ candidate, roomId }) => {
    if (socket) {
      console.log('Sending ICE candidate for room:', roomId);
      socket.emit('ice-candidate', { candidate, roomId });
    }
  },

  joinRoom: (roomId) => {
    if (socket) {
      console.log('Joining room:', roomId);
      socket.emit('join-room', roomId);
    }
  },

  disconnect: () => {
    if (socket) {
      console.log('Disconnecting socket...');
      socket.disconnect();
      socket = null;
    }
  }
};

export default signalingService;
