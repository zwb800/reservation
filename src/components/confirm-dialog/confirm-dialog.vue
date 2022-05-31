

<template>
<uni-popup ref="popup" type="dialog">
	<uni-popup-dialog title="请选择人数" :duration="2000" @close="close" @confirm="confirm" :before-close="true">
    <view class="btns">
        <template v-for="b in btns"  :key="b">
        <button v-if="selectNum==b" type="primary">
        {{b}}
        </button>
        <button v-else @click="select(b)">{{b}}</button>
        </template>
    </view>
       
        
    </uni-popup-dialog>
</uni-popup>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
const popup = ref()
const selectNum = ref(1)
const btns = ref<Number[]>([])

const props = defineProps({
    modelValue:Boolean,
    available:{type:Number,required:true},
})

const emit = defineEmits([ 'update:modelValue','confirm'])

watch(()=>props.modelValue,()=>{
    if(props.modelValue){
        popup.value.open()
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
button{
    margin-right:5rpx;
    margin-left: 0;
}
</style>