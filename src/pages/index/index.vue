<template>
	<uni-notice-bar show-icon :speed="50"
				text="预约系统试运行期间仅支持荣庆店，迟到15分钟将自动取消，如问题请联系微信客服或技术支持电话:15311508135" />
  <view class="content">
    <template v-if="reservation.num==0">
     
      <view class="flex" v-if="hours.length>0">
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
      <uni-title v-else align="center" type="h1" title="本店已打烊，请在工作时间预约"></uni-title>
    </template>
    <template v-else>
      <reservation-info :reservation="reservation"></reservation-info>
      <button @click="cancel" type="primary">取消</button>
    </template>
    <confirm-dialog  v-model="showDialog" :available="availableNum" @confirm="confirm"></confirm-dialog>

  </view>
 
</template>

<script setup lang="ts">

import { onLoad, onShow } from '@dcloudio/uni-app';
import { ref } from 'vue'
import { addReservation, cancelReservation, getAvailableReservation, getReservation, getReservationByOpenID } from './api';
import { Reservation } from './reservation';

interface ReservationView {
  label:string,
  time:Date,
  num:number
}

let openid = ''
let shopId = '1'
let debug = false

const showDialog = ref(false)
const availableNum = ref(0)
const reservation = ref<Reservation>({time:new Date(0),num:0,shopId})

const hours = ref(new Array<ReservationView>())

const dateToday = new Date()
const dateStr = dateToday.getFullYear()+"-"+(dateToday.getMonth()+1)+"-"+dateToday.getDate()

let reservations = new Array<Reservation>()

const isOccp = (t:ReservationView)=>{
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

const maxNum = 2

const loadData = async()=>{
  if(openid == '')
  return
  uni.showLoading({title:'加载中',mask:true})
  reservations = await getReservation(shopId)
  const rResult = await getReservationByOpenID(openid)
  if(rResult.length>0){
    reservation.value = rResult[0]
  }
  else
    reservation.value = {time:new Date(0),num:0,shopId}

  const result = await getAvailableReservation()
  
  const arr = new Array<ReservationView>()
  const now = new Date()
  for (const r of result) {
    const time = new Date(dateStr+' '+r.time)
    if(time > now || debug){
      arr.push({time,num:r.num,label:time.getHours()+":"+time.getMinutes().toString().padStart(2,'0')})
    }
     
  }
  hours.value = arr
  uni.hideLoading()
}

onLoad((option)=>{
  if(option.shopId)
    shopId = option.shopId
  if(option.debug)
    debug = true

   uni.getStorage({
    key:'openid',
    success:(res)=>{
      if(res.data!=''){
        openid = res.data
        loadData()
      }
    },
    fail:()=>{
      uni.$on('openid',(o)=>{
        
        openid = o
        loadData()
      })
    }
  })
})
onShow(loadData)

const chooseTime = (t:ReservationView)=>{
  reservation.value.time = t.time
  availableNum.value = isOccp(t)
  showDialog.value =true
}

const confirm = async (n:number)=>{

  reservation.value.num = n
  await addReservation(openid,reservation.value)
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
    success:async (res)=>{
      if(res.confirm){
        const result = await cancelReservation(openid)
        if(result.updated>0){
            uni.showToast({
              title:'预约已取消',
              success:()=>{
                loadData()
              }
            })
        }
        else{
          uni.showToast({
              title:'操作失败 ',
              icon:'error'
            })
        }
        
        
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

function hook(hook: any) {
  throw new Error('Function not implemented.');
}
