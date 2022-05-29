<template>
  <view class="content">
    <view>请选择预约时间 {{selectedTime}}</view>
    <view @click="chooseTime(h.date)" v-for="h in hours" :key="h">
    {{h.label}}
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Time {
  label:string
  date:Date
}

const selectedTime = ref(new Date())
const hours = ref(new Array<Time>())

const dateToday = new Date()
const dateStr = dateToday.getFullYear()+"-"+dateToday.getMonth()+"-"+dateToday.getDate()
for(let i=10;i<21;i++){
  for(let minute = 0;minute<31;minute+=30){
    const date = new Date( dateStr+" "+i+":"+minute)
    hours.value.push({label:date.getHours()+":"+date.getMinutes().toString().padStart(2,'0'),date})
  }
  
}

const chooseTime = (date:Date)=>{
  selectedTime.value = date
}
</script>

<style>
</style>
