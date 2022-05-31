<template>
	<uni-notice-bar show-icon scrollable :speed="50"
				text="预约系统上线啦，试运行期间仅支持荣庆店，预约过程中遇到问题请联系微信客服或技术支持电话:15311508135" />
  <view class="content">
    <template v-if="reservation.num==0">
      
      <view class="flex">
        <view class="item" v-for="h,index in hours" :key="index">
        <uni-card padding="0" spacing="0">
          <view class="label gray" v-if="isOccp(h) == 0" @click="unAvailible">
                      {{h.label}}
          </view>
          <view  v-else  @click="chooseTime(h)">
              <view  v-if="isOccp(h)==maxNum" class="green label">
          {{h.label}}
            </view>
          
            <view  v-else class="yellow label">
          {{h.label}}
            </view>
          </view>

            
        </uni-card>
        </view>
      
      </view>
    </template>
    <template v-else>
      <reservation-info :reservation="reservation"></reservation-info>
      <button @click="cancel" type="primary">取消</button>
    </template>
    <confirm-dialog  v-model="showDialog" :available="availableNum" @confirm="confirm"></confirm-dialog>

  </view>
 
</template>

<script setup lang="ts">

import { onMounted, ref, watch } from 'vue'
import { Reservation } from './reservation';

const maxNum = 2



const showDialog = ref(false)
const availableNum = ref(0)
const reservation = ref<Reservation>({time:new Date(0),num:0,label:''})

const hours = ref(new Array<Reservation>())

const dateToday = new Date()
const dateStr = dateToday.getFullYear()+"-"+dateToday.getMonth()+"-"+dateToday.getDate()

const reservations = [
  {time:new Date(dateStr+' 10:00'),num:1},
  {time:new Date(dateStr+' 12:00'),num:1},
  {time:new Date(dateStr+' 13:30'),num:2},
]

const isOccp = (t:Reservation)=>{
  let result = t.num
  const tBegin = t.time
  const tEnd = new Date(tBegin.getTime() + 90*60*1000)
  
  for (const r of reservations) {
    const beginDate = r.time
    const endDate = new Date(beginDate.getTime()+90*60*1000)

    if((tBegin >= beginDate && tBegin < endDate) ||
      ( tEnd > beginDate && tEnd < endDate )){
      result-=r.num
      if(result <=0){
        result = 0
        break
      }
    }
  }

  return result
}

const beginHour = 10
const endHour = 21
const minuteStep = 30

for(let i=beginHour;i<endHour;i++){
  for(let minute = 0;minute<60;minute+=minuteStep){
    const time = new Date( dateStr+" "+i+":"+minute)
    hours.value.push({
      label:time.getHours()+":"+time.getMinutes().toString().padStart(2,'0'),
      time,num:maxNum})
  }
}

onMounted(()=>{
  // reservation.value = 
})

const chooseTime = (t:Reservation)=>{
  reservation.value.time = t.time
  availableNum.value = isOccp(t)
  showDialog.value =true
}

const confirm = (n:number)=>{

  reservation.value.num = n
}
const unAvailible = ()=>{
  uni.showToast({
    title:'此时间已有约',
    icon:'error',
  })
}

const cancel = ()=>{
  uni.showModal({
    title:'确定取消预约吗？',
    success:(res)=>{
      if(res.confirm){
        uni.showToast({
              title:'预约已取消',
              success:()=>{
                reservation.value.num = 0
              }
            })
        
      }
    
    }
  })


}
</script>

<style lang="scss">
.content{
  padding:10rpx;
}
.flex{
  display:flex;
  flex-wrap:wrap;
  justify-content: center;
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
.yellow{
  background:$uni-color-warning
}
.gray{
  background:$uni-text-color-grey
}
</style>
