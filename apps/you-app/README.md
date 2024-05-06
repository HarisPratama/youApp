# About the App

The app utilizes microservices with RabbitMQ. There are two apps: 'chat' and 'you-app.' 'Chat' serves as a service, while 'you-app' is the root app.

# Swagger 
you can open the swagger using this link
- http://localhost:3000/api#/

And i attach the postman collection too if you needed


# Socket.io Client

### Listen to list messages
```javascript
  var socket = io('http://localhost:3000', {
    token: accessToken
  });

  socket.emit('viewMessages', { token: accessToken, loggedInUserId });

  socket.on('viewMessages', function(resp) {
    var messagesList = document.getElementById('messagesList');
    resp.data.data.forEach(message => {
      var li = document.createElement('li');
      var link = document.createElement('a');
      link.textContent = `${message.user.name}: ${message.messages[0].message}`;
  
      link.href = `detail.html?receiverId=${message.user._id}`;
      
      li.appendChild(link);
      messagesList.appendChild(li);
    });
  });
```

### Listen to detail of message

```javascript
  var socket = io('http://localhost:3000', {
      token: accessToken, 
  });

  socket.emit('viewDetailsMessage', { token: accessToken, receiverId });

  socket.on('viewDetailsMessage', function(resp) {
      var messagesList = document.getElementById('messagesList');
      resp.data.messages.forEach(message => {
          var li = document.createElement('li');
          li.textContent = message.message;

          if(message.senderId == loggedInUser) li.style.marginLeft = '100px'
      
          messagesList.appendChild(li);
      });
  });
```

