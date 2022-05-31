<template>
<uni-title :align="'center'" type="h1" :title="'您已预约'+formatTime(reservation.time)+' '+reservation.num+'位'">
</uni-title>
</template>

<script setup lang="ts">
import { defineProps} from 'vue'
import { Reservation } from '../../pages/index/reservation';
defineProps<{reservation:Reservation}>()

const formatTime = (time:Date)=>{
    let str = time.getHours()+":"+time.getMinutes().toString().padStart(2,'0')
    str += str.endsWith('00')?'整':'分'
    return str
}
</script>

<style>

</style>