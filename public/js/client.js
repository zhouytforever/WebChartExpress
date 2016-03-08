$(function(){
	(function () {
		var d = document,
			w = window;


		w.CHAT = {
			username:null,
			socket:null,
			//退出
			logout:function(){
				this.socket.emit('logout', {username:this.username});
				w.location.reload();
			},
			//提交聊天消息内容
			submit:function(){
				var content = d.getElementById("content").value;
				if(content != ''){
					var obj = {
						username: this.username,
						content: content
					};
						this.socket.emit('message', obj);
					d.getElementById("content").value = '';
				}
				return false;
			},
			//更新系统消息，本例中在用户加入、退出的时候调用
			updateSysMsg:function(o, action){
				//当前在线用户列表
				var onlineUsers = o.onlineUsers;
				//新加入用户的信息
				var user = o.user;
				if(action == 'login' && user.username == this.username){//如果是自己登录了，则更新在线列表
					for(var i= 0,len = onlineUsers.length;i<len;i++){
						$("#onlineUsers").append('<li id="'+onlineUsers[i]+'"><a href="#">'+onlineUsers[i]+'</a></li>');
					}
				}else if(action == 'login'){//如果是别人登录了，则添加一个
					$("#onlineUsers").append('<li id="'+user.username+'"><a href="#">'+user.username+'</a></li>');
				}else if(action == 'logout'){
					$('#'+user.username).remove();
				}
				//添加系统消息
				var content = (action == 'login') ? user.username+'&nbsp;&nbsp;&nbsp;&nbsp;加入了聊天室' : user.username+'&nbsp;&nbsp;&nbsp;&nbsp;退出了聊天室';
				addContent({content:content,username:'system'});
			},
			//第一个界面用户提交用户名
			usernameSubmit:function(){
				var username = d.getElementById("username").value;
				if(username != ""){
					d.getElementById("username").value = '';
					this.init(username);
				}
				return false;
			},
			init:function(username){
				this.username = username;

				$("#currentUser").html(this.username);

				//连接websocket后端服务器
				this.socket = io.connect('ws://localhost:3000');

				//告诉服务器端有用户登录
				this.socket.emit('login', {username:this.username});

				//监听新用户登录
				this.socket.on('login', function(o){
					CHAT.updateSysMsg(o, 'login');
				});

				//监听用户退出
				this.socket.on('logout', function(o){
					CHAT.updateSysMsg(o, 'logout');
				});

				//监听消息发送
				this.socket.on('message', function(obj){
					//var isme = (obj.username == CHAT.username) ? true : false;
					addContent(obj);
				});

			}
		};
		//通过“回车”提交用户名
		d.getElementById("username").onkeydown = function(e) {
			e = e || event;
			if (e.keyCode === 13) {
				CHAT.usernameSubmit();
			}
		};
		//通过“回车”提交信息
		d.getElementById("content").onkeydown = function(e) {
			e = e || event;
			if (e.keyCode === 13) {
				CHAT.submit();
			}
		};
	})();

});

$("#username").keydown(function(e){
    e = e || event;
    if (e.keyCode === 13) {
		CHAT.usernameSubmit();
        $("#loginbox").hide();
        $("#chatbox").show();
    }
});


//添加说话内容（包括网友和系统）
function addContent(obj){
	var username= '<span class="userLabel">'+obj.username+'</span>';
	var content = '<div class="content"><p class="userContent">'+obj.content+'</p></div>';
	//var username = '<spand class="badge badge-info">'+obj.username+'</spand>';
	$("#contentSaid").prepend('<div>'+username + content +'</div>');
}

//是否存在此用户
function existsUser(username){
	for(var i= 0,len=onlineUsers.length;i<len;i++){
		if(onlineUsers[i] == username)
			return true;
	}
	return false;
}