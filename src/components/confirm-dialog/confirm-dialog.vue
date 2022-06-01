

<template>
<uni-popup ref="popup" type="dialog">
    <!-- <uni-popup-dialog mode="base" message="成功消息" :duration="2000" :before-close="true" @close="close" @confirm="confirm"></uni-popup-dialog> -->
    	<view class="uni-popup-dialog">
		<view class="uni-dialog-title">
			<text class="uni-dialog-title-text uni-popup__base">请选择人数</text>
		</view>
		<view class="uni-dialog-content">
				    <view class="btns">
                <template v-for="b in btns"  :key="b">
                <button v-if="selectNum==b" type="primary">{{b}}</button>
                <button v-else @click="select(b)">{{b}}</button>
                </template>
            </view>
		</view>

		<view class="uni-dialog-button-group">
			<view class="uni-dialog-button" @click="close">
				<text class="uni-dialog-button-text">取消</text>
			</view>
			<button v-if="exists" class="uni-dialog-button uni-border-left confirm-button" @click="confirm">
				<text class="uni-dialog-button-text uni-button-color">确认</text>
			</button>
            <button v-else open-type="getPhoneNumber" class="uni-dialog-button uni-border-left confirm-button" @getphonenumber="getPhone">
				<text class="uni-dialog-button-text uni-button-color">确认</text>
			</button>
		</view>

	</view>
	<!-- <uni-popup-message title="请选择人数" :duration="2000" @close="close" @confirm="confirm" :before-close="true">
    <view class="btns">
        <template v-for="b in btns"  :key="b">
        <button v-if="selectNum==b" type="primary">{{b}}</button>
        <button v-else @click="select(b)">{{b}}</button>
        </template>
    </view>
    <view>
        <button @click="close">取消</button>
        <button @click="confirm">确认</button>
    </view>
       
        
    </uni-popup-message> -->
</uni-popup>
</template>

<script setup lang="ts">
import {  ref, watch } from "vue";
import { code2Phone } from "../../pages/index/api";
const popup = ref()
const selectNum = ref(1)
const btns = ref<Number[]>([])
const exists = ref(false)

const props = defineProps({
    modelValue:Boolean,
    available:{type:Number,required:true},
})

const emit = defineEmits([ 'update:modelValue','confirm'])

watch(()=>props.modelValue,()=>{
    if(props.modelValue){
        popup.value.open()
        uni.getStorage({
            key:'exists',
            success:(res)=>{
                exists.value = res.data!=''
            }
        })
    }
    else{
        popup.value.close()
    }
})

watch(()=>props.available,()=>{
    const arr = []
    selectNum.value = 1
    for(let i=1;i<=props.available;i++){
        arr.push(i)
    }
    btns.value = arr
})

const close = ()=>{
    popup.value.close()
    emit('update:modelValue',false)
}

const select = (n:number)=>{
    selectNum.value = n
}
const getPhone = async (encryptPhone:{detail:{code:string}})=>{

    if(encryptPhone.detail.code){
        uni.getStorage({
            key:'openid',
            success:async (res)=>{
                
                const result = await code2Phone(encryptPhone.detail.code,res.data) 
                uni.setStorage({
                    key:'exists',
                    data:result
                })
                confirm()
            }
        })
    }
}

const confirm = ()=>{
    close()
    emit('confirm',selectNum.value)
}
</script>

<style>
.btns{
    display:flex;
    width:100%;
    justify-content:space-evenly;
}
.btns > button{
    margin-right:5rpx;
    margin-left: 0;
}
.confirm-button{
    background:transparent;
    padding:0;
}
.confirm-button::after{
    border:none;
}
.uni-popup-dialog {
		width: 300px;
		border-radius: 11px;
		background-color: #fff;
	}

	.uni-dialog-title {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		padding-top: 25px;
	}

	.uni-dialog-title-text {
		font-size: 16px;
		font-weight: 500;
	}

	.uni-dialog-content {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 20px;
	}

	.uni-dialog-content-text {
		font-size: 14px;
		color: #6C6C6C;
	}

	.uni-dialog-button-group {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		border-top-color: #f5f5f5;
		border-top-style: solid;
		border-top-width: 1px;
	}

	.uni-dialog-button {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */

		flex: 1;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		height: 45px;
	}

	.uni-border-left {
		border-left-color: #f0f0f0;
		border-left-style: solid;
		border-left-width: 1px;
	}

	.uni-dialog-button-text {
		font-size: 16px;
		color: #333;
	}

	.uni-button-color {
		color: #007aff;
	}

	.uni-dialog-input {
		flex: 1;
		font-size: 14px;
		border: 1px #eee solid;
		height: 40px;
		padding: 0 10px;
		border-radius: 5px;
		color: #555;
	}

	.uni-popup__success {
		color: #4cd964;
	}

	.uni-popup__warn {
		color: #f0ad4e;
	}

	.uni-popup__error {
		color: #dd524d;
	}

	.uni-popup__info {
		color: #909399;
	}
</style>