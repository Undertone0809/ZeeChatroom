<template>
	<view class="content">
		<view class="title">欢迎进入lzn的聊天室</view>
		<view class="head" @click="modify">
			<image :src="'../../static/images/'+nowimg+'.png'" mode="aspectFill" class="head-img"></image>
			<image src="../../static/down.png" mode="aspectFit" class="down"></image>
		</view>
		<input type="text" class="user" placeholder="请输入你的昵称" v-model="name" placeholder-style="color:#999;font-weight:400;font-size:32rpx"/>
		<view class="join" @tap="submit">加入</view>
		
		<view class="modify" :animation="animationData">
			
			<view class="modfiy-mian">
				<view v-for="(e,index) in img" :key="index" class="us-img" @tap="selected(index)">
					<image :src="'../../static/images/'+e.i+'.png'" mode="aspectFit"></image>	
					<view class="dd">
						<view class="ddd" :style="{opacity:e.x}"></view>
					</view>
				</view>
			</view>
		</view>
		<view class="bg" @tap="modify" :style="{display:bg}"></view>
		
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name:'',
				nowimg:'a',
				animationData: {},
				bb:false,
				bg:'none',
				img:[
					{i:'a',x:1},
					{i:'b',x:0},
					{i:'c',x:0},
					{i:'d',x:0},
					{i:'e',x:0},
					{i:'f',x:0},
					{i:'g',x:0},
					{i:'h',x:0},
					{i:'i',x:0},
					{i:'j',x:0},
					{i:'k',x:0},
					{i:'l',x:0},
					{i:'m',x:0},
					{i:'n',x:0},
					{i:'o',x:0},
					{i:'p',x:0},
					{i:'q',x:0},
					{i:'r',x:0},
					{i:'s',x:0},
					{i:'t',x:0},
				],
			}
		},
		onLoad() {

		},
		methods: {
			modify: function(){
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
			selected: function(index){
				for(let i = 0;i<this.img.length;i++){
					this.img[i].x = 0;
				}
				this.img[index].x = 1;
				this.nowimg = this.img[index].i;
			},
			submit: function(){
				if(this.name.length>0){
					var mesg = {
						name:this.name,
						img: this.nowimg,
					}
					uni.navigateTo({
					    url: '../chatroom/chatroom?name='+this.name+'&img='+this.nowimg,
					});
				}
			},
		}
	}
</script>

<style lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-top: 200rpx;
	}

	.title {
		font-size:36rpx;
		font-weight:600;
		color:rgba(52, 152, 219,1);
		line-height:50rpx;
		padding-bottom: 116rpx;
	}
	.head{
		width: 144rpx;
		height: 144rpx;
		position: relative;
		.head-img{
			width: 144rpx;
			height: 144rpx;
			border-radius: 50%;
		}
		.down{
			position: absolute;
			opacity: 0.6;
			right: -48rpx;
			top: 48rpx;
			width: 48rpx;
			height: 48rpx;
		}
	}
	.user{
		margin-top: 54rpx;
		padding: 0 24rpx;
		width:440rpx;
		height:96rpx;
		background:rgba(242,242,242,1);
		border-radius:24rpx;
		text-align: center;
		font-size: 36rpx;
		font-weight:600;
		color:rgba(25,29,35,1);
	}
	.join{
		margin-top: 180rpx;
		width:200rpx;
		height:200rpx;
		background:rgba(52, 152, 219,1);
		box-shadow:0px 36rpx 68rpx -8rpx rgba(52, 152, 219,1);
		border-radius: 50%;
		font-size:28rpx;
		font-weight:600;
		text-align: center;
		line-height: 200rpx;
		color:rgba(255,255,255,1);
	}
	.modify{
		position: fixed;
		left: 0;
		bottom:-800rpx;
		width: 100%;
		height: 800rpx;
		z-index: 1000;
		background: #fff;
		border-radius:48rpx 48rpx 0px 0px;
	}
	.modfiy-mian{
		padding: 80rpx 36rpx;
		flex-direction: row;
		display: flex;
		flex-wrap:wrap;
		.us-img{
			flex: auto;
			width: 20%;
			text-align: center;
			image{
				width:80rpx;
				height:80rpx;
				border-radius:18rpx;
			}
			.ddd{
				display: inline-block;
				justify-content:center;
				margin-bottom: 40rpx;
				width: 16rpx;
				height: 16rpx;
				background:rgba(255,131,60,1);
				border-radius: 50%;
			}
		}
	}
	.bg{
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background-color: rgba(0,0,0,0.4);
	}
</style>
