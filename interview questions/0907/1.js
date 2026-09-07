//1.ref/reactive
<script setup>
import { ref, reactive, toRefs } from 'vue'

// ref
const show = ref(false)

// reactive  不能整体重新赋值
const form = reactive({
  username: '',
  password: ''
})

//解构导出，保留响应式
const { username, password } = toRefs(form)

const toggle = () => {
  show.value = !show.value
  username.value = 'test'
}
</script>

<template>
  <div v-if="show">
    <input v-model="username" />
    <input v-model="password" />
  </div>
  <button @click="toggle">切换</button>
</template>


//proxy不能代理原始值，所以ref包一层.value对象

//2.vue3组件通信

（1）父子通信

父
<template>  
    <child :msg="parentMsg" @change="handleChange"/>
</template>
<script setup>
const parentMsg = ref('')
const handleChange = (val) => {
  console.log('子传过来', val)
}
</script>

子
<template>
  <div>{{ props.msg }}</div>
  <button @click="send">向父传值</button>
</template>
<script setup> 
const props=defineProps({
    msg:string
})
const emit=defineEmits("change")
const send = ()=>{
    emit('change',"子组件数据")
}
</script>

（2）provide /inject 跨层级通信（爷‑孙）

（3）pinia状态管理
state actions getters

（4）mitt事件总线，简单的事件通知


//3.插槽
默认插槽
具名插槽
作用域插槽 #default="scope"






