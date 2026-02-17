<template>
    <div class="container">
        <div class="lantern-box" v-for="(value, index) in fonts" :key="index">
            <div class="lantern-light">
                <div class="lantern-line"></div>
                <div class="lantern-circle">
                    <div class="lantern-rect">
                        <div class="lantern-text">{{ value }}</div>
                    </div>
                </div>
                <div class="lantern-tassel-top">
                    <div class="lantern-tassel-middle"></div>
                    <div class="lantern-tassel-bottom"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const fonts = ["新", "年", "快", "乐"];
</script>

<style lang="css" scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    z-index: -1;
}

/* 容器基础样式 */
.container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: visible;
}

.lantern-box {
    position: fixed;
    pointer-events: none;
    z-index: 100; /* 确保灯笼在最上层 */
}

/* 灯笼主体 - 恢复原有视觉效果 */
.lantern-light {
    position: relative;
    width: 120px;
    height: 90px;
    background-color: #d8000f;
    border-radius: 50%;
    box-shadow: -5px 5px 50px 4px #fa6c00;
    animation: swing 3s infinite ease-in-out;
    background-size: cover;
    margin: 0; /* 移除margin避免错位 */
}

/* 灯笼上下边框 */
.lantern-light::before,
.lantern-light::after {
    content: "";
    position: absolute;
    border: 1px solid #dc8f03;
    width: 60px;
    height: 12px;
    background: linear-gradient(
        to right,
        #dc8f03,
        #ffa500,
        #dc8f03,
        #ffa500,
        #dc8f03
    );
    left: 30px; /* 精准定位 */
    margin: 0;
}

.lantern-light::before {
    top: -7px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
}

.lantern-light::after {
    bottom: -7px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
}

/* 灯笼挂线 */
.lantern-line {
    width: 2px;
    height: 50px;
    background-color: #dc8f03;
    position: absolute;
    top: -50px;
    left: 59px; /* 精准居中 */
}

/* 灯笼内层圆环和矩形 */
.lantern-circle {
    width: 100px;
    height: 90px;
    border-radius: 50%;
    border: 2px solid #dc8f03;
    background-color: rgba(216, 0, 15, 0.1);
    position: absolute;
    top: 0;
    left: 10px; /* 精准定位 */
}

.lantern-rect {
    width: 45px;
    height: 90px;
    border-radius: 50%;
    border: 2px solid #dc8f03;
    background-color: rgba(216, 0, 15, 0.1);
    position: absolute;
    top: -2px;
    left: 26px; /* 精准定位 */
}

/* 灯笼文字 */
.lantern-text {
    font:
        bold 2rem / 85px "Franklin Gothic Medium",
        "Arial Narrow",
        Arial,
        sans-serif;
    text-align: center;
    color: #dc8f03;
    position: relative;
    z-index: 1;
}

/* 灯笼流苏 */
.lantern-tassel-top {
    width: 5px;
    height: 20px;
    background-color: #ffa500;
    border-radius: 0 0 5px 5px;
    position: absolute;
    top: 90px;
    left: 58px; /* 精准居中 */
    animation: swing 3s infinite ease-in-out;
    margin: 0; /* 移除margin */
}

.lantern-tassel-middle {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #dc8f03;
    top: 14px;
    left: -2px;
    z-index: 2;
}

.lantern-tassel-bottom {
    position: absolute;
    width: 10px;
    height: 35px;
    background-color: #ffa500;
    border-bottom-left-radius: 5px;
    top: 18px;
    left: -2px;
    z-index: 1;
}

/* 摇摆动画 - 修复transform叠加问题 */
@keyframes swing {
    0% {
        transform: rotate(-10deg);
        transform-origin: top center; /* 以顶部为旋转中心 */
    }
    50% {
        transform: rotate(10deg);
        transform-origin: top center;
    }
    100% {
        transform: rotate(-10deg);
        transform-origin: top center;
    }
}

/* 大屏布局（默认）- 恢复原有位置 */
.container .lantern-box:nth-child(1) {
    left: 10px;
    top: 30px; /* 调整top值避免超出屏幕 */
}
.container .lantern-box:nth-child(2) {
    left: 160px;
    top: 25px;
}
.container .lantern-box:nth-child(3) {
    right: 160px;
    top: 28px;
}
.container .lantern-box:nth-child(4) {
    right: 10px;
    top: 26px;
}

/* 移动端适配 - 等比缩放+位置调整 */
@media (max-width: 768px) {
    .lantern-box {
        transform: scale(0.8); /* 整体缩放，保持比例 */
        transform-origin: center top;
    }
    .container .lantern-box:nth-child(1) {
        left: 2vw;
        top: 20px;
    }
    .container .lantern-box:nth-child(2) {
        left: calc(20vw + 10px);
        top: 15px;
    }
    .container .lantern-box:nth-child(3) {
        right: calc(20vw + 10px);
        top: 18px;
    }
    .container .lantern-box:nth-child(4) {
        right: 2vw;
        top: 16px;
    }
}

/* 小屏手机适配 (小于480px) */
@media (max-width: 480px) {
    .lantern-box {
        transform: scale(0.7);
    }
    .container .lantern-box:nth-child(2) {
        left: calc(18vw + 5px);
    }
    .container .lantern-box:nth-child(3) {
        right: calc(18vw + 5px);
    }
}
</style>
