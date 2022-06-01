<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { code2OpenID, exists } from "./pages/index/api";
onLaunch(() => {
  console.log("App Launch");
  uni.getStorage({
    key: 'openid',
    success: function (res) {
      if(res.data!=''){
        console.log('读取本地openid')
        // uni.$emit('openid',res.data)    
      }
      else
        getOpenID()
    },
    fail:()=>{
      getOpenID()
    }
  })
});
onShow(() => {
});
onHide(() => {
});

const getOpenID = ()=>{
  console.log('读取新的openid')
   uni.login({
  provider: 'weixin',
  success: async function (loginRes) {
    
    const result = await code2OpenID(loginRes.code)
    
    uni.setStorage({
      'key':'openid',data:result
    })

    uni.$emit('openid',result) 
     
    //  uni.setStorage({
    //   'key':'exists',data: await exists(result)
    // })
  },
  fail:(result)=>{
    console.error(result)
  }})
}
</script>
<style></style>
