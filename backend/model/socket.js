module.exports = function(io){
	var socketList = {};
	var users = [];

	io.sockets.on('connection',function(socket){
		console.log('[info] one user connected');

    // 加入群聊
		socket.on('join',(name,img) => {
			// init
			socket.name = name;
			socketList[name] = socket.id;
			let user = {name:name,img:img,id:socket.id,tip:false};
			users.push(user);

			socket.broadcast.emit('welcome',name,users);
			socket.emit('myself',name,users,socket.id);
		});

		//接收信息广播
		socket.on('message',data => {
			//广播
			socket.broadcast.emit('sendMsg',data);
		})

		//一对一消息
		socket.on('msg',data => {
			//console.log(data.tid);
			//发送给指定用户
			socket.to(data.tid).emit('sMsg',data);
		})

		socket.on('quit',name => {
      //删除
      delete socketList[name];
      for(var i=0;i<users.length;i++){
        if(users[i].name == name) users.splice(i,1);
      }
      //广播
			socket.broadcast.emit('quit',name,users);
		})
    
		//用户离开
		socket.on('disconnecting',function(){
			if(socketList.hasOwnProperty(socket.name)){
				//删除
				delete socketList[socket.name];
				for(var i=0;i<users.length;i++){
					if(users[i].name == socket.name){
						users.splice(i,1);
					}
				}
				//广播有用户退出
				socket.broadcast.emit('quit',socket.name,users);
			}
		})
	})
}