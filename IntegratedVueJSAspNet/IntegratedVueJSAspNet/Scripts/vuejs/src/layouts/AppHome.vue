<template>
    <div>
        <Navbar/>
        <router-view :key="$route.fullPath"></router-view>
    </div>
</template>

<script>
import Navbar from '../components/Navbar'

export default {
    components: {Navbar}
}
</script>
