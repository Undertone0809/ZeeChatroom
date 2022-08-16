<template>
	<view>
    <!-- top nav -->
		<view class="status-bar">
      <view class="login-c" @click="navBack">
        <image src="../../static/back.png" class="login-back"></image> 
      </view>

			<scroll-view scroll-x="true" class="scrollv">
				<view class="users">
					<view v-for="(e,index) in users" class="user-l" @tap="otoChat(index)" :key="index">
						<view v-if="e.name!=name">
              <view class="tip" v-if="e.tip"></view>
						  <image :src="'../../static/images/'+e.img+'.png'"></image>
            </view>
					</view>

				</view>
			</scroll-view>
		</view>

    <!-- main -->
		<view class="main">
			<view v-for="(e,index) in chat" :key="index">
				<view class="left msg" v-if="e.id ==1">
					<image :src="'../../static/images/'+e.img+'.png'"></image>
					<view class="nr">
						<view class="neir">
							{{e.neir}}
						</view>
						<view class="nt">{{e.name}} {{timeDetia(e.time)}}</view>
					</view>
				</view>
				<view class="right msg" v-if="e.id==2">
					<image :src="'../../static/images/'+e.img+'.png'"></image>
					<view class="nr">
						<view class="neir">
							{{e.neir}}
						</view>
						<view class="nt">{{timeDetia(e.time)}}</view>
					</view>					
				</view>
				<view class="center" v-if="e.id==3">
					<view class="inner">{{e.name}}</view>				
				</view>
			</view>	
		</view>
		<view class="send">
			<textarea type="text" confirm-type="send" class="chat-send"  v-model="chatm" auto-height="true" show-confirm-bar="false" maxlength="-1" />
			<image src="../../static/send.png" mode="aspectFit" @tap="sendMsg"></image>
		</view>

		<!-- 弹出层一对一聊天 -->
		<view class="modify" :animation="animationData">
			<view class="u-name">
				{{uname}}
			</view>
			<scroll-view class="modfiy-mian" scroll-y="true">
				<view v-for="(e,index) in otochat" :key="index">
					<view class="left msg" v-if="e.fid == fid">
						<image :src="'../../static/images/'+e.img+'.png'"></image>
						<view class="nr">
							<view class="neir">
								{{e.neir}}
							</view>
							<view class="nt">{{timeDetia(e.time)}}</view>
						</view>
					</view>
					<view class="right msg" v-if="e.fid==uid && e.tid == fid">
						<image :src="'../../static/images/'+e.img+'.png'"></image>
						<view class="nr">
							<view class="neir">
								{{e.neir}}
							</view>
							<view class="nt">{{timeDetia(e.time)}}</view>
						</view>					
					</view>
					<view class="center" v-if="e.id==3">
						<view class="inner">{{e.name}}</view>				
					</view>
				</view>	
			</scroll-view>
		</view>
		<view class="bg" @tap="outotoChat" :style="{display:bg}"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				chatm:'',			//消息内容
				name:'',			//用户名称
				uname:'',
				fid:'',
				uid:'a',
				img:'',				//用户头像
				chat:[],			//聊天内容
				member:0,			//成员个数
				animationData: {},
				bb:false,
				bg:'none',
				users:'',
				otochat:[],
        showOtoModal: false,        
			}
		},
		onLoad (e) {
      console.log(`[info] chatroom onload`)
      // 如果没有传参，则返回首页
      if(JSON.stringify(e)=='{}'){
        console.log(`[info] 无传参,回退`)
        uni.redirectTo({ url: '/pages/index/index'})
        return
      }
      
			
      this.name = e.name;
			this.img = e.img;
			// 加入聊天室
      this.join(this.name,this.img);
			// 监听事件
      this.welcome();
			this.myself();
			this.receiveMsg();
			this.getmsg();
			this.listen_quit();
		},
    onShow (){
      console.log(`[info] chatroom onshow`)
      if(this.name == '' || this.name == undefined)
        uni.showModal({
          showCancel: false,
          title: '提示',
          content: '请先登录',
          success: (res) => { if (res.confirm) uni.redirectTo({ url: '/pages/index/index'}) }
        })
    },
    onHide(){
      console.log(`[info] chatroom onhide`)
      // this.socket.emit('quit',this.name);
    },
    onBackPress(){
      if(this.showOtoModal){
        this.outotoChat();
        return true
      }
    },
		methods: {
      navBack(){
        this.socket.emit('quit',this.name);
        uni.navigateBack();
      },
			timeDetia(date){
				var time;
				var d = new Date(date);
				var n = new Date();
				//获取时间戳
				var dd = d.getTime();
				var h = d.getHours();
				var m = d.getMinutes();
				var Y = d.getFullYear();
				var M = d.getMonth() + 1;
				var D = d.getDate();
				//现在时间
				var nn = n.getTime();
				var hh = n.getHours();
				var mm = n.getMinutes();
				var YY = n.getFullYear();
				var MM = n.getMonth() + 1;
				var DD = n.getDate();
				
				if( D == DD && M == MM && Y ==YY){
					if(h<10){
					h = '0'+h;
					}
					if(m<10){
						m = '0'+m;
					}
					time = h+':'+m;
					return time;
				}else if(D+1 == DD && M == MM && Y ==YY){
					if(h<10){
					h = '0'+h;
					}
					if(m<10){
						m = '0'+m;
					}
					time = '昨天'+' '+h+':'+m;
					return time;
				}else{
					if(M<10){
						M = '0'+M;
					}
					if(D<10){
						D = '0'+D;
					}
					if(h<10){
					h = '0'+h;
					}
					if(m<10){
						m = '0'+m;
					}
					time = Y+'年'+M+'月'+D+'日'+' '+h+':'+m;
					return time;
				}
			},
			//发送消息
			sendMsg(){
				if(this.chatm.length>0 && this.fid == ''){
					let onemsg = {
						neir:this.chatm,
						img:this.img,
						time:new Date(),
						id:2,
					}
					let data = {
						neir:this.chatm,
						img:this.img,
						name:this.name,
						time:new Date(),
						id:1,
					}
					this.chat.push(onemsg);
					this.chatm = '';//清空
					this.socket.emit('message',data);
				}else if(this.chatm.length>0 && this.fid != ''){
					//一对一聊天
					let onemsg = {
						neir:this.chatm,
						img:this.img,
						time:new Date(),
						fid:this.uid,
						tid:this.fid,
					}
					let data = {
						neir:this.chatm,
						img:this.img,
						name:this.name,
						time:new Date(),
						fid: this.uid,
						tid: this.fid,
					}
					this.otochat.push(onemsg);
					this.chatm = '';//清空
					this.socket.emit('msg',data);
				}		
			},
			//加入群
			join(name,img){
				this.socket.emit('join',name,img);
			},
			//欢迎加入群
			welcome(){
				//获取即时信息渲染
				this.socket.on('welcome', (name,users) => {
					// console.log(data)
					// console.log('数字'+len)
					//插入欢迎信息
					let wel = {
						name:'欢迎 '+name+' 加入群聊',
						id:3,
					}
					this.chat.push(wel);
					for(var i=0;i<users.length;i++){
						if(users[i].id == this.uid){
							users.splice(i,1);
						}
					}
					this.users = users;
					console.log(`[info] user:${JSON.stringify(this.users)}`)
          this.$forceUpdate()
				})
			},
			//获取自己
			myself(){
				//获取即时信息渲染
				this.socket.on('myself', (name,users,id) => {
					// console.log(data)
					// console.log('数字'+len)
					//插入欢迎信息
					this.uid = id;
					let wel = { name:'欢迎 '+name+' 加入群聊', id:3,}
					this.chat.push(wel);
					for(var i=0;i<users.length;i++){
						if(users[i].id == this.uid){
							users.splice(i,1);
						}
					}
					this.users = users;
					console.log(`[info] my info:${JSON.stringify(this.users)}`)
				})
			},
			//退出群提醒
			listen_quit(){
				//获取即时信息渲染
				this.socket.on('quit', (name,users) => {
					//插入退出信息
					let wel = { name:name+' 退出群聊',id:3}
					this.chat.push(wel);
          //更新用户列表
          this.users = users
          console.log(`[info] one user left ,current user: ${JSON.stringify(users)}`)
				})
			},
			//获取消息
			receiveMsg(){
				//获取即时信息渲染
				this.socket.on('sendMsg', data => {
					this.chat.push(data);
				})
			},
			//获取一对一消息
			getmsg(){
				this.socket.on('sMsg', data => {
					let fid = data.fid;
					if(this.fid !=fid){
						for(var i=0;i<this.users.length;i++){
							if(this.users[i].id == fid){
								this.users[i].tip = true;
							}
						}
					}
					//console.log(data);
					this.otochat.push(data);
				})
			},
			//进入一对一聊天
			otoChat(e){
        console.log(`[info] open oto chat`)
				//获取信息
				this.uname = this.users[e].name;
				this.fid = this.users[e].id;
				this.users[e].tip = false;
        this.showOtoModal = true;
				this.modify();
			},
			//退出一对一聊天
			outotoChat(){
				this.uname = '';
				this.fid = '';
        this.showOtoModal = false;
				this.modify();
			},
			//一对一动画
			modify(){
				this.bb= !this.bb;
				if(this.bb){
					this.bg = 'block';
				}else{
					this.bg = 'none';
				}
				var animation = uni.createAnimation({
				  duration: 400,
				    timingFunction: 'ease',
				})
				 this.animation = animation
				 if(this.bb){
				 	animation.bottom(0).step()
				 				 				  
				 }else{
				 	animation.bottom().step()		  
				 }				
				 this.animationData = animation.export()
			},
		}
	}
</script>

<style lang="scss">
	.status-bar{
		position: fixed;
		left: 0;
		width: 100%;
		height: 88rpx;
		padding-top: var(--status-bar-height);
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		overflow: hidden;
		-webkit-box-pack: justify;
		-webkit-justify-content: space-between;
		justify-content: space-between;
		z-index: 998;
		color: #272832;
		-webkit-transition-property: all;
		transition-property: all;
		background:rgba(255,255,255,0.96);
		.login-c{
			width: 60rpx;
			height: 60rpx;
			padding-top: 22rpx;
			padding-left: 32rpx;
		}
		.login-back{
			width: 20rpx;
			height: 34rpx;
		}
		.scrollv{
			width: 84%;
			.users{
				//background: #eee;
				display: flex;
				.user-l{
					padding: 12rpx 8rpx;
					position: relative;
					image{
						width:64rpx;
						height:64rpx;
						border-radius: 50%;
					}
					.tip{
						width:14rpx;
						height:14rpx;
						background:rgba(255,77,60,1);
						position: absolute;
						top: 12rpx;
						right: 10rpx;
						border-radius: 50%;
						z-index: 10;
					}
				}
				
			}
		}
	}
	.main{
		padding: 160rpx 28rpx 160rpx;
	}
	.main,.modfiy-mian{
	
		.msg{
			display: flex;
			
			align-items:flex-end;
			padding: 40rpx 0;
			image{
				flex: none;
				width:64rpx;
				height:64rpx;
				border-radius:18rpx;
				margin: 0 20rpx;
				
			}
			.nr{
				.neir{
					max-width:380rpx;
					padding:26rpx 32rpx;
					min-height:48rpx;
					font-size:28rpx;
					color:rgba(25,29,35,1);
					line-height:40rpx;
				}
				.nt{
					padding-top: 8rpx;
					position: absolute;
					font-size:24rpx;
					color:rgba(25,29,35,0.5);
					line-height:34rpx;
				}
			}
		}
		.left{
			flex-direction: row;
			.neir{
				background:rgba(244,244,244,1);
				border-radius:24rpx 24rpx 24rpx 0px;
			}
		}
		.right{
			flex-direction: row-reverse;
			.neir{
				background:rgba(255,234,222,1);
				border-radius:24rpx 24rpx 0px 24rpx;
			}
			.nt{
				right: 132rpx;
			}
		}
		.center{
			text-align: center;
			padding: 32rpx 0 20rpx;
			.inner{
				font-size:24rpx;
				display: inline-block;
				color:rgba(25,29,35,0.5);
				line-height:34rpx;
			}
		}
	}
	.send{
		position: fixed;
		z-index: 1002;
		bottom: 0;
		width: 100%;
		
		padding-bottom:var(--status-bar-height);
		min-height: 100rpx;
		background:rgba(255,255,255,0.96);
		display: flex;
		.chat-send{
			margin: 12rpx 48rpx;
			
			flex: 1;
			width: 100%;
			min-height:40rpx;
			background:rgba(242,242,242,1);
			border-radius:24rpx;
			font-size:28rpx;
			color:rgba(25,29,35,1);
			line-height:40rpx;
			padding: 24rpx 80rpx 24rpx 24rpx;
		}
		image{
			width: 48rpx;
			height: 48rpx;
			position: absolute;
			right: 68rpx;
			top: 32rpx;
		}
	}
	.modify{
		position: fixed;
		overflow: hidden;
		left: 0;
		bottom:-90%;
		width: 100%;
		height: 90%;
		z-index: 1000;
		background: #fff;
		border-radius:48rpx 48rpx 0px 0px;
	}
	.u-name{
		position: absolute;
		top: 0;
		background-color: #fff;
		height: 80rpx;
		text-align: center;
		width: 100%;
		line-height: 80rpx;
	}
	.modfiy-mian{
		padding: 88rpx 28rpx 120rpx;
		box-sizing: border-box;
		height: 100%;
	}
	.bg{
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999;
		background-color: rgba(0,0,0,0.4);
	}
</style>
