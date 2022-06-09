
<template>

<view class="flex">
  <view @click="toTimePage(s.id)" class=" item" v-for="s in shops" :key="s.id">
    <uni-card padding="0" spacing="0">
        <view  class="green label"> {{s.name}}</view>
       </uni-card>
  </view>
  </view>
</template>

<script lang="ts" setup> 
import { ref } from "vue"

const shops = ref([{id:'1',name:'荣庆店'},{id:'2',name:'新东方店'}])

const toTimePage = (shopId:string)=>{
    uni.navigateTo({
        url:'time?shopId='+shopId
    })
}
</script>
<style lang="scss">
page{
    height:100%;
}
.flex{
    height:100%;
  display:flex;
  flex-wrap:wrap;
  justify-content: center;
  align-items: center;
}
.item{
  width:50%;
  text-align: center;
}
.label{
  padding:40rpx;
  color:white;
  font-size:$uni-font-size-lg
}


.green{
  background:$uni-color-success
}
</style>